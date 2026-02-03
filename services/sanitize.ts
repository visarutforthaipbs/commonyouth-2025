/**
 * Input sanitization and validation utilities
 * Provides security functions for user input handling
 */

/**
 * Sanitize filename to prevent path traversal and special characters
 * @param fileName - The original filename
 * @returns Sanitized filename safe for storage
 */
export const sanitizeFileName = (fileName: string): string => {
  // Remove path traversal attempts
  let sanitized = fileName.replace(/\.\./g, '');
  
  // Remove path separators
  sanitized = sanitized.replace(/[/\\]/g, '');
  
  // Allow only alphanumeric, dash, underscore, dot, and spaces
  sanitized = sanitized.replace(/[^a-zA-Z0-9._\- ]/g, '_');
  
  // Limit length to 255 characters
  sanitized = sanitized.substring(0, 255);
  
  // Ensure it doesn't start with a dot (hidden file)
  if (sanitized.startsWith('.')) {
    sanitized = '_' + sanitized;
  }
  
  return sanitized || 'unnamed_file';
};

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns True if email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate URL format and protocol
 * @param url - URL to validate
 * @returns True if URL is valid and uses http/https
 */
export const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Sanitize text input to prevent XSS (basic)
 * Note: React already escapes text, but this provides additional safety
 * @param input - User text input
 * @returns Sanitized text
 */
export const sanitizeText = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate and sanitize phone number (Thai format)
 * @param phone - Phone number to validate
 * @returns Sanitized phone number or null if invalid
 */
export const sanitizePhoneNumber = (phone: string): string | null => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Thai phone numbers are 9-10 digits
  if (digits.length >= 9 && digits.length <= 10) {
    return digits;
  }
  
  return null;
};

/**
 * Validate file size
 * @param size - File size in bytes
 * @param maxSizeMB - Maximum allowed size in megabytes
 * @returns True if file size is within limit
 */
export const validateFileSize = (size: number, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size > 0 && size <= maxSizeBytes;
};

/**
 * Validate file type by extension
 * @param fileName - File name to check
 * @param allowedExtensions - Array of allowed extensions (e.g., ['jpg', 'png'])
 * @returns True if file type is allowed
 */
export const validateFileType = (fileName: string, allowedExtensions: string[]): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
};

/**
 * Validate image file type
 * @param fileName - File name to check
 * @returns True if file is an allowed image type
 */
export const validateImageFile = (fileName: string): boolean => {
  return validateFileType(fileName, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']);
};

/**
 * Sanitize and validate coordinates (for map features)
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Object with validated coordinates or null if invalid
 */
export const validateCoordinates = (lat: number, lng: number): { lat: number; lng: number } | null => {
  if (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
  ) {
    return { lat, lng };
  }
  return null;
};

/**
 * Truncate text to maximum length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param ellipsis - Whether to add ellipsis
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number, ellipsis: boolean = true): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + (ellipsis ? '...' : '');
};
