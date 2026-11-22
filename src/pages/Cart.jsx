import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { placeOrderApi } from "../utils/api";
import { getFallbackThumbnail } from "../utils/imageFallback";

function Cart() {
  const { user, refreshNotifications } = useContext(AuthContext);
  const {
    cartItems,
    cartTotalAmount,
    cartLoading,
    removeFromCart,
    increaseQty,
    decreaseQty,
    refreshCart,
    notifyInventoryChanged,
  } = useContext(CartContext);

  const [showForm, setShowForm] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [failedImages, setFailedImages] = useState({});

  const [checkoutForm, setCheckoutForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    paymentMethod: "upi",
  });

  const total =
    cartTotalAmount > 0
      ? cartTotalAmount
      : cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!user) {
    return (
      <div className="w-full p-6 text-black bg-white min-h-[70vh]">
        <h1 className="text-2xl font-extrabold mb-6 text-black">Cart</h1>
        <div className="p-8 rounded-xl bg-white border-2 border-black text-center space-y-4 shadow-sm">
          <p className="text-xl font-bold text-black">
            Please login as a customer to view your cart.
          </p>
          <Link
            to="/login"
            className="inline-block px-5 py-2.5 bg-black text-white font-bold rounded-md hover:bg-neutral-800 border-2 border-black transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "customer") {
    return (
      <div className="w-full p-6 text-black bg-white min-h-[70vh]">
        <h1 className="text-2xl font-extrabold mb-6 text-black">Cart</h1>
        <div className="p-8 rounded-xl bg-white border-2 border-black text-center shadow-sm">
          <p className="text-lg font-bold text-black">
            Shopping cart is available for customer accounts only.
          </p>
        </div>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await placeOrderApi({
        shippingAddress: {
          name: checkoutForm.name,
          email: checkoutForm.email,
          address: checkoutForm.address,
        },
        paymentMethod: checkoutForm.paymentMethod,
      });

      setPlacedOrder(data.order);
      setShowForm(false);
      notifyInventoryChanged();
      await refreshCart();
      await refreshNotifications();
    } catch (err) {
      setError(err.message || "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full p-6 text-black bg-white min-h-[70vh]">
      <h1 className="text-2xl font-extrabold mb-6 text-black">Cart</h1>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border-2 border-red-400 font-semibold text-sm">
          {error}
        </div>
      )}

      {placedOrder && (
        <div className="mb-6 p-6 rounded-xl bg-white border-2 border-black text-black space-y-2 shadow-sm">
          <h2 className="text-xl font-extrabold text-emerald-700">Order placed successfully!</h2>
          <p className="text-sm">
            Order ID: <span className="font-mono font-bold">{placedOrder._id}</span>
          </p>
          <p className="text-sm">
            Total Paid/Payable: <span className="font-extrabold">₹ {placedOrder.totalAmount}</span> | Payment Status:{" "}
            <span className="uppercase font-bold">{placedOrder.paymentStatus}</span> | Order Status:{" "}
            <span className="uppercase font-bold">{placedOrder.status}</span>
          </p>
          <Link
            to="/orders"
            className="inline-block mt-2 px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-neutral-800 border-2 border-black transition-colors"
          >
            View Order History
          </Link>
        </div>
      )}

      {cartLoading ? (
        <div className="p-8 rounded-xl bg-white border-2 border-black text-center shadow-sm">
          <p className="text-lg font-bold text-black">Loading your cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="p-8 rounded-xl bg-white border-2 border-black text-center shadow-sm">
          <p className="text-xl font-bold text-black">Your cart is empty!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-white border-2 border-black shadow-sm"
              >
                <div className="w-20 h-20 flex items-center justify-center bg-white border border-neutral-300 rounded p-1 overflow-hidden shrink-0">
                  <img
                    src={
                      !item.thumbnail ||
                      failedImages[item.id] === item.thumbnail
                        ? getFallbackThumbnail(item)
                        : item.thumbnail
                    }
                    alt={item.title}
                    onError={() => {
                      if (
                        item.thumbnail &&
                        failedImages[item.id] !== item.thumbnail
                      ) {
                        setFailedImages((prev) => ({
                          ...prev,
                          [item.id]: item.thumbnail,
                        }));
                      }
                    }}
                    className="max-w-full max-h-full object-contain rounded"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-sm text-black">{item.title}</h3>
                  <p className="font-extrabold text-lg text-black">₹ {item.price}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={async () => {
                        setError("");
                        const res = await decreaseQty(item.id);
                        if (res && !res.ok && res.message) setError(res.message);
                      }}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-neutral-100 text-black border border-black rounded font-bold"
                    >
                      -
                    </button>

                    <span className="font-extrabold px-2">{item.quantity}</span>

                    <button
                      onClick={async () => {
                        setError("");
                        const res = await increaseQty(item.id);
                        if (res && !res.ok && res.message) setError(res.message);
                      }}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-neutral-100 text-black border border-black rounded font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs border-2 border-black rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-6 rounded-lg bg-white border-2 border-black shadow-sm">
            <h2 className="text-2xl font-black text-black mb-4">
              Total: ₹ {total.toFixed(2)}
            </h2>

            <button
              onClick={() => {
                setCheckoutForm((prev) => ({
                  ...prev,
                  name: prev.name || user.name || "",
                  email: prev.email || user.email || "",
                }));
                setShowForm(true);
              }}
              className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-sm border-2 border-black rounded-md transition-colors"
            >
              Checkout
            </button>
          </div>
        </>
      )}

      {showForm && (
        <form
          onSubmit={handleCheckout}
          className="mt-6 p-6 rounded-lg bg-white border-2 border-black space-y-4 shadow-sm"
        >
          <h3 className="text-lg font-bold text-black border-b-2 border-black pb-2">
            Shipping & Payment Details
          </h3>

          <input
            type="text"
            placeholder="Name"
            required
            value={checkoutForm.name}
            onChange={(e) =>
              setCheckoutForm({ ...checkoutForm, name: e.target.value })
            }
            className="w-full p-2.5 border-2 border-neutral-300 rounded-md bg-white text-black font-medium focus:border-black focus:outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={checkoutForm.email}
            onChange={(e) =>
              setCheckoutForm({ ...checkoutForm, email: e.target.value })
            }
            className="w-full p-2.5 border-2 border-neutral-300 rounded-md bg-white text-black font-medium focus:border-black focus:outline-none"
          />

          <textarea
            placeholder="Address"
            required
            value={checkoutForm.address}
            onChange={(e) =>
              setCheckoutForm({ ...checkoutForm, address: e.target.value })
            }
            className="w-full p-2.5 border-2 border-neutral-300 rounded-md bg-white text-black font-medium focus:border-black focus:outline-none"
          />

          <div className="flex gap-6 py-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm">
              <input
                type="radio"
                name="pay"
                value="card"
                checked={checkoutForm.paymentMethod === "card"}
                onChange={(e) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    paymentMethod: e.target.value,
                  })
                }
                required
              />{" "}
              Card
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm">
              <input
                type="radio"
                name="pay"
                value="upi"
                checked={checkoutForm.paymentMethod === "upi"}
                onChange={(e) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    paymentMethod: e.target.value,
                  })
                }
              />{" "}
              UPI
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm">
              <input
                type="radio"
                name="pay"
                value="cash"
                checked={checkoutForm.paymentMethod === "cash"}
                onChange={(e) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    paymentMethod: e.target.value,
                  })
                }
              />{" "}
              Cash
            </label>
          </div>

          <label className="block text-xs font-semibold text-neutral-700">
            <input type="checkbox" required className="mr-2" /> Confirm order and simulated payment
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-sm border-2 border-black rounded-md transition-colors disabled:opacity-60"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Cart;
