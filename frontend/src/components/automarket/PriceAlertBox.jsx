import React, { useState } from 'react';
import { Bell, Mail, CheckCircle } from 'lucide-react';

export default function PriceAlertBox({ car }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mt-4">
      <div className="flex items-center gap-2 mb-1">
        <Bell className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-bold text-foreground">Price Drop Alert</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Get notified by email if the price of this {car?.title || 'vehicle'} drops.
      </p>

      {submitted ? (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-xs font-medium">You're set! We'll email you if the price drops.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="your@email.com"
              className={`w-full border rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 bg-card ${error ? 'border-destructive' : 'border-amber-200'}`}
            />
          </div>
          {error && <p className="text-xs text-destructive">⚠ {error}</p>}
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-xl text-sm transition-colors">
            Notify Me
          </button>
        </form>
      )}
    </div>
  );
}