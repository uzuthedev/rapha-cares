import { useRef, useState } from 'react';
import { NAV_LINKS } from '../constants';
import logoImg from '../assets/logo.png';

export default function Header({ currentView, onNavigate, onAdminClick, siteSettings }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);

  function handleNav(viewId) {
    setMenuOpen(false);
    onNavigate(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleLogoClick() {
    logoClickCount.current += 1;

    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);

    if (logoClickCount.current >= 3) {
      logoClickCount.current = 0;
      onAdminClick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    logoClickTimer.current = setTimeout(() => {
      if (logoClickCount.current === 1) {
        onNavigate('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      logoClickCount.current = 0;
    }, 500);
  }

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'therapy', label: 'Therapy' },
    { id: 'psychiatrists', label: 'Psychiatrists' },
    { id: 'support', label: 'Other support' },
    { id: 'resources', label: 'Resources' },
  ];

  return (
    <>
      {/* Optional Site-wide Announcement Banner */}
      {siteSettings?.announcementActive && siteSettings?.announcementText && (
        <div className="bg-rc-terracotta text-white px-4 py-2 text-center text-xs sm:text-sm font-semibold tracking-wide">
          <span>{siteSettings.announcementText}</span>
        </div>
      )}

      <header className="sticky top-0 z-30 bg-[#F9F5EF]/95 backdrop-blur-xs border-b border-[#EAE3D6]/70 transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
          {/* Logo */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center text-left transition-opacity hover:opacity-90"
            aria-label="Rapha Cares home"
          >
            <img
              src={logoImg}
              alt="Rapha Cares - SAFE. HELD. WHOLE."
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Desktop navigation">
            {navItems.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNav(link.id)}
                  className={`text-sm font-medium transition-colors hover:text-rc-terracotta ${
                    isActive
                      ? 'text-rc-forest-dark font-semibold'
                      : 'text-stone-700'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Figma CTA Button: Join us */}
            <a
              href="https://form.jotform.com/261897933814068"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-forest px-6 py-2 rounded-full text-sm font-medium"
            >
              Join us
            </a>
          </nav>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="flex md:hidden h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-stone-300/80 bg-white/60"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-5 bg-stone-800 transition-transform ${
                menuOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-stone-800 transition-opacity ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-stone-800 transition-transform ${
                menuOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 top-[72px] z-20 bg-stone-900/30 md:hidden backdrop-blur-xs"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <nav
              className="relative z-30 border-t border-[#E5DDD0] bg-[#F9F5EF] px-6 py-5 shadow-lg md:hidden"
              aria-label="Mobile navigation"
            >
              <ul className="space-y-2">
                {navItems.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => handleNav(link.id)}
                      className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                        currentView === link.id
                          ? 'bg-white font-semibold text-rc-forest-dark shadow-sm'
                          : 'text-stone-700 hover:bg-white/60'
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
                <li className="pt-3">
                  <a
                    href="https://form.jotform.com/261897933814068"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-forest w-full text-center py-2.5"
                  >
                    Join us
                  </a>
                </li>
              </ul>
            </nav>
          </>
        )}
      </header>
    </>
  );
}
