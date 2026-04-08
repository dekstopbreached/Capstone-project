import type { Product } from '../data/products';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

type Props = {
  products: Product[];
};

export function ProductGrid({ products }: Props) {
  const { add } = useCart();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <article
          key={p.id}
          className="group flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm ring-1 ring-stone-900/5 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="relative aspect-square overflow-hidden bg-stone-100">
            <img
              src={p.image}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {p.category && (
              <span className="absolute left-3 top-3 max-w-[85%] truncate rounded bg-white/95 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-stone-700 shadow-sm">
                {p.category}
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2 border-t border-stone-100 p-4">
            <div>
              <h2 className="text-lg font-bold leading-snug text-stone-900">
                {p.name}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                {p.tagline}
              </p>
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
              <p className="text-xl font-bold tabular-nums text-stone-900">
                {formatPrice(p.priceCents)}
              </p>
              <button
                type="button"
                onClick={() => add(p)}
                className="shrink-0 rounded-md bg-amber-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600"
              >
                Add to cart
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
