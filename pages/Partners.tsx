import React from 'react';
import { ExternalLink } from 'lucide-react';

// Mock Partners Data
const PARTNERS = [
  { id: 1, name: "สสส.", desc: "สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ" },
  { id: 2, name: "Thai PBS", desc: "องค์การกระจายเสียงและแพร่ภาพสาธารณะแห่งประเทศไทย" },
  { id: 3, name: "UNDP Thailand", desc: "โครงการพัฒนาแห่งสหประชาชาติ" },
  { id: 4, name: "มูลนิธิกระจกเงา", desc: "องค์กรพัฒนาเอกชนทำงานด้านสังคม" },
  { id: 5, name: "iLaw", desc: "โครงการอินเทอร์เน็ตเพื่อกฎหมายประชาชน" },
  { id: 6, name: "School of Changemakers", desc: "พื้นที่เรียนรู้สำหรับนักเปลี่ยนแปลงสังคม" },
  { id: 7, name: "Young Pride Club", desc: "คอมมูนิตี้เพื่อความหลากหลายทางเพศ" },
  { id: 8, name: "Rethink Urban", desc: "เครือข่ายนักพัฒนาเมืองรุ่นใหม่" }
];

const Partners: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-brand-obsidian mb-4">ภาคีเครือข่าย</h1>
        <p className="text-brand-earth max-w-2xl mx-auto">
          เราทำงานร่วมกับองค์กรชั้นนำระดับประเทศและระดับโลกเพื่อขับเคลื่อนการเปลี่ยนแปลง
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {PARTNERS.map((partner) => (
          <div 
            key={partner.id} 
            className="group bg-white p-8 rounded-2xl border-2 border-brand-obsidian hover:border-brand-bud hover:shadow-retro transition-all cursor-pointer flex flex-col items-center text-center"
          >
            {/* Logo Placeholder */}
            <div className="w-24 h-24 mb-6 bg-brand-linen rounded-full flex items-center justify-center border-2 border-brand-obsidian group-hover:scale-110 transition-transform">
              <span className="text-2xl font-bold text-brand-obsidian opacity-50">{partner.name.charAt(0)}</span>
            </div>
            
            <h3 className="font-bold text-brand-obsidian text-lg mb-2">{partner.name}</h3>
            <p className="text-xs text-brand-earth mb-4 flex-grow">{partner.desc}</p>
            
            <div className="text-brand-ocean opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-20 bg-brand-mist/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between border-2 border-brand-ocean/20">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h3 className="text-2xl font-bold text-brand-obsidian mb-2">สนใจร่วมเป็นภาคีเครือข่าย?</h3>
          <p className="text-brand-earth">ร่วมสนับสนุนทรัพยากร ความรู้ และโอกาสให้กับเยาวชนไทย</p>
        </div>
        <button className="bg-brand-obsidian text-brand-linen px-8 py-3 rounded-xl font-bold shadow-retro hover:shadow-none hover:translate-y-1 transition-all">
          ติดต่อฝ่ายพันธมิตร
        </button>
      </div>
    </div>
  );
};

export default Partners;