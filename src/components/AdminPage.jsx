import { useState, useEffect } from 'react';
import { ADMIN_PASS, RESOURCE_CATEGORIES } from '../constants';
import { genId } from '../initialData';
import BookingLog from './BookingLog';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

function compressAndResizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.75 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

const EMPTY_PROVIDER = {
  name: '',
  role: 'Therapist',
  credentials: '',
  location: '',
  focus: '',
  price: '',
  bio: '',
  calendly: '',
  imageUrl: '',
};

const EMPTY_RESOURCE = {
  title: '',
  author: '',
  note: '',
  category: 'Books',
  linkUrl: '',
};

const EMPTY_TEAM_MEMBER = {
  name: '',
  title: '',
  bio: '',
};

export default function AdminPage({
  therapists,
  psychiatrists,
  resources,
  team,
  setTherapists,
  setPsychiatrists,
  setResources,
  setTeam,
  session,
  onBack,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prayers, setPrayers] = useState([]);

  const [providerForm, setProviderForm] = useState(EMPTY_PROVIDER);
  const [resourceForm, setResourceForm] = useState(EMPTY_RESOURCE);
  const [teamForm, setTeamForm] = useState(EMPTY_TEAM_MEMBER);
  const [editingProviderId, setEditingProviderId] = useState(null);
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [editingTeamId, setEditingTeamId] = useState(null);

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const processImageFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    
    setIsUploading(true);
    setUploadError('');
    try {
      const base64Data = await compressAndResizeImage(file);
      updateProviderForm('imageUrl', base64Data);
    } catch (err) {
      console.error('Error processing image:', err);
      setUploadError('Failed to process image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processImageFile(file);
    }
  };

  // Check authentication
  const isAuthenticated = isSupabaseConfigured()
    ? !!session && session.user?.email?.toLowerCase() === 'weareraphacares@gmail.com'
    : localStorage.getItem('rapha-cares-local-auth') === 'true';

  // Load prayer requests when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadPrayers() {
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('prayer_requests')
            .select('*')
            .order('created_at', { ascending: false });
          if (error) throw error;
          setPrayers(data || []);
        } catch (err) {
          console.error('Error loading prayer requests:', err);
        }
      } else {
        const local = JSON.parse(localStorage.getItem('rapha-cares-local-prayers') || '[]');
        setPrayers(local);
      }
    }

    loadPrayers();
  }, [isAuthenticated]);

  // Automatic logout due to inactivity (15 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId;
    const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
        alert('You have been logged out due to inactivity for safety.');
      }, INACTIVITY_TIMEOUT);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated]);

  async function handleLogin(e) {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      try {
        // Enforce the authorized admin email
        if (email.trim().toLowerCase() !== 'weareraphacares@gmail.com') {
          setAuthError('Access Denied: Only weareraphacares@gmail.com is authorized.');
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          setAuthError(error.message);
        }
      } catch (err) {
        console.error('Login error:', err);
        setAuthError('An unexpected login error occurred.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      if (password === ADMIN_PASS) {
        setAuthError('');
        localStorage.setItem('rapha-cares-local-auth', 'true');
        setEmail('');
        setPassword('');
      } else {
        setAuthError('Incorrect password in fallback mode.');
      }
    }
  }

  function handleLogout() {
    if (isSupabaseConfigured()) {
      supabase.auth.signOut();
    } else {
      localStorage.removeItem('rapha-cares-local-auth');
      window.location.reload();
    }
  }

  async function handleDeletePrayer(id) {
    if (!confirm('Are you sure you want to delete this prayer request?')) return;
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('prayer_requests')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } else {
        const local = JSON.parse(localStorage.getItem('rapha-cares-local-prayers') || '[]');
        const updated = local.filter((p) => p.id !== id);
        localStorage.setItem('rapha-cares-local-prayers', JSON.stringify(updated));
      }
      setPrayers((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting prayer request:', err);
      alert('Failed to delete prayer request.');
    }
  }

  function updateProviderForm(field, value) {
    setProviderForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateResourceForm(field, value) {
    setResourceForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateTeamForm(field, value) {
    setTeamForm((prev) => ({ ...prev, [field]: value }));
  }

  async function saveProvider(e) {
    e.preventDefault();
    try {
      const payload = { ...providerForm };

      if (isSupabaseConfigured()) {
        const dbPayload = { ...payload };
        dbPayload.image_url = dbPayload.imageUrl;
        delete dbPayload.imageUrl;

        if (editingProviderId) {
          const { error } = await supabase
            .from('providers')
            .update(dbPayload)
            .eq('id', editingProviderId);
          if (error) throw error;

          const updatedPayload = { ...payload, id: editingProviderId };
          if (payload.role === 'Psychiatrist') {
            setPsychiatrists((prev) =>
              prev.map((p) => (p.id === editingProviderId ? updatedPayload : p))
            );
            setTherapists((prev) => prev.filter((p) => p.id !== editingProviderId));
          } else {
            setTherapists((prev) =>
              prev.map((p) => (p.id === editingProviderId ? updatedPayload : p))
            );
            setPsychiatrists((prev) => prev.filter((p) => p.id !== editingProviderId));
          }
        } else {
          const { data, error } = await supabase.from('providers').insert([dbPayload]).select();
          if (error) throw error;
          if (data && data[0]) {
            const returnedProvider = {
              ...data[0],
              imageUrl: data[0].image_url,
            };
            if (returnedProvider.role === 'Psychiatrist') {
              setPsychiatrists((prev) => [...prev, returnedProvider]);
            } else {
              setTherapists((prev) => [...prev, returnedProvider]);
            }
          }
        }
      } else {
        const localId = editingProviderId ?? genId();
        const localPayload = { ...payload, id: localId };
        const setter = payload.role === 'Psychiatrist' ? setPsychiatrists : setTherapists;
        const otherSetter = payload.role === 'Psychiatrist' ? setTherapists : setPsychiatrists;

        if (editingProviderId) {
          setter((prev) => prev.map((p) => (p.id === editingProviderId ? localPayload : p)));
          otherSetter((prev) => prev.filter((p) => p.id !== editingProviderId));
        } else {
          setter((prev) => [...prev, localPayload]);
        }
      }

      setProviderForm(EMPTY_PROVIDER);
      setEditingProviderId(null);
      setShowUrlInput(false);
      setUploadError('');
    } catch (err) {
      console.error('Error saving provider:', err);
      alert('Failed to save provider. Please verify database permissions and credentials.');
    }
  }

  async function saveResource(e) {
    e.preventDefault();
    try {
      const payload = { ...resourceForm };

      if (isSupabaseConfigured()) {
        const dbPayload = { ...payload };
        dbPayload.link_url = dbPayload.linkUrl;
        delete dbPayload.linkUrl;

        if (editingResourceId) {
          const { error } = await supabase
            .from('resources')
            .update(dbPayload)
            .eq('id', editingResourceId);
          if (error) throw error;

          setResources((prev) =>
            prev.map((r) => (r.id === editingResourceId ? { ...payload, id: editingResourceId } : r))
          );
        } else {
          const { data, error } = await supabase.from('resources').insert([dbPayload]).select();
          if (error) throw error;
          if (data && data[0]) {
            const returnedResource = {
              ...data[0],
              linkUrl: data[0].link_url,
            };
            setResources((prev) => [...prev, returnedResource]);
          }
        }
      } else {
        const localId = editingResourceId ?? genId();
        const localPayload = { ...payload, id: localId };
        if (editingResourceId) {
          setResources((prev) => prev.map((r) => (r.id === editingResourceId ? localPayload : r)));
        } else {
          setResources((prev) => [...prev, localPayload]);
        }
      }

      setResourceForm(EMPTY_RESOURCE);
      setEditingResourceId(null);
    } catch (err) {
      console.error('Error saving resource:', err);
      alert('Failed to save resource.');
    }
  }

  async function saveTeamMember(e) {
    e.preventDefault();
    try {
      const payload = { ...teamForm };

      if (isSupabaseConfigured()) {
        if (editingTeamId) {
          const { error } = await supabase
            .from('team_members')
            .update(payload)
            .eq('id', editingTeamId);
          if (error) throw error;

          setTeam((prev) =>
            prev.map((t) => (t.id === editingTeamId ? { ...payload, id: editingTeamId } : t))
          );
        } else {
          const { data, error } = await supabase.from('team_members').insert([payload]).select();
          if (error) throw error;
          if (data && data[0]) {
            setTeam((prev) => [...prev, data[0]]);
          }
        }
      } else {
        const localId = editingTeamId ?? genId();
        const localPayload = { ...payload, id: localId };
        if (editingTeamId) {
          setTeam((prev) => prev.map((t) => (t.id === editingTeamId ? localPayload : t)));
        } else {
          setTeam((prev) => [...prev, localPayload]);
        }
      }

      setTeamForm(EMPTY_TEAM_MEMBER);
      setEditingTeamId(null);
    } catch (err) {
      console.error('Error saving team member:', err);
      alert('Failed to save team member.');
    }
  }

  function editProvider(provider) {
    setProviderForm({
      name: provider.name,
      role: provider.role,
      credentials: provider.credentials,
      location: provider.location,
      focus: provider.focus,
      price: provider.price,
      bio: provider.bio,
      calendly: provider.calendly,
      imageUrl: provider.imageUrl || '',
    });
    setEditingProviderId(provider.id);
    const hasExternalUrl = !!provider.imageUrl && (provider.imageUrl.startsWith('http://') || provider.imageUrl.startsWith('https://'));
    setShowUrlInput(hasExternalUrl);
    setUploadError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function editResource(resource) {
    setResourceForm({
      title: resource.title,
      author: resource.author,
      note: resource.note,
      category: resource.category,
      linkUrl: resource.linkUrl || '',
    });
    setEditingResourceId(resource.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function editTeamMember(member) {
    setTeamForm({
      name: member.name,
      title: member.title,
      bio: member.bio,
    });
    setEditingTeamId(member.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteProvider(id, role) {
    if (!confirm('Are you sure you want to delete this provider?')) return;
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('providers').delete().eq('id', id);
        if (error) throw error;
      }

      const setter = role === 'Psychiatrist' ? setPsychiatrists : setTherapists;
      setter((prev) => prev.filter((p) => p.id !== id));
      if (editingProviderId === id) {
        setProviderForm(EMPTY_PROVIDER);
        setEditingProviderId(null);
      }
    } catch (err) {
      console.error('Error deleting provider:', err);
      alert('Failed to delete provider.');
    }
  }

  async function deleteResource(id) {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('resources').delete().eq('id', id);
        if (error) throw error;
      }

      setResources((prev) => prev.filter((r) => r.id !== id));
      if (editingResourceId === id) {
        setResourceForm(EMPTY_RESOURCE);
        setEditingResourceId(null);
      }
    } catch (err) {
      console.error('Error deleting resource:', err);
      alert('Failed to delete resource.');
    }
  }

  async function deleteTeamMember(id) {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('team_members').delete().eq('id', id);
        if (error) throw error;
      }

      setTeam((prev) => prev.filter((m) => m.id !== id));
      if (editingTeamId === id) {
        setTeamForm(EMPTY_TEAM_MEMBER);
        setEditingTeamId(null);
      }
    } catch (err) {
      console.error('Error deleting team member:', err);
      alert('Failed to delete team member.');
    }
  }

  const allProviders = [...therapists, ...psychiatrists];

  // Render Login Card if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-stone-50 px-4 py-16">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-stone-100 bg-white p-8 shadow-xl shadow-stone-100/50 animate-fade-in">
          <div className="mb-6 text-center">
            <h1 className="font-display text-3xl font-semibold text-rc-terracotta-dark">Admin Access</h1>
            <p className="mt-2 text-sm text-stone-500">
              {isSupabaseConfigured()
                ? 'Sign in with your admin credentials.'
                : 'Running in local fallback mode.'}
            </p>
          </div>


          <form onSubmit={handleLogin} className="space-y-4">
            {isSupabaseConfigured() && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="input-field"
                  required
                  disabled={isLoading}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                required
                disabled={isLoading}
              />
            </div>

            {authError && (
              <p className="text-sm font-medium text-red-500" role="alert">
                {authError}
              </p>
            )}

            {!isSupabaseConfigured() && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 font-medium">
                Note: Supabase is not configured. Use the local password <strong>{ADMIN_PASS}</strong>.
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onBack}
                disabled={isLoading}
                className="btn-primary flex-1 bg-stone-100 text-stone-700 hover:bg-stone-200 hover:ring-stone-200"
              >
                Back
              </button>
              <button type="submit" disabled={isLoading} className="btn-primary flex-1">
                {isLoading ? 'Unlocking...' : 'Unlock'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-rc-sand px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <h1 className="font-display text-3xl font-semibold text-rc-terracotta-dark">Admin Panel</h1>
            <p className="text-sm text-stone-500 mt-1">
              Logged in as{' '}
              <strong className="text-rc-terracotta">
                {isSupabaseConfigured() ? session?.user?.email : 'Local Developer'}
              </strong>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="btn-primary bg-stone-100 text-stone-700 hover:bg-stone-200 hover:ring-stone-200"
            >
              Back to Site
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-primary bg-red-50 hover:text-red-700 hover:ring-red-100"
            >
              Sign Out
            </button>
          </div>
        </div>

        <BookingLog prayers={prayers} onDelete={handleDeletePrayer} />

        {/* Team form */}
        <section className="section-arch-card overflow-hidden">
          <div className="arch-header">
            <h2 className="font-display text-xl text-rc-terracotta-dark">
              {editingTeamId ? 'Edit Team Member' : 'Add Team Member'}
            </h2>
          </div>
          <form onSubmit={saveTeamMember} className="grid gap-4 px-6 pb-6 pt-2 sm:grid-cols-2">
            <input
              placeholder="Name"
              value={teamForm.name}
              onChange={(e) => updateTeamForm('name', e.target.value)}
              className="input-field"
              required
            />
            <input
              placeholder="Title / Role"
              value={teamForm.title}
              onChange={(e) => updateTeamForm('title', e.target.value)}
              className="input-field"
              required
            />
            <textarea
              placeholder="Bio"
              value={teamForm.bio}
              onChange={(e) => updateTeamForm('bio', e.target.value)}
              className="input-field sm:col-span-2"
              rows={3}
              required
            />
            <div className="flex gap-3 sm:col-span-2">
              <button type="submit" className="btn-primary">
                {editingTeamId ? 'Save Changes' : 'Add Team Member'}
              </button>
              {editingTeamId && (
                <button
                  type="button"
                  onClick={() => {
                    setTeamForm(EMPTY_TEAM_MEMBER);
                    setEditingTeamId(null);
                  }}
                  className="btn-primary bg-stone-400 hover:text-stone-600 hover:ring-stone-400"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="section-arch-card p-6">
          <h2 className="mb-4 font-display text-xl text-rc-terracotta-dark">Team Members</h2>
          <ul className="space-y-3">
            {team.map((member) => (
              <li
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-100 bg-rc-sand/40 px-4 py-3"
              >
                <div>
                  <span className="font-medium text-stone-800">{member.name}</span>
                  <span className="ml-2 text-xs text-stone-500">{member.title}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editTeamMember(member)}
                    className="btn-primary-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTeamMember(member.id)}
                    className="btn-primary-sm bg-red-400 hover:text-red-600 hover:ring-red-400"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Provider form */}
        <section className="section-arch-card overflow-hidden">
          <div className="arch-header">
            <h2 className="font-display text-xl text-rc-terracotta-dark">
              {editingProviderId ? 'Edit Practitioner' : 'Add Practitioner'}
            </h2>
          </div>
          <form onSubmit={saveProvider} className="grid gap-4 px-6 pb-6 pt-2 sm:grid-cols-2">
            <input
              placeholder="Name"
              value={providerForm.name}
              onChange={(e) => updateProviderForm('name', e.target.value)}
              className="input-field"
              required
            />
            <select
              value={providerForm.role}
              onChange={(e) => updateProviderForm('role', e.target.value)}
              className="input-field"
            >
              <option value="Therapist">Therapist</option>
              <option value="Psychiatrist">Psychiatrist</option>
            </select>
            <input
              placeholder="Credentials"
              value={providerForm.credentials}
              onChange={(e) => updateProviderForm('credentials', e.target.value)}
              className="input-field"
              required
            />
            <input
              placeholder="Location"
              value={providerForm.location}
              onChange={(e) => updateProviderForm('location', e.target.value)}
              className="input-field"
              required
            />
            <input
              placeholder="Areas of focus"
              value={providerForm.focus}
              onChange={(e) => updateProviderForm('focus', e.target.value)}
              className="input-field"
              required
            />
            <input
              placeholder="Price"
              value={providerForm.price}
              onChange={(e) => updateProviderForm('price', e.target.value)}
              className="input-field"
              required
            />
            <input
              placeholder="Website or Calendly Link"
              value={providerForm.calendly}
              onChange={(e) => updateProviderForm('calendly', e.target.value)}
              className="input-field sm:col-span-2"
              required
            />
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Practitioner Photo
              </label>
              
              {providerForm.imageUrl ? (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                  <img
                    src={providerForm.imageUrl}
                    alt="Preview"
                    className="h-20 w-20 rounded-xl object-cover shadow-sm bg-white border border-stone-100"
                  />
                  <div className="space-y-1">
                    <p className="text-xs text-stone-500 font-medium">Photo selected successfully</p>
                    <button
                      type="button"
                      onClick={() => updateProviderForm('imageUrl', '')}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                    >
                      Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="file-upload"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex justify-center rounded-xl border-2 border-dashed px-6 py-6 cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? 'border-rc-terracotta bg-rc-sand-warm/30'
                      : 'border-stone-300 bg-white hover:border-rc-dusty hover:bg-stone-50/30'
                  }`}
                >
                  <div className="space-y-2 text-center pointer-events-none">
                    <div className="flex justify-center">
                      <svg
                        className="h-10 w-10 text-stone-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="text-sm text-stone-600">
                      <span className="font-semibold text-rc-terracotta hover:text-rc-terracotta-dark">
                        <span className="md:inline hidden">Upload a photo</span>
                        <span className="inline md:hidden">Tap to upload a photo</span>
                      </span>
                      <span className="pl-1 md:inline hidden">or drag and drop</span>
                    </div>
                    <p className="text-xs text-stone-500">PNG, JPG, WEBP (will be resized and compressed)</p>
                  </div>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              )}
              
              {uploadError && (
                <p className="text-xs text-red-500 font-medium" role="alert">{uploadError}</p>
              )}
              
              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-xs text-stone-500 hover:text-rc-terracotta font-medium underline underline-offset-2 transition-colors"
                >
                  {showUrlInput ? 'Hide image URL option' : 'Or paste a direct image URL link instead'}
                </button>
                {isUploading && (
                  <span className="text-xs text-rc-terracotta font-medium animate-pulse">
                    Processing image...
                  </span>
                )}
              </div>

              {showUrlInput && (
                <div className="pt-2 animate-fade-in">
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={providerForm.imageUrl}
                    onChange={(e) => updateProviderForm('imageUrl', e.target.value)}
                    className="input-field"
                  />
                  <p className="text-xxs text-stone-400 mt-1">
                    Paste a direct link to an image hosted elsewhere.
                  </p>
                </div>
              )}
            </div>
            <textarea
              placeholder="Bio"
              value={providerForm.bio}
              onChange={(e) => updateProviderForm('bio', e.target.value)}
              className="input-field sm:col-span-2"
              rows={3}
              required
            />
            <div className="flex gap-3 sm:col-span-2">
              <button type="submit" className="btn-primary">
                {editingProviderId ? 'Save Changes' : 'Add Practitioner'}
              </button>
              {editingProviderId && (
                <button
                  type="button"
                  onClick={() => {
                    setProviderForm(EMPTY_PROVIDER);
                    setEditingProviderId(null);
                    setShowUrlInput(false);
                    setUploadError('');
                  }}
                  className="btn-primary bg-stone-400 hover:text-stone-600 hover:ring-stone-400"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="section-arch-card p-6">
          <h2 className="mb-4 font-display text-xl text-rc-terracotta-dark">
            Active Practitioners
          </h2>
          <ul className="space-y-3">
            {allProviders.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-100 bg-rc-sand/40 px-4 py-3"
              >
                <div>
                  <span className="font-medium text-stone-800">{p.name}</span>
                  <span className="ml-2 text-xs uppercase tracking-wider text-rc-terracotta-muted">
                    {p.role}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editProvider(p)}
                    className="btn-primary-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProvider(p.id, p.role)}
                    className="btn-primary-sm bg-red-400 hover:text-red-600 hover:ring-red-400"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Resource form */}
        <section className="section-arch-card overflow-hidden">
          <div className="arch-header">
            <h2 className="font-display text-xl text-rc-terracotta-dark">
              {editingResourceId ? 'Edit Resource' : 'Add Resource'}
            </h2>
          </div>
          <form onSubmit={saveResource} className="grid gap-4 px-6 pb-6 pt-2 sm:grid-cols-2">
            <input
              placeholder="Title"
              value={resourceForm.title}
              onChange={(e) => updateResourceForm('title', e.target.value)}
              className="input-field"
              required
            />
            <select
              value={resourceForm.category}
              onChange={(e) => updateResourceForm('category', e.target.value)}
              className="input-field"
            >
              {RESOURCE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              placeholder="Author"
              value={resourceForm.author}
              onChange={(e) => updateResourceForm('author', e.target.value)}
              className="input-field"
              required
            />
            <input
              placeholder="Short description"
              value={resourceForm.note}
              onChange={(e) => updateResourceForm('note', e.target.value)}
              className="input-field"
              required
            />
            <input
              placeholder="Purchase / listen link (Amazon, YouTube, Spotify, etc.)"
              value={resourceForm.linkUrl}
              onChange={(e) => updateResourceForm('linkUrl', e.target.value)}
              className="input-field sm:col-span-2"
              required
            />
            <div className="flex gap-3 sm:col-span-2">
              <button type="submit" className="btn-primary">
                {editingResourceId ? 'Save Changes' : 'Add Resource'}
              </button>
              {editingResourceId && (
                <button
                  type="button"
                  onClick={() => {
                    setResourceForm(EMPTY_RESOURCE);
                    setEditingResourceId(null);
                  }}
                  className="btn-primary bg-stone-400 hover:text-stone-600 hover:ring-stone-400"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="section-arch-card p-6">
          <h2 className="mb-4 font-display text-xl text-rc-terracotta-dark">Active Resources</h2>
          <ul className="space-y-3">
            {resources.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-100 bg-rc-sand/40 px-4 py-3"
              >
                <div className="min-w-0">
                  <span className="font-medium text-stone-800">{r.title}</span>
                  <span className="ml-2 text-xs text-stone-500">{r.category}</span>
                  {r.linkUrl && (
                    <p className="mt-1 truncate text-xs text-rc-terracotta-muted">{r.linkUrl}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editResource(r)}
                    className="btn-primary-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteResource(r.id)}
                    className="btn-primary-sm bg-red-400 hover:text-red-600 hover:ring-red-400"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

