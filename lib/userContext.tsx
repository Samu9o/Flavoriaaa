"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
  applyGamificationAction,
  assignCommunityRole,
  buildPersonalizedFeed,
  calcularNivel,
  calcularProgreso,
  type AccountType,
  type CommunityFeedItem,
  type CommunityUser,
  type ExpertiseRole,
  getFollowersCount,
  registerUser,
  toggleFollowUser,
  type GamificationAction,
  type PlatformRole,
  type ProfileInput,
  updateUserProfile,
} from "@/lib/communityLogic"
import { COMMUNITY_FEED_ITEMS, COMMUNITY_SEED_USERS } from "@/lib/communitySeed"
import {
  buildBogotaTrendPoints,
  createMenuItem,
  createRestaurant,
  getMenuItemById,
  getMenuItemsForRestaurant,
  getOrdersForConsumer,
  getOrdersForRestaurantOwner,
  getRestaurantById,
  getTopRestaurantsBySales,
  purchaseMenuItem,
  type BogotaTrendPoint,
  type MenuItemEntity,
  type MenuItemInput,
  type OrderEntity,
  type RestaurantEntity,
  type RestaurantInput,
  type TopRestaurant,
} from "@/lib/marketplaceLogic"
import {
  MARKETPLACE_SEED_MENU,
  MARKETPLACE_SEED_ORDERS,
  MARKETPLACE_SEED_RESTAURANTS,
} from "@/lib/marketplaceSeed"

type UserContextType = {
  state: {
    puntos: number
    hilos: number
    comentarios: number
    likesRecibidos: number
    distintivos: string[]
  }
  nivel: string
  puntosParaSiguiente: number
  progresoPorcentaje: number
  agregarPuntos: (accion: GamificationAction) => void
  sesion: boolean
  toggleSesion: () => void
  rol: ExpertiseRole
  setRol: (rol: ExpertiseRole) => void
  currentUser: CommunityUser | null
  communityUsers: CommunityUser[]
  currentPlatformRole: PlatformRole | null
  currentAccountType: AccountType | null
  switchAccount: (userId: string) => void
  registerProfile: (input: ProfileInput) => { ok: boolean; error?: string }
  saveProfile: (input: ProfileInput) => { ok: boolean; error?: string }
  assignRole: (
    targetUserId: string,
    role: Extract<PlatformRole, "moderator" | "support" | "user">,
  ) => { ok: boolean; error?: string }
  toggleFollowCook: (targetUserId: string) => { ok: boolean; error?: string }
  personalizedFeed: CommunityFeedItem[]
  getFollowersFor: (userId: string) => number
  restaurants: RestaurantEntity[]
  menuItems: MenuItemEntity[]
  orders: OrderEntity[]
  myRestaurants: RestaurantEntity[]
  myConsumerOrders: OrderEntity[]
  myRestaurantOrders: OrderEntity[]
  topRestaurants: TopRestaurant[]
  bogotaTrendPoints: BogotaTrendPoint[]
  createRestaurantProfile: (input: RestaurantInput) => { ok: boolean; error?: string }
  createMenuOffer: (input: MenuItemInput) => { ok: boolean; error?: string }
  buyMenuItem: (menuItemId: string, quantity: number) => { ok: boolean; error?: string }
  getMenuForRestaurant: (restaurantId: string) => MenuItemEntity[]
  getRestaurantName: (restaurantId: string) => string
  getMenuItemName: (menuItemId: string) => string
}

type AppStore = {
  sesion: boolean
  currentUserId: string
  communityUsers: CommunityUser[]
  marketplace: {
    restaurants: RestaurantEntity[]
    menuItems: MenuItemEntity[]
    orders: OrderEntity[]
  }
}

const STORAGE_KEY = "flavoria-community-store-v2"

const DEFAULT_STORE: AppStore = {
  sesion: false,
  currentUserId: "admin-flavoria",
  communityUsers: COMMUNITY_SEED_USERS,
  marketplace: {
    restaurants: MARKETPLACE_SEED_RESTAURANTS,
    menuItems: MARKETPLACE_SEED_MENU,
    orders: MARKETPLACE_SEED_ORDERS,
  },
}

const DEFAULT_STATE = {
  puntos: 0,
  hilos: 0,
  comentarios: 0,
  likesRecibidos: 0,
  distintivos: [],
}

const UserContext = createContext<UserContextType | null>(null)

