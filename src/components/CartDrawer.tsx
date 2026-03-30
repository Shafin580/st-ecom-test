import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { CustomDrawer } from './CustomDrawer';
import { useCartStore } from '../store/useCartStore';

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  const totalPrice = getTotalPrice();
  const totalItems = items.length;

  return (
    <CustomDrawer
      isOpenState={isCartOpen}
      drawerTitle={`Your Cart (${totalItems})`}
      onClose={() => setCartOpen(false)}
      size="w-full sm:w-[420px]"
    >
      <div className="flex flex-col h-full">
        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-16">
            <ShoppingBag size={48} className="text-slate-200 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Cart is empty</h3>
            <p className="text-sm text-slate-400">
              Add some products to get started.
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.category}</p>
                    <p className="text-sm font-bold text-[#2A75FF] mt-1">
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 bg-white rounded-full border border-slate-200 px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center
                                     hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold text-slate-700 min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.stock}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors
                            ${item.quantity >= item.stock
                              ? 'opacity-30 cursor-not-allowed text-slate-400'
                              : 'hover:bg-blue-50 text-slate-500 hover:text-[#2A75FF]'
                            }`}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {item.quantity >= item.stock ? 'Max' : `${item.stock - item.quantity} left`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Total</span>
                <span className="text-xl font-bold text-slate-800">
                  ৳ {totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                className="w-full bg-[#2A75FF] hover:bg-[#1a5fd6] text-white font-semibold py-3 rounded-xl
                           transition-colors text-sm shadow-md"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={clearCart}
                className="w-full text-sm text-slate-400 hover:text-red-500 transition-colors py-1"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </CustomDrawer>
  );
}
