import { Leaf, ArrowRight } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <>
      {/* ===================== PRE-FOOTER CRISIS SUPPORT BANNER ===================== */}
      <section className="bg-white border-t border-[#EAE3D6] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 lg:gap-12">
            <div className="max-w-3xl">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal text-[#1E2B25] tracking-tight leading-tight">
                You don&apos;t have to carry this alone.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#5A655F] leading-relaxed font-sans max-w-2xl">
                Rapha Cares is a resource directory, not a crisis line. If you&apos;re in immediate
                danger or thinking about harming yourself, contact local emergency services now. In
                the U.S., call or text{' '}
                <a
                  href="tel:988"
                  className="font-semibold text-rc-terracotta underline decoration-1 underline-offset-2 hover:text-rc-terracotta-dark"
                >
                  988
                </a>
                .
              </p>
            </div>

            <div className="shrink-0">
              <a
                href="tel:988"
                className="btn-primary text-sm sm:text-base font-semibold px-8 py-3.5 inline-flex items-center gap-2 group shadow-sm"
              >
                <span>Find immediate support</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== MAIN FOOTER (EXACT FIGMA DESIGN) ===================== */}
      <footer className="bg-[#1D3B33] text-white">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 sm:px-8 lg:px-12">
          {/* Main 5-Column Grid */}
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 lg:gap-8">
            {/* Column 1: Brand & Identity (span 4 on desktop) */}
            <div className="lg:col-span-4">
              <div className="flex items-start gap-3.5">
                {/* Leaf emblem badge in white circle */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-xs">
                  <Leaf className="h-5 w-5 text-[#1D3B33] stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-white leading-tight">
                    Rapha Cares
                  </h3>
                  <p className="mt-1 font-sans text-[10px] font-bold tracking-[0.24em] uppercase text-[#8DA499]">
                    FAITH. HEALING. WHOLENESS.
                  </p>
                </div>
              </div>

              <p className="mt-6 font-sans text-sm text-[#8DA499] leading-relaxed max-w-sm">
                Compassionate Christian mental health support, curated with care and held in prayer.
              </p>
            </div>

            {/* Column 2: SERVICES (span 2 on desktop) */}
            <div className="lg:col-span-2">
              <h4 className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#DDA17B] mb-5">
                SERVICES
              </h4>
              <ul className="space-y-3 font-sans text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('therapy')}
                    className="text-[#D8E4DE] transition-colors hover:text-white"
                  >
                    Christian therapy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('psychiatrists')}
                    className="text-[#D8E4DE] transition-colors hover:text-white"
                  >
                    Psychiatry referrals
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('support')}
                    className="text-[#D8E4DE] transition-colors hover:text-white"
                  >
                    Prayer support
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('resources')}
                    className="text-[#D8E4DE] transition-colors hover:text-white"
                  >
                    Resources
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: COMPANY (span 2 on desktop) */}
            <div className="lg:col-span-2">
              <h4 className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#DDA17B] mb-5">
                COMPANY
              </h4>
              <ul className="space-y-3 font-sans text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('home')}
                    className="text-[#D8E4DE] transition-colors hover:text-white"
                  >
                    About us
                  </button>
                </li>
                <li>
                  <a
                    href="https://form.jotform.com/261897933814068"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D8E4DE] transition-colors hover:text-white"
                  >
                    Join our team
                  </a>
                </li>
                <li>
                  <a
                    href="https://form.jotform.com/261897933814068"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D8E4DE] transition-colors hover:text-white"
                  >
                    Partner with us
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('support')}
                    className="text-[#D8E4DE] transition-colors hover:text-white"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: CONNECT (span 2 on desktop) */}
            <div className="lg:col-span-2">
              <h4 className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#DDA17B] mb-5">
                CONNECT
              </h4>
              <ul className="space-y-3 font-sans text-sm">
                <li>
                  <a
                    href="https://www.instagram.com/raphacares?utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D8E4DE] transition-colors hover:text-white"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com/@raphacares?si=lQj_skswbj_Dew9x"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D8E4DE] transition-colors hover:text-white"
                  >
                    YouTube
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('support')}
                    className="text-[#D8E4DE] transition-colors hover:text-white"
                  >
                    Prayer
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5: Inspirational Callout (span 2 on desktop) */}
            <div className="lg:col-span-2 flex flex-col justify-between">
              <div>
                <Leaf className="h-6 w-6 text-[#DDA17B] stroke-[1.8] mb-4" />
                <h4 className="font-serif text-2xl sm:text-[26px] font-normal text-white leading-tight tracking-tight">
                  A kinder<br />
                  tomorrow is<br />
                  possible.
                </h4>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => onNavigate('support')}
                  className="group inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#DDA17B] transition-colors hover:text-white"
                >
                  <span>Find support</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer Row */}
          <div className="mt-16 border-t border-[#294B3F] pt-8">
            <div className="flex flex-col gap-4 text-center sm:text-left md:flex-row md:items-center md:justify-between text-xs text-[#8DA499] font-sans">
              <div>
                <p>&copy; {new Date().getFullYear()} Rapha Cares. All rights reserved.</p>
              </div>

              <div>
                <p className="text-center">
                  Resources for reflection, not a substitute for professional care.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('terms')}
                  className="transition-colors hover:text-white"
                >
                  Terms of service
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="transition-colors hover:text-white"
                >
                  Privacy policy
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="transition-colors hover:text-[#DDA17B] underline decoration-dotted"
                  title="Founder & Administrator login"
                >
                  Founder portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
