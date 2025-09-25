import React, { useState, useRef, useEffect } from 'react';
import { createIntersectionObserver } from '../../../utils/performance/lazyLoad';
import styles from './LazyImage.module.css';

function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderSrc = null,
  blurDataURL = null,
  loading = 'lazy',
  ...props
}) {
  const [imageSrc, setImageSrc] = useState(placeholderSrc || blurDataURL || '');
  const [imageRef, setImageRef] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!imageRef) return;

    // Create intersection observer
    observerRef.current = createIntersectionObserver(
      () => {
        setIsInView(true);
        if (observerRef.current && imageRef) {
          observerRef.current.unobserve(imageRef);
        }
      },
      { rootMargin: '50px' }
    );

    if (observerRef.current && imageRef) {
      observerRef.current.observe(imageRef);
    }

    return () => {
      if (observerRef.current && imageRef) {
        observerRef.current.unobserve(imageRef);
      }
    };
  }, [imageRef]);

  useEffect(() => {
    if (isInView && src) {
      // Preload the actual image
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        console.warn('Failed to load image:', src);
        setIsLoaded(true); // Still mark as loaded to show alt text
      };
      img.src = src;
    }
  }, [isInView, src]);

  const handleRef = (node) => {
    setImageRef(node);
  };

  // Generate responsive srcSet for WebP support
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc) return '';

    const ext = baseSrc.split('.').pop();
    const baseUrl = baseSrc.replace(`.${ext}`, '');

    // In a real app, you'd have different sized images
    return [
      `${baseUrl}-small.webp 400w`,
      `${baseUrl}-medium.webp 800w`,
      `${baseUrl}-large.webp 1200w`,
    ].join(', ');
  };

  return (
    <div
      ref={handleRef}
      className={`${styles.container} ${className}`}
      style={{ width, height }}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          srcSet={isLoaded ? generateSrcSet(src) : undefined}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          className={`
            ${styles.image} 
            ${isLoaded ? styles.loaded : styles.loading}
            ${blurDataURL ? styles.blurred : ''}
          `}
          {...props}
        />
      )}

      {!isLoaded && (
        <div
          className={styles.placeholder}
          style={{ width, height }}
          aria-label={`Loading ${alt}`}
        >
          <div className={styles.spinner}></div>
        </div>
      )}
    </div>
  );
}

export default LazyImage;
