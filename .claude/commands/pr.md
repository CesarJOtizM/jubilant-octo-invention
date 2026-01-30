---
allowed-tools:
  - Bash(git:*)
  - Bash(gh:*)
  - Read
  - Grep
description: "Crear Pull Request con descripción automática basada en commits y cambios"
argument-hint: "[título opcional del PR]"
---

# 🔀 Crear Pull Request

## Paso 1: Verificar Estado

```bash
# Branch actual (no debe ser main)
git branch --show-current

# Commits pendientes de push
git log origin/main..HEAD --oneline

# Archivos modificados vs main
git diff --name-only origin/main

# Estado del working directory
git status
```

**Si estás en main:** Crear branch primero con `/project:feature`

## Paso 2: Pre-PR Quality Check

```bash
# Lint
npm run lint

# TypeScript
npx tsc --noEmit

# Build
npm run build
```

**Si alguno falla:** Corregir antes de crear PR

## Paso 3: Push Branch

```bash
git push -u origin $(git branch --show-current)
```

## Paso 4: Generar Descripción del PR

Analizar:
1. **Commits** - Leer mensajes de commits
2. **Archivos** - Qué se agregó/modificó/eliminó
3. **Cambios** - Resumen de los diffs

Generar descripción con este template:

```markdown
## 📋 Descripción

[Resumen claro de qué hace este PR]

## 🎯 Cambios Principales

- [Cambio 1]
- [Cambio 2]
- [Cambio 3]

## 📁 Archivos Afectados

- `path/to/file.tsx` - [qué se hizo]
- `path/to/file.tsx` - [qué se hizo]

## 🧪 Testing

- [ ] Lint pasa
- [ ] Build pasa
- [ ] Verificado en desktop
- [ ] Verificado en mobile
- [ ] Verificado en ambos idiomas

## 📸 Screenshots

[Si aplica, incluir screenshots]

## 🔗 Relacionado

[Issues o PRs relacionados, si hay]
```

## Paso 5: Crear PR

```bash
gh pr create \
  --title "$ARGUMENTS" \
  --body "[descripción generada]" \
  --base main
```

Si no se proporcionó título, generar uno descriptivo basado en los commits.

## Paso 6: Confirmación

Mostrar:
- ✅ PR creado exitosamente
- 🔗 URL del PR
- 📊 Resumen de cambios incluidos

Preguntar si quiere:
- Ver el PR en el navegador
- Continuar trabajando en la branch
- Volver a main
