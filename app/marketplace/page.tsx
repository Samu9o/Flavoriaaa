"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Newspaper,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  UserCheck,
  UserPlus,
} from "lucide-react"
import { getLocaleForLanguage, useI18n } from "@/lib/i18n"
import { useUser } from "@/lib/userContext"

export default function HomePage() {
  const [search, setSearch] = useState("")
  const [feedback, setFeedback] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

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

  const restaurantOwners = useMemo(
    () => Object.fromEntries(communityUsers.map((user) => [user.id, user])),
    [communityUsers],
  )

  const filteredRestaurants = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return restaurants

    return restaurants.filter((restaurant) => {
      const menu = getMenuForRestaurant(restaurant.id)
      const searchableText = [
        restaurant.name,
        restaurant.description,
        restaurant.locality,
        restaurant.tags.join(" "),
        ...menu.flatMap((item) => [item.name, item.description, item.category]),
      ]
        .join(" ")
        .toLowerCase()

      return searchableText.includes(normalized)
    })
  }, [getMenuForRestaurant, restaurants, search])

  const suggestedCooks = communityUsers.filter(
    (user) => user.id !== currentUser?.id && user.platformRole !== "admin",
  )

  return (
    <div>
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr] lg:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-100">
                {t("home.badge")}
              </p>
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t("home.title")}</h1>
              <p className="mb-8 max-w-3xl text-lg text-orange-50">{t("home.subtitle")}</p>
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("home.searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border-0 py-3 pl-12 pr-4 text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
            </div>

            <div className="grid gap-3 rounded-3xl bg-white/10 p-5 backdrop-blur-sm">
              {[
                { label: t("home.stat.restaurants"), value: restaurants.length },
                { label: t("home.stat.orders"), value: orders.length },
                { label: t("home.stat.top"), value: topRestaurants[0]?.restaurantName ?? t("home.stat.empty") },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-orange-100">{item.label}</p>
                  <p className="mt-1 text-xl font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {feedback && (
          <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
            {feedback}
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-orange-500">
              <Store className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-wide">{t("home.card.publishTitle")}</p>
            </div>
            <p className="mt-2 text-sm text-gray-600">{t("home.card.publishBody")}</p>
            <Link href="/perfil" className="mt-4 inline-flex text-sm font-semibold text-orange-500 hover:underline">
              {t("home.card.publishCta")}
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-orange-500">
              <ShoppingBag className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-wide">{t("home.card.buyTitle")}</p>
            </div>
            <p className="mt-2 text-sm text-gray-600">{t("home.card.buyBody")}</p>
            <p className="mt-4 text-xs text-gray-500">{t("home.card.buyHint")}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-orange-500">
              <TrendingUp className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-wide">{t("home.card.trendsTitle")}</p>
            </div>
            <p className="mt-2 text-sm text-gray-600">{t("home.card.trendsBody")}</p>
            <Link href="/tendencias" className="mt-4 inline-flex text-sm font-semibold text-orange-500 hover:underline">
              {t("home.card.trendsCta")}
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-orange-500">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-wide">{t("home.card.aiTitle")}</p>
            </div>
            <p className="mt-2 text-sm text-gray-600">{t("home.card.aiBody")}</p>
            <Link href="/ia" className="mt-4 inline-flex text-sm font-semibold text-orange-500 hover:underline">
              {t("home.card.aiCta")}
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="space-y-5">
            {filteredRestaurants.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
                {t("home.noResults")}
              </div>
            ) : (
              filteredRestaurants.map((restaurant) => {
                const owner = restaurantOwners[restaurant.ownerUserId]
                const menu = getMenuForRestaurant(restaurant.id)

                return (
                  <article key={restaurant.id} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                    <div className="grid gap-0 lg:grid-cols-[1.1fr_1.4fr]">
                      <div className="relative min-h-[260px]">
                        <Image
                          src={restaurant.coverImage}
                          alt={restaurant.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 40vw"
                        />
                      </div>

                      <div className="p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                              {restaurant.locality}
                            </p>
                            <h2 className="text-2xl font-bold text-gray-900">{restaurant.name}</h2>
                            <p className="mt-2 text-sm text-gray-600">{restaurant.description}</p>
                            <p className="mt-3 text-xs text-gray-500">
                              {t("home.restaurant.publishedBy")} {owner?.name ?? "Restaurant"} ┬À {restaurant.address}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-orange-50 px-4 py-3 text-right text-sm text-orange-700">
                            <p className="font-semibold">
                              {topRestaurants.find((item) => item.restaurantId === restaurant.id)?.unitsSold ?? 0} {t("home.restaurant.sales")}
                            </p>
                            <p>
                              {menu.length} {t("home.restaurant.activeProducts")}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {restaurant.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-6 grid gap-3">
                          {menu.map((item) => {
                            const quantity = quantities[item.id] ?? 1
                            const canBuy = sesion && currentUser?.accountType === "consumer"

                            return (
                              <div key={item.id} className="rounded-2xl border border-gray-200 p-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
                                      {item.category}
                                    </p>
                                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900">
                                      {new Intl.NumberFormat(locale, {
                                        style: "currency",
                                        currency: "COP",
                                        maximumFractionDigits: 0,
                                      }).format(item.price)}
                                    </p>
                                    <p className="text-xs text-gray-500">{t("home.menu.unitPrice")}</p>
                                  </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                  <label className="text-sm text-gray-600">
                                    {t("home.menu.quantity")}
                                    <input
                                      type="number"
                                      min={1}
                                      value={quantity}
                                      onChange={(e) =>
                                        setQuantities((prev) => ({
                                          ...prev,
                                          [item.id]: Math.max(1, Number(e.target.value) || 1),
                                        }))
                                      }
                                      className="ml-2 w-20 rounded-lg border border-gray-200 px-2 py-1.5"
                                    />
                                  </label>

                                  <button
                                    onClick={() => {
                                      const result = buyMenuItem(item.id, quantity)
                                      setFeedback(
                                        result.ok
                                          ? t("home.feedback.purchaseSuccess", {
                                              item: item.name,
                                              quantity,
                                              restaurant: restaurant.name,
                                            })
                                          : result.error ?? t("home.feedback.purchaseError"),
                                      )
                                    }}
                                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                                      canBuy
                                        ? "bg-orange-500 text-white hover:bg-orange-600"
                                        : "cursor-not-allowed bg-gray-100 text-gray-400"
                                    }`}
                                    disabled={!canBuy}
                                  >
                                    {t("home.menu.buy")}
                                  </button>

                                  {!sesion && <p className="text-xs text-gray-500">{t("home.menu.signInToBuy")}</p>}
                                  {sesion && currentUser?.accountType === "restaurant" && (
                                    <p className="text-xs text-gray-500">{t("home.menu.switchToConsumer")}</p>
                                  )}
                                  {sesion && currentUser?.accountType === "admin" && (
                                    <p className="text-xs text-gray-500">{t("home.menu.adminCannotBuy")}</p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">{t("home.feed.badge")}</p>
                  <h2 className="text-xl font-bold text-gray-900">{t("home.feed.title")}</h2>
                </div>
                <Newspaper className="h-5 w-5 text-orange-500" />
              </div>

              {!sesion ? (
                <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50 p-5 text-sm text-orange-700">
                  {t("home.feed.signIn")}
                </div>
              ) : personalizedFeed.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">
                  {t("home.feed.empty")}
                </div>
              ) : (
                <div className="space-y-4">
                  {personalizedFeed.slice(0, 4).map((item) => (
                    <article key={item.id} className="rounded-2xl border border-gray-200 p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="rounded-full bg-orange-50 px-2 py-1 font-semibold text-orange-600">
                          {item.kind === "receta" ? t("home.feed.recipe") : t("home.feed.forum")}
                        </span>
                        <span>{item.authorName}</span>
                        <span>ÔÇó</span>
                        <span>{item.category}</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{item.summary}</p>
                      <Link href={item.href} className="mt-3 inline-flex text-sm font-semibold text-orange-500 hover:underline">
                        {t("home.feed.view")}
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">{t("home.network.badge")}</p>
                <h2 className="text-xl font-bold text-gray-900">{t("home.network.title")}</h2>
              </div>

              <div className="space-y-4">
                {suggestedCooks.slice(0, 4).map((cook) => {
                  const isFollowing = currentUser?.following.includes(cook.id) ?? false

                  return (
                    <div key={cook.id} className="rounded-2xl border border-gray-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{cook.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">{cook.bio}</p>
                        </div>
                        <button
                          onClick={() => {
                            const result = toggleFollowCook(cook.id)
                            setFeedback(
                              result.ok
                                ? isFollowing
                                  ? t("home.feedback.unfollowed", { name: cook.name })
                                  : t("home.feedback.followed", { name: cook.name })
                                : result.error ?? t("home.feedback.followError"),
                            )
                          }}
                          className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
                            isFollowing
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              : "bg-orange-500 text-white hover:bg-orange-600"
                          }`}
                        >
                          {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                          {isFollowing ? t("home.network.following") : t("home.network.follow")}
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {cook.specialtyTags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-bold text-gray-900">{t("home.purchases.title")}</h2>
              </div>

              {!sesion || currentUser?.accountType !== "consumer" ? (
                <p className="text-sm text-gray-500">{t("home.purchases.switch")}</p>
              ) : myConsumerOrders.length === 0 ? (
                <p className="text-sm text-gray-500">{t("home.purchases.empty")}</p>
              ) : (
                <div className="space-y-3">
                  {myConsumerOrders.slice(0, 4).map((order) => (
                    <div key={order.id} className="rounded-2xl border border-gray-200 p-4">
                      <p className="font-semibold text-gray-900">
                        {restaurants.find((restaurant) => restaurant.id === order.restaurantId)?.name}
                      </p>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString(locale)}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {order.quantity} {t("home.purchases.units")} ┬À {new Intl.NumberFormat(locale, {
                          style: "currency",
                          currency: "COP",
                          maximumFractionDigits: 0,
                        }).format(order.total)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
