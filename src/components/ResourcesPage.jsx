import { RESOURCE_CATEGORIES } from '../constants';
import SectionHeading from './SectionHeading';

function resourceLinkLabel(category) {
  if (category === 'Books') return 'View on Amazon';
  if (category === 'Music') return 'Listen';
  return 'Watch';
}

export default function ResourcesPage({ resources }) {
  const groupedResources = RESOURCE_CATEGORIES.map((cat) => ({
    category: cat,
    items: resources.filter((r) => r.category === cat),
  }));

  function openResource(linkUrl) {
    if (linkUrl) {
      window.open(linkUrl, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div className="bg-rc-sand px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Media Directory"
          subtitle="Books, sermons, and music curated to nourish your soul on hard days."
        />
        <div className="space-y-12">
          {groupedResources.map(
            ({ category, items }) =>
              items.length > 0 && (
                <div key={category}>
                  <h3 className="mb-4 flex items-center gap-2 font-display text-xl text-rc-terracotta-dark">
                    <span className="h-1 w-8 rounded-full bg-rc-dusty" aria-hidden="true" />
                    {category}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <article
                        key={item.id}
                        className="section-arch-card flex flex-col p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <h4 className="font-display text-stone-800">{item.title}</h4>
                        <p className="mt-1 text-sm text-stone-500">{item.author}</p>
                        <p className="mt-2 flex-1 text-sm text-stone-600">{item.note}</p>
                        {item.linkUrl ? (
                          <button
                            type="button"
                            onClick={() => openResource(item.linkUrl)}
                            className="btn-primary-sm mt-4 w-full"
                          >
                            {resourceLinkLabel(item.category)}
                          </button>
                        ) : (
                          <p className="mt-4 text-xs text-stone-400">Link coming soon</p>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
