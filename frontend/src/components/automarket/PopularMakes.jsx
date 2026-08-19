import React from 'react';

const makes = [
  { name: 'Volkswagen', count: '6,746' },
  { name: 'BMW', count: '4,677' },
  { name: 'Audi', count: '4,385' },
  { name: 'Toyota', count: '4,010' },
  { name: 'Mercedes-Benz', count: '3,722' },
  { name: 'Hyundai', count: '3,421' },
  { name: 'Ford', count: '2,946' },
  { name: 'Kia', count: '2,802' },
  { name: 'Skoda', count: '2,619' },
  { name: 'Nissan', count: '2,584' },
  { name: 'Renault', count: '2,020' },
  { name: 'Peugeot', count: '2,017' },
];

export default function PopularMakes() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
        Search by Make
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {makes.map((make) => (
          <button
            key={make.name}
            className="flex flex-col items-center justify-center bg-card rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
              <span className="text-primary font-bold text-sm">{make.name[0]}</span>
            </div>
            <span className="text-xs font-semibold text-foreground text-center leading-tight">{make.name}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">{make.count} cars</span>
          </button>
        ))}
      </div>
    </section>
  );
}