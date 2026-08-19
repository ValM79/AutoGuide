import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

export default function MobileSelect({ value, onChange, options, placeholder, className = '', disabled = false, sizeClass = 'text-sm' }) {
  const [open, setOpen] = useState(false);
  const displayValue = value || placeholder || 'Select...';

  return (
    <>
      {/* Desktop: native select */}
      <div className={`relative hidden md:block ${className}`}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full h-11 appearance-none border border-border rounded-md px-3 ${sizeClass} bg-card hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-primary/40 pr-8 text-foreground transition-colors cursor-pointer disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-card`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>

      {/* Mobile: button that opens bottom drawer */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(true)}
        className={`md:hidden w-full h-11 flex items-center justify-between border border-border rounded-md px-3 ${sizeClass} bg-card text-foreground transition-colors ${className} ${disabled ? 'cursor-not-allowed text-muted-foreground' : ''}`}
      >
        <span className={value ? '' : 'text-muted-foreground'}>{displayValue}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[70vh]">
          <DrawerHeader className="cursor-pointer" onClick={() => setOpen(false)}>
            <DrawerTitle className="flex flex-col items-center gap-0.5 text-foreground">
              Close
              <ChevronDown className="w-4 h-4" />
            </DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-6">
            {placeholder && (
              <button
                type="button"
                onClick={() => { onChange(''); setOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg text-base transition-colors mb-1 ${!value ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-secondary text-foreground'}`}
              >
                {placeholder}
              </button>
            )}
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => { onChange(o); setOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg text-base transition-colors flex items-center justify-between mb-1 ${value === o ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-secondary text-foreground'}`}
              >
                {o}
                {value === o && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}