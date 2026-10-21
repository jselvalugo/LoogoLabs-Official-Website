// Client names shown on the home ticker and the consulting page.
export const REFERENCES = ['Feche Consulting', 'Reef Ntwrks', 'Lugo’s Craft Distillery', 'Riel Compliance Suite', 'Pronomy.io'];

// Clients who sent their logo. Shown as the logo instead of initials on the consulting page.
// `caption`: text shown under the logo. `dark`: a light logo that needs a dark card. `chip`: a logo with its own dark background, shown as a tile.
export const CLIENT_LOGOS = {
  'Feche Consulting': { src: '/clients/feche-consulting.jpg', w: 600, h: 187 },
  'Riel Compliance Suite': { src: '/clients/riel-compliance-suite.jpg', w: 600, h: 181, chip: true },
  'Lugo’s Craft Distillery': { src: '/blog/lugos-craft-logo-on-dark.png', w: 640, h: 624, dark: true },
  'Reef Ntwrks': { src: '/clients/reef-consulting.png', w: 242, h: 116 },
  'Pronomy.io': { src: '/clients/pronomy.jpg', w: 480, h: 480, dark: true, caption: 'Pronomy.io' },
};

// Clients shown as gold script text instead of a logo. "Name - Subtitle" splits into two lines.
export const CLIENT_WORDMARKS = ['Dalitzandra Padial - Women Mentorship'];
