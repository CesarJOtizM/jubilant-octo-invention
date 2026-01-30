---
name: add-translation
description: Agregar o modificar traducciones en el proyecto Nevada Tech
---

# Agregar Traducciones

Guía para trabajar con next-intl en el proyecto.

## Archivos de Traducción

- `messages/en.json` — Inglés (idioma base)
- `messages/es.json` — Español

## Estructura JSON

```json
{
  "NombreComponente": {
    "title": "Título",
    "description": "Descripción",
    "items": {
      "item-1": {
        "title": "Item 1",
        "description": "Descripción del item"
      }
    },
    "cta": "Llamada a la acción"
  }
}
```

## Uso en Componentes

### Client Components

```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function MiComponente() {
  const t = useTranslations('MiComponente');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      
      {/* Acceso anidado */}
      <span>{t('items.item-1.title')}</span>
      
      {/* Con variables */}
      <p>{t('greeting', { name: 'Usuario' })}</p>
    </div>
  );
}
```

### Server Components

```tsx
import { getTranslations } from 'next-intl/server';

export default async function MiPagina() {
  const t = await getTranslations('MiPagina');
  
  return <h1>{t('title')}</h1>;
}
```

### Metadata

```tsx
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('MiPagina');
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}
```

## Reglas IMPORTANTES

1. **NUNCA** hardcodear texto visible en componentes
2. **SIEMPRE** agregar en AMBOS archivos (en.json y es.json)
3. Mantener la misma estructura de claves en ambos archivos
4. Usar claves descriptivas en kebab-case para items
5. Agrupar por componente/sección

## Checklist

- [ ] Traducción agregada en en.json
- [ ] Traducción agregada en es.json
- [ ] Claves coinciden exactamente
- [ ] Componente usa useTranslations/getTranslations
- [ ] Verificar en ambos idiomas en el navegador
