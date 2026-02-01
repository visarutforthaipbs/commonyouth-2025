
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Activity } from '../types';
import { Calendar as CalendarIcon, MapPin, Clock, AlertCircle, X, CheckCircle, History } from 'lucide-react';

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [filterMode, setFilterMode] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    apiService.getActivities().then(setActivities);
  }, []);

  const getStatusDisplay = (status: string) => {
      switch(status) {
          case 'Open': return { text: 'เปิดรับสมัคร', color: 'bg-brand-bud text-brand-obsidian border border-brand-obsidian' };
          case 'Closing Soon': return { text: 'ใกล้ปิดรับ', color: 'bg-brand-orange text-white' };
          case 'Closed': return { text: 'ปิดแล้ว', color: 'bg-brand-gray text-brand-earth' };
          default: return { text: status, color: 'bg-brand-ocean text-white' };
      }
  };

  const formatMonthThai = (date: Date) => {
      const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      return months[date.getMonth()];
  };

  // Filter and Sort Logic
  const filteredActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      const now = new Date();
      // Reset time to midnight for accurate day comparison if needed, 
      // but simple timestamp comparison works for "Past" vs "Upcoming"
      return filterMode === 'upcoming' ? activityDate >= now : activityDate < now;
  }).sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      // Upcoming: Ascending (Nearest first)
      // Past: Descending (Most recent past first)
      return filterMode === 'upcoming' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="container mx-auto px-4 py-12 relative min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-brand-gray pb-4">
        <div>
            <h1 className="text-3xl font-bold text-brand-obsidian mb-2">ปฏิทินกิจกรรม</h1>
            <p className="text-brand-earth">เข้าร่วมกิจกรรมที่เกิดขึ้นในชุมชนของคุณ</p>
        </div>
        <div className="mt-4 md:mt-0 bg-white p-1 rounded-lg border border-brand-gray inline-flex">
            <button 
                onClick={() => setFilterMode('upcoming')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    filterMode === 'upcoming' 
                    ? 'bg-brand-obsidian text-brand-linen shadow-sm' 
                    : 'text-brand-earth hover:bg-brand-linen'
                }`}
            >
                เร็วๆ นี้
            </button>
            <button 
                onClick={() => setFilterMode('past')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    filterMode === 'past' 
                    ? 'bg-brand-obsidian text-brand-linen shadow-sm' 
                    : 'text-brand-earth hover:bg-brand-linen'
                }`}
            >
                ที่ผ่านมา
            </button>
        </div>
      </div>

      {filteredActivities.length > 0 ? (
          <div className="grid gap-6">
            {filteredActivities.map((activity) => {
                const date = new Date(activity.date);
                const statusInfo = getStatusDisplay(activity.status);
                const isPast = filterMode === 'past';

                return (
                    <div key={activity.id} className={`bg-white rounded-xl p-0 md:p-6 flex flex-col md:flex-row gap-6 border border-brand-gray hover:border-brand-bud transition-colors shadow-sm overflow-hidden ${isPast ? 'opacity-80 hover:opacity-100' : ''}`}>
                        {/* Mobile Image */}
                        <div className="md:hidden h-32 w-full grayscale-[0.2]">
                            <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover" />
                        </div>

                        {/* Date Box */}
                        <div className={`hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 shrink-0 ${isPast ? 'bg-brand-gray/30 border-brand-gray' : 'bg-brand-linen border-brand-obsidian'}`}>
                            <span className={`text-xs font-bold uppercase ${isPast ? 'text-brand-earth' : 'text-brand-orange'}`}>{formatMonthThai(date)}</span>
                            <span className={`text-3xl font-bold ${isPast ? 'text-brand-earth' : 'text-brand-obsidian'}`}>{date.getDate()}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-grow p-4 md:p-0">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${isPast ? 'bg-brand-gray text-brand-earth' : statusInfo.color}`}>
                                    {isPast ? 'จบกิจกรรมแล้ว' : statusInfo.text}
                                </span>
                                <span className="text-xs text-brand-earth font-medium flex items-center">
                                    <Clock className="w-3 h-3 mr-1" /> 
                                    {date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-brand-obsidian mb-1">{activity.title}</h3>
                            <p className="text-brand-bud font-medium text-sm mb-3">โดย {activity.groupName}</p>
                            
                            <div className="flex items-center text-brand-earth text-sm mb-4">
                                <MapPin className="w-4 h-4 mr-1" /> {activity.location}
                            </div>

                            <button 
                                onClick={() => setSelectedActivity(activity)}
                                className="text-brand-obsidian font-bold text-sm border-b-2 border-brand-morning hover:bg-brand-morning/20 transition-colors"
                            >
                                ดูรายละเอียด
                            </button>
                        </div>

                        {/* Desktop Image Thumb */}
                        <div className="hidden md:block w-32 h-32 rounded-xl overflow-hidden shrink-0">
                            <img src={activity.imageUrl} alt={activity.title} className={`w-full h-full object-cover ${isPast ? 'grayscale' : ''}`} />
                        </div>
                    </div>
                );
            })}
          </div>
      ) : (
          <div className="text-center py-20 bg-brand-linen/50 rounded-2xl border-2 border-dashed border-brand-gray">
              <div className="w-16 h-16 bg-brand-gray/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-brand-earth" />
              </div>
              <h3 className="text-xl font-bold text-brand-obsidian mb-2">
                  {filterMode === 'upcoming' ? 'ไม่มีกิจกรรมเร็วๆ นี้' : 'ไม่มีกิจกรรมที่ผ่านมา'}
              </h3>
              <p className="text-brand-earth">
                  {filterMode === 'upcoming' ? 'ลองตรวจสอบกิจกรรมในอดีตหรือกลับมาดูใหม่ภายหลัง' : 'ยังไม่มีประวัติกิจกรรมในระบบ'}
              </p>
          </div>
      )}

      {/* Closing Soon Alert (Only show for Upcoming) */}
      {filterMode === 'upcoming' && (
        <div className="mt-12 bg-brand-orange/10 border-l-4 border-brand-orange p-6 rounded-r-xl flex gap-4 items-start">
            <AlertCircle className="w-6 h-6 text-brand-orange shrink-0" />
            <div>
                <h4 className="font-bold text-brand-orange text-lg">ห้ามพลาด!</h4>
                <p className="text-brand-obsidian text-sm mt-1">มีหลายกิจกรรมที่กำลังจะปิดรับสมัคร ตรวจสอบแท็ก 'ใกล้ปิดรับ' เพื่อสำรองที่นั่งด่วน</p>
            </div>
        </div>
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm z-[100]">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={() => setSelectedActivity(null)}
                    className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors z-10 shadow-sm"
                >
                    <X className="w-6 h-6 text-brand-darkGreen" />
                </button>

                <div className="relative h-64">
                     <img src={selectedActivity.imageUrl} alt={selectedActivity.title} className={`w-full h-full object-cover ${new Date(selectedActivity.date) < new Date() ? 'grayscale' : ''}`} />
                     <div className="absolute bottom-4 left-4">
                         <span className={`text-xs font-bold px-3 py-1 rounded-full ${new Date(selectedActivity.date) < new Date() ? 'bg-brand-earth text-white' : getStatusDisplay(selectedActivity.status).color}`}>
                            {new Date(selectedActivity.date) < new Date() ? 'จบกิจกรรมแล้ว' : getStatusDisplay(selectedActivity.status).text}
                         </span>
                     </div>
                </div>

                <div className="p-8">
                    <h2 className="text-3xl font-bold text-brand-obsidian mb-2 leading-tight">{selectedActivity.title}</h2>
                    <p className="text-brand-bud font-bold mb-6 text-lg">จัดโดย {selectedActivity.groupName}</p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8 p-6 bg-brand-linen rounded-xl border border-brand-gray">
                        <div className="flex items-center text-brand-earth">
                            <CalendarIcon className="w-6 h-6 mr-4 text-brand-orange" />
                            <div>
                                <div className="text-xs font-bold uppercase text-brand-obsidian">วันที่</div>
                                <div className="font-medium">{new Date(selectedActivity.date).toLocaleDateString('th-TH', { dateStyle: 'long' })}</div>
                            </div>
                        </div>
                        <div className="flex items-center text-brand-earth">
                            <Clock className="w-6 h-6 mr-4 text-brand-orange" />
                             <div>
                                <div className="text-xs font-bold uppercase text-brand-obsidian">เวลา</div>
                                <div className="font-medium">{new Date(selectedActivity.date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</div>
                            </div>
                        </div>
                        <div className="flex items-center text-brand-earth md:col-span-2 border-t border-brand-gray/50 pt-4 mt-2">
                            <MapPin className="w-6 h-6 mr-4 text-brand-ocean" />
                             <div>
                                <div className="text-xs font-bold uppercase text-brand-obsidian">สถานที่</div>
                                <div className="font-medium">{selectedActivity.location}</div>
                            </div>
                        </div>
                    </div>

                    <div className="prose text-brand-obsidian/80 font-ui mb-8 leading-relaxed">
                        <h3 className="text-lg font-bold text-brand-obsidian mb-3 border-l-4 border-brand-morning pl-3">รายละเอียดกิจกรรม</h3>
                        <p>{selectedActivity.description || "ไม่มีรายละเอียดเพิ่มเติม"}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {new Date(selectedActivity.date) >= new Date() ? (
                            <button className="flex-1 bg-brand-obsidian text-white py-3 rounded-xl font-bold hover:bg-brand-bud transition-colors shadow-retro flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                ลงทะเบียนเข้าร่วม
                            </button>
                        ) : (
                            <button disabled className="flex-1 bg-brand-gray text-brand-earth py-3 rounded-xl font-bold cursor-not-allowed flex items-center justify-center">
                                กิจกรรมจบลงแล้ว
                            </button>
                        )}
                        <button onClick={() => setSelectedActivity(null)} className="px-8 py-3 border-2 border-brand-gray text-brand-earth font-bold rounded-xl hover:bg-brand-linen transition-colors">
                            ปิด
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
