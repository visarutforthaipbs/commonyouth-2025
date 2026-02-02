import React from 'react';
import { LucideIcon } from 'lucide-react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
  className?: string;
  mono?: boolean; // Use PT Mono font for accent
}

/**
 * Badge Component following COMMONS YOUTH Design System
 * - Uses PT Mono for numeric/accent content (set mono={true})
 * - Follows color palette: primary, secondary, and topic colors
 * - Consistent rounded-full design for tags and labels
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = '',
  mono = false,
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center rounded-full font-bold uppercase tracking-wide transition-colors';
  
  // Font style - use PT Mono for accent/numeric badges
  const fontStyle = mono ? 'font-mono' : 'font-sans';
  
  // Variant styles - using design system colors
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-brand-linen border border-brand-gray text-brand-obsidian',
    primary: 'bg-brand-bud text-brand-obsidian border border-brand-obsidian',
    secondary: 'bg-brand-ocean/10 text-brand-ocean',
    success: 'bg-brand-bud/20 text-brand-forest border border-brand-forest/30',
    warning: 'bg-brand-morning/40 text-brand-obsidian border border-brand-obsidian/20',
    danger: 'bg-brand-orange text-white',
    outline: 'bg-transparent border-2 border-brand-obsidian text-brand-obsidian',
  };

  // Size styles
  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span className={`${baseStyles} ${fontStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {children}
    </span>
  );
};
