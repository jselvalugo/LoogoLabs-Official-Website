// Event posts that get pinned to the top of LoogoNews and rendered in the event's
// own black-and-gold finish instead of the default paper theme.

export const PINNED_EVENT_SLUGS = ['cards-and-cocktails-pokemon-event-lakeland'];

export const isEventPost = (post) => !!post && PINNED_EVENT_SLUGS.includes(post.slug);

export const EVENT_THEME = {
  ink: '#0F0D0A',
  inkLight: '#1C1A16',
  inkMid: '#2A2720',
  gold: '#C9952A',
  goldLight: '#E3B554',
  cream: '#F0EBE0',
  muted: '#B5A99A',
  border: 'rgba(201,149,42,.28)',
  logo: '/blog/lugos-craft-distillery-logo.png',
  serif: "'Playfair Display', 'Fraunces', Georgia, serif",
};

// Pinned event posts first, everything else keeps its published order.
export function pinEventPosts(posts) {
  return [...posts.filter(isEventPost), ...posts.filter((p) => !isEventPost(p))];
}
