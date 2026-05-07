import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Utensils,
  BookOpen,
  Heart,
  Users,
  Home,
  HandHeart,
  ArrowRight,
} from 'lucide-react';

const services = [
  {
    icon: Stethoscope,
    title: 'Medical Aid',
    desc: 'We provide essential medical assistance and healthcare support to underserved communities. Our programs include health camps, medicine distribution, and connecting patients with healthcare facilities.',
    color: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    image: 'https://images.pexels.com/photos/30570808/pexels-photo-30570808.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: Utensils,
    title: 'Food Distribution',
    desc: 'Our food distribution programs ensure that nutritious meals reach families and individuals facing food insecurity. We organize regular food drives and community kitchens.',
    color: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    image: 'https://images.pexels.com/photos/6748448/pexels-photo-6748448.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: BookOpen,
    title: 'Education Support',
    desc: 'We supply educational materials, school supplies, and tutoring resources to children from underprivileged backgrounds, empowering them to build a brighter future.',
    color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    image: 'https://images.pexels.com/photos/6995187/pexels-photo-6995187.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: Heart,
    title: 'Healthcare Awareness',
    desc: 'We conduct awareness campaigns on hygiene, nutrition, preventive healthcare, and mental well-being to help communities make informed health decisions.',
    color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    image: 'https://images.pexels.com/photos/6942083/pexels-photo-6942083.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: Home,
    title: 'Shelter Support',
    desc: 'We assist vulnerable individuals and families with shelter and housing support, working to ensure everyone has a safe place to call home.',
    color: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
    image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: HandHeart,
    title: 'Community Development',
    desc: 'We organize skill development workshops, vocational training, and community building events to foster self-reliance and sustainable growth.',
    color: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export default function Services() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-950 via-[#0a1a14] to-[#0d1912]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-emerald-400 tracking-wider uppercase">Our Services</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white tracking-tight">
            How We Serve
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            Through diverse programs and initiatives, we work to uplift communities and create
            lasting positive change in the lives of those who need it most.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-[#0a0f0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;
              const [bgClass, borderClass, textClass] = service.color.split(' ');
              return (
                <div
                  key={service.title}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    !isEven ? 'lg:direction-rtl' : ''
                  }`}
                >
                  <div className={!isEven ? 'lg:order-2' : ''}>
                    <div className={`w-14 h-14 rounded-xl ${bgClass} ${borderClass} border flex items-center justify-center mb-6`}>
                      <Icon className={`w-7 h-7 ${textClass}`} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">{service.title}</h3>
                    <p className="mt-4 text-gray-400 leading-relaxed text-lg">{service.desc}</p>
                  </div>
                  <div className={!isEven ? 'lg:order-1' : ''}>
                    <div className="rounded-2xl overflow-hidden border border-emerald-500/10">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-72 object-cover"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Volunteers */}
      <section className="py-24 bg-[#080c0a] border-t border-emerald-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Join Our Team of Volunteers
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Our volunteers are the backbone of Manabbondhu. If you share our passion for
            community service, we would love to have you on board.
          </p>
          <Link
            to="/membership"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
          >
            Become a Volunteer
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
