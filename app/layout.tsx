import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { LanguageProvider } from "@/lib/i18n"
import { UserProvider } from "@/lib/userContext"
import { AuthProvider } from "@/lib/authContext"

export const metadata: Metadata = {
  title: "Flavoria — Restaurantes, comunidad y marketplace gastronómico",
  description:
    "La alternativa colombiana a Rappi: restaurantes reales de Bogotá, comunidad gastronómica, recetas, foros e IA nutricional.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-surface min-h-screen font-mono">
        <LanguageProvider>
          <AuthProvider>
            <UserProvider>
              <Navbar />
              <main>{children}</main>
            </UserProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
