import { useState, useEffect } from 'react';
import {
  INITIAL_THERAPISTS,
  INITIAL_PSYCHIATRISTS,
  INITIAL_RESOURCES,
  INITIAL_TEAM,
} from './initialData';
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
  const [showWelcome, setShowWelcome] = useState(true);

  const [therapists, setTherapists] = useState(INITIAL_THERAPISTS);
  const [psychiatrists, setPsychiatrists] = useState(INITIAL_PSYCHIATRISTS);
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [team, setTeam] = useState(INITIAL_TEAM);
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

  // Fetch and seed data on initial load
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
          // Seed database if empty
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
        setTherapists(activeProviders.filter((p) => p.role === 'Therapist'));
        setPsychiatrists(activeProviders.filter((p) => p.role === 'Psychiatrist'));

        // 2. Fetch Resources
        const { data: resData, error: resError } = await supabase
          .from('resources')
          .select('*')
          .order('id', { ascending: true });

        if (resError) throw resError;

        let activeResources = (resData || []).map((r) => ({
          ...r,
          linkUrl: r.link_url,
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
            }));
          }
        }
        setResources(activeResources);

        // 3. Fetch Team Members
        const { data: teamData, error: teamError } = await supabase
          .from('team_members')
          .select('*')
          .order('id', { ascending: true });

        if (teamError) throw teamError;

        let activeTeam = teamData || [];
        if (activeTeam.length === 0) {
          const seedTeam = INITIAL_TEAM.map(({ id, ...t }) => t);
          const { data: insertedTeam, error: seedTeamError } = await supabase
            .from('team_members')
            .insert(seedTeam)
            .select();
          if (!seedTeamError && insertedTeam) {
            activeTeam = insertedTeam;
          }
        }
        setTeam(activeTeam);
      } catch (err) {
        console.error('Error fetching data from Supabase, using initial defaults:', err);
      }
    }

    loadData();
  }, []);

  function handleNavigate(page) {
    setView(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    if (window.location.hash === '#admin') {
      setView('admin');
    }

    function onHashChange() {
      if (window.location.hash === '#admin') setView('admin');
    }

    function onKeyDown(e) {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  function handleBookClick(provider) {
    if (provider.calendly) {
      window.open(provider.calendly, '_blank', 'noopener,noreferrer');
    }
  }

  function renderPage() {
    switch (view) {
      case 'therapy':
        return <TherapyPage therapists={therapists} onBook={handleBookClick} onBack={() => handleNavigate('home')} />;
      case 'psychiatrists':
        return <PsychiatristsPage psychiatrists={psychiatrists} onBook={handleBookClick} onBack={() => handleNavigate('home')} />;
      case 'support':
        return <SupportPage onBack={() => handleNavigate('home')} />;
      case 'resources':
        return <ResourcesPage resources={resources} onBack={() => handleNavigate('home')} />;
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
            setTherapists={setTherapists}
            setPsychiatrists={setPsychiatrists}
            setResources={setResources}
            setTeam={setTeam}
            session={session}
            onBack={() => handleNavigate('home')}
          />
        );
      default:
        return <HomePage team={team} onNavigate={handleNavigate} />;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white pb-24">
      <Header currentView={view} onNavigate={handleNavigate} onAdminClick={() => handleNavigate('admin')} />

      <main className="flex-1">{renderPage()}</main>

      <Footer onNavigate={handleNavigate} />
      <SafetyBanner />

      {showWelcome && <WelcomeModal onContinue={() => setShowWelcome(false)} />}
    </div>
  );
}

