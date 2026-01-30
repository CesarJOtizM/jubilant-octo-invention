# Claude Code Configuration

Configuración compartida de Claude Code para el **Sistema de Gestión de Inventario** (frontend).

El frontend consume un backend NestJS con **21 controladores**, más de **120 endpoints** y **11 módulos principales**. La arquitectura sigue **Screaming + Clean + Hexagonal**. Ver [docs/front-end_work-plan.md](../docs/front-end_work-plan.md) para el plan completo.

## 📁 Estructura

```
.claude/
├── settings.json        # Permisos y hooks (compartido)
├── settings.local.json  # Config personal (ignorado en git)
├── agents/              # Agentes especializados
├── commands/            # Comandos /project:*
├── skills/              # Guías y patrones
└── hooks/               # Scripts de automatización
```

## 🚀 Setup para nuevos devs

### 1. Requisitos

- [Claude Code CLI](https://claude.ai/code) instalado
- Node.js 18+
- GitHub CLI (`gh`) instalado y autenticado

### 2. MCPs recomendados

Crear `.claude/settings.local.json`:

```json
{
  "enabledMcpjsonServers": [
    "next-devtools",
    "playwright",
    "context7",
    "github"
  ],
  "enableAllProjectMcpServers": true
}
```

### 3. Verificar instalación

```bash
cd website
claude
/mcp  # Verificar MCPs conectados
```

## 📋 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `/project:feature [desc]` | Desarrollo guiado de features |
| `/project:pr [título]` | Crear PR con descripción auto |
| `/project:qa` | QA completo con screenshots |
| `/project:quality` | Pipeline de calidad completo |
| `/project:review` | Code review |
| `/project:ui-review` | UI/UX review |
| `/project:pre-commit` | Check rápido pre-commit |
| `/project:fix-i18n` | Sincronizar traducciones |
| `/project:new-page [nombre]` | Crear nueva página |

## 🤖 Agentes

- `@code-reviewer` — Review de TypeScript/React
- `@ui-reviewer` — Review de UI/UX y responsive
- `@qa-engineer` — Testing visual y funcional
- `@quality-orchestrator` — Pipeline completo

## 🔄 Hooks Automáticos

1. **PreToolUse:** Advierte si editas en branch `main`
2. **PostToolUse:** ESLint auto-fix en archivos .ts/.tsx
3. **Stop:** Quality check al terminar cada tarea

## 📚 Skills

Ver `.claude/skills/` para guías de:

- **Arquitectura:** Clean Architecture + DDD + Hexagonal (clean-ddd-hexagonal)
- **Documentación:** Consulta doc antes de implementar (documentation-first)
- **UI/UX:** Patrones Tailwind, Framer Motion, frontend-design, web-design-guidelines
- **React/Next:** Vercel best practices, composition patterns
- **Componentes:** Crear secciones y componentes (new-section, new-component)
- **i18n:** Manejo de traducciones (add-translation)
- **Código:** Principios de clean code (clean-code)

Al desarrollar features, respetar la estructura por **módulos** (inventory, sales, returns, reports, imports, authentication, users, roles, audit) y las capas **domain → application → infrastructure → presentation** definidas en el work plan.

## ⚠️ Notas

- **SIEMPRE** consultar [docs/front-end_work-plan.md](../docs/front-end_work-plan.md) con context7 antes de implementar
- **NUNCA** hardcodear textos — usar traducciones (next-intl)
- **Crear rama** antes de editar código
- Ver `CLAUDE.md` en la raíz para reglas completas
