import type { CommunityUser } from "@/lib/communityLogic"

export type RestaurantEntity = {
  id: string
  ownerUserId: string
  name: string
  description: string
  locality: string
  address: string
  coverImage: string
  tags: string[]
  createdAt: string
}

export type MenuItemEntity = {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  category: string
  image: string
  isAvailable: boolean
  createdAt: string
}

export type OrderEntity = {
  id: string
  consumerUserId: string
  restaurantId: string
  menuItemId: string
  quantity: number
  unitPrice: number
  total: number
  status: "paid"
  createdAt: string
}

export type RestaurantInput = {
  name: string
  description: string
  locality: string
  address: string
  coverImage?: string
  tags?: string[]
}

export type MenuItemInput = {
  restaurantId: string
  name: string
  description: string
  price: number
  category: string
  image?: string
}

export type TopRestaurant = {
  restaurantId: string
  restaurantName: string
  locality: string
  orders: number
  unitsSold: number
  revenue: number
}

export type BogotaTrendPoint = TopRestaurant & {
  x: number
  y: number
}

type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

const DEFAULT_RESTAURANT_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop"
const DEFAULT_MENU_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop"

const BOGOTA_LOCALITY_POINTS: Record<string, { x: number; y: number }> = {
  Usaquén: { x: 540, y: 80 },
  Chapinero: { x: 505, y: 150 },
  Teusaquillo: { x: 450, y: 210 },
  Suba: { x: 395, y: 105 },
  Engativá: { x: 360, y: 180 },
  Fontibón: { x: 315, y: 250 },
  Kennedy: { x: 285, y: 320 },
  Bosa: { x: 245, y: 380 },
  "San Cristóbal": { x: 615, y: 330 },
  Usme: { x: 680, y: 420 },
}

function normalizeText(value: string) {
  return value.trim()
}

