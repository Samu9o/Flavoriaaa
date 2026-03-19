import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { getLocaleForLanguage, translate } from "../lib/i18n"

function countPageFiles(dir: string): number {
  const entries = readdirSync(dir, { withFileTypes: true })
  let count = 0

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "api") continue
      count += countPageFiles(fullPath)
      continue
    }

    if (entry.isFile() && entry.name === "page.tsx") {
      count += 1
    }
  }

  return count
}

test("COMPLIANCE - hay prototipos navegables suficientes para N=3 (3*N)", () => {
  const appDir = join(process.cwd(), "app")
  const pageRoutes = countPageFiles(appDir)

  const n = 3
  expect(pageRoutes).toBeGreaterThanOrEqual(3 * n)
})

test("COMPLIANCE - i18n resuelve español, inglés y francés", () => {
  expect(translate("es", "nav.profile")).toBe("Perfil")
  expect(translate("en", "nav.profile")).toBe("Profile")
  expect(translate("fr", "nav.profile")).toBe("Profil")

  expect(getLocaleForLanguage("es")).toBe("es-CO")
  expect(getLocaleForLanguage("en")).toBe("en-US")
  expect(getLocaleForLanguage("fr")).toBe("fr-FR")
})

test("COMPLIANCE - el flujo IA tiene vista y endpoint de backend", () => {
  const aiPageExists = existsSync(join(process.cwd(), "app", "ia", "page.tsx"))
  const aiRouteExists = existsSync(
    join(process.cwd(), "app", "api", "nutrition-plan", "route.ts"),
  )

  expect(aiPageExists).toBe(true)
  expect(aiRouteExists).toBe(true)
})
