import { useCallback, useEffect, useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { formatPrice, type Product } from './data/products';
import { fetchProducts } from './lib/api';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PromoStrip } from './components/PromoStrip';
import { ShopCatalog } from './components/ShopCatalog';
import { CartSummary } from './components/CartSummary';
import { CheckoutPanel } from './components/checkout/CheckoutPanel';

type Phase = 'shop' | 'checkout' | 'success';

function scrollToCatalog() {
  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
}

function Shell() {
  const [phase, setPhase] = useState<Phase>('shop');
  const { subtotalCents, clear } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
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
    let cancelled = false;
    setProductsLoading(true);
    setProductsError(null);
    fetchProducts()
      .then((p) => {
        if (!cancelled) {
          setProducts(p);
          setProductsLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setProductsError(e instanceof Error ? e.message : 'Failed to load');
          setProductsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
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
    <div className="min-h-dvh">
      <PromoStrip />
      <Header
        phase={phase}
        onOpenCheckout={goCheckout}
        onBackToShop={phase !== 'shop' ? goShop : undefined}
      />

      {phase === 'shop' && <Hero onBrowse={scrollToCatalog} />}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {phase === 'shop' && (
          <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-14">
            <div>
              <div className="mb-10 max-w-3xl">
                <h2 className="font-serif text-3xl font-bold uppercase tracking-wide text-stone-900 sm:text-4xl">
                  Shop
                </h2>
                <p className="mt-3 text-stone-600">
                  Live catalog from MongoDB — TVs, wireless and wired headphones,
                  speakers, monitors, wearables, and accessories. Add items to
                  your cart; totals are confirmed again at checkout.
                </p>
              </div>
              {productsLoading && (
                <p className="text-stone-600">Loading catalog…</p>
              )}
              {productsError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-900">
                  <p>{productsError}</p>
                  <button
                    type="button"
                    className="mt-2 font-bold underline"
                    onClick={() => {
                      setProductsLoading(true);
                      setProductsError(null);
                      fetchProducts()
                        .then(setProducts)
                        .catch((e) =>
                          setProductsError(
                            e instanceof Error ? e.message : 'Failed to load',
                          ),
                        )
                        .finally(() => setProductsLoading(false));
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}
              {!productsLoading && !productsError && (
                <ShopCatalog products={products} />
              )}

              <section
                id="trust"
                className="mt-20 scroll-mt-28 rounded-lg border border-stone-200 bg-white p-8 shadow-sm"
              >
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Built for demos &amp; portfolios
                </h3>
                <ul className="mt-4 space-y-2 text-stone-600">
                  <li>
                    <strong className="text-stone-800">React Hook Form + Zod</strong>{' '}
                    on shipping and OTP format; server validates again.
                  </li>
                  <li>
                    <strong className="text-stone-800">MongoDB</strong> stores
                    products, orders, and verification codes.
                  </li>
                  <li>
                    <strong className="text-stone-800">Server-side pricing</strong>{' '}
                    from product IDs so cart totals stay honest.
                  </li>
                </ul>
              </section>
            </div>
            <div className="lg:sticky lg:top-28">
              <CartSummary onCheckout={goCheckout} />
            </div>
          </div>
        )}

        {phase === 'checkout' && (
          <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:items-start">
            <section>
              <h1 className="font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
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
            <aside className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">
                Order total
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-stone-900">
                {formatPrice(displaySubtotal)}
              </p>
              {serverSubtotalCents != null && (
                <p className="mt-2 text-xs text-stone-500">
                  Subtotal after server repricing at checkout start (authoritative
                  for payment).
                </p>
              )}
              <p className="mt-4 text-sm text-stone-500">
                Tax and shipping are illustrative only in this demo.
              </p>
            </aside>
          </div>
        )}

        {phase === 'success' && (
          <div className="mx-auto max-w-lg rounded-lg border border-stone-200 bg-white px-8 py-14 text-center shadow-lg">
            <p className="text-5xl" aria-hidden>
              ✓
            </p>
            <h1 className="mt-6 font-serif text-3xl font-bold text-stone-900">
              You&apos;re verified
            </h1>
            <p className="mt-4 text-stone-600">
              Order confirmed on the server; inventory was updated. Your cart was
              cleared.
            </p>
            <button
              type="button"
              onClick={() => setPhase('shop')}
              className="mt-10 w-full rounded-md bg-stone-900 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800"
            >
              Back to shop
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-stone-300 bg-stone-200/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-serif text-lg font-bold text-stone-900">
                Northline Electronics
              </p>
              <p className="mt-2 text-sm text-stone-600">
                Demo store: React, React Hook Form, Zod, Fastify, MongoDB.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">
                Shop
              </p>
              <ul className="mt-3 space-y-2 text-sm text-stone-700">
                <li>
                  <a href="#categories" className="hover:underline">
                    All categories
                  </a>
                </li>
                <li>
                  <a href="#trust" className="hover:underline">
                    Why us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">
                Categories
              </p>
              <ul className="mt-3 space-y-2 text-sm text-stone-700">
                <li>TV &amp; home theater</li>
                <li>Wireless &amp; wired audio</li>
                <li>Speakers &amp; displays</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">
                Year
              </p>
              <p className="mt-3 text-sm text-stone-600">
                © {new Date().getFullYear()} Northline demo
              </p>
            </div>
          </div>
        </div>
      </footer>
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
