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

function isMockModeEnabled() {
  const value = (process.env.USE_AI_MOCK ?? "").trim().toLowerCase()
  return value === "1" || value === "true" || value === "yes" || value === "on"
}

function buildMockPlan(input: NutritionPlanInput) {
  const meals = Math.max(2, Math.min(6, input.mealsPerDay))
  const activityLabel =
    input.activityLevel === "high"
      ? "alta"
      : input.activityLevel === "low"
        ? "baja"
        : "media"

  if (input.language === "en") {
    return `Demo mode (mockup): this nutrition plan was generated without connecting to OpenAI.

1. Safety note
Keep your goal realistic and avoid extreme restrictions.

2. Personalized objective
Focus on ${input.goal} with consistent eating habits and sustainable portions.

3. Daily meal structure
Plan ${meals} meals per day with protein, fiber-rich carbs, vegetables, and healthy fats in each main meal.

4. One-day sample menu
- Breakfast: oatmeal, fruit, and yogurt.
- Lunch: grilled chicken (or legumes), rice, salad, and avocado.
- Snack: nuts (if tolerated) or fruit with cheese.
- Dinner: fish/tofu, baked potato, and sauteed vegetables.

5. Grocery list
Oats, eggs/legumes, chicken/fish/tofu, rice/potatoes, leafy greens, fruit, olive oil, yogurt.

6. Habits and hydration
Drink 6-8 glasses of water, sleep 7-8 hours, and adjust portions according to your activity level (${input.activityLevel}).

7. Professional advice
If you have medical conditions, severe allergies, or are under 18, consult a licensed nutrition professional.`
  }

  if (input.language === "fr") {
    return `Mode démo (mockup) : ce plan nutritionnel a été généré sans connexion à OpenAI.

1. Note de sécurité
Gardez un objectif réaliste et évitez les restrictions extrêmes.

2. Objectif personnalisé
Travaillez sur : ${input.goal}, avec des habitudes régulières et des portions durables.

3. Structure des repas
Prévoyez ${meals} repas par jour avec protéines, glucides complets, légumes et bonnes graisses.

4. Exemple de menu sur 1 jour
- Petit-déjeuner : flocons d'avoine, fruit et yaourt.
- Déjeuner : poulet grillé (ou légumineuses), riz, salade et avocat.
- Collation : fruits secs (si tolérés) ou fruit et fromage.
- Diner : poisson/tofu, pomme de terre au four et légumes sautés.

5. Liste de courses
Avoine, oeufs/légumineuses, poulet/poisson/tofu, riz/pommes de terre, légumes verts, fruits, huile d'olive, yaourt.

6. Hydratation et habitudes
Buvez 6-8 verres d'eau, dormez 7-8 heures, et ajustez les portions selon votre niveau d'activité (${input.activityLevel}).

7. Conseil professionnel
En cas de condition médicale, d'allergies sévères ou si vous avez moins de 18 ans, consultez un professionnel de la nutrition.`
  }

  return `Modo demo (mockup): este plan nutricional fue generado sin conectar con OpenAI.

1. Nota de seguridad
Mantén un objetivo realista y evita restricciones extremas.

2. Objetivo personalizado
Enfócate en ${input.goal} con hábitos consistentes y porciones sostenibles.

3. Estructura diaria de comidas
Organiza ${meals} comidas al día con proteína, carbohidratos de buena calidad, vegetales y grasas saludables.

4. Menú ejemplo de 1 día
- Desayuno: avena, fruta y yogur.
- Almuerzo: pollo a la plancha (o legumbres), arroz, ensalada y aguacate.
- Merienda: frutos secos (si los toleras) o fruta con queso.
- Cena: pescado/tofu, papa al horno y vegetales salteados.

5. Lista de compras
Avena, huevos/legumbres, pollo/pescado/tofu, arroz/papas, hojas verdes, frutas, aceite de oliva, yogur.

6. Hidratación y hábitos
Bebe 6-8 vasos de agua, duerme 7-8 horas y ajusta porciones según tu actividad ${activityLabel}.

7. Cuándo buscar ayuda profesional
Si tienes condiciones médicas, alergias severas o eres menor de edad, consulta a un nutricionista.`
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
    const mockMode = isMockModeEnabled()

    if (mockMode) {
      return NextResponse.json({ plan: buildMockPlan(validation.data), mock: true })
    }

    if (!apiKey) {
      return NextResponse.json({ plan: buildMockPlan(validation.data), mock: true })
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
      console.error("OpenAI error. Using mock plan fallback:", payload.error?.message)
      return NextResponse.json({ plan: buildMockPlan(validation.data), mock: true })
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

    return NextResponse.json({ plan, mock: false })
  } catch (error) {
    console.error("nutrition-plan-route", error)

    return NextResponse.json({ error: "No fue posible generar el plan nutricional." }, { status: 500 })
  }
}