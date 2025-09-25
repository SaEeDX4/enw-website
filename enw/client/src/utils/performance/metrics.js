/**
 * Web Performance Metrics Collection (Vite-friendly)
 */

// Core Web Vitals measurement
export const measureWebVitals = (onPerfEntry) => {
  if (typeof window === 'undefined') return; // guard for SSR/tools
  if (!onPerfEntry || typeof onPerfEntry !== 'function') return;

  // Import web-vitals dynamically to avoid blocking
  import('web-vitals')
    .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    })
    .catch(() => {
      // Fallback manual measurements if web-vitals fails
      measureManually(onPerfEntry);
    });
};

// Manual performance measurements
const measureManually = (callback) => {
  if (typeof performance === 'undefined') return;

  // First Contentful Paint
  const paintEntries = performance.getEntriesByType?.('paint') || [];
  const fcp = paintEntries.find(
    (entry) => entry.name === 'first-contentful-paint'
  );
  if (fcp) {
    callback({ name: 'FCP', value: fcp.startTime });
  }

  // Navigation timing
  const navigation = (performance.getEntriesByType?.('navigation') || [])[0];
  if (navigation) {
    callback({
      name: 'TTI',
      value: navigation.domInteractive - navigation.fetchStart,
    });
  }
};

// Performance observer for monitoring
export const observePerformance = () => {
  if (typeof window === 'undefined') return;
  if (!('PerformanceObserver' in window)) return;

  // Long tasks observer
  try {
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) {
          console.warn('Long task detected:', entry.duration + 'ms');
        }
      });
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  } catch {
    // Not supported in all browsers
  }

  // Layout shift observer
  try {
    const layoutShiftObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.value > 0.1) {
          console.warn('Layout shift detected:', entry.value);
        }
      });
    });
    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
  } catch {
    // Not supported in all browsers
  }
};

/**
 * Bundle size analysis helper
 *
 * NOTE: With Vite, bundle analysis is done at build-time via a Rollup plugin
 * (e.g., rollup-plugin-visualizer). Keeping this function so callers don't break,
 * but it just logs guidance instead of importing webpack-bundle-analyzer.
 */
export const analyzeBundle = () => {
  // Vite env flags
  const isDev = import.meta?.env?.DEV ?? false;
  const mode = import.meta?.env?.MODE ?? 'unknown';

  if (isDev) {
    // In Vite dev, there's no "bundle" to analyze; just guide the developer.
    console.info(
      `[analyzeBundle] Running in DEV (${mode}). Tip: enable the visualizer in vite.config.js:
        import { visualizer } from 'rollup-plugin-visualizer';
        export default defineConfig({
          plugins: [react(), visualizer({ filename: 'bundle-stats.html', template: 'treemap', gzipSize: true })]
        });
      `
    );
  } else {
    // In build/previews, you still analyze via the plugin output file.
    console.info(
      `[analyzeBundle] For Vite builds, open the generated bundle report (e.g., bundle-stats.html).`
    );
  }

  // No-op return to preserve API surface
  return false;
};
