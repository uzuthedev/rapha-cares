import { useState } from 'react';
import {
  Heart,
  Play,
  X,
  ArrowRight,
  Sun,
  Moon,
  Users,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { TAGLINE, SERVICES } from '../constants';
import TruncatedBio from './TruncatedBio';
import heroFounderImg from '../assets/hero-founder.png';

const CURATED_RESOURCES = [
  {
    id: 'anxiety-1',
    category: 'Anxiety',
    iconType: 'sun',
    meta: 'ANXIETY • 5 MIN READ',
    title: 'When worry feels louder than faith',
    description:
      'A gentle reflection on anxiety, trust, and making room for both prayer and practical support.',
    scripture: 'Psalm 94:19 — "When anxiety was great within me, your consolation brought me joy."',
    content: `Many Christians carry a secret burden: the belief that if their faith were stronger, their anxiety would vanish. But Scripture tells a much gentler story.

God designed our bodies with nervous systems that respond to stress, trauma, and exhaustion. Experiencing anxiety is not a sign of spiritual failure—it is often a signal that you have been carrying too much for too long.

When worry feels overwhelming, remember that God does not ask you to conquer it through sheer willpower. Instead, Scripture invites us to bring our honest tremble before Him. Taking medication, seeking licensed Christian counseling, and practicing calming breathing are not opposites of faith; they are tools of God's common grace working alongside your healing.

Take a slow breath today. You are held, even when your thoughts feel scattered.`,
  },
  {
    id: 'depression-1',
    category: 'Depression',
    iconType: 'moon',
    meta: 'DEPRESSION • 8 MIN READ',
    title: 'God meets us in the heaviness',
    description:
      'Words for the days when hope feels distant, with grounded steps toward care and connection.',
    scripture: '1 Kings 19:5 — "All at once an angel touched him and said, ‘Get up and eat.’"',
    content: `When the prophet Elijah was overwhelmed to the point of asking God to take his life, God did not rebuke him. He did not deliver a theological lecture. 

Instead, God sent an angel with warm bread, fresh water, and the permission to sleep. God tended to Elijah's physical body and weary mind before speaking to his spirit in a gentle whisper.

If you are walking through the gray fog of depression today, release the pressure to produce a triumphant faith. God is near to the brokenhearted. Small steps matter: drinking water, stepping into sunlight, sending a one-line text to a trusted friend, or scheduling a visit with a medical professional.

Your worth to God is not measured by your emotional energy. You are beloved even in the quiet dark.`,
  },
  {
    id: 'relationships-1',
    category: 'Relationships',
    iconType: 'users',
    meta: 'RELATIONSHIPS • AUDIO • 12 MIN',
    title: 'The grace of honest conversation',
    description:
      'A guided practice for speaking truth with tenderness in the relationships that matter most.',
    scripture: 'Ephesians 4:15 — "Speaking the truth in love, we will grow to become in every respect the mature body of him who is the head."',
    content: `Relationships within Christian families and communities often stumble over a false choice: harsh honesty or silent resentment. True biblical peace-making is neither.

Jesus modeled a love that was profoundly candid yet completely tender. Communicating honestly about church hurt, relational burnout, or mental health struggles requires courage, but it also creates space for authentic healing.

In this guided reflection, we invite you to pause, examine what you are afraid to voice, and practice naming your needs with gentle clarity. When we stop pretending to be invulnerable, grace finally finds room to work between us.`,
  },
];

function TeamCard({ member }) {
  const initials = member.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  return (
    <article className="section-arch-card overflow-hidden text-center flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div>
        <div className="arch-header">
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              className="mx-auto h-24 w-24 rounded-full object-cover shadow-sm bg-white border border-[#EBE4D8]"
            />
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white font-serif text-3xl font-bold text-rc-forest-dark shadow-sm border border-[#EBE4D8]">
              {initials}
            </div>
          )}
        </div>
        <div className="px-6 pb-6 pt-2">
          <h3 className="font-serif text-xl font-bold text-rc-forest-dark">{member.name}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-rc-terracotta">
            {member.title}
          </p>
          <TruncatedBio text={member.bio} maxLength={90} className="mt-3 text-rc-muted leading-relaxed" />
        </div>
      </div>
    </article>
  );
}

