import React from 'react';

export default function PromoBanner({ image }) {
  return (
    <div className="mb-6 rounded-xl overflow-hidden h-36 sm:h-44 bg-card">
      <img
        src={image}
        alt="Promo"
        className="w-full h-full object-cover"
      />
    </div>
  );
}