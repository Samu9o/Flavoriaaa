type TipoEvento = "taller" | "feria" | "charla"
type Rol = "foodie" | "pro_curious" | "chef"

type Evento = {
  id: number
  nombre: string
  tipo: TipoEvento
  fecha: string
  ubicacion: string
  cupos: number
  cuposRestantes: number
  cancelado: boolean
  creadoPor: string
}

// Funciones que replican lógica

function puedeCrearEvento(sesion: boolean, rol: Rol): boolean {
  return sesion && (rol === "pro_curious" || rol === "chef")
}

function crearEvento(
  sesion: boolean,
  rol: Rol,
  nombre: string,
  tipo: TipoEvento,
  fecha: string,
  ubicacion: string,
  cupos: string
): { ok: boolean; error?: string; evento?: Evento } {
  if (!puedeCrearEvento(sesion, rol))
    return { ok: false, error: "No tienes permiso para crear eventos" }
  if (!nombre.trim()) return { ok: false, error: "El nombre es obligatorio" }
  if (!fecha) return { ok: false, error: "La fecha es obligatoria" }
  if (!ubicacion.trim()) return { ok: false, error: "La ubicación es obligatoria" }
  if (!cupos || Number(cupos) <= 0) return { ok: false, error: "Los cupos son obligatorios" }
  return {
    ok: true,
    evento: {
      id: 1,
      nombre,
      tipo,
      fecha,
      ubicacion,
      cupos: Number(cupos),
      cuposRestantes: Number(cupos),
      cancelado: false,
      creadoPor: "Tú",
    },
  }
}

function inscribirse(
  sesion: boolean,
  evento: Evento
): { ok: boolean; error?: string; cuposRestantes?: number } {
  if (!sesion) return { ok: false, error: "Debes iniciar sesión para inscribirte" }
  if (evento.cancelado) return { ok: false, error: "El evento está cancelado" }
  if (evento.cuposRestantes === 0) return { ok: false, error: "Evento lleno" }
  return { ok: true, cuposRestantes: evento.cuposRestantes - 1 }
}

function cancelarEvento(
  sesion: boolean,
  evento: Evento,
  usuarioActual: string
): { ok: boolean; error?: string } {
  if (!sesion) return { ok: false, error: "Debes iniciar sesión" }
  if (evento.creadoPor !== usuarioActual) return { ok: false, error: "Solo el creador puede cancelar" }
  return { ok: true }
}

function ordenarPorFecha(eventos: Evento[]): Evento[] {
  return [...eventos].sort((a, b) => a.fecha.localeCompare(b.fecha))
}

// PRUEBAS

// CA1 - Roles
test("CA1 - foodie no puede crear eventos", () => {
  expect(puedeCrearEvento(true, "foodie")).toBe(false)
})

test("CA1 - pro_curious puede crear eventos", () => {
  expect(puedeCrearEvento(true, "pro_curious")).toBe(true)
})

test("CA1 - chef puede crear eventos", () => {
  expect(puedeCrearEvento(true, "chef")).toBe(true)
})

test("CA1 - sin sesión no puede crear aunque sea chef", () => {
  expect(puedeCrearEvento(false, "chef")).toBe(false)
})

// CA2 - Campos obligatorios
test("CA2 - no puede crear evento sin nombre", () => {
  const result = crearEvento(true, "chef", "", "taller", "2025-08-01", "Bogotá", "10")
  expect(result.ok).toBe(false)
  expect(result.error).toBe("El nombre es obligatorio")
})

test("CA2 - no puede crear evento sin fecha", () => {
  const result = crearEvento(true, "chef", "Taller", "taller", "", "Bogotá", "10")
  expect(result.ok).toBe(false)
  expect(result.error).toBe("La fecha es obligatoria")
})

test("CA2 - no puede crear evento sin ubicación", () => {
  const result = crearEvento(true, "chef", "Taller", "taller", "2025-08-01", "", "10")
  expect(result.ok).toBe(false)
  expect(result.error).toBe("La ubicación es obligatoria")
})

test("CA2 - no puede crear evento sin cupos", () => {
  const result = crearEvento(true, "chef", "Taller", "taller", "2025-08-01", "Bogotá", "")
  expect(result.ok).toBe(false)
  expect(result.error).toBe("Los cupos son obligatorios")
})

