/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from '../interfaces';

/**
 * Stub implementation of the Logger interface for CLI use
 **/
export class LoggerStub implements Logger {
  constructor(private readonly loggerContext?: string) {}

  private formatMessage(level: string, message: any, context?: string): string {
    const localContext = context || this.loggerContext || '';
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()}${localContext ? ` [${localContext}]` : ''}: ${message}`;
  }

  error(
    message: any,
    stack?: string | undefined,
    context?: string | undefined,
  ): void;
  error(message: any, ...optionalParams: any[]): void;
  error(
    message: unknown,
    stack?: unknown,
    context?: unknown,
    ...rest: unknown[]
  ): void {
    const localContext = context || this.loggerContext || '';
    console.error(this.formatMessage('ERROR', message, localContext as string));
    if (stack) console.error(stack);
    if (rest.length) console.error(...rest);
  }

  log(message: any, context?: string | undefined): void;
  log(message: any, ...optionalParams: any[]): void;
  log(message: unknown, context?: unknown, ...rest: unknown[]): void {
    const localContext = context || this.loggerContext || '';
    console.log(this.formatMessage('LOG', message, localContext as string));
    if (rest.length) console.log(...rest);
  }

  warn(message: any, context?: string | undefined): void;
  warn(message: any, ...optionalParams: any[]): void;
  warn(message: unknown, context?: unknown, ...rest: unknown[]): void {
    const localContext = context || this.loggerContext || '';
    console.warn(this.formatMessage('WARN', message, localContext as string));
    if (rest.length) console.warn(...rest);
  }

  debug(message: any, context?: string | undefined): void;
  debug(message: any, ...optionalParams: any[]): void;
  debug(message: unknown, context?: unknown, ...rest: unknown[]): void {
    const localContext = context || this.loggerContext || '';
    console.debug(this.formatMessage('DEBUG', message, localContext as string));
    if (rest.length) console.debug(...rest);
  }

  verbose(message: any, context?: string | undefined): void;
  verbose(message: any, ...optionalParams: any[]): void;
  verbose(message: unknown, context?: unknown, ...rest: unknown[]): void {
    const localContext = context || this.loggerContext || '';
    console.log(this.formatMessage('VERBOSE', message, localContext as string));
    if (rest.length) console.log(...rest);
  }

  fatal(message: any, context?: string | undefined): void;
  fatal(message: any, ...optionalParams: any[]): void;
  fatal(message: unknown, context?: unknown, ...rest: unknown[]): void {
    const localContext = context || this.loggerContext || '';
    console.error(this.formatMessage('FATAL', message, localContext as string));
    if (rest.length) console.error(...rest);
  }
}
