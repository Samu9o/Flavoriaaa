"use client"
import { useState } from "react"
import { Play, Clock, Users, Search } from "lucide-react"
import { recipes } from "@/lib/data"

export default function VideosPage() {
  const [search, setSearch] = useState("")
  const [playing, setPlaying] = useState<number | null>(null)

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Videos de Recetas</h1>
        <p className="text-gray-500">Aprende paso a paso con nuestros tutoriales en video</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((recipe) => (
          <div key={recipe.id} className="card group">
            {/* Thumbnail / Video */}
            <div className="relative overflow-hidden bg-gray-900" style={{ aspectRatio: "16/9" }}>
              {playing === recipe.id ? (
                <iframe
                  src={`${recipe.videoUrl}?autoplay=1`}
                  title={recipe.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <button
                    onClick={() => setPlaying(recipe.id)}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-primary fill-primary ml-1" />
                    </div>
                  </button>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    {recipe.time} min
                  </div>
                </>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-orange">{recipe.category}</span>
                <span className="text-xs text-gray-500">{recipe.difficulty}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{recipe.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-3">{recipe.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {recipe.time} min
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {recipe.servings} porciones
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
