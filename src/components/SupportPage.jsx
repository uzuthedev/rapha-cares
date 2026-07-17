import { useState } from 'react';
import SectionHeading from './SectionHeading';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export default function SupportPage() {
  const [prayerText, setPrayerText] = useState('');
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePrayerSubmit(e) {
    e.preventDefault();
    if (!prayerText.trim()) return;

    setIsSubmitting(true);

    try {
      // 1. Save to Supabase (if configured) or fallback to local storage
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('prayer_requests')
          .insert([{ content: prayerText.trim() }]);
        if (error) throw error;
      } else {
        // Fallback to local storage so admin page can still show it in dev mode if Supabase is offline
        const localRequests = JSON.parse(
          localStorage.getItem('rapha-cares-local-prayers') || '[]'
        );
        localRequests.push({
          id: Date.now().toString(),
          content: prayerText.trim(),
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('rapha-cares-local-prayers', JSON.stringify(localRequests));
      }

      // 2. Send email via Web3Forms (if access key is configured)
      const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      if (web3Key) {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: web3Key,
            subject: 'New Prayer Request | Rapha Cares',
            from_name: 'Rapha Cares Website',
            message: `A new prayer request has been submitted:\n\n"${prayerText.trim()}"\n\nDate: ${new Date().toLocaleString()}`,
          }),
        });
      } else {
        console.warn('Web3Forms Access Key is missing. Email notification skipped.');
      }

      setPrayerSubmitted(true);
      setPrayerText('');
      setTimeout(() => setPrayerSubmitted(false), 5000);
    } catch (err) {
      console.error('Error submitting prayer request:', err);
      alert('There was an error sending your prayer request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Other Support"
          subtitle="Prayer, presence, and peer connection when you need someone who understands."
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="section-arch-card overflow-hidden p-6">
            <h3 className="mb-2 font-display text-xl text-stone-800">Prayer request</h3>
            <p className="mb-4 text-stone-600">
              Share what is on your heart. Our team will hold your request in prayer—you are not
              walking alone.
            </p>
            <form onSubmit={handlePrayerSubmit} className="space-y-4">
              <textarea
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder="Type your prayer request here..."
                rows={5}
                className="input-field resize-y"
                required
                disabled={isSubmitting}
              />
              <div className="flex flex-wrap items-center gap-4">
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending Request...' : 'Submit Prayer Request'}
                </button>
                <a
                  href="https://calendly.com/weareraphacares/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-rc-terracotta underline decoration-rc-dusty underline-offset-4 transition-colors hover:text-rc-terracotta-dark"
                >
                  Join a live prayer call
                </a>
              </div>
              {prayerSubmitted && (
                <p className="text-sm font-medium text-rc-terracotta" role="status">
                  Thank you. Your request has been received—we are praying with you.
                </p>
              )}
            </form>
          </div>

          <div className="section-arch-card overflow-hidden">
            <div className="arch-header">
              <h3 className="font-display text-xl text-rc-terracotta-dark">Speak to a friend</h3>
            </div>
            <div className="space-y-4 px-8 pb-8 pt-2">
              <p className="leading-relaxed text-stone-600">
                Sometimes you need a listening ear more than a clinical appointment. Our peer support
                volunteers are trained empathetic listeners—fellow believers who offer presence, not
                professional advice.
              </p>
              <p className="text-sm text-stone-500">
                Available weekdays · 30-minute calls · Completely confidential
              </p>
              <a
                href="https://calendly.com/weareraphacares/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                Book a peer support call
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

