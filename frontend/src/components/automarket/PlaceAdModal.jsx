import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  'Used Car', 'New Car', 'Motorbike', 'Truck', 'Van / Commercial',
  'Camper', 'Boat', 'Caravan', 'Quad', 'Other'
];

export default function PlaceAdModal({ onClose }) {
  const [form, setForm] = useState({
    title: '', category: '', make: '', model: '', year: '', price: '', description: '', contact: ''
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder – wire up to entity/backend later
    alert('Ad submitted successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-foreground">Place Your Ad</h2>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Ad Title *</label>
            <input
              required
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. 2021 Toyota Corolla 1.8 Hybrid"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category *</label>
            <select
              required
              value={form.category}
              onChange={set('category')}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Make</label>
              <input
                value={form.make}
                onChange={set('make')}
                placeholder="e.g. Toyota"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Model</label>
              <input
                value={form.model}
                onChange={set('model')}
                placeholder="e.g. Corolla"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Year</label>
              <input
                type="number"
                min="1900"
                max="2026"
                value={form.year}
                onChange={set('year')}
                placeholder="e.g. 2021"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Price (€)</label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={set('price')}
                placeholder="e.g. 15000"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={set('description')}
              placeholder="Describe your vehicle..."
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Contact (phone / email) *</label>
            <input
              required
              value={form.contact}
              onChange={set('contact')}
              placeholder="e.g. 087 123 4567"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground">
              Submit Ad
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}