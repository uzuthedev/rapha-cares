import { useState } from 'react';

export default function EmailCaptureModal({ provider, onClose, onSubmit }) {
  const [email, setEmail] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    onSubmit(email.trim(), provider);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="arch-header">
          <h2 id="email-modal-title" className="text-center font-display text-xl text-rc-terracotta-dark">
            Before you book
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 px-8 pb-8 pt-2">
          <p className="text-center text-sm leading-relaxed text-stone-600">
            To help us support and follow up on your journey, please enter your email address below
            before proceeding to booking.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="input-field"
            required
            autoFocus
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn-primary bg-stone-300 hover:text-stone-600 hover:ring-stone-300">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Continue to Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
