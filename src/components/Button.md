# Componente Button Personalizado

Este es un componente Button completamente personalizado, creado desde cero sin depender de PrimeReact, para tener control total sobre los estilos y colores de tu proyecto.

## Uso Básico

```jsx
import { Button } from '../components/Button';

// Botón primario (violeta)
<Button label="Guardar" variant="primary" />

// Botón secundario (lavanda)
<Button label="Cancelar" variant="secondary" />
```

## Props

### Props del componente
- `variant`: Tipo de botón (ver variantes disponibles)
- `size`: Tamaño del botón (ver tamaños disponibles)
- `className`: Clases CSS adicionales
- `severity`: Severidad de PrimeReact (se puede sobrescribir)

### Props del componente personalizado
- `label`: Texto del botón
- `icon`: Ícono (ej: "pi pi-check")
- `iconPos`: Posición del ícono ("left" | "right")
- `onClick`: Función de click
- `type`: Tipo de botón ("button" | "submit" | "reset")
- `disabled`: Estado deshabilitado
- `loading`: Estado de carga (muestra spinner)
- `children`: Contenido alternativo al label
- Y todas las demás props de HTML button

## Variantes Disponibles

### `primary`
- **Uso**: Acciones principales (Guardar, Siguiente, etc.)
- **Fondo**: `#6d4bc1` (violeta principal)
- **Hover**: `#5e35b1` (violeta oscuro)
- **Texto**: blanco
- **Ejemplo**: Botones de guardar, navegación principal

### `secondary`
- **Uso**: Acciones secundarias (Cancelar, Anterior, etc.)
- **Fondo**: `#ede7f6` (lavanda claro)
- **Hover**: `#b39ddb` (violeta medio)
- **Texto**: `#6d4bc1` (violeta)
- **Ejemplo**: Botones de cancelar, retroceder

### `action`
- **Uso**: Botones de acción (Ver, Agregar, etc.)
- **Fondo**: `#b39ddb` (violeta medio)
- **Hover**: `#9575CD` (violeta medio oscuro)
- **Texto**: blanco
- **Ejemplo**: Botones "Ver", "Agregar comentario"

### `outline`
- **Uso**: Botones con borde
- **Fondo**: transparente
- **Borde**: `#6d4bc1`
- **Hover**: fondo violeta
- **Ejemplo**: Botones de enlace

### `ghost`
- **Uso**: Botones sin borde
- **Fondo**: transparente
- **Hover**: `#ede7f6`
- **Ejemplo**: Botones de navegación sutil

### `selector`
- **Uso**: Filtros y selectores
- **Fondo**: blanco
- **Texto**: `#a678d6` (violeta)
- **Borde**: `#a678d6`
- **Hover**: fondo violeta, texto blanco
- **Ejemplo**: Botones de filtro

### `active`
- **Uso**: Elementos seleccionados
- **Fondo**: `#a678d6` (violeta)
- **Texto**: blanco
- **Ejemplo**: Filtros activos

### `danger`, `success`, `warning`, `info`
- **Uso**: Estados y alertas
- **Colores**: Estándar de PrimeReact
- **Ejemplo**: Eliminar, confirmar, alertas

## Tamaños Disponibles

- `sm`: Pequeño (px-2 py-1 text-sm)
- `md`: Mediano (px-4 py-2) - **por defecto**
- `lg`: Grande (px-6 py-3 text-lg)
- `xl`: Extra grande (px-8 py-4 text-xl)

## Ejemplos de Uso

