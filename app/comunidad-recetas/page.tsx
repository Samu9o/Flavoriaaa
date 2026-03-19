"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Heart, MessageSquare, Star } from "lucide-react"
import { recipes } from "@/lib/data"
import { useUser } from "@/lib/userContext"

type RecipeItem = {
  id: number
  title: string
  description: string
  image: string
  category: string
  difficulty: string
  author: string
  authorAvatar: string
  likes: number
}

type FeedbackEntry = {
  id: string
  recipeId: number
  authorName: string
  rating: number
  comment: string
  createdAt: string
}

type FeedbackDraft = {
  rating: number
  comment: string
}

const FEEDBACK_STORAGE_KEY = "flavoria-recipes-feedback-v1"
const LIKES_STORAGE_KEY = "flavoria-recipes-likes-v1"

export default function ComunidadRecetasPage() {
  const { sesion, currentUser } = useUser()
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([])
  const [likesByRecipe, setLikesByRecipe] = useState<Record<number, string[]>>({})
  const [hydrated, setHydrated] = useState(false)
  const [drafts, setDrafts] = useState<Record<number, FeedbackDraft>>({})
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    try {
      const savedFeedback = localStorage.getItem(FEEDBACK_STORAGE_KEY)
      if (savedFeedback) {
        const parsed = JSON.parse(savedFeedback) as FeedbackEntry[]
        if (Array.isArray(parsed)) {
          setFeedback(parsed)
        }
      }

      const savedLikes = localStorage.getItem(LIKES_STORAGE_KEY)
      if (savedLikes) {
        const parsedLikes = JSON.parse(savedLikes) as Record<number, string[]>
        if (parsedLikes && typeof parsedLikes === "object") {
          setLikesByRecipe(parsedLikes)
        }
      }
    } catch {
      setFeedback([])
      setLikesByRecipe({})
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedback))
  }, [feedback, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likesByRecipe))
  }, [likesByRecipe, hydrated])

  const visibleRecipes = useMemo(() => {
    const allRecipes = recipes as RecipeItem[]
    if (!currentUser) return allRecipes
    return allRecipes.filter((recipe) => recipe.author !== currentUser.name)
  }, [currentUser])

  const groupedFeedback = useMemo(() => {
    const grouped = new Map<number, FeedbackEntry[]>()

    for (const item of feedback) {
      const current = grouped.get(item.recipeId) ?? []
      current.push(item)
      grouped.set(item.recipeId, current)
    }

    return grouped
  }, [feedback])

  const getAverageRating = (recipeId: number) => {
    const list = groupedFeedback.get(recipeId) ?? []
    if (list.length === 0) return null

    const total = list.reduce((sum, item) => sum + item.rating, 0)
    return (total / list.length).toFixed(1)
  }

  const updateDraft = (recipeId: number, key: keyof FeedbackDraft, value: string | number) => {
    setDrafts((prev) => ({
      ...prev,
      [recipeId]: {
        rating: prev[recipeId]?.rating ?? 5,
        comment: prev[recipeId]?.comment ?? "",
        [key]: value,
      },
    }))
  }

  const publishFeedback = (recipeId: number) => {
    if (!sesion || !currentUser) {
      setMessage("Debes iniciar sesion para dejar opinion.")
      return
    }

    const draft = drafts[recipeId]
    if (!draft || !draft.comment.trim()) {
      setMessage("Escribe una retroalimentacion antes de publicar.")
      return
    }

    const entry: FeedbackEntry = {
      id: `fb-${Date.now()}`,
      recipeId,
      authorName: currentUser.name,
      rating: Math.min(5, Math.max(1, draft.rating)),
      comment: draft.comment.trim(),
      createdAt: new Date().toISOString(),
    }

    setFeedback((prev) => [entry, ...prev])
    setDrafts((prev) => ({
      ...prev,
      [recipeId]: { rating: 5, comment: "" },
    }))
    setMessage("Retroalimentacion publicada correctamente.")
  }

  const toggleLike = (recipeId: number) => {
    if (!sesion || !currentUser) {
      setMessage("Debes iniciar sesion para dar me gusta.")
      return
    }

    setLikesByRecipe((prev) => {
      const current = prev[recipeId] ?? []
      const alreadyLiked = current.includes(currentUser.id)

      return {
        ...prev,
        [recipeId]: alreadyLiked
          ? current.filter((userId) => userId !== currentUser.id)
          : [...current, currentUser.id],
      }
    })
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10">
      <header className="mb-8">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
          <MessageSquare className="h-4 w-4" /> Comunidad
        </p>
        <h1 className="text-3xl font-bold text-gray-900">Recetas de la comunidad</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600">
          Mira todas las recetas que suben los demas usuarios, opina y deja
          retroalimentacion para ayudar a mejorar cada preparacion.
        </p>
      </header>

      {message && (
        <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          {message}
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        {visibleRecipes.map((recipe) => {
          const recipeFeedback = groupedFeedback.get(recipe.id) ?? []
          const avg = getAverageRating(recipe.id)
          const draft = drafts[recipe.id] ?? { rating: 5, comment: "" }
          const recipeLikes = likesByRecipe[recipe.id] ?? []
          const isLikedByCurrentUser = currentUser ? recipeLikes.includes(currentUser.id) : false
          const totalLikes = recipe.likes + recipeLikes.length

          return (
            <article key={recipe.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <img src={recipe.image} alt={recipe.title} className="h-52 w-full object-cover" />
              <div className="space-y-4 p-5">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-orange-100 px-2 py-1 text-orange-700">
                      {recipe.category}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
                      {recipe.difficulty}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{recipe.title}</h2>
                  <p className="mt-1 text-sm text-gray-600">{recipe.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <img src={recipe.authorAvatar} alt={recipe.author} className="h-7 w-7 rounded-full object-cover" />
                    <span>
                      Publicada por <strong>{recipe.author}</strong>
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={() => toggleLike(recipe.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
                        isLikedByCurrentUser
                          ? "bg-red-50 text-red-600"
                          : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isLikedByCurrentUser ? "fill-red-500 text-red-500" : ""}`} />
                      Me gusta
                    </button>
                    <span className="text-xs text-gray-500">{totalLikes} likes</span>
                  </div>
                  <Link href={`/receta/${recipe.id}`} className="mt-2 inline-flex text-sm font-semibold text-orange-600 hover:underline">
                    Ver detalle paso a paso
                  </Link>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">Opiniones y retroalimentacion</p>
                    <p className="text-xs text-gray-500">
                      {avg ? `${avg}/5` : "Sin calificaciones"} · {recipeFeedback.length} opinion(es)
                    </p>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <label className="text-sm text-gray-700">Calificacion</label>
                    <select
                      value={draft.rating}
                      onChange={(event) => updateDraft(recipe.id, "rating", Number(event.target.value))}
                      className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                          {value} estrella(s)
                        </option>
                      ))}
                    </select>
                    <Star className="h-4 w-4 text-amber-500" />
                  </div>

                  <textarea
                    value={draft.comment}
                    onChange={(event) => updateDraft(recipe.id, "comment", event.target.value)}
                    placeholder="Escribe tu opinion sobre esta receta..."
                    className="mb-2 min-h-20 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
                  />

                  <button
                    onClick={() => publishFeedback(recipe.id)}
                    className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                  >
                    Publicar retroalimentacion
                  </button>

                  <div className="mt-4 space-y-2">
                    {recipeFeedback.slice(0, 4).map((item) => (
                      <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-3">
                        <p className="text-xs font-semibold text-gray-700">
                          {item.authorName} · {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-amber-600">{item.rating}/5</p>
                        <p className="text-sm text-gray-700">{item.comment}</p>
                      </div>
                    ))}
                    {recipeFeedback.length === 0 && (
                      <p className="text-sm text-gray-500">Aun no hay opiniones para esta receta.</p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}
