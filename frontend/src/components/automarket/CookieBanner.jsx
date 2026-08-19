import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie, ChevronDown, ChevronUp, Shield, BarChart2, Megaphone, Share2 } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'automax_cookie_consent';

const cookieCategories = [
  {
    id: 'essential',
    icon: Shield,
    label: 'Essential Cookies',
    description: 'Required for the website to function. Cannot be disabled.',
    examples: 'Session management, authentication, security tokens.',
    alwaysOn: true,
  },
  {
    id: 'analytics',
    icon: BarChart2,
    label: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.',
    examples: 'Google Analytics — tracks page views, session duration, traffic sources. Retained for 26 months.',
    alwaysOn: false,
  },
  {
    id: 'advertising',
    icon: Megaphone,
    label: 'Advertising & Tracking Cookies',
    description: 'Used to deliver personalised ads relevant to you and your interests.',
    examples: 'Google Ads, remarketing pixels. Set by third-party ad networks. Retained for up to 13 months.',
    alwaysOn: false,
  },
  {
    id: 'social',
    icon: Share2,
    label: 'Social Media & Behaviour Tracking',
    description: 'Track your activity across sites and enable social media features such as sharing buttons.',
    examples: 'Facebook Pixel, TikTok Pixel, LinkedIn Insight Tag. Set by third parties. Retained for up to 90 days.',
    alwaysOn: false,
  },
];

export function getCookieConsent() {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    advertising: false,
    social: false,
  });

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const save = (prefs) => {
    const consent = { decided: true, timestamp: Date.now(), preferences: prefs };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setVisible(false);
  };

  const handleAcceptAll = () => {
    save({ analytics: true, advertising: true, social: true });
  };

  const handleRejectAll = () => {
    save({ analytics: false, advertising: false, social: false });
  };

  const handleSavePreferences = () => {
    save(preferences);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" />

      <div className="relative pointer-events-auto w-full sm:max-w-xl mx-auto sm:rounded-2xl bg-card shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-border">
          <Cookie className="w-6 h-6 text-primary flex-shrink-0" />
          <div className="flex-1">
            <h2 className="text-base font-bold text-foreground">We use cookies</h2>
            <p className="text-xs text-muted-foreground mt-0.5">AutoMax uses cookies to improve your experience and to show you relevant ads.</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-muted-foreground mb-4">
            We use essential cookies to make our site work. With your consent, we also use analytics, advertising and social media cookies to improve your experience and show you personalised ads. You can choose which categories to allow below. You can change your preferences at any time via our{' '}
            <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>.
          </p>

          {/* Toggle details */}
          <button
            onClick={() => setShowDetails(v => !v)}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mb-4"
          >
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showDetails ? 'Hide cookie details' : 'Customise cookie preferences'}
          </button>

          {showDetails && (
            <div className="flex flex-col gap-3 mb-4">
              {cookieCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.id} className="border border-border rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 flex-1">
                        <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{cat.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                          <p className="text-xs text-muted-foreground mt-1 italic">{cat.examples}</p>
                        </div>
                      </div>
                      {cat.alwaysOn ? (
                        <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0">Always on</span>
                      ) : (
                        <button
                          onClick={() => setPreferences(p => ({ ...p, [cat.id]: !p[cat.id] }))}
                          className={`relative w-10 h-6 rounded-full flex-shrink-0 transition-colors ${preferences[cat.id] ? 'bg-primary' : 'bg-muted'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full shadow transition-transform ${preferences[cat.id] ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col gap-2">
          {showDetails && (
            <button
              onClick={handleSavePreferences}
              className="w-full bg-primary text-white font-semibold py-3 rounded-xl text-sm hover:bg-primary/90 transition-colors">
              Save My Preferences
            </button>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleRejectAll}
              className="flex-1 border border-border text-foreground font-semibold py-3 rounded-xl text-sm hover:bg-secondary transition-colors">
              Reject All
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 bg-foreground text-background font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity">
              Accept All
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Essential cookies are always active. See our{' '}
            <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}