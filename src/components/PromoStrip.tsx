export function PromoStrip() {
  return (
    <div className="border-b border-amber-900/20 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-center text-sm text-amber-100">
      <p className="mx-auto max-w-5xl px-4 py-2">
        <span className="font-semibold text-amber-50">Spring showcase</span>
        {' · '}
        Free standard shipping on orders over $75 · 2-step verified checkout
      </p>
    </div>
  );
}
