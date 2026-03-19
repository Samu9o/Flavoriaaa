import Link from "next/link"
import { cuisineCountries } from "@/lib/worldCuisine"

export default function PaisesPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-green-900">Comida de Paises</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600">
          Explora recetas tradicionales de cada pais. Haz clic en un pais para ver su
          menu de recetas y entra al detalle paso a paso.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cuisineCountries.map((country) => (
          <article
            key={country.slug}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <img
              src={country.image}
              alt={country.name}
              className="h-44 w-full object-cover"
            />
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{country.name}</h2>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {country.flag}
                </span>
              </div>
              <p className="text-sm text-gray-600">{country.intro}</p>
              <p className="text-xs text-gray-500">{country.recipes.length} recetas</p>
              <Link
                href={`/paises/${country.slug}`}
                className="inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
              >
                Ver recetas
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
