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
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-6 sm:p-8">
        {/* Brand Identification */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-blue-600 text-white font-bold text-base mb-2">
            NC
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            ShopKaro Account Access
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sign in to manage orders, catalog products, and review store activity.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              mode === "login"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
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
            className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              mode === "register"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            {successMessage}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="First and last name"
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@ShopKaro.local"
              className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
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
              className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-md border text-center cursor-pointer transition-colors ${
                    form.role === "customer"
                      ? "border-blue-600 bg-blue-50 dark:bg-slate-700/60"
                      : "border-slate-300 dark:border-slate-600"
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
                  <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                    Customer
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Browse & checkout
                  </span>
                </label>

                <label
                  className={`p-3 rounded-md border text-center cursor-pointer transition-colors ${
                    form.role === "seller"
                      ? "border-blue-600 bg-blue-50 dark:bg-slate-700/60"
                      : "border-slate-300 dark:border-slate-600"
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
                  <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                    Seller
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Manage inventory
                  </span>
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-60"
          >
            {isSubmitting
              ? "Authenticating..."
              : mode === "login"
              ? "Sign In"
              : "Register Account"}
          </button>
        </form>

        {/* Development Test Accounts Section */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700 text-xs">
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Local Development Accounts:
          </p>
          <div className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
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
