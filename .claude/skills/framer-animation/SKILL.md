---
name: framer-animation
description: Patrones de animación con Framer Motion para Nevada Tech
---

# Animaciones con Framer Motion

Patrones y ejemplos usados en el proyecto.

## Animación de Entrada (Scroll)

```tsx
'use client';
import { motion } from 'framer-motion';

// Fade in desde abajo
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.5 }}
>
  Contenido
</motion.div>
```

## Stagger Children (Lista de items)

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

// Uso
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## Hover Effects

```tsx
// Card con elevación
<motion.div
  whileHover={{ y: -5, scale: 1.02 }}
  transition={{ type: 'spring', stiffness: 300 }}
>
  Card content
</motion.div>

// Botón con scale
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

## Animación de Texto

```tsx
// Título con palabras animadas
const words = title.split(' ');

<motion.h1>
  {words.map((word, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
      className="inline-block mr-2"
    >
      {word}
    </motion.span>
  ))}
</motion.h1>
```

## Contador Animado

```tsx
// Referencia: app/components/ui/AnimatedCounter.tsx
import AnimatedCounter from '../ui/AnimatedCounter';

<AnimatedCounter 
  from={0} 
  to={150} 
  duration={2} 
  suffix="+" 
/>
```

## Transiciones de Página

```tsx
// Layout con AnimatePresence
import { AnimatePresence, motion } from 'framer-motion';

<AnimatePresence mode="wait">
  <motion.main
    key={pathname}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.main>
</AnimatePresence>
```

## Mejores Prácticas

1. **viewport={{ once: true }}** — Animar solo la primera vez que entra en vista
2. **margin negativo** — Trigger antes de que el elemento sea visible
3. **duration 0.3-0.6** — Animaciones rápidas pero perceptibles
4. **staggerChildren 0.05-0.15** — Efecto cascada sutil
5. **Usar variants** — Código más limpio y reutilizable

## Evitar

- ❌ Animaciones muy largas (>1s)
- ❌ Demasiados elementos animados simultáneamente
- ❌ Animaciones que bloqueen interacción
- ❌ whileInView sin once: true (re-anima al scroll)
