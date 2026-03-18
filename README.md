# Flavoria Market - comunidad, marketplace, idiomas e IA nutricional

Proyecto construido con **Next.js + React + TypeScript**. Incluye comunidad gastronómica, marketplace entre cuentas, mapa de tendencias de Bogotá y una sección de IA para generar planes nutricionales con la API de OpenAI.

## Funcionalidades incluidas

### HU01
Como administrador, quiero asignar roles de **Moderador** y **Soporte**, para descentralizar la gestión de la comunidad.

### HU02
Como usuario, quiero registrarme y gestionar mi perfil con **etiquetas de especialidad**, para que la comunidad identifique mi nivel de experticia.

### HU03
Como usuario, quiero seguir a otros cocineros y ver sus actualizaciones en un **feed personalizado**.

### HU07
Como usuario restaurante, quiero crear restaurantes y publicar productos en su menú.

### HU08
Como usuario consumidor, quiero comprar productos publicados por otras cuentas restaurante.

### HU09
Como usuario, quiero ver tendencias con un mapa de Bogotá y el ranking de restaurantes más vendidos.

### HU10
Como usuario, quiero cambiar el idioma de la interfaz entre **español, inglés y francés** desde la barra superior.

**Incluye:**
- selector de idioma persistente en `localStorage`
- navegación principal traducida
- página principal traducida
- tendencias traducidas
- nueva sección de IA traducida

### HU11
Como usuario, quiero generar un **plan nutricional especializado** con OpenAI usando altura, peso y objetivos alimentarios.

**Incluye:**
- nueva página `/ia`
- formulario con altura, peso, edad opcional, actividad, preferencias y restricciones
- validación para evitar objetivos extremos o riesgosos
- llamada server-side a `/api/nutrition-plan`
- integración con la API de OpenAI mediante `OPENAI_API_KEY`

## Cuentas demo

Puedes cambiar entre cuentas desde la barra superior:
- **Admin Flavoria** → administrador
- **María González** → restaurante
- **Ana Martínez** → restaurante
- **Laura Méndez** → restaurante
- **Carlos Ruiz** → consumidor
- **Andrés Pérez** → consumidor

## Cómo ejecutar el proyecto

### 1. Instala Node.js
Se recomienda **Node.js 20 o superior**.

### 2. Entra a la carpeta del proyecto
```bash
cd ProyectoCiclo1-Grupo4_marketplace_entrega
```

### 3. Instala dependencias
```bash
npm install
```

### 4. Ejecuta el servidor
```bash
npm run dev
```

### 5. Abre la aplicación
```text
http://localhost:3000
```

## Cómo activar la sección de IA

Crea la variable de entorno `OPENAI_API_KEY`.

### Opción A: archivo `.env.local`
Crea un archivo `.env.local` en la raíz del proyecto con este contenido:

```bash
OPENAI_API_KEY=tu_clave_aqui
```

### Opción B: PowerShell en Windows
```powershell
setx OPENAI_API_KEY "tu_clave_aqui"
```

Luego cierra y abre de nuevo la terminal, y reinicia el servidor:

```bash
npm run dev
```

## Flujo de prueba sugerido

### Marketplace
- entra con una cuenta restaurante
- ve a `/perfil`
- crea un restaurante y publica productos
- cambia a una cuenta consumidor
- compra productos desde `/`

### Tendencias
- ve a `/tendencias`
- revisa el mapa y el ranking lateral

### Idiomas
- usa el selector de idioma de la barra superior
- cambia entre `Español`, `English` y `Français`

### IA nutricional
- ve a `/ia`
- completa altura, peso y objetivo alimentario
- genera el plan nutricional
- si falta la API key, la página mostrará el mensaje de configuración

## Pruebas

```bash
npm test -- --runInBand
```

## Validación de tipos

```bash
npm run typecheck
```

## Estructura relevante

- `lib/communityLogic.ts` → comunidad, roles, perfil y seguimiento
- `lib/marketplaceLogic.ts` → marketplace, restaurantes, menú y compras
- `lib/userContext.tsx` → estado global y persistencia
- `lib/i18n.tsx` → selector de idioma y traducciones
- `lib/nutritionPlanner.ts` → validación y prompt del plan nutricional
- `app/page.tsx` → marketplace traducido
- `app/tendencias/page.tsx` → mapa de Bogotá traducido
- `app/ia/page.tsx` → sección de IA nutricional
- `app/api/nutrition-plan/route.ts` → llamada server-side a OpenAI
