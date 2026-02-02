
import React, { useEffect, useState, useMemo } from 'react';
import { MapPin, ArrowRight, Calendar, Search, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Project, PROJECT_CATEGORIES, PROJECT_STATUSES } from '../types';
import SEO from '../components/SEO';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    apiService.getProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  // Filtered projects based on search and filters
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === '' || project.category === selectedCategory;
      
      // Status filter
      const matchesStatus = selectedStatus === '' || project.projectStatus === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, searchQuery, selectedCategory, selectedStatus]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedStatus;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <SEO 
        title="โครงการและกรณีศึกษา" 
        description="เรียนรู้จากความสำเร็จและบทเรียนของโครงการที่ขับเคลื่อนโดยเยาวชนในพื้นที่ต่างๆ"
      />
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-obsidian mb-4 uppercase">โครงการและกรณีศึกษา</h1>
        <p className="text-sm sm:text-base text-brand-earth max-w-2xl mx-auto px-2 leading-relaxed">
          เรียนรู้จากความสำเร็จและบทเรียนของโครงการที่ขับเคลื่อนโดยเยาวชนในพื้นที่ต่างๆ
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-earth" />
          <input
            type="text"
            placeholder="ค้นหาโครงการ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-brand-earth hover:text-brand-obsidian"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Toggle & Active Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
              showFilters ? 'bg-brand-obsidian text-white' : 'bg-brand-gray/50 text-brand-obsidian hover:bg-brand-gray'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            ตัวกรอง
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center px-4 py-2 rounded-lg bg-brand-orange/20 text-brand-orange font-bold text-sm hover:bg-brand-orange/30 transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              ล้างตัวกรอง
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 p-3 sm:p-4 bg-brand-linen/50 rounded-xl border border-brand-gray">
            {/* Category Filter */}
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <label className="block text-xs font-bold text-brand-earth mb-1">หมวดหมู่</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full p-2 rounded-lg border border-brand-gray bg-white focus:border-brand-bud outline-none text-sm"
              >
                <option value="">ทุกหมวดหมู่</option>
                {PROJECT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <label className="block text-xs font-bold text-brand-earth mb-1">สถานะ</label>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full p-2 rounded-lg border border-brand-gray bg-white focus:border-brand-bud outline-none text-sm"
              >
                <option value="">ทุกสถานะ</option>
                {PROJECT_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="text-center text-sm text-brand-earth">
          พบ {filteredProjects.length} โครงการ
          {hasActiveFilters && ` (จากทั้งหมด ${projects.length})`}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-brand-earth opacity-50">กำลังโหลดข้อมูลโครงการ...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-brand-obsidian mb-2">ไม่พบโครงการ</h3>
          <p className="text-brand-earth mb-4">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-brand-bud text-brand-obsidian font-bold rounded-lg hover:bg-brand-bud/80 transition-colors"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-12">
          {filteredProjects.map((project, index) => (
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
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-brand-linen px-3 py-1 rounded-full text-xs font-bold font-mono border border-brand-obsidian">
                      {project.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                      project.projectStatus === 'completed'
                        ? 'bg-brand-ocean text-white'
                        : 'bg-brand-bud text-brand-obsidian border border-brand-obsidian'
                    }`}>
                      {project.projectStatus === 'completed' ? 'เสร็จสิ้นแล้ว' : 'กำลังดำเนินการ'}
                    </span>
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
                    <span className="block text-2xl font-bold font-mono text-brand-bud">{project.stats.volunteers}</span>
                    <span className="text-xs text-brand-earth uppercase tracking-wide">อาสาสมัคร</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold font-mono text-brand-ocean">{project.stats.beneficiaries}</span>
                    <span className="text-xs text-brand-earth uppercase tracking-wide">ผู้ได้รับประโยชน์</span>
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
