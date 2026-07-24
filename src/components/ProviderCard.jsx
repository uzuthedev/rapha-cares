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
    <article className="section-arch-card p-6 flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
      {/* Top section: Avatar and Name/Credentials side-by-side on mobile, part of row on desktop */}
      <div className="flex items-center gap-4 md:items-start md:gap-0 md:contents">
        {provider.imageUrl ? (
          <img
            src={provider.imageUrl}
            alt=""
            className="h-20 w-20 md:h-24 md:w-24 shrink-0 rounded-2xl object-cover shadow-inner"
          />
        ) : (
          <div
            className="flex h-20 w-20 md:h-24 md:w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rc-sand-warm to-rc-dusty-light font-display text-xl md:text-2xl font-bold text-rc-terracotta-dark shadow-inner"
            aria-hidden="true"
          >
            {getInitials(provider.name)}
          </div>
        )}
        
        {/* Name and Credentials next to image on mobile */}
        <div className="min-w-0 flex-1 md:hidden">
          <h3 className="font-display text-lg font-bold text-stone-800 leading-tight">{provider.name}</h3>
          <p className="text-xs font-semibold text-rc-terracotta mt-0.5">{provider.credentials}</p>
          <p className="text-xs text-stone-500 mt-0.5">{provider.location}</p>
        </div>
      </div>

      {/* Main content body */}
      <div className="min-w-0 flex-1 space-y-2">
        {/* Hidden on mobile, shown on desktop */}
        <div className="hidden md:block">
          <h3 className="font-display text-xl text-stone-800">{provider.name}</h3>
          <p className="text-sm font-medium text-rc-terracotta">{provider.credentials}</p>
          <p className="text-sm text-stone-500">{provider.location}</p>
        </div>

        <p className="text-sm">
          <span className="font-semibold text-stone-700">Areas of focus: </span>
          {provider.focus}
        </p>
        <p className="text-sm font-bold text-stone-800">{provider.price}</p>
        <p className="leading-relaxed text-sm text-stone-600">{provider.bio}</p>
      </div>

      {/* Booking button - full width on mobile, auto-width on desktop */}
      <div className="w-full md:w-auto shrink-0 md:self-center">
        <button
          type="button"
          onClick={() => onBook(provider)}
          className="btn-primary w-full md:w-auto text-center justify-center"
        >
          Visit
        </button>
      </div>
    </article>
  );
}
