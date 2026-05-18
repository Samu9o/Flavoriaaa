"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, UserPlus } from "lucide-react"
import { COMMUNITY_FEED_ITEMS } from "@/lib/communitySeed"
import { useUser } from "@/lib/userContext"

const publicationTypeLabel: Record<string, string> = {
  receta: "Receta",
  foro: "Foro",
  video: "Video",
  publicacion: "Publicación",
}

const roleLabel: Record<string, string> = {
  admin: "Administrador",
  moderator: "Moderador",
  support: "Soporte",
  user: "Usuario",
}

const accountLabel: Record<string, string> = {
  admin: "Administrador",
  consumer: "Consumidor",
  restaurant: "Restaurante",
}

const expertiseLabel: Record<string, string> = {
  foodie: "Foodie",
  pro_curious: "Pro Curious",
  chef: "Chef",
}

export default function PerfilDetallePage() {
  const params = useParams<{ id: string }>()
  const profileId = params?.id ?? ""
  const { sesion, currentUser, communityUsers, getFollowersFor, toggleFollowCook } = useUser()
  const [message, setMessage] = useState<string | null>(null)

  const profile = useMemo(
    () => communityUsers.find((user) => user.id === profileId) ?? null,
    [communityUsers, profileId],
  )

  const profileFeed = useMemo(
    () => COMMUNITY_FEED_ITEMS.filter((item) => item.authorId === profileId),
    [profileId],
  )

  if (!profile) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Perfil no encontrado</h1>
          <p className="mt-2 text-sm text-gray-600">No existe un usuario con el identificador solicitado.</p>
          <Link
            href="/perfil"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a perfiles
          </Link>
        </div>
      </main>
    )
  }

  const isSelf = currentUser?.id === profile.id
  const isFollowing = currentUser?.following.includes(profile.id) ?? false

  const onToggleFollow = () => {
    const result = toggleFollowCook(profile.id)
    if (!result.ok) {
      setMessage(result.error ?? "No fue posible completar la acción")
      return
    }

    setMessage(isFollowing ? `Dejaste de seguir a ${profile.name}.` : `Ahora sigues a ${profile.name}.`)
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {message && (
        <div className="mb-5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          {message}
        </div>
      )}

      <Link href="/perfil" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver a perfiles
      </Link>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={profile.avatar}
              alt={profile.name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full border-4 border-orange-100 object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-orange-50 px-2 py-1 font-semibold text-orange-600">
                  {roleLabel[profile.platformRole]}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold text-gray-700">
                  {accountLabel[profile.accountType]}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold text-gray-700">
                  {expertiseLabel[profile.expertiseRole]}
                </span>
              </div>
            </div>
          </div>

          {sesion && !isSelf && (
            <button
              type="button"
              onClick={onToggleFollow}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              <UserPlus className="h-4 w-4" />
              {isFollowing ? "Dejar de seguir" : "Seguir perfil"}
            </button>
          )}
        </div>

        <p className="mt-4 text-sm text-gray-700">{profile.bio}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-gray-50 p-4 text-center">
            <p className="text-xl font-bold text-orange-500">{profileFeed.length}</p>
            <p className="text-xs text-gray-500">Publicaciones</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-4 text-center">
            <p className="text-xl font-bold text-orange-500">{getFollowersFor(profile.id)}</p>
            <p className="text-xs text-gray-500">Seguidores</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-4 text-center">
            <p className="text-xl font-bold text-orange-500">{profile.following.length}</p>
            <p className="text-xs text-gray-500">Siguiendo</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {profile.specialtyTags.map((tag) => (
            <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Publicaciones de {profile.name}</h2>
        <p className="mt-1 text-sm text-gray-500">Aquí solo se muestran las publicaciones hechas por este perfil.</p>

        <div className="mt-4 space-y-3">
          {profileFeed.length === 0 ? (
            <p className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">Este perfil todavía no tiene publicaciones.</p>
          ) : (
            profileFeed.map((item) => (
              <article key={item.id} className="rounded-2xl border border-gray-200 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-orange-50 px-2 py-1 font-semibold text-orange-600">
                    {publicationTypeLabel[item.kind] ?? "Publicación"}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">{item.category}</span>
                  <span className="text-gray-500">{new Date(item.createdAt).toLocaleDateString("es-CO")}</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{item.summary}</p>
                <Link href={item.href} className="mt-3 inline-flex text-sm font-semibold text-orange-600 hover:underline">
                  Ir a la publicación
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
