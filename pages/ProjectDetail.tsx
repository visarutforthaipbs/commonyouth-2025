
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Project } from '../types';
import { MapPin, Calendar, ArrowLeft, Users, Activity, Heart } from 'lucide-react';
import SEO from '../components/SEO';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      apiService.getProjectById(id).then(data => {
        setProject(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-brand-earth">กำลังโหลดข้อมูล...</div>;
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-obsidian mb-4 uppercase">ไม่พบข้อมูลโครงการ</h1>
        <button onClick={() => navigate('/projects')} className="text-brand-orange underline">
            กลับไปหน้ารวมโครงการ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <SEO 
        title={project.title} 
        description={`${project.description.substring(0, 150)}...`}
        image={project.image}
      />
      {/* Header Image */}
      <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] relative overflow-hidden">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian/80 via-transparent to-transparent"></div>
        <div className="absolute top-6 left-6">
            <button 
                onClick={() => navigate('/projects')}
                className="bg-white/90 hover:bg-white text-brand-obsidian px-4 py-2 rounded-full font-bold text-sm flex items-center shadow-lg transition-all"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> กลับ
            </button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 sm:-mt-16 md:-mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-brand-gray overflow-hidden">
            {/* Title Section */}
            <div className="p-4 sm:p-6 md:p-8 border-b border-brand-gray">
                <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-brand-orange text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {project.category}
                    </span>
                    <span className="bg-brand-linen border border-brand-gray text-brand-obsidian px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        <MapPin className="w-3 h-3 mr-1" /> {project.location}
                    </span>
                    <span className="bg-brand-linen border border-brand-gray text-brand-obsidian px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> {project.date}
                    </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-obsidian mb-4 leading-tight uppercase">{project.title}</h1>
                <p className="text-base sm:text-lg md:text-xl text-brand-earth font-ui">{project.description}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-gray border-b border-brand-gray bg-brand-linen/30">
                <div className="p-3 sm:p-4 md:p-6 text-center">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-brand-bud mx-auto mb-2" />
                    <div className="text-lg sm:text-xl md:text-2xl font-bold font-mono text-brand-obsidian">{project.stats.volunteers}</div>
                    <div className="text-xs text-brand-earth uppercase tracking-wide">อาสาสมัคร</div>
                </div>
                <div className="p-6 text-center">
                    <Heart className="w-8 h-8 text-brand-orange mx-auto mb-2" />
                    <div className="text-2xl font-bold font-mono text-brand-obsidian">{project.stats.beneficiaries}</div>
                    <div className="text-xs text-brand-earth uppercase tracking-wide">ผู้ได้รับประโยชน์</div>
                </div>
                <div className="p-6 text-center">
                    <Activity className="w-8 h-8 text-brand-ocean mx-auto mb-2" />
                    <div className="text-2xl font-bold font-mono text-brand-obsidian">Active</div>
                    <div className="text-xs text-brand-earth uppercase tracking-wide">สถานะ</div>
                </div>
                <div className="p-6 text-center flex flex-col justify-center">
                    <button className="bg-brand-obsidian text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-bud hover:text-brand-obsidian transition-colors shadow-retro">
                        สนับสนุนโครงการ
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8 md:p-12 grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-6 text-lg text-brand-obsidian leading-relaxed font-ui">
                    <h3 className="text-2xl font-bold font-sans border-l-4 border-brand-orange pl-4">ที่มาและความสำคัญ</h3>
                    <p>
                        {project.fullContent || project.description}
                    </p>
                    <p>
                        การดำเนินงานของโครงการมุ่งเน้นการมีส่วนร่วมของคนในชุมชนเป็นหลัก โดยมีการจัดประชุมแลกเปลี่ยนความคิดเห็น วางแผน และลงมือทำร่วมกัน เพื่อให้เกิดความยั่งยืนในการแก้ปัญหา
                    </p>
                    
                    <div className="my-8">
                        <img src={`https://picsum.photos/800/400?random=${Number(project.id) + 50}`} alt="Project Activity" className="w-full rounded-xl shadow-md" />
                        <p className="text-sm text-brand-earth mt-2 italic text-center">ภาพบรรยากาศการทำกิจกรรมในพื้นที่</p>
                    </div>

                    <h3 className="text-2xl font-bold font-sans border-l-4 border-brand-ocean pl-4">ผลลัพธ์ที่เกิดขึ้น</h3>
                    <p>
                        จากการดำเนินงานที่ผ่านมา พบว่าชุมชนมีความตื่นตัวและให้ความร่วมมือเป็นอย่างดี เยาวชนแกนนำมีความมั่นใจในการแสดงออกและมีความเป็นผู้นำมากขึ้น นอกจากนี้ยังได้รับการสนับสนุนจากหน่วยงานท้องถิ่นในการขยายผลโครงการไปยังพื้นที่ข้างเคียง
                    </p>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-brand-linen border border-brand-gray p-6 rounded-xl">
                        <h4 className="font-bold text-lg mb-4">หัวข้อที่เกี่ยวข้อง</h4>
                        <div className="flex flex-wrap gap-2">
                            {['การพัฒนาที่ยั่งยืน', 'พลังเยาวชน', project.category, 'นวัตกรรมสังคม'].map(tag => (
                                <span key={tag} className="bg-white border border-brand-gray px-3 py-1 rounded-md text-sm text-brand-earth hover:border-brand-green cursor-pointer transition-colors">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-brand-gray p-6 rounded-xl text-center">
                        <h4 className="font-bold text-lg mb-2">สนใจเข้าร่วมกิจกรรม?</h4>
                        <p className="text-sm text-brand-earth mb-4">ติดตามข่าวสารและกิจกรรมล่าสุดของโครงการนี้ได้ทางโซเชียลมีเดีย</p>
                        <div className="flex justify-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80">FB</div>
                            <div className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80">IG</div>
                            <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80">LN</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
