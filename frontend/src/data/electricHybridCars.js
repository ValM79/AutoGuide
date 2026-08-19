// Shared electric & hybrid car listings — used by ElectricHybridCars, CarsForSale, and CarsByMake.
// IDs are offset to 9000+ to avoid collisions when merged with page-specific static listings.
export const electricHybridCars = [
  { id: 9001, spotlight: true, sellerType: 'Private Seller', title: 'Tesla Model 3', year: 2021, fuel: 'Electric', mileage: '25,000 km', location: 'Dublin', price: 42000, monthly: 710, photos: 20, image: 'https://images.unsplash.com/photo-1560958089-b8a63019b834?w=600&q=80' },
  { id: 9002, spotlight: true, sellerType: 'Dealership', title: 'Toyota Prius', year: 2020, fuel: '1.8 Hybrid', mileage: '38,000 km', location: 'Cork', price: 26500, monthly: 450, photos: 17, image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80' },
  { id: 9003, spotlight: false, sellerType: 'Dealership', title: 'BMW i4', year: 2021, fuel: 'Electric', mileage: '22,000 km', location: 'Galway', price: 55000, monthly: 930, photos: 22, image: 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=600&q=80' },
  { id: 9004, spotlight: false, sellerType: 'Dealership', title: 'Nissan Leaf', year: 2020, fuel: 'Electric', mileage: '31,500 km', location: 'Limerick', price: 28900, monthly: 490, photos: 15, image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80' },
  { id: 9005, spotlight: false, sellerType: 'Dealership', title: 'Hyundai Ioniq Hybrid', year: 2019, fuel: '1.6 Hybrid', mileage: '58,200 km', location: 'Waterford', price: 21800, monthly: 370, photos: 12, image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=600&q=80' },
  { id: 9006, spotlight: true, sellerType: 'Dealership', title: 'Audi e-tron', year: 2022, fuel: 'Electric', mileage: '18,000 km', location: 'Dublin', price: 62000, monthly: 1050, photos: 24, image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&q=80' },
  { id: 9007, spotlight: false, sellerType: 'Dealership', title: 'Honda Insight Hybrid', year: 2021, fuel: '1.5 Hybrid', mileage: '29,000 km', location: 'Wexford', price: 24500, monthly: 415, photos: 14, image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=600&q=80' },
];

// Returns the electric/hybrid cars whose title starts with the given make name.
export function electricCarsByMake(makeSlug) {
  if (!makeSlug) return [];
  const makeName = makeSlug.replace(/-/g, ' ').toLowerCase();
  return electricHybridCars.filter((c) =>
    c.title.toLowerCase().startsWith(makeName)
  );
}