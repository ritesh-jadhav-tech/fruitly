import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white">
      <div className="page-container py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 text-xl font-bold mb-4">
            <span className="text-2xl">🍊</span> FruitMart
          </div>
          <p className="text-brand-200 text-sm leading-relaxed">
            Farm-fresh fruits delivered to your doorstep. Sourced directly from trusted growers across India.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-widest text-brand-300 mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { to: '/',       label: 'Home' },
              { to: '/shop',   label: 'Shop' },
              { to: '/cart',   label: 'Cart' },
              { to: '/orders', label: 'My Orders' },
              { to: '/profile',label: 'Profile' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-brand-200 hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-widest text-brand-300 mb-4">Categories</h4>
          <ul className="space-y-2.5 text-sm">
            {['Citrus Fruits', 'Tropical Fruits', 'Berries', 'Stone Fruits', 'Exotic Fruits'].map((cat) => (
              <li key={cat}>
                <Link to={`/shop?category=${encodeURIComponent(cat)}`} className="text-brand-200 hover:text-white transition-colors">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-widest text-brand-300 mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-brand-200">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="flex-shrink-0 mt-0.5 text-amber-400" />
              <span>123 Fruit Market, Pune, Maharashtra 411001</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-amber-400" />
              <a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-amber-400" />
              <a href="mailto:hello@fruitmart.in" className="hover:text-white">hello@fruitmart.in</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-brand-300">
        © {new Date().getFullYear()} FruitMart. All rights reserved.
      </div>
    </footer>
  )
}
