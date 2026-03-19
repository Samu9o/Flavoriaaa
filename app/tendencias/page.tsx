"use client"

import { useEffect, useMemo, useState } from "react"
import { MapPinned, TrendingUp } from "lucide-react"
import { getLocaleForLanguage, useI18n } from "@/lib/i18n"
import { useUser } from "@/lib/userContext"

const MAP_WIDTH = 760
const MAP_HEIGHT = 500
const MAP_PADDING = 24

type LabelPlacement = { x: number; y: number }
type MarkerPlacement = { x: number; y: number }
type GeoPoint = [number, number]

type GeoFeature = {
  id: string
  label?: string
  coordinates: GeoPoint[]
}

type GeoData = {
  boundary: GeoPoint[]
  localities: GeoFeature[]
}

type GeoJsonFeature = {
  type: "Feature"
  properties?: {
    id?: string
    label?: string
    kind?: string
  }
  geometry?: {
    type?: string
    coordinates?: unknown
  }
}

type GeoJsonFeatureCollection = {
  type?: string
  features?: GeoJsonFeature[]
}

type GeoProjectionBounds = {
  minLon: number
  maxLon: number
  minLat: number
  maxLat: number
}

const BOGOTA_GEO_BOUNDARY: GeoPoint[] = [
  [-74.223, 4.842],
  [-74.184, 4.852],
  [-74.136, 4.848],
  [-74.089, 4.837],
  [-74.044, 4.821],
  [-74.01, 4.799],
  [-73.988, 4.772],
  [-73.974, 4.736],
  [-73.966, 4.694],
  [-73.969, 4.647],
  [-73.979, 4.606],
  [-73.998, 4.571],
  [-74.026, 4.541],
  [-74.059, 4.519],
  [-74.094, 4.507],
  [-74.129, 4.501],
  [-74.168, 4.505],
  [-74.199, 4.516],
  [-74.225, 4.533],
  [-74.247, 4.56],
  [-74.264, 4.59],
  [-74.275, 4.624],
  [-74.278, 4.664],
  [-74.273, 4.705],
  [-74.262, 4.742],
  [-74.246, 4.776],
]

const BOGOTA_GEO_LOCALITIES: GeoFeature[] = [
  {
    id: "usaquen",
    label: "Usaquén",
    coordinates: [
      [-74.218, 4.818],
      [-74.188, 4.842],
      [-74.153, 4.84],
      [-74.121, 4.831],
      [-74.109, 4.806],
      [-74.135, 4.79],
      [-74.173, 4.794],
    ],
  },
  {
    id: "suba",
    label: "Suba",
    coordinates: [
      [-74.248, 4.776],
      [-74.223, 4.818],
      [-74.173, 4.794],
      [-74.169, 4.758],
      [-74.194, 4.734],
      [-74.231, 4.741],
    ],
  },
  {
    id: "chapinero",
    label: "Chapinero",
    coordinates: [
      [-74.153, 4.794],
      [-74.135, 4.79],
      [-74.121, 4.758],
      [-74.145, 4.74],
      [-74.168, 4.754],
    ],
  },
  {
    id: "teusaquillo",
    label: "Teusaquillo",
    coordinates: [
      [-74.168, 4.754],
      [-74.145, 4.74],
      [-74.128, 4.716],
      [-74.154, 4.698],
      [-74.185, 4.708],
      [-74.194, 4.734],
    ],
  },
  {
    id: "engativa",
    label: "Engativá",
    coordinates: [
      [-74.231, 4.741],
      [-74.194, 4.734],
      [-74.185, 4.708],
      [-74.191, 4.675],
      [-74.221, 4.659],
      [-74.25, 4.673],
      [-74.26, 4.705],
    ],
  },
  {
    id: "fontibon",
    label: "Fontibón",
    coordinates: [
      [-74.25, 4.673],
      [-74.221, 4.659],
      [-74.209, 4.626],
      [-74.223, 4.596],
      [-74.252, 4.605],
      [-74.267, 4.636],
    ],
  },
  {
    id: "kennedy",
    label: "Kennedy",
    coordinates: [
      [-74.221, 4.659],
      [-74.191, 4.675],
      [-74.164, 4.649],
      [-74.16, 4.615],
      [-74.183, 4.593],
      [-74.209, 4.626],
    ],
  },
  {
    id: "bosa",
    label: "Bosa",
    coordinates: [
      [-74.223, 4.596],
      [-74.183, 4.593],
      [-74.165, 4.566],
      [-74.174, 4.534],
      [-74.204, 4.53],
      [-74.232, 4.548],
    ],
  },
  {
    id: "san-cristobal",
    label: "San Cristóbal",
    coordinates: [
      [-74.164, 4.649],
      [-74.133, 4.668],
      [-74.103, 4.646],
      [-74.1, 4.606],
      [-74.121, 4.576],
      [-74.146, 4.589],
      [-74.16, 4.615],
    ],
  },
  {
    id: "usme",
    label: "Usme",
    coordinates: [
      [-74.146, 4.589],
      [-74.121, 4.576],
      [-74.104, 4.544],
      [-74.115, 4.513],
      [-74.148, 4.507],
      [-74.172, 4.526],
      [-74.174, 4.534],
    ],
  },
  {
    id: "oriente",
    coordinates: [
      [-74.121, 4.758],
      [-74.109, 4.806],
      [-74.01, 4.799],
      [-73.988, 4.772],
      [-73.974, 4.736],
      [-73.966, 4.694],
      [-73.969, 4.647],
      [-74.103, 4.646],
      [-74.133, 4.668],
      [-74.128, 4.716],
    ],
  },
]

