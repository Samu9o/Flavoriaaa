import { NextResponse } from "next/server"
import {
  buildNutritionPrompt,
  NUTRITION_SYSTEM_PROMPT,
  validateNutritionPlanInput,
  type NutritionPlanInput,
} from "@/lib/nutritionPlanner"

export const runtime = "nodejs"

type OpenAIResponsePayload = {
  output?: Array<{
    type?: string
    role?: string
    content?: Array<{
      type?: string
      text?: string
    }>
  }>
  error?: {
    message?: string
  }
}

function extractOutputText(payload: OpenAIResponsePayload) {
  return (
    payload.output
      ?.flatMap((item) => (item.type === "message" ? item.content ?? [] : []))
      .filter((part) => part.type === "output_text")
      .map((part) => part.text ?? "")
      .join("\n")
      .trim() ?? ""
  )
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<NutritionPlanInput>
    const validation = validateNutritionPlanInput(body)

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "No se encontró OPENAI_API_KEY. Configura la variable de entorno antes de usar la sección de IA.",
        },
        { status: 503 },
      )
    }

    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        instructions: NUTRITION_SYSTEM_PROMPT,
        input: buildNutritionPrompt(validation.data),
      }),
      cache: "no-store",
    })

    const payload = (await apiResponse.json()) as OpenAIResponsePayload

    if (!apiResponse.ok) {
      return NextResponse.json(
        {
          error:
            payload.error?.message ??
            "No fue posible generar el plan nutricional.",
        },
        { status: apiResponse.status },
      )
    }

    const plan = extractOutputText(payload)

    if (!plan) {
      console.error(
        "OpenAI respondió sin texto utilizable:",
        JSON.stringify(payload, null, 2),
      )

      return NextResponse.json(
        { error: "No fue posible generar el plan nutricional." },
        { status: 502 },
      )
    }

    return NextResponse.json({ plan })
  } catch (error) {
    console.error("nutrition-plan-route", error)

    return NextResponse.json(
      { error: "No fue posible generar el plan nutricional." },
      { status: 500 },
    )
  }
}