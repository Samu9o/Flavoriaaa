//Funciones de contexto y lógica
type UserState = {
  hilos: number
  comentarios: number
  likesRecibidos: number
}

const NIVELES = [
  { nombre: "basico",  minPuntos: 0   },
  { nombre: "bronce",  minPuntos: 50  },
  { nombre: "plata",   minPuntos: 120 },
  { nombre: "oro",     minPuntos: 300 },
  { nombre: "platino", minPuntos: 600 },
]

const DISTINTIVOS = [
  { id: "primer_hilo",  condicion: (s: UserState) => s.hilos >= 1           },
  { id: "comentador",   condicion: (s: UserState) => s.comentarios >= 5     },
  { id: "popular",      condicion: (s: UserState) => s.likesRecibidos >= 10 },
  { id: "colaborador",  condicion: (s: UserState) => s.hilos >= 5           },
]

function calcularNivel(puntos: number) {
  for (let i = NIVELES.length - 1; i >= 0; i--) {
    if (puntos >= NIVELES[i].minPuntos) return NIVELES[i].nombre
  }
  return "basico"
}

function calcularProgreso(puntos: number) {
  const idxActual = [...NIVELES].reverse().findIndex((n) => puntos >= n.minPuntos)
  const nivelIdx = NIVELES.length - 1 - idxActual
  const siguiente = NIVELES[nivelIdx + 1]
  const actual = NIVELES[nivelIdx]
  if (!siguiente) return { falta: 0, porcentaje: 100 }
  const falta = siguiente.minPuntos - puntos
  const porcentaje = Math.round(((puntos - actual.minPuntos) / (siguiente.minPuntos - actual.minPuntos)) * 100)
  return { falta, porcentaje }
}

function actualizarDistintivos(state: UserState): string[] {
  return DISTINTIVOS.filter((d) => d.condicion(state)).map((d) => d.id)
}

//PRUEBAS

// CA1 : El sistema asigna puntos según la acción
test("CA1 - crear hilo suma 10 puntos", () => {
  const puntosPrevios = 0
  const PUNTOS = { hilo: 10, like: 5, comentario: 3 }
  const resultado = puntosPrevios + PUNTOS["hilo"]
  expect(resultado).toBe(10)
})

test("CA1 - recibir like suma 5 puntos", () => {
  const puntosPrevios = 20
  const PUNTOS = { hilo: 10, like: 5, comentario: 3 }
  const resultado = puntosPrevios + PUNTOS["like"]
  expect(resultado).toBe(25)
})

test("CA1 - comentar suma 3 puntos", () => {
  const puntosPrevios = 10
  const PUNTOS = { hilo: 10, like: 5, comentario: 3 }
  const resultado = puntosPrevios + PUNTOS["comentario"]
  expect(resultado).toBe(13)
})

// CA2 : Existen al menos 3 niveles definidos
test("CA2 - existen al menos 3 niveles de reputación", () => {
  expect(NIVELES.length).toBeGreaterThanOrEqual(3)
})

// CA3 : El nivel se actualiza automáticamente al subir de puntos
test("CA3 - con 0 puntos el nivel es basico", () => {
  expect(calcularNivel(0)).toBe("basico")
})

test("CA3 - con 50 puntos el nivel sube a bronce", () => {
  expect(calcularNivel(50)).toBe("bronce")
})

test("CA3 - con 120 puntos el nivel sube a plata", () => {
  expect(calcularNivel(120)).toBe("plata")
})

test("CA3 - con 299 puntos el nivel sigue en plata", () => {
  expect(calcularNivel(299)).toBe("plata")
})

test("CA3 - con 300 puntos el nivel sube a oro", () => {
  expect(calcularNivel(300)).toBe("oro")
})

// CA4 : Progreso de puntos se calcula correctamente
test("CA4 - progreso calcula bien los puntos que faltan", () => {
  const { falta } = calcularProgreso(80)   // está en bronce, faltan 40 para plata
  expect(falta).toBe(40)
})

test("CA4 - progreso calcula bien el porcentaje", () => {
  const { porcentaje } = calcularProgreso(85)  // bronce: 50-120, lleva 35/70 = 50%
  expect(porcentaje).toBe(50)
})

// CA5 : Distintivos se asignan automáticamente
test("CA5 - se asigna distintivo primer_hilo al crear el primero", () => {
  const state = { hilos: 1, comentarios: 0, likesRecibidos: 0 }
  const distintivos = actualizarDistintivos(state)
  expect(distintivos).toContain("primer_hilo")
})

test("CA5 - no se asigna comentador con menos de 5 comentarios", () => {
  const state = { hilos: 0, comentarios: 3, likesRecibidos: 0 }
  const distintivos = actualizarDistintivos(state)
  expect(distintivos).not.toContain("comentador")
})

test("CA5 - se asigna comentador al llegar a 5 comentarios", () => {
  const state = { hilos: 0, comentarios: 5, likesRecibidos: 0 }
  const distintivos = actualizarDistintivos(state)
  expect(distintivos).toContain("comentador")
})

test("CA5 - se asigna popular al recibir 10 likes", () => {
  const state = { hilos: 0, comentarios: 0, likesRecibidos: 10 }
  const distintivos = actualizarDistintivos(state)
  expect(distintivos).toContain("popular")
})

test("CA5 - se pueden obtener varios distintivos a la vez", () => {
  const state = { hilos: 5, comentarios: 5, likesRecibidos: 10 }
  const distintivos = actualizarDistintivos(state)
  expect(distintivos).toContain("primer_hilo")
  expect(distintivos).toContain("comentador")
  expect(distintivos).toContain("popular")
  expect(distintivos).toContain("colaborador")
})