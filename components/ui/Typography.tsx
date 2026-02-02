import React from 'react';

/**
 * Typography Components following COMMONS YOUTH Design System
 * 
 * Hierarchy:
 * - Main Heading: Anuphan Bold (ALL CAPS) with +4pt leading
 * - Subheader: Anuphan Semibold at 65% of Main Heading
 * - Body Text: Anuphan Regular at 42% of Main Heading with +2pt leading
 * - Caption: Anuphan Light at 78.85% of Body Text
 */

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface TextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

// Main Heading - Anuphan Bold, ALL CAPS
export const Heading: React.FC<HeadingProps> = ({ 
  children, 
  className = '', 
  as: Component = 'h1' 
}) => {
  const baseStyles = 'font-bold text-brand-obsidian uppercase tracking-tight leading-tight';
  return <Component className={`${baseStyles} ${className}`}>{children}</Component>;
};

// Subheader - Anuphan Semibold, 65% of heading size
export const Subheading: React.FC<HeadingProps> = ({ 
  children, 
  className = '', 
  as: Component = 'h2' 
}) => {
  // 65% relative sizing - implemented via text-size classes
  const baseStyles = 'font-semibold text-brand-obsidian';
  return <Component className={`${baseStyles} ${className}`}>{children}</Component>;
};

// Body Text - Anuphan Regular, 42% of heading with +2pt leading
export const BodyText: React.FC<TextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'p' 
}) => {
  const baseStyles = 'font-normal text-brand-obsidian leading-relaxed';
  return <Component className={`${baseStyles} ${className}`}>{children}</Component>;
};

// Caption - Anuphan Light, 78.85% of body text
export const Caption: React.FC<TextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'p' 
}) => {
  const baseStyles = 'font-light text-brand-earth text-sm';
  return <Component className={`${baseStyles} ${className}`}>{children}</Component>;
};

// Accent Text - PT Mono for special emphasis
export const AccentText: React.FC<TextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'span' 
}) => {
  const baseStyles = 'font-mono font-bold text-brand-obsidian';
  return <Component className={`${baseStyles} ${className}`}>{children}</Component>;
};
