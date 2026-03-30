import { ShoppingCart, Plus, Minus } from "lucide-react";
import type { Product } from "../types/product";
import { useCartStore } from "../store/useCartStore";

export default function ProductCard({
  id,
  name,
  price,
  category,
  description,
  imageUrl,
  stock,
}: Product) {
  const quantity = useCartStore((s) => s.getItemQuantity(id));
  const addToCart = useCartStore((s) => s.addToCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const product: Product = { id, name, price, category, description, imageUrl, stock };

  return (
    <div
      className="w-full flex flex-col gap-3 group cursor-pointer"
      id={`product-${id}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] bg-[#EBEBEB]">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-4">
          {/* Description */}
          <p className="text-white text-sm text-center line-clamp-5 drop-shadow-md">
            {description}
          </p>

          {/* Add to Cart / Quantity Stepper */}
          <div className="pointer-events-auto flex flex-col items-center gap-2">
            {stock === 0 ? (
              /* Out of stock */
              <span className="bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-full
                               cursor-not-allowed select-none">
                Out of Stock
              </span>
            ) : quantity === 0 ? (
              /* Add to cart */
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="flex items-center gap-2 bg-white text-slate-800 font-semibold text-sm px-5 py-2.5 rounded-full
                             hover:bg-[#2A75FF] hover:text-white transition-colors duration-200 shadow-lg"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
                <span className="text-white/70 text-xs">{stock} in stock</span>
              </>
            ) : (
              /* Quantity stepper */
              <>
                <div className="flex items-center gap-3 bg-white rounded-full px-2 py-1 shadow-lg">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(id, -1);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center
                               hover:bg-red-50 text-slate-600 hover:text-red-500 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-bold text-slate-800 min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (quantity < stock) updateQuantity(id, 1);
                    }}
                    disabled={quantity >= stock}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                      ${quantity >= stock
                        ? 'opacity-30 cursor-not-allowed text-slate-400'
                        : 'hover:bg-blue-50 text-slate-600 hover:text-[#2A75FF]'
                      }`}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-white/70 text-xs">
                  {quantity >= stock ? 'Max stock reached' : `${stock - quantity} more available`}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 px-1">
        <p className="text-sm text-slate-500">{category}</p>
        <h3 className="text-[16px] leading-[1.3] font-semibold text-slate-800 line-clamp-2">
          {name}
        </h3>
        <div className="pt-1">
          <span className="text-[20px] font-bold text-[#2A75FF]">
            ৳ {price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
