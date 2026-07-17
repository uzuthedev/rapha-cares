import SectionHeading from './SectionHeading';

export default function LegalPage({ type, onNavigate }) {
  const isPrivacy = type === 'privacy';

  return (
    <div className="bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-stone-100 bg-white p-8 shadow-xl shadow-stone-100/50">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <SectionHeading
            title={isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
            subtitle={
              isPrivacy
                ? 'How Rapha Cares collects, safeguards, and handles your information.'
                : 'The guidelines and disclaimers governing the use of the Rapha Cares platform.'
            }
          />
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="btn-primary bg-stone-100 text-stone-700 hover:bg-stone-200 hover:ring-stone-200"
          >
            Return Home
          </button>
        </div>

        {/* Emergency Disclaimer Banner */}
        <div className="mb-10 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-800">
          <h4 className="font-display font-bold uppercase tracking-wider mb-2">
            ⚠️ Emergency & Crisis Notice
          </h4>
          <p className="leading-relaxed">
            Rapha Cares is **not** a crisis hotline, emergency service, or clinical treatment provider.
            Our referrals and peer services do not replace professional urgent care. If you are
            experiencing a mental health emergency or having thoughts of self-harm, please dial
            <strong> 988</strong> immediately to connect with the Suicide & Crisis Lifeline, call
            <strong> 911</strong>, or go to the nearest emergency room.
          </p>
        </div>

        {isPrivacy ? (
          <div className="space-y-8 text-stone-700 leading-relaxed">
            <section>
              <h3 className="font-display text-xl font-semibold text-rc-terracotta-dark mb-3">
                1. Information We Collect
              </h3>
              <p className="mb-4">
                At Rapha Cares, we aim to respect your privacy and honor your trust. We collect minimal
                information from you when using our platform:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Prayer Requests:</strong> When you share a request, the content is stored in
                  our secure database anonymously and forwarded to our prayer team. We do not require
                  nor recommend sharing identifying personal information in your prayer text.
                </li>
                <li>
                  <strong>Referral Clicks & Redirects:</strong> We do not collect your personal email
                  or identity when you click "Book Session" to schedule with a clinical partner. All
                  scheduling happens directly on external platforms (like Calendly).
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-display text-xl font-semibold text-rc-terracotta-dark mb-3">
                2. How We Use Your Information
              </h3>
              <p>
                We use information you submit (such as prayer requests) strictly to offer spiritual and
                community support. Anonymous prayer requests are shared internally with the Rapha Cares
                ministry team and are securely saved in our administrative log so that we can pray for
                you. We **never** sell, trade, or share your data with external companies or advertisers.
              </p>
            </section>

            <section>
              <h3 className="font-display text-xl font-semibold text-rc-terracotta-dark mb-3">
                3. Secure Database Storage
              </h3>
              <p>
                All data, including prayer logs, is stored in a secure cloud database protected by Row
                Level Security (RLS). Access to read, inspect, or manage any records is strictly locked
                down to authorized administrators at <code>weareraphacares@gmail.com</code>.
              </p>
            </section>

            <section>
              <h3 className="font-display text-xl font-semibold text-rc-terracotta-dark mb-3">
                4. Third-Party Links & Services
              </h3>
              <p>
                Our directory points to independent clinical therapists and psychiatrists. Booking slots
                are managed externally on platforms like Calendly. We are not responsible for the
                privacy policies or content of these external scheduling portals. We recommend checking
                their policies when booking.
              </p>
            </section>

            <section>
              <h3 className="font-display text-xl font-semibold text-rc-terracotta-dark mb-3">
                5. Policy Updates
              </h3>
              <p>
                We may update this policy periodically to reflect changes in our service. Updates will
                be posted here with a revised date. If you have questions about your privacy, please
                reach out directly to <strong>weareraphacares@gmail.com</strong>.
              </p>
              <p className="mt-4 text-xs text-stone-400">Last updated: July 2026</p>
            </section>
          </div>
        ) : (
          <div className="space-y-8 text-stone-700 leading-relaxed">
            <section>
              <h3 className="font-display text-xl font-semibold text-rc-terracotta-dark mb-3">
                1. Nature of Our Services
              </h3>
              <p>
                Rapha Cares is a Christian support platform designed to connect individuals with
                licensed therapists, psychiatrists, resources, and peer prayer volunteers.
              </p>
              <p className="mt-2 font-semibold">
                By using our directory, you acknowledge that Rapha Cares does not directly employ
                practitioners, offer medical diagnoses, write prescriptions, or provide clinical
                therapy.
              </p>
            </section>

            <section>
              <h3 className="font-display text-xl font-semibold text-rc-terracotta-dark mb-3">
                2. Clinical Referrals & Practitioner Disclaimer
              </h3>
              <p>
                The professionals listed in our directories are independent practitioners who maintain
                their own credentials, licensing, and professional liability insurances. While we verify
                initial profiles, Rapha Cares makes no warranties regarding the accuracy of information
                provided by third parties, nor are we liable for any clinical services, advice, or
                treatment received from practitioners booked through directory referrals.
              </p>
            </section>

            <section>
              <h3 className="font-display text-xl font-semibold text-rc-terracotta-dark mb-3">
                3. Peer Support Volunteers
              </h3>
              <p>
                Peer support calls (including "Speak to a Friend") are hosted by trained Christian volunteers.
                These volunteers offer empathetic listening, prayer, and community encouragement.
              </p>
              <p className="mt-2 font-semibold">
                Peer calls do **not** constitute clinical therapy, professional counseling, or medical advice.
                Peer relationships are spiritual and pastoral in nature.
              </p>
            </section>

            <section>
              <h3 className="font-display text-xl font-semibold text-rc-terracotta-dark mb-3">
                4. Code of Conduct & Safety
              </h3>
              <p>
                We strive to keep Rapha Cares a safe, welcoming, and Christ-centered space. When submitting
                prayer requests or booking peer calls, users agree to refrain from submitting abusive,
                harassing, threatening, or explicit content. Rapha Cares reserves the right to delete
                prayer requests or cancel peer calls that violate this standard.
              </p>
            </section>

            <section>
              <h3 className="font-display text-xl font-semibold text-rc-terracotta-dark mb-3">
                5. Limitation of Liability
              </h3>
              <p>
                In no event shall Rapha Cares, its founder, advisors, volunteers, or partners be liable
                for any direct, indirect, incidental, or consequential damages resulting from the use of
                information, peer calls, or practitioner directory referrals on our website.
              </p>
              <p className="mt-4 text-xs text-stone-400">Last updated: July 2026</p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
