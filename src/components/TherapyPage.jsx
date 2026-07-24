import { useState } from 'react';
import SectionHeading from './SectionHeading';
import ProviderCard from './ProviderCard';

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="section-arch-card mb-8">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-rc-sand/50"
        aria-expanded={open}
      >
        <span className="font-display text-lg text-stone-800">{title}</span>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-rc-dusty text-sm text-white transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="border-t border-stone-100 px-6 py-5 leading-relaxed text-stone-600">
          {children}
        </div>
      )}
    </div>
  );
}

export default function TherapyPage({ therapists, onBook, onBack }) {
  return (
    <div className="bg-white px-4 py-10 md:py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {onBack && (
          <button
            onClick={onBack}
            className="group mb-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-rc-terracotta transition-colors hover:text-rc-terracotta-dark"
          >
            <span className="transition-transform group-hover:-translate-x-1" aria-hidden="true">
              ←
            </span>
            Back to Home
          </button>
        )}
        <SectionHeading
          title="Christian Therapy"
          subtitle="Confidential, faith-honoring care for the whole person—mind, body, and spirit."
        />
        <Accordion title="What is therapy, and how does faith fit in?" defaultOpen>
          <p>
            Therapy is a confidential space to process emotions, relationships, and life challenges
            with a trained professional. A Christian therapist integrates evidence-based clinical
            practices with respect for your faith—prayer when welcomed, Scripture when helpful, and
            always your autonomy in how spirituality shows up in your healing journey.
          </p>
          <p className="mt-3">
            You do not need to have it all together to begin. Showing up is already an act of
            courage and hope.
          </p>
        </Accordion>
        <div className="space-y-6">
          {therapists.map((t) => (
            <ProviderCard key={t.id} provider={t} onBook={onBook} />
          ))}
        </div>
      </div>
    </div>
  );
}
