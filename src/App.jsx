import { useState, useEffect } from 'react';
import {
  INITIAL_THERAPISTS,
  INITIAL_PSYCHIATRISTS,
  INITIAL_RESOURCES,
  INITIAL_TEAM,
} from './initialData';
import {
  DEFAULT_RESOURCE_CATEGORIES,
  INITIAL_SITE_SETTINGS,
} from './constants';
import { supabase, isSupabaseConfigured } from './utils/supabaseClient';
import Header from './components/Header';
import Footer from './components/Footer';
import SafetyBanner from './components/SafetyBanner';
import WelcomeModal from './components/WelcomeModal';
import HomePage from './components/HomePage';
import TherapyPage from './components/TherapyPage';
import PsychiatristsPage from './components/PsychiatristsPage';
import SupportPage from './components/SupportPage';
import ResourcesPage from './components/ResourcesPage';
import AdminPage from './components/AdminPage';
import LegalPage from './components/LegalPage';

export default function App() {
  const [view, setView] = useState('home');

  // Detect if running on an admin subdomain (e.g. portal.raphacares.org or admin.raphacares.org)
  const host = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const isAdminSubdomain = host.startsWith('portal.') || host.startsWith('admin.');

  // Welcome modal on first visit in a session (only for public site)
  const [showWelcome, setShowWelcome] = useState(() => {
    return !sessionStorage.getItem('rapha_welcome_seen');
  });

  // Local storage backed state with initial seed fallbacks
  const [therapists, setTherapists] = useState(() => {
    const local = localStorage.getItem('rapha-cares-therapists');
    return local ? JSON.parse(local) : INITIAL_THERAPISTS;
  });

  const [psychiatrists, setPsychiatrists] = useState(() => {
    const local = localStorage.getItem('rapha-cares-psychiatrists');
    return local ? JSON.parse(local) : INITIAL_PSYCHIATRISTS;
  });

  const [resources, setResources] = useState(() => {
    const local = localStorage.getItem('rapha-cares-resources');
    return local ? JSON.parse(local) : INITIAL_RESOURCES;
  });

  const [team, setTeam] = useState(() => {
    const local = localStorage.getItem('rapha-cares-team');
    return local ? JSON.parse(local) : INITIAL_TEAM;
  });

  const [categories, setCategories] = useState(() => {
    const local = localStorage.getItem('rapha-cares-categories');
    return local ? JSON.parse(local) : DEFAULT_RESOURCE_CATEGORIES;
  });

  const [siteSettings, setSiteSettings] = useState(() => {
    const local = localStorage.getItem('rapha-cares-settings');
    return local
      ? { ...INITIAL_SITE_SETTINGS, ...JSON.parse(local) }
      : INITIAL_SITE_SETTINGS;
  });

  const [session, setSession] = useState(null);

  // Monitor Supabase auth session
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch and seed data on initial load if Supabase is active
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    async function loadData() {
      try {
        // 1. Fetch Providers
        const { data: provData, error: provError } = await supabase
          .from('providers')
          .select('*')
          .order('id', { ascending: true });

        if (provError) throw provError;

        let activeProviders = (provData || []).map((p) => ({
          ...p,
          imageUrl: p.image_url,
        }));

        if (activeProviders.length === 0) {
          const seed = [
            ...INITIAL_THERAPISTS.map(({ id, ...p }) => ({
              ...p,
              image_url: p.imageUrl,
            })),
            ...INITIAL_PSYCHIATRISTS.map(({ id, ...p }) => ({
              ...p,
              image_url: p.imageUrl,
            })),
          ];
          const { data: inserted, error: seedError } = await supabase
            .from('providers')
            .insert(seed)
            .select();
          if (!seedError && inserted) {
            activeProviders = inserted.map((p) => ({
              ...p,
              imageUrl: p.image_url,
            }));
          }
        }
        const activeTherapists = activeProviders.filter((p) => p.role === 'Therapist');
        const activePsychiatrists = activeProviders.filter((p) => p.role === 'Psychiatrist');
        setTherapists(activeTherapists);
        setPsychiatrists(activePsychiatrists);
        localStorage.setItem('rapha-cares-therapists', JSON.stringify(activeTherapists));
        localStorage.setItem('rapha-cares-psychiatrists', JSON.stringify(activePsychiatrists));

        // 2. Fetch Resources
        const { data: resData, error: resError } = await supabase
          .from('resources')
          .select('*')
          .order('id', { ascending: true });

        if (resError) throw resError;

        let activeResources = (resData || []).map((r) => ({
          ...r,
          linkUrl: r.link_url,
          imageUrl: r.image_url,
          buttonLabel: r.button_label,
          badge: r.badge,
        }));

        if (activeResources.length === 0) {
          const seedRes = INITIAL_RESOURCES.map(({ id, ...r }) => ({
            ...r,
            link_url: r.linkUrl,
          }));
          const { data: insertedRes, error: seedResError } = await supabase
            .from('resources')
            .insert(seedRes)
            .select();
          if (!seedResError && insertedRes) {
            activeResources = insertedRes.map((r) => ({
              ...r,
              linkUrl: r.link_url,
              imageUrl: r.image_url,
              buttonLabel: r.button_label,
              badge: r.badge,
            }));
          }
        }
        setResources(activeResources);
        localStorage.setItem('rapha-cares-resources', JSON.stringify(activeResources));

        // 3. Fetch Team Members
        const { data: teamData, error: teamError } = await supabase
          .from('team_members')
          .select('*')
          .order('id', { ascending: true });

        if (teamError) throw teamError;

        let activeTeam = (teamData || []).map((t) => ({
          ...t,
          imageUrl: t.image_url,
        }));

        if (activeTeam.length === 0) {
          const seedTeam = INITIAL_TEAM.map(({ id, ...t }) => {
            const dbT = { ...t };
            dbT.image_url = dbT.imageUrl;
            delete dbT.imageUrl;
            return dbT;
          });
          const { data: insertedTeam, error: seedTeamError } = await supabase
            .from('team_members')
            .insert(seedTeam)
            .select();
          if (!seedTeamError && insertedTeam) {
            activeTeam = insertedTeam.map((t) => ({
              ...t,
              imageUrl: t.image_url,
            }));
          }
        }
        setTeam(activeTeam);
        localStorage.setItem('rapha-cares-team', JSON.stringify(activeTeam));
      } catch (err) {
        console.error('Error fetching data from Supabase, using local state defaults:', err);
      }
    }

    loadData();
  }, []);

  function handleNavigate(page) {
    setView(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDismissWelcome() {
    setShowWelcome(false);
    sessionStorage.setItem('rapha_welcome_seen', 'true');
  }

  // Support direct URL access for developer / testing via hash (#admin) or path (/admin)
  useEffect(() => {
    if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
      setView('admin');
    }

    function onHashChange() {
      if (window.location.hash === '#admin') setView('admin');
    }

    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  function handleBookClick(provider) {
    if (provider.calendly) {
      window.open(provider.calendly, '_blank', 'noopener,noreferrer');
    }
  }

  // ===================== DEDICATED SUBDOMAIN MODE =====================
  // When visiting on an admin subdomain (e.g. admin.raphacares.com),
  // render the Admin Portal exclusively with direct redirect back to main site.
  if (isAdminSubdomain) {
    return (
      <div className="min-h-screen bg-[#F9F5EF]">
        <AdminPage
          therapists={therapists}
          psychiatrists={psychiatrists}
          resources={resources}
          team={team}
          categories={categories}
          siteSettings={siteSettings}
          setTherapists={setTherapists}
          setPsychiatrists={setPsychiatrists}
          setResources={setResources}
          setTeam={setTeam}
          setCategories={setCategories}
          setSiteSettings={setSiteSettings}
          session={session}
          onBack={() => {
            const mainHost = window.location.hostname.replace(/^(portal|admin)\./i, '');
            const port = window.location.port ? `:${window.location.port}` : '';
            window.location.href = `${window.location.protocol}//${mainHost}${port}`;
          }}
        />
      </div>
    );
  }

  // ===================== MAIN PUBLIC SITE MODE =====================
  function renderPage() {
    switch (view) {
      case 'therapy':
        return (
          <TherapyPage
            therapists={therapists}
            onBook={handleBookClick}
            onBack={() => handleNavigate('home')}
          />
        );
      case 'psychiatrists':
        return (
          <PsychiatristsPage
            psychiatrists={psychiatrists}
            onBook={handleBookClick}
            onBack={() => handleNavigate('home')}
          />
        );
      case 'support':
        return (
          <SupportPage
            onBack={() => handleNavigate('home')}
            siteSettings={siteSettings}
          />
        );
      case 'resources':
        return (
          <ResourcesPage
            resources={resources}
            categories={categories}
            onBack={() => handleNavigate('home')}
          />
        );
      case 'privacy':
        return <LegalPage type="privacy" onNavigate={handleNavigate} />;
      case 'terms':
        return <LegalPage type="terms" onNavigate={handleNavigate} />;
      case 'admin':
        return (
          <AdminPage
            therapists={therapists}
            psychiatrists={psychiatrists}
            resources={resources}
            team={team}
            categories={categories}
            siteSettings={siteSettings}
            setTherapists={setTherapists}
            setPsychiatrists={setPsychiatrists}
            setResources={setResources}
            setTeam={setTeam}
            setCategories={setCategories}
            setSiteSettings={setSiteSettings}
            session={session}
            onBack={() => handleNavigate('home')}
          />
        );
      default:
        return (
          <HomePage
            team={team}
            onNavigate={handleNavigate}
            siteSettings={siteSettings}
          />
        );
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F5EF]">
      {/* Welcome Modal for first time visitors */}
      {showWelcome && (
        <WelcomeModal
          text={siteSettings?.welcomeText}
          onContinue={handleDismissWelcome}
        />
      )}

      {/* Safety banner at the very top of the website */}
      <SafetyBanner siteSettings={siteSettings} />

      {/* Clean Header navbar (no secret clicks or admin triggers) */}
      <Header
        currentView={view}
        onNavigate={handleNavigate}
        siteSettings={siteSettings}
      />

      <main className="flex-1">{renderPage()}</main>

      {/* Clean Footer (no founder portal link) */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
