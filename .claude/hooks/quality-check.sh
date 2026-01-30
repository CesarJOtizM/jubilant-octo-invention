#!/bin/bash
# Quality check hook - se ejecuta cuando Claude termina una tarea
# Ubicación: .claude/hooks/quality-check.sh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_DIR"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Quality Check Automático"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ISSUES=0
WARNINGS=0

# 1. Lint
echo ""
echo "📋 Lint..."
if npm run lint 2>&1 | grep -q "error"; then
    echo -e "${RED}❌ Lint: errores encontrados${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✅ Lint: passed${NC}"
fi

# 2. TypeScript
echo ""
echo "📘 TypeScript..."
if npx tsc --noEmit 2>&1 | grep -q "error"; then
    echo -e "${RED}❌ TypeScript: errores de tipo${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✅ TypeScript: passed${NC}"
fi

# 3. i18n sync check (verificar que en.json y es.json tengan mismas claves)
echo ""
echo "🌐 i18n..."
if [ -f "messages/en.json" ] && [ -f "messages/es.json" ]; then
    EN_KEYS=$(cat messages/en.json | grep -o '"[^"]*":' | sort | head -50)
    ES_KEYS=$(cat messages/es.json | grep -o '"[^"]*":' | sort | head -50)
    if [ "$EN_KEYS" != "$ES_KEYS" ]; then
        echo -e "${YELLOW}⚠️ i18n: posible desincronización en traducciones${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}✅ i18n: synced${NC}"
    fi
else
    echo -e "${GREEN}✅ i18n: skipped (no translation files)${NC}"
fi

# 4. Build (solo verificar, no generar output completo)
echo ""
echo "🏗️ Build check..."
if npm run build 2>&1 | grep -qE "(error|Error|failed)"; then
    echo -e "${RED}❌ Build: falló${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✅ Build: passed${NC}"
fi

# Resumen
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ISSUES -gt 0 ]; then
    echo -e "${RED}❌ Quality Check: $ISSUES issues encontrados${NC}"
    echo '{"decision": "block", "reason": "Quality check failed. Hay errores que corregir."}'
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️ Quality Check: passed con $WARNINGS warnings${NC}"
    echo '{"decision": "continue", "reason": "Quality check passed con warnings menores."}'
else
    echo -e "${GREEN}✅ Quality Check: todo OK${NC}"
    echo '{"decision": "continue", "reason": "Quality check passed."}'
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
