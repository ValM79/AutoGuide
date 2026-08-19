import React, { useState, useRef, useEffect } from 'react';
import MobileSelect from './MobileSelect';
import { Button } from '@/components/ui/button';
import { Search, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3';

const makes = ['AC', 'Abarth', 'Alfa Romeo', 'Alpine', 'Aston Martin', 'Audi', 'Austin', 'BMW', 'BYD', 'Bentley', 'Cadillac', 'Chevrolet', 'Chrysler', 'Citroen', 'Cupra', 'Dacia', 'Daihatsu', 'DFSK', 'DS Automobiles', 'Daimler', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 'GWM', 'Geely', 'Genesis', 'Holden', 'Honda', 'Hummer', 'Hyundai', 'INEOS', 'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'KGM', 'Kia', 'Lancia', 'Land Rover', 'Leapmotor', 'Lexus', 'Lotus', 'MG', 'MINI', 'Maserati', 'Maxus', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Mitsubishi', 'Morgan', 'Nissan', 'Opel', 'Peugeot', 'Polestar', 'Porsche', 'Renault', 'Rolls-Royce', 'Rover', 'SEAT', 'Saab', 'Skoda', 'Skywell', 'Smart', 'Ssangyong', 'Subaru', 'Suzuki', 'Talbot', 'Tesla', 'Toyota', 'Vauxhall', 'Volkswagen', 'Volvo', 'Xpeng'];

const modelsByMake = {
  'Alfa Romeo': ['Giulia', 'Giulietta', 'Mito', 'Stelvio', 'Tonale'],
  'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'e-tron', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT'],
  'BMW': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '7 Series', 'i3', 'i4', 'iX', 'M3', 'M5', 'X1', 'X3', 'X5', 'X6', 'Z4'],
  'Citroen': ['Berlingo', 'C1', 'C3', 'C3 Aircross', 'C4', 'C5 Aircross', 'C5 X', 'SpaceTourer'],
  'Dacia': ['Duster', 'Jogger', 'Logan', 'Sandero', 'Spring'],
  'DS Automobiles': ['DS 3 Crossback', 'DS 4', 'DS 7 Crossback', 'DS 9'],
  'Fiat': ['500', '500X', 'Doblo', 'Panda', 'Tipo'],
  'Ford': ['C-Max', 'EcoSport', 'Fiesta', 'Focus', 'Galaxy', 'Ka+', 'Kuga', 'Mondeo', 'Mustang', 'Puma', 'Ranger', 'S-Max', 'Transit'],
  'Honda': ['Accord', 'Civic', 'CR-V', 'HR-V', 'Jazz'],
  'Hyundai': ['Bayon', 'i10', 'i20', 'i30', 'i40', 'Ioniq 5', 'Ioniq 6', 'Kona', 'Santa Fe', 'Tucson'],
  'Jaguar': ['E-Pace', 'F-Pace', 'F-Type', 'I-Pace', 'XE', 'XF'],
  'Jeep': ['Cherokee', 'Compass', 'Grand Cherokee', 'Renegade', 'Wrangler'],
  'Kia': ['Carens', 'Ceed', 'EV6', 'Niro', 'Picanto', 'Rio', 'Sorento', 'Sportage', 'Stonic', 'XCeed'],
  'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Freelander', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar'],
  'Lexus': ['CT', 'ES', 'IS', 'NX', 'RX', 'UX'],
  'Mazda': ['2', '3', '6', 'CX-3', 'CX-30', 'CX-5', 'MX-5'],
  'Mercedes-Benz': ['A-Class', 'B-Class', 'C-Class', 'CLA', 'E-Class', 'EQA', 'EQC', 'G-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'S-Class', 'Sprinter', 'V-Class', 'Vito'],
  'MG': ['MG3', 'MG4', 'MG5', 'HS', 'ZS'],
  'Mini': ['Clubman', 'Convertible', 'Cooper', 'Countryman', 'Electric', 'Hatch'],
  'Mitsubishi': ['ASX', 'Eclipse Cross', 'L200', 'Outlander'],
  'Nissan': ['Juke', 'Leaf', 'Micra', 'Navara', 'Note', 'Qashqai', 'X-Trail'],
  'Opel': ['Astra', 'Corsa', 'Crossland', 'Grandland', 'Insignia', 'Meriva', 'Mokka', 'Vivaro', 'Zafira'],
  'Peugeot': ['108', '2008', '208', '3008', '308', '408', '5008', '508', 'Partner', 'Rifter'],
  'Porsche': ['911', 'Boxster', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
  'Renault': ['Captur', 'Clio', 'Kadjar', 'Kangoo', 'Megane', 'Scenic', 'Zoe'],
  'Seat': ['Arona', 'Ateca', 'Ibiza', 'Leon', 'Tarraco'],
  'Skoda': ['Enyaq', 'Fabia', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia', 'Scala', 'Superb'],
  'Subaru': ['Forester', 'Impreza', 'Outback', 'XV'],
  'Suzuki': ['Ignis', 'Jimny', 'Swift', 'Vitara'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y'],
  'Toyota': ['Alphard', 'Altezza', 'Aqua', 'Auris', 'Avensis', 'Aygo', 'Aygo X', 'bZ4X', 'C-HR', 'C-HR+', 'Camry', 'Carina', 'Celica', 'Celsior', 'Century', 'Chaser', 'Corolla', 'Corolla Cross', 'Cresta', 'Crown', 'Dyna', 'Estima', 'GR Yaris', 'GR86', 'GT86', 'Harrier', 'HiAce', 'Highlander', 'Hilux', 'iQ', 'Land Cruiser', 'Levin', 'LiteAce', 'Mark II', 'MR2', 'Noah', 'Passo', 'Porte', 'Prius', 'Proace', 'Ractis', 'Raize', 'RAV4', 'Sienta', 'Soarer', 'Starlet', 'Supra', 'Urban Cruiser', 'Vellfire', 'Verso', 'Verso-S', 'Vitz', 'Voxy', 'Wish', 'Yaris', 'Yaris Cross'],
  'Vauxhall': ['Astra', 'Corsa', 'Crossland', 'Grandland', 'Insignia', 'Mokka'],
  'Volkswagen': ['Caddy', 'Golf', 'ID.3', 'ID.4', 'Passat', 'Polo', 'T-Cross', 'T-Roc', 'Tiguan', 'Touareg', 'Transporter', 'up!'],
  'Volvo': ['S60', 'S90', 'V40', 'V60', 'V90', 'XC40', 'XC60', 'XC90'],
  'AC': ['Cobra', 'Ace', 'Aceca'],
  'Alpine': ['A110', 'A310', 'A610', 'GTA', 'Sunbeam'],
  'Austin': ['Mini', 'Seven', 'A35', 'A40', 'Maxi', 'Allegro', 'Maestro', 'Montego', 'Metro'],
  'Daihatsu': ['Sirion', 'Terios', 'Copen', 'Charade', 'Move', 'Materia', 'Cuore', 'YRV', 'Coo'],
  'DFSK': ['E5', 'EC35', 'Fengon 600', 'Glory 500', 'Glory i-Auto'],
  'Daimler': ['Sovereign', 'V8', 'Double Six', 'SP250', 'Conquest', 'XJ6', 'XJ40'],
  'GWM': ['Haval H6', 'Haval Jolion', 'Haval H2', 'Ora 03', 'Ora Cat', 'Tank 300', 'Tank 500', 'Wey 05'],
  'Geely': ['Coolray', 'Emgrand', 'Atlas', 'Geometry C', 'Tugella', 'Monjaro', 'Galaxy'],
  'Holden': ['Astra', 'Commodore', 'Captiva', 'Barina', 'Colorado', 'Cruze'],
  'Hummer': ['H2', 'H3', 'H1'],
  'INEOS': ['Grenadier', 'Grenadier Quartermaster'],
  'Isuzu': ['D-Max', 'Mu-X', 'Trooper'],
  'LDV': ['T60', 'G10', 'V80', 'Evora', 'Deliver 9'],
  'LEVC': ['TX', 'VN5'],
  'Lancia': ['Ypsilon', 'Delta', 'Thema', 'Musa', 'Phedra'],
  'Leapmotor': ['T03', 'C11', 'C01'],
  'Lotus': ['Elise', 'Exige', 'Evora', 'Emira', 'Eletre'],
  'Maxus': ['Euniq 6', 'Deliver', 'G10', 'V90', 'Mifa 9', 'Mifa 7'],
  'Morgan': ['3 Wheeler', 'Plus 4', 'Plus 6', 'Roadster', 'Aero'],
  'Rover': ['200', '400', '600', '800', '25', '45', '75', 'Streetwise', 'Metro', 'Mini'],
  'Ssangyong': ['Korando', 'Rexton', 'Tivoli', 'Musso', 'Turismo', 'XLV'],
  'Skywell': ['BE11', 'ET5'],
  'Talbot': ['Samba', 'Alpine', 'Horizon', 'Solara', 'Tagora'],
  'Xpeng': ['G3', 'P5', 'P7', 'G9']
};

const bodyTypes = ['Convertible', 'Coupe', 'Estate', 'Hatchback', 'MPV', 'Pickup', 'Saloon', 'SUV', 'Van'];
const years = Array.from({ length: 2026 - 1900 + 1 }, (_, i) => String(2026 - i));
const prices = [100, 300, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 17500, 20000, 22500, 25000, 27500, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000].map((p) => p === 0 ? '€0' : `€${p.toLocaleString()}`);

function MakeInput({ value, onChange }) {
  const [showInput, setShowInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (showInput && inputRef.current) inputRef.current.focus();
  }, [showInput]);

  const handleClear = () => {
    setShowInput(false);
    setCustomValue('');
    onChange('');
  };

  if (showInput) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={customValue}
          onChange={(e) => {setCustomValue(e.target.value);onChange(e.target.value);}}
          placeholder="Type make..."
          className="h-11 w-full bg-card hover:bg-secondary border border-border rounded-md px-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors" />
        
        <button onClick={handleClear} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>);

  }

  return (
    <MobileSelect
      value={value}
      onChange={(v) => {
        if (v === 'Other') {setShowInput(true);onChange('');} else
        {onChange(v);}
      }}
      options={[...makes, 'Other']}
      placeholder="Make" />);


}

