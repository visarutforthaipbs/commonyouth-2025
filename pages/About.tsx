import React from 'react';
import { Target, Eye, Heart, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-brand-darkGreen mb-4">เกี่ยวกับเรา</h1>
        <div className="w-24 h-1 bg-brand-salmon mx-auto"></div>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        {/* Mission */}
        <div className="bg-white p-8 rounded-2xl border-2 border-brand-green shadow-retro relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full -mr-16 -mt-16"></div>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-brand-green text-white rounded-lg flex items-center justify-center mr-4">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-brand-darkGreen">พันธกิจ (Mission)</h2>
          </div>
          <p className="text-brand-earth leading-relaxed text-lg font-ui">
            มุ่งมั่นสร้างพื้นที่ปลอดภัยและสร้างสรรค์สำหรับเยาวชนไทย เพื่อให้เกิดการรวมตัว แลกเปลี่ยนเรียนรู้ และขับเคลื่อนประเด็นทางสังคมร่วมกัน ผ่านเครื่องมือทางเทคโนโลยีและนวัตกรรมสังคม
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white p-8 rounded-2xl border-2 border-brand-blue shadow-retro relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-full -mr-16 -mt-16"></div>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-brand-blue text-white rounded-lg flex items-center justify-center mr-4">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-brand-darkGreen">วิสัยทัศน์ (Vision)</h2>
          </div>
          <p className="text-brand-earth leading-relaxed text-lg font-ui">
            สังคมที่เสียงของเยาวชนได้รับการรับฟังและมีส่วนร่วมอย่างมีความหมายในการกำหนดนโยบายสาธารณะ เพื่อสร้างอนาคตที่ยั่งยืนและเป็นธรรมสำหรับทุกคน
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">คุณค่าหลักของเรา</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-brand-cream border border-brand-gray p-6 rounded-xl text-center hover:border-brand-salmon transition-colors">
            <div className="w-16 h-16 mx-auto bg-brand-salmon/20 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-brand-salmon" />
            </div>
            <h3 className="font-bold text-xl mb-2">การมีส่วนร่วม</h3>
            <p className="text-brand-earth text-sm">เปิดพื้นที่ให้ทุกคนได้แสดงความคิดเห็น</p>
          </div>
          <div className="bg-brand-cream border border-brand-gray p-6 rounded-xl text-center hover:border-brand-yellow transition-colors">
            <div className="w-16 h-16 mx-auto bg-brand-yellow/20 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-brand-darkGreen" />
            </div>
            <h3 className="font-bold text-xl mb-2">ความหลากหลาย</h3>
            <p className="text-brand-earth text-sm">เคารพในความแตกต่างและวัฒนธรรม</p>
          </div>
          <div className="bg-brand-cream border border-brand-gray p-6 rounded-xl text-center hover:border-brand-green transition-colors">
            <div className="w-16 h-16 mx-auto bg-brand-green/20 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-brand-green" />
            </div>
            <h3 className="font-bold text-xl mb-2">การเปลี่ยนแปลง</h3>
            <p className="text-brand-earth text-sm">มุ่งเน้นผลลัพธ์ที่เป็นรูปธรรม</p>
          </div>
        </div>
      </div>

      {/* Team Section (Static Placeholder) */}
      <div className="bg-brand-darkGreen text-brand-cream rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6">มาร่วมเป็นส่วนหนึ่งของการเปลี่ยนแปลง</h2>
          <p className="max-w-2xl mx-auto text-lg opacity-90 mb-8">
            ไม่ว่าคุณจะเป็นเยาวชน องค์กร หรือผู้สนับสนุน เรามีพื้นที่สำหรับทุกคนในการร่วมสร้างสังคมที่ดีกว่า
          </p>
          <button className="bg-brand-yellow text-brand-darkGreen px-8 py-3 rounded-xl font-bold text-lg hover:bg-white transition-colors">
            ติดต่อเรา
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;