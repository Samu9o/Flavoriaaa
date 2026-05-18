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

type Toast = { message: string; type: "success" | "error" }

export default function MarketplacePage() {
  const [search, setSearch] = useState("")
  const [toast, setToast] = useState<Toast | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [selectedLocality, setSelectedLocality] = useState<string>("all")
  const [expandedRestaurant, setExpandedRestaurant] = useState<string | null>(null)

  const {
    sesion,
    currentUser,
    communityUsers,
    restaurants,
    orders,
    topRestaurants,
    personalizedFeed,
    myConsumerOrders,
    getMenuForRestaurant,
    buyMenuItem,
    toggleFollowCook,
  } = useUser()
  const { language, t } = useI18n()
  const locale = getLocaleForLanguage(language)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type })

  const restaurantOwners = useMemo(
    () => Object.fromEntries(communityUsers.map((u) => [u.id, u])),
    [communityUsers],
  )

  const localities = useMemo(
    () => Array.from(new Set(restaurants.map((r) => r.locality).filter(Boolean))).sort(),
    [restaurants],
  )

  const filteredRestaurants = useMemo(() => {
    let list = restaurants
    if (selectedLocality !== "all") list = list.filter((r) => r.locality === selectedLocality)
    const q = search.trim().toLowerCase()
    if (!q) return list
    return list.filter((r) => {
      const menu = getMenuForRestaurant(r.id)
      return [r.name, r.description, r.locality, r.tags.join(" "), ...menu.flatMap((m) => [m.name, m.description, m.category])]
        .join(" ")
        .toLowerCase()
        .includes(q)
    })
  }, [getMenuForRestaurant, restaurants, search, selectedLocality])

  const suggestedCooks = communityUsers.filter(
    (u) => u.id !== currentUser?.id && u.platformRole !== "admin",
  )

  const adjustQty = (itemId: string, delta: number) =>
    setQuantities((prev) => ({ ...prev, [itemId]: Math.max(1, (prev[itemId] ?? 1) + delta) }))

  const getFeedTypeLabel = (kind: string) => {
    if (kind === "receta") return t("home.feed.recipe")
    if (kind === "foro") return t("home.feed.forum")
    if (kind === "video") return t("home.feed.video")
    return t("home.feed.post")
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* ─── Toast ─── */}
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

      {/* ─── Hero oscuro ─── */}
      <div className="hero-dark py-14 text-white">
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr] lg:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-400">
                {t("home.badge")}
              </p>
              <h1 className="mb-4 text-4xl font-black md:text-5xl">{t("home.title")}</h1>
              <p className="mb-8 max-w-2xl text-lg text-gray-400">{t("home.subtitle")}</p>

              {/* Search */}
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
                { icon: Store, label: t("home.stat.restaurants"), value: restaurants.length },
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

      {/* ─── Filtros de localidad ─── */}
      {localities.length > 0 && (
        <div className="sticky top-16 z-30 border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3">
              <MapPin className="h-4 w-4 shrink-0 text-orange-400" />
              {["all", ...localities].map((loc) => (
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
        {/* ─── Info cards ─── */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Store, title: t("home.card.publishTitle"), body: t("home.card.publishBody"), cta: t("home.card.publishCta"), href: "/perfil", color: "text-orange-500", bg: "bg-orange-50" },
            { icon: ShoppingBag, title: t("home.card.buyTitle"), body: t("home.card.buyBody"), cta: null, href: null, color: "text-red-500", bg: "bg-red-50" },
            { icon: TrendingUp, title: t("home.card.trendsTitle"), body: t("home.card.trendsBody"), cta: t("home.card.trendsCta"), href: "/tendencias", color: "text-green-600", bg: "bg-green-50" },
            { icon: Sparkles, title: t("home.card.aiTitle"), body: t("home.card.aiBody"), cta: t("home.card.aiCta"), href: "/ia", color: "text-orange-500", bg: "bg-orange-50" },
          ].map((card) => (
            <div key={card.title} className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm`}>
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
          {/* ─── Lista de restaurantes ─── */}
          <section>
            {filteredRestaurants.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
                <ShoppingCart className="mb-3 h-12 w-12 text-gray-200" />
                <p className="font-semibold text-gray-400">{t("home.noResults")}</p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredRestaurants.map((restaurant) => {
                  const owner = restaurantOwners[restaurant.ownerUserId]
                  const menu = getMenuForRestaurant(restaurant.id)
                  const salesData = topRestaurants.find((x) => x.restaurantId === restaurant.id)
                  const isExpanded = expandedRestaurant === restaurant.id

                  return (
                    <article key={restaurant.id} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
                      {/* Imagen panorámica */}
                      <div className="relative h-52 w-full overflow-hidden">
                        <Image
                          src={restaurant.coverImage}
                          alt={restaurant.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 65vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Badges sobre imagen */}
                        <div className="absolute left-4 top-4 flex gap-2">
                          <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow">
                            {restaurant.locality}
                          </span>
                        </div>
                        {salesData && salesData.unitsSold > 0 && (
                          <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                            🔥 {salesData.unitsSold} vendidos
                          </div>
                        )}

                        {/* Nombre sobre imagen */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h2 className="text-2xl font-black text-white drop-shadow-lg">{restaurant.name}</h2>
                          <p className="text-sm text-gray-300">
                            {owner?.name ?? "Restaurante"} · {restaurant.address}
                          </p>
                        </div>
                      </div>

                      {/* Cuerpo */}
                      <div className="p-5">
                        <p className="text-sm leading-relaxed text-gray-600">{restaurant.description}</p>

                        {/* Tags */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {restaurant.tags.map((tag) => (
                            <span key={tag} className="badge-orange">{tag}</span>
                          ))}
                        </div>

                        {/* Botón toggle menú */}
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
                            {isExpanded ? "Cerrar menú" : `Ver menú (${menu.length} productos)`}
                          </span>
                          {isExpanded
                            ? <ChevronUp className="h-4 w-4" />
                            : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {/* Menú expandible */}
                        {isExpanded && (
                          <div className="mt-4 space-y-3">
                            {menu.map((item) => {
                              const quantity = quantities[item.id] ?? 1
                              const canBuy = sesion && currentUser?.accountType === "consumer"
                              const subtotal = item.price * quantity

                              return (
                                <div
                                  key={item.id}
                                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-orange-100"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <span className="badge-orange mb-1">{item.category}</span>
                                      <h3 className="mt-1 font-bold text-gray-900">{item.name}</h3>
                                      <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                      <p className="text-xl font-black text-gray-900">
                                        {new Intl.NumberFormat(locale, { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(item.price)}
                                      </p>
                                      {quantity > 1 && (
                                        <p className="text-xs font-semibold text-green-600">
                                          Total: {new Intl.NumberFormat(locale, { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(subtotal)}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Controles */}
                                  <div className="mt-3 flex flex-wrap items-center gap-3">
                                    {/* +/- */}
                                    <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
                                      <button
                                        onClick={() => adjustQty(item.id, -1)}
                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-lg font-bold text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition leading-none"
                                        aria-label="Reducir"
                                      >−</button>
                                      <span className="w-8 text-center text-sm font-bold text-gray-900">{quantity}</span>
                                      <button
                                        onClick={() => adjustQty(item.id, 1)}
                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-lg font-bold text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition leading-none"
                                        aria-label="Aumentar"
                                      >+</button>
                                    </div>

                                    {/* Comprar */}
                                    <button
                                      disabled={!canBuy}
                                      onClick={() => {
                                        const result = buyMenuItem(item.id, quantity)
                                        if (result.ok) {
                                          showToast(t("home.feedback.purchaseSuccess", { item: item.name, quantity, restaurant: restaurant.name }), "success")
                                          setQuantities((prev) => ({ ...prev, [item.id]: 1 }))
                                        } else {
                                          showToast(result.error ?? t("home.feedback.purchaseError"), "error")
                                        }
                                      }}
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
                                    {sesion && currentUser?.accountType === "admin" && (
                                      <p className="text-xs text-gray-400">{t("home.menu.adminCannotBuy")}</p>
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

          {/* ─── Sidebar ─── */}
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
                    {myConsumerOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="rounded-xl border border-gray-100 p-3">
                        <p className="text-sm font-bold text-gray-900">
                          {restaurants.find((r) => r.id === order.restaurantId)?.name}
                        </p>
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString(locale)}</p>
                        <p className="mt-1 text-xs text-gray-600">
                          {order.quantity} {t("home.purchases.units")} ·{" "}
                          <span className="font-bold text-orange-600">
                            {new Intl.NumberFormat(locale, { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(order.total)}
                          </span>
                        </p>
                      </div>
                    ))}
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
