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
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98);
      pdf.save(`${member.full_name}-ID-Card.pdf`);
    } catch (error) {
      console.error('Failed to download ID card:', error);
    }
  }

  const membershipDate = new Date(member.created_at);
  const membershipNumber = `MB${membershipDate.getFullYear()}${String(membershipDate.getMonth() + 1).padStart(2, '0')}${String(membershipDate.getDate()).padStart(2, '0')}-${member.id.slice(0, 4).toUpperCase()}`;

  return (
    <div className="space-y-4">
      {/* ID Card Preview */}
      <div
        ref={cardRef}
        className="w-full max-w-md mx-auto bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl"
        style={{
          aspectRatio: '1.586 / 1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src="/mblogo-removebg-preview.png"
              alt="Logo"
              className="h-10"
            />
            <div>
              <div className="text-xs font-bold leading-tight">Manabbondhu</div>
              <div className="text-[10px] font-semibold opacity-90">NGO</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-semibold opacity-80">MEMBER ID</div>
            <div className="text-xs font-bold">{membershipNumber}</div>
          </div>
        </div>

        {/* Member Info */}
        <div className="flex gap-4">
          {/* Photo */}
          <div className="flex-shrink-0">
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={member.full_name}
                className="w-20 h-24 rounded-lg object-cover bg-white/20 border-2 border-white"
              />
            ) : (
              <div className="w-20 h-24 rounded-lg bg-white/20 border-2 border-white flex items-center justify-center">
                <div className="text-xs text-center opacity-75">No Photo</div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <div className="text-sm font-bold leading-tight">{member.full_name}</div>
              <div className="text-[10px] opacity-90 capitalize">{member.membership_type} Member</div>
            </div>
            <div className="space-y-1 text-[9px] opacity-85">
              <div>
                <span className="font-semibold">Email:</span> {member.email}
              </div>
              <div>
                <span className="font-semibold">Phone:</span> {member.phone}
              </div>
              <div>
                <span className="font-semibold">Location:</span> {member.city}, {member.state}
              </div>
              <div>
                <span className="font-semibold">Since:</span>{' '}
                {membershipDate.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[9px] text-center opacity-75 border-t border-white/30 pt-2 mt-2">
          This card is valid during active membership. Contact support for renewal.
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
