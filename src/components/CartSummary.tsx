import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag } from 'lucide-react';

type Props = {
  onCheckout: () => void;
};

export function CartSummary({ onCheckout }: Props) {
  const { lines, setQty, remove, subtotalCents, itemCount } = useCart();

  if (lines.length === 0) {
    return (
      <Card className="border-dashed bg-muted/30 p-8 text-center">
        <div className="flex justify-center mb-4">
          <ShoppingBag className="h-12 w-12 text-muted-foreground opacity-20" />
        </div>
        <CardTitle className="text-lg">Your cart is empty</CardTitle>
        <p className="mt-2 text-sm text-stone-600">
          Browse categories below and add TVs, headphones, or accessories.
        </p>
      </Card>
    );
  }

  return (
    <Card className="sticky top-28 overflow-hidden shadow-2xl border-border bg-card/80 backdrop-blur-lg perspective preserve-3d">
      <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
        <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 text-foreground">
          <ShoppingBag className="h-4 w-4" />
          Bag Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <ul className="max-h-[min(60vh,28rem)] space-y-8 overflow-y-auto pr-1 custom-scrollbar preserve-3d">
          {lines.map(({ product, qty }) => (
            <li
              key={product.id}
              className="group flex gap-4 translate-z-10 hover:translate-z-20 transition-transform duration-300"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg ring-1 ring-border/50 bg-muted">
                <img
                  src={product.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="min-w-0 flex-1 flex flex-col">
                <p className="truncate text-xs font-black uppercase tracking-wider text-foreground leading-tight">{product.name}</p>
                {product.category && (
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mt-1">{product.category}</p>
                )}
                <p className="mt-2 text-sm font-black tabular-nums text-foreground">
                  {formatPrice(product.priceCents)}
                </p>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id={`qty-${product.id}`}
                      type="number"
                      min={1}
                      max={99}
                      value={qty}
                      onChange={(e) =>
                        setQty(product.id, Number.parseInt(e.target.value, 10) || 1)
                      }
                      className="h-8 w-14 px-2 py-1 bg-muted/50 border-border/50 text-xs font-black tabular-nums"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(product.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <Separator className="bg-border/50" />
      <CardFooter className="flex flex-col gap-6 p-8 bg-muted/20">
        <div className="flex w-full items-center justify-between uppercase tracking-widest">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground">
              Total Amount
            </span>
            <span className="text-[10px] font-bold text-muted-foreground/60">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <span className="text-2xl font-black tabular-nums text-foreground">
            {formatPrice(subtotalCents)}
          </span>
        </div>
        <Button
          onClick={onCheckout}
          className="w-full h-14 text-xs font-black uppercase tracking-[0.3em] bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95 shadow-xl"
        >
          Proceed to Order
        </Button>
      </CardFooter>
    </Card>
  );
}
