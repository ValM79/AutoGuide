import React from 'react';
import { Link } from 'react-router-dom';

const footerSections = [
{
  title: 'Company',
  links: [
  { label: 'About us', route: '/about-us' },
  { label: 'Contact us', route: '/contact-us' },
  { label: 'Help', route: '/help' },
  { label: 'Reviews Gallery', route: '/reviews-gallery' },
  { label: 'Career', route: '/career' }]

},
{
  title: "Information",
  links: [
  { label: 'Cookie policy', route: '/cookie-policy' },
  { label: 'Privacy policy', route: '/privacy-policy' },
  { label: 'Terms & conditions', route: '/terms-and-conditions' },
  { label: 'Manage cookies', route: '/manage-cookies' },
  { label: 'Accessibility', route: '/accessibility' }]

},
{
  title: 'Resources',
  links: [
  { label: 'Dealers information', route: '/dealers-information' },
  { label: 'Advertisement', route: '/advertisement' }]

}];


export default function Footer() {
  return (
    <footer className="bg-foreground text-background/70" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Top section: Logo + Links + App Download */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 mb-8">

          {/* Logo + App Store buttons */}
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="flex items-center gap-2">
              <span className="text-background text-xl font-extrabold tracking-tight">AutoMax</span>
              <img
                src="https://media.base44.com/images/public/69ceb6b4f41f5a2cee0c7016/ca07bfd68_generated_image.png"
                alt="AutoMax Logo"
                className="w-6 h-6 object-contain"
                style={{ filter: 'invert(1) brightness(0.7)', mixBlendMode: 'screen' }} />
              
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 justify-center">
              {/* Facebook */}
              <a href="#" className="text-background/60 hover:text-background transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="text-background/60 hover:text-background transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </a>
              {/* TikTok */}
              <a href="#" className="text-background/60 hover:text-background transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" /></svg>
              </a>
              {/* YouTube */}
              <a href="#" className="text-background/60 hover:text-background transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="text-background/60 hover:text-background transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>

            {/* Download our App */}
            <div>
              <p className="text-background text-sm font-semibold mb-3">Download our App</p>
              <div className="flex flex-col gap-1 items-center justify-center w-full">
                <a href="#" className="hover:opacity-80 transition-opacity w-full">
                  <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-12 w-full object-contain" />
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity w-full">
                  <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="h-16 w-full object-contain" />
                </a>
              </div>
            </div>
          </div>

          {/* Nav link columns */}
          {footerSections.map((section) =>
          <div key={section.title}>
              <h3 className="text-background font-semibold text-sm mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) =>
              <li key={link.label}>
                    <Link to={link.route} className="text-sm hover:text-background transition-colors">
                      {link.label}
                    </Link>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-background/40 text-center">© 2026 AutoMax. All rights reserved. Ireland's largest car marketplace.</p>
            
          </div>
        </div>

      </div>
    </footer>);

}