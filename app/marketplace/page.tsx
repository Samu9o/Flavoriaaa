"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  MapPin,
  Newspaper,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  TrendingUp,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react"
import { getLocaleForLanguage, useI18n } from "@/lib/i18n"
import { useUser } from "@/lib/userContext"
import { restaurantesApi, type Restaurante } from "@/lib/api"

type Toast = { message: string; type: "success" | "error" }

export default function MarketplacePage() {
  const [search, setSearch] = useState("")
  const [toast, setToast] = useState<Toast | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [selectedLocality, setSelectedLocality] = useState<string>("all")
  const [expandedRestaurant, setExpandedRestaurant] = useState<string | null>(null)

  const [apiRestaurants, setApiRestaurants] = useState<Restaurante[]>([])
  const [apiLoading, setApiLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    sesion,
    currentUser,
    communityUsers,
    orders,
    topRestaurants,
    personalizedFeed,
    myConsumerOrders,
    toggleFollowCook,
  } = useUser()
  const { language, t } = useI18n()
  const locale = getLocaleForLanguage(language)

  useEffect(() => {
    restaurantesApi.getAll()
      .then(setApiRestaurants)
      .catch(() => setApiError("No se pudo conectar al servidor. Revisa que el backend esté corriendo."))
      .finally(() => setApiLoading(false))
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type })

  const localities = useMemo(
    () => Array.from(new Set(apiRestaurants.map((r) => r.localidad).filter(Boolean))).sort(),
    [apiRestaurants],
  )

  const filteredRestaurants = useMemo(() => {
    let list = apiRestaurants
    if (selectedLocality !== "all") list = list.filter((r) => r.localidad === selectedLocality)
    const q = search.trim().toLowerCase()
    if (!q) return list
    return list.filter((r) =>
      [r.nombre, r.descripcion, r.localidad, r.categorias.join(" "),
        ...r.menu.flatMap((m) => [m.nombre, m.descripcion, m.categoria])]
        .join(" ").toLowerCase().includes(q)
    )
  }, [apiRestaurants, search, selectedLocality])

  const suggestedCooks = communityUsers.filter(
    (u) => u.id !== currentUser?.id && u.platformRole !== "admin",
  )

  const adjustQty = (itemId: string, delta: number) =>
    setQuantities((prev) => ({ ...prev, [itemId]: Math.max(1, (prev[itemId] ?? 1) + delta) }))

  const handleBuy = (itemName: string, restaurantName: string, itemId: string, quantity: number) => {
    if (!sesion) { showToast(t("home.menu.signInToBuy"), "error"); return }
    if (currentUser?.accountType !== "consumer") { showToast(t("home.menu.switchToConsumer"), "error"); return }
    showToast(`Pedido enviado: ${quantity}x ${itemName} de ${restaurantName}`, "success")
    setQuantities((prev) => ({ ...prev, [itemId]: 1 }))
  }

  const getFeedTypeLabel = (kind: string) => {
    if (kind === "receta") return t("home.feed.recipe")
    if (kind === "foro") return t("home.feed.forum")
    if (kind === "video") return t("home.feed.video")
    return t("home.feed.post")
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-sm transition-all ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {toast.type === "success"
            ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
            : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button onClick={() => setToast(null)} className="shrink-0 opacity-50 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Hero oscuro */}
      <div className="hero-dark py-14 text-white">
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr] lg:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-400">
                {t("home.badge")}
              </p>
              <h1 className="mb-4 text-4xl font-black md:text-5xl">{t("home.title")}</h1>
              <p className="mb-8 max-w-2xl text-lg text-gray-400">{t("home.subtitle")}</p>

              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("home.searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border-0 bg-white/10 py-4 pl-12 pr-10 text-white placeholder-gray-500 outline-none ring-1 ring-white/20 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 transition"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: Store, label: t("home.stat.restaurants"), value: apiLoading ? "…" : apiRestaurants.length },
                { icon: ShoppingBag, label: t("home.stat.orders"), value: orders.length },
                { icon: TrendingUp, label: t("home.stat.top"), value: topRestaurants[0]?.restaurantName ?? "—" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <s.icon className="h-8 w-8 shrink-0 text-orange-400" />
                  <div>
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className="text-lg font-bold text-white">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de localidad */}
      {localities.length > 0 && (
        <div className="sticky top-16 z-30 border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3">
              <MapPin className="h-4 w-4 shrink-0 text-orange-400" />
              {(["all", ...localities] as string[]).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocality(loc)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    selectedLocality === loc
                      ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                      : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  {loc === "all" ? "Todos" : loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        {/* Info cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Store, title: t("home.card.publishTitle"), body: t("home.card.publishBody"), cta: t("home.card.publishCta"), href: "/perfil", color: "text-orange-500", bg: "bg-orange-50" },
            { icon: ShoppingBag, title: t("home.card.buyTitle"), body: t("home.card.buyBody"), cta: null, href: null, color: "text-red-500", bg: "bg-red-50" },
            { icon: TrendingUp, title: t("home.card.trendsTitle"), body: t("home.card.trendsBody"), cta: t("home.card.trendsCta"), href: "/tendencias", color: "text-green-600", bg: "bg-green-50" },
            { icon: Sparkles, title: t("home.card.aiTitle"), body: t("home.card.aiBody"), cta: t("home.card.aiCta"), href: "/ia", color: "text-orange-500", bg: "bg-orange-50" },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="text-sm font-bold text-gray-900">{card.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{card.body}</p>
              {card.href && card.cta && (
                <Link href={card.href} className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${card.color} hover:underline`}>
                  {card.cta} →
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Lista de restaurantes */}
          <section>
            {apiLoading && (
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
                <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
                <p className="font-semibold text-gray-400">Cargando restaurantes…</p>
              </div>
            )}

            {!apiLoading && apiError && (
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-red-100 bg-red-50 py-20 text-center px-8">
                <AlertCircle className="mb-3 h-10 w-10 text-red-300" />
                <p className="font-semibold text-red-500">{apiError}</p>
                <p className="mt-1 text-sm text-red-400">Asegúrate de correr el backend con <code className="bg-red-100 px-1 rounded">npm run start:dev</code></p>
              </div>
            )}

            {!apiLoading && !apiError && filteredRestaurants.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
                <ShoppingCart className="mb-3 h-12 w-12 text-gray-200" />
                <p className="font-semibold text-gray-400">{t("home.noResults")}</p>
              </div>
            )}

            {!apiLoading && !apiError && filteredRestaurants.length > 0 && (
              <div className="space-y-5">
                {filteredRestaurants.map((restaurant) => {
                  const isExpanded = expandedRestaurant === restaurant.id
                  return (
                    <article key={restaurant.id} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
                      {/* Imagen panorámica */}
                      <div className="relative h-52 w-full overflow-hidden">
                        <Image
                          src={restaurant.imagen}
                          alt={restaurant.nombre}
                          fill
                          className="object-cover transition duration-500 hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 65vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        <div className="absolute left-4 top-4 flex gap-2">
                          <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow">
                            {restaurant.localidad}
                          </span>
                          <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                            ⭐ {restaurant.calificacion}
                          </span>
                        </div>

                        <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                          🕐 {restaurant.tiempoEntrega}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h2 className="text-2xl font-black text-white drop-shadow-lg">{restaurant.nombre}</h2>
                          <p className="text-sm text-gray-300">{restaurant.direccion}</p>
                        </div>
                      </div>

                      {/* Cuerpo */}
                      <div className="p-5">
                        <p className="text-sm leading-relaxed text-gray-600">{restaurant.descripcion}</p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {restaurant.categorias.map((cat) => (
                            <span key={cat} className="badge-orange">{cat}</span>
                          ))}
                        </div>

                        <button
                          onClick={() => setExpandedRestaurant(isExpanded ? null : restaurant.id)}
                          className={`mt-4 flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition ${
                            isExpanded
                              ? "bg-orange-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            {isExpanded ? "Cerrar menú" : `Ver menú (${restaurant.menu.length} productos)`}
                          </span>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {isExpanded && (
                          <div className="mt-4 space-y-3">
                            {restaurant.menu.map((item) => {
                              const quantity = quantities[item.id] ?? 1
                              const canBuy = sesion && currentUser?.accountType === "consumer"
                              const subtotal = item.precio * quantity

                              return (
                                <div key={item.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-orange-100">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <span className="badge-orange mb-1">{item.categoria}</span>
                                      <h3 className="mt-1 font-bold text-gray-900">{item.nombre}</h3>
                                      <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">{item.descripcion}</p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                      <p className="text-xl font-black text-gray-900">
                                        {new Intl.NumberFormat(locale, { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(item.precio)}
                                      </p>
                                      {quantity > 1 && (
                                        <p className="text-xs font-semibold text-green-600">
                                          Total: {new Intl.NumberFormat(locale, { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(subtotal)}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="mt-3 flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
                                      <button onClick={() => adjustQty(item.id, -1)} className="flex h-7 w-7 items-center justify-center rounded-lg text-lg font-bold text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition leading-none" aria-label="Reducir">−</button>
                                      <span className="w-8 text-center text-sm font-bold text-gray-900">{quantity}</span>
                                      <button onClick={() => adjustQty(item.id, 1)} className="flex h-7 w-7 items-center justify-center rounded-lg text-lg font-bold text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition leading-none" aria-label="Aumentar">+</button>
                                    </div>

                                    <button
                                      disabled={!canBuy}
                                      onClick={() => handleBuy(item.nombre, restaurant.nombre, item.id, quantity)}
                                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                                        canBuy
                                          ? "bg-orange-500 text-white hover:bg-orange-600 shadow-sm active:scale-95"
                                          : "cursor-not-allowed bg-gray-100 text-gray-400"
                                      }`}
                                    >
                                      <ShoppingCart className="h-4 w-4" />
                                      {t("home.menu.buy")}
                                    </button>

                                    {!sesion && <p className="text-xs text-gray-400">{t("home.menu.signInToBuy")}</p>}
                                    {sesion && currentUser?.accountType === "restaurant" && (
                                      <p className="text-xs text-gray-400">{t("home.menu.switchToConsumer")}</p>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Feed */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-3.5">
                <Newspaper className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">{t("home.feed.badge")}</p>
                  <p className="text-sm font-bold text-gray-900">{t("home.feed.title")}</p>
                </div>
              </div>
              <div className="p-4">
                {!sesion ? (
                  <p className="rounded-xl bg-orange-50 p-3 text-xs text-orange-700">{t("home.feed.signIn")}</p>
                ) : personalizedFeed.length === 0 ? (
                  <p className="rounded-xl bg-gray-50 p-3 text-xs text-gray-500">{t("home.feed.empty")}</p>
                ) : (
                  <div className="space-y-3">
                    {personalizedFeed.slice(0, 4).map((item) => (
                      <div key={item.id} className="rounded-xl border border-gray-100 p-3">
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          <span className="badge-orange">{getFeedTypeLabel(item.kind)}</span>
                          <span className="text-xs text-gray-400">{item.authorName}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-2">{item.title}</p>
                        <Link href={item.href} className="mt-1 inline-flex text-xs font-semibold text-orange-500 hover:underline">
                          {t("home.feed.view")} →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Network */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-3.5">
                <UserPlus className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-600">{t("home.network.badge")}</p>
                  <p className="text-sm font-bold text-gray-900">{t("home.network.title")}</p>
                </div>
              </div>
              <div className="divide-y divide-gray-50 p-2">
                {suggestedCooks.slice(0, 4).map((cook) => {
                  const isFollowing = currentUser?.following.includes(cook.id) ?? false
                  return (
                    <div key={cook.id} className="flex items-start justify-between gap-2 p-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{cook.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-2">{cook.bio}</p>
                      </div>
                      <button
                        onClick={() => {
                          const result = toggleFollowCook(cook.id)
                          showToast(
                            result.ok
                              ? isFollowing ? t("home.feedback.unfollowed", { name: cook.name }) : t("home.feedback.followed", { name: cook.name })
                              : (result.error ?? t("home.feedback.followError")),
                            result.ok ? "success" : "error",
                          )
                        }}
                        className={`shrink-0 flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
                          isFollowing
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {isFollowing ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                        {isFollowing ? t("home.network.following") : t("home.network.follow")}
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Historial */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-3.5">
                <ShoppingBag className="h-4 w-4 text-red-500" />
                <p className="text-sm font-bold text-gray-900">{t("home.purchases.title")}</p>
              </div>
              <div className="p-4">
                {!sesion || currentUser?.accountType !== "consumer" ? (
                  <p className="text-xs text-gray-400">{t("home.purchases.switch")}</p>
                ) : myConsumerOrders.length === 0 ? (
                  <p className="text-xs text-gray-400">{t("home.purchases.empty")}</p>
                ) : (
                  <div className="space-y-2">
                    {myConsumerOrders.slice(0, 5).map((order) => {
                      const r = apiRestaurants.find((x) => x.id === order.restaurantId)
                      return (
                        <div key={order.id} className="rounded-xl border border-gray-100 p-3">
                          <p className="text-sm font-bold text-gray-900">{r?.nombre ?? order.restaurantId}</p>
                          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString(locale)}</p>
                          <p className="mt-1 text-xs text-gray-600">
                            {order.quantity} {t("home.purchases.units")} ·{" "}
                            <span className="font-bold text-orange-600">
                              {new Intl.NumberFormat(locale, { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(order.total)}
                            </span>
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
