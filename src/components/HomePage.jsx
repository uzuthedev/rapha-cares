import { TAGLINE, SERVICES } from '../constants';

function TeamCard({ member }) {
  const initials = member.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  return (
    <article className="section-arch-card overflow-hidden text-center">
      <div className="arch-header">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white font-display text-2xl font-bold text-rc-terracotta-dark shadow-sm">
          {initials}
        </div>
      </div>
      <div className="px-6 pb-6 pt-2">
        <h3 className="font-display text-lg text-stone-900">{member.name}</h3>
        <p className="mt-1 text-sm font-semibold text-rc-terracotta">{member.title}</p>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">{member.bio}</p>
      </div>
    </article>
  );
}

export default function HomePage({ team, onNavigate }) {
  return (
    <>
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-stone-600 md:text-xl">
          {TAGLINE}
        </p>
      </section>

      <section className="bg-rc-sand px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="section-arch-card overflow-hidden">
            <div className="arch-header text-center">
              <h2 className="font-display text-2xl text-rc-terracotta-dark sm:text-3xl">
                About Rapha Cares
              </h2>
            </div>
            <div className="space-y-4 px-8 pb-8 pt-2 leading-relaxed text-stone-600">
              <p>
                Rapha means &ldquo;healing&rdquo; in Hebrew—and that is the heart behind everything
                we do. We believe God cares deeply about your mental health, and that faith and
                professional care can walk hand in hand.
              </p>
              <p>
                This platform was born from a simple conviction: no one should have to navigate
                anxiety, depression, or spiritual loneliness alone. We curate trusted Christian
                therapists, psychiatrists, prayer support, and soul-nourishing resources—all in
                one gentle, welcoming place.
              </p>
              <p className="text-center font-display italic text-rc-terracotta-muted">
                You are seen. You are loved. You belong here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center font-display text-3xl text-rc-terracotta-dark sm:text-4xl">
            Our Services
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => onNavigate(service.id)}
                className="section-arch-card overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="arch-header">
                  <h3 className="font-display text-xl text-rc-terracotta-dark">{service.title}</h3>
                </div>
                <p className="px-8 pb-8 pt-2 text-stone-600">{service.description}</p>
                <p className="px-8 pb-6 text-sm font-semibold text-rc-terracotta">Learn more →</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rc-sand px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center font-display text-3xl text-rc-terracotta-dark sm:text-4xl">
            Our Team
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
            {/* Permanent uneditable Join Us card */}
            <article className="section-arch-card overflow-hidden text-center bg-stone-900 border-stone-850 flex flex-col justify-between h-full shadow-md">
              <div className="arch-header" style={{ background: 'linear-gradient(to bottom, #2b2824, #1c1917)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 font-display text-3xl shadow-sm text-white">
                  🤝
                </div>
              </div>
              <div className="px-6 pb-8 pt-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg text-white font-semibold">Apply to Join Us</h3>
                  <p className="mt-1 text-xs font-semibold text-rc-dusty uppercase tracking-wider">Join the Mission</p>
                  <p className="mt-4 text-sm leading-relaxed text-stone-300">
                    Are you passionate about Christian mental health and walking alongside others? You can apply to join us.
                  </p>
                </div>
                <div className="mt-6">
                  <a
                    href="https://form.jotform.com/261897933814068"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full inline-flex justify-center items-center font-bold tracking-wide transition-colors"
                  >
                    Join Us
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
