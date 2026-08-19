import React, { useState } from 'react';
import Navbar from '../components/automarket/Navbar';
import Footer from '../components/automarket/Footer';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'How do I place an ad?', a: 'Click "Place Ad" in the top navigation, fill in your vehicle details, choose an ad package and complete payment. Your ad will go live immediately.' },
  { q: 'How long does my ad stay live?', a: 'This depends on the package you choose. Basic runs for 60 days, Standard for 72 days, and Premium for 90 days.' },
  { q: 'How do I edit or delete my ad?', a: 'Go to My Account → My Ads, then click Edit or Delete next to the listing you want to manage.' },
  { q: 'How do I contact a seller?', a: 'On any vehicle listing page, use the "Send Message" button or call the phone number provided by the seller.' },
  { q: 'Is my personal information safe?', a: 'Yes. We never share your personal data with third parties without your consent. Read our Privacy Policy for full details.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit and debit cards via Stripe, our secure payment provider.' },
  { q: 'Can I get a refund on my ad package?', a: 'Please contact our support team within 48 hours of purchase. Refunds are assessed on a case-by-case basis.' },
];

export default function HelpPage() {
  const [open, setOpen] = useState(null);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <span className="text-foreground font-medium">Help</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Help Centre</h1>
        <p className="text-muted-foreground mb-8">Find answers to the most common questions below.</p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-foreground hover:bg-secondary/50 transition-colors">
                {faq.q}
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-sm text-muted-foreground border-t border-border pt-3">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-foreground mb-2">Still need help?</h3>
          <p className="text-muted-foreground text-sm mb-4">Our support team is available Mon–Fri, 9am–5:30pm.</p>
          <Link to="/contact-us" className="bg-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors inline-block">Contact Us</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}