/* eslint-disable @typescript-eslint/no-explicit-any */

// subtype of nestjs-style Logger interface
export interface Logger {
  error(message: any, stack?: string, context?: string): void;
  error(message: any, ...optionalParams: [...any, string?, string?]): void;
  log(message: any, context?: string): void;
  log(message: any, ...optionalParams: [...any, string?]): void;
  warn(message: any, context?: string): void;
  warn(message: any, ...optionalParams: [...any, string?]): void;
  debug(message: any, context?: string): void;
  debug(message: any, ...optionalParams: [...any, string?]): void;
  verbose(message: any, context?: string): void;
  verbose(message: any, ...optionalParams: [...any, string?]): void;
  fatal(message: any, context?: string): void;
  fatal(message: any, ...optionalParams: [...any, string?]): void;
}

export const LoggerToken = Symbol('Logger');
