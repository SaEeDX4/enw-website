// src/pages/index.js - Central lazy loading file
import React, { Suspense } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary/ErrorBoundary';

const LoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      fontSize: 'var(--text-lg)',
      color: 'var(--ink-500)',
    }}
  >
    Loading...
  </div>
);

const PageWrapper = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
  </ErrorBoundary>
);

// Lazy load all pages
export const Home = React.lazy(() => import('./Home/Home'));
export const HowItWorks = React.lazy(() => import('./HowItWorks/HowItWorks'));
export const Seniors = React.lazy(() => import('./Seniors/Seniors'));
export const Volunteers = React.lazy(() => import('./Volunteers/Volunteers'));
export const Partners = React.lazy(() => import('./Partners/Partners'));
export const About = React.lazy(() => import('./About/About'));
export const Donate = React.lazy(() => import('./Donate/Donate'));
export const Blog = React.lazy(() => import('./Blog/Blog'));
export const Post = React.lazy(() => import('./Post/Post'));
export const Contact = React.lazy(() => import('./Contact/Contact'));
export const Privacy = React.lazy(() => import('./Privacy/Privacy'));
export const Terms = React.lazy(() => import('./Terms/Terms'));
export const GetSupport = React.lazy(() => import('./GetSupport/GetSupport'));
export const JoinUs = React.lazy(() => import('./JoinUs/JoinUs'));
export const BecomePartner = React.lazy(
  () => import('./BecomePartner/BecomePartner')
);
export const NotFound = React.lazy(() => import('./NotFound/NotFound'));

// Export wrapper for easy use
export { PageWrapper };
