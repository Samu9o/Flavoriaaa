import {
  buildNutritionPrompt,
  calculateBmi,
  isMinor,
  validateNutritionPlanInput,
} from "../lib/nutritionPlanner"

test("HU11 - valida correctamente una solicitud nutricional segura", () => {
  const result = validateNutritionPlanInput({
    heightCm: 172,
    weightKg: 68,
    goal: "Mejorar energía y comer de forma balanceada",
    activityLevel: "medium",
    mealsPerDay: 4,
    language: "es",
  })

  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.data.heightCm).toBe(172)
    expect(result.data.language).toBe("es")
  }
})

test("HU11 - rechaza objetivos extremos o de riesgo", () => {
  const result = validateNutritionPlanInput({
    heightCm: 170,
    weightKg: 60,
    goal: "Quiero dejar de comer para bajar rápido",
    activityLevel: "medium",
    mealsPerDay: 3,
    language: "es",
  })

  expect(result.ok).toBe(false)
  if (!result.ok) {
    expect(result.error).toContain("dietas extremas")
  }
})

test("HU11 - detecta cuando la persona es menor de edad", () => {
  expect(isMinor(16)).toBe(true)
  expect(isMinor(21)).toBe(false)
})

test("HU11 - construye un prompt con altura, peso y objetivo", () => {
  const prompt = buildNutritionPrompt({
    heightCm: 180,
    weightKg: 78,
    age: 25,
    goal: "Ganar masa muscular con comidas equilibradas",
    activityLevel: "high",
    dietaryPreference: "Alta proteína",
    allergies: "Ninguna",
    mealsPerDay: 5,
    language: "es",
  })

  expect(prompt).toContain("Height: 180 cm")
  expect(prompt).toContain("Weight: 78 kg")
  expect(prompt).toContain("Ganar masa muscular")
})

test("HU11 - calcula el IMC con un decimal", () => {
  expect(calculateBmi(170, 68)).toBe(23.5)
})
