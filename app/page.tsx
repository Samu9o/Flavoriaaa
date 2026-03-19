import Link from "next/link"
import {
  Calendar,
  ChefHat,
  MessageSquare,
  PlusCircle,
  Sparkles,
  Store,
  TrendingUp,
  User,
  Video,
} from "lucide-react"

type MenuItem = {
  href: string
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
}

const menuItems: MenuItem[] = [
  {
    href: "/",
    title: "Marketplace",
    subtitle: "Explora restaurantes, menus y compras.",
    icon: Store,
    accent: "from-orange-400 to-red-500",
  },
  {
    href: "/paises",
    title: "Comida por Paises",
    subtitle: "Descubre recetas internacionales paso a paso.",
    icon: ChefHat,
    accent: "from-emerald-400 to-green-600",
  },
  {
    href: "/tendencias",
    title: "Tendencias",
    subtitle: "Revisa el mapa y lideres por localidad.",
    icon: TrendingUp,
    accent: "from-cyan-400 to-blue-600",
  },
  {
    href: "/ia",
    title: "IA Nutricional",
    subtitle: "Genera un plan personalizado segun tus objetivos.",
    icon: Sparkles,
    accent: "from-amber-300 to-orange-500",
  },
  {
    href: "/videos",
    title: "Videos",
    subtitle: "Aprende tecnicas y recetas en formato visual.",
    icon: Video,
    accent: "from-fuchsia-400 to-pink-600",
  },
  {
    href: "/foros",
    title: "Foros",
    subtitle: "Comparte dudas y conversa con la comunidad.",
    icon: MessageSquare,
    accent: "from-violet-400 to-indigo-600",
  },
  {
    href: "/eventos",
    title: "Eventos",
    subtitle: "Encuentra actividades y encuentros gastronomicos.",
    icon: Calendar,
    accent: "from-sky-400 to-cyan-600",
  },
  {
    href: "/subir",
    title: "Subir Contenido",
    subtitle: "Publica recetas, platos y novedades.",
    icon: PlusCircle,
    accent: "from-lime-400 to-emerald-600",
  },
  {
    href: "/perfil",
    title: "Perfil",
    subtitle: "Gestiona tu cuenta y tus preferencias.",
    icon: User,
    accent: "from-rose-400 to-red-600",
  },
]

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#fff8ef] px-4 py-14 sm:px-8">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-orange-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-300/30 blur-3xl" />

      <section className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-xl">
          <ChefHat className="h-10 w-10" />
        </div>
        <h1
          className="text-5xl font-black tracking-tight text-[#271300] sm:text-6xl"
          style={{ fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif" }}
        >
          FLAVORIA
        </h1>
        <p className="mt-3 max-w-2xl text-base text-[#5f3b1f] sm:text-lg">
          Bienvenido al menu principal. Selecciona una opcion para ir a cada seccion de la
          plataforma.
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.href + item.title}
              href={item.href}
              className="group rounded-2xl border border-[#f0d7c0] bg-white/90 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-white`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-[#2c1908]">{item.title}</h2>
              <p className="mt-2 text-sm text-[#6b4b34]">{item.subtitle}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#d0611f]">
                Ir a la seccion
              </p>
            </Link>
          )
        })}
      </section>
    </main>
  )
}
