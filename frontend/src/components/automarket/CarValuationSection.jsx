import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileSelect from './MobileSelect';

export default function CarValuationSection() {
  const [registration, setRegistration] = useState('');
  const [odometer, setOdometer] = useState('');
  const [unit, setUnit] = useState('km');

  const handleSubmit = () => {
    // Handle valuation submission
    console.log({ registration, odometer, unit });
  };

  return (
    <section className="bg-muted py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-card rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-1">How much is my car worth?</h2>
            <p className="text-sm text-muted-foreground">
              In partnership with <span className="font-semibold text-foreground">Allianz</span>
            </p>
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="e.g 191WX1234"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="text"
              placeholder="e.g 45,000"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="min-w-[90px]">
              <MobileSelect
                value={unit}
                onChange={setUnit}
                options={['km', 'miles']}
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="bg-foreground hover:bg-foreground/90 text-background font-semibold px-6 whitespace-nowrap"
            >
              Get my free valuation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}