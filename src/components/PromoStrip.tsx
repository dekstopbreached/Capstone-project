import { Truck, RefreshCcw, Globe } from 'lucide-react';

export function PromoStrip() {
  return (
    <div className="bg-black text-[10px] font-black uppercase tracking-[0.25em] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <span className="flex items-center gap-2">
          <Truck className="h-3 w-3" />
          Free shipping on orders over $150
        </span>
        <span className="hidden h-3 w-px bg-white/20 sm:inline-block" />
        <span className="flex items-center gap-2">
          <RefreshCcw className="h-3 w-3" />
          30-day extended returns
        </span>
        <span className="hidden h-3 w-px bg-white/20 sm:inline-block" />
        <span className="flex items-center gap-2 underline underline-offset-4 decoration-white/30">
          <Globe className="h-3 w-3" />
          Global doorstep delivery
        </span>
      </div>
    </div>
  );
}