function slugify(value: string) {
  return normalizeText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function normalizeTags(tags: string[] = []): string[] {
  const seen = new Set<string>()

  return tags
    .map((tag) => normalizeText(tag))
    .filter(Boolean)
    .filter((tag) => {
      const key = tag.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

export function canManageMarketplace(actor: CommunityUser | null) {
  return Boolean(actor && (actor.accountType === "restaurant" || actor.platformRole === "admin"))
}

export function createRestaurant(
  actor: CommunityUser | null,
  restaurants: RestaurantEntity[],
  input: RestaurantInput,
): Result<RestaurantEntity> {
  if (!actor) {
    return { ok: false, error: "Debes iniciar sesión para crear un restaurante" }
  }

  if (!canManageMarketplace(actor)) {
    return { ok: false, error: "Solo una cuenta de restaurante puede crear restaurantes" }
  }

  const name = normalizeText(input.name)
  const description = normalizeText(input.description)
  const locality = normalizeText(input.locality)
  const address = normalizeText(input.address)
  const tags = normalizeTags(input.tags ?? [])

  if (!name) return { ok: false, error: "El nombre del restaurante es obligatorio" }
  if (!description) return { ok: false, error: "La descripción del restaurante es obligatoria" }
  if (!locality) return { ok: false, error: "La localidad es obligatoria" }
  if (!address) return { ok: false, error: "La dirección es obligatoria" }

  const alreadyExists = restaurants.some(
    (restaurant) =>
      restaurant.ownerUserId === actor.id && restaurant.name.toLowerCase() === name.toLowerCase(),
  )

  if (alreadyExists) {
    return { ok: false, error: "Ya tienes un restaurante registrado con ese nombre" }
  }

  return {
    ok: true,
    data: {
      id: `${slugify(name)}-${Date.now()}`,
      ownerUserId: actor.id,
      name,
      description,
      locality,
      address,
      coverImage: input.coverImage?.trim() || DEFAULT_RESTAURANT_IMAGE,
      tags,
      createdAt: new Date().toISOString(),
    },
  }
}

export function createMenuItem(
  actor: CommunityUser | null,
  restaurants: RestaurantEntity[],
  input: MenuItemInput,
): Result<MenuItemEntity> {
  if (!actor) {
    return { ok: false, error: "Debes iniciar sesión para publicar productos" }
  }

  if (!canManageMarketplace(actor)) {
    return { ok: false, error: "Solo una cuenta de restaurante puede publicar productos" }
  }

  const restaurant = restaurants.find((item) => item.id === input.restaurantId)
  if (!restaurant) {
    return { ok: false, error: "El restaurante seleccionado no existe" }
  }

  if (actor.platformRole !== "admin" && restaurant.ownerUserId !== actor.id) {
    return { ok: false, error: "Solo el dueño del restaurante puede publicar en este menú" }
  }

  const name = normalizeText(input.name)
  const description = normalizeText(input.description)
  const category = normalizeText(input.category)

  if (!name) return { ok: false, error: "El nombre del producto es obligatorio" }
  if (!description) return { ok: false, error: "La descripción del producto es obligatoria" }
  if (!category) return { ok: false, error: "La categoría es obligatoria" }
  if (!Number.isFinite(input.price) || input.price <= 0) {
    return { ok: false, error: "El precio debe ser mayor que cero" }
  }

  return {
    ok: true,
    data: {
      id: `${slugify(name)}-${Date.now()}`,
      restaurantId: restaurant.id,
      name,
      description,
      price: Number(input.price),
      category,
      image: input.image?.trim() || DEFAULT_MENU_IMAGE,
      isAvailable: true,
      createdAt: new Date().toISOString(),
    },
  }
}

export function purchaseMenuItem(
  actor: CommunityUser | null,
  restaurants: RestaurantEntity[],
  menuItems: MenuItemEntity[],
  menuItemId: string,
  quantity: number,
): Result<OrderEntity> {
  if (!actor) {
    return { ok: false, error: "Debes iniciar sesión para realizar una compra" }
  }

  if (actor.accountType !== "consumer") {
    return { ok: false, error: "Solo una cuenta de consumidor puede comprar productos" }
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { ok: false, error: "La cantidad debe ser un entero mayor que cero" }
  }

  const menuItem = menuItems.find((item) => item.id === menuItemId)
  if (!menuItem || !menuItem.isAvailable) {
    return { ok: false, error: "El producto no está disponible para la compra" }
  }

  const restaurant = restaurants.find((item) => item.id === menuItem.restaurantId)
  if (!restaurant) {
    return { ok: false, error: "No se encontró el restaurante de este producto" }
  }

  if (restaurant.ownerUserId === actor.id) {
    return { ok: false, error: "No puedes comprar productos de tu propio restaurante" }
  }

  return {
    ok: true,
    data: {
      id: `${menuItemId}-${actor.id}-${Date.now()}`,
      consumerUserId: actor.id,
      restaurantId: restaurant.id,
      menuItemId: menuItem.id,
      quantity,
      unitPrice: menuItem.price,
      total: Number((menuItem.price * quantity).toFixed(2)),
      status: "paid",
      createdAt: new Date().toISOString(),
    },
  }
}

export function getMenuItemsForRestaurant(menuItems: MenuItemEntity[], restaurantId: string) {
  return menuItems
    .filter((item) => item.restaurantId === restaurantId)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getTopRestaurantsBySales(
  restaurants: RestaurantEntity[],
  orders: OrderEntity[],
  limit = 5,
): TopRestaurant[] {
  const metrics = restaurants.map((restaurant) => {
    const restaurantOrders = orders.filter((order) => order.restaurantId === restaurant.id)
    const unitsSold = restaurantOrders.reduce((acc, order) => acc + order.quantity, 0)
    const revenue = restaurantOrders.reduce((acc, order) => acc + order.total, 0)

    return {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      locality: restaurant.locality,
      orders: restaurantOrders.length,
      unitsSold,
      revenue: Number(revenue.toFixed(2)),
    }
  })

  return metrics
    .sort((a, b) => {
      if (b.unitsSold !== a.unitsSold) return b.unitsSold - a.unitsSold
      if (b.revenue !== a.revenue) return b.revenue - a.revenue
      return a.restaurantName.localeCompare(b.restaurantName)
    })
    .slice(0, limit)
}

export function buildBogotaTrendPoints(
  restaurants: RestaurantEntity[],
  orders: OrderEntity[],
  limit = 12,
): BogotaTrendPoint[] {
  const rankedRestaurants = getTopRestaurantsBySales(restaurants, orders, restaurants.length).filter(
    (item) => item.orders > 0 && BOGOTA_LOCALITY_POINTS[item.locality],
  )

  const leadersByLocality = new Map<string, TopRestaurant>()

  for (const restaurant of rankedRestaurants) {
    if (!leadersByLocality.has(restaurant.locality)) {
      leadersByLocality.set(restaurant.locality, restaurant)
    }
  }

  return Array.from(leadersByLocality.values())
    .slice(0, limit)
    .map((item) => ({
      ...item,
      x: BOGOTA_LOCALITY_POINTS[item.locality].x,
      y: BOGOTA_LOCALITY_POINTS[item.locality].y,
    }))
}

export function getOrdersForConsumer(orders: OrderEntity[], consumerUserId: string) {
  return orders
    .filter((order) => order.consumerUserId === consumerUserId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getOrdersForRestaurantOwner(
  restaurants: RestaurantEntity[],
  orders: OrderEntity[],
  ownerUserId: string,
) {
  const ownedRestaurantIds = new Set(
    restaurants.filter((restaurant) => restaurant.ownerUserId === ownerUserId).map((restaurant) => restaurant.id),
  )

  return orders
    .filter((order) => ownedRestaurantIds.has(order.restaurantId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getRestaurantById(restaurants: RestaurantEntity[], restaurantId: string) {
  return restaurants.find((restaurant) => restaurant.id === restaurantId) ?? null
}

export function getMenuItemById(menuItems: MenuItemEntity[], menuItemId: string) {
  return menuItems.find((item) => item.id === menuItemId) ?? null
}

export function getBogotaMapReference() {
  return BOGOTA_LOCALITY_POINTS
}
