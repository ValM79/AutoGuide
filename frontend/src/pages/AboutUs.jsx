import React from 'react';
import Navbar from '../components/automarket/Navbar';
import Footer from '../components/automarket/Footer';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <span className="text-foreground font-medium">About Us</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-6">About AutoMax</h1>
        <div className="prose max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg leading-relaxed">AutoMax is Ireland's largest online vehicle marketplace, connecting buyers and sellers of cars, motorbikes, trucks, boats, and much more since 2026.</p>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-3">Our Mission</h2>
            <p>We make it easy, fast, and safe to buy or sell any vehicle in Ireland. With hundreds of thousands of listings and millions of monthly visitors, AutoMax is the go-to destination for motor enthusiasts and everyday drivers alike.</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-3">What We Offer</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Over 100,000 live vehicle listings at any time</li>
              <li>Trusted dealer network across all 32 counties</li>
              <li>Vehicle history checks and NCT reminders</li>
              <li>Car insurance and finance tools</li>
              <li>Expert buying and selling guides</li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-3">Our Team</h2>
            <p>Based in Dublin, our team is passionate about motors and dedicated to providing the best marketplace experience in Ireland.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>);

}