import { useRef, useState } from 'react';
import { NAV_LINKS } from '../constants';
import logoImg from '../assets/logo.png';

export default function Header({ currentView, onNavigate, onAdminClick }) {
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

  return (
    <header className="sticky top-0 z-30 border-b border-stone-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center"
          aria-label="Rapha Cares home"
        >
          <img
            src={logoImg}
            alt="Rapha Cares Logo"
            className="h-10 w-auto sm:h-12 object-contain"
          />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Desktop navigation">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNav(link.id)}
              className={`text-sm font-semibold transition-colors hover:text-rc-terracotta-dark ${
                currentView === link.id
                  ? 'text-rc-terracotta-dark underline underline-offset-4 decoration-2'
                  : 'text-stone-905 hover:text-stone-950'
              }`}
            >
              {link.label}
            </button>
          ))}
          <a
            href="https://form.jotform.com/261897933814068"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-rc-terracotta hover:text-rc-terracotta-dark transition-colors px-4 py-1.5 rounded-full border-2 border-rc-terracotta hover:border-rc-terracotta-dark"
          >
            Join Us
          </a>
        </nav>

        {/* Hamburger Menu Toggle Button */}
        <button
          type="button"
          className="flex md:hidden h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-stone-800/20 bg-white/40"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-stone-900 transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span className={`block h-0.5 w-6 bg-stone-900 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span
            className={`block h-0.5 w-6 bg-stone-900 transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 top-[72px] z-20 bg-stone-900/30 md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            className="relative z-30 border-t border-rc-dusty-dark bg-rc-dusty-light px-4 py-4 shadow-lg md:hidden"
            aria-label="Mobile navigation"
          >
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.id)}
                    className={`block w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition-colors ${
                      currentView === link.id
                        ? 'bg-white text-rc-terracotta-dark'
                        : 'text-stone-900 hover:bg-white/60'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="https://form.jotform.com/261897933814068"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg px-4 py-3 text-center text-sm font-bold bg-rc-terracotta text-white shadow-sm transition-colors hover:bg-rc-terracotta-dark"
                >
                  Join Us
                </a>
              </li>
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}
