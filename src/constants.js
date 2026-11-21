export const ADMIN_PASS = 'rapha2026';

export const WELCOME_TEXT =
  "Welcome to Rapha Cares, you're here because a part of you believes God cares about your mental health, enough to put this together for you. We know how lonely and overwhelming this journey can be but we're so happy you made it here. Feel free to explore the resources we have, we're here to support you every step of the way";

export const TAGLINE =
  'Compassionate Christian mental health resources curated with care, held in prayer.';

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'therapy', label: 'Therapy' },
  { id: 'psychiatrists', label: 'Psychiatrists' },
  { id: 'support', label: 'Other Support' },
  { id: 'resources', label: 'Resources' },
];

export const RESOURCE_CATEGORIES = ['Books', 'Sermons', 'Music'];

export const DEFAULT_RESOURCE_CATEGORIES = [
  'Books',
  'Sermons',
  'Music',
  'Podcasts',
  'Articles',
  'Workbooks',
  'Mobile Apps',
  'Crisis Lines',
];

export const INITIAL_SITE_SETTINGS = {
  tagline: TAGLINE,
  welcomeText: WELCOME_TEXT,
  announcementText: '',
  announcementActive: false,
  aboutTitle: 'About Rapha Cares',
  aboutP1:
    'Rapha means "healing" in Hebrew, and that is the heart behind everything we do. We believe God cares deeply about your mental health, and that faith and professional care can walk hand in hand.',
  aboutP2:
    'This platform was born from a simple conviction: no one should have to navigate anxiety, depression, or spiritual loneliness alone. We curate trusted Christian therapists, psychiatrists, prayer support, and soul-nourishing resources, all in one gentle, welcoming place.',
  aboutHighlight: 'You are seen. You are loved. You belong here.',
  prayerCallUrl: 'https://calendly.com/weareraphacares/30min',
  peerSupportUrl: 'https://calendly.com/weareraphacares/30min',
  safetyNotice:
    'This website is a resource directory, not a crisis line. If you are experiencing a mental health emergency, please dial 988 immediately.',
};

export const SERVICES = [
  {
    id: 'therapy',
    title: 'Christian Therapy',
    description: 'Faith-honoring counseling for anxiety, grief, trauma, and more.',
  },
  {
    id: 'psychiatrists',
    title: 'Psychiatry Referrals',
    description: 'Medical professionals for evaluation and medication when needed.',
  },
  {
    id: 'support',
    title: 'Other Support',
    description: 'Prayer requests, live prayer calls, and peer support connections.',
  },
  {
    id: 'resources',
    title: 'Resources',
    description: 'Curated books, sermons, and music for soul care.',
  },
];
