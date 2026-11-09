// Client names shown on the home ticker and the consulting page.
export const REFERENCES = ['Engentfy', 'Feche Consulting', 'Reef Ntwrks', 'Lugo’s Craft Distillery', 'Riel Compliance Suite', 'Pronomy.io', 'Geros Studio'];

// Clients who sent their logo. Shown as the logo instead of initials on the consulting page.
// `fill`: the image carries its own background and fills the tile edge to edge. `caption`: text shown under the logo. `dark`: a light logo that needs a dark card. `chip`: a logo with its own dark background, shown as a tile.
// `ticker`: the homepage logo strip uses transparent, one-colour (brand ink) PNGs so every
// logo sits directly on the cream with no tiles behind it. `th` is its display height in px.
const T = (file, w, h, th, extra = {}) => ({ src: `/clients/ticker/${file}`, w, h, th, dark: false, chip: false, fill: false, ...extra });
export const CLIENT_LOGOS = {
  'Engentfy': { src: '/partners/engentfy/horizontal-blue.svg', w: 5913, h: 1456,
    ticker: T('engentfy.png', 592, 104, 22) },
  'Feche Consulting': { src: '/clients/feche-consulting.jpg', w: 600, h: 187,
    ticker: T('feche-consulting.png', 600, 160, 30) },
  'Riel Compliance Suite': { src: '/clients/riel-compliance-suite.jpg', w: 600, h: 181, chip: true,
    ticker: T('riel-compliance-suite.png', 372, 131, 30) },
  'Lugo’s Craft Distillery': { src: '/blog/lugos-craft-logo-on-dark.png', w: 640, h: 624, dark: true,
    ticker: T('lugos-craft-distillery.png', 180, 176, 46) },
  'Reef Ntwrks': { src: '/clients/reef-consulting.png', w: 242, h: 116,
    ticker: T('reef-consulting.png', 230, 104, 30) },
  'Pronomy.io': { src: '/clients/pronomy.jpg', w: 480, h: 480, dark: true, caption: 'Pronomy.io',
    ticker: T('pronomy.png', 156, 160, 30) },
  'Geros Studio': { src: '/clients/geros-studio.jpg', w: 600, h: 220, fill: true,
    ticker: T('geros-studio.png', 447, 59, 20) },
};

// Clients shown as gold script text instead of a logo. "Name - Subtitle" splits into two lines.
export const CLIENT_WORDMARKS = ['Dalitzandra Padial - Women Mentorship'];
