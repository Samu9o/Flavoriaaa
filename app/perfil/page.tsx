"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Building2, Save, ShieldCheck, ShoppingBag, Store, Tag, UserRoundPlus } from "lucide-react"
import { SPECIALTY_CATALOG } from "@/lib/communitySeed"
import { normalizeSpecialtyTags, type AccountType, type ExpertiseRole } from "@/lib/communityLogic"
import { useUser } from "@/lib/userContext"

const niveles = ["basico", "bronce", "plata", "oro", "platino"]
const bogotaLocalities = [
  "Usaquén",
  "Chapinero",
  "Teusaquillo",
  "Suba",
  "Engativá",
  "Fontibón",
  "Kennedy",
  "Bosa",
  "San Cristóbal",
  "Usme",
]

const roleLabel: Record<string, string> = {
  admin: "Administrador",
  moderator: "Moderador",
  support: "Soporte",
  user: "Usuario",
}

const expertiseLabel: Record<ExpertiseRole, string> = {
  foodie: "Foodie",
  pro_curious: "Pro Curious",
  chef: "Chef",
}

const accountLabel: Record<AccountType, string> = {
  admin: "Administrador",
  consumer: "Consumidor",
  restaurant: "Restaurante",
}

export default function PerfilPage() {
  const {
    sesion,
    currentUser,
    communityUsers,
    state,
    nivel,
    puntosParaSiguiente,
    progresoPorcentaje,
    registerProfile,
    saveProfile,
    assignRole,
    getFollowersFor,
    myRestaurants,
    myConsumerOrders,
    myRestaurantOrders,
    createRestaurantProfile,
    createMenuOffer,
    getMenuForRestaurant,
    getRestaurantName,
    getMenuItemName,
  } = useUser()

  const [feedback, setFeedback] = useState<string | null>(null)
  const [customTag, setCustomTag] = useState("")
  const [restaurantTagsInput, setRestaurantTagsInput] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    expertiseRole: "foodie" as ExpertiseRole,
    specialtyTags: [] as string[],
    accountType: "consumer" as AccountType,
  })
  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    description: "",
    locality: "Chapinero",
    address: "",
    coverImage: "",
  })
  const [menuForm, setMenuForm] = useState({
    restaurantId: "",
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  })

  useEffect(() => {
    if (sesion && currentUser) {
      setForm({
        name: currentUser.name,
        email: currentUser.email,
        bio: currentUser.bio,
        expertiseRole: currentUser.expertiseRole,
        specialtyTags: currentUser.specialtyTags,
        accountType: currentUser.accountType === "admin" ? "admin" : currentUser.accountType,
      })
      return
    }

    setForm({
      name: "",
      email: "",
      bio: "",
      expertiseRole: "foodie",
      specialtyTags: [],
      accountType: "consumer",
    })
  }, [sesion, currentUser])

  useEffect(() => {
    if (!menuForm.restaurantId && myRestaurants[0]) {
      setMenuForm((prev) => ({ ...prev, restaurantId: myRestaurants[0].id }))
    }
  }, [menuForm.restaurantId, myRestaurants])

  const stats = useMemo(() => {
    if (!currentUser) {
      return {
        siguiendo: 0,
        seguidores: 0,
        restaurantes: 0,
      }
    }

    return {
      siguiendo: currentUser.following.length,
      seguidores: getFollowersFor(currentUser.id),
      restaurantes: myRestaurants.length,
    }
  }, [currentUser, getFollowersFor, myRestaurants.length])

  const onToggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      specialtyTags: prev.specialtyTags.includes(tag)
        ? prev.specialtyTags.filter((currentTag) => currentTag !== tag)
        : normalizeSpecialtyTags([...prev.specialtyTags, tag]),
    }))
  }

  const onAddCustomTag = () => {
    const normalized = normalizeSpecialtyTags([...form.specialtyTags, customTag])
    setForm((prev) => ({
      ...prev,
      specialtyTags: normalized,
    }))
    setCustomTag("")
  }

  const handleProfileSubmit = () => {
    const payload = {
      ...form,
      accountType: form.accountType === "admin" ? currentUser?.accountType ?? "admin" : form.accountType,
    }
    const action = sesion ? saveProfile(payload) : registerProfile(payload)
    setFeedback(
      action.ok
        ? sesion
          ? "Perfil actualizado correctamente."
          : "Registro completado y sesión iniciada."
        : action.error ?? "No fue posible guardar la información",
    )
  }

  const handleRestaurantSubmit = () => {
    const result = createRestaurantProfile({
      ...restaurantForm,
      tags: restaurantTagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    })

    setFeedback(
      result.ok
        ? `Restaurante ${restaurantForm.name} creado correctamente.`
        : result.error ?? "No fue posible crear el restaurante",
    )

    if (result.ok) {
      setRestaurantForm({
        name: "",
        description: "",
        locality: "Chapinero",
        address: "",
        coverImage: "",
      })
      setRestaurantTagsInput("")
    }
  }

  const handleMenuSubmit = () => {
    const result = createMenuOffer({
      restaurantId: menuForm.restaurantId,
      name: menuForm.name,
      description: menuForm.description,
      price: Number(menuForm.price),
      category: menuForm.category,
      image: menuForm.image,
    })

    setFeedback(
      result.ok
        ? `Producto ${menuForm.name} publicado correctamente.`
        : result.error ?? "No fue posible publicar el producto",
    )

    if (result.ok) {
      setMenuForm((prev) => ({
        ...prev,
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      }))
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {feedback && (
        <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          {feedback}
        </div>
      )}

      <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <Image
            src={currentUser?.avatar ?? "https://i.pravatar.cc/150?img=5"}
            alt={currentUser?.name ?? "Usuario nuevo"}
            width={100}
            height={100}
            className="h-20 w-20 rounded-full border-4 border-orange-100 object-cover"
          />

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {currentUser?.name ?? "Crea tu perfil en Flavoria Market"}
                </h1>
                <p className="text-sm text-gray-500">
                  {currentUser?.bio ??
                    "Regístrate como restaurante o consumidor para publicar, comprar y participar en la comunidad."}
                </p>
              </div>
              {sesion && currentUser && (
                <>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    {roleLabel[currentUser.platformRole]}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {accountLabel[currentUser.accountType]}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {expertiseLabel[currentUser.expertiseRole]}
                  </span>
                </>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {(currentUser?.specialtyTags ?? []).map((tag) => (
                <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Siguiendo", value: stats.siguiendo },
                { label: "Seguidores", value: stats.seguidores },
                { label: "Restaurantes", value: stats.restaurantes },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-2xl bg-gray-50 p-4 text-center">
                  <p className="text-xl font-bold text-orange-500">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 md:w-[280px]">
            <div className="mb-3 flex items-center gap-2 text-orange-600">
              <Tag className="h-5 w-5" />
              <p className="font-semibold">Nivel y reputación</p>
            </div>
            <p className="text-2xl font-bold capitalize text-gray-900">{nivel}</p>
            <p className="text-sm text-gray-500">{state.puntos} puntos acumulados</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-orange-500" style={{ width: `${progresoPorcentaje}%` }} />
            </div>
            <p className="mt-2 text-xs text-gray-500">Faltan {puntosParaSiguiente} puntos para el siguiente nivel.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {niveles.map((currentNivel) => {
                const alcanzado = niveles.indexOf(currentNivel) <= niveles.indexOf(nivel)
                return (
                  <span
                    key={currentNivel}
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      alcanzado ? "bg-white text-orange-600" : "bg-white/70 text-gray-400"
                    }`}
                  >
                    {currentNivel}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <UserRoundPlus className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">HU02</p>
              <h2 className="text-xl font-bold text-gray-900">
                {sesion ? "Gestiona tu perfil" : "Regístrate en la plataforma"}
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Nombre
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Correo
              <input
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>

            <label className="text-sm font-medium text-gray-700 md:col-span-2">
              Biografía
              <textarea
                value={form.bio}
                onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Nivel de experticia
              <select
                value={form.expertiseRole}
                onChange={(e) => setForm((prev) => ({ ...prev, expertiseRole: e.target.value as ExpertiseRole }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
              >
                <option value="foodie">Foodie</option>
                <option value="pro_curious">Pro Curious</option>
                <option value="chef">Chef</option>
              </select>
            </label>

            <label className="text-sm font-medium text-gray-700">
              Tipo de cuenta
              <select
                value={form.accountType}
                onChange={(e) => setForm((prev) => ({ ...prev, accountType: e.target.value as AccountType }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                disabled={currentUser?.accountType === "admin"}
              >
                {currentUser?.accountType === "admin" ? (
                  <option value="admin">Administrador</option>
                ) : (
                  <>
                    <option value="consumer">Consumidor</option>
                    <option value="restaurant">Restaurante</option>
                  </>
                )}
              </select>
            </label>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-900">Etiquetas de especialidad</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SPECIALTY_CATALOG.map((tag) => {
                const selected = form.specialtyTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onToggleTag(tag)}
                    className={`rounded-full px-3 py-1.5 text-sm transition ${
                      selected
                        ? "bg-orange-500 text-white"
                        : "border border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-500"
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Agregar etiqueta personalizada"
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2"
              />
              <button
                type="button"
                onClick={onAddCustomTag}
                className="rounded-xl border border-orange-300 px-4 py-2 text-sm font-medium text-orange-600"
              >
                Añadir etiqueta
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleProfileSubmit}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            <Save className="h-4 w-4" />
            {sesion ? "Guardar cambios" : "Registrarme"}
          </button>
        </section>

        <section className="space-y-6">
          {sesion && currentUser?.accountType === "consumer" && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-bold text-gray-900">Mis compras</h2>
              </div>
              {myConsumerOrders.length === 0 ? (
                <p className="text-sm text-gray-500">Todavía no has realizado compras.</p>
              ) : (
                <div className="space-y-3">
                  {myConsumerOrders.map((order) => (
                    <div key={order.id} className="rounded-2xl border border-gray-200 p-4">
                      <p className="font-semibold text-gray-900">{getRestaurantName(order.restaurantId)}</p>
                      <p className="text-sm text-gray-600">{getMenuItemName(order.menuItemId)}</p>
                      <p className="text-sm text-gray-500">
                        {order.quantity} unidad(es) · ${order.total.toLocaleString("es-CO")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {sesion && (currentUser?.accountType === "restaurant" || currentUser?.accountType === "admin") && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Store className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-bold text-gray-900">Órdenes recibidas</h2>
              </div>
              {myRestaurantOrders.length === 0 ? (
                <p className="text-sm text-gray-500">Aún no tienes órdenes registradas en tus restaurantes.</p>
              ) : (
                <div className="space-y-3">
                  {myRestaurantOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="rounded-2xl border border-gray-200 p-4">
                      <p className="font-semibold text-gray-900">{getRestaurantName(order.restaurantId)}</p>
                      <p className="text-sm text-gray-600">{getMenuItemName(order.menuItemId)}</p>
                      <p className="text-sm text-gray-500">
                        {order.quantity} unidad(es) · ${order.total.toLocaleString("es-CO")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {sesion && (currentUser?.accountType === "restaurant" || currentUser?.accountType === "admin") && (
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">Marketplace</p>
                <h2 className="text-xl font-bold text-gray-900">Crear restaurante</h2>
              </div>
            </div>

            <div className="grid gap-4">
              <label className="text-sm font-medium text-gray-700">
                Nombre del restaurante
                <input
                  value={restaurantForm.name}
                  onChange={(e) => setRestaurantForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                Descripción
                <textarea
                  value={restaurantForm.description}
                  onChange={(e) => setRestaurantForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-gray-700">
                  Localidad de Bogotá
                  <select
                    value={restaurantForm.locality}
                    onChange={(e) => setRestaurantForm((prev) => ({ ...prev, locality: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                  >
                    {bogotaLocalities.map((locality) => (
                      <option key={locality} value={locality}>
                        {locality}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Dirección
                  <input
                    value={restaurantForm.address}
                    onChange={(e) => setRestaurantForm((prev) => ({ ...prev, address: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                  />
                </label>
              </div>

              <label className="text-sm font-medium text-gray-700">
                URL de imagen de portada (opcional)
                <input
                  value={restaurantForm.coverImage}
                  onChange={(e) => setRestaurantForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                Etiquetas del restaurante (separadas por coma)
                <input
                  value={restaurantTagsInput}
                  onChange={(e) => setRestaurantTagsInput(e.target.value)}
                  placeholder="Italiana, Pasta fresca, Delivery"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={handleRestaurantSubmit}
              className="mt-6 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Crear restaurante
            </button>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Store className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">Marketplace</p>
                <h2 className="text-xl font-bold text-gray-900">Publicar producto en menú</h2>
              </div>
            </div>

            {myRestaurants.length === 0 ? (
              <p className="text-sm text-gray-500">Crea primero un restaurante para poder publicar productos.</p>
            ) : (
              <>
                <div className="grid gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Restaurante
                    <select
                      value={menuForm.restaurantId}
                      onChange={(e) => setMenuForm((prev) => ({ ...prev, restaurantId: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                    >
                      {myRestaurants.map((restaurant) => (
                        <option key={restaurant.id} value={restaurant.id}>
                          {restaurant.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm font-medium text-gray-700">
                    Nombre del producto
                    <input
                      value={menuForm.name}
                      onChange={(e) => setMenuForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                    />
                  </label>

                  <label className="text-sm font-medium text-gray-700">
                    Descripción
                    <textarea
                      value={menuForm.description}
                      onChange={(e) => setMenuForm((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="text-sm font-medium text-gray-700">
                      Precio
                      <input
                        type="number"
                        min={1}
                        value={menuForm.price}
                        onChange={(e) => setMenuForm((prev) => ({ ...prev, price: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                      />
                    </label>

                    <label className="text-sm font-medium text-gray-700">
                      Categoría
                      <input
                        value={menuForm.category}
                        onChange={(e) => setMenuForm((prev) => ({ ...prev, category: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                      />
                    </label>
                  </div>

                  <label className="text-sm font-medium text-gray-700">
                    URL de imagen (opcional)
                    <input
                      value={menuForm.image}
                      onChange={(e) => setMenuForm((prev) => ({ ...prev, image: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleMenuSubmit}
                  className="mt-6 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Publicar producto
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {sesion && (currentUser?.accountType === "restaurant" || currentUser?.accountType === "admin") && (
        <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Mis restaurantes y menú publicado</h2>
          <div className="mt-4 space-y-4">
            {myRestaurants.length === 0 ? (
              <p className="text-sm text-gray-500">Todavía no has creado restaurantes.</p>
            ) : (
              myRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="rounded-2xl border border-gray-200 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{restaurant.name}</h3>
                      <p className="text-sm text-gray-500">
                        {restaurant.locality} · {restaurant.address}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-orange-50 px-2 py-1 text-xs text-orange-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {getMenuForRestaurant(restaurant.id).map((item) => (
                      <div key={item.id} className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">{item.category}</p>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="mt-2 text-sm font-semibold text-gray-900">${item.price.toLocaleString("es-CO")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {sesion && currentUser?.platformRole === "admin" && (
        <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">HU01</p>
              <h2 className="text-xl font-bold text-gray-900">Asignación de roles</h2>
              <p className="text-sm text-gray-500">
                Como administrador puedes delegar moderación y soporte dentro de la comunidad.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {communityUsers
              .filter((user) => user.id !== currentUser.id)
              .map((user) => (
                <div key={user.id} className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                        Rol actual: {roleLabel[user.platformRole]}
                      </span>
                      <span className="rounded-full bg-orange-50 px-2 py-1 text-xs text-orange-600">
                        Cuenta: {accountLabel[user.accountType]}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(["moderator", "support", "user"] as const).map((targetRole) => (
                      <button
                        key={targetRole}
                        type="button"
                        onClick={() => {
                          const result = assignRole(user.id, targetRole)
                          setFeedback(
                            result.ok
                              ? `Rol de ${user.name} actualizado a ${roleLabel[targetRole]}.`
                              : result.error ?? "No fue posible asignar el rol",
                          )
                        }}
                        className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                          user.platformRole === targetRole
                            ? "bg-orange-500 text-white"
                            : "border border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-500"
                        }`}
                      >
                        {roleLabel[targetRole]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  )
}
