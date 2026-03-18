import { createCommunityUser, registerUser, updateUserProfile } from "../lib/communityLogic"

const existingUser = createCommunityUser(
  {
    name: "María",
    email: "maria@demo.com",
    bio: "Chef italiana",
    expertiseRole: "chef",
    specialtyTags: ["Pasta"],
  },
  { id: "maria" },
)

test("HU02 - un usuario puede registrarse con etiquetas de especialidad", () => {
  const result = registerUser([existingUser], {
    name: "Laura Torres",
    email: "laura@demo.com",
    bio: "Apasionada por la panadería artesanal",
    expertiseRole: "pro_curious",
    specialtyTags: ["Panadería", "Masa madre"],
  })

  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.data.specialtyTags).toEqual(["Panadería", "Masa madre"])
    expect(result.data.expertiseRole).toBe("pro_curious")
  }
})

test("HU02 - el sistema evita registrar dos usuarios con el mismo correo", () => {
  const result = registerUser([existingUser], {
    name: "Otra María",
    email: "maria@demo.com",
    bio: "Perfil duplicado",
    expertiseRole: "foodie",
    specialtyTags: ["Postres"],
  })

  expect(result.ok).toBe(false)
  if (!result.ok) {
    expect(result.error).toBe("Ya existe un usuario registrado con ese correo")
  }
})

test("HU02 - un usuario puede actualizar su perfil y deduplicar etiquetas", () => {
  const result = updateUserProfile(existingUser, {
    name: "María González",
    email: "maria@demo.com",
    bio: "Chef italiana y mentora de cocina clásica",
    expertiseRole: "chef",
    specialtyTags: ["Pasta", "pasta", "Panadería"],
  })

  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.data.name).toBe("María González")
    expect(result.data.specialtyTags).toEqual(["Pasta", "Panadería"])
  }
})

test("HU02 - el registro exige al menos una etiqueta de especialidad", () => {
  const result = registerUser([], {
    name: "Usuario sin tags",
    email: "sin-tags@demo.com",
    bio: "No tiene especialidad configurada",
    expertiseRole: "foodie",
    specialtyTags: [],
  })

  expect(result.ok).toBe(false)
  if (!result.ok) {
    expect(result.error).toBe("Debes seleccionar al menos una etiqueta de especialidad")
  }
})
