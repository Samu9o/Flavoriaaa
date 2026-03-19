/** @jest-environment jsdom */

import { render } from "@testing-library/react"
import { axe } from "jest-axe"
import Navbar from "@/components/Navbar"
import AIPage from "@/app/ia/page"
import TendenciasPage from "@/app/tendencias/page"

jest.mock("next/link", () => {
  return function MockLink({ children, href, ...rest }: { children: React.ReactNode; href: string }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }
})

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

jest.mock("@/lib/i18n", () => ({
  useI18n: () => ({
    language: "es",
    setLanguage: () => undefined,
    t: (key: string) => key,
  }),
  getLocaleForLanguage: () => "es-CO",
}))

jest.mock("@/lib/userContext", () => ({
  useUser: () => ({
    sesion: true,
    toggleSesion: () => undefined,
    rol: "foodie",
    setRol: () => undefined,
    currentUser: {
      id: "admin-flavoria",
      name: "Admin",
      accountType: "admin",
      platformRole: "admin",
    },
    communityUsers: [
      { id: "admin-flavoria", name: "Admin" },
      { id: "consumer-1", name: "Consumer" },
    ],
    currentPlatformRole: "admin",
    currentAccountType: "admin",
    switchAccount: () => undefined,
    topRestaurants: [
      {
        restaurantId: "r1",
        restaurantName: "Restaurante Centro",
        locality: "Chapinero",
        unitsSold: 120,
        revenue: 3000000,
      },
    ],
    bogotaTrendPoints: [
      {
        restaurantId: "r1",
        restaurantName: "Restaurante Centro",
        locality: "Chapinero",
        x: 240,
        y: 200,
        unitsSold: 120,
        orders: 24,
        revenue: 3000000,
      },
    ],
  }),
}))

test("A11Y - la barra de navegación no presenta violaciones críticas", async () => {
  const { container } = render(<Navbar />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})

test("A11Y - la pantalla de IA no presenta violaciones críticas", async () => {
  const { container } = render(<AIPage />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})

test("A11Y - la pantalla de tendencias no presenta violaciones críticas", async () => {
  const { container } = render(<TendenciasPage />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