const FALLBACK_GEO_DATA: GeoData = {
  boundary: BOGOTA_GEO_BOUNDARY,
  localities: BOGOTA_GEO_LOCALITIES,
}

const BOGOTA_SHAPE_COLORS = [
  "#fbe8db",
  "#f9d4bd",
  "#f8c7a4",
  "#f7d9c6",
  "#f8e0d0",
  "#f9ddcd",
  "#f6ceb2",
  "#f3c8ab",
  "#efb894",
  "#ecb08b",
  "#f2c39f",
  "#f6d6c1",
]

function getGeoBounds(features: GeoFeature[], boundary: GeoPoint[]): GeoProjectionBounds {
  const points = [...boundary, ...features.flatMap((feature) => feature.coordinates)]
  const lons = points.map(([lon]) => lon)
  const lats = points.map(([, lat]) => lat)
  return {
    minLon: Math.min(...lons),
    maxLon: Math.max(...lons),
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
  }
}

function projectGeoPoint([lon, lat]: GeoPoint, bounds: GeoProjectionBounds): [number, number] {
  const xRatio = (lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)
  const yRatio = (bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)
  const x = MAP_PADDING + xRatio * (MAP_WIDTH - MAP_PADDING * 2)
  const y = MAP_PADDING + yRatio * (MAP_HEIGHT - MAP_PADDING * 2)
  return [x, y]
}

