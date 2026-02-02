import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'browser';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

/**
 * Card Component following COMMONS YOUTH Design System
 * - Consistent border radius and shadows
 * - Retro shadow effect support
 * - Multiple variants for different use cases
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
}) => {
  const baseStyles = 'rounded-2xl transition-all';
  
  const variantStyles = {
    default: 'bg-white border-2 border-brand-obsidian',
    elevated: 'bg-white border-2 border-brand-obsidian shadow-retro hover:shadow-none hover:translate-y-1',
    outlined: 'bg-transparent border-2 border-brand-gray',
    browser: 'bg-white border-2 border-brand-obsidian overflow-hidden',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const cursorStyle = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${cursorStyle} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface BrowserCardProps {
  children: React.ReactNode;
  url?: string;
  className?: string;
}

/**
 * Browser-styled Card with window controls
 * Perfect for showcasing groups or content in a browser-like UI
 */
export const BrowserCard: React.FC<BrowserCardProps> = ({
  children,
  url = 'commons-youth.org',
  className = '',
}) => {
  return (
    <Card variant="browser" padding="none" className={className}>
      {/* Browser Header */}
      <div className="bg-brand-linen border-b-2 border-brand-obsidian p-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-brand-orange border border-brand-obsidian"></div>
        <div className="w-3 h-3 rounded-full bg-brand-morning border border-brand-obsidian"></div>
        <div className="w-3 h-3 rounded-full bg-brand-bud border border-brand-obsidian"></div>
        <div className="ml-auto text-[10px] font-mono text-brand-earth bg-white px-2 rounded border border-brand-gray truncate max-w-[150px]">
          {url}
        </div>
      </div>
      {/* Content */}
      {children}
    </Card>
  );
};
