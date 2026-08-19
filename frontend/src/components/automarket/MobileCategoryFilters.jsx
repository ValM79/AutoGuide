import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function MobileCategoryFilters({ search, onSearchChange, placeholder, children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="lg:hidden mb-5">
        <div className="relative mt-3 mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={onSearchChange}
            placeholder={placeholder}
            className="w-full bg-card rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none border border-border" />
        </div>
        <p className="text-foreground text-base text-center mb-3">Help us to improve this site: <a href="mailto:Info@automax.ie" className="text-primary hover:underline">Info@automax.ie</a></p>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
          <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-primary text-white rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap flex-shrink-0">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto p-0 [&>button]:hidden">
          <div className="sticky top-0 z-10 bg-background" style={{ paddingTop: 'max(env(safe-area-inset-top), 24px)' }}>
            <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-3 space-y-0">
              <SheetTitle className="text-base font-bold">Filters</SheetTitle>
              <button onClick={() => setOpen(false)} className="p-1.5 text-foreground hover:bg-secondary rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </SheetHeader>
          </div>
          <div className="p-4">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}