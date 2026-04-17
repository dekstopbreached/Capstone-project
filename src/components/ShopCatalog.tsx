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
    <div id="categories" className="scroll-mt-28 space-y-32">
      {sections.map(([title, items], idx) => (
        <section key={title} aria-labelledby={`shop-cat-${idx}`} className="preserve-3d">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
            <div className="translate-z-10">
              <h2
                id={`shop-cat-${idx}`}
                className="font-sans text-4xl font-black uppercase tracking-tighter text-foreground sm:text-6xl lg:text-7xl drop-shadow-lg"
              >
                {title}
              </h2>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'} / Collection
              </p>
            </div>
          </div>
          <ProductGrid products={items} />
        </section>
      ))}
    </div>
  );
}
