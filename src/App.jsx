import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import PrivacyPolicy from "./pages/PolicyPage";
import Terms from "./pages/TermsPage";
import AuthProvider from "./context/AuthContext";
import CartProvider from "./context/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col justify-between bg-white text-slate-900">
            <div>
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
