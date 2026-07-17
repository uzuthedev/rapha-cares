function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ProviderCard({ provider, onBook }) {
  return (
    <article className="section-arch-card flex flex-col gap-6 p-6 md:flex-row md:items-center">
      {provider.imageUrl ? (
        <img
          src={provider.imageUrl}
          alt=""
          className="h-24 w-24 shrink-0 rounded-2xl object-cover shadow-inner"
        />
      ) : (
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rc-sand-warm to-rc-dusty-light font-display text-2xl font-bold text-rc-terracotta-dark shadow-inner"
          aria-hidden="true"
        >
          {getInitials(provider.name)}
        </div>
      )}
      <div className="min-w-0 flex-1 space-y-2">
        <h3 className="font-display text-xl text-stone-800">{provider.name}</h3>
        <p className="text-sm font-medium text-rc-terracotta">{provider.credentials}</p>
        <p className="text-sm text-stone-500">{provider.location}</p>
        <p className="text-sm">
          <span className="font-medium text-stone-700">Areas of focus: </span>
          {provider.focus}
        </p>
        <p className="text-sm font-semibold text-stone-800">{provider.price}</p>
        <p className="leading-relaxed text-stone-600">{provider.bio}</p>
      </div>
      <div className="flex shrink-0 md:self-center">
        <button type="button" onClick={() => onBook(provider)} className="btn-primary">
          Book via Calendly
        </button>
      </div>
    </article>
  );
}
