import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    logout,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentRouteKey = location.key || `${location.pathname}${location.search}`;
  const [openRouteKey, setOpenRouteKey] = useState(null);
  const showAlerts = openRouteKey === currentRouteKey;
  const alertsRef = useRef(null);

  useEffect(() => {
    if (!showAlerts) return undefined;

    const handleClickOutside = (e) => {
      if (alertsRef.current && !alertsRef.current.contains(e.target)) {
        setOpenRouteKey(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpenRouteKey(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showAlerts]);

  const handleToggleAlerts = () => {
    setOpenRouteKey((prev) => (prev === currentRouteKey ? null : currentRouteKey));
  };

  const handleLogout = async () => {
    setOpenRouteKey(null);
    setMobileMenuOpen(false);
    await logout();
    navigate("/login");
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isCurrent = (path) => location.pathname === path;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-white hover:text-slate-200">
              <span className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                NC
              </span>
              <span>ShopKaro</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isCurrent("/")
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Catalog
              </Link>

              {(!user || user.role === "customer") && (
                <Link
                  to="/cart"
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isCurrent("/cart")
                      ? "bg-slate-800 text-white font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <span>Cart</span>
                  {totalCartCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-1.5 py-0.2 rounded font-semibold">
                      {totalCartCount}
                    </span>
                  )}
                </Link>
              )}

              <Link
                to="/wishlist"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isCurrent("/wishlist")
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Wishlist
              </Link>

              {user && (
                <Link
                  to="/orders"
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isCurrent("/orders")
                      ? "bg-slate-800 text-white font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  Orders
                </Link>
              )}

              {user && (user.role === "seller" || user.role === "admin") && (
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isCurrent("/dashboard")
                      ? "bg-slate-800 text-white font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Right Section: Alerts + User Status + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <div className="relative" ref={alertsRef}>
                <button
                  type="button"
                  aria-expanded={showAlerts}
                  onClick={handleToggleAlerts}
                  className="px-2.5 py-1.5 rounded-md text-xs font-medium border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white flex items-center gap-1.5"
                >
                  <span>Alerts</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-600 text-white text-xs px-1.5 rounded font-semibold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showAlerts && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-md shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 z-50"
                  >
                    <div className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="p-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 py-4 text-center">
                          No notifications reported.
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {notifications.map((notif) => (
                            <div
                              key={notif._id || `${notif.title}-${notif.createdAt}`}
                              onClick={() => {
                                if (notif._id && !notif.isRead) markAsRead(notif._id);
                              }}
                              className={`p-2.5 rounded-md text-xs cursor-pointer border ${
                                notif.isRead
                                  ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                                  : "bg-blue-50 dark:bg-slate-800 border-blue-200 dark:border-blue-900 text-slate-900 dark:text-slate-100 font-medium"
                              }`}
                            >
                              <div className="font-semibold text-slate-900 dark:text-slate-100">
                                {notif.title}
                              </div>
                              <div className="mt-0.5 text-slate-600 dark:text-slate-400">
                                {notif.message}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-medium">
                  {user.name} ({user.role})
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md bg-slate-800 text-slate-300 hover:text-white text-sm"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 py-3 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800"
            >
              Catalog
            </Link>
            {(!user || user.role === "customer") && (
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800"
              >
                Cart ({totalCartCount})
              </Link>
            )}
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800"
            >
              Wishlist
            </Link>
            {user && (
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800"
              >
                Orders
              </Link>
            )}
            {user && (user.role === "seller" || user.role === "admin") && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800"
              >
                Dashboard
              </Link>
            )}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-3">
              {user ? (
                <>
                  <span className="text-xs text-slate-400">
                    {user.name} ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-2.5 py-1 bg-red-600 text-white rounded text-xs"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
