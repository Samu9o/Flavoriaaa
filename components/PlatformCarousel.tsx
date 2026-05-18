"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Calendar,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Map,
  MessageSquare,
  NotebookPen,
  PlusCircle,
  Sparkles,
  Store,
  TrendingUp,
  User,
  Video,
} from "lucide-react"

const sections = [
  { href: "/marketplace",       title: "Marketplace",          subtitle: "Compra en restaurantes locales al instante.",  icon: Store,        gradient: "from-orange-500 to-red-600" },
  { href: "/paises",            title: "Comida Internacional",  subtitle: "Recetas de todo el mundo paso a paso.",         icon: ChefHat,      gradient: "from-green-500 to-green-700" },
  { href: "/tendencias",        title: "Tendencias",            subtitle: "Mapa y líderes por localidad en Bogotá.",       icon: TrendingUp,   gradient: "from-red-500 to-red-700" },
  { href: "/guia",              title: "Mapa Guía",             subtitle: "Cómo llegar a tu restaurante favorito.",        icon: Map,          gradient: "from-orange-400 to-orange-600" },
  { href: "/comunidad-recetas", title: "Recetas",               subtitle: "Publicadas por la comunidad.",                  icon: NotebookPen,  gradient: "from-green-600 to-green-800" },
  { href: "/ia",                title: "IA Nutricional",        subtitle: "Plan alimentario personalizado con IA.",        icon: Sparkles,     gradient: "from-orange-500 to-red-500" },
  { href: "/videos",            title: "Videos",                subtitle: "Aprende técnicas en formato visual.",           icon: Video,        gradient: "from-red-500 to-orange-500" },
  { href: "/foros",             title: "Foros",                 subtitle: "Conversa con la comunidad gastronómica.",      icon: MessageSquare,gradient: "from-green-500 to-green-700" },
  { href: "/eventos",           title: "Eventos",               subtitle: "Encuentra encuentros gastronómicos.",           icon: Calendar,     gradient: "from-red-400 to-orange-500" },
  { href: "/subir",             title: "Subir Contenido",       subtitle: "Publica recetas, platos y novedades.",          icon: PlusCircle,   gradient: "from-green-400 to-green-600" },
  { href: "/perfil",            title: "Mi Perfil",             subtitle: "Gestiona tu cuenta y preferencias.",            icon: User,         gradient: "from-orange-400 to-red-500" },
]

const CARD_W   = 288
const CARD_GAP = 20
const STEP     = CARD_W + CARD_GAP
const INTERVAL = 3800

export function PlatformCarousel() {
  const [active, setActive]   = useState(0)
  const [paused, setPaused]   = useState(false)
  const [visible, setVisible] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback(
    (raw: number) => {
      const i = ((raw % sections.length) + sections.length) % sections.length
      setActive(i)
    },
    [],
  )

  const next = useCallback(() => goTo(active + 1), [active, goTo])
  const prev = useCallback(() => goTo(active - 1), [active, goTo])

  /* Auto-avance */
  useEffect(() => {
    if (paused) return
    const t = setInterval(next, INTERVAL)
    return () => clearInterval(t)
  }, [paused, next])

  /* Fade-in al hacer scroll hasta la sección */
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const translateX = -active * STEP

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Flechas ── */}
      <button
        onClick={prev}
        aria-label="Anterior"
        className="absolute -left-5 top-[42%] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-orange-500 text-white shadow-xl shadow-orange-900/60 transition hover:scale-110 hover:bg-orange-600 active:scale-90"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente"
        className="absolute -right-5 top-[42%] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-orange-500 text-white shadow-xl shadow-orange-900/60 transition hover:scale-110 hover:bg-orange-600 active:scale-90"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* ── Track ── */}
      <div className="overflow-hidden rounded-2xl px-1 py-4">
        <div
          ref={trackRef}
          className="flex gap-5"
          style={{
            transform:  `translateX(${translateX}px)`,
            transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
            opacity:    visible ? 1 : 0,
          }}
        >
          {sections.map((section, idx) => {
            const Icon     = section.icon
            const isActive = idx === active
            const dist     = Math.min(
              Math.abs(idx - active),
              Math.abs(idx - active + sections.length),
              Math.abs(idx - active - sections.length),
            )
            const opacity = dist === 0 ? 1 : dist === 1 ? 0.72 : 0.45
            const scale   = dist === 0 ? 1 : dist === 1 ? 0.96 : 0.92

            return (
              <Link
                key={section.href}
                href={section.href}
                style={{ width: CARD_W, minWidth: CARD_W, opacity, transform: `scale(${scale})` }}
                className={`group flex flex-none flex-col rounded-2xl border p-6 backdrop-blur-sm transition-all duration-400 ${
                  isActive
                    ? "border-orange-500/60 bg-gradient-to-br from-orange-500/15 to-red-500/10 shadow-2xl shadow-orange-900/40"
                    : "border-white/10 bg-white/5 hover:border-orange-400/40 hover:bg-white/10"
                }`}
              >
                {/* Ícono */}
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${section.gradient} text-white shadow-lg shadow-black/40`}>
                  <Icon className="h-7 w-7" />
                </div>

                {/* Texto */}
                <h3 className="text-base font-bold text-white">{section.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">{section.subtitle}</p>

                {/* CTA */}
                <div className={`mt-5 flex items-center gap-1 text-xs font-bold ${isActive ? "text-orange-300" : "text-orange-400/70 group-hover:text-orange-300"}`}>
                  Abrir
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>

                {/* Línea activa */}
                {isActive && (
                  <div className="mt-4 h-0.5 w-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 opacity-80" />
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Progreso + dots ── */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="h-0.5 w-48 overflow-hidden rounded-full bg-white/10">
          <div
            key={active}
            className="h-full rounded-full bg-orange-500"
            style={{ animation: paused ? "none" : `progressBar ${INTERVAL}ms linear forwards` }}
          />
        </div>
        <div className="flex items-center gap-2">
          {sections.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ir a ${sections[i].title}`}
              className={`rounded-full transition-all duration-300 ${
                i === active ? "h-2 w-8 bg-orange-500" : "h-1.5 w-1.5 bg-white/20 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
