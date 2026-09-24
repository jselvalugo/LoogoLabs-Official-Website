// Catalog for the unlisted Park Supply page (/park-supply). Prices are list
// prices in USD per unit; each line's price can still be overridden inside a
// proposal, so edit these to set the default, not to quote a one-off deal.
//
// `image` is optional; products without one fall back to a category icon.
// JPG photos are cropped from the supplier's 2023 street-furniture product
// atlas, and `model` is that product's number in the atlas. Keep those specs
// to what the atlas states (model, dimensions, visible features). SVGs marked
// `illustration` are drawn stand-ins for products the atlas doesn't carry.

export const CATEGORIES = [
  { id: 'stations', label: 'Complete Stations' },
  { id: 'dispensers', label: 'Bag Dispensers' },
  { id: 'receptacles', label: 'Waste Receptacles' },
  { id: 'bags', label: 'Bags & Liners' },
  { id: 'signage', label: 'Signage & Mounting' },
  { id: 'amenities', label: 'Dog Park Amenities' },
  { id: 'services', label: 'Install & Service' },
];

export const PRODUCTS = [
  // ── Complete stations ──
  {
    sku: 'PWS-100', category: 'stations', price: 389, unit: 'each', model: 'HBD002',
    name: 'Standard Pet Waste Station',
    image: '/park-supply/pws-100.jpg',
    desc: 'The all-in-one park staple: bag dispenser, lidded perforated receptacle, and cleanup sign on one post.',
    specs: ['6′7″ tall overall (300 × 300 × 2000 mm)', 'Lidded perforated receptacle', 'Includes 200 starter bags', 'Color, sign, and logo customizable'],
  },
  {
    sku: 'PWS-200', category: 'stations', price: 549, unit: 'each', model: 'HBD003',
    name: 'Heavy-Duty Locking Station',
    image: '/park-supply/pws-200.jpg',
    desc: 'Built for high-traffic trailheads and dog parks: a keyed cabinet receptacle that resists tampering and wildlife.',
    specs: ['6′7″ tall overall (300 × 150 × 2000 mm)', 'Keyed-lock receptacle cabinet', 'Dispenser, cleanup sign, and topper sign', 'Surface-mount base plate'],
  },
  {
    sku: 'PWS-300', category: 'stations', price: 459, unit: 'each',
    name: 'Recycled-Plastic Station',
    image: '/park-supply/pws-300.svg', illustration: true,
    desc: 'Made from post-consumer recycled plastic. Will not rust, rot, or need repainting — ideal near water.',
    specs: ['100% recycled HDPE lumber', '10-gal receptacle', 'Holds 800 roll bags', 'Qualifies for green-procurement goals'],
  },
  {
    sku: 'PWS-050', category: 'stations', price: 219, unit: 'each', model: 'HBD002',
    name: 'Compact Dispenser Station',
    image: '/park-supply/pws-050.jpg',
    desc: 'Dispenser and sign on a post, no receptacle — for locations already served by an existing trash can.',
    specs: ['6′7″ tall overall (250 × 2000 mm)', 'Keyed-lock dispenser', 'Includes 200 starter bags', 'Surface-mount base plate'],
  },

  // ── Dispensers ──
  {
    sku: 'DSP-R1', category: 'dispensers', price: 69, unit: 'each', model: 'HBD220104',
    name: 'Roll Bag Dispenser',
    image: '/park-supply/dsp-r1.jpg',
    desc: 'Tear-off roll dispenser that cuts waste — patrons take one bag at a time.',
    specs: ['5.9″ × 5.9″ × 14.2″ (150 × 150 × 360 mm)', 'Keyed-lock refill door', 'Post or wall mount'],
  },
  {
    sku: 'DSP-H1', category: 'dispensers', price: 59, unit: 'each', model: 'HBD004',
    name: 'Header Bag Dispenser',
    image: '/park-supply/dsp-h1.jpg',
    desc: 'Pull-one-bag header style, the most common municipal format.',
    specs: ['10.2″ × 15.7″ × 5.9″ (260 × 400 × 150 mm)', 'Front pull-through opening', 'Post or wall mount'],
  },
  {
    sku: 'DSP-R2', category: 'dispensers', price: 99, unit: 'each',
    name: 'Dual-Roll Dispenser',
    image: '/park-supply/dsp-r2.svg', illustration: true,
    desc: 'Double capacity for busy dog parks and trail entrances.',
    specs: ['Aluminum housing', 'Holds 4 rolls (800 bags)', 'Lockable refill door'],
  },

  // ── Receptacles ──
  {
    sku: 'RCP-10', category: 'receptacles', price: 149, unit: 'each', model: 'HBD928',
    name: 'Hooded Pedestal Receptacle',
    image: '/park-supply/rcp-10.jpg',
    desc: 'Hooded can on a pedestal: the covered opening keeps rain out and odor down.',
    specs: ['Hooded top opening', 'Pedestal with surface-mount base plate', 'Color and logo customizable'],
  },
  {
    sku: 'RCP-20', category: 'receptacles', price: 289, unit: 'each', model: 'HBS869',
    name: 'Slatted Steel Receptacle',
    image: '/park-supply/rcp-20.jpg',
    desc: 'Free-standing, high-capacity can for dog park entrances.',
    specs: ['26.8″ dia × 36″ tall (680 × 914 mm)', 'Slatted steel body with flat lid', 'Black, green, or blue'],
  },

  // ── Bags & liners ──
  {
    sku: 'BAG-R2000', category: 'bags', price: 59, unit: 'case',
    name: 'Roll Bags — Case of 2,000',
    image: '/park-supply/bag-r2000.svg', illustration: true,
    desc: 'Standard refill for roll dispensers.',
    specs: ['0.6 mil HDPE', '9″ × 13″', '10 rolls of 200'],
  },
  {
    sku: 'BAG-C1600', category: 'bags', price: 99, unit: 'case',
    name: 'Compostable Roll Bags — Case of 1,600',
    image: '/park-supply/bag-c1600.svg', illustration: true,
    desc: 'Certified compostable option for sustainability-minded parks.',
    specs: ['ASTM D6400 certified', '9″ × 13″', '8 rolls of 200'],
  },
  {
    sku: 'BAG-H2000', category: 'bags', price: 54, unit: 'case',
    name: 'Header Bags — Case of 2,000',
    image: '/park-supply/bag-h2000.svg', illustration: true,
    desc: 'Refill for header-style dispensers.',
    specs: ['0.6 mil HDPE', '8″ × 12″', '10 packs of 200'],
  },
  {
    sku: 'LNR-10', category: 'bags', price: 49, unit: 'case',
    name: 'Receptacle Liners — Case of 200',
    image: '/park-supply/lnr-10.svg', illustration: true,
    desc: 'Heavy-duty liners sized for 10–15 gal receptacles.',
    specs: ['1.2 mil', '24″ × 33″', 'Fits RCP-10 and station cans'],
  },

  // ── Signage & mounting ──
  {
    sku: 'SGN-1218', category: 'signage', price: 39, unit: 'each',
    name: '“Please Clean Up After Your Pet” Sign',
    image: '/park-supply/sgn-1218.svg', illustration: true,
    desc: 'Standard 12″ × 18″ reflective aluminum cleanup sign.',
    specs: ['0.080″ aluminum', 'UV-resistant print', 'Pre-drilled'],
  },
  {
    sku: 'SGN-CUSTOM', category: 'signage', price: 89, unit: 'each',
    name: 'Custom Park-Branded Sign',
    image: '/park-supply/sgn-custom.svg', illustration: true,
    desc: 'Your park name, logo, and local ordinance number printed on the sign.',
    specs: ['12″ × 18″ aluminum', 'Full-color custom print', 'Proof provided before production'],
  },
  {
    sku: 'SGN-RULES', category: 'signage', price: 69, unit: 'each',
    name: 'Dog Park Rules Sign',
    image: '/park-supply/sgn-rules.svg', illustration: true,
    desc: '18″ × 24″ rules board: leash, vaccination, cleanup, and hours.',
    specs: ['0.080″ aluminum', 'Editable rule list', 'Pre-drilled'],
  },
  {
    sku: 'MNT-POST7', category: 'signage', price: 79, unit: 'each',
    name: '7′ Galvanized Post with Anchor',
    image: '/park-supply/mnt-post7.svg', illustration: true,
    desc: 'Replacement or additional in-ground post.',
    specs: ['2″ square galvanized steel', 'In-ground anchor', 'Powder-coated finish'],
  },
  {
    sku: 'MNT-PLATE', category: 'signage', price: 45, unit: 'each',
    name: 'Surface-Mount Base Plate Kit',
    image: '/park-supply/mnt-plate.svg', illustration: true,
    desc: 'Mount any station onto concrete or pavers — no digging.',
    specs: ['Steel base plate', 'Concrete anchors included'],
  },

  // ── Dog park amenities ──
  {
    sku: 'AMN-FOUNT', category: 'amenities', price: 1895, unit: 'each',
    name: 'Pedestal Drinking Fountain with Pet Bowl',
    image: '/park-supply/amn-fount.svg', illustration: true,
    desc: 'ADA-compliant human fountain with a ground-level pet bowl and push-button spigot.',
    specs: ['Powder-coated steel', 'Freeze-resistant valve option', 'Requires water line'],
  },
  {
    sku: 'AMN-AGILITY', category: 'amenities', price: 3450, unit: 'set',
    name: 'Dog Agility Course — 5 Piece',
    image: '/park-supply/amn-agility.svg', illustration: true,
    desc: 'Hurdle, weave poles, tunnel, stepping paws, and jump-through hoop.',
    specs: ['Recycled plastic and powder-coated steel', 'In-ground or surface mount', 'Commercial warranty'],
  },
  {
    sku: 'AMN-BENCH', category: 'amenities', price: 699, unit: 'each', model: 'HCW426',
    name: '6′ Wood-Slat Park Bench',
    image: '/park-supply/amn-bench.jpg',
    desc: 'Contoured wood-slat seating with a backrest for dog park owners.',
    specs: ['71.7″ × 23.6″ × 31.5″ tall (1820 × 600 × 800 mm)', 'Wood slats on a metal frame', 'Color, material, and size customizable'],
  },
  {
    sku: 'AMN-SHADE', category: 'amenities', price: 4850, unit: 'each',
    name: 'Shade Structure, 12′ × 12′',
    image: '/park-supply/amn-shade.svg', illustration: true,
    desc: 'Hip-roof shade canopy — the most requested dog park upgrade in Florida heat.',
    specs: ['UV-blocking fabric', 'Galvanized steel frame', 'Engineered for 130 mph wind load'],
  },

  // ── Install & service ──
  {
    sku: 'SVC-INSTALL', category: 'services', price: 125, unit: 'per station',
    name: 'Station Installation',
    image: '/park-supply/svc-install.svg', illustration: true,
    desc: 'Delivery, in-ground or surface install, and haul-away of packaging.',
    specs: ['Post set in concrete or anchored', 'Utility locate coordinated'],
  },
  {
    sku: 'SVC-ANNUAL', category: 'services', price: 420, unit: 'per station / yr',
    name: 'Annual Service Plan',
    image: '/park-supply/svc-annual.svg', illustration: true,
    desc: 'Monthly visits to refill bags, replace liners, and report damage.',
    specs: ['12 visits per year', 'Bags and liners included', 'Monthly service report'],
  },
];

export const PRODUCTS_BY_SKU = new Map(PRODUCTS.map((p) => [p.sku, p]));

export const PROPOSAL_VALID_DAYS = 30;

// localStorage key for the builder's draft. The admin's "Open in builder" writes
// a submission here so it can be edited and printed as a proposal.
export const DRAFT_STORAGE_KEY = 'll-park-supply-draft';
