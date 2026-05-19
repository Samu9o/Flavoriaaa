"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authApi, type AuthResponse } from "@/lib/api"

type AuthUser = AuthResponse["usuario"]

export type ProfileExt = {
  bio: string
  expertiseRole: string
  specialtyTags: string[]
}

const TOKEN_KEY = "flavoria_token"
const extKey = (id: string) => `flavoria_profile_ext_${id}`

type AuthContextType = {
  user: AuthUser | null
  token: string | null
  loading: boolean
  profileExt: ProfileExt | null
  login: (email: string, password: string) => Promise<void>
  register: (nombre: string, email: string, password: string, rol?: string) => Promise<void>
  logout: () => void
  updateProfile: (data: {
    nombre?: string
    email?: string
    password?: string
    bio?: string
    expertiseRole?: string
    specialtyTags?: string[]
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const defaultExt = (): ProfileExt => ({ bio: "", expertiseRole: "foodie", specialtyTags: [] })

function loadExt(userId: string): ProfileExt {
  try {
    const raw = localStorage.getItem(extKey(userId))
    return raw ? JSON.parse(raw) : defaultExt()
  } catch {
    return defaultExt()
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileExt, setProfileExt] = useState<ProfileExt | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY)
    if (!saved) { setLoading(false); return }
    setToken(saved)
    authApi.me()
      .then((u) => {
        setUser(u)
        setProfileExt(loadExt(u.id))
      })
      .catch(() => { localStorage.removeItem(TOKEN_KEY); setToken(null) })
      .finally(() => setLoading(false))
  }, [])

  const dispatch = (active: boolean) =>
    window.dispatchEvent(new CustomEvent("flavoria:auth", { detail: { active } }))

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    localStorage.setItem(TOKEN_KEY, res.token)
    setToken(res.token)
    setUser(res.usuario)
    setProfileExt(loadExt(res.usuario.id))
    dispatch(true)
  }

  const register = async (nombre: string, email: string, password: string, rol?: string) => {
    const res = await authApi.register(nombre, email, password, rol)
    localStorage.setItem(TOKEN_KEY, res.token)
    setToken(res.token)
    setUser(res.usuario)
    const ext = defaultExt()
    localStorage.setItem(extKey(res.usuario.id), JSON.stringify(ext))
    setProfileExt(ext)
    dispatch(true)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setProfileExt(null)
    dispatch(false)
  }

  const updateProfile = async (data: {
    nombre?: string
    email?: string
    password?: string
    bio?: string
    expertiseRole?: string
    specialtyTags?: string[]
  }) => {
    if (!user) return
    const { bio, expertiseRole, specialtyTags, ...coreData } = data

    // Sync core fields with backend (nombre/email always sent; password only if provided)
    const payload: { nombre?: string; email?: string; password?: string } = {}
    if (coreData.nombre) payload.nombre = coreData.nombre
    if (coreData.email)  payload.email  = coreData.email
    if (coreData.password) payload.password = coreData.password

    if (Object.keys(payload).length > 0) {
      const res = await authApi.updateProfile(payload)
      localStorage.setItem(TOKEN_KEY, res.token)
      setToken(res.token)
      setUser(res.usuario)
    }

    // Persist extended fields locally per user
    const ext: ProfileExt = {
      bio:           bio           ?? profileExt?.bio           ?? "",
      expertiseRole: expertiseRole ?? profileExt?.expertiseRole ?? "foodie",
      specialtyTags: specialtyTags ?? profileExt?.specialtyTags ?? [],
    }
    localStorage.setItem(extKey(user.id), JSON.stringify(ext))
    setProfileExt(ext)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, profileExt, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
