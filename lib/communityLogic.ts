export type ExpertiseRole = "foodie" | "pro_curious" | "chef"
export type PlatformRole = "admin" | "user" | "moderator" | "support"
export type AccountType = "admin" | "consumer" | "restaurant"
export type GamificationAction = "hilo" | "like" | "comentario"

export type CommunityUser = {
  id: string
  name: string
  email: string
  bio: string
  avatar: string
  expertiseRole: ExpertiseRole
  platformRole: PlatformRole
  accountType: AccountType
  specialtyTags: string[]
  following: string[]
  puntos: number
  hilos: number
  comentarios: number
  likesRecibidos: number
  distintivos: string[]
}

export type CommunityFeedItem = {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  category: string
  createdAt: string
  href: string
  kind: "receta" | "foro"
  title: string
  summary: string
}

export type ProfileInput = {
  name: string
  email: string
  bio: string
  expertiseRole: ExpertiseRole
  specialtyTags: string[]
  avatar?: string
  accountType?: AccountType
}

export type UserState = {
  puntos: number
  hilos: number
  comentarios: number
  likesRecibidos: number
  distintivos: string[]
}

type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=5"

const NIVELES = [
  { nombre: "basico", minPuntos: 0 },
  { nombre: "bronce", minPuntos: 50 },
  { nombre: "plata", minPuntos: 120 },
  { nombre: "oro", minPuntos: 300 },
  { nombre: "platino", minPuntos: 600 },
] as const

const DISTINTIVOS = [
  { id: "primer_hilo", condicion: (s: UserState) => s.hilos >= 1 },
  { id: "comentador", condicion: (s: UserState) => s.comentarios >= 5 },
  { id: "popular", condicion: (s: UserState) => s.likesRecibidos >= 10 },
  { id: "colaborador", condicion: (s: UserState) => s.hilos >= 5 },
] as const

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

function normalizeAccountType(value?: AccountType, platformRole?: PlatformRole): AccountType {
  if (platformRole === "admin") return "admin"
  return value ?? "consumer"
}

