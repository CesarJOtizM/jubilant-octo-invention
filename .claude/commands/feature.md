---
allowed-tools: 
  - Bash(git:*)
  - Bash(npm:*)
  - Bash(npx:*)
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Task
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
  - mcp__next-devtools__nextjs_call
  - mcp__playwright__browser_eval
description: "Desarrollo guiado de features con documentación, testing, QA y git workflow"
argument-hint: "Descripción de la feature a desarrollar"
---

# 🚀 Feature Development Workflow

Desarrollar: **$ARGUMENTS**

---

## Fase 1: 📋 Discovery & Planning

### 1.1 Crear rama de trabajo
```bash
# Verificar estado actual
git status
git branch --show-current

# Crear rama con nombre descriptivo
git checkout -b feature/$ARGUMENTS_SLUG
```

### 1.2 Clarificar requerimientos
Antes de escribir código, confirma con el usuario:
- ¿Qué problema resuelve esta feature?
- ¿Hay diseño/mockup de referencia?
- ¿Qué páginas/componentes afecta?
- ¿Necesita nuevas traducciones (i18n)?
- ¿Hay dependencias nuevas requeridas?

**ESPERA RESPUESTA DEL USUARIO ANTES DE CONTINUAR**

---

## Fase 2: 📚 Research & Documentation

### 2.1 Consultar documentación actualizada
Usa context7 para obtener documentación relevante:

```
# Next.js (App Router, Server Components, etc.)
mcp__context7__resolve-library-id: "nextjs"
mcp__context7__get-library-docs: { topic: "[tema relevante]" }

# React 19 (hooks, patterns)
mcp__context7__resolve-library-id: "react"

# Tailwind CSS 4
mcp__context7__resolve-library-id: "tailwindcss"

# Framer Motion
mcp__context7__resolve-library-id: "framer-motion"

# next-intl (i18n)
mcp__context7__resolve-library-id: "next-intl"
```

### 2.2 Revisar patrones existentes
- Leer componentes similares en el proyecto
- Revisar skills relevantes en `.claude/skills/`
- Identificar patrones a seguir

### 2.3 Documentar approach
Crear mini-spec en comentario o explicar:
- Componentes a crear/modificar
- Estructura de datos
- Flujo de usuario

---

## Fase 3: 🏗️ Implementation

### 3.1 Orden de implementación
1. **Tipos/Interfaces** - Definir tipos TypeScript primero
2. **Traducciones** - Agregar en en.json y es.json
3. **Componentes UI** - Crear componentes base
4. **Lógica** - Hooks, handlers, estado
5. **Integración** - Conectar en páginas
6. **Estilos** - Pulir con Tailwind

### 3.2 Reglas de código (OBLIGATORIAS)
- ✅ TypeScript estricto (NO `any`)
- ✅ Componentes pequeños y enfocados
- ✅ Props con interfaces documentadas
- ✅ Todos los textos en traducciones
- ✅ Mobile-first responsive
- ✅ Animaciones con Framer Motion
- ✅ Consultar docs si hay duda sobre API

### 3.3 Commits incrementales
Hacer commits pequeños y descriptivos:
```bash
git add -A
git commit -m "feat(scope): descripción corta"
```

Convención de commits:
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `style:` cambios de estilos
- `refactor:` refactorización
- `docs:` documentación
- `test:` pruebas

---

## Fase 4: 🧪 Testing & Verification

### 4.1 Verificación visual
Usar playwright para screenshots:
```
mcp__playwright__browser_eval: {
  action: "screenshot",
  url: "http://localhost:3000/[ruta]"
}
```

Verificar:
- [ ] Desktop (1920px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] Ambos idiomas (es/en)

### 4.2 Testing funcional
```bash
# Verificar errores de Next.js
mcp__next-devtools__nextjs_call: { action: "get_errors" }

# Lint
npm run lint

# TypeScript
npx tsc --noEmit

# Build completo
npm run build
```

### 4.3 Checklist de QA manual
- [ ] Navegación funciona correctamente
- [ ] Links internos usan next/link
- [ ] Imágenes usan next/image
- [ ] No hay textos hardcodeados
- [ ] Animaciones suaves (no laggy)
- [ ] Focus states visibles (a11y)
- [ ] Sin errores en consola

---

## Fase 5: 🔍 Code Review (Self-Review)

Ejecutar review automático:
```
/project:quality
```

Checklist adicional:
- [ ] Código sigue patrones del proyecto
- [ ] No hay código duplicado
- [ ] Nombres descriptivos
- [ ] Sin console.log abandonados
- [ ] Comentarios donde sea necesario (no obvios)

---

## Fase 6: 📦 Finalization

### 6.1 Commit final
```bash
git add -A
git status
git commit -m "feat($ARGUMENTS_SLUG): implementación completa"
```

### 6.2 Resumen para el usuario
Generar resumen de:
- ✅ Qué se construyó
- 📁 Archivos creados/modificados
- 🔗 Rutas afectadas
- ⚠️ Pendientes o mejoras futuras (si hay)
- 🚀 Próximos pasos sugeridos

### 6.3 Preguntar siguiente acción
- ¿Merge a main?
- ¿Crear PR?
- ¿Continuar iterando?

---

## 📌 Notas Importantes

**Si hay dudas sobre implementación:**
1. SIEMPRE consultar context7 primero
2. Si no está en context7, buscar en documentación oficial
3. Revisar cómo se hizo algo similar en el proyecto

**Si algo falla:**
1. Leer el error completo
2. Buscar en docs la causa
3. Proponer solución antes de preguntar

**Velocidad vs Calidad:**
- NUNCA sacrificar calidad por velocidad
- Código limpio desde el inicio
- Mejor hacer menos pero bien hecho
