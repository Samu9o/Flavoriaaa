import Link from "next/link"
import { notFound } from "next/navigation"
import { getCountryBySlug } from "@/lib/worldCuisine"
import FallbackImage from "@/components/FallbackImage"

type PageProps = {
  params: Promise<{ country: string }>
}

export default async function CountryRecipesPage({ params }: PageProps) {
  const { country: countrySlug } = await params
  const country = getCountryBySlug(countrySlug)

  if (!country) {
    notFound()
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10">
      <header className="mb-8">
        <Link href="/paises" className="text-sm text-green-700 hover:underline">
          ← Volver a paises
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-green-900">{country.name}</h1>
        <p className="mt-2 text-sm text-gray-600">{country.intro}</p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {country.recipes.map((recipe) => (
          <article
            key={recipe.slug}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <FallbackImage
              src={recipe.image}
              alt={recipe.title}
              className="h-44 w-full object-cover"
              fallbackSrc="/maps/placeholder-recipe.svg"
            />
            <div className="space-y-3 p-5">
              <h2 className="text-lg font-semibold text-gray-900">{recipe.title}</h2>
              <p className="text-sm text-gray-600">{recipe.description}</p>
              <div className="flex gap-2 text-xs text-gray-500">
                <span className="rounded bg-gray-100 px-2 py-1">{recipe.timeMinutes} min</span>
                <span className="rounded bg-gray-100 px-2 py-1">{recipe.servings} porciones</span>
                <span className="rounded bg-gray-100 px-2 py-1">{recipe.difficulty}</span>
              </div>
              <Link
                href={`/paises/${country.slug}/${recipe.slug}`}
                className="inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
              >
                Ver paso a paso
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