export function normalizeSpecialtyTags(tags: string[]): string[] {
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

export function calcularNivel(puntos: number) {
  for (let i = NIVELES.length - 1; i >= 0; i--) {
    if (puntos >= NIVELES[i].minPuntos) return NIVELES[i].nombre
  }
  return "basico"
}

export function calcularProgreso(puntos: number) {
  const idxActual = [...NIVELES].reverse().findIndex((nivel) => puntos >= nivel.minPuntos)
  const nivelIdx = NIVELES.length - 1 - idxActual
  const actual = NIVELES[nivelIdx]
  const siguiente = NIVELES[nivelIdx + 1]

  if (!siguiente) {
    return { falta: 0, porcentaje: 100 }
  }

  const falta = siguiente.minPuntos - puntos
  const porcentaje = Math.round(
    ((puntos - actual.minPuntos) / (siguiente.minPuntos - actual.minPuntos)) * 100,
  )

  return { falta, porcentaje }
}

export function actualizarDistintivos(state: UserState): string[] {
  return DISTINTIVOS.filter((distintivo) => distintivo.condicion(state)).map((distintivo) => distintivo.id)
}

export function applyGamificationAction(user: CommunityUser, action: GamificationAction): CommunityUser {
  const pointsByAction: Record<GamificationAction, number> = {
    hilo: 10,
    like: 5,
    comentario: 3,
  }

  const nextUser: CommunityUser = {
    ...user,
    puntos: user.puntos + pointsByAction[action],
    hilos: action === "hilo" ? user.hilos + 1 : user.hilos,
    comentarios: action === "comentario" ? user.comentarios + 1 : user.comentarios,
    likesRecibidos: action === "like" ? user.likesRecibidos + 1 : user.likesRecibidos,
  }

  nextUser.distintivos = actualizarDistintivos({
    puntos: nextUser.puntos,
    hilos: nextUser.hilos,
    comentarios: nextUser.comentarios,
    likesRecibidos: nextUser.likesRecibidos,
    distintivos: nextUser.distintivos,
  })

  return nextUser
}

export function createCommunityUser(input: ProfileInput, overrides?: Partial<CommunityUser>): CommunityUser {
  const specialtyTags = normalizeSpecialtyTags(input.specialtyTags)
  const platformRole = overrides?.platformRole ?? "user"
  const accountType = normalizeAccountType(overrides?.accountType ?? input.accountType, platformRole)

  const baseUser: CommunityUser = {
    id: overrides?.id ?? `${slugify(input.name)}-${Date.now()}`,
    name: normalizeText(input.name),
    email: normalizeText(input.email).toLowerCase(),
    bio: normalizeText(input.bio),
    avatar: overrides?.avatar ?? input.avatar ?? DEFAULT_AVATAR,
    expertiseRole: input.expertiseRole,
    platformRole,
    accountType,
    specialtyTags,
    following: overrides?.following ?? [],
    puntos: overrides?.puntos ?? 0,
    hilos: overrides?.hilos ?? 0,
    comentarios: overrides?.comentarios ?? 0,
    likesRecibidos: overrides?.likesRecibidos ?? 0,
    distintivos: overrides?.distintivos ?? [],
  }

  baseUser.distintivos = actualizarDistintivos({
    puntos: baseUser.puntos,
    hilos: baseUser.hilos,
    comentarios: baseUser.comentarios,
    likesRecibidos: baseUser.likesRecibidos,
    distintivos: baseUser.distintivos,
  })

  return baseUser
}

export function registerUser(users: CommunityUser[], input: ProfileInput): Result<CommunityUser> {
  const name = normalizeText(input.name)
  const email = normalizeText(input.email).toLowerCase()
  const bio = normalizeText(input.bio)
  const specialtyTags = normalizeSpecialtyTags(input.specialtyTags)

  if (!name) return { ok: false, error: "El nombre es obligatorio" }
  if (!email) return { ok: false, error: "El correo es obligatorio" }
  if (!bio) return { ok: false, error: "La biografía es obligatoria" }
  if (specialtyTags.length === 0) {
    return { ok: false, error: "Debes seleccionar al menos una etiqueta de especialidad" }
  }

  const emailExists = users.some((user) => user.email.toLowerCase() === email)
  if (emailExists) return { ok: false, error: "Ya existe un usuario registrado con ese correo" }

  return {
    ok: true,
    data: createCommunityUser({
      ...input,
      name,
      email,
      bio,
      specialtyTags,
      accountType: input.accountType ?? "consumer",
    }),
  }
}

export function updateUserProfile(user: CommunityUser, input: ProfileInput): Result<CommunityUser> {
  const name = normalizeText(input.name)
  const email = normalizeText(input.email).toLowerCase()
  const bio = normalizeText(input.bio)
  const specialtyTags = normalizeSpecialtyTags(input.specialtyTags)

  if (!name) return { ok: false, error: "El nombre es obligatorio" }
  if (!email) return { ok: false, error: "El correo es obligatorio" }
  if (!bio) return { ok: false, error: "La biografía es obligatoria" }
  if (specialtyTags.length === 0) {
    return { ok: false, error: "Debes seleccionar al menos una etiqueta de especialidad" }
  }

  return {
    ok: true,
    data: {
      ...user,
      name,
      email,
      bio,
      expertiseRole: input.expertiseRole,
      avatar: input.avatar ?? user.avatar,
      specialtyTags,
      accountType: user.platformRole === "admin" ? "admin" : input.accountType ?? user.accountType,
    },
  }
}

export function assignCommunityRole(
  actor: CommunityUser | null,
  users: CommunityUser[],
  targetUserId: string,
  role: Extract<PlatformRole, "moderator" | "support" | "user">,
): Result<CommunityUser[]> {
  if (!actor || actor.platformRole !== "admin") {
    return { ok: false, error: "Solo un administrador puede asignar roles de comunidad" }
  }

  const targetExists = users.some((user) => user.id === targetUserId)
  if (!targetExists) {
    return { ok: false, error: "El usuario objetivo no existe" }
  }

  return {
    ok: true,
    data: users.map((user) =>
      user.id === targetUserId
        ? {
            ...user,
            platformRole: role,
          }
        : user,
    ),
  }
}

export function toggleFollowUser(user: CommunityUser, targetUserId: string): Result<CommunityUser> {
  if (user.id === targetUserId) {
    return { ok: false, error: "No puedes seguirte a ti mismo" }
  }

  const isFollowing = user.following.includes(targetUserId)

  return {
    ok: true,
    data: {
      ...user,
      following: isFollowing
        ? user.following.filter((followedId) => followedId !== targetUserId)
        : [...user.following, targetUserId],
    },
  }
}

export function buildPersonalizedFeed(user: CommunityUser | null, items: CommunityFeedItem[]): CommunityFeedItem[] {
  if (!user) return []

  return items
    .filter((item) => user.following.includes(item.authorId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getFollowersCount(users: CommunityUser[], userId: string) {
  return users.filter((user) => user.following.includes(userId)).length
}
