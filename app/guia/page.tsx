"use client"

import { useMemo, useState } from "react"
import { MapPin, Navigation, Route } from "lucide-react"
import { useUser } from "@/lib/userContext"

export default function GuiaRutaPage() {
  const { restaurants } = useUser()
  const [origin, setOrigin] = useState("")
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("")
  const [destination, setDestination] = useState("")
  const [mapSrc, setMapSrc] = useState("")
  const [routeUrl, setRouteUrl] = useState("")
  const [error, setError] = useState("")

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === selectedRestaurantId) ?? null,
    [restaurants, selectedRestaurantId],
  )

  const handleRestaurantChange = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId)
    const restaurant = restaurants.find((item) => item.id === restaurantId)
    if (restaurant) {
      setDestination(restaurant.address)
    }
  }

  const handleRoute = () => {
    const normalizedOrigin = origin.trim()
    const normalizedDestination = destination.trim()

    if (!normalizedOrigin || !normalizedDestination) {
      setError("Debes ingresar una direccion de origen y una direccion destino.")
      return
    }

    setError("")

    const source = encodeURIComponent(normalizedOrigin)
    const target = encodeURIComponent(normalizedDestination)

    setMapSrc(`https://maps.google.com/maps?saddr=${source}&daddr=${target}&output=embed`)
    setRouteUrl(
      `https://www.google.com/maps/dir/?api=1&origin=${source}&destination=${target}&travelmode=driving`,
    )
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10">
      <header className="mb-8">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
          <Navigation className="h-4 w-4" /> Mapa guia
        </p>
        <h1 className="text-3xl font-bold text-gray-900">Como llegar al restaurante</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600">
          Ingresa tu direccion de origen y selecciona un restaurante destino para ver una
          guia de ruta.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1.6fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Planificar ruta</h2>

          <label className="mb-3 block text-sm text-gray-700">
            Direccion de origen
            <input
              type="text"
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              placeholder="Ej. Calle 53 #18-25, Bogota"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </label>

          <label className="mb-3 block text-sm text-gray-700">
            Restaurante destino
            <select
              value={selectedRestaurantId}
              onChange={(event) => handleRestaurantChange(event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
            >
              <option value="">Selecciona un restaurante</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name} - {restaurant.locality}
                </option>
              ))}
            </select>
          </label>

          <label className="mb-4 block text-sm text-gray-700">
            Direccion destino
            <input
              type="text"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Ej. Carrera 15 #93-60, Bogota"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </label>

          <button
            onClick={handleRoute}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Route className="h-4 w-4" /> Mostrar ruta
          </button>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          {selectedRestaurant && (
            <div className="mt-5 rounded-xl bg-orange-50 p-4 text-sm text-orange-900">
              <p className="font-semibold">Destino seleccionado</p>
              <p className="mt-1">{selectedRestaurant.name}</p>
              <p className="text-xs text-orange-700">{selectedRestaurant.address}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Mapa de ruta</h2>

          {mapSrc ? (
            <>
              <iframe
                title="Mapa guia de ruta"
                src={mapSrc}
                className="h-[420px] w-full rounded-xl border border-gray-200"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={routeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white"
                >
                  <MapPin className="h-4 w-4" /> Abrir navegacion completa
                </a>
              </div>
            </>
          ) : (
            <div className="flex h-[420px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
              Completa los datos para generar el mapa de como llegar.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
