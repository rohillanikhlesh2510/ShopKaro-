import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { getFallbackThumbnail } from "../utils/imageFallback";

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useContext(CartContext);
  const [failedImages, setFailedImages] = useState({});

  return (
    <div className="w-full p-6 text-black bg-white min-h-[70vh]">
      <h1 className="text-2xl font-extrabold text-black mb-6">Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="p-8 rounded-xl bg-white border-2 border-black text-center shadow-sm">
          <p className="text-lg font-bold text-black">
            Your wishlist is empty!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-white border-2 border-black shadow-sm"
            >
              <div className="w-20 h-20 flex items-center justify-center bg-white border border-neutral-300 rounded p-1 overflow-hidden shrink-0">
                <img
                  src={
                    !item.thumbnail || failedImages[item.id] === item.thumbnail
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
                <h3 className="text-base font-bold text-black">
                  {item.title}
                </h3>
                <p className="font-extrabold text-lg text-black">
                  ₹ {item.price}
                </p>
              </div>

              <button
                onClick={() => removeFromWishlist(item.id)}
                className="px-4 py-2 rounded-md font-bold text-xs bg-black text-white hover:bg-neutral-800 border-2 border-black transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
