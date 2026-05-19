"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState, type FormEvent } from "react"
import {
  Calendar,
  ChefHat,
  ChevronDown,
  Globe2,
  LayoutDashboard,
  LogOut,
  Map,
  MessageSquare,
  NotebookPen,
  PlusCircle,
  Rss,
  Search,
  Sparkles,
  Store,
  TrendingUp,
  User,
  UserPlus,
  Users,
  Video,
  House,
} from "lucide-react"
import { useI18n, type Language } from "@/lib/i18n"
import { useUser } from "@/lib/userContext"
import { useAuth } from "@/lib/authContext"
import AuthModal from "@/components/AuthModal"

// ─── Grupos de navegación ──────────────────────────────────────────────
type NavItem = { href: string; label: string; icon: React.ElementType; desc?: string }
type NavGroup =
  | { id: string; label: string; icon: React.ElementType; href: string; items?: never }
  | { id: string; label: string; icon: React.ElementType; href?: never; items: NavItem[] }

const NAV_GROUPS: NavGroup[] = [
  { id: "home",        label: "Inicio",       icon: House,        href: "/" },
  { id: "restaurants", label: "Restaurantes", icon: Store,        href: "/marketplace" },
  {
    id: "community", label: "Comunidad", icon: Users,
    items: [
      { href: "/feed",      label: "Feed",     icon: Rss,            desc: "Publicaciones de la comunidad" },
      { href: "/foros",     label: "Foros",    icon: MessageSquare,  desc: "Debates y discusiones" },
      { href: "/perfiles",  label: "Perfiles", icon: Users,          desc: "Explora otros usuarios" },
      { href: "/videos",    label: "Videos",   icon: Video,          desc: "Recetas en video" },
    ],
  },
  {
    id: "discover", label: "Descubrir", icon: TrendingUp,
    items: [
      { href: "/tendencias",  label: "Tendencias",       icon: TrendingUp, desc: "Lo más popular en Bogotá" },
      { href: "/guia",        label: "Guía Gastronómica", icon: Map,        desc: "Explora la gastronomía" },
      { href: "/paises",      label: "Cocinas del Mundo", icon: ChefHat,    desc: "Recetas internacionales" },
    ],
  },
  {
    id: "learn", label: "Aprender", icon: Sparkles,
    items: [
      { href: "/comunidad-recetas", label: "Recetas",        icon: NotebookPen, desc: "Comparte tus recetas" },
      { href: "/ia",                label: "IA Nutricional", icon: Sparkles,    desc: "Plan con inteligencia artificial" },
    ],
  },
  { id: "upload", label: "Subir",    icon: PlusCircle, href: "/subir" },
  { id: "events", label: "Eventos",  icon: Calendar,   href: "/eventos" },
]

