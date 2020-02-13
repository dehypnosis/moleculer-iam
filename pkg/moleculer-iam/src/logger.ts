export interface Logger {
  error(...args: any[]): void;
  warn(...args: any[]): void;
  info(...args: any[]): void;
  debug(...args: any[]): void;
  trace(...args: any[]): void;
  getLogger?(name: string): Logger;
}

export type LogLevel = "error"|"warn"|"info"|"debug"|"trace";
