import React from 'react';
import Navbar from '../components/automarket/Navbar';
import HeroSearch from '../components/automarket/HeroSearch';
import BrowseByCategory from '../components/automarket/BrowseByCategory';
import Footer from '../components/automarket/Footer';
import CarListings from '../components/automarket/CarListings';
import PullToRefresh from '../components/automarket/PullToRefresh';
import { queryClientInstance } from '@/lib/query-client';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PullToRefresh onRefresh={async () => { await queryClientInstance.invalidateQueries(); }}>
        <HeroSearch />
        <p className="text-center text-foreground mt-6 text-base">Help us to improve this site: <a href="mailto:Info@automax.ie" className="text-primary hover:underline">Info@automax.ie</a></p>
        <BrowseByCategory />
        <CarListings />
      </PullToRefresh>

      <Footer />
    </div>
  );
}