import { assignCommunityRole, createCommunityUser } from "../lib/communityLogic"

const admin = createCommunityUser(
  {
    name: "Admin",
    email: "admin@demo.com",
    bio: "Admin de comunidad",
    expertiseRole: "chef",
    specialtyTags: ["Moderación"],
  },
  { id: "admin", platformRole: "admin" },
)

const cook = createCommunityUser(
  {
    name: "Laura",
    email: "laura@demo.com",
    bio: "Chef pastelera",
    expertiseRole: "chef",
    specialtyTags: ["Repostería"],
  },
  { id: "laura" },
)

test("HU01 - un administrador puede asignar el rol de moderador", () => {
  const result = assignCommunityRole(admin, [admin, cook], "laura", "moderator")

  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.data.find((user) => user.id === "laura")?.platformRole).toBe("moderator")
  }
})

test("HU01 - un administrador puede asignar el rol de soporte", () => {
  const result = assignCommunityRole(admin, [admin, cook], "laura", "support")

  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.data.find((user) => user.id === "laura")?.platformRole).toBe("support")
  }
})

test("HU01 - un usuario que no es administrador no puede asignar roles", () => {
  const result = assignCommunityRole(cook, [admin, cook], "admin", "moderator")

  expect(result.ok).toBe(false)
  if (!result.ok) {
    expect(result.error).toBe("Solo un administrador puede asignar roles de comunidad")
  }
})

test("HU01 - la asignación falla si el usuario objetivo no existe", () => {
  const result = assignCommunityRole(admin, [admin, cook], "desconocido", "support")

  expect(result.ok).toBe(false)
  if (!result.ok) {
    expect(result.error).toBe("El usuario objetivo no existe")
  }
})
