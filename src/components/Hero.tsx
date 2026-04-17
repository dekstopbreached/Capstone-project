import { ChevronRight, Sparkles, Shirt, Ruler } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative h-[700px] w-full overflow-hidden bg-background font-sans text-white perspective preserve-3d">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
        aria-hidden
      />
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-transparent to-background/90" />

      {/* Breadcrumbs */}
      <nav className="absolute left-8 top-8 z-20 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
        <span className="hover:text-white cursor-pointer transition-colors">Home</span>
        <ChevronRight className="h-3 w-3 opacity-30" />
        <span className="hover:text-white cursor-pointer transition-colors">Shop</span>
        <ChevronRight className="h-3 w-3 opacity-30" />
        <span className="text-white">New Arrivals</span>
      </nav>

      {/* Main Content */}
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center preserve-3d">
        <div className="translate-z-40">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.5em] text-white/40">
            Premium Essentials
          </p>
          <h1 className="text-6xl font-black uppercase tracking-tighter sm:text-8xl lg:text-[10rem] leading-none drop-shadow-[0_20px_50px_rgba(0,0,0,1)]">
            <span className="block translate-z-20">New</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 translate-z-40">Arrivals</span>
          </h1>
        </div>
      </div>

      {/* Feature Badges Container */}
      <div className="absolute bottom-12 left-0 right-0 z-30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-4">
          <div className="flex items-center gap-3 glass px-6 py-3 rounded-full translate-z-20 transform hover:scale-105 transition-transform cursor-default">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">
              All-Day Comfort
            </span>
          </div>

          <div className="flex items-center gap-3 glass px-6 py-3 rounded-full translate-z-20 transform hover:scale-105 transition-transform cursor-default">
            <Shirt className="h-4 w-4 text-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">
              Fresh Style
            </span>
          </div>

          <div className="flex items-center gap-3 glass px-6 py-3 rounded-full translate-z-20 transform hover:scale-105 transition-transform cursor-default">
            <Ruler className="h-4 w-4 text-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">
              Easy Silhouettes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

