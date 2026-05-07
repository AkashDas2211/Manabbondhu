import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut, Users, MessageSquare, CheckCircle, XCircle, Clock, Shield, ChevronDown, Search, UserCog, LayoutDashboard, Image, Save, Plus, Trash2, CreditCard as Edit3, X } from 'lucide-react';

type Tab = 'content' | 'gallery' | 'members' | 'messages' | 'users';

interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
}

interface GalleryImage {
  id: string;
  section: string;
  url: string;
  alt: string;
  caption: string;
  sort_order: number;
}

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  membership_type: string;
  status: string;
  why_join: string;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

const SECTIONS = [
  { key: 'hero', label: 'Hero Section' },
  { key: 'stats', label: 'Statistics' },
  { key: 'about', label: 'About Section' },
  { key: 'services', label: 'Services Section' },
  { key: 'cta', label: 'Call to Action' },
];

const SERVICE_KEYS = ['service_1', 'service_2', 'service_3'];

export default function AdminDashboard() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [contentSection, setContentSection] = useState('hero');
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [gallerySection, setGallerySection] = useState('about');
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dataLoading, setDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [newImage, setNewImage] = useState({ url: '', alt: '', caption: '', section: 'about' });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchAll = useCallback(async () => {
    if (!user || !isAdmin) return;
    const [contentRes, galleryRes, membersRes, messagesRes, usersRes] = await Promise.all([
      supabase.from('site_content').select('*').order('section'),
      supabase.from('gallery_images').select('*').order('sort_order'),
      supabase.from('members').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    ]);
    setSiteContent(contentRes.data || []);
    setGalleryImages(galleryRes.data || []);
    setMembers(membersRes.data || []);
    setMessages(messagesRes.data || []);
    setUsers(usersRes.data || []);
    setDataLoading(false);
  }, [user, isAdmin]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  function getContentValue(section: string, key: string): string {
    return siteContent.find(c => c.section === section && c.key === key)?.value || '';
  }

  function updateContentValue(section: string, key: string, value: string) {
    setSiteContent(prev => {
      const existing = prev.find(c => c.section === section && c.key === key);
      if (existing) return prev.map(c => c.section === section && c.key === key ? { ...c, value } : c);
      return [...prev, { id: '', section, key, value }];
    });
  }

  async function saveContent() {
    setSaving(true);
    setSaveMessage('');
    const sectionData = siteContent.filter(c => c.section === contentSection || SERVICE_KEYS.includes(c.section));
    const upserts = sectionData.map(c => ({ section: c.section, key: c.key, value: c.value }));
    const { error } = await supabase.from('site_content').upsert(upserts, { onConflict: 'section,key' });
    if (error) setSaveMessage('Error saving: ' + error.message);
    else { setSaveMessage('Saved successfully!'); setTimeout(() => setSaveMessage(''), 3000); }
    setSaving(false);
  }

  async function saveAllContent() {
    setSaving(true);
    setSaveMessage('');
    const upserts = siteContent.map(c => ({ section: c.section, key: c.key, value: c.value }));
    const { error } = await supabase.from('site_content').upsert(upserts, { onConflict: 'section,key' });
    if (error) setSaveMessage('Error: ' + error.message);
    else { setSaveMessage('All content saved!'); setTimeout(() => setSaveMessage(''), 3000); }
    setSaving(false);
  }

  async function addGalleryImage() {
    if (!newImage.url) return;
    const maxOrder = galleryImages.filter(g => g.section === newImage.section).reduce((max, g) => Math.max(max, g.sort_order), 0);
    const { data } = await supabase.from('gallery_images').insert([{
      section: newImage.section, url: newImage.url, alt: newImage.alt, caption: newImage.caption, sort_order: maxOrder + 1,
    }]).select();
    if (data) setGalleryImages(prev => [...prev, ...data]);
    setNewImage({ url: '', alt: '', caption: '', section: gallerySection });
  }

  async function updateGalleryImage(img: GalleryImage) {
    const { data } = await supabase.from('gallery_images').update({ url: img.url, alt: img.alt, caption: img.caption }).eq('id', img.id).select();
    if (data) setGalleryImages(prev => prev.map(g => g.id === img.id ? data[0] : g));
    setEditingImage(null);
  }

  async function deleteGalleryImage(id: string) {
    await supabase.from('gallery_images').delete().eq('id', id);
    setGalleryImages(prev => prev.filter(g => g.id !== id));
  }

  async function updateMemberStatus(id: string, status: string) {
    const { error } = await supabase.from('members').update({ status }).eq('id', id);
    if (!error) setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  }

  async function deleteMessage(id: string) {
    await supabase.from('contact_messages').delete().eq('id', id);
    setMessages(prev => prev.filter(m => m.id !== id));
  }

  async function toggleUserRole(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  }

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login');
  }

  if (loading || !user || !isAdmin) {
    return <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const filteredMembers = members.filter(m => {
    const matchSearch = m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sectionGallery = galleryImages.filter(g => g.section === gallerySection);

  const tabs: { key: Tab; label: string; icon: typeof Users }[] = [
    { key: 'content', label: 'Site Content', icon: LayoutDashboard },
    { key: 'gallery', label: 'Gallery', icon: Image },
    { key: 'members', label: 'Members', icon: Users },
    { key: 'messages', label: 'Messages', icon: MessageSquare },
    { key: 'users', label: 'Users', icon: UserCog },
  ];

  function renderContentEditor() {
    const fields: { label: string; section: string; key: string; multiline?: boolean }[] = [];

    if (contentSection === 'hero') {
      fields.push(
        { label: 'Badge Text', section: 'hero', key: 'badge_text' },
        { label: 'Title Line 1', section: 'hero', key: 'title_line1' },
        { label: 'Title Line 2', section: 'hero', key: 'title_line2' },
        { label: 'Description', section: 'hero', key: 'description', multiline: true },
        { label: 'Primary Button Text', section: 'hero', key: 'cta_primary_text' },
        { label: 'Secondary Button Text', section: 'hero', key: 'cta_secondary_text' },
      );
    } else if (contentSection === 'stats') {
      for (let i = 1; i <= 4; i++) {
        fields.push(
          { label: `Stat ${i} Value`, section: 'stats', key: `stat_${i}_value` },
          { label: `Stat ${i} Label`, section: 'stats', key: `stat_${i}_label` },
        );
      }
    } else if (contentSection === 'about') {
      fields.push(
        { label: 'Subtitle', section: 'about', key: 'subtitle' },
        { label: 'Title', section: 'about', key: 'title' },
        { label: 'Paragraph 1', section: 'about', key: 'paragraph_1', multiline: true },
        { label: 'Paragraph 2', section: 'about', key: 'paragraph_2', multiline: true },
        { label: 'Stat Badge Value', section: 'about', key: 'stat_badge_value' },
        { label: 'Stat Badge Label', section: 'about', key: 'stat_badge_label' },
      );
    } else if (contentSection === 'services') {
      fields.push(
        { label: 'Section Subtitle', section: 'services', key: 'subtitle' },
        { label: 'Section Title', section: 'services', key: 'title' },
        { label: 'Section Description', section: 'services', key: 'description', multiline: true },
      );
      for (const sk of SERVICE_KEYS) {
        const num = sk.split('_')[1];
        fields.push(
          { label: `Service ${num} Title`, section: sk, key: 'title' },
          { label: `Service ${num} Description`, section: sk, key: 'description', multiline: true },
        );
      }
    } else if (contentSection === 'cta') {
      fields.push(
        { label: 'Title', section: 'cta', key: 'title' },
        { label: 'Description', section: 'cta', key: 'description', multiline: true },
        { label: 'Primary Button Text', section: 'cta', key: 'button_primary_text' },
        { label: 'Secondary Button Text', section: 'cta', key: 'button_secondary_text' },
      );
    }

    return (
      <div className="space-y-5">
        {fields.map(({ label, section, key, multiline }) => (
          <div key={`${section}-${key}`}>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
            {multiline ? (
              <textarea
                rows={3}
                value={getContentValue(section, key)}
                onChange={(e) => updateContentValue(section, key, e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow resize-none text-white text-sm placeholder-gray-600"
              />
            ) : (
              <input
                type="text"
                value={getContentValue(section, key)}
                onChange={(e) => updateContentValue(section, key, e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-white text-sm placeholder-gray-600"
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      {/* Header */}
      <header className="bg-gray-950/90 backdrop-blur-xl border-b border-emerald-500/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Shield className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">Manabbondhu NGO</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
              <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Members', value: members.length, icon: Users, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Pending', value: members.filter(m => m.status === 'pending').length, icon: Clock, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
            { label: 'Approved', value: members.filter(m => m.status === 'approved').length, icon: CheckCircle, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
            { label: 'Messages', value: messages.length, icon: MessageSquare, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-gray-900/50 rounded-xl p-5 border border-gray-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${color} border flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900/50 rounded-xl p-1 border border-gray-800 mb-6 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === key ? 'bg-emerald-500/15 text-emerald-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {SECTIONS.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setContentSection(s.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      contentSection === s.key ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' : 'bg-gray-900/50 text-gray-400 border border-gray-800 hover:border-emerald-500/30'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={saveContent} disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-emerald-800 disabled:to-teal-800 text-white text-sm font-medium rounded-lg transition-all">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Section
                </button>
                <button onClick={saveAllContent} disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors border border-gray-700">
                  Save All
                </button>
              </div>
            </div>

            {saveMessage && (
              <div className={`p-3 rounded-lg text-sm font-medium ${saveMessage.includes('Error') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                {saveMessage}
              </div>
            )}

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">
                {SECTIONS.find(s => s.key === contentSection)?.label}
              </h3>
              {renderContentEditor()}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              {['hero', 'about', 'services', 'gallery'].map(s => (
                <button
                  key={s}
                  onClick={() => setGallerySection(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    gallerySection === s ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' : 'bg-gray-900/50 text-gray-400 border border-gray-800 hover:border-emerald-500/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Add new image */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Add New Image</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Image URL</label>
                  <input type="url" value={newImage.url} onChange={e => setNewImage({ ...newImage, url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white text-sm placeholder-gray-600"
                    placeholder="https://images.pexels.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Alt Text</label>
                  <input type="text" value={newImage.alt} onChange={e => setNewImage({ ...newImage, alt: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white text-sm placeholder-gray-600"
                    placeholder="Description of the image" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Caption (optional)</label>
                  <input type="text" value={newImage.caption} onChange={e => setNewImage({ ...newImage, caption: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white text-sm placeholder-gray-600"
                    placeholder="Image caption" />
                </div>
                <div className="flex items-end">
                  <button onClick={addGalleryImage} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-medium rounded-xl transition-all w-full justify-center">
                    <Plus className="w-4 h-4" /> Add Image
                  </button>
                </div>
              </div>
            </div>

            {/* Image grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectionGallery.map(img => (
                <div key={img.id} className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden group">
                  <div className="aspect-video bg-gray-900 relative">
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => setEditingImage(img)} className="p-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
                        <Edit3 className="w-4 h-4 text-gray-300" />
                      </button>
                      <button onClick={() => deleteGalleryImage(img.id)} className="p-2 bg-red-600/80 rounded-lg hover:bg-red-600 transition-colors">
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-white truncate">{img.alt || 'No alt text'}</p>
                    {img.caption && <p className="text-xs text-gray-500 mt-0.5 truncate">{img.caption}</p>}
                  </div>
                </div>
              ))}
              {sectionGallery.length === 0 && (
                <div className="col-span-full text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
                  <Image className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500">No images in this section</p>
                </div>
              )}
            </div>

            {/* Edit image modal */}
            {editingImage && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingImage(null)}>
                <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-800" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Edit Image</h3>
                    <button onClick={() => setEditingImage(null)} className="p-1 hover:bg-gray-800 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Image URL</label>
                      <input type="url" value={editingImage.url} onChange={e => setEditingImage({ ...editingImage, url: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Alt Text</label>
                      <input type="text" value={editingImage.alt} onChange={e => setEditingImage({ ...editingImage, alt: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Caption</label>
                      <input type="text" value={editingImage.caption} onChange={e => setEditingImage({ ...editingImage, caption: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white text-sm" />
                    </div>
                    <button onClick={() => updateGalleryImage(editingImage)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-xl transition-all">
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input type="text" placeholder="Search members..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900/50 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white placeholder-gray-600" />
              </div>
              <div className="relative">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-800 bg-gray-900/50 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white">
                  <option value="all">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>

            {dataLoading ? (
              <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/50 rounded-xl border border-gray-800">
                <Users className="w-12 h-12 text-gray-700 mx-auto mb-3" /><p className="text-gray-500">No members found</p>
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Email</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">City</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {filteredMembers.map(member => (
                        <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{member.full_name}</div>
                            <div className="text-xs text-gray-500 md:hidden">{member.email}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400 hidden md:table-cell">{member.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell">{member.city || '-'}</td>
                          <td className="px-6 py-4"><span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 capitalize">{member.membership_type}</span></td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                              member.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : member.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {member.status === 'pending' && <Clock className="w-3 h-3" />}
                              {member.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                              {member.status === 'rejected' && <XCircle className="w-3 h-3" />}
                              {member.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {member.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => updateMemberStatus(member.id, 'approved')} className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors">Approve</button>
                                <button onClick={() => updateMemberStatus(member.id, 'rejected')} className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">Reject</button>
                              </div>
                            ) : (
                              <button onClick={() => updateMemberStatus(member.id, member.status === 'approved' ? 'rejected' : 'approved')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${member.status === 'approved' ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20' : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'}`}>
                                {member.status === 'approved' ? 'Reject' : 'Approve'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/50 rounded-xl border border-gray-800">
                <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-3" /><p className="text-gray-500">No messages yet</p>
              </div>
            ) : messages.map(msg => (
              <div key={msg.id} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{msg.name}</h3>
                      <span className="text-xs text-gray-600">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{msg.email}</p>
                    {msg.subject && <p className="text-sm font-medium text-emerald-400 mb-2">{msg.subject}</p>}
                    <p className="text-sm text-gray-400 leading-relaxed">{msg.message}</p>
                  </div>
                  <button onClick={() => deleteMessage(msg.id)} className="shrink-0 p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-amber-400"><strong>Note:</strong> Toggle user roles between admin and user. Be careful not to remove your own admin access.</p>
            </div>
            {users.map(u => (
              <div key={u.id} className="bg-gray-900/50 rounded-xl p-5 border border-gray-800 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{u.full_name || 'Unnamed'}</div>
                  <div className="text-xs text-gray-600 mt-0.5">ID: {u.id.slice(0, 8)}...</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-800 text-gray-400'}`}>{u.role}</span>
                  {u.id !== user.id && (
                    <button onClick={() => toggleUserRole(u.id, u.role)} className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700">
                      Make {u.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
