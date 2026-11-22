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
      className="rounded-lg overflow-hidden bg-white border-2 border-black shadow-sm hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Product Image Frame */}
        <div className="relative h-44 flex items-center justify-center p-3 bg-white border-b-2 border-black overflow-hidden">
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
            className={`absolute top-2 right-2 px-2 py-1 text-xs rounded border-2 border-black font-bold transition-colors ${
              wishlistAdded
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-neutral-100"
            }`}
            title="Add to Wishlist"
          >
            {wishlistAdded ? "Saved" : "Save"}
          </button>
        </div>

        {/* Details */}
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
            <span className="uppercase tracking-wider font-semibold">
              {product.brand || "Standard"}
            </span>
            {product.category?.name && (
              <span className="bg-neutral-100 text-black border border-neutral-300 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                {product.category.name}
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-black line-clamp-2 mb-2 leading-snug">
            {product.title}
          </h3>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-base font-extrabold text-black">
              ₹ {Number(product.price || 0).toLocaleString("en-IN")}
            </span>

            <span
              className={`text-xs font-bold px-2 py-0.5 rounded border ${
                isOutOfStock
                  ? "bg-red-50 text-red-700 border-red-400"
                  : product.stock <= 5
                    ? "bg-amber-50 text-amber-800 border-amber-400"
                    : "bg-emerald-50 text-emerald-800 border-emerald-400"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : `Stock: ${product.stock}`}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 bg-white">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${productId}`);
          }}
          disabled={isOutOfStock}
          className={`w-full py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors border-2 ${
            isOutOfStock
              ? "bg-neutral-100 text-neutral-400 border-neutral-300 cursor-not-allowed"
              : "bg-black hover:bg-neutral-800 text-white border-black"
          }`}
        >
          {isOutOfStock ? "Unavailable" : "View Details"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
