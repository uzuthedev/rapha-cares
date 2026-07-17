export default function Footer({ onNavigate }) {
  const columns = [
    {
      title: 'Services',
      links: [
        { label: 'Christian Therapy', view: 'therapy' },
        { label: 'Psychiatry Referrals', view: 'psychiatrists' },
        { label: 'Prayer Requests', view: 'support' },
        { label: 'Peer Support', view: 'support' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', view: 'home' },
        { label: 'Partners', view: 'home' },
        { label: 'Terms of Service', view: 'home' },
        { label: 'Privacy Policy', view: 'home' },
      ],
    },
    {
      title: 'Socials',
      links: [
        { label: 'Instagram', href: 'https://www.instagram.com/raphacares?utm_source=qr' },
        { label: 'YouTube', href: 'https://youtube.com/@raphacares?si=lQj_skswbj_Dew9x' },
      ],
    },
  ];

  return (
    <footer className="border-t-2 border-rc-dusty-dark bg-rc-dusty">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-stone-900">
              {col.title}
            </h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.view ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(link.view)}
                      className="text-sm font-medium text-stone-800 transition-colors hover:text-rc-terracotta-dark"
                    >
                      {link.label}
                    </button>
                  ) : link.href ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-stone-800 transition-colors hover:text-rc-terracotta-dark"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-stone-800">{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-rc-dusty-dark/30 py-4 text-center">
        <p className="text-xs font-medium text-stone-800">
          &copy; {new Date().getFullYear()} Rapha Cares
        </p>
      </div>
    </footer>
  );
}
