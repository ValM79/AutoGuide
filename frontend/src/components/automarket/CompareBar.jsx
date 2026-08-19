import React from 'react';
import { X, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CompareBar({ cars, onRemove, onCompare, onClear }) {
  if (cars.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-foreground text-background shadow-2xl border-t-2 border-primary">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          <span className="text-sm font-semibold text-white/70 shrink-0">Compare ({cars.length}/4):</span>
          {cars.map((car) => (
            <div
              key={car.id}
              className="flex items-center gap-2 bg-card/10 rounded-lg px-3 py-1.5 shrink-0"
            >
              <span className="text-sm font-medium text-white whitespace-nowrap">
                {car.year} {car.name}
              </span>
              <button
                onClick={() => onRemove(car.id)}
                className="text-white/50 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClear}
            className="text-xs text-white/50 hover:text-white transition-colors min-h-[44px] flex items-center"
          >
            Clear all
          </button>
          <Button
            onClick={onCompare}
            disabled={cars.length < 2}
            className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg h-9 px-5 text-sm"
          >
            <GitCompare className="w-4 h-4 mr-1.5" />
            Compare {cars.length} Cars
          </Button>
        </div>
      </div>
    </div>
  );
}