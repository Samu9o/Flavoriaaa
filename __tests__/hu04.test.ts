type Post = {
  id: number
  title: string
  author: string
  content: string
  category: string
  likes: number
  replies: number
  comments: ForoComment[]
  nivel: string
}

type ForoComment = {
  author: string
  date: string
  text: string
  avatar: string
  nivel: string
}

//  Funciones que replican lógica

function crearHilo(
  sesion: boolean,
  title: string,
  content: string,
  category: string
): { ok: boolean; error?: string; post?: Post } {
  if (!sesion) return { ok: false, error: "Debes iniciar sesión para publicar" }
  if (!title.trim()) return { ok: false, error: "El título es obligatorio" }
  if (!content.trim()) return { ok: false, error: "El contenido es obligatorio" }
  if (!category.trim()) return { ok: false, error: "La categoría es obligatoria" }
  return {
    ok: true,
    post: { id: Date.now(), title, author: "Tú", content, category, likes: 0, replies: 0, comments: [], nivel: "basico" },
  }
}

function votar(
  sesion: boolean,
  likes: Record<number, number>,
  postId: number,
  likesBase: number
): { ok: boolean; error?: string; nuevoLikes?: number } {
  if (!sesion) return { ok: false, error: "Debes iniciar sesión para votar" }
  return { ok: true, nuevoLikes: (likes[postId] ?? likesBase) + 1 }
}

function comentar(
  sesion: boolean,
  text: string
): { ok: boolean; error?: string; comment?: ForoComment } {
  if (!sesion) return { ok: false, error: "Debes iniciar sesión para comentar" }
  if (!text.trim()) return { ok: false, error: "El comentario no puede estar vacío" }
  return {
    ok: true,
    comment: { author: "Tú", date: "Ahora", text, avatar: "https://i.pravatar.cc/150?img=5", nivel: "basico" },
  }
}

// PRUEBAS

// CA1 - Crear hilo
test("CA1 - no puede crear hilo sin sesión", () => {
  const result = crearHilo(false, "Título", "Contenido", "General")
  expect(result.ok).toBe(false)
  expect(result.error).toBe("Debes iniciar sesión para publicar")
})

test("CA1 - no puede crear hilo sin título", () => {
  const result = crearHilo(true, "", "Contenido", "General")
  expect(result.ok).toBe(false)
  expect(result.error).toBe("El título es obligatorio")
})

test("CA1 - no puede crear hilo sin contenido", () => {
  const result = crearHilo(true, "Título", "", "General")
  expect(result.ok).toBe(false)
  expect(result.error).toBe("El contenido es obligatorio")
})

test("CA1 - no puede crear hilo sin categoría", () => {
  const result = crearHilo(true, "Título", "Contenido", "")
  expect(result.ok).toBe(false)
  expect(result.error).toBe("La categoría es obligatoria")
})

test("CA1 - crea hilo correctamente con todos los campos", () => {
  const result = crearHilo(true, "Mi receta", "Así se hace", "Técnicas")
  expect(result.ok).toBe(true)
  expect(result.post?.title).toBe("Mi receta")
  expect(result.post?.category).toBe("Técnicas")
})

// CA3 - Estructura del hilo
test("CA3 - el hilo creado tiene título, autor, respuestas y votos", () => {
  const result = crearHilo(true, "Pasta", "Receta italiana", "Italiana")
  expect(result.post).toHaveProperty("title")
  expect(result.post).toHaveProperty("author")
  expect(result.post).toHaveProperty("replies")
  expect(result.post).toHaveProperty("likes")
})

// CA4 - Comentar
test("CA4 - no puede comentar sin sesión", () => {
  const result = comentar(false, "Muy buena receta")
  expect(result.ok).toBe(false)
  expect(result.error).toBe("Debes iniciar sesión para comentar")
})

test("CA4 - no puede comentar con texto vacío", () => {
  const result = comentar(true, "   ")
  expect(result.ok).toBe(false)
})

test("CA4 - comenta correctamente con sesión activa", () => {
  const result = comentar(true, "Muy buena receta")
  expect(result.ok).toBe(true)
  expect(result.comment?.text).toBe("Muy buena receta")
  expect(result.comment?.author).toBe("Tú")
})

// CA5 - Votar
test("CA5 - no puede votar sin sesión", () => {
  const result = votar(false, {}, 1, 5)
  expect(result.ok).toBe(false)
  expect(result.error).toBe("Debes iniciar sesión para votar")
})

test("CA5 - voto suma 1 al contador", () => {
  const result = votar(true, {}, 1, 5)
  expect(result.ok).toBe(true)
  expect(result.nuevoLikes).toBe(6)
})

test("CA5 - voto usa el valor local si ya existe", () => {
  const result = votar(true, { 1: 10 }, 1, 5)
  expect(result.nuevoLikes).toBe(11)
})

// CA6 - Usuario no autenticado
test("CA6 - sin sesión no puede crear hilo", () => {
  const result = crearHilo(false, "Título", "Contenido", "General")
  expect(result.ok).toBe(false)
})

test("CA6 - sin sesión no puede votar", () => {
  const result = votar(false, {}, 1, 0)
  expect(result.ok).toBe(false)
})

test("CA6 - sin sesión no puede comentar", () => {
  const result = comentar(false, "Hola")
  expect(result.ok).toBe(false)
})