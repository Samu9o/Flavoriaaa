import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { LanguageProvider } from "@/lib/i18n"
import { UserProvider } from "@/lib/userContext"

export const metadata: Metadata = {
  title: "Flavoria Market - Restaurantes, comunidad, marketplace e IA",
  description:
    "Marketplace gastronómico con restaurantes, menús, compras entre cuentas, tendencias en Bogotá e IA nutricional.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-surface min-h-screen font-mono">
        <LanguageProvider>
          <UserProvider>
            <Navbar />
            <main>{children}</main>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
