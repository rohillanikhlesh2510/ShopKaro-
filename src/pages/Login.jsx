import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, register, user } = useContext(AuthContext);

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === "customer" ? "/" : "/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const loggedUser = await login({
          email: form.email,
          password: form.password,
        });
        setSuccessMessage(`Session initiated for ${loggedUser.name}.`);
        navigate(loggedUser.role === "customer" ? "/" : "/dashboard");
      } else {
        const createdUser = await register({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        setSuccessMessage(`Account registered successfully for ${createdUser.name}.`);
        navigate(createdUser.role === "customer" ? "/" : "/dashboard");
      }
    } catch (err) {
      setErrorMessage(err.message || "Authentication process failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md bg-white border-2 border-black rounded-lg shadow-lg p-6 sm:p-8">
        {/* Brand Identification */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-black text-white font-black text-lg mb-2 border-2 border-black">
            SK
          </div>
          <h2 className="text-2xl font-extrabold text-black tracking-tight">
            ShopKaro Account Access
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Sign in to manage orders, catalog products, and review store activity.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b-2 border-black mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              mode === "login"
                ? "border-black text-black font-extrabold"
                : "border-transparent text-neutral-500 hover:text-black"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              mode === "register"
                ? "border-black text-black font-extrabold"
                : "border-transparent text-neutral-500 hover:text-black"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-300 text-red-700 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold">
            {successMessage}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="First and last name"
                className="w-full px-3 py-2 text-sm rounded-md border-2 border-neutral-300 bg-white text-black focus:outline-none focus:border-black font-medium"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@ShopKaro.local"
              className="w-full px-3 py-2 text-sm rounded-md border-2 border-neutral-300 bg-white text-black focus:outline-none focus:border-black font-medium"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-black">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-black font-semibold hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimum 6 characters"
              className="w-full px-3 py-2 text-sm rounded-md border-2 border-neutral-300 bg-white text-black focus:outline-none focus:border-black font-medium"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-md border-2 text-center cursor-pointer transition-colors ${
                    form.role === "customer"
                      ? "border-black bg-neutral-100 font-bold"
                      : "border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={form.role === "customer"}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="sr-only"
                  />
                  <span className="block text-xs font-bold text-black">
                    Customer
                  </span>
                  <span className="block text-[11px] text-neutral-600 mt-0.5">
                    Browse & checkout
                  </span>
                </label>

                <label
                  className={`p-3 rounded-md border-2 text-center cursor-pointer transition-colors ${
                    form.role === "seller"
                      ? "border-black bg-neutral-100 font-bold"
                      : "border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={form.role === "seller"}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="sr-only"
                  />
                  <span className="block text-xs font-bold text-black">
                    Seller
                  </span>
                  <span className="block text-[11px] text-neutral-600 mt-0.5">
                    Manage inventory
                  </span>
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-md bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider border-2 border-black transition-colors disabled:opacity-60"
          >
            {isSubmitting
              ? "Authenticating..."
              : mode === "login"
              ? "Sign In"
              : "Register Account"}
          </button>
        </form>

        {/* Development Test Accounts Section */}
        <div className="mt-6 pt-5 border-t-2 border-neutral-200 text-xs">
          <p className="font-bold text-black mb-2">
            Local Development Accounts:
          </p>
          <div className="space-y-1 font-mono text-[11px] text-neutral-800 bg-neutral-100 p-3 rounded border border-neutral-300">
            <div>Customer: customer1@ShopKaro.local / Customer@123</div>
            <div>Seller: seller1@ShopKaro.local / Seller@123</div>
            <div>Admin: admin@ShopKaro.local / Admin@123</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
