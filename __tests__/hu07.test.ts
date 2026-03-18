import { createCommunityUser } from "../lib/communityLogic"
import { createMenuItem, createRestaurant } from "../lib/marketplaceLogic"

const restaurantUser = createCommunityUser(
  {
    name: "María",
    email: "maria@demo.com",
    bio: "Dueña de restaurante",
    expertiseRole: "chef",
    specialtyTags: ["Italiana"],
    accountType: "restaurant",
  },
  { id: "maria", accountType: "restaurant" },
)

const consumerUser = createCommunityUser(
  {
    name: "Carlos",
    email: "carlos@demo.com",
    bio: "Consumidor foodie",
    expertiseRole: "foodie",
    specialtyTags: ["Postres"],
    accountType: "consumer",
  },
  { id: "carlos", accountType: "consumer" },
)

const baseRestaurants = [
  {
    id: "roma",
    ownerUserId: "maria",
    name: "Roma",
    description: "Pasta",
    locality: "Chapinero",
    address: "Calle 1",
    coverImage: "img",
    tags: ["Italiana"],
    createdAt: "2026-03-18T00:00:00.000Z",
  },
]

test("HU07 - una cuenta restaurante puede crear un restaurante", () => {
  const result = createRestaurant(restaurantUser, [], {
    name: "Bistró Centro",
    description: "Brunch y café",
    locality: "Teusaquillo",
    address: "Cra 10 #10-10",
    tags: ["Brunch", "Café"],
  })

  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.data.ownerUserId).toBe("maria")
    expect(result.data.locality).toBe("Teusaquillo")
  }
})

test("HU07 - una cuenta consumidor no puede crear restaurantes", () => {
  const result = createRestaurant(consumerUser, [], {
    name: "No debería",
    description: "Intento inválido",
    locality: "Suba",
    address: "Cra 1",
  })

  expect(result.ok).toBe(false)
  if (!result.ok) {
    expect(result.error).toBe("Solo una cuenta de restaurante puede crear restaurantes")
  }
})

test("HU07 - el dueño del restaurante puede publicar productos en su menú", () => {
  const result = createMenuItem(restaurantUser, baseRestaurants, {
    restaurantId: "roma",
    name: "Lasaña",
    description: "Lasaña artesanal",
    price: 32000,
    category: "Pastas",
  })

  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.data.restaurantId).toBe("roma")
    expect(result.data.price).toBe(32000)
  }
})

test("HU07 - un restaurante no puede publicar productos en el menú de otro dueño", () => {
  const anotherRestaurantUser = createCommunityUser(
    {
      name: "Ana",
      email: "ana@demo.com",
      bio: "Otra dueña",
      expertiseRole: "chef",
      specialtyTags: ["Saludable"],
      accountType: "restaurant",
    },
    { id: "ana", accountType: "restaurant" },
  )

  const result = createMenuItem(anotherRestaurantUser, baseRestaurants, {
    restaurantId: "roma",
    name: "Bowl",
    description: "Intento inválido",
    price: 28000,
    category: "Bowls",
  })

  expect(result.ok).toBe(false)
  if (!result.ok) {
    expect(result.error).toBe("Solo el dueño del restaurante puede publicar en este menú")
  }
})
