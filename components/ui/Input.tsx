import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

/**
 * Input Component following COMMONS YOUTH Design System
 * - Consistent styling with brand colors
 * - Error state handling
 * - Optional label and helper text
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  required,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-sans';
  const normalStyles = 'border-brand-gray bg-white focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20';
  const errorStyles = 'border-brand-orange bg-brand-orange/5 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20';
  
  const inputStyles = error ? errorStyles : normalStyles;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-brand-obsidian mb-2">
          {label}
          {required && <span className="text-brand-orange ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`${baseStyles} ${inputStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-brand-orange font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-brand-earth">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

/**
 * Textarea Component following COMMONS YOUTH Design System
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  required,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-sans resize-y min-h-[120px]';
  const normalStyles = 'border-brand-gray bg-white focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20';
  const errorStyles = 'border-brand-orange bg-brand-orange/5 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20';
  
  const textareaStyles = error ? errorStyles : normalStyles;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-brand-obsidian mb-2">
          {label}
          {required && <span className="text-brand-orange ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={`${baseStyles} ${textareaStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-brand-orange font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-brand-earth">{helperText}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