test("CA2 - crea evento correctamente con todos los campos", () => {
  const result = crearEvento(true, "chef", "Taller de pasta", "taller", "2025-08-01", "Bogotá", "10")
  expect(result.ok).toBe(true)
  expect(result.evento?.nombre).toBe("Taller de pasta")
  expect(result.evento?.cuposRestantes).toBe(10)
})

// CA3 - Ordenar por fecha
test("CA3 - eventos se ordenan correctamente por fecha", () => {
  const eventos: Evento[] = [
    { id: 1, nombre: "B", tipo: "feria",  fecha: "2025-09-01", ubicacion: "Medellín", cupos: 20, cuposRestantes: 20, cancelado: false, creadoPor: "Tú" },
    { id: 2, nombre: "A", tipo: "taller", fecha: "2025-07-01", ubicacion: "Bogotá",   cupos: 10, cuposRestantes: 10, cancelado: false, creadoPor: "Tú" },
    { id: 3, nombre: "C", tipo: "charla", fecha: "2025-11-01", ubicacion: "Cali",     cupos: 30, cuposRestantes: 30, cancelado: false, creadoPor: "Tú" },
  ]
  const ordenados = ordenarPorFecha(eventos)
  expect(ordenados[0].nombre).toBe("A")
  expect(ordenados[1].nombre).toBe("B")
  expect(ordenados[2].nombre).toBe("C")
})

// CA4 - Inscripción
test("CA4 - sin sesión no puede inscribirse", () => {
  const evento: Evento = { id: 1, nombre: "Taller", tipo: "taller", fecha: "2025-08-01", ubicacion: "Bogotá", cupos: 10, cuposRestantes: 5, cancelado: false, creadoPor: "chef_ana" }
  const result = inscribirse(false, evento)
  expect(result.ok).toBe(false)
  expect(result.error).toBe("Debes iniciar sesión para inscribirte")
})

test("CA4 - usuario autenticado puede inscribirse si hay cupos", () => {
  const evento: Evento = { id: 1, nombre: "Taller", tipo: "taller", fecha: "2025-08-01", ubicacion: "Bogotá", cupos: 10, cuposRestantes: 5, cancelado: false, creadoPor: "chef_ana" }
  const result = inscribirse(true, evento)
  expect(result.ok).toBe(true)
  expect(result.cuposRestantes).toBe(4)
})

// CA5 - Evento lleno
test("CA5 - no puede inscribirse si no hay cupos", () => {
  const evento: Evento = { id: 1, nombre: "Taller", tipo: "taller", fecha: "2025-08-01", ubicacion: "Bogotá", cupos: 10, cuposRestantes: 0, cancelado: false, creadoPor: "chef_ana" }
  const result = inscribirse(true, evento)
  expect(result.ok).toBe(false)
  expect(result.error).toBe("Evento lleno")
})

// CA6 - Cancelar
test("CA6 - solo el creador puede cancelar el evento", () => {
  const evento: Evento = { id: 1, nombre: "Taller", tipo: "taller", fecha: "2025-08-01", ubicacion: "Bogotá", cupos: 10, cuposRestantes: 5, cancelado: false, creadoPor: "Tú" }
  const result = cancelarEvento(true, evento, "otro_usuario")
  expect(result.ok).toBe(false)
  expect(result.error).toBe("Solo el creador puede cancelar")
})

test("CA6 - el creador puede cancelar su evento", () => {
  const evento: Evento = { id: 1, nombre: "Taller", tipo: "taller", fecha: "2025-08-01", ubicacion: "Bogotá", cupos: 10, cuposRestantes: 5, cancelado: false, creadoPor: "Tú" }
  const result = cancelarEvento(true, evento, "Tú")
  expect(result.ok).toBe(true)
})

// CA7 - Evento cancelado
test("CA7 - no puede inscribirse en evento cancelado", () => {
  const evento: Evento = { id: 1, nombre: "Taller", tipo: "taller", fecha: "2025-08-01", ubicacion: "Bogotá", cupos: 10, cuposRestantes: 5, cancelado: true, creadoPor: "chef_ana" }
  const result = inscribirse(true, evento)
  expect(result.ok).toBe(false)
  expect(result.error).toBe("El evento está cancelado")
})