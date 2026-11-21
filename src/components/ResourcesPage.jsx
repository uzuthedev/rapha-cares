import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Mic,
  Music,
  Headphones,
  FileText,
  Smartphone,
  HeartHandshake,
  Video,
  Sparkles,
  Search,
  X,
  ExternalLink,
} from 'lucide-react';
import SectionHeading from './SectionHeading';

export function getCategoryIcon(category, className = 'h-5 w-5 text-rc-terracotta') {
  const cat = (category || '').toLowerCase();
  if (cat.includes('book') || cat.includes('workbook') || cat.includes('study') || cat.includes('guide')) {
    return <BookOpen className={className} />;
  }
  if (cat.includes('sermon') || cat.includes('preach') || cat.includes('message')) {
    return <Mic className={className} />;
  }
  if (cat.includes('music') || cat.includes('worship') || cat.includes('song')) {
    return <Music className={className} />;
  }
  if (cat.includes('podcast') || cat.includes('audio')) {
    return <Headphones className={className} />;
  }
  if (cat.includes('article') || cat.includes('essay') || cat.includes('blog') || cat.includes('read')) {
    return <FileText className={className} />;
  }
  if (cat.includes('app') || cat.includes('mobile') || cat.includes('tool')) {
    return <Smartphone className={className} />;
  }
  if (cat.includes('video') || cat.includes('watch') || cat.includes('film') || cat.includes('youtube')) {
    return <Video className={className} />;
  }
  if (cat.includes('crisis') || cat.includes('hotline') || cat.includes('support') || cat.includes('care')) {
    return <HeartHandshake className={className} />;
  }
  return <Sparkles className={className} />;
}

export function resourceLinkLabel(item) {
  if (item.buttonLabel && item.buttonLabel.trim()) {
    return item.buttonLabel.trim();
  }
  const cat = (item.category || '').toLowerCase();
  if (cat.includes('book')) return 'Get';
  if (cat.includes('article') || cat.includes('essay') || cat.includes('blog') || cat.includes('guide')) {
    return 'Read';
  }
  if (cat.includes('sermon') || cat.includes('music') || cat.includes('podcast') || cat.includes('audio')) {
    return 'Listen';
  }
  if (cat.includes('video') || cat.includes('watch')) return 'Watch';
  if (cat.includes('app')) return 'Open App';
  if (cat.includes('crisis') || cat.includes('hotline') || cat.includes('call')) return 'Call Now';
  return 'Explore';
}

export default function ResourcesPage({ resources = [], onBack }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all unique categories present in the resources
  const allCategories = useMemo(() => {
    const set = new Set();
    resources.forEach((r) => {
      if (r.category && r.category.trim()) {
        set.add(r.category.trim());
      }
    });
    return Array.from(set);
  }, [resources]);

  // Filter resources based on selected category and search query
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
      
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.author?.toLowerCase().includes(q) ||
        item.note?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [resources, selectedCategory, searchQuery]);

  // Group filtered resources by category
  const groupedResources = useMemo(() => {
    // If a specific category is selected, just group that one
    const categoriesToGroup =
      selectedCategory === 'All' ? allCategories : [selectedCategory];

    return categoriesToGroup
      .map((cat) => ({
        category: cat,
        items: filteredResources.filter(
          (r) => r.category?.toLowerCase() === cat.toLowerCase()
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [allCategories, selectedCategory, filteredResources]);

  function openResource(linkUrl) {
    if (linkUrl) {
      window.open(linkUrl, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div className="bg-rc-sand px-4 py-10 md:py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {onBack && (
          <button
            onClick={onBack}
            className="group mb-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-rc-terracotta transition-colors hover:text-rc-terracotta-dark"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>
        )}

        <SectionHeading
          title="Media & Resource Directory"
          subtitle="Curated books, sermons, music, podcasts, and guides to nourish your soul on hard days."
        />

        {/* Search & Filter Bar */}
        <div className="mb-10 space-y-4">
          <div className="relative mx-auto max-w-lg">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search resources, topics, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-11 pr-10 shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                selectedCategory === 'All'
                  ? 'bg-rc-terracotta text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/60'
              }`}
            >
              <span>All</span>
              <span className="opacity-75">({resources.length})</span>
            </button>

            {allCategories.map((cat) => {
              const count = resources.filter(
                (r) => r.category?.toLowerCase() === cat.toLowerCase()
              ).length;
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-rc-terracotta text-white shadow-sm'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/60'
                  }`}
                >
                  {getCategoryIcon(cat, `h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-rc-terracotta'}`)}
                  <span>{cat}</span>
                  <span className="opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources Grid / Categories */}
        {groupedResources.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-stone-200/80 bg-white p-8 text-center shadow-sm">
            <p className="font-display text-lg text-stone-700">No resources found</p>
            <p className="mt-1 text-sm text-stone-500">
              We couldn&apos;t find anything matching your filters or search criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="btn-primary-sm mt-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {groupedResources.map(({ category, items }) => (
              <div key={category}>
                <h3 className="mb-4 flex items-center gap-2 font-display text-xl text-rc-terracotta-dark">
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                  <span className="text-xs font-medium text-stone-400 font-sans">
                    ({items.length})
                  </span>
                </h3>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="section-arch-card flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      {item.imageUrl && (
                        <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          {item.badge && (
                            <span className="absolute top-3 right-3 rounded-full bg-rc-terracotta px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-rc-sand-warm/60 px-2 py-0.5 text-xxs font-semibold uppercase tracking-wider text-rc-terracotta-dark">
                            {getCategoryIcon(item.category, 'h-3 w-3 text-rc-terracotta')}
                            {item.category}
                          </span>
                          {!item.imageUrl && item.badge && (
                            <span className="rounded-full bg-rc-terracotta/10 px-2 py-0.5 text-xxs font-bold text-rc-terracotta">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <h4 className="mt-2.5 font-display text-base font-semibold text-stone-800">
                          {item.title}
                        </h4>

                        {item.author && (
                          <p className="mt-0.5 text-xs font-medium text-stone-500">
                            by {item.author}
                          </p>
                        )}

                        <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                          {item.note}
                        </p>

                        <div className="mt-5 pt-3 border-t border-stone-100">
                          {item.linkUrl ? (
                            <button
                              type="button"
                              onClick={() => openResource(item.linkUrl)}
                              className="btn-primary-sm w-full inline-flex items-center justify-center gap-1.5"
                            >
                              <span>{resourceLinkLabel(item)}</span>
                              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                            </button>
                          ) : (
                            <p className="text-center text-xs text-stone-400 italic">
                              Link coming soon
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
