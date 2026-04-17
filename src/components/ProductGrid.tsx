import type { Product } from '../data/products';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

type Props = {
  products: Product[];
};

export function ProductGrid({ products }: Props) {
  const { add } = useCart();

  return (
    <div className="grid grid-cols-1 gap-y-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
      {products.map((p) => (
        <div
          key={p.id}
          className="group relative flex flex-col bg-card/50 p-4 rounded-xl cursor-pointer preserve-3d threed-lift"
        >
          {/* Discount Badge */}
          {p.category?.toLowerCase().includes('save') && (
            <div className="absolute left-6 top-6 z-20 translate-z-40">
              <div className="rounded-[4px] bg-[#df2020] px-3 py-1.5 text-[10px] font-black tracking-widest text-white shadow-[0_4px_12px_rgba(223,32,32,0.4)]">
                {p.category.toUpperCase()}
              </div>
            </div>
          )}

          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted/20 preserve-3d shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <img
              src={p.image}
              alt={p.name}
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 translate-z-10 group-hover:translate-z-20"
              loading="lazy"
              onLoad={(e) => (e.currentTarget.style.opacity = '1')}
              style={{ opacity: 0 }}
            />
            {/* Quick Add Overlay */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                add(p);
              }}
              className="absolute bottom-4 left-4 right-4 flex scale-90 items-center justify-center gap-2 bg-foreground/90 py-3 text-xs font-bold uppercase tracking-[0.2em] text-background opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 translate-z-20 rounded-md"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to cart
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-6 flex flex-col items-start px-2 translate-z-20">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground group-hover:underline underline-offset-4 decoration-primary/30">
              {p.name}
            </h3>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {p.tagline}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-sm font-black tracking-tight text-foreground">
                {formatPrice(p.priceCents)}
              </span>
              {/* Optional Original Price for Discount Effect */}
              {p.category?.toLowerCase().includes('save') && (
                 <span className="text-xs font-medium text-muted-foreground line-through">
                   {formatPrice(Math.round(p.priceCents / 0.7))}
                 </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
