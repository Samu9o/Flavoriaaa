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
  NotebookPen,
  MessageSquare,
  PlusCircle,
  Rss,
  Sparkles,
  Store,
  TrendingUp,
  User,
  Users,
  Video,
} from "lucide-react"
import { useI18n, type Language } from "@/lib/i18n"
import { useUser } from "@/lib/userContext"

const navItems = [
  { href: "/", labelKey: "nav.home", icon: House },
  { href: "/marketplace", labelKey: "nav.marketplace", icon: Store },
  { href: "/videos", labelKey: "nav.videos", icon: Video },
  { href: "/tendencias", labelKey: "nav.trends", icon: TrendingUp },
  { href: "/guia", labelKey: "nav.guide", icon: Map },
  { href: "/comunidad-recetas", labelKey: "nav.communityRecipes", icon: NotebookPen },
  { href: "/paises", labelKey: "nav.countries", icon: ChefHat },
  { href: "/ia", labelKey: "nav.ai", icon: Sparkles },
  { href: "/subir", labelKey: "nav.upload", icon: PlusCircle },
  { href: "/foros", labelKey: "nav.forums", icon: MessageSquare },
  { href: "/perfiles", labelKey: "nav.profiles", icon: Users },
  { href: "/feed", labelKey: "nav.feed", icon: Rss },
  { href: "/perfil", labelKey: "nav.profile", icon: User },
  { href: "/eventos", labelKey: "nav.events", icon: Calendar },
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
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0d0500]/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-[#0d0500]/90">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2">

        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-extrabold text-white transition-opacity hover:opacity-80"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-md shadow-orange-900/60">
            <ChefHat className="h-4 w-4 text-white" />
          </span>
          <span className="hidden text-lg sm:inline">
            FLAV<span className="text-orange-500">ORIA</span>
          </span>
        </Link>

        {/* Nav items */}
        <div className="flex flex-wrap items-center gap-0.5">
          {navItems.map(({ href, labelKey, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-orange-500/20 text-orange-400 font-semibold"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{t(labelKey)}</span>
              </Link>
            )
          })}
        </div>

        {/* Right controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Account switcher */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5">
            <LayoutDashboard className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={currentUser?.id ?? ""}
              onChange={(e) => switchAccount(e.target.value)}
              className="bg-transparent text-xs text-gray-300 outline-none"
              aria-label={t("nav.profile")}
            >
              {communityUsers.map((user) => (
                <option key={user.id} value={user.id} className="bg-gray-900 text-white">
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5">
            <Globe2 className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-xs text-gray-300 outline-none"
              aria-label={t("language.current")}
            >
              <option value="es" className="bg-gray-900">{t("language.es")}</option>
              <option value="en" className="bg-gray-900">{t("language.en")}</option>
              <option value="fr" className="bg-gray-900">{t("language.fr")}</option>
            </select>
          </div>

          {/* Expertise */}
          {sesion && (
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value as typeof rol)}
              className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-gray-300 outline-none"
              aria-label={t("nav.expertise")}
            >
              <option value="foodie" className="bg-gray-900">Foodie</option>
              <option value="pro_curious" className="bg-gray-900">Pro Curious</option>
              <option value="chef" className="bg-gray-900">Chef</option>
            </select>
          )}

          {/* Account type badge */}
          {sesion && currentAccountType && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-gray-300">
              {t(accountTypeLabelKey[currentAccountType] ?? currentAccountType)}
            </span>
          )}

          {/* Platform role badge */}
          {sesion && currentPlatformRole && (
            <span className="rounded-full bg-orange-500/20 px-2.5 py-1 text-xs font-semibold text-orange-400">
              {t(roleLabelKey[currentPlatformRole] ?? currentPlatformRole)}
            </span>
          )}

          {/* Sign in/out */}
          <button
            onClick={toggleSesion}
            className={`rounded-xl px-3 py-1.5 text-sm font-bold transition-all duration-150 ${
              sesion
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "border border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
            }`}
          >
            {sesion ? t("nav.signOut") : t("nav.signIn")}
          </button>
        </div>
      </div>
    </nav>
  )
}
