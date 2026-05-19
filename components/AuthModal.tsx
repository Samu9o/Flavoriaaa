"use client"

import { type FormEvent, useEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChefHat,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  Store,
  UtensilsCrossed,
  User,
  UserCheck,
  X,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/authContext"

type Tab    = "login" | "register"
type Screen = "form" | "success"

const ACCOUNT_TYPES = [
  { value: "consumer",   label: "Consumidor",  icon: UserCheck,       desc: "Descubre restaurantes y pide comida" },
  { value: "restaurant", label: "Restaurante",  icon: Store,           desc: "Publica tu negocio y menú" },
] as const

const EXPERTISE = [
  { value: "foodie",      label: "Foodie",       icon: UtensilsCrossed, desc: "Me encanta explorar sabores" },
  { value: "pro_curious", label: "Pro Curious",  icon: Sparkles,        desc: "Aprendo cocina seriamente" },
  { value: "chef",        label: "Chef",         icon: ChefHat,         desc: "Cocino a nivel profesional" },
] as const

type AccountType = "consumer" | "restaurant"
type ExpertiseType = "foodie" | "pro_curious" | "chef"

interface Props {
  open: boolean
  onClose: () => void
  defaultTab?: Tab
}

export default function AuthModal({ open, onClose, defaultTab = "login" }: Props) {
  const { login, register, user } = useAuth()

  const [tab,     setTab]     = useState<Tab>(defaultTab)
  const [screen,  setScreen]  = useState<Screen>("form")
  const [regStep, setRegStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [showPwd, setShowPwd] = useState(false)

  // Login
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")

  // Register step 1
  const [nombre,      setNombre]      = useState("")
  const [regEmail,    setRegEmail]    = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [confirm,     setConfirm]     = useState("")

  // Register step 2
  const [accountType, setAccountType] = useState<AccountType>("consumer")
  const [expertise,   setExpertise]   = useState<ExpertiseType>("foodie")

  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setError(null)
      setTab(defaultTab)
      setScreen("form")
      setRegStep(1)
      setTimeout(() => firstInputRef.current?.focus(), 100)
    }
  }, [open, defaultTab])

  useEffect(() => { setError(null) }, [tab, regStep])

  if (!open) return null

  // ── Login ──────────────────────────────────────────────────────────
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError("Completa todos los campos"); return }
    setError(null); setLoading(true)
    try {
      await login(email, password)
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Credenciales incorrectas")
    } finally { setLoading(false) }
  }

  // ── Register step 1 validation ─────────────────────────────────────
  const handleStep1 = (e: FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !regEmail || !regPassword || !confirm) { setError("Completa todos los campos"); return }
    if (regPassword !== confirm) { setError("Las contraseñas no coinciden"); return }
    if (regPassword.length < 6) { setError("Mínimo 6 caracteres en la contraseña"); return }
    setError(null)
    setRegStep(2)
  }

  // ── Register step 2 submit ─────────────────────────────────────────
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      await register(nombre, regEmail, regPassword, accountType)
      setScreen("success")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta")
    } finally { setLoading(false) }
  }

  // ── Success screen ─────────────────────────────────────────────────
  if (screen === "success") {
    const registeredUser = user
    const acType = ACCOUNT_TYPES.find(a => a.value === accountType)!
    const exp    = EXPERTISE.find(e => e.value === expertise)!

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} aria-hidden />
        <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl bg-[#0d0500] border border-white/10 shadow-2xl shadow-black/60">
          {/* Close */}
          <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>

          {/* Header success */}
          <div className="relative overflow-hidden px-8 pt-10 pb-6 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/15 via-orange-600/10 to-red-800/15" />
            <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 shadow-xl shadow-orange-900/60 text-3xl font-black text-white">
              {nombre.charAt(0).toUpperCase()}
            </div>
            <div className="relative mb-1 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <h2 className="text-xl font-black text-white">¡Cuenta creada!</h2>
            </div>
            <p className="relative text-sm text-gray-400">Bienvenido a Flavoria, {nombre.split(" ")[0]}</p>
          </div>

          {/* Profile card */}
          <div className="mx-6 mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {/* Info rows */}
            <div className="divide-y divide-white/5">
              <ProfileRow label="Nombre" value={registeredUser?.nombre ?? nombre} />
              <ProfileRow label="Correo" value={registeredUser?.email ?? regEmail} />
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-semibold text-gray-500">Tipo de cuenta</span>
                <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  accountType === "restaurant" ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"
                }`}>
                  <acType.icon className="h-3.5 w-3.5" />
                  {acType.label}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-semibold text-gray-500">Perfil culinario</span>
                <span className="flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-400">
                  <exp.icon className="h-3.5 w-3.5" />
                  {exp.label}
                </span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-2 px-6 pb-6">
            <Link
              href="/marketplace"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 py-3 text-sm font-black text-white shadow-lg shadow-orange-900/40 transition hover:from-orange-600 hover:to-red-700"
            >
              Ir al Marketplace
            </Link>
            <Link
              href="/perfil"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              Ver mi perfil
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Form screen ────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} aria-hidden />

      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl bg-[#0d0500] border border-white/10 shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="relative overflow-hidden px-8 pt-8 pb-5 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-transparent to-red-800/20" />
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
          <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-900/60 mx-auto mb-2">
            <ChefHat className="h-6 w-6 text-white" />
          </div>
          <h2 className="relative text-xl font-black text-white">FLAV<span className="text-orange-500">ORIA</span></h2>
          {tab === "register" && (
            <div className="relative mt-3 flex items-center justify-center gap-2">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black transition-all ${
                    regStep >= s ? "bg-orange-500 text-white" : "bg-white/10 text-gray-500"
                  }`}>{s}</div>
                  {s < 2 && <div className={`h-px w-8 transition-all ${regStep > s ? "bg-orange-500" : "bg-white/10"}`} />}
                </div>
              ))}
              <span className="ml-1 text-xs text-gray-500">
                {regStep === 1 ? "Datos de acceso" : "Tu perfil"}
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mx-6 mb-5 flex rounded-xl bg-white/5 p-1">
          {(["login", "register"] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setRegStep(1) }}
              className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${tab === t ? "bg-orange-500 text-white shadow-sm" : "text-gray-400 hover:text-white"}`}>
              {t === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-6 pb-7">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
              {error}
            </div>
          )}

          {/* ── LOGIN ── */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <Field icon={<Mail className="h-4 w-4" />} label="Correo electrónico">
                <input ref={firstInputRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com" autoComplete="email" required className="input-dark" />
              </Field>
              <Field icon={<Lock className="h-4 w-4" />} label="Contraseña"
                extra={<button type="button" onClick={() => setShowPwd(v => !v)} className="text-gray-500 hover:text-gray-300 transition">{showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}>
                <input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password" required className="input-dark" />
              </Field>
              <button type="submit" disabled={loading}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-600 py-3 text-sm font-black text-white shadow-lg shadow-orange-900/40 transition hover:from-orange-600 hover:to-red-700 active:scale-[0.98] disabled:opacity-50">
                {loading ? <Spinner /> : "Entrar a Flavoria"}
              </button>
              <p className="text-center text-xs text-gray-500">
                ¿No tienes cuenta?{" "}
                <button type="button" onClick={() => setTab("register")} className="font-semibold text-orange-400 hover:underline">Regístrate gratis</button>
              </p>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-gray-500">
                <p className="font-semibold text-gray-400 mb-1">Cuenta demo:</p>
                <p>admin@flavoria.com / admin123</p>
              </div>
            </form>
          )}

          {/* ── REGISTER STEP 1: datos de acceso ── */}
          {tab === "register" && regStep === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <Field icon={<User className="h-4 w-4" />} label="Nombre completo">
                <input ref={firstInputRef} type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre completo" autoComplete="name" required className="input-dark" />
              </Field>
              <Field icon={<Mail className="h-4 w-4" />} label="Correo electrónico">
                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="tu@email.com" autoComplete="email" required className="input-dark" />
              </Field>
              <Field icon={<Lock className="h-4 w-4" />} label="Contraseña"
                extra={<button type="button" onClick={() => setShowPwd(v => !v)} className="text-gray-500 hover:text-gray-300 transition">{showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}>
                <input type={showPwd ? "text" : "password"} value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres" autoComplete="new-password" required className="input-dark" />
              </Field>
              <Field icon={<Lock className="h-4 w-4" />} label="Confirmar contraseña">
                <input type={showPwd ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repite tu contraseña" autoComplete="new-password" required className="input-dark" />
              </Field>
              <button type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 py-3 text-sm font-black text-white shadow-lg shadow-orange-900/40 transition hover:from-orange-600 hover:to-red-700 active:scale-[0.98]">
                Continuar <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-center text-xs text-gray-500">
                ¿Ya tienes cuenta?{" "}
                <button type="button" onClick={() => setTab("login")} className="font-semibold text-orange-400 hover:underline">Inicia sesión</button>
              </p>
            </form>
          )}

          {/* ── REGISTER STEP 2: perfil ── */}
          {tab === "register" && regStep === 2 && (
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Tipo de cuenta */}
              <div>
                <p className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tipo de cuenta</p>
                <div className="grid grid-cols-2 gap-2">
                  {ACCOUNT_TYPES.map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setAccountType(opt.value)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition ${
                        accountType === opt.value
                          ? "border-orange-500 bg-orange-500/10 text-orange-400"
                          : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                      }`}>
                      <opt.icon className="h-5 w-5" />
                      <span className="text-xs font-bold">{opt.label}</span>
                      <span className="text-[10px] leading-tight opacity-70">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Perfil culinario */}
              <div>
                <p className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Perfil culinario</p>
                <div className="grid grid-cols-3 gap-2">
                  {EXPERTISE.map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setExpertise(opt.value)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition ${
                        expertise === opt.value
                          ? "border-purple-500 bg-purple-500/10 text-purple-400"
                          : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                      }`}>
                      <opt.icon className="h-5 w-5" />
                      <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-gray-600 text-center">
                  {EXPERTISE.find(e => e.value === expertise)?.desc}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button type="button" onClick={() => setRegStep(1)}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-gray-400 transition hover:bg-white/10 hover:text-white">
                  <ArrowLeft className="h-4 w-4" /> Volver
                </button>
                <button type="submit" disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 py-3 text-sm font-black text-white shadow-lg shadow-orange-900/40 transition hover:from-orange-600 hover:to-red-700 active:scale-[0.98] disabled:opacity-50">
                  {loading ? <Spinner /> : "Crear mi cuenta"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .input-dark { width:100%; background:transparent; color:white; font-size:0.875rem; outline:none; }
        .input-dark::placeholder { color:#6b7280; }
      `}</style>
    </div>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-xs font-semibold text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  )
}

function Field({ icon, label, extra, children }: {
  icon: React.ReactNode; label: string; extra?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-gray-400">{label}</label>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition focus-within:border-orange-500/50">
        <span className="shrink-0 text-gray-500">{icon}</span>
        <div className="flex-1">{children}</div>
        {extra && <span className="shrink-0">{extra}</span>}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <span className="flex items-center justify-center gap-2">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      Creando cuenta…
    </span>
  )
}
