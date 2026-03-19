"use client"

import { useState } from "react"
import { AlertCircle, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n"

type NutritionFormState = {
  heightCm: string
  weightKg: string
  age: string
  goal: string
  activityLevel: "low" | "medium" | "high"
  dietaryPreference: string
  allergies: string
  mealsPerDay: string
}

const defaultForm: NutritionFormState = {
  heightCm: "170",
  weightKg: "68",
  age: "",
  goal: "",
  activityLevel: "medium",
  dietaryPreference: "",
  allergies: "",
  mealsPerDay: "4",
}

export default function AIPage() {
  const { language, t } = useI18n()
  const [form, setForm] = useState<NutritionFormState>(defaultForm)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [isMock, setIsMock] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof NutritionFormState>(key: K, value: NutritionFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/nutrition-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heightCm: Number(form.heightCm),
          weightKg: Number(form.weightKg),
          age: form.age ? Number(form.age) : null,
          goal: form.goal,
          activityLevel: form.activityLevel,
          dietaryPreference: form.dietaryPreference,
          allergies: form.allergies,
          mealsPerDay: Number(form.mealsPerDay),
          language,
        }),
      })

      const payload = (await response.json()) as { error?: string; plan?: string; mock?: boolean }

      if (!response.ok || !payload.plan) {
        setError(payload.error ?? t("ai.error.default"))
        setResult("")
        setIsMock(false)
        return
      }

      setResult(payload.plan)
      setIsMock(Boolean(payload.mock))
    } catch {
      setError(t("ai.error.default"))
      setResult("")
      setIsMock(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-8 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/15 p-3">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-100">
              {t("ai.badge")}
            </p>
            <h1 className="text-3xl font-bold">{t("ai.title")}</h1>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-orange-50">{t("ai.subtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                {t("ai.form.height")}
                <input
                  type="number"
                  min={90}
                  max={250}
                  value={form.heightCm}
                  onChange={(e) => update("heightCm", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                {t("ai.form.weight")}
                <input
                  type="number"
                  min={20}
                  max={350}
                  value={form.weightKg}
                  onChange={(e) => update("weightKg", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                {t("ai.form.age")}
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={form.age}
                  onChange={(e) => update("age", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                {t("ai.form.meals")}
                <input
                  type="number"
                  min={2}
                  max={6}
                  value={form.mealsPerDay}
                  onChange={(e) => update("mealsPerDay", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
            </div>

            <label className="text-sm font-medium text-gray-700">
              {t("ai.form.goal")}
              <textarea
                value={form.goal}
                onChange={(e) => update("goal", e.target.value)}
                rows={4}
                placeholder={t("ai.form.goalPlaceholder")}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                {t("ai.form.activity")}
                <select
                  value={form.activityLevel}
                  onChange={(e) => update("activityLevel", e.target.value as NutritionFormState["activityLevel"])}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                >
                  <option value="low">{t("ai.activity.low")}</option>
                  <option value="medium">{t("ai.activity.medium")}</option>
                  <option value="high">{t("ai.activity.high")}</option>
                </select>
              </label>

              <label className="text-sm font-medium text-gray-700">
                {t("ai.form.preference")}
                <input
                  value={form.dietaryPreference}
                  onChange={(e) => update("dietaryPreference", e.target.value)}
                  placeholder={t("ai.form.preferencePlaceholder")}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
            </div>

            <label className="text-sm font-medium text-gray-700">
              {t("ai.form.allergies")}
              <input
                value={form.allergies}
                onChange={(e) => update("allergies", e.target.value)}
                placeholder={t("ai.form.allergiesPlaceholder")}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>

            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
              {t("ai.disclaimer")}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                loading ? "cursor-wait bg-orange-300 text-white" : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {loading ? t("ai.form.loading") : t("ai.form.submit")}
            </button>
          </form>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">{t("ai.result.title")}</h2>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {!error && !result && (
              <p className="mt-4 text-sm text-gray-500">{t("ai.result.empty")}</p>
            )}

            {result && (
              <>
                {isMock && (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                    {t("ai.result.mock")}
                  </div>
                )}
                <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                  {result}
                </div>
              </>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}