const ACCOUNT_TYPE_COLOR: Record<string, string> = {
  admin:      "bg-red-500/20 text-red-400",
  restaurant: "bg-orange-500/20 text-orange-400",
  consumer:   "bg-green-500/20 text-green-400",
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { language, setLanguage, t } = useI18n()
  const { sesion, toggleSesion, rol, setRol, currentUser, communityUsers, currentAccountType, switchAccount } = useUser()
  const { user: authUser, logout: authLogout } = useAuth()

  const handleLogout = () => {
    authLogout()           // limpia JWT
    if (sesion) toggleSesion()  // apaga sesión mock
    setShowUserMenu(false)
  }

  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: "login" | "register" }>({ open: false, tab: "login" })
  const [searchQuery, setSearchQuery] = useState("")

  const navRef = useRef<HTMLElement>(null)
  const groupBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null)
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Close dropdowns on route change
  useEffect(() => {
    setOpenGroup(null)
    setShowUserMenu(false)
  }, [pathname])

  const isGroupActive = (group: NavGroup) => {
    if ("href" in group && group.href) return pathname === group.href
    if ("items" in group && group.items) return group.items.some((i) => pathname === i.href)
    return false
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const toggleGroup = (id: string) => {
    setOpenGroup((prev) => (prev === id ? null : id))
    setShowUserMenu(false)
  }

  const displayUser = authUser ?? (sesion ? currentUser : null)
  const displayName = authUser?.nombre ?? currentUser?.name ?? null

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0d0500]/98 shadow-xl backdrop-blur-md"
      >
        {/* ═══ FILA 1: Logo | Search | Controls ═══ */}
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2 font-extrabold text-white hover:opacity-80 transition-opacity">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-md shadow-orange-900/60">
              <ChefHat className="h-5 w-5 text-white" />
            </span>
            <span className="hidden text-xl tracking-tight sm:inline">
              FLAV<span className="text-orange-500">ORIA</span>
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative flex-1 max-w-xl mx-auto hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Restaurantes, platos, localidades…"
              className="h-10 w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-orange-500/50 focus:bg-white/8 focus:ring-2 focus:ring-orange-500/20"
            />
          </form>

          {/* Right controls */}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {/* Language */}
            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5">
              <Globe2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs text-gray-300 outline-none cursor-pointer"
              >
                <option value="es" className="bg-gray-900">ES</option>
                <option value="en" className="bg-gray-900">EN</option>
                <option value="fr" className="bg-gray-900">FR</option>
              </select>
            </div>

            {/* Account button */}
            {displayUser ? (
              <div className="relative">
                <button
                  onClick={() => { setShowUserMenu((v) => !v); setOpenGroup(null) }}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 transition hover:bg-white/10"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-xs font-black text-white">
                    {(displayName?.[0] ?? "U").toUpperCase()}
                  </span>
                  <span className="hidden max-w-[120px] truncate text-sm font-semibold text-white md:block">
                    {displayName}
                  </span>
                  {currentAccountType && (
                    <span className={`hidden rounded-full px-2 py-0.5 text-[10px] font-bold lg:block ${ACCOUNT_TYPE_COLOR[currentAccountType] ?? "bg-white/10 text-gray-300"}`}>
                      {currentAccountType}
                    </span>
                  )}
                  <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
                </button>

                {/* User dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#120400] shadow-2xl shadow-black/60">
                    {/* User info */}
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="font-bold text-white">{displayName}</p>
                      {authUser && <p className="text-xs text-gray-500">{authUser.email}</p>}
                      {authUser && (
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${ACCOUNT_TYPE_COLOR[authUser.rol] ?? "bg-white/10 text-gray-300"}`}>
                          {authUser.rol}
                        </span>
                      )}
                    </div>

                    {/* Account switcher (mock) */}
                    {communityUsers.length > 0 && (
                      <div className="border-b border-white/10 px-4 py-2">
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                          <LayoutDashboard className="mr-1 inline h-3 w-3" />Cambiar cuenta
                        </p>
                        <select
                          value={currentUser?.id ?? ""}
                          onChange={(e) => { switchAccount(e.target.value); setShowUserMenu(false) }}
                          className="w-full rounded-lg bg-white/5 px-2 py-1.5 text-xs text-gray-300 outline-none border border-white/10"
                        >
                          {communityUsers.map((u) => (
                            <option key={u.id} value={u.id} className="bg-gray-900">{u.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Expertise */}
                    {sesion && (
                      <div className="border-b border-white/10 px-4 py-2">
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Perfil culinario</p>
                        <select
                          value={rol}
                          onChange={(e) => setRol(e.target.value as typeof rol)}
                          className="w-full rounded-lg bg-white/5 px-2 py-1.5 text-xs text-gray-300 outline-none border border-white/10"
                        >
                          <option value="foodie" className="bg-gray-900">🍽️ Foodie</option>
                          <option value="pro_curious" className="bg-gray-900">👨‍🍳 Pro Curious</option>
                          <option value="chef" className="bg-gray-900">⭐ Chef</option>
                        </select>
                      </div>
                    )}

                    {/* Mi Perfil */}
                    <Link
                      href="/perfil"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                    >
                      <User className="h-4 w-4 text-orange-400" />
                      Mi Perfil
                    </Link>

                    {/* ── Sección de sesión ── */}
                    <div className="border-t border-white/10 p-3 space-y-2">
                      {/* Cerrar sesión */}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/15 hover:text-red-300"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10">
                          <LogOut className="h-4 w-4" />
                        </span>
                        Cerrar sesión
                      </button>

                      {/* Crear cuenta nueva */}
                      <button
                        onClick={() => {
                          handleLogout()
                          setAuthModal({ open: true, tab: "register" })
                        }}
                        className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-orange-500/15 to-red-500/10 px-3 py-2.5 text-sm font-semibold text-orange-400 transition hover:from-orange-500/25 hover:to-red-500/20 hover:text-orange-300 border border-orange-500/20"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/20">
                          <UserPlus className="h-4 w-4" />
                        </span>
                        Crear cuenta nueva
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModal({ open: true, tab: "login" })}
                  className="rounded-xl border border-orange-500/40 px-3 py-1.5 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/10 hover:border-orange-500"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => setAuthModal({ open: true, tab: "register" })}
                  className="hidden rounded-xl bg-orange-500 px-3 py-1.5 text-sm font-bold text-white transition hover:bg-orange-600 sm:block"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ═══ FILA 2: Categorías ═══ */}
        {/* Wrapper relative para anclar dropdowns FUERA del overflow-x-auto */}
        <div className="relative border-t border-white/5 bg-[#0d0500]">
          {/* Scroll container — sólo los botones, sin dropdowns adentro */}
          <div className="mx-auto flex max-w-7xl items-center overflow-x-auto no-scrollbar px-4">
            {NAV_GROUPS.map((group) => {
              const active = isGroupActive(group)
              const isOpen = openGroup === group.id
              const hasDropdown = "items" in group && !!group.items

              return hasDropdown ? (
                <button
                  key={group.id}
                  ref={(el) => { groupBtnRefs.current[group.id] = el }}
                  onClick={() => toggleGroup(group.id)}
                  className={`flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                    active || isOpen
                      ? "border-orange-500 text-orange-400"
                      : "border-transparent text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <group.icon className="h-4 w-4 shrink-0" />
                  {group.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <Link
                  key={group.id}
                  href={group.href!}
                  className={`flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                    active
                      ? "border-orange-500 text-orange-400"
                      : "border-transparent text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <group.icon className="h-4 w-4 shrink-0" />
                  {group.label}
                </Link>
              )
            })}

            {/* Mi Perfil al final */}
            <Link
              href="/perfil"
              className={`ml-auto flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                pathname === "/perfil"
                  ? "border-orange-500 text-orange-400"
                  : "border-transparent text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              <User className="h-4 w-4 shrink-0" />
              Mi Perfil
            </Link>
          </div>

          {/* Dropdowns renderizados FUERA del contenedor overflow-x-auto */}
          {NAV_GROUPS.map((group) => {
            if (!("items" in group) || !group.items || openGroup !== group.id) return null
            // offsetLeft del botón real para posición exacta
            const leftPx = groupBtnRefs.current[group.id]?.offsetLeft ?? 16

            return (
              <div
                key={group.id}
                style={{ left: leftPx }}
                className="absolute top-full z-[60] min-w-[230px] overflow-hidden rounded-b-2xl rounded-tr-2xl border border-white/10 bg-[#120400] shadow-2xl shadow-black/60"
              >
                {group.items.map((item) => {
                  const itemActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-start gap-3 px-4 py-3 transition hover:bg-orange-500/10 ${
                        itemActive ? "bg-orange-500/10" : ""
                      }`}
                    >
                      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        itemActive ? "bg-orange-500/20 text-orange-400" : "bg-white/5 text-gray-400"
                      }`}>
                        <item.icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className={`text-sm font-semibold ${itemActive ? "text-orange-400" : "text-white"}`}>{item.label}</p>
                        {item.desc && <p className="text-xs text-gray-500">{item.desc}</p>}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        open={authModal.open}
        onClose={() => setAuthModal((s) => ({ ...s, open: false }))}
        defaultTab={authModal.tab}
      />
    </>
  )
}
