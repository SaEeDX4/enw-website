import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header/Header.jsx';
import Footer from '../components/layout/Footer/Footer.jsx';

export default function Layout() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" style={{ minHeight: '60vh' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
