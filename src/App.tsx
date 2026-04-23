import { useCallback, useEffect, useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { formatPrice, type Product } from './data/products';
import { fetchProducts } from './lib/api';
import localProducts from '../data/products.json';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PromoStrip } from './components/PromoStrip';
import { ShopCatalog } from './components/ShopCatalog';
import { CheckoutPanel } from './components/checkout/CheckoutPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, RefreshCw, ChevronDown } from 'lucide-react';

type Phase = 'shop' | 'checkout' | 'success';

function Shell() {
  const [phase, setPhase] = useState<Phase>('shop');
  const { subtotalCents, clear } = useCart();
  const [products, setProducts] = useState<Product[]>(localProducts as Product[]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [serverSubtotalCents, setServerSubtotalCents] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (phase !== 'checkout') {
      setServerSubtotalCents(null);
    }
  }, [phase]);

  useEffect(() => {
    // We already have localProducts, but we try to fetch latest from server anyway
    // If it fails, we just stick with the local ones (no error shown to user)
    fetchProducts()
      .then((p) => {
        if (p && p.length > 0) {
          setProducts(p);
        }
      })
      .catch((e) => {
        console.warn('Could not sync with server catalog, using local version:', e);
      });
  }, []);

  const goCheckout = useCallback(() => {
    setPhase('checkout');
  }, []);

  const goShop = useCallback(() => {
    setPhase('shop');
  }, []);

  const handleOrderComplete = useCallback(() => {
    clear();
    setPhase('success');
  }, [clear]);

  const displaySubtotal = serverSubtotalCents ?? subtotalCents;

  return (
    <div className="dark min-h-dvh bg-background text-foreground perspective overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none bg-grain z-50" aria-hidden="true" />
      <PromoStrip />
      <Header
        phase={phase}
        onOpenCheckout={goCheckout}
        onBackToShop={phase !== 'shop' ? goShop : undefined}
      />

      {phase === 'shop' && <Hero />}

      {phase === 'shop' && (
        <div className="w-full">
          {/* Filter and Sort Bar */}
          <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-[64px] z-20">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 cursor-pointer hover:text-stone-600 transition-colors">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
                  Filter and Sort
                </span>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 cursor-pointer group">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                    Featured
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  <span className="text-foreground">{products.length}</span> Products
                </div>
              </div>
            </div>
          </div>

          <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {productsLoading && (
              <div className="flex h-64 flex-col items-center justify-center gap-4 text-stone-400">
                <RefreshCw className="h-8 w-8 animate-spin" />
                <p className="text-sm font-medium tracking-wide">Updating catalog...</p>
              </div>
            )}
            
            {!productsLoading && productsError && (
              <div className="flex h-64 flex-col items-center justify-center gap-4 text-destructive">
                <p className="text-sm font-bold uppercase tracking-widest">Error loading catalog</p>
                <p className="text-xs text-muted-foreground">{productsError}</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}
            
            {!productsLoading && !productsError && products.length === 0 && (
              <div className="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground">
                <p className="text-sm font-bold uppercase tracking-widest">Catalog is empty</p>
                <p className="text-xs">No products found in the database.</p>
              </div>
            )}
            
            {!productsLoading && !productsError && products.length > 0 && (
              <div className="space-y-32">
                <ShopCatalog products={products} />
                
                {/* Visual Break / Newsletter or Featured Teaser */}
                <div className="relative overflow-hidden rounded-[2px] bg-stone-900 shadow-2xl">
                  {/* ... contents as before but maybe updated image ... */}
                  <div className="absolute inset-0">
                    <img 
                      src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2070&auto=format&fit=crop" 
                      className="h-full w-full object-cover opacity-60 transition-transform duration-1000 hover:scale-110"
                      alt="Trending collection"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                  </div>
                  <div className="relative z-10 p-12 lg:p-20">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-white/50">
                      Season Drop
                    </p>
                    <h2 className="mt-4 max-w-sm text-4xl font-black uppercase tracking-tighter text-white sm:text-6xl">
                      The Neon <br /> Street <br /> Collection
                    </h2>
                    <p className="mt-6 max-w-xs text-sm font-medium leading-relaxed text-stone-400">
                      Limited edition. Futuristic urban essentials.
                    </p>
                    <button className="mt-10 border-b-2 border-white pb-1 text-sm font-black uppercase tracking-widest text-white transition-all hover:tracking-[0.3em]">
                      Explore Drop
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {(phase === 'checkout' || phase === 'success') && (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          {phase === 'checkout' && (
            <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:items-start">
              <section>
                <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                  Secure checkout
                </h1>
                <p className="mt-3 text-stone-600">
                  Step 1: shipping validated with Zod on the client and on the API.
                  Step 2: the server checks your 6-digit code (stored in MongoDB
                  with an expiry) before confirming the order and updating stock.
                </p>
                <div className="mt-10">
                  <CheckoutPanel
                    onOrderComplete={handleOrderComplete}
                    onServerSubtotal={setServerSubtotalCents}
                  />
                </div>
              </section>
              <Card className="shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider">
                    Order total
                  </Badge>
                  <p className="text-4xl font-black tabular-nums text-foreground">
                    {formatPrice(displaySubtotal)}
                  </p>
                  {serverSubtotalCents != null && (
                    <p className="text-xs text-stone-500">
                      Subtotal after server repricing at checkout start (authoritative
                      for payment).
                    </p>
                  )}
                  <Separator />
                  <p className="text-sm text-stone-500">
                    Tax and shipping are illustrative only in this demo.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {phase === 'success' && (
            <Card className="mx-auto max-w-lg overflow-hidden shadow-2xl">
              <CardContent className="px-8 py-14 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
                <h1 className="font-serif text-3xl font-bold text-foreground">
                  You&apos;re verified
                </h1>
                <p className="mt-4 text-stone-600">
                  Order confirmed on the server; inventory was updated. Your cart was
                  cleared.
                </p>
                <Button
                  onClick={() => setPhase('shop')}
                  className="mt-10 w-full h-12 text-base font-bold"
                >
                  Back to shop
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      )}

      <footer className="border-t border-stone-200 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-sans text-lg font-black uppercase tracking-widest text-foreground">
                Streetwear Collective
              </p>
              <p className="mt-2 text-sm text-stone-600">
                Premium streetwear essentials. Crafted with quality and style in mind.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
                Shop
              </p>
              <ul className="mt-4 space-y-2 text-sm font-medium text-stone-700">
                <li>
                  <a href="#" className="hover:text-stone-900 underline-offset-4 hover:underline">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-stone-900 underline-offset-4 hover:underline">
                    Essentials
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
                Info
              </p>
              <ul className="mt-4 space-y-2 text-sm font-medium text-stone-700">
                <li>Sustainability</li>
                <li>Size Guide</li>
                <li>Shipping & Returns</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
                Connect
              </p>
              <p className="mt-4 text-sm font-medium text-stone-600">
                © {new Date().getFullYear()} Streetwear Collective
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-900 text-white shadow-2xl transition-transform hover:scale-110 active:scale-95">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Shell />
    </CartProvider>
  );
}
