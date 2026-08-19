import React from 'react';
import Navbar from '../components/automarket/Navbar';
import Footer from '../components/automarket/Footer';
import { Link } from 'react-router-dom';

const reviews = [
  { name: 'Sean O\'Brien', rating: 5, date: 'May 2026', text: 'Sold my car within 3 days of posting. Brilliant platform, very easy to use and great value for money.' },
  { name: 'Claire Murphy', rating: 5, date: 'April 2026', text: 'Found my dream car on AutoMax. The search filters are fantastic and the seller was great. Highly recommend!' },
  { name: 'Declan Walsh', rating: 4, date: 'April 2026', text: 'Really pleased with the experience. Got loads of enquiries on my ad quickly. Will use again.' },
  { name: 'Aoife Kelly', rating: 5, date: 'March 2026', text: 'Best car marketplace in Ireland by far. Quick, reliable and the price alert feature is a great touch.' },
  { name: 'Mark Byrne', rating: 5, date: 'March 2026', text: 'Bought and sold through AutoMax multiple times. Always a smooth process.' },
  { name: 'Patricia Ryan', rating: 4, date: 'February 2026', text: 'Very happy with the service. The vehicle lookup tool saved me a lot of time filling in details.' },
];

const Star = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-muted-foreground'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function ReviewsGallery() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <span className="text-foreground font-medium">Reviews Gallery</span>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Customer Reviews</h1>
          <p className="text-muted-foreground">See what our customers say about AutoMax</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} filled />)}</div>
            <span className="font-bold text-foreground text-lg">4.8 / 5</span>
            <span className="text-muted-foreground text-sm">based on 2,400+ reviews</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-3">{[1,2,3,4,5].map(s => <Star key={s} filled={s <= r.rating} />)}</div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{r.text}"</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-sm">{r.name}</span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}