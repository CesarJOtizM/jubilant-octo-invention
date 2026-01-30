---
name: new-section
description: Crear una nueva sección para páginas del sitio Nevada Tech
---

# Crear Nueva Sección

Guía para crear secciones consistentes con el diseño del proyecto.

## Pasos

1. Crear componente en `app/components/sections/NombreSeccion.tsx`
2. Seguir patrón de secciones existentes (referencia: `Services.tsx`, `Stats.tsx`)
3. Usar Framer Motion para animaciones de entrada
4. Agregar traducciones en `messages/en.json` y `messages/es.json`
5. Importar y usar en la página correspondiente

## Template Base

```tsx
'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import SectionTitle from '../ui/SectionTitle';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function NombreSeccion() {
  const t = useTranslations('NombreSeccion');

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle 
          label={t('label')} 
          title={t('title')} 
        />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Items con itemVariants */}
          <motion.div variants={itemVariants}>
            {/* Contenido */}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
```

## Traducciones Requeridas

```json
{
  "NombreSeccion": {
    "label": "Etiqueta superior",
    "title": "Título de la Sección",
    "description": "Descripción opcional"
  }
}
```

## Checklist

- [ ] Componente creado con 'use client'
- [ ] Usa SectionTitle para consistencia
- [ ] Animaciones con Framer Motion
- [ ] Traducciones en en.json y es.json
- [ ] Responsive (mobile-first con Tailwind)
- [ ] Importado en la página correspondiente
