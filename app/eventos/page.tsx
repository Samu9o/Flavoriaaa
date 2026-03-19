"use client"
import { useEffect, useMemo, useState } from "react"
import { useUser } from "@/lib/userContext"
import { Calendar, MapPin, Users, Plus, Pencil, X } from "lucide-react"

type TipoEvento = "taller" | "feria" | "charla"

type Evento = {
  id: string
  nombre: string
  tipo: TipoEvento
  fecha: string
  ubicacion: string
  cupos: number
  cancelado: boolean
  creadoPor: string
  creadoPorId: string
  inscritos: string[]
}

const EVENTOS_STORAGE_KEY = "flavoria-eventos-v1"

const tipoColor: Record<TipoEvento, string> = {
  taller: "bg-orange-100 text-orange-600",
  feria:  "bg-blue-100 text-blue-600",
  charla: "bg-green-100 text-green-600",
}

const eventosIniciales: Evento[] = [
  {
    id: "evt-1",
    nombre: "Taller de pasta fresca",
    tipo: "taller",
    fecha: "2025-08-15",
    ubicacion: "Bogotá, Centro Gourmet",
    cupos: 10,
    cancelado: false,
    creadoPor: "Ana Martínez",
    creadoPorId: "ana-martinez",
    inscritos: ["carlos-ruiz", "andres-perez", "laura-mendez"],
  },
  {
    id: "evt-2",
    nombre: "Feria de especias",
    tipo: "feria",
    fecha: "2025-09-01",
    ubicacion: "Medellín, Plaza Mayor",
    cupos: 50,
    cancelado: false,
    creadoPor: "María González",
    creadoPorId: "maria-gonzalez",
    inscritos: Array.from({ length: 50 }, (_, index) => `seed-${index + 1}`),
  },
]

