"use client"

import { useMemo, useState } from "react"
import { MapPinned, TrendingUp } from "lucide-react"
import { getLocaleForLanguage, useI18n } from "@/lib/i18n"
import { useUser } from "@/lib/userContext"

const MAP_WIDTH = 760
const MAP_HEIGHT = 500

export default function TendenciasPage() {
  const { topRestaurants, bogotaTrendPoints } = useUser()
  const { language, t } = useI18n()
  const locale = getLocaleForLanguage(language)
  const [selectedId, setSelectedId] = useState<string | null>(bogotaTrendPoints[0]?.restaurantId ?? null)

  const selected = useMemo(
    () => bogotaTrendPoints.find((point) => point.restaurantId === selectedId) ?? bogotaTrendPoints[0] ?? null,
    [bogotaTrendPoints, selectedId],
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
          <TrendingUp className="h-7 w-7 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{t("trends.title")}</h1>
        <p className="mt-2 text-gray-500">{t("trends.subtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t("trends.mapTitle")}</h2>
              <p className="text-sm text-gray-500">{t("trends.mapBody")}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-[#fff7f2] p-4">
            <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="h-full w-full">
              <path
                d="M205 40 L340 32 L470 55 L605 135 L672 235 L643 360 L575 452 L435 475 L308 450 L185 400 L105 312 L88 195 L132 104 Z"
                fill="#fde6d8"
                stroke="#f2b48f"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              <path d="M280 70 L248 170 L340 215 L410 130 L350 60 Z" fill="#f9d4bd" opacity="0.8" />
              <path d="M410 130 L340 215 L405 285 L505 235 L535 155 Z" fill="#f8c7a4" opacity="0.8" />
              <path d="M205 230 L308 220 L405 285 L360 392 L240 358 L160 290 Z" fill="#f7d9c6" opacity="0.85" />
              <path d="M405 285 L520 268 L570 365 L470 430 L360 392 Z" fill="#f4c09c" opacity="0.8" />
              <path d="M120 135 L205 120 L248 170 L205 230 L130 210 Z" fill="#fbe8db" opacity="0.9" />

              {bogotaTrendPoints.map((point) => {
                const isSelected = selected?.restaurantId === point.restaurantId
                return (
                  <g key={point.restaurantId} onClick={() => setSelectedId(point.restaurantId)} style={{ cursor: "pointer" }}>
                    <circle cx={point.x} cy={point.y} r={isSelected ? 16 : 12} fill="#f97316" opacity={0.22} />
                    <circle cx={point.x} cy={point.y} r={isSelected ? 9 : 7} fill="#ea580c" />
                    <text
                      x={point.x}
                      y={point.y - 18}
                      textAnchor="middle"
                      className="fill-gray-700 text-[11px] font-semibold"
                    >
                      {point.locality}
                    </text>
                  </g>
                )
              })}
            </svg>

            {selected && (
              <div className="absolute right-4 top-4 max-w-[240px] rounded-2xl border border-orange-100 bg-white/95 p-4 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">{t("trends.highlight")}</p>
                <h3 className="mt-1 text-lg font-bold text-gray-900">{selected.locality}</h3>
                <p className="text-sm text-gray-600">{selected.restaurantName}</p>
                <div className="mt-3 grid gap-2 text-sm text-gray-700">
                  <div className="rounded-xl bg-gray-50 px-3 py-2">{t("trends.orders")}: {selected.orders}</div>
                  <div className="rounded-xl bg-gray-50 px-3 py-2">{t("trends.units")}: {selected.unitsSold}</div>
                  <div className="rounded-xl bg-gray-50 px-3 py-2">
                    {t("trends.revenue")}: {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    }).format(selected.revenue)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">{t("trends.topTitle")}</h2>
            </div>
            <div className="space-y-3">
              {topRestaurants.map((restaurant, index) => (
                <button
                  key={restaurant.restaurantId}
                  onClick={() => setSelectedId(restaurant.restaurantId)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selected?.restaurantId === restaurant.restaurantId
                      ? "border-orange-300 bg-orange-50"
                      : "border-gray-200 hover:border-orange-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-orange-500">#{index + 1}</p>
                      <h3 className="font-bold text-gray-900">{restaurant.restaurantName}</h3>
                      <p className="text-sm text-gray-500">{restaurant.locality}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{restaurant.unitsSold} {t("trends.unitsShort")}</p>
                      <p>{new Intl.NumberFormat(locale, {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(restaurant.revenue)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">{t("trends.infoTitle")}</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>• {t("trends.info1")}</li>
              <li>• {t("trends.info2")}</li>
              <li>• {t("trends.info3")}</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
