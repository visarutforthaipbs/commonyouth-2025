
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Group, Activity } from '../types';
import { ArrowLeft, MapPin, Mail, Globe, Tag, Calendar, Clock } from 'lucide-react';
import SEO from '../components/SEO';

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      apiService.getGroupById(id).then(async (groupData) => {
        setGroup(groupData || null);
        
        if (groupData) {
            // Fetch activities for this group
            const activitiesData = await apiService.getGroupActivities(groupData.name);
            setActivities(activitiesData);
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-earth">กำลังโหลด...</div>;
  if (!group) return <div className="text-center py-20">ไม่พบข้อมูลกลุ่ม</div>;

  const formatMonthThai = (dateStr: string) => {
      const date = new Date(dateStr);
      const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      return months[date.getMonth()];
  };

  const formatDay = (dateStr: string) => {
      return new Date(dateStr).getDate();
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <SEO 
        title={group.name} 
        description={`${group.description.substring(0, 150)}...`}
        image={group.imageUrl}
      />
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-brand-earth hover:text-brand-bud">
        <ArrowLeft className="w-4 h-4 mr-2" /> ย้อนกลับ
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-brand-obsidian mb-12">
        <div className="h-48 sm:h-64 md:h-96 relative">
          <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <span className="bg-brand-bud text-brand-obsidian px-3 py-1 rounded-full text-xs font-bold font-mono mb-2 inline-block">{group.province}</span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold uppercase">{group.name}</h1>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-brand-obsidian mb-3">รายละเอียด</h3>
              <p className="text-brand-earth leading-relaxed text-body-ds">{group.description}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-brand-obsidian mb-3">ประเด็นที่ขับเคลื่อน</h3>
              <div className="flex flex-wrap gap-2">
                {group.issues.map(issue => (
                  <span key={issue} className="bg-brand-linen border-2 border-brand-bud/30 text-brand-obsidian px-3 py-1 rounded-full text-sm font-mono flex items-center">
                    <Tag className="w-3 h-3 mr-2 text-brand-bud" /> {issue}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-brand-linen p-6 rounded-xl border-2 border-brand-obsidian">
              <h3 className="font-semibold text-brand-obsidian mb-4">ข้อมูลติดต่อ</h3>
              <div className="space-y-3">
                <div className="flex items-center text-brand-earth">
                  <Mail className="w-5 h-5 mr-3 text-brand-orange" />
                  <a href={`mailto:${group.contact}`} className="hover:underline truncate">{group.contact}</a>
                </div>
                <div className="flex items-center text-brand-earth">
                  <MapPin className="w-5 h-5 mr-3 text-brand-ocean" />
                  <span>{group.province}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/map', { state: { selectedGroupId: group.id } })}
              className="w-full py-3 bg-brand-obsidian text-brand-linen rounded-xl font-bold shadow-retro hover:shadow-none hover:translate-y-1 transition-all flex items-center justify-center"
            >
              <Globe className="w-5 h-5 mr-2" /> ดูในแผนที่
            </button>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="mb-12">
         <h2 className="text-2xl font-bold text-brand-obsidian mb-6 flex items-center">
             <Calendar className="w-6 h-6 mr-2 text-brand-orange" /> 
             กิจกรรมเร็วๆ นี้
         </h2>
         
         {activities.length > 0 ? (
             <div className="grid md:grid-cols-2 gap-6">
                 {activities.map(activity => (
                     <div key={activity.id} className="bg-white rounded-xl border border-brand-gray hover:border-brand-bud transition-colors overflow-hidden flex shadow-sm h-40">
                         {/* Date Box */}
                         <div className="w-24 bg-brand-linen border-r border-brand-gray flex flex-col items-center justify-center p-2 shrink-0 text-center">
                             <span className="text-xs font-bold text-brand-orange uppercase">{formatMonthThai(activity.date)}</span>
                             <span className="text-3xl font-bold text-brand-obsidian">{formatDay(activity.date)}</span>
                         </div>
                         
                         {/* Info */}
                         <div className="p-4 flex flex-col justify-center flex-grow">
                             <div className="flex justify-between items-start mb-1">
                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md mb-2 inline-block ${
                                     activity.status === 'Open' ? 'bg-brand-bud text-brand-obsidian' : 
                                     activity.status === 'Closing Soon' ? 'bg-brand-orange text-white' : 'bg-brand-gray text-brand-earth'
                                 }`}>
                                     {activity.status}
                                 </span>
                                 <span className="text-xs text-brand-earth flex items-center">
                                     <Clock className="w-3 h-3 mr-1" /> 
                                     {new Date(activity.date).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}
                                 </span>
                             </div>
                             
                             <h3 className="font-bold text-brand-obsidian text-lg line-clamp-1 mb-1">{activity.title}</h3>
                             <p className="text-xs text-brand-earth flex items-center">
                                 <MapPin className="w-3 h-3 mr-1" /> {activity.location}
                             </p>
                         </div>
                         
                         {/* Image Thumbnail */}
                         <div className="w-32 shrink-0 hidden sm:block">
                             <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover" />
                         </div>
                     </div>
                 ))}
             </div>
         ) : (
             <div className="text-center py-12 bg-white rounded-xl border border-brand-gray border-dashed text-brand-earth">
                 <p>ยังไม่มีกิจกรรมที่กำลังจะเกิดขึ้น</p>
             </div>
         )}
      </div>
    </div>
  );
};

export default GroupDetail;
