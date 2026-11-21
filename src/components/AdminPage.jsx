import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Mic,
  Music,
  Headphones,
  FileText,
  Smartphone,
  Video,
  HeartHandshake,
  Sparkles,
  Plus,
  Search,
  Trash2,
  Edit3,
  ExternalLink,
  Layers,
  Settings,
  Users,
  Stethoscope,
  Heart,
  Check,
  X,
  Tag,
  Image as ImageIcon,
  Globe,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import {
  ADMIN_PASS,
  RESOURCE_CATEGORIES,
  DEFAULT_RESOURCE_CATEGORIES,
  INITIAL_SITE_SETTINGS,
} from '../constants';
import { genId } from '../initialData';
import BookingLog from './BookingLog';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import { getCategoryIcon, resourceLinkLabel } from './ResourcesPage';

function compressAndResizeImage(file, maxWidth = 500, maxHeight = 500) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
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
  buttonLabel: '',
  imageUrl: '',
  badge: '',
};

const EMPTY_TEAM_MEMBER = {
  name: '',
  title: '',
  bio: '',
  imageUrl: '',
};

export default function AdminPage({
  therapists = [],
  psychiatrists = [],
  resources = [],
  team = [],
  categories = DEFAULT_RESOURCE_CATEGORIES,
  siteSettings = INITIAL_SITE_SETTINGS,
  setTherapists,
  setPsychiatrists,
  setResources,
  setTeam,
  setCategories,
  setSiteSettings,
  session,
  onBack,
}) {
  const [activeTab, setActiveTab] = useState('resources'); // 'resources', 'practitioners', 'team', 'prayers', 'settings'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prayers, setPrayers] = useState([]);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Form states
  const [providerForm, setProviderForm] = useState(EMPTY_PROVIDER);
  const [resourceForm, setResourceForm] = useState(EMPTY_RESOURCE);
  const [teamForm, setTeamForm] = useState(EMPTY_TEAM_MEMBER);
  const [settingsForm, setSettingsForm] = useState(siteSettings);

  const [editingProviderId, setEditingProviderId] = useState(null);
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [editingTeamId, setEditingTeamId] = useState(null);

  // Custom Category creation
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Resource Search & Filter in Admin
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceCategoryFilter, setResourceCategoryFilter] = useState('All');

  // Provider photo upload state
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Team photo upload state
  const [teamShowUrlInput, setTeamShowUrlInput] = useState(false);
  const [teamIsUploading, setTeamIsUploading] = useState(false);
  const [teamUploadError, setTeamUploadError] = useState('');
  const [teamIsDragging, setTeamIsDragging] = useState(false);

  // Resource photo upload state
  const [resourceShowUrlInput, setResourceShowUrlInput] = useState(false);
  const [resourceIsUploading, setResourceIsUploading] = useState(false);
  const [resourceUploadError, setResourceUploadError] = useState('');
  const [resourceIsDragging, setResourceIsDragging] = useState(false);

  // Keep settingsForm in sync if siteSettings changes externally
  useEffect(() => {
    setSettingsForm(siteSettings);
  }, [siteSettings]);

  // Combine categories from DEFAULT, prop categories, and any categories present in resources
  const availableCategories = useMemo(() => {
    const set = new Set([...categories, ...DEFAULT_RESOURCE_CATEGORIES]);
    resources.forEach((r) => {
      if (r.category && r.category.trim()) set.add(r.category.trim());
    });
    return Array.from(set);
  }, [categories, resources]);

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

  // Inactivity timeout (15 min)
  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId;
    const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
        alert('You have been logged out due to inactivity for safety.');
      }, INACTIVITY_TIMEOUT);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated]);

  function showToast(msg) {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(''), 4000);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      try {
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
        const { error } = await supabase.from('prayer_requests').delete().eq('id', id);
        if (error) throw error;
      } else {
        const local = JSON.parse(localStorage.getItem('rapha-cares-local-prayers') || '[]');
        const updated = local.filter((p) => p.id !== id);
        localStorage.setItem('rapha-cares-local-prayers', JSON.stringify(updated));
      }
      setPrayers((prev) => prev.filter((p) => p.id !== id));
      showToast('Prayer request deleted.');
    } catch (err) {
      console.error('Error deleting prayer request:', err);
      alert('Failed to delete prayer request.');
    }
  }

  // --- Image Handlers ---
  const processImageFile = async (file, type) => {
    if (!file.type.startsWith('image/')) {
      const err = 'Please select a valid image file (PNG, JPG, WEBP).';
      if (type === 'provider') setUploadError(err);
      else if (type === 'team') setTeamUploadError(err);
      else setResourceUploadError(err);
      return;
    }

    if (type === 'provider') {
      setIsUploading(true);
      setUploadError('');
    } else if (type === 'team') {
      setTeamIsUploading(true);
      setTeamUploadError('');
    } else {
      setResourceIsUploading(true);
      setResourceUploadError('');
    }

    try {
      const base64Data = await compressAndResizeImage(file);
      if (type === 'provider') updateProviderForm('imageUrl', base64Data);
      else if (type === 'team') updateTeamForm('imageUrl', base64Data);
      else updateResourceForm('imageUrl', base64Data);
    } catch (err) {
      console.error('Error processing image:', err);
      const msg = 'Failed to process image. Please try again.';
      if (type === 'provider') setUploadError(msg);
      else if (type === 'team') setTeamUploadError(msg);
      else setResourceUploadError(msg);
    } finally {
      if (type === 'provider') setIsUploading(false);
      else if (type === 'team') setTeamIsUploading(false);
      else setResourceIsUploading(false);
    }
  };

  // --- Form updaters ---
  function updateProviderForm(field, value) {
    setProviderForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateResourceForm(field, value) {
    setResourceForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateTeamForm(field, value) {
    setTeamForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateSettingsForm(field, value) {
    setSettingsForm((prev) => ({ ...prev, [field]: value }));
  }

  // --- Category Management ---
  function handleAddNewCategory(nameToAdd) {
    const trimmed = (nameToAdd || newCategoryName).trim();
    if (!trimmed) return;
    if (!availableCategories.includes(trimmed)) {
      const updated = [...availableCategories, trimmed];
      if (setCategories) setCategories(updated);
      localStorage.setItem('rapha-cares-categories', JSON.stringify(updated));
    }
    updateResourceForm('category', trimmed);
    setNewCategoryName('');
    setIsAddingNewCategory(false);
    showToast(`Category "${trimmed}" added!`);
  }

  function handleDeleteCategory(catToDelete) {
    const hasResources = resources.some(
      (r) => r.category?.toLowerCase() === catToDelete.toLowerCase()
    );
    if (hasResources) {
      alert(`Cannot delete category "${catToDelete}" because there are resources currently using it.`);
      return;
    }
    if (!confirm(`Are you sure you want to remove the category "${catToDelete}"?`)) return;

    const updated = availableCategories.filter((c) => c !== catToDelete);
    if (setCategories) setCategories(updated);
    localStorage.setItem('rapha-cares-categories', JSON.stringify(updated));
    showToast(`Category "${catToDelete}" removed.`);
  }

  // --- Save / Delete Resource ---
  async function saveResource(e) {
    e.preventDefault();
    try {
      let finalCategory = resourceForm.category;
      if (isAddingNewCategory && newCategoryName.trim()) {
        finalCategory = newCategoryName.trim();
        handleAddNewCategory(finalCategory);
      }

      const payload = {
        ...resourceForm,
        category: finalCategory,
      };

      if (isSupabaseConfigured()) {
        const dbPayload = {
          title: payload.title,
          author: payload.author,
          note: payload.note,
          category: payload.category,
          link_url: payload.linkUrl,
          // Optional columns if schema updated:
          button_label: payload.buttonLabel || null,
          image_url: payload.imageUrl || null,
          badge: payload.badge || null,
        };

        if (editingResourceId) {
          // Attempt update with all fields, fallback to standard fields if column error
          let { error } = await supabase.from('resources').update(dbPayload).eq('id', editingResourceId);
          if (error && error.message?.includes('column')) {
            const fallbackDbPayload = {
              title: payload.title,
              author: payload.author,
              note: payload.note,
              category: payload.category,
              link_url: payload.linkUrl,
            };
            const fbResult = await supabase.from('resources').update(fallbackDbPayload).eq('id', editingResourceId);
            if (fbResult.error) throw fbResult.error;
          } else if (error) {
            throw error;
          }

          const updatedList = resources.map((r) =>
            r.id === editingResourceId ? { ...payload, id: editingResourceId } : r
          );
          setResources(updatedList);
          localStorage.setItem('rapha-cares-resources', JSON.stringify(updatedList));
        } else {
          let { data, error } = await supabase.from('resources').insert([dbPayload]).select();
          if (error && error.message?.includes('column')) {
            const fallbackDbPayload = {
              title: payload.title,
              author: payload.author,
              note: payload.note,
              category: payload.category,
              link_url: payload.linkUrl,
            };
            const fbResult = await supabase.from('resources').insert([fallbackDbPayload]).select();
            if (fbResult.error) throw fbResult.error;
            data = fbResult.data;
          } else if (error) {
            throw error;
          }

          if (data && data[0]) {
            const newRes = {
              ...payload,
              id: data[0].id,
              linkUrl: data[0].link_url || payload.linkUrl,
              imageUrl: data[0].image_url || payload.imageUrl,
              buttonLabel: data[0].button_label || payload.buttonLabel,
              badge: data[0].badge || payload.badge,
            };
            const updatedList = [...resources, newRes];
            setResources(updatedList);
            localStorage.setItem('rapha-cares-resources', JSON.stringify(updatedList));
          }
        }
      } else {
        // Local mode
        const localId = editingResourceId ?? genId();
        const localPayload = { ...payload, id: localId };
        let updatedList;
        if (editingResourceId) {
          updatedList = resources.map((r) =>
            r.id === editingResourceId ? localPayload : r
          );
        } else {
          updatedList = [...resources, localPayload];
        }
        setResources(updatedList);
        localStorage.setItem('rapha-cares-resources', JSON.stringify(updatedList));
      }

      setResourceForm(EMPTY_RESOURCE);
      setEditingResourceId(null);
      setResourceShowUrlInput(false);
      setResourceUploadError('');
      setIsAddingNewCategory(false);
      setNewCategoryName('');
      showToast(editingResourceId ? 'Resource updated successfully!' : 'Resource added successfully!');
    } catch (err) {
      console.error('Error saving resource:', err);
      alert('Failed to save resource. Please verify database permissions and credentials.');
    }
  }

  function editResource(r) {
    setResourceForm({
      title: r.title || '',
      author: r.author || '',
      note: r.note || '',
      category: r.category || 'Books',
      linkUrl: r.linkUrl || '',
      buttonLabel: r.buttonLabel || '',
      imageUrl: r.imageUrl || '',
      badge: r.badge || '',
    });
    setEditingResourceId(r.id);
    const hasExternalUrl = !!r.imageUrl && (r.imageUrl.startsWith('http://') || r.imageUrl.startsWith('https://'));
    setResourceShowUrlInput(hasExternalUrl);
    setResourceUploadError('');
    setIsAddingNewCategory(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteResource(id) {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('resources').delete().eq('id', id);
        if (error) throw error;
      }
      const updated = resources.filter((r) => r.id !== id);
      setResources(updated);
      localStorage.setItem('rapha-cares-resources', JSON.stringify(updated));
      if (editingResourceId === id) {
        setResourceForm(EMPTY_RESOURCE);
        setEditingResourceId(null);
      }
      showToast('Resource deleted.');
    } catch (err) {
      console.error('Error deleting resource:', err);
      alert('Failed to delete resource.');
    }
  }

  // --- Save / Delete Practitioner ---
  async function saveProvider(e) {
    e.preventDefault();
    try {
      const payload = { ...providerForm };

      if (isSupabaseConfigured()) {
        const dbPayload = { ...payload };
        dbPayload.image_url = dbPayload.imageUrl;
        delete dbPayload.imageUrl;

        if (editingProviderId) {
          const { error } = await supabase.from('providers').update(dbPayload).eq('id', editingProviderId);
          if (error) throw error;

          const updatedPayload = { ...payload, id: editingProviderId };
          if (payload.role === 'Psychiatrist') {
            const upPsych = psychiatrists.map((p) => (p.id === editingProviderId ? updatedPayload : p));
            const upTherap = therapists.filter((p) => p.id !== editingProviderId);
            setPsychiatrists(upPsych);
            setTherapists(upTherap);
            localStorage.setItem('rapha-cares-psychiatrists', JSON.stringify(upPsych));
            localStorage.setItem('rapha-cares-therapists', JSON.stringify(upTherap));
          } else {
            const upTherap = therapists.map((p) => (p.id === editingProviderId ? updatedPayload : p));
            const upPsych = psychiatrists.filter((p) => p.id !== editingProviderId);
            setTherapists(upTherap);
            setPsychiatrists(upPsych);
            localStorage.setItem('rapha-cares-therapists', JSON.stringify(upTherap));
            localStorage.setItem('rapha-cares-psychiatrists', JSON.stringify(upPsych));
          }
        } else {
          const { data, error } = await supabase.from('providers').insert([dbPayload]).select();
          if (error) throw error;
          if (data && data[0]) {
            const returned = { ...data[0], imageUrl: data[0].image_url };
            if (returned.role === 'Psychiatrist') {
              const upPsych = [...psychiatrists, returned];
              setPsychiatrists(upPsych);
              localStorage.setItem('rapha-cares-psychiatrists', JSON.stringify(upPsych));
            } else {
              const upTherap = [...therapists, returned];
              setTherapists(upTherap);
              localStorage.setItem('rapha-cares-therapists', JSON.stringify(upTherap));
            }
          }
        }
      } else {
        const localId = editingProviderId ?? genId();
        const localPayload = { ...payload, id: localId };
        if (payload.role === 'Psychiatrist') {
          const upPsych = editingProviderId
            ? psychiatrists.map((p) => (p.id === editingProviderId ? localPayload : p))
            : [...psychiatrists, localPayload];
          const upTherap = therapists.filter((p) => p.id !== editingProviderId);
          setPsychiatrists(upPsych);
          setTherapists(upTherap);
          localStorage.setItem('rapha-cares-psychiatrists', JSON.stringify(upPsych));
          localStorage.setItem('rapha-cares-therapists', JSON.stringify(upTherap));
        } else {
          const upTherap = editingProviderId
            ? therapists.map((p) => (p.id === editingProviderId ? localPayload : p))
            : [...therapists, localPayload];
          const upPsych = psychiatrists.filter((p) => p.id !== editingProviderId);
          setTherapists(upTherap);
          setPsychiatrists(upPsych);
          localStorage.setItem('rapha-cares-therapists', JSON.stringify(upTherap));
          localStorage.setItem('rapha-cares-psychiatrists', JSON.stringify(upPsych));
        }
      }

      setProviderForm(EMPTY_PROVIDER);
      setEditingProviderId(null);
      setShowUrlInput(false);
      setUploadError('');
      showToast(editingProviderId ? 'Practitioner updated!' : 'Practitioner added!');
    } catch (err) {
      console.error('Error saving provider:', err);
      alert('Failed to save provider.');
    }
  }

  function editProvider(p) {
    setProviderForm({
      name: p.name,
      role: p.role,
      credentials: p.credentials,
      location: p.location,
      focus: p.focus,
      price: p.price,
      bio: p.bio,
      calendly: p.calendly,
      imageUrl: p.imageUrl || '',
    });
    setEditingProviderId(p.id);
    const hasExternalUrl = !!p.imageUrl && (p.imageUrl.startsWith('http://') || p.imageUrl.startsWith('https://'));
    setShowUrlInput(hasExternalUrl);
    setUploadError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteProvider(id, role) {
    if (!confirm('Are you sure you want to delete this practitioner?')) return;
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('providers').delete().eq('id', id);
        if (error) throw error;
      }

      if (role === 'Psychiatrist') {
        const up = psychiatrists.filter((p) => p.id !== id);
        setPsychiatrists(up);
        localStorage.setItem('rapha-cares-psychiatrists', JSON.stringify(up));
      } else {
        const up = therapists.filter((p) => p.id !== id);
        setTherapists(up);
        localStorage.setItem('rapha-cares-therapists', JSON.stringify(up));
      }
      if (editingProviderId === id) {
        setProviderForm(EMPTY_PROVIDER);
        setEditingProviderId(null);
      }
      showToast('Practitioner deleted.');
    } catch (err) {
      console.error('Error deleting provider:', err);
      alert('Failed to delete provider.');
    }
  }

  // --- Save / Delete Team Member ---
  async function saveTeamMember(e) {
    e.preventDefault();
    try {
      const payload = { ...teamForm };

      if (isSupabaseConfigured()) {
        const dbPayload = { ...payload };
        dbPayload.image_url = dbPayload.imageUrl;
        delete dbPayload.imageUrl;

        if (editingTeamId) {
          const { error } = await supabase.from('team_members').update(dbPayload).eq('id', editingTeamId);
          if (error) throw error;
          const up = team.map((t) => (t.id === editingTeamId ? { ...payload, id: editingTeamId } : t));
          setTeam(up);
          localStorage.setItem('rapha-cares-team', JSON.stringify(up));
        } else {
          const { data, error } = await supabase.from('team_members').insert([dbPayload]).select();
          if (error) throw error;
          if (data && data[0]) {
            const up = [...team, { ...data[0], imageUrl: data[0].image_url }];
            setTeam(up);
            localStorage.setItem('rapha-cares-team', JSON.stringify(up));
          }
        }
      } else {
        const localId = editingTeamId ?? genId();
        const localPayload = { ...payload, id: localId };
        const up = editingTeamId
          ? team.map((t) => (t.id === editingTeamId ? localPayload : t))
          : [...team, localPayload];
        setTeam(up);
        localStorage.setItem('rapha-cares-team', JSON.stringify(up));
      }

      setTeamForm(EMPTY_TEAM_MEMBER);
      setEditingTeamId(null);
      setTeamShowUrlInput(false);
      setTeamUploadError('');
      showToast(editingTeamId ? 'Team member updated!' : 'Team member added!');
    } catch (err) {
      console.error('Error saving team member:', err);
      alert('Failed to save team member.');
    }
  }

  function editTeamMember(member) {
    setTeamForm({
      name: member.name,
      title: member.title,
      bio: member.bio,
      imageUrl: member.imageUrl || '',
    });
    setEditingTeamId(member.id);
    const hasExternalUrl = !!member.imageUrl && (member.imageUrl.startsWith('http://') || member.imageUrl.startsWith('https://'));
    setTeamShowUrlInput(hasExternalUrl);
    setTeamUploadError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteTeamMember(id) {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('team_members').delete().eq('id', id);
        if (error) throw error;
      }
      const up = team.filter((m) => m.id !== id);
      setTeam(up);
      localStorage.setItem('rapha-cares-team', JSON.stringify(up));
      if (editingTeamId === id) {
        setTeamForm(EMPTY_TEAM_MEMBER);
        setEditingTeamId(null);
      }
      showToast('Team member deleted.');
    } catch (err) {
      console.error('Error deleting team member:', err);
      alert('Failed to delete team member.');
    }
  }

  // --- Save Site Settings ---
  function handleSaveSettings(e) {
    e.preventDefault();
    if (setSiteSettings) {
      setSiteSettings(settingsForm);
    }
    localStorage.setItem('rapha-cares-settings', JSON.stringify(settingsForm));
    showToast('Site settings updated successfully!');
  }

  const allProviders = [...therapists, ...psychiatrists];

  // Filtered resources for Admin view
  const adminFilteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchesCat =
        resourceCategoryFilter === 'All' ||
        item.category?.toLowerCase() === resourceCategoryFilter.toLowerCase();
      const q = resourceSearch.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.author?.toLowerCase().includes(q) ||
        item.note?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [resources, resourceCategoryFilter, resourceSearch]);

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
              <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-100 font-medium leading-relaxed">
                Supabase is not configured. Use the local password <strong>{ADMIN_PASS}</strong>. All changes are saved locally in your browser.
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onBack}
                disabled={isLoading}
                className="btn-primary flex-1 bg-stone-100 text-stone-700 hover:bg-stone-200 hover:ring-stone-200 inline-flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
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
    <div className="bg-rc-sand min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-semibold text-rc-terracotta-dark">
                Admin Control Center
              </h1>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                Live
              </span>
            </div>
            <p className="text-sm text-stone-500 mt-1">
              Logged in as{' '}
              <strong className="text-rc-terracotta">
                {isSupabaseConfigured() ? session?.user?.email : 'Founder / Administrator (Local Mode)'}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="btn-primary bg-white text-stone-700 hover:bg-stone-50 hover:ring-stone-200 border border-stone-200 shadow-sm inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Site</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-primary bg-red-50 text-red-600 hover:text-red-700 hover:ring-red-100 border border-red-100"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccessMessage && (
          <div className="flex items-center justify-between gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-800 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>{saveSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveSuccessMessage('')}
              className="text-emerald-600 hover:text-emerald-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('resources')}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === 'resources'
                ? 'bg-rc-terracotta text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/60'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Resources & Media</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                activeTab === 'resources' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {resources.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('practitioners')}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === 'practitioners'
                ? 'bg-rc-terracotta text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/60'
            }`}
          >
            <Stethoscope className="h-4 w-4" />
            <span>Practitioners</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                activeTab === 'practitioners' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {allProviders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === 'team'
                ? 'bg-rc-terracotta text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/60'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Team Members</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                activeTab === 'team' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {team.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prayers')}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === 'prayers'
                ? 'bg-rc-terracotta text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/60'
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>Prayer Requests</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                activeTab === 'prayers' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {prayers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-rc-terracotta text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/60'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Site Content & Settings</span>
          </button>
        </div>

        {/* TAB 1: RESOURCES & MEDIA */}
        {activeTab === 'resources' && (
          <div className="space-y-8 animate-fade-in">
            {/* Category Quick Manager Header Bar */}
            <div className="section-arch-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-stone-800">
                    Category Directory
                  </h3>
                  <p className="text-xs text-stone-500">
                    You have total freedom to create new resource categories at any time without asking a developer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                  className="btn-primary-sm inline-flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isAddingNewCategory ? 'Close' : 'Add Custom Category'}</span>
                </button>
              </div>

              {/* Add Custom Category Box */}
              {isAddingNewCategory && (
                <div className="mb-4 flex flex-wrap items-center gap-2 p-4 rounded-2xl bg-rc-sand-warm/30 border border-rc-dusty/40">
                  <input
                    type="text"
                    placeholder="E.g., Podcasts, Articles, Workbooks, Crisis Lines..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNewCategory();
                      }
                    }}
                    className="input-field flex-1 max-w-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleAddNewCategory()}
                    className="btn-primary-sm"
                  >
                    Save Category
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCategory(false);
                      setNewCategoryName('');
                    }}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-700 px-3 py-2"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Active Category Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {availableCategories.map((cat) => {
                  const count = resources.filter(
                    (r) => r.category?.toLowerCase() === cat.toLowerCase()
                  ).length;
                  const isRemovable = !['Books', 'Sermons', 'Music'].includes(cat) && count === 0;

                  return (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200/80 px-3 py-1 text-xs font-medium text-stone-700 shadow-sm"
                    >
                      {getCategoryIcon(cat, 'h-3.5 w-3.5 text-rc-terracotta')}
                      <span className="font-semibold">{cat}</span>
                      <span className="text-stone-400">({count})</span>
                      {isRemovable && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          title="Remove empty category"
                          className="text-stone-400 hover:text-red-500 ml-1 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Add / Edit Resource Form */}
            <section className="section-arch-card overflow-hidden">
              <div className="arch-header flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl text-rc-terracotta-dark">
                    {editingResourceId ? 'Edit Resource' : 'Add Custom Resource'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Add books, sermons, podcasts, articles, or any custom resource.
                  </p>
                </div>
                {editingResourceId && (
                  <button
                    type="button"
                    onClick={() => {
                      setResourceForm(EMPTY_RESOURCE);
                      setEditingResourceId(null);
                      setResourceShowUrlInput(false);
                      setResourceUploadError('');
                    }}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-800 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={saveResource} className="grid gap-5 px-6 pb-6 pt-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Resource Title *
                  </label>
                  <input
                    placeholder="e.g. Try Softer, Hope in Hard Places"
                    value={resourceForm.title}
                    onChange={(e) => updateResourceForm('title', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                      className="text-xs font-semibold text-rc-terracotta hover:text-rc-terracotta-dark"
                    >
                      + Type New Category
                    </button>
                  </div>

                  {isAddingNewCategory ? (
                    <div className="flex gap-2">
                      <input
                        placeholder="Type new category name..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="input-field"
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewCategory(false);
                          setNewCategoryName('');
                        }}
                        className="px-3 text-xs text-stone-500 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <select
                      value={resourceForm.category}
                      onChange={(e) => {
                        if (e.target.value === '__add_new__') {
                          setIsAddingNewCategory(true);
                        } else {
                          updateResourceForm('category', e.target.value);
                        }
                      }}
                      className="input-field"
                    >
                      {availableCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="__add_new__">+ Create New Category...</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Author / Speaker / Creator
                  </label>
                  <input
                    placeholder="e.g. Aundi Kolber, Tim Keller, Lauren Daigle"
                    value={resourceForm.author}
                    onChange={(e) => updateResourceForm('author', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Badge / Tag (Optional)
                  </label>
                  <input
                    placeholder="e.g. Featured, Free, Staff Pick, New"
                    value={resourceForm.badge}
                    onChange={(e) => updateResourceForm('badge', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Description / Note *
                  </label>
                  <input
                    placeholder="Short description of why this resource helps (e.g. Gentle, trauma-informed practices)"
                    value={resourceForm.note}
                    onChange={(e) => updateResourceForm('note', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    External Link URL *
                  </label>
                  <input
                    type="url"
                    placeholder="https://amazon.com/... or https://youtube.com/..."
                    value={resourceForm.linkUrl}
                    onChange={(e) => updateResourceForm('linkUrl', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Custom Button Label (Optional)
                  </label>
                  <input
                    placeholder={`Leave blank to auto-use "${resourceLinkLabel(resourceForm)}"`}
                    value={resourceForm.buttonLabel}
                    onChange={(e) => updateResourceForm('buttonLabel', e.target.value)}
                    className="input-field"
                  />
                  <p className="text-xxs text-stone-400 mt-1">
                    E.g. &quot;Listen on Spotify&quot;, &quot;Buy on Amazon&quot;, &quot;Read Article&quot;, &quot;Download PDF&quot;.
                  </p>
                </div>

                {/* Resource Cover Photo Upload */}
                <div className="sm:col-span-2 space-y-2 pt-1 border-t border-stone-100">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Resource Cover Image / Thumbnail (Optional)
                  </label>

                  {resourceForm.imageUrl ? (
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                      <img
                        src={resourceForm.imageUrl}
                        alt="Preview"
                        className="h-20 w-28 rounded-xl object-cover shadow-sm bg-white border border-stone-100"
                      />
                      <div className="space-y-1">
                        <p className="text-xs text-stone-600 font-medium">Cover image selected</p>
                        <button
                          type="button"
                          onClick={() => updateResourceForm('imageUrl', '')}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="resource-file-upload"
                      onDragOver={(e) => {
                        e.preventDefault();
                        setResourceIsDragging(true);
                      }}
                      onDragLeave={() => setResourceIsDragging(false)}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setResourceIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) await processImageFile(file, 'resource');
                      }}
                      className={`flex justify-center rounded-xl border-2 border-dashed px-6 py-5 cursor-pointer transition-all duration-300 ${
                        resourceIsDragging
                          ? 'border-rc-terracotta bg-rc-sand-warm/30'
                          : 'border-stone-300 bg-white hover:border-rc-dusty hover:bg-stone-50/30'
                      }`}
                    >
                      <div className="space-y-1 text-center pointer-events-none">
                        <div className="flex justify-center">
                          <ImageIcon className="h-8 w-8 text-stone-400" />
                        </div>
                        <div className="text-sm text-stone-600">
                          <span className="font-semibold text-rc-terracotta hover:text-rc-terracotta-dark">
                            Upload a cover thumbnail
                          </span>
                          <span className="pl-1">or drag and drop</span>
                        </div>
                        <p className="text-xs text-stone-500">PNG, JPG, WEBP (auto-compressed)</p>
                      </div>
                      <input
                        id="resource-file-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) await processImageFile(file, 'resource');
                        }}
                        disabled={resourceIsUploading}
                      />
                    </label>
                  )}

                  {resourceUploadError && (
                    <p className="text-xs text-red-500 font-medium" role="alert">
                      {resourceUploadError}
                    </p>
                  )}

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setResourceShowUrlInput(!resourceShowUrlInput)}
                      className="text-xs text-stone-500 hover:text-rc-terracotta font-medium underline underline-offset-2 transition-colors"
                    >
                      {resourceShowUrlInput ? 'Hide image URL option' : 'Or paste a direct image URL link instead'}
                    </button>
                    {resourceIsUploading && (
                      <span className="text-xs text-rc-terracotta font-medium animate-pulse">
                        Processing image...
                      </span>
                    )}
                  </div>

                  {resourceShowUrlInput && (
                    <div className="pt-2 animate-fade-in">
                      <input
                        type="url"
                        placeholder="https://example.com/cover.jpg"
                        value={resourceForm.imageUrl}
                        onChange={(e) => updateResourceForm('imageUrl', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 sm:col-span-2 pt-2">
                  <button type="submit" className="btn-primary flex-1 sm:flex-initial">
                    {editingResourceId ? 'Save Changes' : 'Add Resource'}
                  </button>
                  {editingResourceId && (
                    <button
                      type="button"
                      onClick={() => {
                        setResourceForm(EMPTY_RESOURCE);
                        setEditingResourceId(null);
                        setResourceShowUrlInput(false);
                      }}
                      className="btn-primary bg-stone-300 text-stone-700 hover:bg-stone-400 hover:ring-stone-400"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* Active Resources Manager Table / Cards */}
            <section className="section-arch-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-4">
                <div>
                  <h2 className="font-display text-xl text-rc-terracotta-dark">
                    Active Resources ({resources.length})
                  </h2>
                  <p className="text-xs text-stone-500">
                    Filter or search below to quickly find, update, or remove resources.
                  </p>
                </div>

                {/* Filter and Search controls */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={resourceSearch}
                      onChange={(e) => setResourceSearch(e.target.value)}
                      className="input-field py-1.5 pl-9 pr-3 text-xs"
                    />
                  </div>

                  <select
                    value={resourceCategoryFilter}
                    onChange={(e) => setResourceCategoryFilter(e.target.value)}
                    className="input-field py-1.5 text-xs w-auto"
                  >
                    <option value="All">All Categories</option>
                    {availableCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {adminFilteredResources.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-sm">
                  No resources match the selected filter.
                </div>
              ) : (
                <ul className="space-y-3">
                  {adminFilteredResources.map((r) => (
                    <li
                      key={r.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-100 bg-rc-sand/30 p-4 transition-colors hover:bg-rc-sand/50"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {r.imageUrl ? (
                          <img
                            src={r.imageUrl}
                            alt=""
                            className="h-12 w-12 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-stone-200 shadow-sm shrink-0">
                            {getCategoryIcon(r.category, 'h-6 w-6 text-rc-terracotta')}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-stone-800 text-sm truncate">
                              {r.title}
                            </h4>
                            <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-xxs font-medium text-stone-600">
                              {r.category}
                            </span>
                            {r.badge && (
                              <span className="rounded-full bg-rc-terracotta/10 px-2 py-0.5 text-xxs font-bold text-rc-terracotta">
                                {r.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 truncate mt-0.5">
                            {r.author ? `by ${r.author} — ` : ''}
                            {r.note}
                          </p>
                          {r.linkUrl && (
                            <a
                              href={r.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xxs font-medium text-rc-terracotta hover:underline mt-0.5"
                            >
                              <span className="truncate max-w-xs">{r.linkUrl}</span>
                              <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => editResource(r)}
                          className="btn-primary-sm py-1.5 px-3 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteResource(r.id)}
                          className="btn-primary-sm bg-red-400 hover:text-red-600 hover:ring-red-400 py-1.5 px-3 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: PRACTITIONERS */}
        {activeTab === 'practitioners' && (
          <div className="space-y-8 animate-fade-in">
            {/* Provider form */}
            <section className="section-arch-card overflow-hidden">
              <div className="arch-header flex items-center justify-between">
                <h2 className="font-display text-xl text-rc-terracotta-dark">
                  {editingProviderId ? 'Edit Practitioner' : 'Add Practitioner'}
                </h2>
                {editingProviderId && (
                  <button
                    type="button"
                    onClick={() => {
                      setProviderForm(EMPTY_PROVIDER);
                      setEditingProviderId(null);
                      setShowUrlInput(false);
                      setUploadError('');
                    }}
                    className="text-xs font-semibold text-stone-600 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={saveProvider} className="grid gap-4 px-6 pb-6 pt-2 sm:grid-cols-2">
                <input
                  placeholder="Name (e.g. Dr. Sarah Mitchell)"
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
                  placeholder="Credentials (e.g. PhD, LMFT, MD)"
                  value={providerForm.credentials}
                  onChange={(e) => updateProviderForm('credentials', e.target.value)}
                  className="input-field"
                  required
                />
                <input
                  placeholder="Location (e.g. Austin, TX · Telehealth available)"
                  value={providerForm.location}
                  onChange={(e) => updateProviderForm('location', e.target.value)}
                  className="input-field"
                  required
                />
                <input
                  placeholder="Areas of focus (e.g. Anxiety, grief, faith integration)"
                  value={providerForm.focus}
                  onChange={(e) => updateProviderForm('focus', e.target.value)}
                  className="input-field"
                  required
                />
                <input
                  placeholder="Price (e.g. $140 / session)"
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
                      htmlFor="provider-file-upload"
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) await processImageFile(file, 'provider');
                      }}
                      className={`flex justify-center rounded-xl border-2 border-dashed px-6 py-6 cursor-pointer transition-all duration-300 ${
                        isDragging
                          ? 'border-rc-terracotta bg-rc-sand-warm/30'
                          : 'border-stone-300 bg-white hover:border-rc-dusty hover:bg-stone-50/30'
                      }`}
                    >
                      <div className="space-y-2 text-center pointer-events-none">
                        <div className="text-sm text-stone-600">
                          <span className="font-semibold text-rc-terracotta hover:text-rc-terracotta-dark">
                            Upload a photo
                          </span>
                          <span className="pl-1">or drag and drop</span>
                        </div>
                        <p className="text-xs text-stone-500">PNG, JPG, WEBP (will be resized and compressed)</p>
                      </div>
                      <input
                        id="provider-file-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) await processImageFile(file, 'provider');
                        }}
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
                      }}
                      className="btn-primary bg-stone-400 hover:text-stone-600 hover:ring-stone-400"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* Practitioner list */}
            <section className="section-arch-card p-6">
              <h2 className="mb-4 font-display text-xl text-rc-terracotta-dark">
                Active Practitioners ({allProviders.length})
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
          </div>
        )}

        {/* TAB 3: TEAM MEMBERS */}
        {activeTab === 'team' && (
          <div className="space-y-8 animate-fade-in">
            {/* Team form */}
            <section className="section-arch-card overflow-hidden">
              <div className="arch-header flex items-center justify-between">
                <h2 className="font-display text-xl text-rc-terracotta-dark">
                  {editingTeamId ? 'Edit Team Member' : 'Add Team Member'}
                </h2>
                {editingTeamId && (
                  <button
                    type="button"
                    onClick={() => {
                      setTeamForm(EMPTY_TEAM_MEMBER);
                      setEditingTeamId(null);
                      setTeamShowUrlInput(false);
                    }}
                    className="text-xs font-semibold text-stone-600 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200"
                  >
                    Cancel Edit
                  </button>
                )}
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

                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Team Member Photo (optional)
                  </label>

                  {teamForm.imageUrl ? (
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                      <img
                        src={teamForm.imageUrl}
                        alt="Preview"
                        className="h-20 w-20 rounded-full object-cover shadow-sm bg-white border border-stone-100"
                      />
                      <div className="space-y-1">
                        <p className="text-xs text-stone-500 font-medium">Photo selected successfully</p>
                        <button
                          type="button"
                          onClick={() => updateTeamForm('imageUrl', '')}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="team-file-upload"
                      onDragOver={(e) => {
                        e.preventDefault();
                        setTeamIsDragging(true);
                      }}
                      onDragLeave={() => setTeamIsDragging(false)}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setTeamIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) await processImageFile(file, 'team');
                      }}
                      className={`flex justify-center rounded-xl border-2 border-dashed px-6 py-6 cursor-pointer transition-all duration-300 ${
                        teamIsDragging
                          ? 'border-rc-terracotta bg-rc-sand-warm/30'
                          : 'border-stone-300 bg-white hover:border-rc-dusty hover:bg-stone-50/30'
                      }`}
                    >
                      <div className="space-y-2 text-center pointer-events-none">
                        <div className="text-sm text-stone-600">
                          <span className="font-semibold text-rc-terracotta hover:text-rc-terracotta-dark">
                            Upload a photo
                          </span>
                          <span className="pl-1">or drag and drop</span>
                        </div>
                        <p className="text-xs text-stone-500">PNG, JPG, WEBP (resized and compressed)</p>
                      </div>
                      <input
                        id="team-file-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) await processImageFile(file, 'team');
                        }}
                        disabled={teamIsUploading}
                      />
                    </label>
                  )}

                  {teamUploadError && (
                    <p className="text-xs text-red-500 font-medium" role="alert">{teamUploadError}</p>
                  )}

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setTeamShowUrlInput(!teamShowUrlInput)}
                      className="text-xs text-stone-500 hover:text-rc-terracotta font-medium underline underline-offset-2 transition-colors"
                    >
                      {teamShowUrlInput ? 'Hide image URL option' : 'Or paste a direct image URL link instead'}
                    </button>
                    {teamIsUploading && (
                      <span className="text-xs text-rc-terracotta font-medium animate-pulse">
                        Processing image...
                      </span>
                    )}
                  </div>

                  {teamShowUrlInput && (
                    <div className="pt-2 animate-fade-in">
                      <input
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        value={teamForm.imageUrl}
                        onChange={(e) => updateTeamForm('imageUrl', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  )}
                </div>

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
                        setTeamShowUrlInput(false);
                      }}
                      className="btn-primary bg-stone-400 hover:text-stone-600 hover:ring-stone-400"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* Team list */}
            <section className="section-arch-card p-6">
              <h2 className="mb-4 font-display text-xl text-rc-terracotta-dark">Team Members ({team.length})</h2>
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
          </div>
        )}

        {/* TAB 4: PRAYER REQUESTS & BOOKINGS */}
        {activeTab === 'prayers' && (
          <div className="animate-fade-in">
            <BookingLog prayers={prayers} onDelete={handleDeletePrayer} />
          </div>
        )}

        {/* TAB 5: SITE CONTENT & SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fade-in">
            <section className="section-arch-card overflow-hidden">
              <div className="arch-header">
                <h2 className="font-display text-xl text-rc-terracotta-dark">
                  Global Site Content & Settings
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Update text, announcements, booking links, and safety messages without touching any code.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 p-6">
                {/* Announcement Banner */}
                <div className="p-4 rounded-2xl bg-rc-sand-warm/30 border border-rc-dusty/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-stone-800 text-sm">
                        Site-wide Announcement Banner
                      </h3>
                      <p className="text-xxs text-stone-500">
                        Shows a high-visibility announcement banner across the top of all pages.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.announcementActive}
                        onChange={(e) =>
                          updateSettingsForm('announcementActive', e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rc-terracotta"></div>
                    </label>
                  </div>

                  {settingsForm.announcementActive && (
                    <div>
                      <input
                        type="text"
                        placeholder="e.g. Join our live prayer call this Friday at 7 PM EST! Free & confidential."
                        value={settingsForm.announcementText}
                        onChange={(e) =>
                          updateSettingsForm('announcementText', e.target.value)
                        }
                        className="input-field text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Homepage Tagline */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Homepage Hero Tagline
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.tagline}
                    onChange={(e) => updateSettingsForm('tagline', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                {/* Welcome Modal Text */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    First-Time Welcome Modal Message
                  </label>
                  <textarea
                    rows={4}
                    value={settingsForm.welcomeText}
                    onChange={(e) => updateSettingsForm('welcomeText', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                {/* About Us Paragraphs */}
                <div className="space-y-3">
                  <h3 className="font-display font-semibold text-stone-800 text-sm">
                    &quot;About Rapha Cares&quot; Homepage Section
                  </h3>
                  <div>
                    <label className="block text-xxs font-semibold uppercase tracking-wider text-stone-400 mb-1">
                      Paragraph 1
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.aboutP1}
                      onChange={(e) => updateSettingsForm('aboutP1', e.target.value)}
                      className="input-field text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-semibold uppercase tracking-wider text-stone-400 mb-1">
                      Paragraph 2
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.aboutP2}
                      onChange={(e) => updateSettingsForm('aboutP2', e.target.value)}
                      className="input-field text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-semibold uppercase tracking-wider text-stone-400 mb-1">
                      Closing Highlight Quote
                    </label>
                    <input
                      value={settingsForm.aboutHighlight}
                      onChange={(e) => updateSettingsForm('aboutHighlight', e.target.value)}
                      className="input-field text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Support Calendly Booking URLs */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Live Prayer Call Booking Link
                    </label>
                    <input
                      type="url"
                      value={settingsForm.prayerCallUrl}
                      onChange={(e) => updateSettingsForm('prayerCallUrl', e.target.value)}
                      className="input-field text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Peer Support Booking Link
                    </label>
                    <input
                      type="url"
                      value={settingsForm.peerSupportUrl}
                      onChange={(e) => updateSettingsForm('peerSupportUrl', e.target.value)}
                      className="input-field text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Safety Banner Notice */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Emergency Safety Banner Notice (Bottom of every page)
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.safetyNotice}
                    onChange={(e) => updateSettingsForm('safetyNotice', e.target.value)}
                    className="input-field text-sm"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" className="btn-primary">
                    Save Site Settings
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
