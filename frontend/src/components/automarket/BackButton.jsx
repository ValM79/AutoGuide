import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation, useNavigationType } from 'react-router-dom';

// Module-level navigation depth tracker — persists across component
// mount/unmount cycles, mirroring the router's internal history stack
// without relying on window.history.length (unreliable in WebViews).
let navDepth = 0;

/**
 * Safe back navigation button.
 * Uses React Router's navigation context (useNavigationType) to track
 * whether there's a previous SPA route to return to. Falls back to the
 * home route when the current page was loaded directly (e.g. deep-linked
 * URL in an Android WebView) so the user is never stranded.
 */
export default function BackButton({ fallback = '/', className = 'flex items-center gap-1 hover:text-primary transition-colors' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType === 'PUSH') {
      navDepth += 1;
    } else if (navType === 'POP') {
      navDepth = Math.max(0, navDepth - 1);
    }
    // REPLACE keeps the same depth
  }, [navType, location.key]);

  const handleBack = () => {
    if (navDepth > 0) {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
  };

  return (
    <button onClick={handleBack} className={className}>
      <ArrowLeft className="w-3.5 h-3.5" /> Back
    </button>
  );
}