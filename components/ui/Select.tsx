import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

/**
 * Select Component following COMMONS YOUTH Design System
 * - Consistent styling with Input component
 * - Custom dropdown indicator
 * - Error state handling
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  required,
  options,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'w-full px-4 py-3 pr-10 rounded-xl border-2 transition-all outline-none font-sans appearance-none cursor-pointer';
  const normalStyles = 'border-brand-gray bg-white focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20';
  const errorStyles = 'border-brand-orange bg-brand-orange/5 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20';
  
  const selectStyles = error ? errorStyles : normalStyles;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-brand-obsidian mb-2">
          {label}
          {required && <span className="text-brand-orange ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`${baseStyles} ${selectStyles} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-earth pointer-events-none" />
      </div>
      {error && (
        <p className="mt-2 text-sm text-brand-orange font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-brand-earth">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

/**
 * Checkbox Component following COMMONS YOUTH Design System
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  className = '',
  ...props
}, ref) => {
  return (
    <label className="flex items-center cursor-pointer group">
      <input
        ref={ref}
        type="checkbox"
        className="w-5 h-5 rounded border-2 border-brand-gray text-brand-bud focus:ring-2 focus:ring-brand-bud/20 cursor-pointer transition-all"
        {...props}
      />
      <span className="ml-3 text-brand-obsidian group-hover:text-brand-bud transition-colors">
        {label}
      </span>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
