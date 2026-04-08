import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

type Props = {
  onCheckout: () => void;
};

export function CartSummary({ onCheckout }: Props) {
  const { lines, setQty, remove, subtotalCents, itemCount } = useCart();

  if (lines.length === 0) {
    return (
      <aside className="rounded-lg border-2 border-dashed border-stone-300 bg-white p-8 text-center text-stone-600 shadow-sm">
        <p className="font-serif text-lg font-bold text-stone-800">Your cart is empty</p>
        <p className="mt-2 text-sm">
          Browse categories below and add TVs, headphones, or accessories.
        </p>
      </aside>
    );
  }

  return (
    <aside className="rounded-lg border border-stone-200 bg-white p-6 shadow-md ring-1 ring-stone-900/5">
      <h2 className="border-b border-stone-200 pb-3 font-serif text-lg font-bold text-stone-900">
        Order summary
      </h2>
      <ul className="mt-4 max-h-[min(60vh,28rem)] space-y-4 overflow-y-auto pr-1">
        {lines.map(({ product, qty }) => (
          <li
            key={product.id}
            className="flex gap-3 border-b border-stone-100 pb-4 last:border-0 last:pb-0"
          >
            <img
              src={product.image}
              alt=""
              className="size-16 shrink-0 rounded-md object-cover ring-1 ring-stone-200"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-stone-900">{product.name}</p>
              {product.category && (
                <p className="text-xs text-stone-500">{product.category}</p>
              )}
              <p className="text-sm tabular-nums text-stone-600">
                {formatPrice(product.priceCents)} × {qty}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`qty-${product.id}`}>
                  Quantity for {product.name}
                </label>
                <input
                  id={`qty-${product.id}`}
                  type="number"
                  min={1}
                  max={99}
                  value={qty}
                  onChange={(e) =>
                    setQty(product.id, Number.parseInt(e.target.value, 10) || 1)
                  }
                  className="w-16 rounded-md border border-stone-300 px-2 py-1.5 text-sm font-semibold tabular-nums"
                />
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  className="text-xs font-bold text-amber-900/80 underline-offset-2 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4">
        <span className="text-sm font-semibold text-stone-600">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
        <span className="text-xl font-bold tabular-nums text-stone-900">
          {formatPrice(subtotalCents)}
        </span>
      </div>
      <button
        type="button"
        onClick={onCheckout}
        className="mt-6 w-full rounded-md bg-stone-900 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800"
      >
        Continue to secure checkout
      </button>
    </aside>
  );
}
