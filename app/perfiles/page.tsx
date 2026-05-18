"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { UserCheck, UserPlus, Users } from "lucide-react"
import { COMMUNITY_FEED_ITEMS } from "@/lib/communitySeed"
import { useUser } from "@/lib/userContext"

const accountLabel: Record<string, string> = {
  admin: "Administrador",
  consumer: "Consumidor",
  restaurant: "Restaurante",
}

const accountBadgeStyle: Record<string, string> = {
  admin:      "bg-red-50 text-red-700",
  restaurant: "bg-orange-50 text-orange-700",
  consumer:   "bg-green-50 text-green-700",
}

export default function PerfilesPage() {
  const { sesion, currentUser, communityUsers, getFollowersFor, toggleFollowCook } = useUser()
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "info">("info")

  const profiles = useMemo(
    () => communityUsers.filter((user) => user.id !== currentUser?.id),
    [communityUsers, currentUser?.id],
  )

  const publicationCountByUser = useMemo(() => {
    return COMMUNITY_FEED_ITEMS.reduce<Record<string, number>>((acc, item) => {
      acc[item.authorId] = (acc[item.authorId] ?? 0) + 1
      return acc
    }, {})
  }, [])

  const onToggleFollow = (targetUserId: string, targetName: string, isFollowing: boolean) => {
    const result = toggleFollowCook(targetUserId)
    if (!result.ok) {
      setMessage(result.error ?? "No fue posible actualizar el seguimiento")
      setMessageType("info")
      return
    }
    setMessage(isFollowing ? `Dejaste de seguir a ${targetName}.` : `Ahora sigues a ${targetName}.`)
    setMessageType(isFollowing ? "info" : "success")
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Mensaje de feedback */}
      {message && (
        <div
          className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
            messageType === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-orange-200 bg-orange-50 text-orange-700"
          }`}
        >
          {message}
        </div>
      )}

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Encabezado */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Perfiles de la comunidad</h1>
            <p className="text-sm text-gray-500">Aquí solo ves los perfiles de los demás usuarios.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {profiles.map((user) => {
            const isFollowing = currentUser?.following.includes(user.id) ?? false
            return (
              <article
                key={user.id}
                className="rounded-2xl border border-gray-200 p-4 transition hover:border-orange-200 hover:shadow-sm"
              >
                {/* Avatar + nombre */}
                <div className="flex items-center gap-3">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-orange-100"
                  />
                  <div>
                    <h2 className="font-bold text-gray-900">{user.name}</h2>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        accountBadgeStyle[user.accountType] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {accountLabel[user.accountType]}
                    </span>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-gray-600">{user.bio}</p>

                {/* Estadísticas */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-orange-50 px-2 py-1.5 text-orange-700">
                    <strong className="text-orange-900">{publicationCountByUser[user.id] ?? 0}</strong>{" "}
                    publicaciones
                  </div>
                  <div className="rounded-lg bg-green-50 px-2 py-1.5 text-green-700">
                    <strong className="text-green-900">{getFollowersFor(user.id)}</strong> seguidores
                  </div>
                </div>

                {/* Acciones */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/perfil/${user.id}`}
                    className="inline-flex rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-95"
                  >
                    Ver perfil
                  </Link>
                  {sesion && (
                    <button
                      type="button"
                      onClick={() => onToggleFollow(user.id, user.name, isFollowing)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition active:scale-95 ${
                        isFollowing
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {isFollowing ? (
                        <UserCheck className="h-4 w-4" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                      {isFollowing ? "Siguiendo" : "Seguir"}
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
