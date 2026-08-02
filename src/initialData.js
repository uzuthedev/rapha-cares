let nextId = 10;
export const genId = () => nextId++;

export const INITIAL_THERAPISTS = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    role: 'Therapist',
    credentials: 'PhD, LMFT',
    location: 'Austin, TX · Telehealth available',
    focus: 'Anxiety, grief, faith integration',
    price: '$140 / session',
    bio: "Hi, I'm Dr. Sarah. I walk alongside Christians navigating anxiety and loss, weaving Scripture and evidence-based care into a space where you never have to choose between your faith and your healing.",
    calendly: 'https://calendly.com/rapha-cares/dr-sarah-mitchell',
    imageUrl: '',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Therapist',
    credentials: 'MA, LPC',
    location: 'Chicago, IL · In-person & online',
    focus: "Depression, burnout, men's ministry",
    price: '$120 / session',
    bio: "Hi, I'm Marcus. I help men and young adults who feel stuck or ashamed to name what they're carrying—because God's grace meets us in the honest places, not only the polished ones.",
    calendly: 'https://calendly.com/rapha-cares/marcus-chen',
    imageUrl: '',
  },
  {
    id: 3,
    name: 'Elena Vasquez',
    role: 'Therapist',
    credentials: 'PsyD, LMHC',
    location: 'Miami, FL · Bilingual (EN/ES)',
    focus: 'Trauma, relationships, spiritual abuse recovery',
    price: '$155 / session',
    bio: "Hi, I'm Elena. My practice is a gentle refuge for those healing from trauma or church hurt, where Christ's compassion and clinical expertise work together at your pace.",
    calendly: 'https://calendly.com/rapha-cares/elena-vasquez',
    imageUrl: '',
  },
];

export const INITIAL_PSYCHIATRISTS = [
  {
    id: 4,
    name: 'Dr. James Whitfield',
    role: 'Psychiatrist',
    credentials: 'MD, Board-Certified Psychiatrist',
    location: 'Nashville, TN · Telehealth',
    focus: 'Medication management, mood disorders',
    price: '$250 / initial · $175 follow-up',
    bio: "Hi, I'm Dr. Whitfield. I partner with patients and pastors alike to provide thoughtful psychiatric care that honors both your biology and your belief that you are fearfully and wonderfully made.",
    calendly: 'https://calendly.com/rapha-cares/dr-james-whitfield',
    imageUrl: '',
  },
  {
    id: 5,
    name: 'Dr. Amina Okonkwo',
    role: 'Psychiatrist',
    credentials: 'DO, Child & Adolescent Psychiatry',
    location: 'Atlanta, GA · Hybrid',
    focus: 'ADHD, anxiety in teens, family-centered care',
    price: '$275 / initial · $190 follow-up',
    bio: "Hi, I'm Dr. Okonkwo. Families come to me when a young person is struggling—I offer medical expertise wrapped in prayerful patience, always including parents in the journey when appropriate.",
    calendly: 'https://calendly.com/rapha-cares/dr-amina-okonkwo',
    imageUrl: '',
  },
];

export const INITIAL_TEAM = [
  {
    id: 101,
    name: 'Grace Holloway',
    title: 'Founder & Director',
    bio: 'Grace started Rapha Cares after her own season of anxiety and isolation, believing every believer deserves a safe path to healing.',
    imageUrl: '',
  },
  {
    id: 102,
    name: 'Pastor David Reyes',
    title: 'Pastoral Care Advisor',
    bio: 'David bridges church communities and clinical care, ensuring spiritual support stays woven into every referral.',
    imageUrl: '',
  },
  {
    id: 103,
    name: 'Naomi Park',
    title: 'Community & Prayer Lead',
    bio: 'Naomi coordinates prayer requests and peer support, creating spaces where no one walks alone.',
    imageUrl: '',
  },
];

export const INITIAL_RESOURCES = [
  {
    id: 6,
    title: 'The Anxious Christian',
    author: 'Rhett Smith',
    note: 'Faith-forward tools for worry and anxious thoughts',
    category: 'Books',
    linkUrl: 'https://www.amazon.com/s?k=The+Anxious+Christian+Rhett+Smith',
  },
  {
    id: 7,
    title: 'When Faith Feels Thin',
    author: 'Tim Keller Archive',
    note: 'Hope and comfort in seasons of spiritual darkness',
    category: 'Sermons',
    linkUrl: 'https://www.youtube.com/results?search_query=When+Faith+Feels+Thin+Tim+Keller',
  },
  {
    id: 8,
    title: 'Peace Be Still',
    author: 'Lauren Daigle',
    note: 'Worship for weary, anxious hearts',
    category: 'Music',
    linkUrl: 'https://www.youtube.com/results?search_query=Peace+Be+Still+Lauren+Daigle',
  },
  {
    id: 9,
    title: 'Try Softer',
    author: 'Aundi Kolber',
    note: 'Gentle, trauma-informed practices for overwhelmed souls',
    category: 'Books',
    linkUrl: 'https://www.amazon.com/s?k=Try+Softer+Aundi+Kolber',
  },
];
