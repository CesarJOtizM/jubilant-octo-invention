---
name: tailwind-patterns
description: Patrones de Tailwind CSS 4 usados en Nevada Tech
---

# Patrones Tailwind CSS

Convenciones y patrones de estilos del proyecto.

## Layout Base

```tsx
// Container centrado
<div className="container mx-auto px-4">

// Sección con padding vertical
<section className="py-20">

// Grid responsive
<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
```

## Tipografía

```tsx
// Títulos
<h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
<h2 className="text-3xl font-bold md:text-4xl">
<h3 className="text-xl font-semibold">

// Texto
<p className="text-lg text-gray-600">
<span className="text-sm text-gray-500">

// Labels/Tags
<span className="text-sm font-medium uppercase tracking-wider text-primary">
```

## Cards

```tsx
// Card básica
<div className="rounded-2xl bg-white p-6 shadow-lg">

// Card con hover
<div className="rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">

// Card con borde
<div className="rounded-2xl border border-gray-200 bg-white p-6">
```

## Botones

```tsx
// Primario
<button className="rounded-full bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90">

// Secundario/Outline
<button className="rounded-full border-2 border-primary px-6 py-3 font-medium text-primary transition-colors hover:bg-primary hover:text-white">

// Ghost
<button className="px-4 py-2 text-gray-600 transition-colors hover:text-primary">
```

## Espaciado Consistente

```tsx
// Entre secciones: py-20 o py-24
// Entre elementos: gap-8 o space-y-8
// Padding interno cards: p-6 o p-8
// Margin títulos: mb-4, mt-12
```

## Responsive

```tsx
// Mobile-first approach
<div className="
  text-center          // Mobile
  md:text-left         // Tablet+
  lg:flex lg:items-center  // Desktop
">

// Grid que colapsa
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

// Ocultar en móvil
<div className="hidden md:block">

// Solo en móvil
<div className="md:hidden">
```

## Colores del Proyecto

```tsx
// Usar variables CSS o clases de Tailwind
bg-primary      // Color principal
text-primary
bg-primary/10   // Con opacidad

// Grises
text-gray-900   // Títulos
text-gray-600   // Texto body
text-gray-500   // Texto secundario
bg-gray-50      // Fondo alternativo
```

## Gradientes

```tsx
// Fondo con gradiente
<div className="bg-gradient-to-br from-primary/5 to-transparent">

// Texto con gradiente
<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
```

## Dark Mode (si aplica)

```tsx
<div className="bg-white dark:bg-gray-900">
<p className="text-gray-600 dark:text-gray-300">
```

## Utilidades Comunes

```tsx
// Centrar flex
className="flex items-center justify-center"

// Centrar absoluto
className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"

// Aspect ratio
className="aspect-video" // 16:9
className="aspect-square" // 1:1

// Truncar texto
className="truncate" // Una línea
className="line-clamp-2" // Dos líneas
```
