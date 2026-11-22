import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-16 bg-slate-900 border-t border-slate-800 text-slate-400 text-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm tracking-tight">
              <span className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs">
                NC
              </span>
              <span>ShopKaro Systems</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Full-stack inventory management and e-commerce application engineered with atomic transaction safety, role-based controls, and real-time Socket.IO notification pipelines.
            </p>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Platform Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-slate-200 transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-slate-200 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-slate-200 transition-colors">
                  Customer Wishlist
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-slate-200 transition-colors">
                  Order Management
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-slate-200 transition-colors">
                  Seller & Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Legal & Compliance
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-slate-200 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-slate-200 transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <span className="text-slate-500">
                  Data Protection: Encrypted (Bcrypt / JWT)
                </span>
              </li>
              <li>
                <span className="text-slate-500">
                  Transaction Mode: Simulated Development
                </span>
              </li>
            </ul>
          </div>

          {/* Deployment & Architecture */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              System Status
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm bg-emerald-500" />
                <span>Backend Port: 5000</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm bg-blue-500" />
                <span>Frontend Port: 3000</span>
              </li>
              <li>
                <a
                  href="/api/health"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Verify Health Endpoint (/api/health)
                </a>
              </li>
              <li className="text-slate-500 pt-1">
                Custom Domain Ready: DNS CNAME / Reverse Proxy
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500">
            (c) 2026 ShopKaro Systems. All rights reserved.
          </p>
          <div className="flex gap-6 text-slate-400">
            <Link to="/privacy" className="hover:text-slate-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-200">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
