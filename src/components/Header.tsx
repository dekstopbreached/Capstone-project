import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

type Props = {
  onOpenCheckout: () => void;
  phase: 'shop' | 'checkout' | 'success';
  onBackToShop?: () => void;
};

export function Header({ onOpenCheckout, phase, onBackToShop }: Props) {
  const { itemCount, subtotalCents } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 shadow-2xl backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          {phase !== 'shop' && onBackToShop && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToShop}
              className="shrink-0 gap-2 border-border/50 hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              Shop
            </Button>
          )}
          <div className="min-w-0">
            <p className="truncate font-sans text-xl font-black uppercase tracking-[0.2em] text-foreground sm:text-2xl">
              Streetwear <span className="text-muted-foreground/50">Collective</span>
            </p>
            <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
              Premium · Essentials · Future
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground md:flex">
          <a href="#categories" className="transition hover:text-foreground">
            Catalog
          </a>
          <a href="#trust" className="transition hover:text-foreground">
            Why us
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {phase === 'shop' && (
            <div className="hidden text-right sm:block divide-y divide-border/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pb-0.5">
                Cart Total
              </p>
              <p className="text-sm font-black tabular-nums text-foreground pt-0.5">
                {formatPrice(subtotalCents)}
              </p>
            </div>
          )}
          <Button
            onClick={onOpenCheckout}
            disabled={itemCount === 0 || phase === 'checkout'}
            className="gap-3 px-8 h-11 bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="tabular-nums font-black text-xs">{itemCount}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
