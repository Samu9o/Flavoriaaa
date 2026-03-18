"use client"
import { useState } from "react"
import { ThumbsUp, MessageCircle, Plus, Send } from "lucide-react"
import Image from "next/image"
import { forumPosts } from "@/lib/data"
import { useUser } from "@/lib/userContext"

type Comment = {
  author: string
  date: string
  text: string
  avatar: string
  nivel: string
}

type Category = "Técnicas" | "Planificación" | "Ingredientes" | "Equipamiento" | "General"

const forumCategories = ["Todas", "Técnicas", "Planificación", "Ingredientes", "Equipamiento", "General"]

const categoryColor: Record<Category, string> = {
  Técnicas: "bg-orange-100 text-orange-600",
  Planificación: "bg-blue-100 text-blue-600",
  Ingredientes: "bg-green-100 text-green-600",
  Equipamiento: "bg-purple-100 text-purple-600",
  General: "bg-gray-100 text-gray-600",
}

export default function ForosPage() {
  const { agregarPuntos, nivel: nivelUsuario, sesion } = useUser()
  const [activeCategory, setActiveCategory] = useState("Todas")
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [posts, setPosts] = useState(forumPosts)

  const [replyText, setReplyText] = useState("")
  const [likes, setLikes] = useState<Record<number, number>>({})
  const [openReplies, setOpenReplies] = useState<number | null>(null)
  const [allComments, setAllComments] = useState<Record<number, Comment[]>>({})
  const [newCategory, setNewCategory] = useState<Category>("General")

  const filtered = posts.filter(
    (p) => activeCategory === "Todas" || p.category === activeCategory
  )

  //  RESPONDER
  const handleReply = (postId: number) => {
    if (!replyText.trim()) return
    agregarPuntos("comentario") 

    const newComment = {
      author: "Tú",
      date: "Ahora",
      text: replyText,
      avatar: "https://i.pravatar.cc/150?img=5",
      nivel:nivelUsuario
    }

    setAllComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }))

    setReplyText("")
  }

  // NUEVO POST
  const handleNewPost = () => {
      if (!sesion) return alert("Debes iniciar sesión para publicar")
      if (!newTitle.trim() || !newContent.trim()) return
    agregarPuntos("hilo")  

    const newPost = {
      id: Date.now(),
      title: newTitle,
      author: "Tú",
      authorAvatar: "https://i.pravatar.cc/150?img=5",
      nivel: nivelUsuario,
      date: "Ahora",
      category: newCategory,
      content: newContent,
      likes: 0,
      replies: 0,
      comments: [],
    }

    setPosts((prev) => [newPost, ...prev]) // 🔥 primero

    setNewTitle("")
    setNewContent("")
    setShowNew(false)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Titulo */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Foros de Discusión</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Comparte experiencias y aprende de otros cocineros
            </p>
          </div>

        <button
          onClick={() => sesion ? setShowNew(true) : alert("Debes iniciar sesión para publicar")}
          className={`flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition ${!sesion ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white">
              <Plus className="w-3 h-3 text-orange-500" />
            </span>
            Nueva Publicación
          </button>
        </div>

        {/* Post nuevo */}
        {showNew && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-2 border-primary">
            <h2 className="font-bold text-lg mb-4">Nueva Publicación</h2>

            <input
              type="text"
              placeholder="Título de tu publicación..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="input-field mb-3"
            />
            <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Category)}
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-orange-400 outline-none mb-3"
                >
                <option value="General">General</option>
                <option value="Técnicas">Técnicas</option>
                <option value="Planificación">Planificación</option>
                <option value="Ingredientes">Ingredientes</option>
                <option value="Equipamiento">Equipamiento</option>
                </select>

            <textarea
              placeholder="¿Qué quieres compartir con la comunidad?"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
              className="input-field resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={handleNewPost}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition"
              >
                Publicar
              </button>

              <button
                onClick={() => setShowNew(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Categorías */}
        <div className="flex gap-2 flex-wrap mb-6">
          {forumCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                activeCategory === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filtered.map((post) => {
            const comments = [
              ...(post.comments || []),
              ...(allComments[post.id] || []),
            ]

            return (
              <div key={post.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md">
              <div className="flex gap-4 items-start">
                <div className="flex items-center gap-2">
                  <Image
                    src={post.authorAvatar}
                    alt={post.author}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <Image
                    src={`/medallas/${post.nivel ?? "basico"}.png`}
                    alt={post.nivel ?? "basico"}
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{post.title}</h3>

                    <div className="flex gap-2 text-xs text-gray-500 mb-2">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                      <span>•</span>

                      <span className={`px-2 py-0.5 rounded-full ${categoryColor[post.category as Category]}`}>
                        {post.category}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">{post.content}</p>

                    <div className="flex gap-4 text-sm text-gray-500">
                      <button
                        onClick={() => {
                          if (!sesion) return alert("Debes iniciar sesión para votar")
                          setLikes((prev) => ({ ...prev, [post.id]: (prev[post.id] ?? post.likes) + 1 }))
                        }}
                        className="flex items-center gap-1.5 hover:text-orange-500"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {likes[post.id] ?? post.likes}
                      </button>

                      <button
                        onClick={() =>
                          setOpenReplies(openReplies === post.id ? null : post.id)
                        }
                        className="flex items-center gap-1.5 hover:text-orange-500"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {comments.length} respuestas
                      </button>
                    </div>

                    {openReplies === post.id && (
                      <div className="mt-4 border-t pt-3 space-y-4">

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Escribe una respuesta..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm"
                          />

                          <button
                            onClick={() => {
                              if (!sesion) return alert("Debes iniciar sesión para comentar")
                              handleReply(post.id)
                            }}
                            className="bg-orange-500 text-white px-3 py-2 rounded-xl"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          </div>

                        <div className="space-y-3">
                          {comments.map((c, i) => (
                        // Reemplaza el bloque de cada comentario:
                          <div key={i} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 self-start">
                              <Image
                                src={c.avatar}
                                alt={c.author}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <Image
                                src={`/medallas/${c.nivel}.png`}
                                alt={c.nivel}
                                width={40}
                                height={40}
                                className="w-10 h-10"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{c.author}</p>
                              <p className="text-xs text-gray-500">{c.date}</p>
                              <p className="text-sm">{c.text}</p>
                            </div>
                          </div>
                          ))}
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}