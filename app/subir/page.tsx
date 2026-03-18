"use client"
import { useState } from "react"
import { Plus, Trash2, UploadCloud } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SubirPage() {
  const router = useRouter()
  //Para guardar datos de la receta
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "Italiana",
    difficulty: "Media",
    time: "30",
    servings: "4",
  })
  const [ingredients, setIngredients] = useState([""]) //ingredientes
  const [steps, setSteps] = useState([""]) //pasos de la receta
  const [submitted, setSubmitted] = useState(false) //estado del formulario (si se subió o no)

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value })) //para actualizar un campo del formulario sin borrar lo demás

  //marca como enviado, espera 1.5 segundos y devuelve al inciio
  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => router.push("/"), 1500)
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">¡Receta publicada!</h2>
          <p className="text-gray-500 mt-1">Redirigiendo al inicio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Subir Nueva Receta</h1>
      <p className="text-gray-500 mb-8">Comparte tu receta favorita con la comunidad</p>

{/* Formulario estructura */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título de la Receta <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej: Pasta Carbonara Clásica" //Ejemplo
            value={form.title} //muestra valor
            onChange={(e) => update("title", e.target.value)} //lo actualiza
            className="input-field"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Describe tu receta..."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className="input-field resize-none"
          />
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de la Imagen <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={form.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
            className="input-field"
          />
        </div>

        {/* Categorpia y dificultad */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="input-field"
            >
              {["Italiana", "Mexicana", "Asiática", "Postres", "Ensaladas", "Saludable", "Vegetariana", "Sopas"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dificultad <span className="text-red-500">*</span>
            </label>
            <select
              value={form.difficulty}
              onChange={(e) => update("difficulty", e.target.value)}
              className="input-field"
            >
              {["Fácil", "Media", "Difícil"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tiempo y porciones */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo (minutos) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Porciones <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.servings}
              onChange={(e) => update("servings", e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Ingredientes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingredientes <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Ingrediente ${i + 1}`}
                  value={ing}
                  onChange={(e) => {
                    const updated = [...ingredients] //Cambiar solo 1 ingrediente
                    updated[i] = e.target.value
                    setIngredients(updated)
                  }}
                  className="input-field"
                />
                {ingredients.length > 1 && (
                  <button
                    onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} //borrar ingrediente
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => setIngredients([...ingredients, ""])} //añadir un nuevo ingrediente
            className="flex items-center gap-2 text-orange-500 text-sm font-medium mt-2 hover:text-orange-600"
          >
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-orange-100">
              <Plus className="w-3 h-3 text-orange-500" />
            </span>
            Agregar ingrediente
          </button>
        </div>

        {/* Instrucciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instrucciones <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="w-7 h-7 rounded-full bg-orange-100 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-2">
                  {i + 1}
                </span>
                <div className="flex-1 flex gap-2">
                  <textarea
                    placeholder={`Paso ${i + 1}`}
                    value={step}
                    onChange={(e) => {
                      const updated = [...steps]
                      updated[i] = e.target.value
                      setSteps(updated)
                    }}
                    rows={2}
                    className="input-field resize-none flex-1"
                  />
                  {steps.length > 1 && (
                    <button
                      onClick={() => setSteps(steps.filter((_, idx) => idx !== i))}
                      className="text-gray-400 hover:text-red-500 transition-colors mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSteps([...steps, ""])}
            className="flex items-center gap-2 text-orange-500 text-sm font-medium mt-2 hover:text-orange-600"
          >
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-orange-100">
              <Plus className="w-3 h-3 text-orange-500" />
            </span>
            Agregar paso
          </button>
        </div>

        {/* Botones al final */}
        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} className="flex-1 bg-orange-500 text-white rounded-xl py-2.5 font-medium hover:bg-orange-600 transition">
            Publicar Receta
          </button>
          <button onClick={() => router.push("/")} className="rounded-xl border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition">
            Cancelar
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}
