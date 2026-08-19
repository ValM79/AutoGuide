import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import Navbar from '../components/automarket/Navbar';
import Footer from '../components/automarket/Footer';
import BackButton from '../components/automarket/BackButton';
import { buyingArticles, slugify } from '../data/buyingArticles';

export default function Article() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const article = useMemo(() => {
    // Direct key match first
    if (buyingArticles[slug]) return buyingArticles[slug];
    // Fallback: match by slugified title
    return Object.values(buyingArticles).find((a) => slugify(a.title) === slug);
  }, [slug]);

  // Related articles in the same category
  const related = useMemo(() => {
    if (!article) return [];
    return Object.values(buyingArticles)
      .filter((a) => a.category === article.category && a.title !== article.title)
      .slice(0, 5);
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-muted">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-3">Article not found</h1>
          <p className="text-muted-foreground mb-6">The article you are looking for does not exist.</p>
          <Link to="/buying-tips" className="text-primary font-semibold hover:underline">
            Back to Buying Tips
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <BackButton />
          <span>›</span>
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <Link to="/buying-tips" className="hover:text-primary transition-colors">Buying Tips</Link>
          <span>›</span>
          <span className="text-foreground font-medium truncate">{article.title}</span>
        </div>

        {/* Category badge */}
        <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
          {article.category}
        </span>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-3">{article.title}</h1>

        {/* Intro */}
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{article.intro}</p>

        {/* Sections */}
        <div className="space-y-8">
          {article.sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-xl font-bold text-foreground mb-2">{section.heading}</h2>
              <p className="text-foreground leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        {/* Back to Buying Tips */}
        <div className="mt-12 pt-8 border-t border-border">
          <button
            onClick={() => navigate('/buying-tips')}
            className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Buying Tips
          </button>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-foreground mb-4">Related articles in {article.category}</h3>
            <ul className="space-y-2">
              {related.map((rel) => {
                const relSlug = slugify(rel.title);
                return (
                  <li key={rel.title}>
                    <Link
                      to={`/buying-tips/article/${relSlug}`}
                      className="text-primary hover:underline text-sm font-medium flex items-center gap-2 group"
                    >
                      {rel.title}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}