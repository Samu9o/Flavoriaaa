import { buildPersonalizedFeed, createCommunityUser, toggleFollowUser } from "../lib/communityLogic"

const maria = createCommunityUser(
  {
    name: "María González",
    email: "maria@demo.com",
    bio: "Chef italiana",
    expertiseRole: "chef",
    specialtyTags: ["Pasta"],
  },
  { id: "maria" },
)

const ana = createCommunityUser(
  {
    name: "Ana Martínez",
    email: "ana@demo.com",
    bio: "Chef saludable",
    expertiseRole: "chef",
    specialtyTags: ["Saludable"],
  },
  { id: "ana" },
)

const carlos = createCommunityUser(
  {
    name: "Carlos Ruiz",
    email: "carlos@demo.com",
    bio: "Fan de la repostería",
    expertiseRole: "pro_curious",
    specialtyTags: ["Postres"],
  },
  { id: "carlos", following: [] },
)

const feed = [
  {
    id: "1",
    authorId: "maria",
    authorName: "María González",
    authorAvatar: "avatar-1",
    category: "Italiana",
    createdAt: "2026-03-18T10:00:00.000Z",
    href: "/receta/1",
    kind: "receta" as const,
    title: "Pasta carbonara",
    summary: "Receta clásica",
  },
  {
    id: "2",
    authorId: "ana",
    authorName: "Ana Martínez",
    authorAvatar: "avatar-2",
    category: "Saludable",
    createdAt: "2026-03-19T08:00:00.000Z",
    href: "/foros",
    kind: "foro" as const,
    title: "Meal prep semanal",
    summary: "Consejos de organización",
  },
]

test("HU03 - un usuario puede seguir a otro cocinero", () => {
  const result = toggleFollowUser(carlos, maria.id)

  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.data.following).toContain("maria")
  }
})

test("HU03 - al volver a seguir al mismo cocinero se elimina el seguimiento", () => {
  const carlosFollowing = { ...carlos, following: ["maria"] }
  const result = toggleFollowUser(carlosFollowing, maria.id)

  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.data.following).not.toContain("maria")
  }
})

test("HU03 - no es posible seguirse a sí mismo", () => {
  const result = toggleFollowUser(carlos, carlos.id)

  expect(result.ok).toBe(false)
  if (!result.ok) {
    expect(result.error).toBe("No puedes seguirte a ti mismo")
  }
})

test("HU03 - el feed personalizado solo muestra contenido de cocineros seguidos y ordenado por fecha", () => {
  const user = { ...carlos, following: [maria.id, ana.id] }
  const personalized = buildPersonalizedFeed(user, feed)

  expect(personalized).toHaveLength(2)
  expect(personalized[0].authorId).toBe("ana")
  expect(personalized[1].authorId).toBe("maria")
})
