---
name: new-component
description: Crear un nuevo componente UI reutilizable para Nevada Tech
---

# Crear Componente UI

Guía para crear componentes reutilizables en `app/components/ui/`.

## Ubicación

- Componentes UI genéricos: `app/components/ui/`
- Cards específicas: `app/components/sections/`
- Componentes de navegación: `app/components/navigation/`

## Template Componente UI

```tsx
'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils'; // si existe, sino usar template strings

interface ComponentNameProps extends HTMLMotionProps<'div'> {
  /** Descripción de la prop */
  variant?: 'primary' | 'secondary';
  /** Contenido del componente */
  children: React.ReactNode;
}

export default function ComponentName({
  variant = 'primary',
  children,
  className,
  ...props
}: ComponentNameProps) {
  return (
    <motion.div
      className={cn(
        'base-classes',
        variant === 'primary' && 'primary-classes',
        variant === 'secondary' && 'secondary-classes',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

## Template Card

```tsx
'use client';

import { motion } from 'framer-motion';

interface CardNameProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function CardName({ title, description, icon }: CardNameProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </motion.div>
  );
}
```

## Convenciones

- **Nombres**: PascalCase para componentes
- **Props**: Interface con Props suffix
- **Exports**: Default export para componentes
- **Estilos**: Tailwind CSS, nunca inline styles
- **Animaciones**: Framer Motion para interacciones

## Checklist

- [ ] TypeScript con tipos explícitos
- [ ] Props documentadas con JSDoc si es complejo
- [ ] 'use client' si usa hooks o eventos
- [ ] Responsive por defecto
- [ ] Animaciones suaves (no distraen)
