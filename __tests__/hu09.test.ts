import { buildBogotaTrendPoints, getTopRestaurantsBySales } from "../lib/marketplaceLogic"

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
  {
    id: "vital",
    ownerUserId: "ana",
    name: "Verde Vital",
    description: "Bowls",
    locality: "Usaquén",
    address: "Calle 2",
    coverImage: "img",
    tags: ["Saludable"],
    createdAt: "2026-03-18T00:00:00.000Z",
  },
  {
    id: "bistro",
    ownerUserId: "laura",
    name: "Bistró",
    description: "Brunch",
    locality: "Teusaquillo",
    address: "Calle 3",
    coverImage: "img",
    tags: ["Brunch"],
    createdAt: "2026-03-18T00:00:00.000Z",
  },
]

const orders = [
  {
    id: "1",
    consumerUserId: "carlos",
    restaurantId: "roma",
    menuItemId: "a",
    quantity: 2,
    unitPrice: 30000,
    total: 60000,
    status: "paid" as const,
    createdAt: "2026-03-18T10:00:00.000Z",
  },
  {
    id: "2",
    consumerUserId: "andres",
    restaurantId: "vital",
    menuItemId: "b",
    quantity: 5,
    unitPrice: 25000,
    total: 125000,
    status: "paid" as const,
    createdAt: "2026-03-18T11:00:00.000Z",
  },
  {
    id: "3",
    consumerUserId: "andres",
    restaurantId: "roma",
    menuItemId: "c",
    quantity: 1,
    unitPrice: 28000,
    total: 28000,
    status: "paid" as const,
    createdAt: "2026-03-18T12:00:00.000Z",
  },
]

test("HU09 - el ranking de tendencias ordena por unidades vendidas", () => {
  const result = getTopRestaurantsBySales(restaurants, orders)

  expect(result[0].restaurantName).toBe("Verde Vital")
  expect(result[0].unitsSold).toBe(5)
  expect(result[1].restaurantName).toBe("Roma")
})

test("HU09 - el ranking calcula correctamente los ingresos por restaurante", () => {
  const result = getTopRestaurantsBySales(restaurants, orders)
  const roma = result.find((restaurant) => restaurant.restaurantId === "roma")

  expect(roma?.revenue).toBe(88000)
  expect(roma?.orders).toBe(2)
})

test("HU09 - el mapa de Bogotá genera marcadores con coordenadas para restaurantes vendidos", () => {
  const points = buildBogotaTrendPoints(restaurants, orders)

  expect(points.length).toBeGreaterThanOrEqual(2)
  expect(points[0].x).toBeGreaterThan(0)
  expect(points[0].y).toBeGreaterThan(0)
})

test("HU09 - el mapa omite restaurantes sin coordenadas definidas", () => {
  const withUnknownLocality = [
    ...restaurants,
    {
      id: "unknown",
      ownerUserId: "x",
      name: "Fuera del mapa",
      description: "Test",
      locality: "SinLocalidad",
      address: "x",
      coverImage: "img",
      tags: [],
      createdAt: "2026-03-18T00:00:00.000Z",
    },
  ]

  const withUnknownOrders = [
    ...orders,
    {
      id: "4",
      consumerUserId: "carlos",
      restaurantId: "unknown",
      menuItemId: "x",
      quantity: 9,
      unitPrice: 10000,
      total: 90000,
      status: "paid" as const,
      createdAt: "2026-03-18T13:00:00.000Z",
    },
  ]

  const points = buildBogotaTrendPoints(withUnknownLocality, withUnknownOrders)
  expect(points.find((point) => point.restaurantId === "unknown")).toBeUndefined()
})
