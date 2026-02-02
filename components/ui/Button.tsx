import React from 'react';
import { LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}

/**
 * Button Component following COMMONS YOUTH Design System
 * - Uses monochrome backgrounds (Black/White) as per design guidelines
 * - Implements shadow-retro effect for brand consistency
 * - Supports multiple variants and sizes
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles following design system
  const baseStyles = 'font-bold rounded-xl transition-all inline-flex items-center justify-center';
  
  // Variant styles - following monochrome rule for buttons
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-brand-obsidian text-brand-linen shadow-retro hover:translate-y-1 hover:shadow-none border-2 border-brand-obsidian',
    secondary: 'bg-white border-2 border-brand-obsidian text-brand-obsidian hover:bg-brand-bud transition-all',
    outline: 'bg-transparent border-2 border-brand-obsidian text-brand-obsidian hover:bg-brand-linen',
    danger: 'bg-transparent border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-bold',
  };

  // Size styles - following typography hierarchy
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {Icon && iconPosition === 'left' && !loading && <Icon className="w-5 h-5 mr-2" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 ml-2" />}
    </button>
  );
};
