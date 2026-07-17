import { WELCOME_TEXT } from '../constants';

export default function WelcomeModal({ onContinue }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="arch-header text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-rc-terracotta-muted">
            You are welcome here
          </p>
        </div>
        <div className="px-8 pb-8 pt-2">
          <h2 id="welcome-title" className="sr-only">
            Welcome to Rapha Cares
          </h2>
          <p className="text-center text-base leading-relaxed text-stone-600 md:text-lg">
            {WELCOME_TEXT}
          </p>
          <div className="mt-8 flex justify-center">
            <button type="button" onClick={onContinue} className="btn-primary">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
