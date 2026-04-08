export type Product = {
  id: string;
  name: string;
  tagline: string;
  priceCents: number;
  image: string;
  /** Display section on the storefront */
  category?: string;
};

/** Canonical catalog (seeded into MongoDB; API is source of truth for prices). */
export const catalog: Product[] = [
  // TV & home theater
  {
    id: 'tv-oled-55',
    name: 'Vision OLED 55"',
    tagline: '4K HDR, 120Hz, smart TV',
    priceCents: 129900,
    category: 'TV & home theater',
    image:
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=85',
  },
  {
    id: 'tv-qled-65',
    name: 'Cinema QLED 65"',
    tagline: 'Quantum dot, Dolby Vision',
    priceCents: 159900,
    category: 'TV & home theater',
    image:
      'https://images.unsplash.com/photo-1461158534269-385e2c604af0?w=800&q=85',
  },
  {
    id: 'tv-frame-50',
    name: 'Gallery Frame 50"',
    tagline: 'Art mode, 4K, slim wall mount',
    priceCents: 99800,
    category: 'TV & home theater',
    image:
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=85',
  },
  {
    id: 'soundbar-atmos',
    name: 'Arcus Soundbar Pro',
    tagline: 'Dolby Atmos, wireless sub',
    priceCents: 64900,
    category: 'TV & home theater',
    image:
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=85',
  },
  // Wireless headphones & earbuds
  {
    id: 'pulse-buds',
    name: 'Pulse Buds Pro',
    tagline: 'ANC, 32h case',
    priceCents: 19900,
    category: 'Wireless audio',
    image:
      'https://images.unsplash.com/photo-1590658268037-6bf1215a87df?w=800&q=85',
  },
  {
    id: 'sky-air-max',
    name: 'Sky Air Max',
    tagline: 'Over-ear ANC, 40h battery',
    priceCents: 34900,
    category: 'Wireless audio',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=85',
  },
  {
    id: 'nova-sport-buds',
    name: 'Nova Sport Buds',
    tagline: 'IPX7, secure fit',
    priceCents: 12900,
    category: 'Wireless audio',
    image:
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=85',
  },
  {
    id: 'echo-open-ear',
    name: 'Echo Open Ear',
    tagline: 'Spatial audio, multipoint',
    priceCents: 17900,
    category: 'Wireless audio',
    image:
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=85',
  },
  // Wired headphones
  {
    id: 'studio-mk3-wired',
    name: 'Studio MK3 Wired',
    tagline: '50mm drivers, detachable cable',
    priceCents: 24900,
    category: 'Wired headphones',
    image:
      'https://images.unsplash.com/photo-1487215048424-0662f68e0c22?w=800&q=85',
  },
  {
    id: 'reference-closed',
    name: 'Reference Closed',
    tagline: 'Neutral sound, for creators',
    priceCents: 39900,
    category: 'Wired headphones',
    image:
      'https://images.unsplash.com/photo-1524678606370-a47ad79cb4e5?w=800&q=85',
  },
  {
    id: 'gaming-h7',
    name: 'H7 Gaming Headset',
    tagline: 'USB-C DAC, mic mute',
    priceCents: 11900,
    category: 'Wired headphones',
    image:
      'https://images.unsplash.com/photo-1612444535882-620470398ea6?w=800&q=85',
  },
  {
    id: 'in-ear-monitors',
    name: 'IEM Performer',
    tagline: 'Dual BA, stage-ready',
    priceCents: 28900,
    category: 'Wired headphones',
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=85',
  },
  // Speakers & portable
  {
    id: 'bloom-speaker',
    name: 'Bloom Portable',
    tagline: '360° sound, 20h playtime',
    priceCents: 15900,
    category: 'Speakers',
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e2?w=800&q=85',
  },
  {
    id: 'tower-elite',
    name: 'Tower Elite',
    tagline: 'Hi-Fi floor standing pair',
    priceCents: 89900,
    category: 'Speakers',
    image:
      'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&q=85',
  },
  {
    id: 'desk-sound-cube',
    name: 'Desk Sound Cube',
    tagline: 'Bluetooth 5.3, aux in',
    priceCents: 7900,
    category: 'Speakers',
    image:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=85',
  },
  // Monitors & desk
  {
    id: 'ultrawide-34',
    name: 'UltraWide 34"',
    tagline: '3440×1440, 144Hz, HDR400',
    priceCents: 74900,
    category: 'Displays & desk',
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=85',
  },
  {
    id: 'pro-monitor-27',
    name: 'Pro Color 27"',
    tagline: '4K, 99% DCI-P3',
    priceCents: 62900,
    category: 'Displays & desk',
    image:
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=85',
  },
  {
    id: 'lumen-lamp',
    name: 'Lumen Desk',
    tagline: 'Warm dim, USB-C',
    priceCents: 8900,
    category: 'Displays & desk',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=85',
  },
  // Wearables & accessories
  {
    id: 'orbit-watch',
    name: 'Orbit Steel',
    tagline: 'Sapphire, 5ATM',
    priceCents: 32900,
    category: 'Wearables',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=85',
  },
  {
    id: 'neo-pack',
    name: 'Neo Daypack',
    tagline: 'Weather-sealed, 18L',
    priceCents: 14800,
    category: 'Bags & travel',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=85',
  },
  {
    id: 'charge-station',
    name: 'Charge Station Duo',
    tagline: 'Qi2, 3-device',
    priceCents: 5900,
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1587825140708-dfaf288af4ce?w=800&q=85',
  },
  {
    id: 'usb-c-hub',
    name: 'USB-C Hub Pro',
    tagline: '10 ports, 100W PD',
    priceCents: 9900,
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1625948515291bf49fdd7533d8?w=800&q=85',
  },
  {
    id: 'mechanical-keyboard',
    name: 'Typewriter MK2',
    tagline: 'Hot-swap, tactile',
    priceCents: 18900,
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=85',
  },
];
