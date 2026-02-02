import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, MapPin, Calendar, Activity } from 'lucide-react';
import { apiService } from '../services/api';
import { Group } from '../types';
import { Button } from '../components/ui';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredGroups, setFeaturedGroups] = useState<Group[]>([]);

  useEffect(() => {
    apiService.getGroups().then(groups => setFeaturedGroups(groups.slice(0, 4)));
  }, []);

  return (
    <div>
      <SEO 
        title="หน้าหลัก" 
        description="พื้นที่กลางสำหรับเยาวชนในการเชื่อมต่อริเริ่มสร้างสรรค์ และขับเคลื่อนสังคมไทย"
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 px-4 bg-brand-linen">
        {/* Abstract Background Shapes - 10% Accent Colors */}
        <div className="absolute top-10 right-0 w-64 h-64 bg-brand-bud/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-brand-ocean/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-brand-orange/3 rotate-12 blur-3xl -z-10"></div>

        <div className="container mx-auto text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-morning/40 text-brand-obsidian text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-brand-obsidian/20">
            พื้นที่พลังพลเมือง
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-brand-obsidian mb-6 leading-none sm:leading-tight tracking-tight uppercase">
            เสริมพลัง<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-bud to-brand-forest">เยาวชน</span><br/>
            ร่วมสร้าง <span className="relative inline-block">
              พื้นที่กลาง
              <svg className="absolute w-full h-2 sm:h-3 -bottom-0.5 sm:-bottom-1 left-0 text-brand-orange" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C2.00025 6.99997 82.4992 1.00007 99.9999 1.99997C117.5 2.99987 198 7.00007 198 7.00007" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
            </span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-brand-earth mb-10 max-w-2xl mx-auto px-2">
            เชื่อมต่อกับกลุ่มเยาวชน ค้นหากิจกรรม และแสดงพลังของคนรุ่นใหม่ทั่วประเทศไทย
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="primary"
              size="lg"
              icon={MapPin}
              iconPosition="right"
              onClick={() => navigate('/map')}
            >
              สำรวจแผนที่
            </Button>
            <Button 
              variant="secondary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/community')}
            >
              ดูกลุ่มทั้งหมด
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar - 60% Obsidian Base, 30% Brand Color Accents */}
      <section className="bg-brand-obsidian text-brand-linen py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <div className="p-2">
              <div className="text-4xl font-bold text-brand-bud mb-1 font-mono">200+</div>
              <div className="text-sm tracking-widest opacity-80">สมาชิก</div>
            </div>
            <div className="p-2">
              <div className="text-4xl font-bold text-brand-orange mb-1 font-mono">25</div>
              <div className="text-sm tracking-widest opacity-80">กลุ่ม</div>
            </div>
            <div className="p-2">
              <div className="text-4xl font-bold text-brand-mist mb-1 font-mono">12</div>
              <div className="text-sm tracking-widest opacity-80">จังหวัด</div>
            </div>
            <div className="p-2">
              <div className="text-4xl font-bold text-white mb-1 font-mono">50+</div>
              <div className="text-sm tracking-widest opacity-80">กิจกรรม</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Steps - 60% Base Background */}
      <section className="py-20 container mx-auto px-4 bg-brand-linen">
        <h2 className="text-2xl md:text-subheader font-semibold text-center mb-16 uppercase">ขั้นตอนการใช้งาน</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { icon: <Users className="w-8 h-8 text-brand-bud" />, title: "เข้าร่วมกลุ่ม", desc: "ค้นหากลุ่มเยาวชนที่ตรงกับความสนใจและพื้นที่ของคุณ" },
            { icon: <Calendar className="w-8 h-8 text-brand-orange" />, title: "เข้าร่วมกิจกรรม", desc: "เข้าร่วมเวิร์กช็อป วงเสวนา และงานชุมชน" },
            { icon: <Activity className="w-8 h-8 text-brand-ocean" />, title: "สร้างความเปลี่ยนแปลง", desc: "ริเริ่มโครงการของคุณและลงทะเบียนในแพลตฟอร์ม" }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border-2 border-brand-obsidian hover:border-brand-bud transition-colors shadow-retro">
              <div className="w-16 h-16 bg-brand-linen rounded-full flex items-center justify-center mb-6 border-2 border-brand-obsidian">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-brand-earth leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Groups Horizontal Scroll */}
      <section className="py-20 bg-brand-mist/20 border-y border-brand-ocean/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-subheader font-semibold mb-2 uppercase">กลุ่มแนะนำ</h2>
              <p className="text-brand-earth">ชุมชนที่มีความเคลื่อนไหวและน่าสนใจ</p>
            </div>
            <Button 
              variant="outline"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/community')}
              className="text-brand-bud border-brand-bud hover:bg-brand-bud/10"
            >
              ดูทั้งหมด
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {featuredGroups.length > 0 ? featuredGroups.map((group) => (
              <div key={group.id} className="group cursor-pointer" onClick={() => navigate('/community')}>
                <div className="relative overflow-hidden rounded-xl aspect-video mb-4 border-2 border-brand-obsidian shadow-retro group-hover:shadow-none group-hover:translate-y-1 transition-all">
                  <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-brand-bud text-brand-obsidian text-xs font-bold px-2 py-1 rounded-md border border-brand-obsidian">
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