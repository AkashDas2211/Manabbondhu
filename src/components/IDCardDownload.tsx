import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  membership_type: string;
  photo_url?: string;
  created_at: string;
}

export default function IDCardDownload({ member }: { member: Member }) {
  const cardRef = useRef<HTMLDivElement>(null);

  async function downloadIDCard() {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [85.6, 140],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 140);
      pdf.save(`${member.full_name}-ID-Card.pdf`);
    } catch (error) {
      console.error('Failed to download ID card:', error);
    }
  }

  const membershipDate = new Date(member.created_at);
  const membershipNumber = `MB${membershipDate.getFullYear()}${String(membershipDate.getMonth() + 1).padStart(2, '0')}${String(membershipDate.getDate()).padStart(2, '0')}-${member.id.slice(0, 4).toUpperCase()}`;

  return (
    <div className="space-y-4">
      {/* ID Card Preview - Portrait */}
      <div
        ref={cardRef}
        className="w-full max-w-xs mx-auto bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl overflow-hidden shadow-2xl"
        style={{
          width: '280px',
          aspectRatio: '0.61',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          color: 'white',
          fontFamily: "'Inter', sans-serif",
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-5%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <img
              src="/mblogo-removebg-preview.png"
              alt="Logo"
              style={{
                height: '50px',
                width: 'auto',
                margin: '0 auto',
                marginBottom: '4px',
              }}
            />
            <div style={{ fontSize: '14px', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '2px' }}>
              MANABBONDHU
            </div>
            <div style={{ fontSize: '9px', fontWeight: '600', opacity: 0.9, letterSpacing: '1px' }}>
              NGO
            </div>
            <div style={{ fontSize: '8px', opacity: 0.8, marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '4px' }}>
              Membership Card
            </div>
          </div>

          {/* Photo Section */}
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={member.full_name}
                style={{
                  width: '100px',
                  height: '120px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  margin: '0 auto',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100px',
                  height: '120px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  border: '3px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  fontSize: '10px',
                  textAlign: 'center',
                  padding: '8px',
                }}
              >
                No Photo
              </div>
            )}
          </div>

          {/* Member Details */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Name and Type */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center', marginBottom: '2px' }}>
                {member.full_name}
              </div>
              <div style={{ fontSize: '9px', textAlign: 'center', opacity: 0.9, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {member.membership_type} Member
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ fontSize: '8px', lineHeight: '1.4', opacity: 0.95 }}>
              <div style={{ marginBottom: '3px' }}>
                <span style={{ fontWeight: 'bold' }}>ID:</span> {membershipNumber}
              </div>
              <div style={{ marginBottom: '3px' }}>
                <span style={{ fontWeight: 'bold' }}>Email:</span> {member.email}
              </div>
              <div style={{ marginBottom: '3px' }}>
                <span style={{ fontWeight: 'bold' }}>Phone:</span> {member.phone || 'N/A'}
              </div>
              <div style={{ marginBottom: '3px' }}>
                <span style={{ fontWeight: 'bold' }}>Location:</span> {member.city}, {member.state}
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>Since:</span>{' '}
                {membershipDate.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '6px', marginTop: '6px', fontSize: '7px', textAlign: 'center', opacity: 0.8 }}>
              Valid during active membership
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadIDCard}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors"
      >
        <Download className="w-4 h-4" />
        Download ID Card (PDF)
      </button>
    </div>
  );
}