```jsx
// Botón primario - Acciones principales
<Button 
  label="Guardar Historia Fisiátrica" 
  icon="pi pi-check" 
  variant="primary" 
  onClick={handleSave} 
/>

// Botón secundario - Acciones secundarias
<Button 
  label="Cancelar" 
  variant="secondary" 
  size="sm" 
  onClick={handleCancel} 
/>

// Botón de acción - Botones "Ver", "Agregar"
<Button 
  label="Ver" 
  variant="action" 
  onClick={handleView} 
/>

// Botón outline - Navegación
<Button 
  label="Siguiente" 
  icon="pi pi-chevron-right" 
  iconPos="right" 
  variant="outline" 
/>

// Botón selector - Filtros
<Button 
  label="Todos" 
  variant="selector" 
  onClick={() => setFilter('todos')} 
/>

// Botón activo - Filtro seleccionado
<Button 
  label="Hogar" 
  variant="active" 
  onClick={() => setFilter('hogar')} 
/>

// Botón ghost - Navegación sutil
<Button 
  label="Inicio" 
  variant="ghost" 
  onClick={() => navigate('/home')} 
/>

// Botón de peligro
<Button 
  label="Eliminar" 
  variant="danger" 
  icon="pi pi-trash" 
/>

// Botón con clases adicionales
<Button 
  label="Personalizado" 
  variant="primary" 
  className="w-full rounded-lg" 
/>

// Botón deshabilitado
<Button 
  label="Guardar" 
  variant="primary" 
  disabled={true} 
/>

// Botón con estado de carga
<Button 
  label="Guardando..." 
  variant="primary" 
  loading={true} 
/>

// Botón con children en lugar de label
<Button variant="primary">
  <span>Contenido personalizado</span>
</Button>
```

## Características del Componente

### ✅ **Control total de estilos**
- Sin dependencias de PrimeReact
- Colores 100% personalizables
- Focus rings personalizados
- Estados disabled y loading

### ✅ **Accesibilidad**
- Focus rings con colores del proyecto
- Estados disabled con cursor apropiado
- Soporte para navegación por teclado

### ✅ **Flexibilidad**
- Soporte para íconos de PrimeIcons
- Posicionamiento de íconos (izquierda/derecha)
- Estados de carga con spinner
- Compatible con todas las props de HTML button

## Migración desde PrimeReact Button

### Antes (PrimeReact)
```jsx
<Button 
  label="Guardar" 
  className="bg-[#6d4bc1] hover:bg-[#5e35b1] text-white" 
/>
```

### Después (Componente personalizado)
```jsx
<Button 
  label="Guardar" 
  variant="primary" 
/>
```

## Paleta de Colores del Proyecto

El componente Button usa exactamente los mismos colores que tu proyecto:

| Color | Código HEX | Uso en el proyecto |
|-------|------------|-------------------|
| **Violeta principal** | `#6d4bc1` | Botones principales, textos importantes |
| **Violeta oscuro** | `#5e35b1` | Hover de botones principales |
| **Violeta medio** | `#b39ddb` | Botones de acción, elementos activos |
| **Violeta medio oscuro** | `#9575CD` | Hover de botones de acción |
| **Lavanda claro** | `#ede7f6` | Fondos, botones secundarios |
| **Violeta selector** | `#a678d6` | Filtros y selectores |
| **Fondo principal** | `#f5f2fa` | Fondo de páginas |

## Personalización

Si necesitas estilos específicos, puedes:

1. **Usar className para agregar estilos**:
```jsx
<Button 
  variant="primary" 
  className="w-full shadow-lg" 
/>
```

2. **Sobrescribir severity**:
```jsx
<Button 
  variant="primary" 
  severity="danger" 
/>
```

3. **Crear una nueva variante** (modificando el componente):
```jsx
const customVariants = {
  ...buttonVariants,
  custom: {
    className: "bg-[#9575CD] hover:bg-[#7E57C2] text-white",
    severity: undefined
  }
};
```

## Migración desde botones existentes

### Antes (botones personalizados)
```jsx
// Botón principal
<button className="bg-[#6d4bc1] hover:bg-[#5e35b1] text-white px-4 py-2 rounded-lg">
  Guardar
</button>

// Botón secundario
<button className="bg-[#ede7f6] text-[#6d4bc1] border-[#b39ddb] hover:bg-[#b39ddb] hover:text-white">
  Cancelar
</button>

// Botón de acción
<button className="bg-[#b39ddb] text-white px-4 py-1 rounded">
  Ver
</button>
```

### Después (componente Button)
```jsx
// Botón principal
<Button variant="primary" label="Guardar" />

// Botón secundario
<Button variant="secondary" label="Cancelar" />

// Botón de acción
<Button variant="action" label="Ver" />
``` 