export const SITE_CONFIG = {
  title: 'Nutanix Vibes',
  description: 'Good Vibes, Great Infrastructure',
  cover: 'assets/images/about-hero.jpg',
  logo: 'assets/images/cropped-image.jpg',
  logoDark: 'assets/images/cropped-image.jpg',
  favicon: 'assets/images/cropped-image.jpg',
  navigation: true,
  subscribers: false,
  xUsername: 'nutanixguy',
  facebook: false,
  github: 'nutanixguy',
  linkedin: 'https://www.linkedin.com/in/jamieterrell/',
  email: 'jamie@nutanixguy.com',
  disqus: false,
  wordsPerMinute: 200,
  pageSize: 10,
};

export function getAssetUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }
  const base = import.meta.env.BASE_URL;
  const cleanPath = path.replace(/^\//, '');
  return `${base}${cleanPath}`;
}

export function getExcerpt(content: string, limit = 33): string {
  const stripped = content
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`_\[\]()\-+!]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const words = stripped.split(' ');
  if (words.length <= limit) return stripped;
  return words.slice(0, limit).join(' ') + '...';
}

export function getReadingTime(content: string, wpm = SITE_CONFIG.wordsPerMinute): string {
  const stripped = content.replace(/<[^>]*>/g, '').trim();
  if (!stripped) return '1 min read';
  const words = stripped.split(/\s+/).length;
  if (words <= wpm) {
    return '1 min read';
  }
  return `${Math.ceil(words / wpm)} min read`;
}
