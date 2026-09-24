// Catalog for the unlisted Park Supply page (/park-supply). Prices are list
// prices in USD per unit; each line's price can still be overridden inside a
// proposal, so edit these to set the default, not to quote a one-off deal.

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
    sku: 'PWS-100', category: 'stations', price: 389, unit: 'each',
    name: 'Standard Pet Waste Station',
    desc: 'The all-in-one park staple: roll-bag dispenser, 10-gal lidded receptacle, and cleanup sign on a 7′ post.',
    specs: ['Powder-coated aluminum, rust-proof', 'Holds 800 roll bags', 'Includes 200 starter bags', 'In-ground post with anchor'],
  },
  {
    sku: 'PWS-200', category: 'stations', price: 549, unit: 'each',
    name: 'Heavy-Duty Station, 15-Gal',
    desc: 'Built for high-traffic trailheads and dog parks. Larger capacity means fewer service visits.',
    specs: ['14-gauge steel, powder-coated', '15-gal receptacle with self-closing lid', 'Holds 1,600 roll bags', 'Vandal-resistant hardware'],
  },
  {
    sku: 'PWS-300', category: 'stations', price: 459, unit: 'each',
    name: 'Recycled-Plastic Station',
    desc: 'Made from post-consumer recycled plastic. Will not rust, rot, or need repainting — ideal near water.',
    specs: ['100% recycled HDPE lumber', '10-gal receptacle', 'Holds 800 roll bags', 'Qualifies for green-procurement goals'],
  },
  {
    sku: 'PWS-050', category: 'stations', price: 219, unit: 'each',
    name: 'Compact Dispenser Station',
    desc: 'Dispenser and sign on a post, no receptacle — for locations already served by an existing trash can.',
    specs: ['Powder-coated aluminum', 'Holds 400 header bags', 'Includes 200 starter bags', '5′ post with anchor'],
  },

  // ── Dispensers ──
  {
    sku: 'DSP-R1', category: 'dispensers', price: 69, unit: 'each',
    name: 'Roll Bag Dispenser',
    desc: 'Tear-off roll dispenser that cuts waste — patrons take one bag at a time.',
    specs: ['Aluminum housing', 'Holds 2 rolls (400 bags)', 'Post or wall mount'],
  },
  {
    sku: 'DSP-H1', category: 'dispensers', price: 59, unit: 'each',
    name: 'Header Bag Dispenser',
    desc: 'Pull-one-bag header style, the most common municipal format.',
    specs: ['Aluminum housing', 'Holds 400 header bags', 'Post or wall mount'],
  },
  {
    sku: 'DSP-R2', category: 'dispensers', price: 99, unit: 'each',
    name: 'Dual-Roll Dispenser',
    desc: 'Double capacity for busy dog parks and trail entrances.',
    specs: ['Aluminum housing', 'Holds 4 rolls (800 bags)', 'Lockable refill door'],
  },

  // ── Receptacles ──
  {
    sku: 'RCP-10', category: 'receptacles', price: 149, unit: 'each',
    name: '10-Gal Receptacle with Lid',
    desc: 'Lidded can that keeps odor down and wildlife out.',
    specs: ['Powder-coated aluminum', 'Hinged lid', 'Post-mount bracket included'],
  },
  {
    sku: 'RCP-20', category: 'receptacles', price: 289, unit: 'each',
    name: '20-Gal Steel Receptacle',
    desc: 'Free-standing, high-capacity can for dog park entrances.',
    specs: ['Steel, powder-coated', 'Self-closing lid', 'Surface-mount anchor kit'],
  },

  // ── Bags & liners ──
  {
    sku: 'BAG-R2000', category: 'bags', price: 59, unit: 'case',
    name: 'Roll Bags — Case of 2,000',
    desc: 'Standard refill for roll dispensers.',
    specs: ['0.6 mil HDPE', '9″ × 13″', '10 rolls of 200'],
  },
  {
    sku: 'BAG-C1600', category: 'bags', price: 99, unit: 'case',
    name: 'Compostable Roll Bags — Case of 1,600',
    desc: 'Certified compostable option for sustainability-minded parks.',
    specs: ['ASTM D6400 certified', '9″ × 13″', '8 rolls of 200'],
  },
  {
    sku: 'BAG-H2000', category: 'bags', price: 54, unit: 'case',
    name: 'Header Bags — Case of 2,000',
    desc: 'Refill for header-style dispensers.',
    specs: ['0.6 mil HDPE', '8″ × 12″', '10 packs of 200'],
  },
  {
    sku: 'LNR-10', category: 'bags', price: 49, unit: 'case',
    name: 'Receptacle Liners — Case of 200',
    desc: 'Heavy-duty liners sized for 10–15 gal receptacles.',
    specs: ['1.2 mil', '24″ × 33″', 'Fits RCP-10 and station cans'],
  },

  // ── Signage & mounting ──
  {
    sku: 'SGN-1218', category: 'signage', price: 39, unit: 'each',
    name: '“Please Clean Up After Your Pet” Sign',
    desc: 'Standard 12″ × 18″ reflective aluminum cleanup sign.',
    specs: ['0.080″ aluminum', 'UV-resistant print', 'Pre-drilled'],
  },
  {
    sku: 'SGN-CUSTOM', category: 'signage', price: 89, unit: 'each',
    name: 'Custom Park-Branded Sign',
    desc: 'Your park name, logo, and local ordinance number printed on the sign.',
    specs: ['12″ × 18″ aluminum', 'Full-color custom print', 'Proof provided before production'],
  },
  {
    sku: 'SGN-RULES', category: 'signage', price: 69, unit: 'each',
    name: 'Dog Park Rules Sign',
    desc: '18″ × 24″ rules board: leash, vaccination, cleanup, and hours.',
    specs: ['0.080″ aluminum', 'Editable rule list', 'Pre-drilled'],
  },
  {
    sku: 'MNT-POST7', category: 'signage', price: 79, unit: 'each',
    name: '7′ Galvanized Post with Anchor',
    desc: 'Replacement or additional in-ground post.',
    specs: ['2″ square galvanized steel', 'In-ground anchor', 'Powder-coated finish'],
  },
  {
    sku: 'MNT-PLATE', category: 'signage', price: 45, unit: 'each',
    name: 'Surface-Mount Base Plate Kit',
    desc: 'Mount any station onto concrete or pavers — no digging.',
    specs: ['Steel base plate', 'Concrete anchors included'],
  },

  // ── Dog park amenities ──
  {
    sku: 'AMN-FOUNT', category: 'amenities', price: 1895, unit: 'each',
    name: 'Pedestal Drinking Fountain with Pet Bowl',
    desc: 'ADA-compliant human fountain with a ground-level pet bowl and push-button spigot.',
    specs: ['Powder-coated steel', 'Freeze-resistant valve option', 'Requires water line'],
  },
  {
    sku: 'AMN-AGILITY', category: 'amenities', price: 3450, unit: 'set',
    name: 'Dog Agility Course — 5 Piece',
    desc: 'Hurdle, weave poles, tunnel, stepping paws, and jump-through hoop.',
    specs: ['Recycled plastic and powder-coated steel', 'In-ground or surface mount', 'Commercial warranty'],
  },
  {
    sku: 'AMN-BENCH', category: 'amenities', price: 699, unit: 'each',
    name: '6′ Recycled-Plastic Park Bench',
    desc: 'Maintenance-free seating for dog park owners.',
    specs: ['Recycled HDPE slats', 'Steel frame', 'Surface-mount'],
  },
  {
    sku: 'AMN-SHADE', category: 'amenities', price: 4850, unit: 'each',
    name: 'Shade Structure, 12′ × 12′',
    desc: 'Hip-roof shade canopy — the most requested dog park upgrade in Florida heat.',
    specs: ['UV-blocking fabric', 'Galvanized steel frame', 'Engineered for 130 mph wind load'],
  },

  // ── Install & service ──
  {
    sku: 'SVC-INSTALL', category: 'services', price: 125, unit: 'per station',
    name: 'Station Installation',
    desc: 'Delivery, in-ground or surface install, and haul-away of packaging.',
    specs: ['Post set in concrete or anchored', 'Utility locate coordinated'],
  },
  {
    sku: 'SVC-ANNUAL', category: 'services', price: 420, unit: 'per station / yr',
    name: 'Annual Service Plan',
    desc: 'Monthly visits to refill bags, replace liners, and report damage.',
    specs: ['12 visits per year', 'Bags and liners included', 'Monthly service report'],
  },
];

export const PRODUCTS_BY_SKU = new Map(PRODUCTS.map((p) => [p.sku, p]));

export const PROPOSAL_VALID_DAYS = 30;

// localStorage key for the builder's draft. The admin's "Open in builder" writes
// a submission here so it can be edited and printed as a proposal.
export const DRAFT_STORAGE_KEY = 'll-park-supply-draft';
