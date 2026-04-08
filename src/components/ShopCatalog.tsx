import { useMemo } from 'react';
import type { Product } from '../data/products';
import { ProductGrid } from './ProductGrid';

type Props = {
  products: Product[];
};

export function ShopCatalog({ products }: Props) {
  const sections = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const p of products) {
      const key = p.category ?? 'General';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return Array.from(map.entries());
  }, [products]);

  return (
    <div id="categories" className="scroll-mt-28 space-y-16">
      {sections.map(([title, items], idx) => (
        <section key={title} aria-labelledby={`shop-cat-${idx}`}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-stone-300 pb-4">
            <div>
              <h2
                id={`shop-cat-${idx}`}
                className="font-serif text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl"
              >
                {title}
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                {items.length} {items.length === 1 ? 'product' : 'products'}
              </p>
            </div>
          </div>
          <ProductGrid products={items} />
        </section>
      ))}
    </div>
  );
}
