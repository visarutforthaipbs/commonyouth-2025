
import React, { useEffect, useState } from 'react';
import { MapPin, ArrowRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Project } from '../types';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand-obsidian mb-4">โครงการและกรณีศึกษา</h1>
        <p className="text-brand-earth max-w-2xl mx-auto">
          เรียนรู้จากความสำเร็จและบทเรียนของโครงการที่ขับเคลื่อนโดยเยาวชนในพื้นที่ต่างๆ
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-brand-earth opacity-50">กำลังโหลดข้อมูลโครงการ...</div>
      ) : (
        <div className="grid gap-12">
          {projects.map((project, index) => (
            <div key={project.id} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Image Side */}
              <div className="w-full md:w-1/2">
                <div 
                  className="relative rounded-2xl overflow-hidden border-2 border-brand-obsidian shadow-retro group cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute top-4 left-4 bg-brand-linen px-3 py-1 rounded-full text-xs font-bold border border-brand-obsidian">
                    {project.category}
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className="flex items-center text-brand-earth text-sm font-medium space-x-4">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {project.location}</span>
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {project.date}</span>
                </div>
                
                <h2 className="text-3xl font-bold text-brand-obsidian hover:text-brand-bud cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                  {project.title}
                </h2>
                <p className="text-brand-earth leading-relaxed text-lg">
                  {project.description}
                </p>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-brand-gray/50 my-4">
                  <div>
                    <span className="block text-2xl font-bold text-brand-bud">{project.stats.volunteers}</span>
                    <span className="text-xs text-brand-earth">อาสาสมัคร</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-brand-ocean">{project.stats.beneficiaries}</span>
                    <span className="text-xs text-brand-earth">ผู้ได้รับประโยชน์</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="flex items-center text-brand-orange font-bold hover:underline"
                >
                  อ่านรายละเอียดโครงการ <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
