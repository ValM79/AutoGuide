import React, { useState, useRef, useEffect } from 'react';
import { Mail, Link as LinkIcon, Check } from 'lucide-react';

export default function ShareMenu({ onClose, title }) {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      /* fallback */
    }
  };

  const options = [
    {
      label: 'WhatsApp',
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`, '_blank'),
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-2.448 3.378C12.713 19.587 8.274 19.6 5.4 16.727c-2.874-2.874-2.86-7.313.052-10.225C8.465 3.49 12.905 3.49 15.778 6.363c2.873 2.874 2.86 7.313-.052 10.225M16.727 5.4C13.272 1.945 7.626 1.932 4.156 5.4c-3.47 3.47-3.457 9.116.052 12.625 3.47 3.47 9.116 3.457 12.626-.052 3.47-3.47 3.457-9.116-.107-12.578"/></svg>,
    },
    {
      label: 'Facebook',
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank'),
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073"/></svg>,
    },
    {
      label: 'Email',
      onClick: () => window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`, '_blank'),
      icon: <Mail className="w-6 h-6 text-foreground" />,
    },
    {
      label: 'Copy link',
      onClick: handleCopy,
      icon: copied ? <Check className="w-6 h-6 text-green-600" /> : <LinkIcon className="w-6 h-6 text-foreground" />,
    },
    {
      label: 'X',
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank'),
      icon: <svg className="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    },
  ];

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-lg shadow-lg p-4 min-w-[300px]">
      <p className="text-sm text-muted-foreground mb-3 text-center">your favourite social media network</p>
      <div className="flex items-start justify-center gap-3">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={opt.onClick}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-11 h-11 border border-border rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
              {opt.icon}
            </div>
            <span className="text-xs text-foreground">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}