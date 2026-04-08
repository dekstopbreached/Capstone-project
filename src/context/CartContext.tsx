import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Product } from '../data/products';

export type CartLine = { product: Product; qty: number };

type CartContextValue = {
  lines: CartLine[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  subtotalCents: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = useCallback((product: Product) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.product.id === product.id);
      if (i === -1) return [...prev, { product, qty: 1 }];
      const next = [...prev];
      next[i] = { ...next[i], qty: next[i].qty + 1 };
      return next;
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    if (qty < 1) {
      remove(productId);
      return;
    }
    setLines((prev) =>
      prev.map((l) =>
        l.product.id === productId ? { ...l, qty } : l,
      ),
    );
  }, [remove]);

  const clear = useCallback(() => setLines([]), []);

  const { subtotalCents, itemCount } = useMemo(() => {
    const subtotalCents = lines.reduce(
      (s, l) => s + l.product.priceCents * l.qty,
      0,
    );
    const itemCount = lines.reduce((n, l) => n + l.qty, 0);
    return { subtotalCents, itemCount };
  }, [lines]);

  const value = useMemo(
    () => ({
      lines,
      add,
      remove,
      setQty,
      clear,
      subtotalCents,
      itemCount,
    }),
    [lines, add, remove, setQty, clear, subtotalCents, itemCount],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
