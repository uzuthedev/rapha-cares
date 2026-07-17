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
            Our Team
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rc-sand px-4 py-16 sm:px-6 lg:px-8">
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
    </>
  );
}
