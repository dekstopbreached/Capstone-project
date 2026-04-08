type Props = {
  onBrowse: () => void;
};

export function Hero({ onBrowse }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-stone-200 bg-stone-900 text-stone-100">
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1920&q=80')] bg-cover bg-center opacity-40"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-900/85 to-stone-950/90" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
          Electronics &amp; home
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Everything for your living room, desk, and commute.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-300">
          Browse TVs, wireless and wired headphones, speakers, monitors, and
          accessories. Prices and inventory are served from our API; checkout
          uses secure two-step verification.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={onBrowse}
            className="rounded-md bg-amber-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-900/30 transition hover:bg-amber-500"
          >
            Shop the catalog
          </button>
          <a
            href="#categories"
            className="inline-flex items-center rounded-md border border-stone-500 px-8 py-3.5 text-base font-semibold text-stone-200 transition hover:border-stone-300 hover:text-white"
          >
            Jump to categories
          </a>
        </div>
        <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-stone-600/50 pt-10 text-center sm:text-left">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Catalog
            </dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-white">
              20+ SKUs
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Checkout
            </dt>
            <dd className="mt-1 text-2xl font-bold text-white">2-step</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Stack
            </dt>
            <dd className="mt-1 text-sm font-semibold leading-snug text-stone-300">
              React · Zod · MongoDB
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
