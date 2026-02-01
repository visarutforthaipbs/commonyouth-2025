import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { apiService } from '../services/api';
import { ISSUES, PROVINCES, Group } from '../types';
import { THAI_LOCATIONS, getCoordinates } from '../services/thai-data';
import { Upload, CheckCircle, MapPin, Edit2, PlusCircle, User as UserIcon, AlertCircle, Image as ImageIcon, X, FileImage, Trash2, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  // Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  
  // Data States
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null); // Group ID if editing
  
  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; groupId: string | null }>({
    isOpen: false,
    groupId: null
  });
  
  // Profile State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || ''
  });

  // Group Form State
  const initialFormState = {
    name: '',
    province: THAI_LOCATIONS[0].name,
    amphoe: '',
    tambon: '',
    lat: THAI_LOCATIONS[0].coordinates.lat.toString(),
    lng: THAI_LOCATIONS[0].coordinates.lng.toString(),
    description: '',
    contact: '',
    imageUrl: '', // Start empty or specific default
    issues: [] as string[]
  };
  const [groupForm, setGroupForm] = useState(initialFormState);

  // Load user's groups on mount
  useEffect(() => {
    if (user) {
      apiService.getUserGroups(user.uid).then(groups => {
        setMyGroups(groups);
        setIsLoadingGroups(false);
      });
      setProfileForm({
        name: user.name || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  // Location Handlers
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const provinceName = e.target.value;
      const coords = getCoordinates(provinceName);
      
      setGroupForm(prev => ({
          ...prev,
          province: provinceName,
          amphoe: '',
          tambon: '',
          lat: coords.lat.toString(),
          lng: coords.lng.toString()
      }));
  };

  const handleAmphoeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const amphoeName = e.target.value;
      const coords = getCoordinates(groupForm.province, amphoeName);
      
      setGroupForm(prev => ({
          ...prev,
          amphoe: amphoeName,
          tambon: '',
          lat: coords.lat.toString(),
          lng: coords.lng.toString()
      }));
  };

  const handleTambonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const tambonName = e.target.value;
      const coords = getCoordinates(groupForm.province, groupForm.amphoe, tambonName);
      
      setGroupForm(prev => ({
          ...prev,
          tambon: tambonName,
          lat: coords.lat.toString(),
          lng: coords.lng.toString()
      }));
  };

  // Helper to clear specific error when user types
  const handleInputChange = (field: string, value: any) => {
    setGroupForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleIssueToggle = (issue: string) => {
    setGroupForm(prev => {
      const newIssues = prev.issues.includes(issue)
        ? prev.issues.filter(i => i !== issue)
        : [...prev.issues, issue];
      
      // Clear error if issues are selected
      if (errors.issues && newIssues.length > 0) {
        setErrors(prev => {
          const newErr = { ...prev };
          delete newErr.issues;
          return newErr;
        });
      }
      return { ...prev, issues: newIssues };
    });
  };

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        
        // Validate size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert("ขนาดไฟล์ต้องไม่เกิน 2MB");
            return;
        }

        setImageFile(file);
        // Create local preview URL
        setGroupForm(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
        
        // Clear image error if any
        if (errors.imageUrl) {
            setErrors(prev => {
                const newErr = { ...prev };
                delete newErr.imageUrl;
                return newErr;
            });
        }
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the file input
    setImageFile(null);
    setGroupForm(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUserProfile(profileForm.name, profileForm.bio);
      alert("อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว");
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger Delete Modal
  const handleDeleteGroup = (groupId: string) => {
    setDeleteModal({ isOpen: true, groupId });
  };

  // Execute Delete Action
  const confirmDeleteGroup = async () => {
    if (!deleteModal.groupId) return;

    try {
        await apiService.deleteGroup(deleteModal.groupId);
        
        // Remove from local state immediately for better UX
        setMyGroups(prev => prev.filter(g => g.id !== deleteModal.groupId));
        
        // If we were editing this group, stop editing
        if (editMode === deleteModal.groupId) {
            resetForm();
        }
    } catch (error) {
        console.error("Failed to delete group", error);
        alert("เกิดข้อผิดพลาดในการลบกลุ่ม");
    } finally {
        // Close Modal
        setDeleteModal({ isOpen: false, groupId: null });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name
    if (!groupForm.name.trim()) {
      newErrors.name = 'กรุณาระบุชื่อกลุ่ม';
    }

    // Description
    if (!groupForm.description.trim()) {
      newErrors.description = 'กรุณาระบุรายละเอียดของกลุ่ม';
    } else if (groupForm.description.length < 10) {
      newErrors.description = 'รายละเอียดสั้นเกินไป (อย่างน้อย 10 ตัวอักษร)';
    }

    // Issues
    if (groupForm.issues.length === 0) {
      newErrors.issues = 'กรุณาเลือกประเด็นที่ขับเคลื่อนอย่างน้อย 1 ข้อ';
    }

    // Contact (Email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!groupForm.contact.trim()) {
      newErrors.contact = 'กรุณาระบุอีเมลติดต่อ';
    } else if (!emailRegex.test(groupForm.contact)) {
      newErrors.contact = 'รูปแบบอีเมลไม่ถูกต้อง';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("กรุณาตรวจสอบข้อมูลให้ถูกต้อง");
      return;
    }

    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Handle Image Upload
      let finalImageUrl = groupForm.imageUrl;
      
      // Check if we are dealing with a Blob URL (meaning it's a local preview)
      const isBlobUrl = finalImageUrl.startsWith('blob:');

      if (imageFile) {
        try {
            finalImageUrl = await apiService.uploadImage(imageFile);
        } catch (uploadError) {
            console.error("Image upload failed", uploadError);
            alert("อัปโหลดรูปภาพไม่สำเร็จ จะบันทึกโดยใช้รูปภาพเดิมหรือรูปภาพเริ่มต้น");
            
            // Fallback logic
            if (editMode) {
                const originalGroup = myGroups.find(g => g.id === editMode);
                finalImageUrl = originalGroup?.imageUrl || `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`;
            } else {
                finalImageUrl = `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`;
            }
        }
      } else if (isBlobUrl) {
         // Should be rare, but if imageFile is null but URL is blob (e.g. reused), default it
         finalImageUrl = `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`;
      } else if (!finalImageUrl) {
         // If absolutely empty, assign placeholder
         finalImageUrl = `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`;
      }

      const groupData = {
          name: groupForm.name,
          province: groupForm.province,
          amphoe: groupForm.amphoe,
          tambon: groupForm.tambon,
          coordinates: { 
              lat: parseFloat(groupForm.lat), 
              lng: parseFloat(groupForm.lng) 
          },
          issues: groupForm.issues,
          description: groupForm.description,
          contact: groupForm.contact,
          imageUrl: finalImageUrl
      };

      if (editMode) {
        // Update existing group
        await apiService.updateGroup(editMode, groupData);
        alert("อัปเดตข้อมูลกลุ่มเรียบร้อยแล้ว");
      } else {
        // Create new group
        await apiService.addGroup({
          ownerId: user.uid,
          ...groupData
        });
        alert("สร้างกลุ่มใหม่เรียบร้อยแล้ว");
      }

      // Refresh list and reset
      const updatedGroups = await apiService.getUserGroups(user.uid);
      setMyGroups(updatedGroups);
      
      if (editMode) {
          resetForm();
      } else {
          navigate('/community');
      }

    } catch (error) {
      console.error("Failed to save group", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Populate form with group data for editing
  const startEditing = (group: Group) => {
    setEditMode(group.id);
    setImageFile(null);
    setErrors({});
    
    // Map group data to form state
    setGroupForm({
        name: group.name,
        province: group.province,
        amphoe: group.amphoe || '',
        tambon: group.tambon || '',
        lat: group.coordinates.lat.toString(),
        lng: group.coordinates.lng.toString(),
        description: group.description,
        contact: group.contact,
        imageUrl: group.imageUrl,
        issues: group.issues
    });
    
    // Scroll to form to show user the context
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditMode(null);
    setImageFile(null);
    setErrors({});
    setGroupForm(initialFormState);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const ErrorMsg = ({ field }: { field: string }) => (
    errors[field] ? <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors[field]}</p> : null
  );

  const inputClass = (field: string) => `w-full p-3 rounded-lg border outline-none transition-colors ${
    errors[field] 
      ? 'border-red-500 bg-red-50 focus:border-red-500' 
      : 'border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20'
  }`;

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
      
      {/* Left Column: Profile & Group List */}
      <div className="space-y-8 order-2 lg:order-1">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-gray p-6">
            <h2 className="text-xl font-bold text-brand-obsidian mb-4 flex items-center">
                <UserIcon className="w-5 h-5 mr-2" /> ข้อมูลส่วนตัว
            </h2>
            <div className="flex flex-col items-center mb-6">
                <img 
                    src={user?.profileImage} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full border-4 border-brand-linen shadow-md mb-3 object-cover"
                />
                <div className="text-xs text-brand-earth">{user?.email}</div>
            </div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-brand-obsidian mb-1">ชื่อที่แสดง</label>
                    <input 
                        type="text"
                        value={profileForm.name}
                        onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                        className="w-full p-2 text-sm rounded border border-brand-gray focus:border-brand-bud outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-brand-obsidian mb-1">แนะนำตัวสั้นๆ</label>
                    <textarea 
                        value={profileForm.bio}
                        onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                        rows={3}
                        className="w-full p-2 text-sm rounded border border-brand-gray focus:border-brand-bud outline-none"
                        placeholder="เขียนแนะนำตัวเอง..."
                    ></textarea>
                </div>
                <button type="submit" className="w-full py-2 bg-brand-obsidian text-white text-sm font-bold rounded-lg hover:bg-brand-bud transition-colors">
                    บันทึกข้อมูลส่วนตัว
                </button>
            </form>
        </div>

        {/* My Groups List */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-gray p-6">
            <h2 className="text-xl font-bold text-brand-obsidian mb-4">กลุ่มของฉัน</h2>
            {isLoadingGroups ? (
                <div className="text-center text-brand-earth py-4">กำลังโหลด...</div>
            ) : myGroups.length > 0 ? (
                <div className="space-y-3">
                    {myGroups.map(group => (
                        <div key={group.id} className="p-3 border border-brand-gray rounded-lg hover:border-brand-bud transition-colors bg-brand-linen/30">
                            <h3 className="font-bold text-brand-obsidian text-sm mb-1">{group.name}</h3>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-brand-earth">{group.province}</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => startEditing(group)}
                                        className="text-xs flex items-center px-2 py-1 border border-brand-orange text-brand-orange font-bold rounded-md hover:bg-brand-orange hover:text-white transition-colors"
                                    >
                                        <Edit2 className="w-3 h-3 mr-1" /> แก้ไข
                                    </button>
                                    <button
                                        onClick={() => handleDeleteGroup(group.id)}
                                        className="text-xs flex items-center px-2 py-1 border border-brand-earth text-brand-earth font-bold rounded-md hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                                        title="ลบกลุ่ม"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 text-brand-earth text-sm bg-brand-cream rounded-lg border-dashed border border-brand-gray">
                    คุณยังไม่ได้สร้างกลุ่ม
                </div>
            )}
            <button 
                onClick={resetForm}
                className="mt-4 w-full py-2 border-2 border-dashed border-brand-green text-brand-green font-bold rounded-lg hover:bg-brand-green hover:text-white transition-all flex items-center justify-center text-sm"
            >
                <PlusCircle className="w-4 h-4 mr-2" /> เพิ่มกลุ่มใหม่
            </button>
        </div>
      </div>

      {/* Right Column: Group Form */}
      <div className="lg:col-span-2 order-1 lg:order-2">
        <div className="bg-white rounded-2xl shadow-lg border border-brand-gray p-8">
            <div className="flex justify-between items-center mb-6 border-b border-brand-gray pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-brand-darkGreen">
                        {editMode ? 'แก้ไขข้อมูลกลุ่ม' : 'สร้างกลุ่มใหม่'}
                    </h1>
                    <p className="text-brand-earth text-sm">
                        {editMode ? 'อัปเดตรายละเอียดเพื่อให้ข้อมูลเป็นปัจจุบัน' : 'สร้างพื้นที่สำหรับกลุ่มเยาวชนของคุณ'}
                    </p>
                </div>
                {editMode && (
                    <button onClick={resetForm} className="text-xs text-brand-salmon font-bold hover:underline">
                        ยกเลิกการแก้ไข
                    </button>
                )}
            </div>

            <form onSubmit={handleGroupSubmit} className="space-y-6" noValidate>
                {/* Basic Info */}
                <div>
                    <div>
                        <label className="block text-sm font-bold text-brand-obsidian mb-2">ชื่อกลุ่ม <span className="text-brand-orange">*</span></label>
                        <input 
                            type="text" 
                            className={inputClass('name')}
                            placeholder="เช่น เครือข่ายเยาวชนเชียงใหม่"
                            value={groupForm.name}
                            onChange={e => handleInputChange('name', e.target.value)}
                        />
                        <ErrorMsg field="name" />
                    </div>
                </div>

                {/* Location Selection */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-brand-obsidian mb-2">จังหวัด <span className="text-brand-orange">*</span></label>
                        <select 
                            className="w-full p-3 rounded-lg border border-brand-gray focus:border-brand-bud outline-none bg-brand-linen"
                            value={groupForm.province}
                            onChange={handleProvinceChange}
                        >
                            {THAI_LOCATIONS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-brand-obsidian mb-2">อำเภอ/เขต <span className="text-brand-orange">*</span></label>
                        <select 
                            className="w-full p-3 rounded-lg border border-brand-gray focus:border-brand-bud outline-none bg-brand-linen disabled:opacity-50"
                            value={groupForm.amphoe}
                            onChange={handleAmphoeChange}
                            disabled={!groupForm.province}
                        >
                            <option value="">เลือกอำเภอ</option>
                            {THAI_LOCATIONS.find(p => p.name === groupForm.province)?.amphoes.map(a => (
                                <option key={a.name} value={a.name}>{a.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-brand-obsidian mb-2">ตำบล/แขวง <span className="text-brand-orange">*</span></label>
                        <select 
                            className="w-full p-3 rounded-lg border border-brand-gray focus:border-brand-bud outline-none bg-brand-linen disabled:opacity-50"
                            value={groupForm.tambon}
                            onChange={handleTambonChange}
                            disabled={!groupForm.amphoe}
                        >
                            <option value="">เลือกตำบล</option>
                            {THAI_LOCATIONS.find(p => p.name === groupForm.province)?.amphoes
                                .find(a => a.name === groupForm.amphoe)?.tambons.map(t => (
                                <option key={t.name} value={t.name}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-brand-darkGreen mb-2">รายละเอียด <span className="text-brand-salmon">*</span></label>
                    <textarea 
                        rows={4}
                        className={inputClass('description')}
                        placeholder="บอกเล่าเกี่ยวกับพันธกิจ กิจกรรม และเป้าหมายของคุณ..."
                        value={groupForm.description}
                        onChange={e => handleInputChange('description', e.target.value)}
                    ></textarea>
                    <ErrorMsg field="description" />
                </div>

                {/* Issues */}
                <div>
                    <label className="block text-sm font-bold text-brand-darkGreen mb-2">ประเด็นที่ขับเคลื่อน (เลือกอย่างน้อย 1 ข้อ) <span className="text-brand-salmon">*</span></label>
                    <div className={`p-4 rounded-lg border ${errors.issues ? 'border-red-500 bg-red-50' : 'border-transparent'}`}>
                        <div className="flex flex-wrap gap-2">
                            {ISSUES.map(issue => (
                                <button
                                    type="button"
                                    key={issue}
                                    onClick={() => handleIssueToggle(issue)}
                                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                        groupForm.issues.includes(issue) 
                                        ? 'bg-brand-darkGreen text-white border-brand-darkGreen' 
                                        : 'bg-white text-brand-earth border-brand-gray hover:border-brand-green'
                                    }`}
                                >
                                    {issue}
                                </button>
                            ))}
                        </div>
                        <ErrorMsg field="issues" />
                    </div>
                </div>

                {/* Contact Info */}
                <div>
                    <label className="block text-sm font-bold text-brand-darkGreen mb-2">อีเมลติดต่อ <span className="text-brand-salmon">*</span></label>
                    <input 
                        type="email" 
                        className={inputClass('contact')}
                        placeholder="contact@group.org"
                        value={groupForm.contact}
                        onChange={e => handleInputChange('contact', e.target.value)}
                    />
                    <ErrorMsg field="contact" />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-bold text-brand-darkGreen mb-2">รูปภาพหน้าปก</label>
                    
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            relative w-full h-64 rounded-xl overflow-hidden border-2 border-dashed cursor-pointer transition-all group
                            ${groupForm.imageUrl ? 'border-brand-green/50' : 'border-brand-gray hover:border-brand-green hover:bg-brand-cream/30'}
                            ${errors.imageUrl ? 'border-red-500' : ''}
                        `}
                    >
                        {groupForm.imageUrl ? (
                            <>
                                <img 
                                    src={groupForm.imageUrl} 
                                    alt="Group Banner" 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                />
                                {imageFile && (
                                   <div className="absolute top-3 left-3 bg-brand-yellow text-brand-darkGreen px-3 py-1 rounded-full text-xs font-bold shadow-md z-10">
                                     ตัวอย่าง (Preview)
                                   </div>
                                )}
                                <div className="absolute inset-0 bg-brand-darkGreen/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-white/20 p-3 rounded-full mb-2 backdrop-blur-sm">
                                        <ImageIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="font-bold text-white text-lg">เปลี่ยนรูปภาพ</span>
                                    <span className="text-brand-cream text-xs mt-1">คลิกเพื่อเลือกไฟล์ใหม่</span>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Upload className="w-8 h-8 text-brand-green" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-darkGreen mb-1">อัปโหลดรูปภาพ Banner</h3>
                                <p className="text-brand-earth text-sm mb-4">ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์</p>
                                <div className="text-xs text-brand-earth/70 bg-brand-gray/20 px-3 py-1 rounded-full font-medium">
                                    รองรับ JPG, PNG, SVG (สูงสุด 2MB)
                                </div>
                            </div>
                        )}
                        
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/png, image/jpeg, image/svg+xml"
                            onChange={handleImageChange}
                        />
                    </div>
                    
                    {imageFile && (
                        <div className="mt-2 flex items-center justify-between bg-brand-cream p-2 rounded-lg border border-brand-gray">
                            <div className="flex items-center text-xs text-brand-darkGreen">
                                <FileImage className="w-4 h-4 mr-2 text-brand-green" />
                                <span className="font-bold mr-1">ไฟล์ที่เลือก:</span> {imageFile.name}
                            </div>
                            <button 
                                type="button" 
                                onClick={handleRemoveImage}
                                className="text-xs text-brand-salmon hover:text-red-600 font-bold p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    
                    {errors.imageUrl && <ErrorMsg field="imageUrl" />}
                </div>

                <div className="pt-4 border-t border-brand-gray flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-brand-salmon text-white font-bold rounded-xl shadow-md hover:bg-brand-salmon/90 transition-all flex items-center"
                    >
                        {isSubmitting ? 'กำลังบันทึก...' : (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2" /> 
                                {editMode ? 'บันทึกการแก้ไข' : 'สร้างกลุ่ม'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden scale-100 transition-transform">
            <div className="bg-red-50 p-6 text-center border-b border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-brand-darkGreen mb-2">ยืนยันการลบกลุ่ม</h3>
              <p className="text-brand-earth text-sm px-4">
                คุณแน่ใจหรือไม่ที่จะลบกลุ่มนี้? <br/>
                การกระทำนี้ไม่สามารถย้อนกลับได้ และข้อมูลทั้งหมดจะหายไป
              </p>
            </div>
            <div className="p-6 flex gap-3 justify-center bg-white">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, groupId: null })}
                className="px-6 py-2.5 rounded-lg border-2 border-brand-gray text-brand-earth font-bold hover:bg-brand-cream hover:text-brand-darkGreen transition-colors flex-1"
              >
                ยกเลิก
              </button>
              <button 
                onClick={confirmDeleteGroup}
                className="px-6 py-2.5 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 shadow-md transition-colors flex-1 flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" /> ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;