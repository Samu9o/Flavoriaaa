"use client"
import { useState } from "react"
import Link from "next/link"
import { Clock, Users, Heart } from "lucide-react"
import Image from "next/image"

interface RecipeCardProps {
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
  nivel: string
  likes: number
  liked?: boolean
}

const difficultyColor: Record<string, string> = {
  Fácil: "text-green-600",
  Media: "text-gray-500",
  Difícil: "text-red-500",
}

export default function RecipeCard(props: RecipeCardProps) {
  const {
    id, title, description, image, category, difficulty,
    time, servings, author, authorAvatar, nivel, likes, liked = false,
  } = props

  const [isLiked, setIsLiked] = useState(liked)
  const [likeCount, setLikeCount] = useState(likes)

  return (
    <Link
      href={`/receta/${id}`}
      className="block group cursor-pointer bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
    >



      {/* Imagen */}
      <div className="relative overflow-hidden h-48">
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>

      {/* Contenido */}
      <div className="p-4">

        {/* categoría */}
      <div className="flex justify-between items-center">

        {/* Izq categoría */}
        <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">
          {category}
        </span>

        {/* Der dificultad */}
        <span className={`text-xs font-medium ${difficultyColor[difficulty] || "text-gray-400"}`}>
          {difficulty}
        </span>

      </div>

        <h3 className="font-bold mt-2">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>

        <div className="flex gap-4 text-xs text-gray-500 mt-2">
          <span><Clock className="inline w-3 h-3" /> {time} min</span>
          <span><Users className="inline w-3 h-3" /> {servings}</span>
        </div>

        <div className="flex justify-between items-center mt-3">

          {/* autor */}
          <div className="flex items-center gap-2">
            <Image 
              src={authorAvatar} 
              alt={author}
              width={28} // tamaño del avatar
              height={28}
              className="w-7 h-7 rounded-full" 
            />
            
            <span className="text-xs">{author}</span>
            
            {/* Medalla según nivel */}
            {nivel && (
              <Image
                src={`/medallas/${nivel}.png`}
                alt={nivel}
                width={40}
                height={40}
                className="inline-block"
              />
            )}
          </div>

          {/* like */}
          <div
            onClick={(e) => {
              e.preventDefault()
              setIsLiked(!isLiked)
              setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
            }}
            className="flex items-center gap-1 cursor-pointer"
          >
            <Heart className={isLiked ? "text-red-500 fill-red-500 w-4 h-4" : "w-4 h-4"} />
            <span>{likeCount}</span>
          </div>

        </div>
      </div>
    </Link>
  )
}