function ModelInput({ selectedMake, value, onChange }) {
  const [showInput, setShowInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const inputRef = useRef(null);
  const models = selectedMake ? modelsByMake[selectedMake] || [] : [];

  useEffect(() => {
    if (showInput && inputRef.current) inputRef.current.focus();
  }, [showInput]);

  const handleClear = () => {
    setShowInput(false);
    setCustomValue('');
    onChange('');
  };

  if (showInput) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={customValue}
          onChange={(e) => {setCustomValue(e.target.value);onChange(e.target.value);}}
          placeholder="Type model..."
          className="h-11 w-full bg-card hover:bg-secondary border border-border rounded-md px-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors" />
        
        <button onClick={handleClear} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>);

  }

  if (!selectedMake) {
    return (
      <div className="h-11 flex items-center justify-between border border-border rounded-md px-3 text-sm bg-card text-muted-foreground opacity-50 cursor-not-allowed">
        <span>Model</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </div>);

  }

  return (
    <MobileSelect
      value={value}
      onChange={(v) => {
        if (v === 'Other') {setShowInput(true);onChange('');} else
        {onChange(v);}
      }}
      options={[...models, 'Other']}
      placeholder="Model" />);


}

export default function HeroSearch() {
  const navigate = useNavigate();
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [resetKey, setResetKey] = useState(0);

  const handleClearAll = () => {
    setSelectedMake('');
    setSelectedModel('');
    setMinYear('');
    setMaxYear('');
    setMinPrice('');
    setMaxPrice('');
    setBodyType('');
    setResetKey((k) => k + 1);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedMake) params.set('make', selectedMake);
    if (selectedModel) params.set('model', selectedModel);
    if (minYear) params.set('minYear', minYear);
    if (maxYear) params.set('maxYear', maxYear);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bodyType) params.set('bodyType', bodyType);
    navigate(`/cars-for-sale?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={HERO_IMAGE} alt="Family with blue car" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md bg-[hsl(var(--background))]">
            <div className="flex items-center justify-between mb-5">
              <h1 className="font-normal underline normal-case text-[hsl(var(--foreground))] text-base md:text-base">Cars Search</h1>
              <button onClick={handleClearAll} className="hover:text-primary transition-colors flex items-center gap-1 text-[hsl(var(--foreground))] text-base">
                <X className="w-3 h-3" /> Clear
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3" key={resetKey}>
              <MakeInput value={selectedMake} onChange={(v) => {setSelectedMake(v);setSelectedModel('');}} />
              <ModelInput selectedMake={selectedMake} value={selectedModel} onChange={setSelectedModel} />

              <MobileSelect value={minYear} onChange={setMinYear} options={years} placeholder="Min Year" />
              <MobileSelect value={maxYear} onChange={setMaxYear} options={years} placeholder="Max Year" />
              <MobileSelect value={minPrice} onChange={setMinPrice} options={prices} placeholder="Min Price" />
              <MobileSelect value={maxPrice} onChange={setMaxPrice} options={prices} placeholder="Max Price" />
              <MobileSelect value={bodyType} onChange={setBodyType} options={bodyTypes} placeholder="Body Type" />

              <Button onClick={handleSearch} className="bg-primary px-4 text-sm font-semibold rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap h-11 hover:bg-primary/90 text-primary-foreground">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>);
}