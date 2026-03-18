import { createCommunityUser } from "../lib/communityLogic"
import { purchaseMenuItem } from "../lib/marketplaceLogic"

const restaurantOwner = createCommunityUser(
  {
    name: "María",
    email: "maria@demo.com",
    bio: "Dueña",
    expertiseRole: "chef",
    specialtyTags: ["Italiana"],
    accountType: "restaurant",
  },
  { id: "maria", accountType: "restaurant" },
)

const consumer = createCommunityUser(
  {
    name: "Carlos",
    email: "carlos@demo.com",
    bio: "Consumidor",
    expertiseRole: "foodie",
    specialtyTags: ["Postres"],
    accountType: "consumer",
  },
  { id: "carlos", accountType: "consumer" },
)

const restaurants = [
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

const menuItems = [
  {
    id: "lasa",
    restaurantId: "roma",
    name: "Lasaña",
    description: "Lasaña artesanal",
    price: 32000,
    category: "Pastas",
    image: "img",
    isAvailable: true,
    createdAt: "2026-03-18T00:00:00.000Z",
  },
]

test("HU08 - una cuenta consumidor puede comprar un producto de otro restaurante", () => {
  const result = purchaseMenuItem(consumer, restaurants, menuItems, "lasa", 2)

  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.data.consumerUserId).toBe("carlos")
    expect(result.data.total).toBe(64000)
  }
})

test("HU08 - una cuenta restaurante no puede comprar productos", () => {
  const result = purchaseMenuItem(restaurantOwner, restaurants, menuItems, "lasa", 1)

  expect(result.ok).toBe(false)
  if (!result.ok) {
    expect(result.error).toBe("Solo una cuenta de consumidor puede comprar productos")
  }
})

test("HU08 - el dueño no puede comprar productos de su propio restaurante", () => {
  const ownerAsConsumer = createCommunityUser(
    {
      name: "María 2",
      email: "maria2@demo.com",
      bio: "Dueña convertida",
      expertiseRole: "chef",
      specialtyTags: ["Italiana"],
      accountType: "consumer",
    },
    { id: "maria", accountType: "consumer" },
  )

  const result = purchaseMenuItem(ownerAsConsumer, restaurants, menuItems, "lasa", 1)

  expect(result.ok).toBe(false)
  if (!result.ok) {
    expect(result.error).toBe("No puedes comprar productos de tu propio restaurante")
  }
})

test("HU08 - la compra exige una cantidad válida", () => {
  const result = purchaseMenuItem(consumer, restaurants, menuItems, "lasa", 0)

  expect(result.ok).toBe(false)
  if (!result.ok) {
    expect(result.error).toBe("La cantidad debe ser un entero mayor que cero")
  }
})
