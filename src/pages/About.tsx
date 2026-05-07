import { Heart, Users, Target, Eye, Award, ArrowRight, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-950 via-[#0a1a14] to-[#0d1912]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-emerald-400 tracking-wider uppercase">About Us</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white tracking-tight">
            Our Story & Mission
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            From a humble beginning to a force of change - discover how Manabbondhu has been
            transforming lives for over five years.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-[#0a0f0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-emerald-400 tracking-wider uppercase">Our Journey</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
                From Humble Beginnings to
                <span className="text-emerald-400"> Lasting Impact</span>
              </h2>
              <p className="mt-6 text-gray-400 leading-relaxed">
                Manabbondhu NGO was born from a simple yet powerful idea - that every person deserves
                access to basic necessities and opportunities. What started as a small group of
                passionate individuals has grown into a dedicated organization serving communities
                across West Bengal.
              </p>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Over the past five years, we have provided essential medical aid, distributed nutritious
                food, supplied educational materials, and brought hope to countless lives. Our journey
                has been fueled by the unwavering support of our volunteers, donors, and community members.
              </p>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Today, Manabbondhu stands as a testament to what collective compassion can achieve.
                We continue to expand our reach and deepen our impact, always guided by our core values
                of service, integrity, and community.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-emerald-500/10">
                  <img
                    src="https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Community service"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-emerald-500/10">
                  <img
                    src="https://images.pexels.com/photos/6942083/pexels-photo-6942083.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Helping hands"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden border border-emerald-500/10">
                  <img
                    src="https://images.pexels.com/photos/6995187/pexels-photo-6995187.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Education support"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-emerald-500/10">
                  <img
                    src="https://images.pexels.com/photos/6748448/pexels-photo-6748448.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Food distribution"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-[#080c0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 rounded-2xl p-10 border border-gray-800 hover:border-emerald-500/20 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              <p className="mt-4 text-gray-400 leading-relaxed">
                To serve communities by providing essential medical aid, nutritious food, and educational
                resources. We strive to create a society where every individual has access to basic
                necessities and opportunities for growth.
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-2xl p-10 border border-gray-800 hover:border-teal-500/20 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Vision</h3>
              <p className="mt-4 text-gray-400 leading-relaxed">
                A compassionate and empowered society where no one is left behind. We envision
                communities that are self-sufficient, healthy, and educated - where every person
                can live with dignity and hope.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#0a0f0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold text-emerald-400 tracking-wider uppercase">Our Values</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
              What Drives Us
            </h2>
          </div>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: 'Compassion', desc: 'Every action is guided by genuine care for those we serve.' },
              { icon: Award, title: 'Integrity', desc: 'We maintain transparency and accountability in all our work.' },
              { icon: Users, title: 'Community', desc: 'We believe in the power of collective action and togetherness.' },
              { icon: LinkIcon, title: 'Service', desc: 'Selfless service is at the heart of everything we do.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 relative overflow-hidden border-y border-emerald-500/10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Join Our Mission
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Be part of something bigger. Your support can change lives.
          </p>
          <Link
            to="/membership"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
          >
            Become a Member
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
