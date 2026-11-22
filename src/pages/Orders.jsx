import { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import {
  cancelOrderApi,
  getOrdersApi,
  updateOrderStatusApi,
} from "../utils/api";

function Orders() {
  const { user, refreshNotifications } = useContext(AuthContext);
  const { notifyInventoryChanged } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const loadOrders = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await getOrdersApi();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) loadOrders();
    });
    return () => {
      active = false;
    };
  }, [loadOrders]);

  const handleCancelOrder = async (orderId) => {
    setError("");
    setActionMsg("");
    try {
      await cancelOrderApi(orderId);
      setActionMsg("Order cancelled and stock restored.");
      notifyInventoryChanged();
      await loadOrders();
      await refreshNotifications();
    } catch (err) {
      setError(err.message || "Could not cancel order");
    }
  };

  const handleStatusChange = async (orderId, nextStatus) => {
    setError("");
    setActionMsg("");
    try {
      await updateOrderStatusApi(orderId, nextStatus);
      setActionMsg(`Order updated to '${nextStatus}'.`);
      await loadOrders();
      await refreshNotifications();
    } catch (err) {
      setError(err.message || "Could not update order status");
    }
  };

  if (!user) {
    return (
      <div className="w-full p-6 bg-white min-h-[70vh]">
        <div className="p-8 rounded-xl bg-white border-2 border-black text-black text-center space-y-4 shadow-sm">
          <p className="text-xl font-bold">Please login to view orders.</p>
          <Link
            to="/login"
            className="inline-block px-5 py-2.5 bg-black text-white font-bold rounded-md hover:bg-neutral-800 border-2 border-black transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 text-black bg-white min-h-[70vh]">
      <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-extrabold text-black">
          {user.role === "customer"
            ? "My Orders"
            : user.role === "seller"
              ? "Seller Orders"
              : "All Orders (Admin)"}
        </h1>
        <button
          onClick={loadOrders}
          className="px-4 py-2 rounded-md bg-black text-white font-bold text-xs hover:bg-neutral-800 border-2 border-black transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border-2 border-red-300 font-semibold text-sm">
          {error}
        </div>
      )}

      {actionMsg && (
        <div className="mb-4 p-3 rounded bg-emerald-50 text-emerald-800 border-2 border-emerald-300 font-semibold text-sm">
          {actionMsg}
        </div>
      )}

      {loading ? (
        <p className="text-center py-8 font-bold text-black">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="p-8 rounded-xl bg-white border-2 border-black text-center shadow-sm">
          <p className="text-lg font-bold text-black">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const canCancel =
              (user.role === "customer" || user.role === "admin") &&
              ["pending", "confirmed"].includes(order.status);

            const canUpdateStatus =
              (user.role === "seller" || user.role === "admin") &&
              !["cancelled", "delivered"].includes(order.status);

            const amountToDisplay =
              user.role === "seller" ? order.sellerSubtotal : order.totalAmount;

            return (
              <div
                key={order._id}
                className="p-6 rounded-xl bg-white border-2 border-black space-y-4 shadow-sm"
              >
                <div className="flex flex-wrap justify-between items-center gap-2 border-b-2 border-neutral-200 pb-3">
                  <div>
                    <p className="text-sm font-mono font-bold text-black">
                      Order #{order._id}
                    </p>
                    <p className="text-xs text-neutral-600">
                      Placed: {new Date(order.createdAt).toLocaleString()}
                    </p>
                    {user.role === "admin" && order.user && (
                      <p className="text-xs text-neutral-800 mt-1 font-semibold">
                        Customer: {order.user.name} ({order.user.email})
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase">
                    <span className="px-3 py-1 rounded bg-neutral-100 border border-neutral-400 text-black">
                      Status: {order.status}
                    </span>
                    <span className="px-3 py-1 rounded bg-neutral-100 border border-neutral-400 text-black">
                      Payment: {order.paymentMethod} ({order.paymentStatus})
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${order._id}-${item.product?._id || item.product || idx}`}
                      className="flex justify-between items-center text-sm bg-neutral-50 p-3 rounded border border-neutral-200 text-black"
                    >
                      <span className="font-medium">
                        {item.title} × {item.quantity}
                      </span>
                      <span className="font-extrabold text-black">
                        ₹ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t-2 border-neutral-200">
                  <p className="text-xl font-black text-black">
                    {user.role === "seller" ? "Your Items Subtotal" : "Total"}: ₹{" "}
                    {Number(amountToDisplay || 0).toFixed(2)}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {canUpdateStatus && (
                      <>
                        {order.status !== "shipped" && (
                          <button
                            onClick={() =>
                              handleStatusChange(order._id, "shipped")
                            }
                            className="px-4 py-2 rounded-md bg-black text-white text-xs font-bold hover:bg-neutral-800 border-2 border-black transition-colors"
                          >
                            Mark Shipped
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleStatusChange(order._id, "delivered")
                          }
                          className="px-4 py-2 rounded-md bg-black text-white text-xs font-bold hover:bg-neutral-800 border-2 border-black transition-colors"
                        >
                          Mark Delivered
                        </button>
                      </>
                    )}

                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="px-4 py-2 rounded-md bg-white text-red-600 text-xs font-bold hover:bg-red-50 border-2 border-red-600 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;
