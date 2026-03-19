import Link from "next/link"
import { notFound } from "next/navigation"
import { getRecipeBySlugs } from "@/lib/worldCuisine"

type PageProps = {
  params: Promise<{ country: string; recipe: string }>
}

export default async function CountryRecipeDetailPage({ params }: PageProps) {
  const { country: countrySlug, recipe: recipeSlug } = await params
  const result = getRecipeBySlugs(countrySlug, recipeSlug)

  if (!result) {
    notFound()
  }

  const { country, recipe } = result

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <header className="mb-8 space-y-3">
        <Link
          href={`/paises/${country.slug}`}
          className="text-sm text-green-700 hover:underline"
        >
          ← Volver a recetas de {country.name}
        </Link>
        <h1 className="text-3xl font-bold text-green-900">{recipe.title}</h1>
        <p className="max-w-3xl text-sm text-gray-600">{recipe.description}</p>
      </header>

      <img
        src={recipe.image}
        alt={recipe.title}
        className="mb-8 h-64 w-full rounded-2xl object-cover shadow-sm"
      />

      <section className="mb-8 grid gap-3 rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-700 sm:grid-cols-3">
        <p>
          <strong>Tiempo:</strong> {recipe.timeMinutes} min
        </p>
        <p>
          <strong>Porciones:</strong> {recipe.servings}
        </p>
        <p>
          <strong>Dificultad:</strong> {recipe.difficulty}
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Ingredientes</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
            {recipe.ingredients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Paso a paso</h2>
          <ol className="list-decimal space-y-3 pl-5 text-sm text-gray-700">
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  )
}