export default function EventosPage() {
  const { sesion, rol, currentUser } = useUser()
  const [eventos, setEventos] = useState<Evento[]>(eventosIniciales)
  const [isHydrated, setIsHydrated] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Evento | null>(null)

  const [form, setForm] = useState({
    nombre: "",
    tipo: "taller" as TipoEvento,
    fecha: "",
    ubicacion: "",
    cupos: "",
  })

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  const puedeCrear = sesion && (rol === "pro_curious" || rol === "chef")

  useEffect(() => {
    try {
      const saved = localStorage.getItem(EVENTOS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Evento[]
        if (Array.isArray(parsed)) {
          setEventos(parsed)
        }
      }
    } catch {
      setEventos(eventosIniciales)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(EVENTOS_STORAGE_KEY, JSON.stringify(eventos))
  }, [eventos, isHydrated])

  const handleGuardar = () => {
    if (!form.nombre.trim() || !form.fecha || !form.ubicacion.trim() || !form.cupos) return
    if (!currentUser) return

    if (editando) {
      setEventos((prev) =>
        prev.map((e) =>
          e.id === editando.id
            ? {
                ...e,
                nombre: form.nombre,
                tipo: form.tipo,
                fecha: form.fecha,
                ubicacion: form.ubicacion,
                cupos: Math.max(Number(form.cupos), e.inscritos.length),
              }
            : e
        )
      )
    } else {
      const nuevo: Evento = {
        id: `evt-${Date.now()}`,
        nombre: form.nombre,
        tipo: form.tipo,
        fecha: form.fecha,
        ubicacion: form.ubicacion,
        cupos: Number(form.cupos),
        cancelado: false,
        creadoPor: currentUser.name,
        creadoPorId: currentUser.id,
        inscritos: [],
      }
      setEventos((prev) => [...prev, nuevo].sort((a, b) => a.fecha.localeCompare(b.fecha)))
    }

    setForm({ nombre: "", tipo: "taller", fecha: "", ubicacion: "", cupos: "" })
    setShowForm(false)
    setEditando(null)
  }

  const handleEditar = (evento: Evento) => {
    setEditando(evento)
    setForm({
      nombre: evento.nombre,
      tipo: evento.tipo,
      fecha: evento.fecha,
      ubicacion: evento.ubicacion,
      cupos: String(evento.cupos),
    })
    setShowForm(true)
  }

  const handleCancelar = (id: string) => {
    setEventos((prev) =>
      prev.map((e) => (e.id === id ? { ...e, cancelado: true } : e))
    )
  }

  const handleInscribirse = (id: string) => {
    if (!sesion) return alert("Debes iniciar sesión para inscribirte")
    if (!currentUser) return

    setEventos((prev) =>
      prev.map((e) =>
        e.id === id && !e.cancelado && e.inscritos.length < e.cupos && !e.inscritos.includes(currentUser.id)
          ? { ...e, inscritos: [...e.inscritos, currentUser.id] }
          : e
      )
    )
  }

  const eventosFiltrados = useMemo(
    () => [...eventos].sort((a, b) => a.fecha.localeCompare(b.fecha)),
    [eventos],
  )

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Eventos Gastronómicos</h1>
            <p className="text-gray-500 text-sm mt-0.5">Talleres, ferias y charlas de la comunidad</p>
          </div>
          {puedeCrear && (
            <button
              onClick={() => { setEditando(null); setShowForm(true) }}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" />
              Crear Evento
            </button>
          )}
        </div>

        {/* FORMULARIO */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-2 border-orange-200">
            <h2 className="font-bold text-lg mb-4">{editando ? "Editar Evento" : "Nuevo Evento"}</h2>

            <input
              type="text"
              placeholder="Nombre del evento *"
              value={form.nombre}
              onChange={(e) => update("nombre", e.target.value)}
              className="input-field mb-3"
            />

            <select
              value={form.tipo}
              onChange={(e) => update("tipo", e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm w-full mb-3"
            >
              <option value="taller">Taller</option>
              <option value="feria">Feria</option>
              <option value="charla">Charla</option>
            </select>

            <input
              type="date"
              value={form.fecha}
              onChange={(e) => update("fecha", e.target.value)}
              className="input-field mb-3"
            />

            <input
              type="text"
              placeholder="Ubicación *"
              value={form.ubicacion}
              onChange={(e) => update("ubicacion", e.target.value)}
              className="input-field mb-3"
            />

            <input
              type="number"
              placeholder="Cupos disponibles *"
              value={form.cupos}
              onChange={(e) => update("cupos", e.target.value)}
              className="input-field mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={handleGuardar}
                className="bg-orange-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition"
              >
                {editando ? "Guardar cambios" : "Publicar"}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditando(null) }}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* LISTA DE EVENTOS */}
        <div className="space-y-4">
          {eventosFiltrados.map((evento) => {
            const cuposRestantes = Math.max(evento.cupos - evento.inscritos.length, 0)
            const yaInscrito = currentUser ? evento.inscritos.includes(currentUser.id) : false
            const puedeInscribirse = sesion && !evento.cancelado && cuposRestantes > 0 && !yaInscrito

            return (
              <div
                key={evento.id}
                className={`bg-white rounded-2xl p-5 shadow-sm ${evento.cancelado ? "opacity-60" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Nombre + badges */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-gray-900">{evento.nombre}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${tipoColor[evento.tipo]}`}>
                        {evento.tipo}
                      </span>
                      {evento.cancelado && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                          Cancelado
                        </span>
                      )}
                    </div>

                    {/* Detalles */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {evento.fecha}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {evento.ubicacion}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {cuposRestantes === 0 ? "Evento lleno" : `${cuposRestantes} cupos`}
                      </span>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex flex-col gap-2 ml-4">
                    {!evento.cancelado && (
                      <>
                        <button
                          onClick={() => handleInscribirse(evento.id)}
                          disabled={!puedeInscribirse}
                          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition ${
                            !puedeInscribirse
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-orange-500 text-white hover:bg-orange-600"
                          }`}
                        >
                          {!sesion
                            ? "Inicia sesión"
                            : yaInscrito
                              ? "Ya inscrito"
                              : cuposRestantes === 0
                                ? "Evento lleno"
                                : "Inscribirse"}
                        </button>

                        {sesion && currentUser && evento.creadoPorId === currentUser.id && (
                          <>
                            <button
                              onClick={() => handleEditar(evento)}
                              className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500"
                            >
                              <Pencil className="w-3 h-3" /> Editar
                            </button>
                            <button
                              onClick={() => handleCancelar(evento.id)}
                              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
                            >
                              <X className="w-3 h-3" /> Cancelar
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}