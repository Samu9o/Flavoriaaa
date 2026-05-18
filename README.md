# Flavoria Market - comunidad, marketplace, idiomas e IA nutricional

Proyecto construido con **Next.js + React + TypeScript**. Incluye comunidad gastronómica, marketplace entre cuentas, mapa de tendencias de Bogotá y una sección de IA para generar planes nutricionales con la API de OpenAI.

## Funcionalidades incluidas

### HU01
Como administrador, quiero asignar roles de **Moderador** y **Soporte**, para descentralizar la gestión de la comunidad.

### HU02
Como usuario, quiero registrarme y gestionar mi perfil con **etiquetas de especialidad**, para que la comunidad identifique mi nivel de experticia.

### HU03
Como usuario, quiero seguir a otros cocineros y ver sus actualizaciones en un **feed personalizado**.


### HU04
Como usuario, quiero crear y participar en hilos de discusión gastronómica con  publicaciones, votaciones y etiquetas, para intercambiar conocimiento entre la comunidad.

### HU05
Como usuario (Pro Curious o Chef), quiero publicar y gestionar eventos gastronómicos (talleres, ferias o charlas) y permitir que otros usuarios se inscriban a ellos, para conectar la comunidad.

### HU06
Como usuario, quiero obtener distintivos y niveles de reputación según mi participación, para reconocer la calidad de mis aportes dentro de la comunidad.

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
- modo demo automático (mockup) si la API key no está configurada
- modo demo forzado con `USE_AI_MOCK=true`

## Cuentas demo

Puedes cambiar entre cuentas desde la barra superior:
- **Admin Flavoria** → administrador
- **María González** → restaurante
- **Ana Martínez** → restaurante
- **Laura Méndez** → restaurante
- **Carlos Ruiz** → consumidor
- **Andrés Pérez** → consumidor

## Paso a paso para ejecutar el proyecto (local)

1. Instala Node.js (recomendado: **Node.js 20 o superior**).

2. Abre una terminal en la carpeta del proyecto.

3. Instala dependencias:
```bash
npm install
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre la aplicación en tu navegador:
```text
http://localhost:3000
```

6. (Opcional) Verifica calidad del proyecto:
```bash
npm run typecheck
npm test -- --runInBand
```

## Cómo activar la sección de IA

Crea la variable de entorno `OPENAI_API_KEY`.

Si no quieres usar la API key por ahora, puedes forzar el mockup con `USE_AI_MOCK=true`.

### Opción A: archivo `.env.local`
Crea un archivo `.env.local` en la raíz del proyecto con este contenido:

```bash
OPENAI_API_KEY=tu_clave_aqui
USE_AI_MOCK=true
```

### Opción B: PowerShell en Windows
```powershell
setx OPENAI_API_KEY "tu_clave_aqui"
setx USE_AI_MOCK "true"
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

## Evidencia de cumplimiento (3*N, i18n, a11y, IA)

- Prototipos navegables: existen 9 rutas de página navegables (`app/*/page.tsx`) y se valida automáticamente el criterio `3*N` con `N=3` en `__tests__/compliance.test.ts`.
- i18n: soporte en `es`, `en`, `fr` con selector persistente y pruebas de traducción (`__tests__/hu10.test.ts` y `__tests__/compliance.test.ts`).
- a11y: se agregó validación automática con `jest-axe` en `__tests__/a11y.test.tsx` para navegación, IA y tendencias.
- IA: se valida existencia de vista y backend (`app/ia/page.tsx` y `app/api/nutrition-plan/route.ts`) en `__tests__/compliance.test.ts`.

## Validación de tipos

```bash
npm run typecheck
```

## Despliegue con Docker (paso a paso)

### Opción 1: Docker (build + run)

1. Verifica que Docker Desktop esté encendido.

2. Construye la imagen:

```bash
docker build -t flavoria-app:latest .
```

3. Ejecuta el contenedor en modo demo IA (sin API key):

```bash
docker run -d --name flavoria-app -p 3000:3000 -e USE_AI_MOCK=true flavoria-app:latest
```

4. Abre la aplicación:

```text
http://localhost:3000
```

5. Revisa logs si necesitas diagnosticar:

```bash
docker logs -f flavoria-app
```

6. Detén y elimina el contenedor cuando termines:

```bash
docker stop flavoria-app && docker rm flavoria-app
```

### Opción 2: Docker Compose

1. Levanta el servicio:

```bash
docker compose up -d --build
```

2. Verifica logs:

```bash
docker compose logs -f
```

3. Apaga el servicio:

```bash
docker compose down
```

### Variables de entorno en Docker

- `USE_AI_MOCK=true`: fuerza modo mockup para IA.
- `OPENAI_API_KEY`: opcional si luego quieres usar OpenAI real.

Ejemplo para usar API real (desactivar mock):

```bash
docker run -d --name flavoria-app -p 3000:3000 -e USE_AI_MOCK=false -e OPENAI_API_KEY=tu_clave flavoria-app:latest
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
