import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Users, Stethoscope, BookOpen, Utensils, ArrowRight, ChevronDown,
  HandHeart, Target, Sparkles,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface GalleryImage {
  id: string;
  section: string;
  url: string;
  alt: string;
  caption: string;
  sort_order: number;
}

const DEFAULTS: Record<string, Record<string, string>> = {
  hero: {
    badge_text: '5+ Years of Service',
    title_line1: 'Together We',
    title_line2: 'Make a Difference',
    description: 'Manabbondhu NGO has been dedicated to serving communities through medical aid, nutritious food, educational materials, and hope for countless lives across West Bengal.',
    cta_primary_text: 'Join Us',
    cta_secondary_text: 'Learn More',
  },
  stats: {
    stat_1_value: '5+', stat_1_label: 'Years of Service',
    stat_2_value: '1000+', stat_2_label: 'Lives Impacted',
    stat_3_value: '50+', stat_3_label: 'Volunteers',
    stat_4_value: '100+', stat_4_label: 'Events Organized',
  },
  about: {
    subtitle: 'Who We Are',
    title: 'A Community Built on Compassion',
    paragraph_1: 'Manabbondhu NGO started as a humble initiative and has grown into a dedicated organization serving communities across West Bengal. Our mission is to provide essential support to those who need it most - from medical assistance to educational resources.',
    paragraph_2: 'With over five transformative years of dedicated service, we have touched countless lives through our various programs and initiatives. Every member of our team shares a common vision: to create a better tomorrow for everyone.',
    stat_badge_value: '5+',
    stat_badge_label: 'Years of Impact',
  },
  services: {
    subtitle: 'What We Do',
    title: 'Our Services',
    description: 'We provide essential services to uplift communities and create lasting positive change.',
  },
  service_1: { title: 'Medical Aid', description: 'Providing essential medical assistance and healthcare support to underserved communities.' },
  service_2: { title: 'Food Distribution', description: 'Delivering nutritious food and meals to families and individuals in need.' },
  service_3: { title: 'Education Support', description: 'Supplying educational materials and resources to empower the next generation.' },
  cta: {
    title: 'Ready to Make a Difference?',
    description: 'Join our growing family of volunteers and supporters. Together, we can bring hope and positive change to more lives.',
    button_primary_text: 'Become a Member',
    button_secondary_text: 'Contact Us',
  },
};

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800';

export default function Home() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [aboutImages, setAboutImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      const [contentRes, imagesRes] = await Promise.all([
        supabase.from('site_content').select('section,key,value'),
        supabase.from('gallery_images').select('*').eq('section', 'about').order('sort_order'),
      ]);

      const contentMap: Record<string, string> = {};
      for (const item of (contentRes.data || [])) {
        contentMap[`${item.section}.${item.key}`] = item.value;
      }
      setContent(contentMap);
      setAboutImages(imagesRes.data || []);
      setLoading(false);
    }
    loadContent();
  }, []);

  function get(section: string, key: string): string {
    return content[`${section}.${key}`] || DEFAULTS[section]?.[key] || '';
  }

  const statIcons = [Heart, Users, HandHeart, Target];
  const serviceCards = [
    { icon: Stethoscope, ...DEFAULTS.service_1, iconColor: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { icon: Utensils, ...DEFAULTS.service_2, iconColor: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { icon: BookOpen, ...DEFAULTS.service_3, iconColor: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  ];

  const aboutImg = aboutImages[0]?.url || DEFAULT_IMAGE;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-[#0a1a14] to-[#0d1912]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400 rounded-full blur-[100px]" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">{get('hero', 'badge_text')}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              {get('hero', 'title_line1')}
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {get('hero', 'title_line2')}
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl">
              {get('hero', 'description')}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/membership" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/30 transition-all duration-300">
                {get('hero', 'cta_primary_text')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-300">
                {get('hero', 'cta_secondary_text')}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-emerald-500/40" />
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-emerald-500/10 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => {
              const Icon = statIcons[i - 1];
              return (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white">{get('stats', `stat_${i}_value`)}</div>
                  <div className="text-sm text-gray-500 mt-1">{get('stats', `stat_${i}_label`)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-24 bg-[#0a0f0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-emerald-400 tracking-wider uppercase">{get('about', 'subtitle')}</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white tracking-tight">
                {get('about', 'title').replace('Compassion', '')}
                <span className="text-emerald-400"> Compassion</span>
              </h2>
              <p className="mt-6 text-gray-400 leading-relaxed">{get('about', 'paragraph_1')}</p>
              <p className="mt-4 text-gray-400 leading-relaxed">{get('about', 'paragraph_2')}</p>
              <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                Read our story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-emerald-900/30 to-teal-900/30 overflow-hidden border border-emerald-500/10">
                <img src={aboutImg} alt="Community service" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-xl border border-emerald-500/20 p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{get('about', 'stat_badge_value')}</div>
                  <div className="text-sm text-gray-500">{get('about', 'stat_badge_label')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-[#080c0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold text-emerald-400 tracking-wider uppercase">{get('services', 'subtitle')}</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white tracking-tight">{get('services', 'title')}</h2>
            <p className="mt-4 text-gray-400">{get('services', 'description')}</p>
          </div>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCards.map((card, idx) => {
              const sKey = `service_${idx + 1}`;
              const Icon = card.icon;
              return (
                <div key={sKey} className="group bg-gray-900/50 rounded-2xl p-8 border border-gray-800 hover:border-emerald-500/30 hover:bg-gray-900/80 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-xl ${card.bg} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${card.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{get(sKey, 'title')}</h3>
                  <p className="mt-3 text-gray-400 leading-relaxed">{get(sKey, 'description')}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 relative overflow-hidden border-y border-emerald-500/10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{get('cta', 'title')}</h2>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">{get('cta', 'description')}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/membership" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all">
              {get('cta', 'button_primary_text')} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all">
              {get('cta', 'button_secondary_text')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
