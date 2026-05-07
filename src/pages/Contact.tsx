import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([form]);

    if (dbError) {
      setError('Failed to send message. Please try again.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
    setTimeout(() => setSuccess(false), 5000);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-950 via-[#0a1a14] to-[#0d1912]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-teal-500 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-emerald-400 tracking-wider uppercase">Contact Us</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white tracking-tight">
            Get in Touch
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            Have questions or want to learn more? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-[#0a0f0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                <p className="mt-3 text-gray-400">
                  Reach out to us through any of the channels below, or fill out the form and we will get back to you.
                </p>
              </div>
              <div className="space-y-6">
                {[
                  { icon: MapPin, label: 'Address', value: 'Kolkata, West Bengal, India' },
                  { icon: Phone, label: 'Phone', value: '+91 XXXXX XXXXX' },
                  { icon: Mail, label: 'Email', value: 'info@manabbondhu.org' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">{label}</div>
                      <div className="text-white font-medium">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
                {success && (
                  <div className="mb-6 flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Message sent successfully!</span>
                  </div>
                )}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-white placeholder-gray-600"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-white placeholder-gray-600"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-white placeholder-gray-600"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow resize-none text-white placeholder-gray-600"
                      placeholder="Tell us more..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-emerald-800 disabled:to-teal-800 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
