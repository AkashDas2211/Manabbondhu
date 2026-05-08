import { useState } from 'react';
import { CheckCircle, AlertCircle, UserPlus, Upload, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MembershipForm {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  date_of_birth: string;
  occupation: string;
  membership_type: string;
  why_join: string;
}

const initialForm: MembershipForm = {
  full_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  date_of_birth: '',
  occupation: '',
  membership_type: 'general',
  why_join: '',
};

export default function Membership() {
  const [form, setForm] = useState<MembershipForm>(initialForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMember, setSuccessMember] = useState<any>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  function updateField(field: keyof MembershipForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  }

  async function uploadPhoto(memberId: string): Promise<string | null> {
    if (!photoFile) return null;

    try {
      setUploading(true);
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${memberId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('member-photos')
        .upload(`members/${fileName}`, photoFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('member-photos')
        .getPublicUrl(`members/${fileName}`);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Photo upload failed:', err);
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: insertedData, error: dbError } = await supabase
      .from('members')
      .insert([{
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        date_of_birth: form.date_of_birth || null,
        occupation: form.occupation,
        membership_type: form.membership_type,
        why_join: form.why_join,
        photo_url: '',
      }])
      .select();

    if (dbError) {
      setError(dbError.message || 'Failed to submit membership form. Please try again.');
      setLoading(false);
      return;
    }

    const memberId = insertedData?.[0]?.id;

    if (memberId && photoFile) {
      const photoUrl = await uploadPhoto(memberId);
      if (photoUrl) {
        await supabase.from('members').update({ photo_url: photoUrl }).eq('id', memberId);
        insertedData[0].photo_url = photoUrl;
      }
    }

    setSuccess(true);
    setSuccessMember(insertedData?.[0]);
    setForm(initialForm);
    setPhotoFile(null);
    setPhotoPreview('');
    setLoading(false);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-950 via-[#0a1a14] to-[#0d1912]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/2 w-72 h-72 bg-emerald-500 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-emerald-400 tracking-wider uppercase">Join Us</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white tracking-tight">
            Become a Member
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            Join the Manabbondhu family and be part of a community dedicated to making a difference.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 bg-[#0a0f0d]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {success && successMember ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Application Submitted!</h2>
              <p className="mt-3 text-gray-400 max-w-md mx-auto mb-6">
                Thank you for your interest in joining Manabbondhu. We will review your application and get back to you soon.
              </p>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8">
                <p className="text-sm text-blue-400">
                  Your ID card will be available in the admin panel once your application is approved.
                </p>
              </div>

              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Membership Application</h2>
                  <p className="text-sm text-gray-500">Fill in the details below to apply</p>
                </div>
              </div>

              {error && (
                <div className="mb-6 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Profile Photo</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Upload Area */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Photo (JPG, PNG - Max 5MB)</label>
                      <label className="flex items-center justify-center px-4 py-8 rounded-xl border-2 border-dashed border-gray-700 hover:border-emerald-500/50 cursor-pointer transition-colors">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                          <span className="text-sm text-gray-400">Click to upload photo</span>
                          <span className="text-xs text-gray-600 mt-1 block">or drag and drop</span>
                        </div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Preview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Preview</label>
                      {photoPreview ? (
                        <div className="relative">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-xl border border-emerald-500/30"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoFile(null);
                              setPhotoPreview('');
                            }}
                            className="absolute top-2 right-2 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-40 rounded-xl border border-gray-800 bg-gray-900/50 flex items-center justify-center">
                          <p className="text-sm text-gray-600">No photo selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div>
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Personal Information</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.full_name}
                        onChange={(e) => updateField('full_name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-white placeholder-gray-600"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Email *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-white placeholder-gray-600"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-white placeholder-gray-600"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Date of Birth</label>
                      <input
                        type="date"
                        value={form.date_of_birth}
                        onChange={(e) => updateField('date_of_birth', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-white [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Occupation</label>
                      <input
                        type="text"
                        value={form.occupation}
                        onChange={(e) => updateField('occupation', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-white placeholder-gray-600"
                        placeholder="Your occupation"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Membership Type</label>
                      <select
                        value={form.membership_type}
                        onChange={(e) => updateField('membership_type', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-white"
                      >
                        <option value="general">General Member</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="lifetime">Lifetime Member</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Address</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">Address</label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-white placeholder-gray-600"
                        placeholder="Street address"
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">City</label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => updateField('city', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-white placeholder-gray-600"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">State</label>
                        <input
                          type="text"
                          value={form.state}
                          onChange={(e) => updateField('state', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-white placeholder-gray-600"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Pincode</label>
                        <input
                          type="text"
                          value={form.pincode}
                          onChange={(e) => updateField('pincode', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow text-white placeholder-gray-600"
                          placeholder="Pincode"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why Join */}
                <div>
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Tell Us More</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Why do you want to join Manabbondhu?</label>
                    <textarea
                      rows={4}
                      value={form.why_join}
                      onChange={(e) => updateField('why_join', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow resize-none text-white placeholder-gray-600"
                      placeholder="Share your motivation..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-emerald-800 disabled:to-teal-800 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
                >
                  {loading || uploading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
