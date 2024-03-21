/**
 * Represents the config.
 */
export interface Config {
  start?: number;
  limit?: number;
  requestHeaders?: Record<string, string>;
  requestSize?: number;
  itunes?: boolean;
}
