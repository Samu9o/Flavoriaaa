"use client"

import Image from "next/image"
import Link from "next/link"
import { Rss } from "lucide-react"
import { useUser } from "@/lib/userContext"

const kindStyle: Record<string, string> = {
  receta:      "bg-green-50 text-green-700",
  foro:        "bg-orange-50 text-orange-700",
  video:       "bg-red-50 text-red-700",
  publicacion: "bg-gray-100 text-gray-600",
}

const kindLabel: Record<string, string> = {
  receta:      "Receta",
  foro:        "Foro",
  video:       "Video",
  publicacion: "Publicación",
}

export default function FeedPage() {
  const { sesion, personalizedFeed } = useUser()

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Encabezado */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <Rss className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
            <p className="text-sm text-gray-500">Publicaciones exclusivas de los perfiles que sigues.</p>
          </div>
        </div>

        {!sesion ? (
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-orange-700">
            Inicia sesión para ver el feed de los perfiles que sigues.
          </div>
        ) : personalizedFeed.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
            Todavía no sigues perfiles con publicaciones recientes.
          </div>
        ) : (
          <div className="space-y-3">
            {personalizedFeed.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-gray-200 p-4 transition hover:border-orange-100 hover:shadow-sm"
              >
                {/* Autor */}
                <div className="flex items-center gap-3">
                  <Image
                    src={item.authorAvatar}
                    alt={item.authorName}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-orange-100"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.authorName}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString("es-CO")}
                    </p>
                  </div>
                </div>

                {/* Etiquetas */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`rounded-full px-2.5 py-1 font-semibold ${
                      kindStyle[item.kind] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {kindLabel[item.kind] ?? "Publicación"}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                    {item.category}
                  </span>
                </div>

                {/* Contenido */}
                <h3 className="mt-2 text-base font-bold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{item.summary}</p>

                <Link
                  href={item.href}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline"
                >
                  Ir a la publicación →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
