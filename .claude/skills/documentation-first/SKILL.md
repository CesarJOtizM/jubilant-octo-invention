---
name: documentation-first
description: |
  Consultar documentación antes de implementar. Usa este skill cuando necesites
  implementar algo con Next.js, React, Tailwind, Framer Motion o next-intl.
  SIEMPRE consulta docs antes de adivinar o usar conocimiento desactualizado.
---

# Documentation-First Development

**Regla de oro:** Consultar documentación actualizada ANTES de implementar.

## Fuentes de Documentación

### 1. Context7 (Preferido - Docs actualizadas)

```
# Resolver ID de librería
mcp__context7__resolve-library-id: { libraryName: "nextjs" }

# Obtener docs de un tema específico
mcp__context7__get-library-docs: { 
  libraryId: "/vercel/next.js",
  topic: "app router metadata"
}
```

**Librerías disponibles en context7:**
- `nextjs` → Next.js App Router, Server Components, Metadata, etc.
- `react` → React 19, hooks, patterns
- `tailwindcss` → Tailwind CSS 4, utilities, config
- `framer-motion` → Animaciones, variants, gestures
- `typescript` → Tipos, generics, utility types

### 2. Web Search (Backup)

Si context7 no tiene la info:
```
Buscar en web: "[librería] [tema] site:docs.ejemplo.com"
```

### 3. Documentación Local

- `.claude/skills/` → Patrones específicos del proyecto
- Componentes existentes → Referencia de implementación

## Cuándo Consultar Docs

### SIEMPRE consultar antes de:

| Tarea | Consultar |
|-------|-----------|
| Crear página con metadata | `nextjs` → metadata, generateMetadata |
| Server vs Client component | `nextjs` → server components, use client |
| Data fetching | `nextjs` → fetch, cache, revalidate |
| Routing dinámico | `nextjs` → dynamic routes, params |
| Imágenes optimizadas | `nextjs` → next/image |
| Internacionalización | `next-intl` → useTranslations, routing |
| Animaciones entrada | `framer-motion` → whileInView, variants |
| Gestos/drag | `framer-motion` → drag, gestures |
| Clases responsive | `tailwindcss` → responsive design |
| Dark mode | `tailwindcss` → dark mode |
| Hooks de React 19 | `react` → use, hooks |

### NO adivinar si:

- No estás 100% seguro de la API actual
- Es una feature nueva del framework
- El comportamiento cambió en versiones recientes
- Hay múltiples formas de hacer algo

## Ejemplo de Flujo

**Tarea:** Agregar metadata dinámica a una página

**1. Consultar docs:**
```
mcp__context7__resolve-library-id: { libraryName: "nextjs" }
→ /vercel/next.js

mcp__context7__get-library-docs: {
  libraryId: "/vercel/next.js",
  topic: "generateMetadata dynamic"
}
```

**2. Leer respuesta y entender:**
- Sintaxis actual
- Parámetros disponibles
- Ejemplos de uso

**3. Implementar basado en docs:**
```tsx
// Siguiendo la documentación oficial
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Page' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}
```

## Anti-Patterns a Evitar

❌ **Adivinar APIs:**
```tsx
// NO: "Creo que así se usa..."
<Image layout="fill" />  // API vieja
```

✅ **Verificar primero:**
```tsx
// SÍ: Consultado en docs de Next.js 14+
<Image fill alt="..." />  // API actual
```

❌ **Copiar de memoria:**
```tsx
// NO: "Así lo hacía antes..."
export const metadata = { title: '...' }  // Puede estar mal
```

✅ **Confirmar sintaxis actual:**
```tsx
// SÍ: Verificado en docs
export const metadata: Metadata = {
  title: '...',
  description: '...',
}
```

## Beneficios

1. **Código correcto** desde el primer intento
2. **APIs actualizadas** (no deprecated)
3. **Best practices** oficiales
4. **Menos debugging** por errores tontos
5. **Aprendizaje continuo** de features nuevas
