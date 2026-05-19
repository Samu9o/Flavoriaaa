import Link from "next/link"
import { ArrowRight, ChefHat, ShoppingBag, Store } from "lucide-react"
import { PlatformCarousel } from "@/components/PlatformCarousel"

export default function HomePage() {
  return (
    <main className="bg-[#0d0500]">

      {/* ══ HERO ══ */}
      <section className="hero-dark flex min-h-[88vh] flex-col items-center justify-center px-6 py-24 text-center">
        <div className="relative z-10 mx-auto max-w-4xl">

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2 text-sm font-medium text-orange-300">
            <ChefHat className="h-4 w-4" />
            Gastronomía bogotana · Pedidos · Comunidad
          </div>

          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-orange-500 to-red-600 shadow-2xl shadow-orange-900/60">
            <ChefHat className="h-12 w-12 text-white" />
          </div>

          <h1 className="text-7xl font-black tracking-tight text-white sm:text-8xl md:text-9xl">
            FLAV<span className="text-orange-500">ORIA</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
            Ordena de los mejores restaurantes de Bogotá, descubre recetas y conecta con la
            comunidad culinaria.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-orange-500 px-7 py-4 text-base font-bold text-white shadow-lg shadow-orange-900/50 transition hover:scale-105 hover:bg-orange-600 hover:shadow-xl active:scale-95"
            >
              <ShoppingBag className="h-5 w-5" />
              Ordenar ahora
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Ver comunidad
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4">
            {[
              { value: "8+",   label: "Restaurantes" },
              { value: "100+", label: "Pedidos" },
              { value: "3",    label: "Idiomas" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-orange-400 sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MARKETPLACE CTA ══ */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-white sm:flex-row">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-200">Acción principal</p>
            <h2 className="mt-1 text-3xl font-black">Marketplace de Restaurantes</h2>
            <p className="mt-2 max-w-md text-orange-100">
              Explora restaurantes locales, elige tu plato y realiza tu pedido al instante.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-base font-bold text-orange-600 shadow-lg transition hover:scale-105 hover:shadow-xl active:scale-95"
          >
            <Store className="h-5 w-5" />
            Ir al Marketplace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ══ CARRUSEL ══ */}
      <section
        className="px-4 py-20 sm:px-8"
        style={{ background: "linear-gradient(180deg,#0d0500 0%,#150800 60%,#1a0a00 100%)" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="mb-3 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-400">
              Explora la plataforma
            </span>
            <h2 className="text-3xl font-black text-white sm:text-4xl">
              Todo Flavoria en un vistazo
            </h2>
            <p className="mt-3 max-w-lg text-gray-400">
              Navega con las flechas o déjate llevar — el carrusel avanza solo.
            </p>
          </div>

          <PlatformCarousel />
        </div>
      </section>

    </main>
  )
}
