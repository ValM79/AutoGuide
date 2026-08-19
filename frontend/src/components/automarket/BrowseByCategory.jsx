import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IMG = {
  car: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/cffa66889_generated_image.png',
  newCar: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/700a41555_generated_image.png',
  dealerCars: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/090b1de67_generated_image.png',
  vintageCar: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/5bb219e66_generated_image.png',
  modifiedCar: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/51bdcb5a5_generated_image.png',
  truck: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/cd2b5117c_generated_image.png',
  commercial: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/69c5c7c03_generated_image.png',
  trailer: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/1cf4ce53a_generated_image.png',
  camper: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/11ae06ec9_generated_image.png',
  coachBus: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/b9c3a0c85_generated_image.png',
  plant: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/800664dcf_generated_image.png',
  motorbikeExtras: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/e76a78826_generated_image.png',
  caravan: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/fac88e4c9_generated_image.png',
  motorbike: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/34aa93463_generated_image.png',
  vintageBike: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/78a162d71_generated_image.png',
  scooter: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/684c702eb_generated_image.png',
  quad: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/72d1a5340_generated_image.png',
  boatExtras: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/5687cde59_generated_image.png',
  electricCar: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/4a947c627_generated_image.png',
  boat: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/87a17cb2c_generated_image.png',
  breaking: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/700a41555_generated_image.png',
  rallyCar: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/906d5fa64_generated_image.png',
  carParts: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/3211f3316_generated_image.png',
  carExtras: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/06f7b7968_generated_image.png',
  bicycle: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/8ded1f6ff_generated_image.png',
  otherItems: 'https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/c3b58389b_generated_image.png',
};

const categories = [
[
{ label: 'Cars', imgKey: 'newCar' },
{ label: 'New Cars', imgKey: 'car' },
{ label: 'Dealership Cars', imgKey: 'dealerCars' },
{ label: 'Electric & Hybrid Cars', imgKey: 'electricCar' },
{ label: 'Vintage Cars', imgKey: 'vintageCar' },
{ label: 'Modified Cars', imgKey: 'modifiedCar' },
{ label: 'Rally Cars', imgKey: 'rallyCar' },
{ label: 'Breaking & Repairables', imgKey: 'breaking' },
{ label: 'Car Parts', imgKey: 'carParts' },
{ label: 'Car Extras', imgKey: 'carExtras' },
],
[
{ label: 'Commercials', imgKey: 'commercial', highlight: true },
{ label: 'Campers', imgKey: 'camper' },
{ label: 'Caravans', imgKey: 'caravan' },
{ label: 'Trucks', imgKey: 'truck' },
{ label: 'Trailers', imgKey: 'trailer' },
{ label: 'Coaches & Buses', imgKey: 'coachBus' },
{ label: 'Plant Machinery', imgKey: 'plant', highlight: true },
{ label: 'Boats & Jet Skis', imgKey: 'boat' },
{ label: 'Boat Extras', imgKey: 'boatExtras' },
],
[
{ label: 'Motorbikes', imgKey: 'motorbike', highlight: true },
{ label: 'Motorbike Extras', imgKey: 'motorbikeExtras' },
{ label: 'Vintage Bikes', imgKey: 'vintageBike' },
{ label: 'Scooters', imgKey: 'scooter' },
{ label: 'Quads', imgKey: 'quad', highlight: true },
{ label: 'Bikes & Bicycles', imgKey: 'bicycle', highlight: true },
{ label: 'Other items', isOther: true },
]];

function CategoryIcon({ imgKey, isAllMotor, isOther }) {
  if (isAllMotor) {
    return (
      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-lg">D</span>
      </div>);
  }
  if (isOther) {
    return (
      <div className="w-12 h-9 flex items-center justify-center flex-shrink-0 bg-card rounded">
        <img src={IMG.otherItems} alt="" className="max-w-full max-h-full object-contain" />
      </div>);
  }
  return (
    <div className="w-12 h-9 flex items-center justify-center flex-shrink-0 bg-card rounded">
      <img src={IMG[imgKey]} alt="" className="max-w-full max-h-full object-contain" />
    </div>);
}

function CategoryRow({ label, imgKey, highlight, isAllMotor, isOther }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (label === 'New Cars') navigate('/new-cars');
    if (label === 'Cars') navigate('/cars-for-sale');
    if (label === 'Dealership Cars') navigate('/dealership-cars');
    if (label === 'Electric & Hybrid Cars') navigate('/electric-hybrid-cars');
    if (label === 'Vintage Cars') navigate('/vintage-cars');
    if (label === 'Modified Cars') navigate('/modified-cars');
    if (label === 'Car Parts') navigate('/car-parts');
    if (label === 'Car Extras') navigate('/car-extras');
    if (label === 'Rally Cars') navigate('/rally-cars');
    if (label === 'Breaking & Repairables') navigate('/breaking-repairables');
    if (label === 'Trucks') navigate('/trucks');
    if (label === 'Trailers') navigate('/trailers');
    if (label === 'Campers') navigate('/campers');
    if (label === 'Coaches & Buses') navigate('/coaches-buses');
    if (label === 'Plant Machinery') navigate('/plant-machinery');
    if (label === 'Motorbike Extras') navigate('/motorbike-extras');
    if (label === 'Motorbikes') navigate('/motorbikes');
    if (label === 'Vintage Bikes') navigate('/vintage-bikes');
    if (label === 'Scooters') navigate('/scooters');
    if (label === 'Quads') navigate('/quads');
    if (label === 'Caravans') navigate('/caravans');
    if (label === 'Boats & Jet Skis') navigate('/boats');
    if (label === 'Boat Extras') navigate('/boat-extras');
    if (label === 'Other items') navigate('/other-motor');
    if (label === 'Commercials') navigate('/commercials');
    if (label === 'Bikes & Bicycles') navigate('/bikes-bicycles');
  };

  return (
    <button onClick={handleClick} className="flex items-center justify-between w-full py-2.5 border-b border-border last:border-0 hover:bg-secondary/40 px-2 rounded transition-colors group">
      <div className="flex items-center gap-3">
        <CategoryIcon imgKey={imgKey} isAllMotor={isAllMotor} isOther={isOther} />
        <span className="text-[hsl(var(--foreground))] text-sm font-medium">
          {label}
        </span>
      </div>

    </button>);
}

export default function BrowseByCategory() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Search by category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((col, i) =>
        <div key={i} className="flex flex-col">
            {col.map((cat) =>
          <CategoryRow key={cat.label} {...cat} />
          )}
          </div>
        )}
      </div>
    </section>);
}