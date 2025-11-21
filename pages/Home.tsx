import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, MapPin, Calendar, Activity } from 'lucide-react';
import { apiService } from '../services/api';
import { Group } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredGroups, setFeaturedGroups] = useState<Group[]>([]);

  useEffect(() => {
    apiService.getGroups().then(groups => setFeaturedGroups(groups.slice(0, 4)));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 px-4">
        {/* Abstract Background Shapes */}
        <div className="absolute top-10 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-brand-salmon/5 rotate-12 blur-3xl -z-10"></div>

        <div className="container mx-auto text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-yellow/20 text-brand-darkGreen text-xs font-bold uppercase tracking-wider mb-6">
            พื้นที่พลังพลเมือง
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-brand-darkGreen mb-6 leading-tight">
            เสริมพลัง <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-blue">เยาวชน</span> <br/>
            ร่วมสร้าง <span className="relative inline-block">
              พื้นที่กลาง
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-salmon" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C2.00025 6.99997 82.4992 1.00007 99.9999 1.99997C117.5 2.99987 198 7.00007 198 7.00007" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-brand-earth mb-10 max-w-2xl mx-auto font-ui">
            เชื่อมต่อกับกลุ่มเยาวชน ค้นหากิจกรรม และแสดงพลังของคนรุ่นใหม่ทั่วประเทศไทย
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/map')}
              className="px-8 py-4 bg-brand-green text-white rounded-xl font-bold text-lg shadow-retro hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center"
            >
              สำรวจแผนที่ <MapPin className="ml-2 w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/community')}
              className="px-8 py-4 bg-white border-2 border-brand-darkGreen text-brand-darkGreen rounded-xl font-bold text-lg hover:bg-brand-cream transition-all flex items-center justify-center"
            >
              ดูกลุ่มทั้งหมด <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-brand-darkGreen text-brand-cream py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <div className="p-2">
              <div className="text-4xl font-bold text-brand-yellow mb-1">200+</div>
              <div className="text-sm tracking-widest opacity-80">สมาชิก</div>
            </div>
            <div className="p-2">
              <div className="text-4xl font-bold text-brand-salmon mb-1">25</div>
              <div className="text-sm tracking-widest opacity-80">กลุ่ม</div>
            </div>
            <div className="p-2">
              <div className="text-4xl font-bold text-brand-blue mb-1">12</div>
              <div className="text-sm tracking-widest opacity-80">จังหวัด</div>
            </div>
            <div className="p-2">
              <div className="text-4xl font-bold text-white mb-1">50+</div>
              <div className="text-sm tracking-widest opacity-80">กิจกรรม</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Steps */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">ขั้นตอนการใช้งาน</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { icon: <Users className="w-8 h-8 text-brand-green" />, title: "เข้าร่วมกลุ่ม", desc: "ค้นหากลุ่มเยาวชนที่ตรงกับความสนใจและพื้นที่ของคุณ" },
            { icon: <Calendar className="w-8 h-8 text-brand-salmon" />, title: "เข้าร่วมกิจกรรม", desc: "เข้าร่วมเวิร์กช็อป วงเสวนา และงานชุมชน" },
            { icon: <Activity className="w-8 h-8 text-brand-blue" />, title: "สร้างความเปลี่ยนแปลง", desc: "ริเริ่มโครงการของคุณและลงทะเบียนในแพลตฟอร์ม" }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border-2 border-brand-gray hover:border-brand-green transition-colors shadow-sm">
              <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-brand-earth font-ui leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Groups Horizontal Scroll */}
      <section className="py-20 bg-brand-blue/5 border-y border-brand-blue/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">กลุ่มแนะนำ</h2>
              <p className="text-brand-earth">ชุมชนที่มีความเคลื่อนไหวและน่าสนใจ</p>
            </div>
            <button onClick={() => navigate('/community')} className="text-brand-green font-bold hover:underline flex items-center">
              ดูทั้งหมด <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {featuredGroups.length > 0 ? featuredGroups.map((group) => (
              <div key={group.id} className="group cursor-pointer" onClick={() => navigate('/community')}>
                <div className="relative overflow-hidden rounded-xl aspect-video mb-4 border-2 border-brand-darkGreen shadow-retro group-hover:shadow-none group-hover:translate-y-1 transition-all">
                  <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-brand-yellow text-brand-darkGreen text-xs font-bold px-2 py-1 rounded-md border border-brand-darkGreen">
                    {group.province}
                  </div>
                </div>
                <h3 className="text-xl font-bold truncate">{group.name}</h3>
                <p className="text-sm text-brand-earth truncate">{group.issues.join(', ')}</p>
              </div>
            )) : (
               <div className="col-span-3 text-center text-brand-earth/50 py-10">กำลังโหลดข้อมูล...</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;