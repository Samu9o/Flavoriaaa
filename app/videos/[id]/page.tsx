"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Clock, Users } from "lucide-react"
import { recipes } from "@/lib/data"

export default function VideoDetailPage() {
  const params = useParams<{ id: string }>()
  const videoId = Number(params?.id)
  const recipe = recipes.find((item) => item.id === videoId)

  if (!recipe) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Video no encontrado</h1>
          <p className="mt-2 text-sm text-gray-600">No existe un video con ese identificador.</p>
          <Link
            href="/videos"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a videos
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/videos" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver a videos
      </Link>

      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="bg-gray-900" style={{ aspectRatio: "16/9" }}>
          <iframe
            src={recipe.videoUrl}
            title={recipe.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>

        <div className="p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="badge-orange">{recipe.category}</span>
            <span className="text-gray-500">{recipe.difficulty}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">{recipe.title}</h1>
          <p className="mt-2 text-gray-600">{recipe.description}</p>

          <p className="mt-3 text-sm text-gray-700">
            Publicado por <span className="font-semibold text-gray-900">{recipe.author}</span>
          </p>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {recipe.time} min
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-4 w-4" /> {recipe.servings} porciones
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}
