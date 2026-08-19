import React from 'react';
import Navbar from '../components/automarket/Navbar';
import Footer from '../components/automarket/Footer';
import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <span className="text-foreground font-medium">Cookie Policy</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: June 2026</p>
        <div className="space-y-6">
          {[
            { title: 'What Are Cookies?', text: 'Cookies are small text files stored on your device when you visit a website. They help us remember your preferences, keep you logged in, and improve your overall experience on AutoMax.' },
            { title: 'How We Use Cookies', text: 'We use cookies to: keep you logged in during your session, remember your search preferences, measure site traffic and performance, and personalise ads and content where applicable.' },
            { title: 'Types of Cookies We Use', text: 'Essential cookies: Required for the site to function correctly. Analytical cookies: Help us understand how visitors use the site (e.g. Google Analytics). Preference cookies: Remember your settings and preferences. Marketing cookies: Used to show relevant advertisements.' },
            { title: 'Third-Party Cookies', text: 'Some cookies on our site are set by third-party services such as Google Analytics, Stripe (for payments), and advertising partners. These parties have their own privacy policies.' },
            { title: 'Managing Cookies', text: 'You can control and delete cookies through your browser settings. Note that disabling cookies may affect the functionality of some parts of AutoMax. You can also manage your preferences via our Manage Cookies page.' },
            { title: 'Contact', text: 'If you have any questions about our cookie policy, please contact us at privacy@automax.ie.' },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-2">{s.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}