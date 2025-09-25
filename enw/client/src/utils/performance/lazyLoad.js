// lazy-utils.js
import React from 'react';

/**
 * Lazy loading utilities for components and images
 */

// Dynamic import with error handling (error fallback, not loading fallback)
// برای loading از <Suspense fallback={...}/> استفاده کن.
export const lazyLoadComponent = (importFunc, fallback = null) =>
  React.lazy(() =>
    importFunc()
      .then((mod) => mod)
      .catch(() => ({
        default: () => fallback || <div>Error loading component</div>,
      }))
  );

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  // SSR یا مرورگرهای قدیمی
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    callback();
    return null;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // پارامترهای بیشتر برای انعطاف: target, entry, observer
        callback(entry.target, entry, obs);
      }
    });
  }, defaultOptions);

  return observer;
};

// Preload critical resources
export const preloadResource = (href, as = 'script', crossorigin = null) => {
  if (!href || typeof document === 'undefined') return;

  if (document.querySelector(`link[rel="preload"][href="${href}"]`)) {
    return; // Already preloaded
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) link.crossOrigin = crossorigin;

  document.head.appendChild(link);
};

// Font preloading
export const preloadFonts = (fonts = []) => {
  if (typeof document === 'undefined') return;

  fonts.forEach((font) => {
    if (!font?.href) return;

    if (document.querySelector(`link[rel="preload"][href="${font.href}"]`))
      return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font.href;
    link.as = 'font';
    link.type = font.type || 'font/woff2';
    link.crossOrigin = font.crossOrigin || 'anonymous';
    document.head.appendChild(link);
  });
};

// ابزار کمکی: یک‌بار مشاهده و بعد قطع
export const observeOnce = (el, onIntersect, options) => {
  const obs = createIntersectionObserver((target, entry, o) => {
    onIntersect(target, entry);
    if (o && target) o.unobserve(target);
  }, options);

  if (obs && el) obs.observe(el);
  return obs;
};