export default function HomePage({ team = [], onNavigate, siteSettings }) {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All resources');
  const [readingResource, setReadingResource] = useState(null);

  const tagline =
    siteSettings?.tagline ||
    'Compassionate Christian mental health resources curated with care, held in prayer.';
  const aboutP1 =
    siteSettings?.aboutP1 ||
    'We believe God cares deeply about your mental health, and that faith and professional care can walk hand in hand.';
  const aboutP2 =
    siteSettings?.aboutP2 ||
    'This platform was born from a simple conviction: no one should have to navigate anxiety, depression, or spiritual loneliness alone. We curate trusted Christian therapists, psychiatrists, prayer support, and soul-nourishing resources, all in one gentle, welcoming place.';
  const aboutHighlight =
    siteSettings?.aboutHighlight || 'You are seen. You are loved. You belong here.';

  const filteredCuratedResources =
    activeCategoryFilter === 'All resources'
      ? CURATED_RESOURCES
      : CURATED_RESOURCES.filter(
          (r) => r.category.toLowerCase() === activeCategoryFilter.toLowerCase()
        );

  return (
    <>
      {/* ===================== HERO SECTION (MATCHING FIGMA) ===================== */}
      <section className="relative overflow-hidden bg-[#F9F5EF] pt-8 pb-16 lg:pt-16 lg:pb-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7">
              {/* Overline */}
              <div className="flex items-center gap-3 mb-6">
                <span className="h-[1.5px] w-6 bg-rc-terracotta inline-block" />
                <span className="text-xs font-bold tracking-[0.22em] uppercase text-rc-terracotta font-sans">
                  Christian Mental Health Support
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-[74px] font-normal leading-[1.05] tracking-tight text-rc-forest-dark">
                You are seen.<br />
                You are loved.<br />
                <span className="italic font-normal text-rc-terracotta">
                  You belong here.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-8 text-base sm:text-lg text-rc-muted leading-relaxed max-w-xl font-sans">
                {tagline}
              </p>

              {/* CTAs matching Figma */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('therapy')}
                  className="btn-primary text-base font-semibold px-8 py-3.5 inline-flex items-center gap-2 group shadow-sm"
                >
                  <span>Find the right support</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>

                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-outline-sand text-base font-semibold px-8 py-3.5 text-rc-forest-dark"
                >
                  About Rapha Cares
                </a>
              </div>
            </div>

            {/* Right Column: Hero Visual from Figma */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[480px]">
                {/* Background decorative tan circle */}
                <div className="absolute -top-10 -right-10 h-52 w-52 rounded-full bg-[#EBE3D7]/70 pointer-events-none -z-10" />

                {/* Hero Visual Card (High-res graphic from Figma with founder, play button & Psalm 34:18) */}
                <div className="relative rounded-t-[220px] rounded-b-[48px] overflow-hidden shadow-xl border-4 border-white/60 bg-white group">
                  <img
                    src={heroFounderImg}
                    alt="Founder of Rapha Cares with scripture quote"
                    className="w-full h-auto object-cover block"
                  />

                  {/* Interactive Trigger over the play button */}
                  <button
                    type="button"
                    onClick={() => setVideoModalOpen(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-rc-terracotta"
                    aria-label="Play welcome video from founder"
                  >
                    <span className="sr-only">Play founder welcome video</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 2: OUR STORY / ABOUT RAPHA CARES (EXACT FIGMA DESIGN) ===================== */}
      <section id="about" className="bg-[#FAF6F0] py-20 sm:py-28 lg:py-32 border-t border-[#EAE3D6]/70">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Heading & Story Accent */}
            <div className="lg:col-span-5 pt-2">
              <p className="text-xs font-bold tracking-[0.24em] uppercase text-rc-terracotta font-sans mb-3">
                OUR STORY
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-normal text-rc-forest-dark tracking-tight leading-[1.1]">
                About Rapha Cares
              </h2>
              {/* Subtle underline accent line */}
              <div className="h-[1.5px] w-14 bg-rc-terracotta/40 mt-6" />
            </div>

            {/* Right Column: Warm Blush Sand Arch-Card */}
            <div className="lg:col-span-7">
              <div className="rounded-[36px] bg-[#F3E7E4] p-8 sm:p-12 lg:p-14 border border-[#ECE0DC]/90 shadow-2xs">
                {/* Lead Serif Headline */}
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal text-rc-forest-dark leading-[1.28] tracking-tight">
                  Rapha means &ldquo;
                  <span className="italic font-normal text-rc-terracotta">healing</span>
                  &rdquo; in Hebrew, and that is the heart behind everything we do.
                </h3>

                {/* Body paragraph 1 */}
                <p className="mt-8 text-base text-stone-700 leading-relaxed font-sans">
                  {aboutP1}
                </p>

                {/* Body paragraph 2 */}
                <p className="mt-6 text-base text-stone-700 leading-relaxed font-sans">
                  {aboutP2}
                </p>

                {/* Closing quote */}
                <p className="mt-8 font-serif italic text-lg sm:text-xl text-rc-terracotta leading-relaxed">
                  {aboutHighlight}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 3: BEGIN WHERE YOU ARE (EXACT FIGMA DESIGN) ===================== */}
      <section className="bg-[#F9F5EF] py-20 sm:py-28 lg:py-32 border-t border-[#EAE3D6]/70">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          {/* Section Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4">
            <div>
              <p className="text-xs font-bold tracking-[0.24em] uppercase text-rc-terracotta font-sans mb-3">
                BEGIN WHERE YOU ARE
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[50px] font-normal text-rc-forest-dark tracking-tight leading-[1.12]">
                A little light for the road ahead
              </h2>
            </div>
            <p className="text-base text-rc-muted max-w-md font-sans leading-relaxed lg:pb-1">
              Honest, clinically responsible resources that make room for questions, lament, and hope.
            </p>
          </div>

          {/* Filter Pills matching Figma */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            {['All resources', 'Anxiety', 'Depression', 'Relationships'].map((pill) => {
              const isActive = activeCategoryFilter === pill;
              return (
                <button
                  key={pill}
                  type="button"
                  onClick={() => setActiveCategoryFilter(pill)}
                  className={`rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1D3B33] text-white shadow-xs'
                      : 'bg-[#EAE4DC] hover:bg-[#E2DAD0] text-[#1E2B25]'
                  }`}
                >
                  {pill}
                </button>
              );
            })}
          </div>

          {/* 3 Curated Cards Grid matching Figma */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCuratedResources.map((item) => (
              <article
                key={item.id}
                className="rounded-[30px] bg-[#FAF8F4] border border-[#EBE4D8] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  {/* Top Icon Box with distinctive soft tint */}
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      item.iconType === 'sun'
                        ? 'bg-[#E0EBE6] text-[#4D6B60]'
                        : item.iconType === 'moon'
                        ? 'bg-[#E2E4EF] text-[#5A6380]'
                        : 'bg-[#EFE4DA] text-[#7A6050]'
                    }`}
                  >
                    {item.iconType === 'sun' && <Sun className="h-5 w-5 stroke-[1.8]" />}
                    {item.iconType === 'moon' && <Moon className="h-5 w-5 stroke-[1.8]" />}
                    {item.iconType === 'users' && <Users className="h-5 w-5 stroke-[1.8]" />}
                  </div>

                  {/* Metadata Tag */}
                  <p className="mt-6 font-sans text-[11px] font-bold tracking-[0.16em] uppercase text-rc-terracotta">
                    {item.meta}
                  </p>

                  {/* Title */}
                  <h3 className="mt-3 font-serif text-2xl font-normal text-rc-forest-dark leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm text-rc-muted leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Read Resource Action Button */}
                <div className="mt-8 pt-4 border-t border-[#EDE6DC]">
                  <button
                    type="button"
                    onClick={() => setReadingResource(item)}
                    className="group inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#1E2B25] hover:text-rc-terracotta transition-colors"
                  >
                    <span>Read resource</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== RESOURCE READER MODAL ===================== */}
      {readingResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#FAF8F4] p-8 sm:p-10 shadow-2xl border border-[#EDE7DD]">
            <button
              type="button"
              onClick={() => setReadingResource(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 transition-colors"
              aria-label="Close reader"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="font-sans text-xs font-bold tracking-[0.18em] uppercase text-rc-terracotta">
              {readingResource.meta}
            </span>

            <h3 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-rc-forest-dark leading-tight">
              {readingResource.title}
            </h3>

            {readingResource.scripture && (
              <div className="mt-5 rounded-2xl bg-[#F3E7E4] p-4 text-sm font-serif italic text-rc-forest-dark border border-[#ECE0DC]">
                {readingResource.scripture}
              </div>
            )}

            <div className="mt-6 space-y-4 font-sans text-base text-stone-700 leading-relaxed whitespace-pre-line">
              {readingResource.content}
            </div>

            <div className="mt-8 pt-6 border-t border-[#EAE3D6] flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setReadingResource(null);
                  onNavigate('resources');
                }}
                className="btn-primary-sm"
              >
                Browse All Resources Directory →
              </button>
              <button
                type="button"
                onClick={() => setReadingResource(null)}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== VIDEO MODAL ===================== */}
      {videoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-8 shadow-2xl text-center">
            <button
              type="button"
              onClick={() => setVideoModalOpen(false)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-700"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rc-sand-warm/60 text-rc-terracotta mb-4">
              <Play className="h-6 w-6 ml-0.5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-rc-forest-dark">
              A Welcome from Our Founder
            </h3>
            <p className="mt-3 text-sm text-rc-muted leading-relaxed">
              We are currently finalizing our founder video message. In the meantime, please feel free
              to explore our verified Christian therapists, psychiatrists, and curated soul-care resources.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="btn-primary"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SERVICES DIRECTORY ===================== */}
      <section className="bg-[#FAF6F0] px-6 py-20 sm:px-8 lg:px-12 border-t border-[#EAE3D6]/70">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-rc-forest-dark sm:text-4xl">
              Our Pathways to Care
            </h2>
            <p className="mt-2 text-rc-muted text-base">
              Thoughtfully coordinated support for every stage of your mental health journey.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => onNavigate(service.id)}
                className="section-arch-card overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="arch-header">
                    <h3 className="font-serif text-2xl font-bold text-rc-forest-dark group-hover:text-rc-terracotta transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <p className="px-8 pb-4 pt-2 text-rc-muted leading-relaxed">{service.description}</p>
                </div>
                <div className="px-8 pb-6 flex items-center gap-1.5 text-sm font-semibold text-rc-terracotta">
                  <span>Explore service</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TEAM SECTION ===================== */}
      <section className="bg-[#F9F5EF] px-6 py-20 sm:px-8 lg:px-12 border-t border-[#EAE3D6]/70">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-rc-forest-dark sm:text-4xl">
              Our Team
            </h2>
            <p className="mt-2 text-rc-muted text-base">
              Meet the people who care for you and this community.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
