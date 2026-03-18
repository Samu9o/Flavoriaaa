import { getLocaleForLanguage, translate } from "../lib/i18n"

test("HU10 - la navegación cambia a inglés", () => {
  expect(translate("en", "nav.trends")).toBe("Trends")
  expect(translate("en", "nav.ai")).toBe("Nutrition AI")
})

test("HU10 - la navegación cambia a francés", () => {
  expect(translate("fr", "nav.profile")).toBe("Profil")
  expect(translate("fr", "language.current")).toBe("Langue")
})

test("HU10 - las traducciones usan fallback a español cuando no existe la clave", () => {
  expect(translate("en", "clave.inexistente")).toBe("clave.inexistente")
})

test("HU10 - el locale se resuelve según el idioma seleccionado", () => {
  expect(getLocaleForLanguage("es")).toBe("es-CO")
  expect(getLocaleForLanguage("en")).toBe("en-US")
  expect(getLocaleForLanguage("fr")).toBe("fr-FR")
})
