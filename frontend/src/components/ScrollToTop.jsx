import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// NOTE: SEO (page titles, meta tags, canonical URLs, JSON-LD structured data)
// is handled by <SeoManager /> in App.jsx.

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}