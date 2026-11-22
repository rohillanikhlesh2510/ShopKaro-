import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { getProductById } from "../utils/api";
import { getFallbackThumbnail } from "../utils/imageFallback";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isErrorMsg, setIsErrorMsg] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [failedSrc, setFailedSrc] = useState(null);

  const { addToCart, addToWishlist, inventoryVersion } = useContext(CartContext);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      setFailedSrc(null);
      try {
        const data = await getProductById(id);
        if (active) setProduct(data.product || null);
      } catch (err) {
        if (active) setError(err.message || "Product not found");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      active = false;
    };
  }, [id, inventoryVersion]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-lg dark:text-white">Loading...</p>
    );
  }

  if (error || !product) {
    return (
      <p className="text-center mt-10 text-lg text-red-600">
        {error || "Product not found"}
      </p>
    );
  }

  const handleAddToCart = async () => {
    const res = await addToCart(product, 1);
    setIsErrorMsg(!res.ok);
    setMessage(res.message);
  };

  return (
    <div className="w-full p-6">
      <div className="flex flex-col md:flex-row gap-8 p-8 rounded-xl shadow-md bg-white border-2 border-black text-black">
        <div className="flex-1 flex justify-center items-center rounded-lg min-h-72 p-4 overflow-hidden bg-white border-2 border-neutral-300">
          <img
            src={
              !product.thumbnail || failedSrc === product.thumbnail
                ? getFallbackThumbnail(product)
                : product.thumbnail
            }
            alt={product.title}
            onError={() => {
              if (product.thumbnail && failedSrc !== product.thumbnail) {
                setFailedSrc(product.thumbnail);
              }
            }}
            className="max-h-80 max-w-full object-contain rounded"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-black mb-3">{product.title}</h1>

            <p className="mb-4 text-neutral-700 leading-relaxed text-sm">
              {product.description}
            </p>

            <p className="text-2xl font-black text-black mb-3">
              ₹ {Number(product.price || 0).toLocaleString("en-IN")}
            </p>

            <p className="text-sm mb-1.5 text-neutral-700">
              <span className="font-semibold text-black">Brand:</span> {product.brand || "Generic"}
            </p>

            {product.category?.name && (
              <p className="text-sm mb-1.5 text-neutral-700">
                <span className="font-semibold text-black">Category:</span> {product.category.name}
              </p>
            )}

            {product.seller?.name && (
              <p className="text-sm mb-1.5 text-neutral-700">
                <span className="font-semibold text-black">Seller:</span> {product.seller.name}
              </p>
            )}

            <p
              className={`text-sm font-bold mt-2 mb-6 ${
                product.stock === 0 ? "text-red-600" : "text-emerald-700"
              }`}
            >
              {product.stock === 0
                ? "Out of Stock"
                : `Available Stock: ${product.stock}`}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-3 rounded-md font-bold text-sm border-2 ${
                product.stock === 0
                  ? "bg-neutral-100 text-neutral-400 border-neutral-300 cursor-not-allowed"
                  : "bg-black hover:bg-neutral-800 text-white border-black transition-colors"
              }`}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              onClick={() => {
                addToWishlist(product);
                setIsErrorMsg(false);
                setMessage("Added to Wishlist");
              }}
              className="flex-1 py-3 rounded-md font-bold text-sm bg-white hover:bg-neutral-100 text-black border-2 border-black transition-colors"
            >
              Wishlist
            </button>
          </div>

          {message && (
            <p
              className={`mt-3 font-semibold text-sm ${
                isErrorMsg ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;