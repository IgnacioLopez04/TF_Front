import { forwardRef } from 'react';
import PropTypes from 'prop-types';

// Variantes de botones predefinidas usando los colores del proyecto
const buttonVariants = {
  // Botón principal - usado para acciones principales
  primary: {
    className: "bg-[#6d4bc1] hover:bg-[#5e35b1] text-white border-[#6d4bc1] transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-[#6d4bc1] focus:ring-opacity-50",
    severity: undefined
  },
  // Botón secundario - usado para acciones secundarias
  secondary: {
    className: "bg-[#ede7f6] text-[#6d4bc1] border-[#b39ddb] hover:bg-[#b39ddb] hover:text-white transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-[#b39ddb] focus:ring-opacity-50",
    severity: undefined
  },
  // Botón de acción - usado para botones "Ver", "Agregar", etc.
  action: {
    className: "bg-[#b39ddb] hover:bg-[#9575CD] text-white border-[#b39ddb] transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-[#b39ddb] focus:ring-opacity-50",
    severity: undefined
  },
  // Botón outline - usado para botones con borde
  outline: {
    className: "bg-transparent text-[#6d4bc1] border-[#6d4bc1] hover:bg-[#6d4bc1] hover:text-white transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-[#6d4bc1] focus:ring-opacity-50",
    severity: undefined
  },
  // Botón ghost - usado para botones sin borde
  ghost: {
    className: "bg-transparent text-[#6d4bc1] hover:bg-[#ede7f6] transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-[#6d4bc1] focus:ring-opacity-50",
    severity: undefined
  },
  // Botón de selección - usado para filtros y selectores
  selector: {
    className: "bg-white text-[#a678d6] border-[#a678d6] hover:bg-[#a678d6] hover:text-white transition-colors font-bold focus:outline-none focus:ring-2 focus:ring-[#a678d6] focus:ring-opacity-50",
    severity: undefined
  },
  // Botón activo - usado para elementos seleccionados
  active: {
    className: "bg-[#a678d6] text-white border-[#a678d6] transition-colors font-bold focus:outline-none focus:ring-2 focus:ring-[#a678d6] focus:ring-opacity-50",
    severity: undefined
  },
  // Botones de estado (mantienen colores estándar)
  danger: {
    className: "bg-red-500 hover:bg-red-600 text-white border-red-500 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
    severity: "danger"
  },
  success: {
    className: "bg-green-500 hover:bg-green-600 text-white border-green-500 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50",
    severity: "success"
  },
  warning: {
    className: "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50",
    severity: "warning"
  },
  info: {
    className: "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
    severity: "info"
  }
};

// Tamaños predefinidos
const buttonSizes = {
  sm: "px-2 py-1 text-sm rounded",
  md: "px-4 py-2 rounded-lg",
  lg: "px-6 py-3 text-lg rounded-lg",
  xl: "px-8 py-4 text-xl rounded-lg"
};

export const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  className = '',

  label,
  icon,
  iconPos = 'left',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  children,
  ...props
}, ref) => {
  // Obtener estilos de la variante
  const variantStyles = buttonVariants[variant] || buttonVariants.primary;
  const sizeStyles = buttonSizes[size] || buttonSizes.md;
  
  // Combinar clases
  const combinedClassName = `${variantStyles.className} ${sizeStyles} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`.trim();
  
  // Renderizar ícono
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconClass = `inline-block ${iconPos === 'right' ? 'ml-2' : 'mr-2'}`;
    return <i className={`${icon} ${iconClass}`}></i>;
  };

  // Renderizar contenido
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <i className="pi pi-spin pi-spinner mr-2"></i>
          {label || children}
        </>
      );
    }

    if (iconPos === 'right') {
      return (
        <>
          {label || children}
          {renderIcon()}
        </>
      );
    }

    return (
      <>
        {renderIcon()}
        {label || children}
      </>
    );
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={combinedClassName}
      {...props}
    >
      {renderContent()}
    </button>
  );
});

Button.displayName = 'Button';

// PropTypes validation
Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'action', 'outline', 'ghost', 'selector', 'active', 'danger', 'success', 'warning', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  iconPos: PropTypes.oneOf(['left', 'right']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  children: PropTypes.node
};

// Exportar las variantes para uso externo si es necesario
export { buttonVariants, buttonSizes }; 