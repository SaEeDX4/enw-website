import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SkipLink from './components/layout/SkipLink/SkipLink';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Toast from './components/ui/Toast/Toast';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';

// Import lazy-loaded pages
import {
  Home,
  HowItWorks,
  Seniors,
  Volunteers,
  Partners,
  About,
  Donate,
  Blog,
  Post,
  Contact,
  Privacy,
  Terms,
  GetSupport,
  JoinUs,
  BecomePartner,
  NotFound,
  PageWrapper,
} from './pages';

import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <SkipLink />
      <Header />
      <main id="main-content" className={styles.main}>
        <ErrorBoundary>
          <Routes>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/how-it-works"
              element={
                <PageWrapper>
                  <HowItWorks />
                </PageWrapper>
              }
            />
            <Route
              path="/seniors"
              element={
                <PageWrapper>
                  <Seniors />
                </PageWrapper>
              }
            />
            <Route
              path="/seniors/get-support"
              element={
                <PageWrapper>
                  <GetSupport />
                </PageWrapper>
              }
            />
            <Route
              path="/volunteers"
              element={
                <PageWrapper>
                  <Volunteers />
                </PageWrapper>
              }
            />
            <Route
              path="/volunteers/join-us"
              element={
                <PageWrapper>
                  <JoinUs />
                </PageWrapper>
              }
            />
            <Route
              path="/partners"
              element={
                <PageWrapper>
                  <Partners />
                </PageWrapper>
              }
            />
            <Route
              path="/partners/become-partner"
              element={
                <PageWrapper>
                  <BecomePartner />
                </PageWrapper>
              }
            />
            <Route
              path="/about"
              element={
                <PageWrapper>
                  <About />
                </PageWrapper>
              }
            />
            <Route
              path="/support-us"
              element={
                <PageWrapper>
                  <Donate />
                </PageWrapper>
              }
            />
            <Route
              path="/news"
              element={
                <PageWrapper>
                  <Blog />
                </PageWrapper>
              }
            />
            <Route
              path="/news/:slug"
              element={
                <PageWrapper>
                  <Post />
                </PageWrapper>
              }
            />
            <Route
              path="/contact"
              element={
                <PageWrapper>
                  <Contact />
                </PageWrapper>
              }
            />
            <Route
              path="/privacy"
              element={
                <PageWrapper>
                  <Privacy />
                </PageWrapper>
              }
            />
            <Route
              path="/terms"
              element={
                <PageWrapper>
                  <Terms />
                </PageWrapper>
              }
            />
            <Route
              path="*"
              element={
                <PageWrapper>
                  <NotFound />
                </PageWrapper>
              }
            />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

export default App;
