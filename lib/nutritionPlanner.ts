import type { Language } from "@/lib/i18n"

export type NutritionPlanInput = {
  heightCm: number
  weightKg: number
  age?: number | null
  goal: string
  activityLevel: "low" | "medium" | "high"
  dietaryPreference?: string
  allergies?: string
  mealsPerDay: number
  language: Language
}

type ValidationSuccess = { ok: true; data: NutritionPlanInput }
type ValidationError = { ok: false; error: string }

const UNSAFE_GOAL_PATTERNS = [
  /starv/i,
  /purga/i,
  /vomit/i,
  /anorex/i,
  /bulimi/i,
  /extreme cut/i,
  /adelgazar demasiado/i,
  /dejar de comer/i,
  /pastillas? para bajar/i,
  /laxantes?/i,
]

export const NUTRITION_SYSTEM_PROMPT = `
You are a nutrition planning assistant for a food marketplace app.
Create a balanced, practical meal plan based on the user's inputs.
Do not suggest extreme dieting, purging, starvation, or unsafe weight-control behaviors.
Do not provide medical diagnoses or treatment plans.
If the person is under 18 or if the goal could be risky, shift to general healthy eating guidance without aggressive calorie restriction.
Always include:
1. A short safety note.
2. A realistic nutrition objective.
3. A suggested daily meal structure.
4. Example meals for one day.
5. A short shopping list.
6. Hydration and recovery habits.
Keep the tone supportive and concise.
`

export function validateNutritionPlanInput(raw: Partial<NutritionPlanInput>): ValidationSuccess | ValidationError {
  const heightCm = Number(raw.heightCm)
  const weightKg = Number(raw.weightKg)
  const mealsPerDay = Number(raw.mealsPerDay ?? 4)
  const goal = String(raw.goal ?? "").trim()
  const activityLevel = raw.activityLevel ?? "medium"
  const age = raw.age == null ? null : Number(raw.age)
  const dietaryPreference = String(raw.dietaryPreference ?? "").trim()
  const allergies = String(raw.allergies ?? "").trim()
  const language = raw.language ?? "es"

  if (!Number.isFinite(heightCm) || heightCm < 90 || heightCm > 250) {
    return { ok: false, error: "La altura debe estar entre 90 y 250 cm." }
  }

  if (!Number.isFinite(weightKg) || weightKg < 20 || weightKg > 350) {
    return { ok: false, error: "El peso debe estar entre 20 y 350 kg." }
  }

  if (age !== null && (!Number.isFinite(age) || age < 5 || age > 100)) {
    return { ok: false, error: "La edad debe estar entre 5 y 100 años." }
  }

  if (!goal) {
    return { ok: false, error: "Debes indicar un objetivo alimentario." }
  }

  if (UNSAFE_GOAL_PATTERNS.some((pattern) => pattern.test(goal))) {
    return {
      ok: false,
      error:
        "No se aceptan objetivos relacionados con dietas extremas o conductas de riesgo. Reformula el objetivo hacia salud, energía, rendimiento o alimentación balanceada.",
    }
  }

  if (!["low", "medium", "high"].includes(activityLevel)) {
    return { ok: false, error: "El nivel de actividad no es válido." }
  }

  if (!Number.isInteger(mealsPerDay) || mealsPerDay < 2 || mealsPerDay > 6) {
    return { ok: false, error: "Las comidas por día deben estar entre 2 y 6." }
  }

  return {
    ok: true,
    data: {
      heightCm,
      weightKg,
      age,
      goal,
      activityLevel,
      dietaryPreference,
      allergies,
      mealsPerDay,
      language,
    },
  }
}

export function getGoalLanguageInstruction(language: Language) {
  if (language === "en") return "Respond entirely in English."
  if (language === "fr") return "Réponds entièrement en français."
  return "Responde completamente en español."
}

export function isMinor(age?: number | null) {
  return typeof age === "number" && age < 18
}

export function calculateBmi(heightCm: number, weightKg: number) {
  const meters = heightCm / 100
  return Number((weightKg / (meters * meters)).toFixed(1))
}

export function buildNutritionPrompt(input: NutritionPlanInput) {
  const bmi = calculateBmi(input.heightCm, input.weightKg)
  const ageLabel = input.age ? `${input.age} years old` : "Age not provided"
  const preference = input.dietaryPreference || "No specific dietary preference"
  const allergies = input.allergies || "No declared allergies"
  const safetyMode = isMinor(input.age)
    ? "Use minor-safe guidance: avoid aggressive calorie targets and focus on balanced meals, energy, growth, and routine."
    : "Use adult-safe guidance with balanced habits and no extreme restrictions."

  return `
${getGoalLanguageInstruction(input.language)}
${safetyMode}
Create a practical nutrition plan using these details:
- Height: ${input.heightCm} cm
- Weight: ${input.weightKg} kg
- Approximate BMI: ${bmi}
- Age: ${ageLabel}
- Goal: ${input.goal}
- Activity level: ${input.activityLevel}
- Dietary preference: ${preference}
- Allergies or restrictions: ${allergies}
- Meals per day: ${input.mealsPerDay}

Format the response with these sections:
1. Safety note
2. Personalized objective
3. Recommended meal structure for the day
4. One-day example menu
5. Grocery list
6. Healthy habits and hydration
7. When to seek professional advice
`.trim()
}
