---
allowed-tools:
  - Bash(npm:*)
  - Bash(npx:*)
  - Bash(git:*)
  - Read
  - Glob
  - mcp__playwright__browser_eval
  - mcp__next-devtools__nextjs_call
description: "Ejecutar QA completo de los cambios actuales"
---

# 🧪 QA Completo

Ejecutar verificación exhaustiva siguiendo el proceso del agente @qa-engineer.

## 1. Verificación Técnica

```bash
echo "📋 Lint..."
npm run lint

echo "📘 TypeScript..."
npx tsc --noEmit

echo "🏗️ Build..."
npm run build
```

## 2. Identificar Cambios

```bash
# Archivos modificados
git diff --name-only HEAD~3

# Rutas afectadas
git diff --name-only HEAD~3 | grep "app/\[locale\]" | head -10
```

## 3. Verificar Errores de Next.js

```
mcp__next-devtools__nextjs_call: { action: "get_errors" }
```

## 4. Screenshots de Verificación

Para cada ruta afectada, tomar screenshots:

### Desktop (1280px)
```
mcp__playwright__browser_eval: {
  action: "screenshot",
  url: "http://localhost:3000/es",
  viewport: { width: 1280, height: 800 }
}
```

### Mobile (375px)
```
mcp__playwright__browser_eval: {
  action: "screenshot", 
  url: "http://localhost:3000/es",
  viewport: { width: 375, height: 667 }
}
```

## 5. Verificar i18n

- Leer `messages/en.json` y `messages/es.json`
- Comparar claves
- Buscar `[TRADUCIR]` o `[TRANSLATE]`

```bash
grep -r "TRADUCIR\|TRANSLATE" messages/
```

## 6. Generar Reporte

```markdown
# 🧪 QA Report

## Estado
| Check | Resultado |
|-------|-----------|
| Lint | ✅/❌ |
| TypeScript | ✅/❌ |
| Build | ✅/❌ |
| Next.js Errors | ✅/❌ |
| Visual Desktop | ✅/❌ |
| Visual Mobile | ✅/❌ |
| i18n Sync | ✅/❌ |

## Issues Encontrados
[Lista]

## Veredicto: ✅ READY / ❌ NEEDS WORK
```

## 7. Siguiente Paso

Si todo OK → Ofrecer crear PR con `/project:pr`
Si hay issues → Listar y ofrecer corregir
