import React from 'react';
import { Shield, Wallet, FileCheck } from 'lucide-react';

const links = [
  { label: 'Cartell Vehicle Check', icon: FileCheck },
  { label: 'Car Finance', icon: Wallet },
  { label: 'Car Insurance', icon: Shield },
];

export default function QuickLinks() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-3 flex justify-end">
      <div className="flex gap-2">
        {links.map((link) => {
        const isCartell = link.label === 'Cartell Vehicle Check';
        const isCarFinance = link.label === 'Car Finance';
        const isCarInsurance = link.label === 'Car Insurance';
        const href = isCartell ? 'https://cartell.ie' : isCarFinance ? 'https://personalbanking.bankofireland.com/borrow/loans/car-loan/?utm_source=carzone.ie&utm_medium=display_affiliate&utm_campaign=dg_personal-loan_car-loan-carzone-main-nav_08_25&utm_content=CO&dclid=CPTroLPNtJQDFZqHUAYd5IIzHg&gad_source=7&gad_campaignid=22852553722' : isCarInsurance ? 'https://www.axa.ie/insurance/car-insurance' : null;
        
        return (href ? (
          <a
            key={link.label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <link.icon className="w-3.5 h-3.5" />
            {link.label}
          </a>
        ) : (
          <button
            key={link.label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <link.icon className="w-3.5 h-3.5" />
            {link.label}
          </button>
        ));
      })}
      </div>
    </div>
  );
}