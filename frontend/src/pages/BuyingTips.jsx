import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import Navbar from '../components/automarket/Navbar';
import Footer from '../components/automarket/Footer';
import { slugify } from '../data/buyingArticles';

const buyingGuides = {
  'Start Buying': [
    { title: 'General Advice for Buyers', link: '#' },
    { title: 'Buying Safely - Top Tips for Buyers & Sellers', link: '#' },
    { title: 'Buying from a Private Seller - Know Your Rights', link: '#' },
    { title: 'AutoMax Saved Searches', link: '#' },
    { title: 'Why Can\'t I use the "Show Phone Number" Button?', link: '#' },
    { title: 'I Can\'t Reach a Seller\'s Phone Number', link: '#' },
  ],
  'Motors': [
    { title: 'Buying a Car', link: '#' },
    { title: 'Checklist for Buying a Car', link: '#' },
    { title: 'Car Mileage & What You Need To Know', link: '#' },
    { title: 'Understanding Vehicle Write-Off Categories', link: '#' },
    { title: 'Free History Checks on AutoMax Cars', link: '#' },
    { title: 'Market Price Insights', link: '#' },
  ],
  'Inspection & Testing': [
    { title: 'Pre-Purchase Vehicle Inspection Guide', link: '#' },
    { title: 'Understanding Service History', link: '#' },
    { title: 'Fuel Type & Efficiency Guide', link: '#' },
    { title: 'Common Car Problems to Watch For', link: '#' },
    { title: 'Transmission Types Explained', link: '#' },
    { title: 'Warranty & After-Sales Support', link: '#' },
  ],
  'Financing & Payment': [
    { title: 'Car Finance Options Explained', link: '#' },
    { title: 'Part Exchange Guide', link: '#' },
    { title: 'Understanding Insurance Costs', link: '#' },
    { title: 'Safety Tips for Paying Sellers', link: '#' },
    { title: 'Import Taxes & Duty Information', link: '#' },
    { title: 'Negotiation Tips for Better Deals', link: '#' },
  ],
};

function GuideSection({ title, articles }) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <h3 className="text-xl font-bold text-foreground mb-4">{title}</h3>
      <ul className="space-y-3 mb-4">
        {articles.map((article, idx) => (
          <li key={idx}>
            <Link
              to={`/buying-tips/article/${slugify(article.title)}`}
              className="text-primary hover:underline text-sm font-medium flex items-center gap-2 group"
            >
              {article.title}
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/buying-tips" className="text-primary font-semibold text-sm hover:underline">
        See all {articles.length} articles →
      </Link>
    </div>
  );
}

export default function BuyingTips() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with search */}
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary transition-colors">AutoMax</Link>
              <span>›</span>
              <span className="text-foreground font-medium">Buying Tips</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-foreground mb-3 flex items-center gap-3">
              <span className="text-4xl">💡</span>
              Buying Tips
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground max-w-2xl">
              Guides to help you compare, spot red flags and make confident, informed decisions every time you buy a vehicle.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-80 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for an article"
              className="w-full border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for an article"
            className="w-full border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Guide Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {Object.entries(buyingGuides).map(([title, articles]) => (
            <GuideSection key={title} title={title} articles={articles} />
          ))}
        </div>

        {/* Featured Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl text-white p-8 mb-12">
          <h2 className="text-2xl font-bold mb-3">New to Buying Online?</h2>
          <p className="mb-4">
            Get started with our comprehensive guide to online car shopping. Learn about safety, verification, and how to make the most of your AutoMax experience.
          </p>
          <Link to="/buying-tips/article/general-advice-for-buyers" className="inline-flex items-center gap-2 bg-card text-primary font-semibold px-6 py-3 rounded-lg hover:bg-muted transition-colors">
            Start Your Journey <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}