function hydrateStore(saved: string | null): AppStore {
  if (!saved) return DEFAULT_STORE

  try {
    const parsed = JSON.parse(saved) as Partial<AppStore>

    return {
      sesion: parsed.sesion ?? DEFAULT_STORE.sesion,
      currentUserId: parsed.currentUserId ?? DEFAULT_STORE.currentUserId,
      communityUsers: parsed.communityUsers ?? DEFAULT_STORE.communityUsers,
      marketplace: {
        restaurants: parsed.marketplace?.restaurants ?? DEFAULT_STORE.marketplace.restaurants,
        menuItems: parsed.marketplace?.menuItems ?? DEFAULT_STORE.marketplace.menuItems,
        orders: parsed.marketplace?.orders ?? DEFAULT_STORE.marketplace.orders,
      },
    }
  } catch {
    return DEFAULT_STORE
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<AppStore>(DEFAULT_STORE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const nextStore = hydrateStore(typeof window === "undefined" ? null : localStorage.getItem(STORAGE_KEY))
    setStore(nextStore)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  }, [hydrated, store])

  const currentUser = useMemo(
    () => store.communityUsers.find((user) => user.id === store.currentUserId) ?? null,
    [store.communityUsers, store.currentUserId],
  )

  const state = currentUser
    ? {
        puntos: currentUser.puntos,
        hilos: currentUser.hilos,
        comentarios: currentUser.comentarios,
        likesRecibidos: currentUser.likesRecibidos,
        distintivos: currentUser.distintivos,
      }
    : DEFAULT_STATE

  const nivel = calcularNivel(state.puntos)
  const { falta, porcentaje } = calcularProgreso(state.puntos)

  const replaceCurrentUser = (updatedUser: CommunityUser) => {
    setStore((prev) => ({
      ...prev,
      communityUsers: prev.communityUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      ),
    }))
  }

  const toggleSesion = () => {
    setStore((prev) => ({
      ...prev,
      sesion: !prev.sesion,
    }))
  }

  const switchAccount = (userId: string) => {
    setStore((prev) => {
      const exists = prev.communityUsers.some((user) => user.id === userId)
      if (!exists) return prev
      return {
        ...prev,
        currentUserId: userId,
      }
    })
  }

  const agregarPuntos = (accion: GamificationAction) => {
    if (!currentUser) return
    replaceCurrentUser(applyGamificationAction(currentUser, accion))
  }

  const setRol = (rol: ExpertiseRole) => {
    if (!currentUser) return
    replaceCurrentUser({ ...currentUser, expertiseRole: rol })
  }

  const registerProfile: UserContextType["registerProfile"] = (input) => {
    const result = registerUser(store.communityUsers, input)

    if (!result.ok) {
      return { ok: false, error: result.error }
    }

    setStore((prev) => ({
      ...prev,
      sesion: true,
      currentUserId: result.data.id,
      communityUsers: [...prev.communityUsers, result.data],
    }))

    return { ok: true }
  }

  const saveProfile: UserContextType["saveProfile"] = (input) => {
    if (!currentUser) {
      return { ok: false, error: "No hay un usuario seleccionado" }
    }

    const emailAlreadyUsed = store.communityUsers.some(
      (user) => user.id !== currentUser.id && user.email.toLowerCase() === input.email.toLowerCase(),
    )

    if (emailAlreadyUsed) {
      return { ok: false, error: "Ya existe un usuario registrado con ese correo" }
    }

    const result = updateUserProfile(currentUser, input)
    if (!result.ok) {
      return { ok: false, error: result.error }
    }

    replaceCurrentUser(result.data)
    return { ok: true }
  }

  const assignRole: UserContextType["assignRole"] = (targetUserId, role) => {
    const result = assignCommunityRole(currentUser, store.communityUsers, targetUserId, role)

    if (!result.ok) {
      return { ok: false, error: result.error }
    }

    setStore((prev) => ({
      ...prev,
      communityUsers: result.data,
    }))

    return { ok: true }
  }

  const toggleFollowCook: UserContextType["toggleFollowCook"] = (targetUserId) => {
    if (!store.sesion || !currentUser) {
      return { ok: false, error: "Debes iniciar sesión para seguir a otros cocineros" }
    }

    const result = toggleFollowUser(currentUser, targetUserId)
    if (!result.ok) {
      return { ok: false, error: result.error }
    }

    replaceCurrentUser(result.data)
    return { ok: true }
  }

  const createRestaurantProfile: UserContextType["createRestaurantProfile"] = (input) => {
    const result = createRestaurant(currentUser, store.marketplace.restaurants, input)
    if (!result.ok) return { ok: false, error: result.error }

    setStore((prev) => ({
      ...prev,
      marketplace: {
        ...prev.marketplace,
        restaurants: [...prev.marketplace.restaurants, result.data],
      },
    }))

    return { ok: true }
  }

  const createMenuOffer: UserContextType["createMenuOffer"] = (input) => {
    const result = createMenuItem(currentUser, store.marketplace.restaurants, input)
    if (!result.ok) return { ok: false, error: result.error }

    setStore((prev) => ({
      ...prev,
      marketplace: {
        ...prev.marketplace,
        menuItems: [...prev.marketplace.menuItems, result.data],
      },
    }))

    return { ok: true }
  }

  const buyMenuItem: UserContextType["buyMenuItem"] = (menuItemId, quantity) => {
    const result = purchaseMenuItem(
      currentUser,
      store.marketplace.restaurants,
      store.marketplace.menuItems,
      menuItemId,
      quantity,
    )

    if (!result.ok) return { ok: false, error: result.error }

    setStore((prev) => ({
      ...prev,
      marketplace: {
        ...prev.marketplace,
        orders: [...prev.marketplace.orders, result.data],
      },
    }))

    return { ok: true }
  }

  const personalizedFeed = useMemo(
    () => buildPersonalizedFeed(currentUser, COMMUNITY_FEED_ITEMS),
    [currentUser],
  )

  const myRestaurants = useMemo(
    () =>
      currentUser
        ? store.marketplace.restaurants.filter((restaurant) => restaurant.ownerUserId === currentUser.id)
        : [],
    [currentUser, store.marketplace.restaurants],
  )

  const myConsumerOrders = useMemo(
    () => (currentUser ? getOrdersForConsumer(store.marketplace.orders, currentUser.id) : []),
    [currentUser, store.marketplace.orders],
  )

  const myRestaurantOrders = useMemo(
    () =>
      currentUser
        ? getOrdersForRestaurantOwner(store.marketplace.restaurants, store.marketplace.orders, currentUser.id)
        : [],
    [currentUser, store.marketplace.orders, store.marketplace.restaurants],
  )

  const topRestaurants = useMemo(
    () => getTopRestaurantsBySales(store.marketplace.restaurants, store.marketplace.orders),
    [store.marketplace.orders, store.marketplace.restaurants],
  )

  const bogotaTrendPoints = useMemo(
    () => buildBogotaTrendPoints(store.marketplace.restaurants, store.marketplace.orders),
    [store.marketplace.orders, store.marketplace.restaurants],
  )

  const getFollowersFor = (userId: string) => getFollowersCount(store.communityUsers, userId)
  const getMenuForRestaurant = (restaurantId: string) =>
    getMenuItemsForRestaurant(store.marketplace.menuItems, restaurantId)
  const getRestaurantName = (restaurantId: string) =>
    getRestaurantById(store.marketplace.restaurants, restaurantId)?.name ?? "Restaurante"
  const getMenuItemName = (menuItemId: string) =>
    getMenuItemById(store.marketplace.menuItems, menuItemId)?.name ?? "Producto"

  return (
    <UserContext.Provider
      value={{
        state,
        nivel,
        puntosParaSiguiente: falta,
        progresoPorcentaje: porcentaje,
        agregarPuntos,
        sesion: store.sesion,
        toggleSesion,
        rol: currentUser?.expertiseRole ?? "foodie",
        setRol,
        currentUser,
        communityUsers: store.communityUsers,
        currentPlatformRole: currentUser?.platformRole ?? null,
        currentAccountType: currentUser?.accountType ?? null,
        switchAccount,
        registerProfile,
        saveProfile,
        assignRole,
        toggleFollowCook,
        personalizedFeed,
        getFollowersFor,
        restaurants: store.marketplace.restaurants,
        menuItems: store.marketplace.menuItems,
        orders: store.marketplace.orders,
        myRestaurants,
        myConsumerOrders,
        myRestaurantOrders,
        topRestaurants,
        bogotaTrendPoints,
        createRestaurantProfile,
        createMenuOffer,
        buyMenuItem,
        getMenuForRestaurant,
        getRestaurantName,
        getMenuItemName,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser debe usarse dentro de UserProvider")
  return ctx
}
