/**
 * Structured logging utility for the application
 * In development: logs to console
 * In production: only logs errors (can be extended to send to logging service)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  
  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    };
    
    if (this.isDevelopment) {
      // Console logging in development
      const logFn = console[level] || console.log;
      const contextStr = context ? JSON.stringify(context, null, 2) : '';
      const errorStr = error ? `\n${error.stack || error.message}` : '';
      logFn(`[${level.toUpperCase()}] ${message}`, contextStr, errorStr);
    } else {
      // In production, only log errors and warnings
      if (level === 'error' || level === 'warn') {
        console[level](JSON.stringify(entry));
        // TODO: Send to Firebase Analytics or Cloud Logging
        // analytics.logEvent('error', { message, context, error: error?.message });
      }
    }
  }
  
  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }
  
  /**
   * Log informational messages (development only)
   */
  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }
  
  /**
   * Log warnings (shown in production)
   */
  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }
  
  /**
   * Log errors (always shown)
   */
  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error);
  }
}

export const logger = new Logger();

/**
 * Usage examples:
 * 
 * logger.debug('Fetching user data', { userId: '123' });
 * logger.info('User logged in', { email: user.email });
 * logger.warn('API rate limit approaching', { remaining: 10 });
 * logger.error('Failed to save data', error, { userId: '123', action: 'save' });
 */
