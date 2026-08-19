import React, { useState, useEffect } from 'react';
import Navbar from '../components/automarket/Navbar';
import Footer from '../components/automarket/Footer';
import { Link } from 'react-router-dom';
import { Shield, BarChart2, Megaphone, Share2 } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'automax_cookie_consent';

const cookieTypes = [
  { id: 'essential', icon: Shield, label: 'Essential Cookies', desc: 'Required for the site to function properly. These cannot be disabled.', locked: true },
  { id: 'analytics', icon: BarChart2, label: 'Analytics Cookies', desc: 'Help us understand how visitors use AutoMax (e.g. Google Analytics). Data is anonymised. Retained for 26 months.' },
  { id: 'advertising', icon: Megaphone, label: 'Advertising & Tracking Cookies', desc: 'Used to show you relevant ads and measure ad campaign effectiveness. Set by third-party ad networks. Retained up to 13 months.' },
  { id: 'social', icon: Share2, label: 'Social Media & Behaviour Tracking', desc: 'Track your activity across sites and enable social sharing buttons (e.g. Facebook Pixel, TikTok Pixel). Set by third parties. Retained up to 90 days.' },
];

export default function ManageCookies() {
  const [prefs, setPrefs] = useState({ analytics: false, advertising: false, social: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (stored) {
        const consent = JSON.parse(stored);
        if (consent.preferences) setPrefs(consent.preferences);
      }
    } catch {}
  }, []);

  const toggle = (id) => setPrefs(p => ({ ...p, [id]: !p[id] }));

  const handleSave = () => {
    const consent = { decided: true, timestamp: Date.now(), preferences: prefs };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleWithdraw = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <span className="text-foreground font-medium">Manage Cookies</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Manage Cookie Preferences</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Control which cookies AutoMax can use on your device. Essential cookies cannot be disabled as they are required for the site to work. You can withdraw or change your consent at any time.
        </p>

        <div className="space-y-4 mb-8">
          {cookieTypes.map(c => {
            const Icon = c.icon;
            const isOn = c.locked ? true : prefs[c.id];
            return (
              <div key={c.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{c.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
                  </div>
                </div>
                {c.locked ? (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0 mt-1">Always on</span>
                ) : (
                  <button
                    onClick={() => toggle(c.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-1 cursor-pointer ${isOn ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full shadow transition-transform ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {saved && (
          <div className="mb-4 bg-accent/10 border border-accent/20 text-accent text-sm font-medium px-4 py-3 rounded-xl">
            ✓ Your cookie preferences have been saved.
          </div>
        )}

        <button onClick={handleSave} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors mb-3">
          Save Preferences
        </button>

        <button
          onClick={handleWithdraw}
          className="w-full border border-border text-foreground font-semibold py-3 rounded-xl hover:bg-secondary transition-colors text-sm">
          Withdraw All Consent (resets banner)
        </button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Read our full <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link> and <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </div>
      <Footer />
    </div>
  );
}