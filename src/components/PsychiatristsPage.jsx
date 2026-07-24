import SectionHeading from './SectionHeading';
import ProviderCard from './ProviderCard';

export default function PsychiatristsPage({ psychiatrists, onBook, onBack }) {
  return (
    <div className="bg-rc-sand px-4 py-16 sm:px-6 lg:px-8">
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
          title="Psychiatrists"
          subtitle="Medical professionals who can evaluate, diagnose, and support medication when appropriate."
        />
        <div className="section-arch-card mb-8 overflow-hidden">
          <div className="arch-header">
            <h3 className="font-display text-lg text-rc-terracotta-dark">Medical referral process</h3>
          </div>
          <div className="space-y-3 px-8 pb-8 pt-2 leading-relaxed text-stone-600">
            <p>
              Psychiatrists are medical doctors who can evaluate, diagnose, and prescribe medication
              when appropriate. Many work alongside your therapist or pastor for holistic care.
            </p>
            <p>
              <strong className="text-stone-800">Typical steps:</strong> (1) Schedule an initial
              consultation, (2) share your history and goals, (3) collaborate on a treatment plan,
              (4) follow-up visits to monitor progress. A referral from your primary care physician
              may be required by some insurers—check with the provider when booking.
            </p>
          </div>
        </div>
        <div className="space-y-6">
          {psychiatrists.map((p) => (
            <ProviderCard key={p.id} provider={p} onBook={onBook} />
          ))}
        </div>
      </div>
    </div>
  );
}
