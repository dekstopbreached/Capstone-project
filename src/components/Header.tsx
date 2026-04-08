import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

type Props = {
  onOpenCheckout: () => void;
  phase: 'shop' | 'checkout' | 'success';
  onBackToShop?: () => void;
};

export function Header({ onOpenCheckout, phase, onBackToShop }: Props) {
  const { itemCount, subtotalCents } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-300 bg-stone-50/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          {phase !== 'shop' && onBackToShop && (
            <button
              type="button"
              onClick={onBackToShop}
              className="shrink-0 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:bg-stone-100"
            >
              ← Shop
            </button>
          )}
          <div className="min-w-0">
            <p className="truncate font-serif text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Northline Electronics
            </p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.15em] text-amber-900/80">
              TVs · Audio · Accessories
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-stone-700 md:flex">
          <a href="#categories" className="transition hover:text-amber-900">
            Catalog
          </a>
          <a href="#trust" className="transition hover:text-amber-900">
            Why us
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {phase === 'shop' && (
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Cart
              </p>
              <p className="text-base font-bold tabular-nums text-stone-900">
                {formatPrice(subtotalCents)}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={onOpenCheckout}
            disabled={itemCount === 0 || phase === 'checkout'}
            className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400 disabled:shadow-none"
          >
            <span className="tabular-nums">{itemCount}</span>
            <span className="hidden sm:inline">
              {phase === 'checkout' ? 'Checking out' : 'Checkout'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
