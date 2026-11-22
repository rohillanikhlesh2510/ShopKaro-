import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { getFallbackThumbnail } from "../utils/imageFallback";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToWishlist } = useContext(CartContext);
  const [failedSrc, setFailedSrc] = useState(null);
  const [wishlistAdded, setWishlistAdded] = useState(false);

  const productId = product._id || product.id;
  const fallbackSrc = getFallbackThumbnail(product);
  const showFallback = !product.thumbnail || failedSrc === product.thumbnail;
  const imageSrc = showFallback ? fallbackSrc : product.thumbnail;

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    addToWishlist(product);
    setWishlistAdded(true);
    setTimeout(() => setWishlistAdded(false), 2000);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div
      onClick={() => navigate(`/product/${productId}`)}
      className="rounded-lg overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition-shadow flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Product Image Frame */}
        <div className="relative h-44 flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-700/40 border-b border-slate-100 dark:border-slate-700 overflow-hidden">
          <img
            src={imageSrc}
            alt={product.title}
            onError={() => {
              if (!showFallback) setFailedSrc(product.thumbnail);
            }}
            className="max-h-full max-w-full object-contain"
          />

          {/* Wishlist Action */}
          <button
            type="button"
            onClick={handleWishlistClick}
            className={`absolute top-2 right-2 px-2 py-1 text-xs rounded border transition-colors ${wishlistAdded
                ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900"
                : "bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100"
              }`}
            title="Add to Wishlist"
          >
            {wishlistAdded ? "Saved" : "Save"}
          </button>
        </div>

        {/* Details */}
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold">
              {product.brand || "Standard"}
            </span>
            {product.category?.name && (
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded text-[11px]">
                {product.category.name}
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 leading-snug">
            {product.title}
          </h3>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">
              ₹ {Number(product.price || 0).toLocaleString("en-IN")}
            </span>

            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${isOutOfStock
                  ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                  : product.stock <= 5
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                }`}
            >
              {isOutOfStock ? "Out of Stock" : `Stock: ${product.stock}`}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${productId}`);
          }}
          disabled={isOutOfStock}
          className={`w-full py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${isOutOfStock
              ? "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {isOutOfStock ? "Unavailable" : "View Details"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
