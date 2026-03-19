"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  ChefHat,
  Globe2,
  House,
  LayoutDashboard,
  Map,
  MessageSquare,
  PlusCircle,
  Sparkles,
  Store,
  TrendingUp,
  User,
  Video,
} from "lucide-react"
import { useI18n, type Language } from "@/lib/i18n"
import { useUser } from "@/lib/userContext"

const navItems = [
  { href: "/", key: "nav.home", icon: House },
  { href: "/marketplace", key: "nav.marketplace", icon: Store },
  { href: "/videos", key: "nav.videos", icon: Video },
  { href: "/tendencias", key: "nav.trends", icon: TrendingUp },
  { href: "/guia", key: "nav.guide", icon: Map },
  { href: "/paises", key: "nav.countries", icon: ChefHat },
  { href: "/ia", key: "nav.ai", icon: Sparkles },
  { href: "/subir", key: "nav.upload", icon: PlusCircle },
  { href: "/foros", key: "nav.forums", icon: MessageSquare },
  { href: "/perfil", key: "nav.profile", icon: User },
  { href: "/eventos", key: "nav.events", icon: Calendar },
]

const roleLabelKey: Record<string, string> = {
  admin: "nav.role.admin",
  moderator: "nav.role.moderator",
  support: "nav.role.support",
  user: "nav.role.user",
}

const accountTypeLabelKey: Record<string, string> = {
  admin: "nav.account.admin",
  restaurant: "nav.account.restaurant",
  consumer: "nav.account.consumer",
}

export default function Navbar() {
  const {
    sesion,
    toggleSesion,
    rol,
    setRol,
    currentUser,
    communityUsers,
    currentPlatformRole,
    currentAccountType,
    switchAccount,
  } = useUser()
  const { language, setLanguage, t } = useI18n()

  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <ChefHat className="h-6 w-6 text-orange-500" />
          {t("nav.brand")}
        </Link>

        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          {navItems.map(({ href, key, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-orange-50 text-orange-500"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t(key)}</span>
              </Link>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-2 py-1.5">
            <LayoutDashboard className="h-4 w-4 text-gray-500" />
            <select
              value={currentUser?.id ?? ""}
              onChange={(e) => switchAccount(e.target.value)}
              className="bg-transparent text-sm text-gray-600 outline-none"
              aria-label={t("nav.profile")}
            >
              {communityUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-2 py-1.5">
            <Globe2 className="h-4 w-4 text-gray-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-sm text-gray-600 outline-none"
              aria-label={t("language.current")}
            >
              <option value="es">{t("language.es")}</option>
              <option value="en">{t("language.en")}</option>
              <option value="fr">{t("language.fr")}</option>
            </select>
          </div>

          {sesion && (
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value as typeof rol)}
              className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-600"
              aria-label={t("nav.expertise")}
            >
              <option value="foodie">Foodie</option>
              <option value="pro_curious">Pro Curious</option>
              <option value="chef">Chef</option>
            </select>
          )}

          {sesion && currentAccountType && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {t(accountTypeLabelKey[currentAccountType] ?? currentAccountType)}
            </span>
          )}

          {sesion && currentPlatformRole && (
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
              {t(roleLabelKey[currentPlatformRole] ?? currentPlatformRole)}
            </span>
          )}

          <button
            onClick={toggleSesion}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
              sesion
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "border border-orange-500 text-orange-500 hover:bg-orange-50"
            }`}
          >
            {sesion ? t("nav.signOut") : t("nav.signIn")}
          </button>
        </div>
      </div>
    </nav>
  )
}
