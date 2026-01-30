---
name: clean-code
description: Principios de código limpio para el proyecto Nevada. Aplica cuando escribas o revises código.
---

# Clean Code Principles

Reglas de código limpio que todo el código del proyecto debe seguir.

## Principios SOLID (adaptados a React)

### Single Responsibility
- Un componente = una responsabilidad
- Si necesita hacer muchas cosas, dividir en subcomponentes
- Custom hooks para lógica reutilizable

### Open/Closed
- Componentes extensibles via props
- Usar composición sobre herencia
- Slots y children para flexibilidad

### Dependency Inversion
- Props para inyectar dependencias
- Context para dependencias globales
- No hardcodear servicios en componentes

## Reglas de Código

### Naming
```tsx
// ✅ Componentes en PascalCase
function UserProfile() {}

// ✅ Hooks empiezan con use
function useUserData() {}

// ✅ Handlers empiezan con handle
const handleSubmit = () => {}

// ✅ Booleanos con is/has/should
const isLoading = true;
const hasError = false;

// ✅ Constantes en UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
```

### Funciones
```tsx
// ✅ Pequeñas (< 30 líneas ideal)
// ✅ Un nivel de abstracción
// ✅ Nombres que describen QUÉ hacen, no CÓMO

// ❌ Malo
function processData(data) { /* 100 líneas */ }

// ✅ Bueno
function validateUserInput(input) { /* 10 líneas */ }
function formatUserData(data) { /* 10 líneas */ }
function saveUser(user) { /* 10 líneas */ }
```

### Componentes React
```tsx
// ✅ Estructura consistente
export default function Component({ prop1, prop2 }: Props) {
  // 1. Hooks de estado
  const [state, setState] = useState();
  
  // 2. Hooks de efectos
  useEffect(() => {}, []);
  
  // 3. Handlers
  const handleClick = () => {};
  
  // 4. Lógica derivada
  const derivedValue = useMemo(() => {}, []);
  
  // 5. Early returns
  if (loading) return <Loading />;
  if (error) return <Error />;
  
  // 6. Render principal
  return <div>...</div>;
}
```

### Evitar
```tsx
// ❌ Magic numbers
if (items.length > 5) {}

// ✅ Constantes con nombre
const MAX_VISIBLE_ITEMS = 5;
if (items.length > MAX_VISIBLE_ITEMS) {}

// ❌ Comentarios obvios
// Incrementa el contador
count++;

// ✅ Comentarios que explican POR QUÉ
// Workaround para bug en Safari iOS 15
// Ver: https://bugs.webkit.org/...

// ❌ Código muerto
// function oldFunction() { ... }

// ✅ Eliminar código que no se usa
```

## Code Smells a Detectar

1. **Componente muy grande** (> 200 líneas) → Dividir
2. **Muchos props** (> 5-7) → Agrupar o repensar
3. **useEffect complejo** → Extraer a custom hook
4. **Lógica duplicada** → Extraer a función/hook
5. **Anidación profunda** → Early returns o componentes
6. **any en TypeScript** → Definir tipo correcto
