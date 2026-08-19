import React, { useState } from 'react';
import Navbar from '../components/automarket/Navbar';
import Footer from '../components/automarket/Footer';
import { Link } from 'react-router-dom';
import { MapPin, Car, RotateCcw, ChevronDown } from 'lucide-react';

const dealers = [];

const dealerNames = ['All Dealers'];
const makes = [
  'All Makes',
  'Abarth', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW',
  'BYD', 'Cadillac', 'Chevrolet', 'Chrysler', 'Citroen', 'Cupra',
  'Dacia', 'Dodge', 'DS Automobiles', 'Ferrari', 'Fiat', 'Ford',
  'Genesis', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'KGM',
  'Kia', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Maserati',
  'Mazda', 'McLaren', 'Mercedes-Benz', 'MG', 'Mini', 'Mitsubishi',
  'Nissan', 'Opel', 'Peugeot', 'Polestar', 'Porsche', 'Renault',
  'Rolls Royce', 'Saab', 'SEAT', 'Skoda', 'Smart', 'Subaru', 'Suzuki',
  'Tesla', 'Toyota', 'Volkswagen', 'Volvo',
];
const counties = ['All Counties', 'Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Kilkenny', 'Mayo', 'Kerry', 'Clare', 'Tipperary', 'Roscommon', 'Westmeath'];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-muted-foreground'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function SelectDropdown({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none border border-border rounded-lg px-4 py-3 text-sm text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary pr-10"
      >
        <option value="">{placeholder}</option>
        {options.slice(1).map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

export default function Dealers() {
  const [dealerFilter, setDealerFilter] = useState('');
  const [makeFilter, setMakeFilter] = useState('');
  const [countyFilter, setCountyFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState({ dealer: '', make: '', county: '' });

  const handleReset = () => {
    setDealerFilter('');
    setMakeFilter('');
    setCountyFilter('');
    setActiveFilters({ dealer: '', make: '', county: '' });
  };

  const handleSearch = () => {
    setActiveFilters({ dealer: dealerFilter, make: makeFilter, county: '' });
  };

  const filteredDealers = dealers.filter((d) => {
    const matchDealer = !activeFilters.dealer || d.name === activeFilters.dealer;
    const matchMake = !activeFilters.make || d.makes.includes(activeFilters.make);
    const matchCounty = !countyFilter || d.county === countyFilter;
    return matchDealer && matchMake && matchCounty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb + quick links */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <span className="text-foreground">Dealers</span>
        </div>

      </div>

      {/* Hero with search panel */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80"
          alt="Car dealership lot with rows of cars"
          className="w-full h-[420px] object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />

        {/* Search card */}
        <div className="absolute top-1/2 left-[6%] -translate-y-1/2 bg-card rounded-2xl shadow-2xl p-7 w-80">
          <h2 className="text-2xl font-bold text-foreground mb-5">Dealers in Ireland</h2>
          <div className="flex flex-col gap-3">
            <SelectDropdown value={dealerFilter} onChange={setDealerFilter} options={dealerNames} placeholder="Select a dealer name..." />
            <SelectDropdown value={makeFilter} onChange={setMakeFilter} options={makes} placeholder="Select a make..." />
            <SelectDropdown value={countyFilter} onChange={setCountyFilter} options={counties} placeholder="Select a county..." />
          </div>
          <button onClick={handleReset} className="flex items-center gap-1.5 text-sm text-primary mt-3 hover:underline">
            <RotateCcw className="w-3.5 h-3.5" /> Reset Search
          </button>
          <button onClick={handleSearch} className="mt-4 w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Help feedback */}
      <p className="text-foreground text-base text-center mt-4 mb-2">Help us to improve this site: <a href="mailto:Info@automax.ie" className="text-primary hover:underline">Info@automax.ie</a></p>

      {/* Dealer listings */}
      <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-5">
        {filteredDealers.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No dealers found for the selected filters.
          </div>
        )}
        {filteredDealers.map((dealer) => (
          <div key={dealer.name} className="bg-card rounded-xl border border-border shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">

            <img src={dealer.logo} alt={dealer.name} className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-primary mb-1">{dealer.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={dealer.rating} />
                <span className="text-sm font-semibold text-foreground">{dealer.rating}/5</span>
                <span className="text-sm text-muted-foreground">({dealer.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{dealer.location}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <Car className="w-4 h-4 flex-shrink-0" />
                <span>Stock: {dealer.stock}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {dealer.makes.map((make) => (
                  <span key={make} className={`text-xs px-2 py-0.5 rounded-full border ${activeFilters.make === make ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground'}`}>
                    {make}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button className="flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                <Car className="w-4 h-4" /> View Cars
              </button>
              <button className="flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                <Car className="w-4 h-4" /> View Commercials
              </button>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}