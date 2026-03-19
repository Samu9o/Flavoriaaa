"use client"
import { useState } from "react"
import { notFound, useParams } from "next/navigation"
import { recipes } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
import { Clock, Users, Heart } from "lucide-react"
import { useUser } from "@/lib/userContext"

interface Comment {
  text: string
  user: string
  avatar: string
  nivel: string
  date: string
}

interface Recipe {
  id: number
  title: string
  description: string
  image: string
  category: string
  difficulty: string
  time: number
  servings: number
  author: string
  authorAvatar: string
  likes: number
  liked?: boolean
  nivel: string
  ingredients: string[]
  instructions: string[]
}

export default function RecipePage() {
  
  const params = useParams()
  const id = params.id as string

  const recipe = recipes.find((r) => r.id === Number(id)) as Recipe | undefined

  const { agregarPuntos, nivel: nivelUsuario } = useUser()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [likes, setLikes] = useState(() => recipe?.likes || 0)
  const [liked, setLiked] = useState(() => recipe?.liked || false)

  if (!recipe) return notFound()

  const nivel = recipe.nivel || "plata"

  const difficultyColor: Record<string, string> = {
    Fácil: "text-green-600",
    Media: "text-gray-500",
    Difícil: "text-red-500",
  }

  const addComment = () => {
    if (!newComment.trim()) return
    agregarPuntos("comentario")
    const nuevo: Comment = {
      text: newComment,
      date: "ahora",
      user: "Tú",
      avatar: "https://i.pravatar.cc/150?img=5",
      nivel: nivelUsuario,
    }
    setComments([nuevo, ...comments])
    setNewComment("")
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Volver */}
      <Link href="/" className="text-gray-500 mb-6 block">
        ← Volver
      </Link>

      {/* Imagen de la receta */}
      <div className="relative w-full h-[400px]">
        <Image
          src={recipe.image}
          alt={recipe.title}
          width={1000}
          height={600}
          className="rounded-2xl w-full h-[400px] object-cover"
        />
      </div>

      {/* Info fila */}
      <div className="flex items-center gap-4 mt-4 text-sm">
        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
          {recipe.category}
        </span>
        <span className={`font-medium ${difficultyColor[recipe.difficulty]}`}>
          {recipe.difficulty}
        </span>
        <span className="flex items-center gap-1 text-gray-500">
          <Clock className="w-4 h-4" /> {recipe.time} min
        </span>
        <span className="flex items-center gap-1 text-gray-500">
          <Users className="w-4 h-4" /> {recipe.servings}
        </span>
      </div>

      {/* Título y descripción */}
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{recipe.title}</h1>
        <p className="text-gray-900">{recipe.description}</p>
      </div>

      {/* Autor y Like */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 mt-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src={recipe.authorAvatar}
            alt={recipe.author}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-sm">{recipe.author}</span>

          {/* Medalla del autor */}
          <Image
            src={`/medallas/${nivel}.png`}
            alt={nivel}
            width={40}
            height={40}
            className="inline-block ml-1"
          />
        </div>

        <div
          onClick={() => {
            if (!liked) agregarPuntos("like")
            setLiked(!liked)
            setLikes(liked ? likes - 1 : likes + 1)
          }}
          className="flex items-center gap-1 cursor-pointer"
        >
          <Heart className={liked ? "text-red-500 fill-red-500 w-4 h-4" : "w-4 h-4"} />
          <span>{likes}</span>
        </div>
      </div>

      {/* Ingredientes */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 mt-4">
        <h2 className="font-bold mb-3 text-gray-900">Ingredientes</h2>
        <ul className="space-y-1">
          {recipe.ingredients.map((i, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-900">
              <span className="text-orange-500">•</span>
              {i}
            </li>
          ))}
        </ul>
      </div>

      {/* Preparación */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 mt-4">
        <h2 className="font-bold mb-3 text-gray-900">Preparación</h2>
        <div className="space-y-3">
          {recipe.instructions.map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="bg-orange-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
                {i + 1}
              </div>
              <p className="text-gray-900">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comentarios */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 mt-4">
        <h2 className="font-bold mb-3">Comentarios</h2>

        {/* Input */}
        <div className="flex gap-2 mb-4 items-center">
          <Image
            src="https://i.pravatar.cc/150?img=5"
            alt="Usuario"
            width={35}
            height={35}
            className="rounded-full"
          />
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario..."
            className="border border-gray-200 rounded-full px-4 py-2 flex-1"
          />
          <button
            onClick={addComment}
            className="bg-orange-500 text-white px-4 py-2 rounded-full"
          >
            Publicar
          </button>
        </div>

        {/* Lista de comentarios */}
        <div className="space-y-3">
          {comments.map((c, i) => (
            <div key={i} className="flex gap-3 items-start">
              <Image
                src={c.avatar}
                alt={c.user}
                width={35}
                height={35}
                className="rounded-full"
              />

              <div className="flex items-center gap-2">
                {/* Medalla del comentario */}
                <Image
                  src={`/medallas/${c.nivel}.png`}
                  alt={c.nivel}
                  width={35}
                  height={35}
                  className="inline-block"
                />
                <div className="bg-gray-100 p-3 rounded-xl w-full">
                  <p className="text-sm">{c.text}</p>
                  <p className="text-xs text-gray-400">
                    {c.user} · {c.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}