function geoToPath(coordinates: GeoPoint[], bounds: GeoProjectionBounds) {
  if (coordinates.length === 0) return ""
  const [startX, startY] = projectGeoPoint(coordinates[0], bounds)
  const lines = coordinates
    .slice(1)
    .map((point) => {
      const [x, y] = projectGeoPoint(point, bounds)
      return `L ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")
  return `M ${startX.toFixed(1)} ${startY.toFixed(1)} ${lines} Z`
}

function polygonCentroid(points: GeoPoint[]): GeoPoint {
  if (!points.length) return [-74.12, 4.67]
  const [sumLon, sumLat] = points.reduce(
    ([accLon, accLat], [lon, lat]) => [accLon + lon, accLat + lat],
    [0, 0],
  )
  return [sumLon / points.length, sumLat / points.length]
}

function buildMarkerPlacements(points: Array<{ restaurantId: string; x: number; y: number }>) {
  const placements: Record<string, MarkerPlacement> = {}
  const placed: Array<{ x: number; y: number }> = []
  const sortedPoints = [...points].sort((a, b) => (a.y !== b.y ? a.y - b.y : a.x - b.x))

  for (const point of sortedPoints) {
    const ringOffsets = [
      { x: 0, y: 0 },
      { x: 14, y: 0 },
      { x: -14, y: 0 },
      { x: 0, y: 14 },
      { x: 0, y: -14 },
      { x: 12, y: 12 },
      { x: 12, y: -12 },
      { x: -12, y: 12 },
      { x: -12, y: -12 },
      { x: 22, y: 0 },
      { x: -22, y: 0 },
      { x: 0, y: 22 },
      { x: 0, y: -22 },
      { x: 20, y: 14 },
      { x: -20, y: 14 },
      { x: 20, y: -14 },
      { x: -20, y: -14 },
    ]

    const candidate = ringOffsets
      .map((offset) => ({
        x: Math.max(30, Math.min(MAP_WIDTH - 30, point.x + offset.x)),
        y: Math.max(30, Math.min(MAP_HEIGHT - 30, point.y + offset.y)),
      }))
      .find((spot) => !placed.some((current) => Math.hypot(current.x - spot.x, current.y - spot.y) < 24)) ?? {
      x: point.x,
      y: point.y,
    }

    placements[point.restaurantId] = candidate
    placed.push(candidate)
  }

  return placements
}

function buildLabelPlacements(points: Array<{ restaurantId: string; x: number; y: number }>) {
  const placed: LabelPlacement[] = []
  const placements: Record<string, LabelPlacement> = {}
  const sortedPoints = [...points].sort((a, b) => (a.y !== b.y ? a.y - b.y : a.x - b.x))

  for (const point of sortedPoints) {
    const horizontalOffset = point.x > MAP_WIDTH * 0.62 ? -56 : point.x < MAP_WIDTH * 0.35 ? 56 : 0
    const candidateX = Math.max(40, Math.min(MAP_WIDTH - 40, point.x + horizontalOffset))
    let candidateY = point.y - 18
    let retries = 0

    while (placed.some((label) => Math.abs(label.x - candidateX) < 90 && Math.abs(label.y - candidateY) < 18) && retries < 12) {
      candidateY += 14
      retries += 1
    }

    if (candidateY > MAP_HEIGHT - 14) {
      candidateY = point.y - 30
    }

    const placement = { x: candidateX, y: Math.max(18, Math.min(MAP_HEIGHT - 10, candidateY)) }
    placements[point.restaurantId] = placement
    placed.push(placement)
  }

  return placements
}

function estimateLabelWidth(text: string) {
  return Math.max(58, Math.min(132, text.length * 6.2 + 14))
}

function parseGeoJson(raw: GeoJsonFeatureCollection): GeoData | null {
  if (raw?.type !== "FeatureCollection" || !Array.isArray(raw.features)) return null

  const boundaryFeature = raw.features.find(
    (feature) => feature.properties?.kind === "boundary" && feature.geometry?.type === "Polygon",
  )

  const boundaryCoords = boundaryFeature?.geometry?.coordinates
  if (!Array.isArray(boundaryCoords) || !Array.isArray(boundaryCoords[0])) return null

  const boundary = (boundaryCoords[0] as unknown[])
    .filter((point): point is number[] => Array.isArray(point) && point.length >= 2)
    .map((point) => [Number(point[0]), Number(point[1])] as GeoPoint)

  const localities = raw.features
    .filter(
      (feature) => feature.properties?.kind === "locality" && feature.geometry?.type === "Polygon",
    )
    .map((feature) => {
      const coordinates = feature.geometry?.coordinates
      const ring = Array.isArray(coordinates) && Array.isArray(coordinates[0]) ? coordinates[0] : []
      const parsedRing = (ring as unknown[])
        .filter((point): point is number[] => Array.isArray(point) && point.length >= 2)
        .map((point) => [Number(point[0]), Number(point[1])] as GeoPoint)

      return {
        id: feature.properties?.id ?? "locality",
        label: feature.properties?.label,
        coordinates: parsedRing,
      }
    })
    .filter((feature) => feature.coordinates.length >= 3)

  if (boundary.length < 3 || localities.length === 0) return null

  return { boundary, localities }
}

export default function TendenciasPage() {
  const { topRestaurants, bogotaTrendPoints } = useUser()
  const { language, t } = useI18n()
  const locale = getLocaleForLanguage(language)
  const [selectedId, setSelectedId] = useState<string | null>(bogotaTrendPoints[0]?.restaurantId ?? null)
  const [geoData, setGeoData] = useState<GeoData>(FALLBACK_GEO_DATA)

  useEffect(() => {
    let active = true

    const loadGeoData = async () => {
      try {
        const response = await fetch("/maps/bogota-localities.geojson", { cache: "no-store" })
        if (!response.ok) return

        const payload = (await response.json()) as GeoJsonFeatureCollection
        const parsed = parseGeoJson(payload)
        if (active && parsed) {
          setGeoData(parsed)
        }
      } catch {
        // Keep fallback map geometry if fetch fails.
      }
    }

    void loadGeoData()
    return () => {
      active = false
    }
  }, [])

  const geoBounds = useMemo(
    () => getGeoBounds(geoData.localities, geoData.boundary),
    [geoData],
  )

  const localityAnchors = useMemo(() => {
    const anchors: Record<string, { x: number; y: number }> = {}
    for (const locality of geoData.localities) {
      if (!locality.label) continue
      const [lon, lat] = polygonCentroid(locality.coordinates)
      const [x, y] = projectGeoPoint([lon, lat], geoBounds)
      anchors[locality.label] = { x, y }
    }
    return anchors
  }, [geoBounds, geoData.localities])

  const projectedTrendPoints = useMemo(
    () =>
      bogotaTrendPoints.map((point) => ({
        ...point,
        x: localityAnchors[point.locality]?.x ?? point.x,
        y: localityAnchors[point.locality]?.y ?? point.y,
      })),
    [bogotaTrendPoints, localityAnchors],
  )

  const markerPlacements = useMemo(() => buildMarkerPlacements(projectedTrendPoints), [projectedTrendPoints])

  const labelPlacements = useMemo(
    () =>
      buildLabelPlacements(
        projectedTrendPoints.map((point) => ({
          restaurantId: point.restaurantId,
          x: markerPlacements[point.restaurantId]?.x ?? point.x,
          y: markerPlacements[point.restaurantId]?.y ?? point.y,
        })),
      ),
    [projectedTrendPoints, markerPlacements],
  )

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
                d={geoToPath(geoData.boundary, geoBounds)}
                fill="#fde6d8"
                stroke="#f2b48f"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {geoData.localities.map((shape, index) => (
                <path
                  key={shape.id}
                  d={geoToPath(shape.coordinates, geoBounds)}
                  fill={BOGOTA_SHAPE_COLORS[index % BOGOTA_SHAPE_COLORS.length]}
                  opacity={0.86}
                  stroke="#efbf99"
                  strokeWidth="1.6"
                />
              ))}

              {projectedTrendPoints.map((point) => {
                const isSelected = selected?.restaurantId === point.restaurantId
                const marker = markerPlacements[point.restaurantId] ?? { x: point.x, y: point.y }
                const label = labelPlacements[point.restaurantId] ?? { x: marker.x, y: marker.y - 18 }
                const labelWidth = estimateLabelWidth(point.locality)
                const labelHeight = 18

                return (
                  <g key={point.restaurantId} onClick={() => setSelectedId(point.restaurantId)} style={{ cursor: "pointer" }}>
                    {(marker.x !== point.x || marker.y !== point.y) && (
                      <line
                        x1={point.x}
                        y1={point.y}
                        x2={marker.x}
                        y2={marker.y}
                        stroke="#f59e0b"
                        strokeOpacity={0.55}
                        strokeWidth="1.6"
                        strokeDasharray="3 4"
                      />
                    )}

                    {isSelected && (
                      <path
                        d={`M ${marker.x} ${marker.y - 18} C ${marker.x + 12} ${marker.y - 18}, ${marker.x + 12} ${marker.y - 2}, ${marker.x} ${marker.y + 14} C ${marker.x - 12} ${marker.y - 2}, ${marker.x - 12} ${marker.y - 18}, ${marker.x} ${marker.y - 18} Z`}
                        fill="#f97316"
                        opacity={0.26}
                      />
                    )}

                    <path
                      d={`M ${marker.x} ${marker.y - 14} C ${marker.x + 9} ${marker.y - 14}, ${marker.x + 9} ${marker.y - 2}, ${marker.x} ${marker.y + 12} C ${marker.x - 9} ${marker.y - 2}, ${marker.x - 9} ${marker.y - 14}, ${marker.x} ${marker.y - 14} Z`}
                      fill={isSelected ? "#c2410c" : "#ea580c"}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />

                    <circle
                      cx={marker.x}
                      cy={marker.y - 7}
                      r={isSelected ? 3.4 : 2.8}
                      fill="#fff7ed"
                      stroke="#fdba74"
                      strokeWidth="1"
                    />

                    <line
                      x1={marker.x}
                      y1={marker.y + 2}
                      x2={label.x}
                      y2={label.y + 4}
                      stroke="#f59e0b"
                      strokeOpacity={0.45}
                      strokeWidth="1.5"
                    />

                    <g>
                      <rect
                        x={label.x - labelWidth / 2}
                        y={label.y - labelHeight + 4}
                        width={labelWidth}
                        height={labelHeight}
                        rx={8}
                        fill="#ffffff"
                        fillOpacity={0.88}
                        stroke="#f3c89f"
                        strokeWidth="1"
                      />
                      <text
                        x={label.x}
                        y={label.y}
                        textAnchor="middle"
                        className="fill-gray-700 text-[10px] font-semibold"
                      >
                        {point.locality}
                      </text>
                    </g>
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
