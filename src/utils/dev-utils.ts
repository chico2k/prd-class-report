/**
 * Utility to safely handle development-only features
 * These won't be included in production builds
 */

/**
 * Check if running in development mode
 * Force it to true for now to test the mock data loading
 */
// export const isDevelopment = import.meta.env.DEV;
export const isDevelopment = true; // Force to true for testing

/**
 * Execute a callback only in development mode
 * @param callback Function to execute in development
 */
export function runInDevelopment(callback: () => void): void {
  if (isDevelopment) {
    callback();
  }
}

/**
 * Import mock data conditionally for development
 * Usage:
 * ```
 * // In your component or test
 * import { getMockData } from 'utils/dev-utils';
 *
 * // Later, when you need the data
 * const mockData = await getMockData(() => import('../mockData/data'));
 * ```
 */
//ts-ignore
export function getMockData<T>(importCallback: () => Promise<any>): Promise<T> {
  if (isDevelopment) {
    return importCallback().then((module) => {
      return module.default || module;
    });
  }

  // In production, return an empty object
  return Promise.resolve({} as T);
}
