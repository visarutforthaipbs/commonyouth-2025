import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { apiService } from '../services/api';
import { ISSUES, PROVINCES, Group, Activity, Project, PROJECT_CATEGORIES, PROJECT_STATUSES } from '../types';
import { loadThaiLocations, getCoordinates, Province } from '../services/thai-data';
import { Upload, CheckCircle, MapPin, Edit2, Edit3, PlusCircle, User as UserIcon, AlertCircle, Image as ImageIcon, X, FileImage, Trash2, AlertTriangle, Calendar, Clock, Shield, Eye, EyeOff } from 'lucide-react';
import SEO from '../components/SEO';

const Dashboard: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  // Locations Data
  const [thaiLocations, setThaiLocations] = useState<Province[]>([]);
  const [isLocationsLoaded, setIsLocationsLoaded] = useState(false);

  // Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  
  // Data States
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [myActivities, setMyActivities] = useState<Activity[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null); // Group ID if editing
  const [activeTab, setActiveTab] = useState<'groups' | 'activities' | 'projects'>('groups');
  
  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{ 
    isOpen: boolean; 
    type: 'group' | 'activity' | 'project';
    id: string | null 
  }>({
    isOpen: false,
    type: 'group',
    id: null
  });

  // Edit Mode States
  const [editActivityMode, setEditActivityMode] = useState<string | null>(null);
  const [editProjectMode, setEditProjectMode] = useState<string | null>(null);

  // Admin Mode State
  const [adminMode, setAdminMode] = useState(false);
  const isAdmin = user?.role === 'admin';
  
  // Profile State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || ''
  });

  // Group Form State
  const initialFormState = {
    name: '',
    province: '',
    amphoe: '',
    tambon: '',
    lat: '13.7563',
    lng: '100.5018',
    description: '',
    contact: '',
    imageUrl: '', // Start empty or specific default
    issues: [] as string[]
  };
  const [groupForm, setGroupForm] = useState(initialFormState);

  // Activity Form State
  const initialActivityFormState = {
    title: '',
    groupId: '',
    date: '',
    time: '',
    location: '',
    description: '',
    status: 'Open' as 'Open' | 'Closing Soon' | 'Closed'
  };
  const [activityForm, setActivityForm] = useState(initialActivityFormState);
  const [activityErrors, setActivityErrors] = useState<Record<string, string>>({});

  // Project Form State
  const initialProjectFormState = {
    title: '',
    groupId: '',
    activityIds: [] as string[],
    location: '',
    date: '',
    category: '',
    projectStatus: 'ongoing' as 'ongoing' | 'completed',
    description: '',
    fullContent: '',
    volunteers: '',
    beneficiaries: '',
    imageUrl: ''
  };
  const [projectForm, setProjectForm] = useState(initialProjectFormState);
  const [projectErrors, setProjectErrors] = useState<Record<string, string>>({});
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const projectFileInputRef = useRef<HTMLInputElement>(null);

  // Load locations on mount
  useEffect(() => {
    loadThaiLocations().then(data => {
        setThaiLocations(data);
        setIsLocationsLoaded(true);
        if (data.length > 0 && !editMode) {
             // Optional: Set default province if needed, or leave empty to force selection
        }
    });
  }, []);

  // Load user's groups on mount
  useEffect(() => {
    if (user) {
      setIsLoadingGroups(true);
      
      // Admin mode: load ALL content, otherwise load only user's content
      if (adminMode && isAdmin) {
        Promise.all([
          apiService.getAllGroups(),
          apiService.getAllActivities(),
          apiService.getAllProjects()
        ]).then(([groups, activities, projects]) => {
          setMyGroups(groups);
          setMyActivities(activities);
          setMyProjects(projects);
          setIsLoadingGroups(false);
        });
      } else {
        Promise.all([
          apiService.getUserGroups(user.uid),
          apiService.getUserActivities(user.uid),
          apiService.getUserProjects(user.uid)
        ]).then(([groups, activities, projects]) => {
          setMyGroups(groups);
          setMyActivities(activities);
          setMyProjects(projects);
          setIsLoadingGroups(false);
        });
      }
      
      setProfileForm({
        name: user.name || '',
        bio: user.bio || ''
      });
    }
  }, [user, adminMode, isAdmin]);

  // Location Handlers
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const provinceName = e.target.value;
      const coords = getCoordinates(thaiLocations, provinceName);
      
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
      const coords = getCoordinates(thaiLocations, groupForm.province, amphoeName);
      
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
      const coords = getCoordinates(thaiLocations, groupForm.province, groupForm.amphoe, tambonName);
      
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
    setDeleteModal({ isOpen: true, type: 'group', id: groupId });
  };

  const handleDeleteActivity = (activityId: string) => {
    setDeleteModal({ isOpen: true, type: 'activity', id: activityId });
  };

  const handleDeleteProject = (projectId: string) => {
    setDeleteModal({ isOpen: true, type: 'project', id: projectId });
  };

  // Execute Delete Action (Unified)
  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    try {
      if (deleteModal.type === 'group') {
        await apiService.deleteGroup(deleteModal.id);
        setMyGroups(prev => prev.filter(g => g.id !== deleteModal.id));
        if (editMode === deleteModal.id) {
          resetForm();
        }
      } else if (deleteModal.type === 'activity') {
        await apiService.deleteActivity(deleteModal.id);
        setMyActivities(prev => prev.filter(a => a.id !== deleteModal.id));
        if (editActivityMode === deleteModal.id) {
          resetActivityForm();
        }
      } else if (deleteModal.type === 'project') {
        await apiService.deleteProject(deleteModal.id);
        setMyProjects(prev => prev.filter(p => p.id.toString() !== deleteModal.id));
        if (editProjectMode === deleteModal.id) {
          resetProjectForm();
        }
      }
    } catch (error) {
      console.error("Failed to delete", error);
      alert("เกิดข้อผิดพลาดในการลบ");
    } finally {
      setDeleteModal({ isOpen: false, type: 'group', id: null });
    }
  };

  // Reset forms
  const resetActivityForm = () => {
    setEditActivityMode(null);
    setActivityForm(initialActivityFormState);
    setActivityErrors({});
  };

  const resetProjectForm = () => {
    setEditProjectMode(null);
    setProjectForm(initialProjectFormState);
    setProjectErrors({});
    setProjectImageFile(null);
    if (projectFileInputRef.current) projectFileInputRef.current.value = '';
  };

  // Start editing activity
  const startEditingActivity = (activity: Activity) => {
    const activityDate = new Date(activity.date);
    setActivityForm({
      title: activity.title,
      groupId: activity.groupId,
      date: activityDate.toISOString().split('T')[0],
      time: activityDate.toTimeString().slice(0, 5),
      location: activity.location,
      description: activity.description || '',
      status: activity.status
    });
    setEditActivityMode(activity.id);
    setActiveTab('activities');
  };

  // Start editing project
  const startEditingProject = (project: Project) => {
    setProjectForm({
      title: project.title,
      groupId: project.groupId || '',
      activityIds: project.activityIds || [],
      location: project.location,
      date: project.date,
      category: project.category,
      projectStatus: project.projectStatus || 'ongoing',
      description: project.description,
      fullContent: project.fullContent || '',
      volunteers: project.stats.volunteers.toString(),
      beneficiaries: project.stats.beneficiaries,
      imageUrl: project.image
    });
    setEditProjectMode(project.id.toString());
    setActiveTab('projects');
  };

  // Activity Form Handlers
  const handleActivityInputChange = (field: string, value: any) => {
    setActivityForm(prev => ({ ...prev, [field]: value }));
    if (activityErrors[field]) {
      setActivityErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateActivityForm = () => {
    const newErrors: Record<string, string> = {};

    if (!activityForm.title.trim()) {
      newErrors.title = 'กรุณาระบุชื่อกิจกรรม';
    }

    if (!activityForm.groupId) {
      newErrors.groupId = 'กรุณาเลือกกลุ่มที่จัดกิจกรรม';
    }

    if (!activityForm.date) {
      newErrors.date = 'กรุณาระบุวันที่';
    }

    if (!activityForm.time) {
      newErrors.time = 'กรุณาระบุเวลา';
    }

    if (!activityForm.location.trim()) {
      newErrors.location = 'กรุณาระบุสถานที่';
    }

    if (!activityForm.description.trim()) {
      newErrors.description = 'กรุณาระบุรายละเอียดกิจกรรม';
    }

    setActivityErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateActivityForm() || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const selectedGroup = myGroups.find(g => g.id === activityForm.groupId);
      if (!selectedGroup) {
        alert("ไม่พบข้อมูลกลุ่ม");
        return;
      }

      // Combine date and time
      const dateTimeString = `${activityForm.date}T${activityForm.time}:00`;
      const activityDateTime = new Date(dateTimeString).toISOString();

      const activityData = {
        ownerId: user.uid,
        groupId: activityForm.groupId,
        groupName: selectedGroup.name,
        title: activityForm.title,
        date: activityDateTime,
        location: activityForm.location,
        description: activityForm.description,
        status: activityForm.status,
        imageUrl: selectedGroup.imageUrl // Use group's image as default
      };

      if (editActivityMode) {
        // Update existing activity
        await apiService.updateActivity(editActivityMode, activityData);
        alert("อัปเดตกิจกรรมเรียบร้อยแล้ว");
      } else {
        // Create new activity
        await apiService.addActivity(activityData);
        alert("สร้างกิจกรรมใหม่เรียบร้อยแล้ว");
      }
      
      // Refresh activities list
      const updatedActivities = await apiService.getUserActivities(user.uid);
      setMyActivities(updatedActivities);
      
      // Reset form
      resetActivityForm();
    } catch (error) {
      console.error("Activity submission error", error);
      alert("เกิดข้อผิดพลาดในการสร้างกิจกรรม: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Project Form Handlers
  const handleProjectInputChange = (field: string, value: any) => {
    setProjectForm(prev => ({ ...prev, [field]: value }));
    if (projectErrors[field]) {
      setProjectErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateProjectForm = () => {
    const newErrors: Record<string, string> = {};

    if (!projectForm.title.trim()) {
      newErrors.title = 'กรุณาระบุชื่อโครงการ';
    }

    if (!projectForm.groupId) {
      newErrors.groupId = 'กรุณาเลือกกลุ่มที่ดำเนินโครงการ';
    }

    if (!projectForm.location.trim()) {
      newErrors.location = 'กรุณาระบุสถานที่';
    }

    if (!projectForm.date.trim()) {
      newErrors.date = 'กรุณาระบุช่วงเวลา';
    }

    if (!projectForm.category) {
      newErrors.category = 'กรุณาเลือกหมวดหมู่';
    }

    if (!projectForm.description.trim()) {
      newErrors.description = 'กรุณาระบุคำอธิบายโครงการ';
    }

    if (!projectForm.fullContent.trim()) {
      newErrors.fullContent = 'กรุณาระบุรายละเอียดเต็ม';
    }

    setProjectErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProjectForm() || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const selectedGroup = myGroups.find(g => g.id === projectForm.groupId);
      if (!selectedGroup) {
        alert("ไม่พบข้อมูลกลุ่ม");
        return;
      }

      // Handle Image Upload
      let finalImageUrl = projectForm.imageUrl;
      const isBlobUrl = finalImageUrl.startsWith('blob:');

      if (projectImageFile) {
        try {
          finalImageUrl = await apiService.uploadImage(projectImageFile);
        } catch (uploadError) {
          console.error("Image upload failed", uploadError);
          alert("อัปโหลดรูปภาพไม่สำเร็จ จะใช้รูปภาพจากกลุ่มแทน");
          finalImageUrl = selectedGroup.imageUrl;
        }
      } else if (isBlobUrl || !finalImageUrl) {
        finalImageUrl = selectedGroup.imageUrl; // Use group's image as fallback
      }

      const projectData = {
        ownerId: user.uid,
        groupId: projectForm.groupId,
        activityIds: projectForm.activityIds,
        title: projectForm.title,
        location: projectForm.location,
        date: projectForm.date,
        category: projectForm.category,
        projectStatus: projectForm.projectStatus,
        description: projectForm.description,
        fullContent: projectForm.fullContent,
        image: finalImageUrl,
        stats: {
          volunteers: projectForm.volunteers || '0',
          beneficiaries: projectForm.beneficiaries || '0'
        }
      };

      if (editProjectMode) {
        // Update existing project
        await apiService.updateProject(editProjectMode, projectData);
        alert("อัปเดตโครงการเรียบร้อยแล้ว");
      } else {
        // Create new project
        await apiService.addProject(projectData);
        alert("สร้างโครงการใหม่เรียบร้อยแล้ว");
      }
      
      // Refresh projects list
      const updatedProjects = await apiService.getUserProjects(user.uid);
      setMyProjects(updatedProjects);
      
      // Reset form
      resetProjectForm();
    } catch (error) {
      console.error("Project submission error", error);
      alert("เกิดข้อผิดพลาดในการสร้างโครงการ: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Project Image Selection
  const handleProjectImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("ขนาดไฟล์ต้องไม่เกิน 2MB");
        return;
      }

      setProjectImageFile(file);
      setProjectForm(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
    }
  };

  const handleRemoveProjectImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectImageFile(null);
    setProjectForm(prev => ({ ...prev, imageUrl: '' }));
    if (projectFileInputRef.current) projectFileInputRef.current.value = '';
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
      const updatedGroups = adminMode && isAdmin 
        ? await apiService.getAllGroups() 
        : await apiService.getUserGroups(user.uid);
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
       <SEO 
        title={adminMode ? "แดชบอร์ดแอดมิน" : "แดชบอร์ด"}
        description="จัดการข้อมูลกลุ่ม กิจกรรม และโครงการของคุณ บนแพลตฟอร์ม Commons Youth"
       />

      {/* Admin Mode Banner */}
      {isAdmin && adminMode && (
        <div className="lg:col-span-3 order-first bg-gradient-to-r from-brand-orange to-brand-morning p-4 rounded-xl border-2 border-brand-obsidian shadow-retro flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-brand-obsidian" />
            <div>
              <h3 className="font-bold text-brand-obsidian">โหมดแอดมิน</h3>
              <p className="text-xs text-brand-obsidian/70">คุณกำลังดูและจัดการข้อมูลทั้งหมดในระบบ</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-brand-obsidian/70">กลุ่ม: {myGroups.length} | กิจกรรม: {myActivities.length} | โครงการ: {myProjects.length}</span>
          </div>
        </div>
      )}
      
      {/* Left Column: Profile & Group List */}
      <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
        
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

            {/* Admin Mode Toggle */}
            {isAdmin && (
              <div className="mt-6 pt-4 border-t border-brand-gray">
                <button
                  onClick={() => setAdminMode(!adminMode)}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all border-2 ${
                    adminMode 
                      ? 'bg-brand-orange text-white border-brand-obsidian shadow-retro' 
                      : 'bg-white text-brand-obsidian border-brand-gray hover:border-brand-orange'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  {adminMode ? 'ปิดโหมดแอดมิน' : 'เปิดโหมดแอดมิน'}
                </button>
                <p className="text-xs text-brand-earth mt-2 text-center">
                  {adminMode ? 'กำลังดูข้อมูลทั้งหมดในระบบ' : 'ดูและจัดการข้อมูลทุกกลุ่ม/กิจกรรม/โครงการ'}
                </p>
              </div>
            )}
        </div>

        {/* My Groups List */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-gray p-6">
            <h2 className="text-xl font-bold text-brand-obsidian mb-4 flex items-center justify-between">
              <span>{adminMode ? 'กลุ่มทั้งหมด' : 'กลุ่มของฉัน'}</span>
              {adminMode && <span className="text-xs font-normal bg-brand-orange text-white px-2 py-1 rounded-full">{myGroups.length}</span>}
            </h2>
            {isLoadingGroups ? (
                <div className="text-center text-brand-earth py-4">กำลังโหลด...</div>
            ) : myGroups.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {myGroups.map(group => (
                        <div key={group.id} className={`p-3 border border-brand-gray rounded-lg hover:border-brand-bud transition-colors ${group.isHidden ? 'bg-gray-100 opacity-75' : 'bg-brand-linen/30'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-brand-obsidian text-sm mb-1 truncate">{group.name}</h3>
                                {adminMode && group.ownerId !== user?.uid && (
                                  <span className="text-[10px] bg-brand-ocean/20 text-brand-ocean px-1.5 py-0.5 rounded-full">ของผู้อื่น</span>
                                )}
                              </div>
                              {group.isHidden && (
                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full whitespace-nowrap">ซ่อน</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-brand-earth">{group.province}</span>
                                <div className="flex gap-1">
                                    {/* Visibility Toggle (Admin Only) */}
                                    {adminMode && (
                                      <button
                                        onClick={async () => {
                                          try {
                                            await apiService.toggleGroupVisibility(group.id, !group.isHidden);
                                            setMyGroups(prev => prev.map(g => 
                                              g.id === group.id ? { ...g, isHidden: !g.isHidden } : g
                                            ));
                                          } catch (e) {
                                            alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
                                          }
                                        }}
                                        className={`text-xs flex items-center px-2 py-1 border rounded-md transition-colors ${
                                          group.isHidden 
                                            ? 'border-green-500 text-green-600 hover:bg-green-500 hover:text-white' 
                                            : 'border-gray-400 text-gray-500 hover:bg-gray-500 hover:text-white'
                                        }`}
                                        title={group.isHidden ? 'แสดงกลุ่ม' : 'ซ่อนกลุ่ม'}
                                      >
                                        {group.isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                      </button>
                                    )}
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
                <div className="text-center py-6 text-brand-earth text-sm bg-brand-linen rounded-lg border-dashed border border-brand-gray">
                    {adminMode ? 'ยังไม่มีกลุ่มในระบบ' : 'คุณยังไม่ได้สร้างกลุ่ม'}
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

      {/* Right Column: Group/Activity Form */}
      <div className="lg:col-span-2 order-1 lg:order-2">
        <div className="bg-white rounded-2xl shadow-lg border border-brand-gray p-4 sm:p-6 md:p-8">
            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6 bg-brand-linen p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('groups')}
                    className={`flex-1 py-2 px-3 rounded-md font-bold text-xs md:text-sm transition-colors ${
                        activeTab === 'groups'
                            ? 'bg-brand-obsidian text-white shadow-sm'
                            : 'text-brand-earth hover:bg-white'
                    }`}
                >
                    จัดการกลุ่ม
                </button>
                <button
                    onClick={() => setActiveTab('activities')}
                    className={`flex-1 py-2 px-3 rounded-md font-bold text-xs md:text-sm transition-colors ${
                        activeTab === 'activities'
                            ? 'bg-brand-obsidian text-white shadow-sm'
                            : 'text-brand-earth hover:bg-white'
                    }`}
                >
                    สร้างกิจกรรม
                </button>
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`flex-1 py-2 px-3 rounded-md font-bold text-xs md:text-sm transition-colors ${
                        activeTab === 'projects'
                            ? 'bg-brand-obsidian text-white shadow-sm'
                            : 'text-brand-earth hover:bg-white'
                    }`}
                >
                    สร้างโครงการ
                </button>
            </div>

            {activeTab === 'groups' ? (
                <>
                    <div className="flex justify-between items-center mb-6 border-b border-brand-gray pb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-brand-obsidian">
                                {editMode ? 'แก้ไขข้อมูลกลุ่ม' : 'สร้างกลุ่มใหม่'}
                            </h1>
                            <p className="text-brand-earth text-sm">
                                {editMode ? 'อัปเดตรายละเอียดเพื่อให้ข้อมูลเป็นปัจจุบัน' : 'สร้างพื้นที่สำหรับกลุ่มเยาวชนของคุณ'}
                            </p>
                        </div>
                        {editMode && (
                            <button onClick={resetForm} className="text-xs text-brand-orange font-bold hover:underline">
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
                            disabled={!isLocationsLoaded}
                        >
                            {!isLocationsLoaded && <option>กำลังโหลดข้อมูล...</option>}
                            {isLocationsLoaded && <option value="">เลือกจังหวัด</option>}
                            {thaiLocations.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-brand-obsidian mb-2">อำเภอ/เขต <span className="text-brand-orange">*</span></label>
                        <select 
                            className="w-full p-3 rounded-lg border border-brand-gray focus:border-brand-bud outline-none bg-brand-linen disabled:opacity-50"
                            value={groupForm.amphoe}
                            onChange={handleAmphoeChange}
                            disabled={!groupForm.province || !isLocationsLoaded}
                        >
                            <option value="">เลือกอำเภอ</option>
                            {thaiLocations.find(p => p.name === groupForm.province)?.amphoes.map(a => (
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
                            disabled={!groupForm.amphoe || !isLocationsLoaded}
                        >
                            <option value="">เลือกตำบล</option>
                            {thaiLocations.find(p => p.name === groupForm.province)?.amphoes
                                .find(a => a.name === groupForm.amphoe)?.tambons.map(t => (
                                <option key={t.name} value={t.name}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-brand-obsidian mb-2">รายละเอียด <span className="text-brand-orange">*</span></label>
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
                    <label className="block text-sm font-bold text-brand-obsidian mb-2">ประเด็นที่ขับเคลื่อน (เลือกอย่างน้อย 1 ข้อ) <span className="text-brand-orange">*</span></label>
                    <div className={`p-4 rounded-lg border ${errors.issues ? 'border-red-500 bg-red-50' : 'border-transparent'}`}>
                        <div className="flex flex-wrap gap-2">
                            {ISSUES.map(issue => (
                                <button
                                    type="button"
                                    key={issue}
                                    onClick={() => handleIssueToggle(issue)}
                                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                        groupForm.issues.includes(issue) 
                                        ? 'bg-brand-obsidian text-white border-brand-obsidian' 
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
                    <label className="block text-sm font-bold text-brand-obsidian mb-2">อีเมลติดต่อ <span className="text-brand-orange">*</span></label>
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
                    <label className="block text-sm font-bold text-brand-obsidian mb-2">รูปภาพหน้าปก</label>
                    
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            relative w-full h-64 rounded-xl overflow-hidden border-2 border-dashed cursor-pointer transition-all group
                            ${groupForm.imageUrl ? 'border-brand-green/50' : 'border-brand-gray hover:border-brand-green hover:bg-brand-linen/30'}
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
                                   <div className="absolute top-3 left-3 bg-brand-morning text-brand-obsidian px-3 py-1 rounded-full text-xs font-bold shadow-md z-10">
                                     ตัวอย่าง (Preview)
                                   </div>
                                )}
                                <div className="absolute inset-0 bg-brand-obsidian/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-white/20 p-3 rounded-full mb-2 backdrop-blur-sm">
                                        <ImageIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="font-bold text-white text-lg">เปลี่ยนรูปภาพ</span>
                                    <span className="text-brand-linen text-xs mt-1">คลิกเพื่อเลือกไฟล์ใหม่</span>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Upload className="w-8 h-8 text-brand-green" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-obsidian mb-1">อัปโหลดรูปภาพ Banner</h3>
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
                        <div className="mt-2 flex items-center justify-between bg-brand-linen p-2 rounded-lg border border-brand-gray">
                            <div className="flex items-center text-xs text-brand-obsidian">
                                <FileImage className="w-4 h-4 mr-2 text-brand-green" />
                                <span className="font-bold mr-1">ไฟล์ที่เลือก:</span> {imageFile.name}
                            </div>
                            <button 
                                type="button" 
                                onClick={handleRemoveImage}
                                className="text-xs text-brand-orange hover:text-red-600 font-bold p-1"
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
                        className="px-8 py-3 bg-brand-orange text-white font-bold rounded-xl shadow-md hover:bg-brand-orange/90 transition-all flex items-center"
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
            </>
            ) : activeTab === 'activities' ? (
                /* Activity Form Tab */
                <>
                    <div className="mb-6 border-b border-brand-gray pb-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-brand-obsidian">
                                {editActivityMode ? 'แก้ไขกิจกรรม' : 'สร้างกิจกรรมใหม่'}
                            </h1>
                            <p className="text-brand-earth text-sm">
                                {editActivityMode ? 'แก้ไขข้อมูลกิจกรรมของคุณ' : 'เพิ่มกิจกรรมสำหรับกลุ่มของคุณ'}
                            </p>
                        </div>
                        {editActivityMode && (
                            <button
                                type="button"
                                onClick={resetActivityForm}
                                className="px-4 py-2 text-brand-earth hover:text-brand-obsidian font-medium transition-colors"
                            >
                                ยกเลิกการแก้ไข
                            </button>
                        )}
                    </div>

                    {myGroups.length === 0 ? (
                        <div className="text-center py-12 bg-brand-linen/50 rounded-xl border-2 border-dashed border-brand-gray">
                            <Calendar className="w-12 h-12 text-brand-earth mx-auto mb-3" />
                            <h3 className="font-bold text-brand-obsidian mb-2">คุณต้องมีกลุ่มก่อน</h3>
                            <p className="text-brand-earth text-sm mb-4">กรุณาสร้างกลุ่มก่อนที่จะสร้างกิจกรรม</p>
                            <button
                                onClick={() => setActiveTab('groups')}
                                className="px-6 py-2 bg-brand-obsidian text-white font-bold rounded-lg hover:bg-brand-bud transition-colors"
                            >
                                ไปสร้างกลุ่ม
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleActivitySubmit} className="space-y-6" noValidate>
                            {/* Activity Title */}
                            <div>
                                <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                    ชื่อกิจกรรม <span className="text-brand-orange">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={activityForm.title}
                                    onChange={e => handleActivityInputChange('title', e.target.value)}
                                    className={`w-full p-3 rounded-lg border outline-none transition-colors ${
                                        activityErrors.title
                                            ? 'border-red-500 bg-red-50 focus:border-red-500'
                                            : 'border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20'
                                    }`}
                                    placeholder="เช่น เวิร์กช็อปการทำสวนผักในเมือง"
                                />
                                {activityErrors.title && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {activityErrors.title}
                                    </p>
                                )}
                            </div>

                            {/* Group Selection */}
                            <div>
                                <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                    กลุ่มที่จัดกิจกรรม <span className="text-brand-orange">*</span>
                                </label>
                                <select
                                    value={activityForm.groupId}
                                    onChange={e => handleActivityInputChange('groupId', e.target.value)}
                                    className={`w-full p-3 rounded-lg border outline-none transition-colors ${
                                        activityErrors.groupId
                                            ? 'border-red-500 bg-red-50 focus:border-red-500'
                                            : 'border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20'
                                    }`}
                                >
                                    <option value="">เลือกกลุ่ม</option>
                                    {myGroups.map(group => (
                                        <option key={group.id} value={group.id}>
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                                {activityErrors.groupId && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {activityErrors.groupId}
                                    </p>
                                )}
                            </div>

                            {/* Date and Time */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                        วันที่ <span className="text-brand-orange">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={activityForm.date}
                                        onChange={e => handleActivityInputChange('date', e.target.value)}
                                        className={`w-full p-3 rounded-lg border outline-none transition-colors ${
                                            activityErrors.date
                                                ? 'border-red-500 bg-red-50 focus:border-red-500'
                                                : 'border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20'
                                        }`}
                                    />
                                    {activityErrors.date && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {activityErrors.date}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                        เวลา <span className="text-brand-orange">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={activityForm.time}
                                        onChange={e => handleActivityInputChange('time', e.target.value)}
                                        className={`w-full p-3 rounded-lg border outline-none transition-colors ${
                                            activityErrors.time
                                                ? 'border-red-500 bg-red-50 focus:border-red-500'
                                                : 'border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20'
                                        }`}
                                    />
                                    {activityErrors.time && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {activityErrors.time}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                    สถานที่ <span className="text-brand-orange">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={activityForm.location}
                                    onChange={e => handleActivityInputChange('location', e.target.value)}
                                    className={`w-full p-3 rounded-lg border outline-none transition-colors ${
                                        activityErrors.location
                                            ? 'border-red-500 bg-red-50 focus:border-red-500'
                                            : 'border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20'
                                    }`}
                                    placeholder="เช่น หอศิลปวัฒนธรรมเชียงใหม่"
                                />
                                {activityErrors.location && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {activityErrors.location}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                    สถานะการรับสมัคร
                                </label>
                                <select
                                    value={activityForm.status}
                                    onChange={e => handleActivityInputChange('status', e.target.value as 'Open' | 'Closing Soon' | 'Closed')}
                                    className="w-full p-3 rounded-lg border border-brand-gray bg-brand-linen focus:border-brand-bud outline-none"
                                >
                                    <option value="Open">เปิดรับสมัคร</option>
                                    <option value="Closing Soon">ใกล้ปิดรับ</option>
                                    <option value="Closed">ปิดรับแล้ว</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                    รายละเอียดกิจกรรม <span className="text-brand-orange">*</span>
                                </label>
                                <textarea
                                    value={activityForm.description}
                                    onChange={e => handleActivityInputChange('description', e.target.value)}
                                    rows={5}
                                    className={`w-full p-3 rounded-lg border outline-none transition-colors ${
                                        activityErrors.description
                                            ? 'border-red-500 bg-red-50 focus:border-red-500'
                                            : 'border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20'
                                    }`}
                                    placeholder="อธิบายกิจกรรม วัตถุประสงค์ และสิ่งที่ผู้เข้าร่วมจะได้รับ..."
                                />
                                {activityErrors.description && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {activityErrors.description}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4 border-t border-brand-gray flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-brand-bud text-brand-obsidian font-bold rounded-xl shadow-md hover:bg-brand-bud/90 transition-all flex items-center"
                                >
                                    {isSubmitting ? 'กำลังสร้าง...' : (
                                        <>
                                            <Calendar className="w-5 h-5 mr-2" />
                                            สร้างกิจกรรม
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* My Activities List */}
                    {myActivities.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-brand-gray">
                            <h3 className="text-lg font-bold text-brand-obsidian mb-4 flex items-center justify-between">
                              <span>{adminMode ? 'กิจกรรมทั้งหมด' : 'กิจกรรมของฉัน'}</span>
                              {adminMode && <span className="text-xs font-normal bg-brand-ocean text-white px-2 py-1 rounded-full">{myActivities.length}</span>}
                            </h3>
                            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                {myActivities.map(activity => (
                                    <div key={activity.id} className={`p-4 border rounded-lg hover:border-brand-bud transition-colors ${activity.isHidden ? 'bg-gray-100 opacity-75' : 'bg-brand-linen/30'} ${editActivityMode === activity.id ? 'border-brand-bud ring-2 ring-brand-bud/20' : 'border-brand-gray'}`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                  <h4 className="font-bold text-brand-obsidian">{activity.title}</h4>
                                                  {activity.isHidden && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">ซ่อน</span>}
                                                </div>
                                                <p className="text-xs text-brand-earth mb-2">
                                                  {activity.groupName}
                                                  {adminMode && activity.ownerId !== user?.uid && (
                                                    <span className="ml-2 text-[10px] bg-brand-ocean/20 text-brand-ocean px-1.5 py-0.5 rounded-full">ของผู้อื่น</span>
                                                  )}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-brand-earth">
                                                    <span className="flex items-center">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {new Date(activity.date).toLocaleDateString('th-TH')}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {new Date(activity.date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        {activity.location}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-bold px-2 py-1 rounded ${
                                                    activity.status === 'Open' ? 'bg-brand-bud text-brand-obsidian' :
                                                    activity.status === 'Closing Soon' ? 'bg-brand-orange text-white' :
                                                    'bg-brand-gray text-brand-earth'
                                                }`}>
                                                    {activity.status === 'Open' ? 'เปิดรับ' : activity.status === 'Closing Soon' ? 'ใกล้ปิด' : 'ปิดแล้ว'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-3 pt-3 border-t border-brand-gray/50">
                                            {/* Visibility Toggle (Admin Only) */}
                                            {adminMode && (
                                              <button
                                                onClick={async () => {
                                                  try {
                                                    await apiService.toggleActivityVisibility(activity.id, !activity.isHidden);
                                                    setMyActivities(prev => prev.map(a => 
                                                      a.id === activity.id ? { ...a, isHidden: !a.isHidden } : a
                                                    ));
                                                  } catch (e) {
                                                    alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
                                                  }
                                                }}
                                                className={`text-xs flex items-center px-2 py-1 border rounded-md transition-colors ${
                                                  activity.isHidden 
                                                    ? 'border-green-500 text-green-600 hover:bg-green-500 hover:text-white' 
                                                    : 'border-gray-400 text-gray-500 hover:bg-gray-500 hover:text-white'
                                                }`}
                                                title={activity.isHidden ? 'แสดงกิจกรรม' : 'ซ่อนกิจกรรม'}
                                              >
                                                {activity.isHidden ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                                                {activity.isHidden ? 'แสดง' : 'ซ่อน'}
                                              </button>
                                            )}
                                            <button
                                                onClick={() => startEditingActivity(activity)}
                                                className="text-xs flex items-center px-2 py-1 border border-brand-orange text-brand-orange font-bold rounded-md hover:bg-brand-orange hover:text-white transition-colors"
                                            >
                                                <Edit2 className="w-3 h-3 mr-1" /> แก้ไข
                                            </button>
                                            <button
                                                onClick={() => handleDeleteActivity(activity.id)}
                                                className="text-xs flex items-center px-2 py-1 border border-brand-earth text-brand-earth font-bold rounded-md hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3 mr-1" /> ลบ
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : activeTab === 'projects' ? (
                /* Project Form Tab */
                <>
                    <div className="flex justify-between items-center mb-6 border-b border-brand-gray pb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-brand-obsidian">
                                {editProjectMode ? 'แก้ไขโครงการ' : 'สร้างโครงการใหม่'}
                            </h1>
                            <p className="text-brand-earth text-sm">
                                {editProjectMode ? 'อัปเดตรายละเอียดโครงการ' : 'บันทึกผลงานและกรณีศึกษาของกลุ่มคุณ'}
                            </p>
                        </div>
                        {editProjectMode && (
                            <button onClick={resetProjectForm} className="text-xs text-brand-orange font-bold hover:underline">
                                ยกเลิกการแก้ไข
                            </button>
                        )}
                    </div>

                    {myGroups.length === 0 ? (
                        <div className="text-center py-12 bg-brand-linen/50 rounded-xl border-2 border-dashed border-brand-gray">
                            <FileImage className="w-12 h-12 text-brand-earth mx-auto mb-3" />
                            <h3 className="font-bold text-brand-obsidian mb-2">คุณต้องมีกลุ่มก่อน</h3>
                            <p className="text-brand-earth text-sm mb-4">กรุณาสร้างกลุ่มก่อนที่จะสร้างโครงการ</p>
                            <button
                                onClick={() => setActiveTab('groups')}
                                className="px-6 py-2 bg-brand-obsidian text-white font-bold rounded-lg hover:bg-brand-bud transition-colors"
                            >
                                ไปสร้างกลุ่ม
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleProjectSubmit} className="space-y-6" noValidate>
                            {/* Project Title */}
                            <div>
                                <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                    ชื่อโครงการ <span className="text-brand-orange">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={projectForm.title}
                                    onChange={e => handleProjectInputChange('title', e.target.value)}
                                    className={`w-full p-3 rounded-lg border outline-none transition-colors ${
                                        projectErrors.title
                                            ? 'border-red-500 bg-red-50 focus:border-red-500'
                                            : 'border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20'
                                    }`}
                                    placeholder="เช่น โครงการอากาศสะอาดเชียงใหม่"
                                />
                                {projectErrors.title && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {projectErrors.title}
                                    </p>
                                )}
                            </div>

                            {/* Group & Category */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                        กลุ่มที่ดำเนินโครงการ <span className="text-brand-orange">*</span>
                                    </label>
                                    <select
                                        value={projectForm.groupId}
                                        onChange={e => handleProjectInputChange('groupId', e.target.value)}
                                        className={`w-full p-3 rounded-lg border outline-none transition-colors ${
                                            projectErrors.groupId
                                                ? 'border-red-500 bg-red-50 focus:border-red-500'
                                                : 'border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20'
                                        }`}
                                    >
                                        <option value="">เลือกกลุ่ม</option>
                                        {myGroups.map(group => (
                                            <option key={group.id} value={group.id}>
                                                {group.name}
                                            </option>
                                        ))}
                                    </select>
                                    {projectErrors.groupId && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {projectErrors.groupId}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                        หมวดหมู่ <span className="text-brand-orange">*</span>
                                    </label>
                                    <select
                                        value={projectForm.category}
                                        onChange={e => handleProjectInputChange('category', e.target.value)}
                                        className={`w-full p-3 rounded-lg border outline-none transition-colors ${
                                            projectErrors.category
                                                ? 'border-red-500 bg-red-50 focus:border-red-500'
                                                : 'border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20'
                                        }`}
                                    >
                                        <option value="">เลือกหมวดหมู่</option>
                                        {PROJECT_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {projectErrors.category && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {projectErrors.category}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Project Status */}
                            <div>
                                <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                    สถานะโครงการ <span className="text-brand-orange">*</span>
                                </label>
                                <div className="flex gap-4">
                                    {PROJECT_STATUSES.map(status => (
                                        <label key={status.value} className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="projectStatus"
                                                value={status.value}
                                                checked={projectForm.projectStatus === status.value}
                                                onChange={e => handleProjectInputChange('projectStatus', e.target.value)}
                                                className="w-4 h-4 text-brand-ocean focus:ring-brand-ocean border-brand-gray"
                                            />
                                            <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                                                status.value === 'ongoing' 
                                                    ? 'bg-brand-bud/20 text-brand-obsidian' 
                                                    : 'bg-brand-ocean/20 text-brand-ocean'
                                            }`}>
                                                {status.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Project Image */}
                            <div>
                                <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                    รูปภาพโครงการ
                                </label>
                                <input
                                    type="file"
                                    ref={projectFileInputRef}
                                    accept="image/*"
                                    onChange={handleProjectImageChange}
                                    className="hidden"
                                />
                                {projectForm.imageUrl ? (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-brand-gray">
                                        <img
                                            src={projectForm.imageUrl}
                                            alt="Project preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveProjectImage}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => projectFileInputRef.current?.click()}
                                        className="w-full p-6 border-2 border-dashed border-brand-gray rounded-lg hover:border-brand-ocean transition-colors text-brand-earth hover:text-brand-ocean flex flex-col items-center"
                                    >
                                        <FileImage className="w-8 h-8 mb-2" />
                                        <span>คลิกเพื่อเลือกรูปภาพ</span>
                                        <span className="text-xs mt-1">รองรับ JPG, PNG, GIF</span>
                                    </button>
                                )}
                            </div>

                            {/* Link to Activities */}
                            {myActivities.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                        เชื่อมโยงกับกิจกรรม
                                    </label>
                                    <p className="text-xs text-brand-earth mb-2">เลือกกิจกรรมที่เกี่ยวข้องกับโครงการนี้</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-3 border border-brand-gray rounded-lg bg-brand-linen/50">
                                        {myActivities.map(activity => (
                                            <label key={activity.id} className="flex items-center cursor-pointer p-2 rounded hover:bg-brand-gray/20">
                                                <input
                                                    type="checkbox"
                                                    checked={projectForm.activityIds?.includes(activity.id?.toString() || '') || false}
                                                    onChange={e => {
                                                        const activityId = activity.id?.toString() || '';
                                                        const currentIds = projectForm.activityIds || [];
                                                        if (e.target.checked) {
                                                            handleProjectInputChange('activityIds', [...currentIds, activityId]);
                                                        } else {
                                                            handleProjectInputChange('activityIds', currentIds.filter(id => id !== activityId));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-brand-ocean focus:ring-brand-ocean border-brand-gray rounded"
                                                />
                                                <span className="ml-2 text-sm text-brand-obsidian truncate">{activity.title}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Location & Date */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                        สถานที่ <span className="text-brand-orange">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={projectForm.location}
                                        onChange={e => handleProjectInputChange('location', e.target.value)}
                                        className={`w-full p-3 rounded-lg border outline-none transition-colors ${
                                            projectErrors.location
                                                ? 'border-red-500 bg-red-50 focus:border-red-500'
                                                : 'border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20'
                                        }`}
                                        placeholder="เช่น เชียงใหม่"
                                    />
                                    {projectErrors.location && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {projectErrors.location}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                        ช่วงเวลา <span className="text-brand-orange">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={projectForm.date}
                                        onChange={e => handleProjectInputChange('date', e.target.value)}
                                        className={`w-full p-3 rounded-lg border outline-none transition-colors ${
                                            projectErrors.date
                                                ? 'border-red-500 bg-red-50 focus:border-red-500'
                                                : 'border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20'
                                        }`}
                                        placeholder="เช่น มกราคม 2024"
                                    />
                                    {projectErrors.date && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {projectErrors.date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                        จำนวนอาสาสมัคร
                                    </label>
                                    <input
                                        type="text"
                                        value={projectForm.volunteers}
                                        onChange={e => handleProjectInputChange('volunteers', e.target.value)}
                                        className="w-full p-3 rounded-lg border border-brand-gray bg-brand-linen focus:border-brand-bud outline-none"
                                        placeholder="เช่น 150"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                        ผู้ได้รับประโยชน์
                                    </label>
                                    <input
                                        type="text"
                                        value={projectForm.beneficiaries}
                                        onChange={e => handleProjectInputChange('beneficiaries', e.target.value)}
                                        className="w-full p-3 rounded-lg border border-brand-gray bg-brand-linen focus:border-brand-bud outline-none"
                                        placeholder="เช่น 5,000+"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                    คำอธิบายโครงการ <span className="text-brand-orange">*</span>
                                </label>
                                <textarea
                                    value={projectForm.description}
                                    onChange={e => handleProjectInputChange('description', e.target.value)}
                                    rows={3}
                                    className={`w-full p-3 rounded-lg border outline-none transition-colors ${
                                        projectErrors.description
                                            ? 'border-red-500 bg-red-50 focus:border-red-500'
                                            : 'border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20'
                                    }`}
                                    placeholder="สรุปสั้นๆ เกี่ยวกับโครงการ..."
                                />
                                {projectErrors.description && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {projectErrors.description}
                                    </p>
                                )}
                            </div>

                            {/* Full Content */}
                            <div>
                                <label className="block text-sm font-bold text-brand-obsidian mb-2">
                                    รายละเอียดเต็ม <span className="text-brand-orange">*</span>
                                </label>
                                <textarea
                                    value={projectForm.fullContent}
                                    onChange={e => handleProjectInputChange('fullContent', e.target.value)}
                                    rows={6}
                                    className={`w-full p-3 rounded-lg border outline-none transition-colors ${
                                        projectErrors.fullContent
                                            ? 'border-red-500 bg-red-50 focus:border-red-500'
                                            : 'border-brand-gray bg-brand-linen focus:border-brand-bud focus:ring-2 focus:ring-brand-bud/20'
                                    }`}
                                    placeholder="เขียนรายละเอียดเต็มของโครงการ ผลลัพธ์ และบทเรียนที่ได้..."
                                />
                                {projectErrors.fullContent && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {projectErrors.fullContent}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4 border-t border-brand-gray flex justify-end gap-3">
                                {editProjectMode && (
                                    <button
                                        type="button"
                                        onClick={resetProjectForm}
                                        className="px-6 py-3 bg-brand-gray text-brand-obsidian font-bold rounded-xl hover:bg-brand-gray/80 transition-all"
                                    >
                                        ยกเลิก
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-brand-ocean text-white font-bold rounded-xl shadow-md hover:bg-brand-ocean/90 transition-all flex items-center"
                                >
                                    {isSubmitting ? (editProjectMode ? 'กำลังบันทึก...' : 'กำลังสร้าง...') : (
                                        <>
                                            <FileImage className="w-5 h-5 mr-2" />
                                            {editProjectMode ? 'บันทึกการแก้ไข' : 'สร้างโครงการ'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* My Projects List */}
                    {myProjects.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-brand-gray">
                            <h3 className="text-lg font-bold text-brand-obsidian mb-4 flex items-center justify-between">
                              <span>{adminMode ? 'โครงการทั้งหมด' : 'โครงการของฉัน'}</span>
                              {adminMode && <span className="text-xs font-normal bg-brand-bud text-brand-obsidian px-2 py-1 rounded-full">{myProjects.length}</span>}
                            </h3>
                            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                {myProjects.map(project => (
                                    <div key={project.id} className={`p-4 border rounded-lg hover:border-brand-ocean transition-colors ${project.isHidden ? 'bg-gray-100 opacity-75' : 'bg-brand-linen/30'} border-brand-gray`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-brand-obsidian">{project.title}</h4>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                        project.projectStatus === 'completed' 
                                                            ? 'bg-brand-ocean/20 text-brand-ocean' 
                                                            : 'bg-brand-bud/20 text-brand-obsidian'
                                                    }`}>
                                                        {project.projectStatus === 'completed' ? 'เสร็จสิ้นแล้ว' : 'กำลังดำเนินการ'}
                                                    </span>
                                                    {project.isHidden && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">ซ่อน</span>}
                                                </div>
                                                {adminMode && project.ownerId !== user?.uid && (
                                                  <span className="text-[10px] bg-brand-ocean/20 text-brand-ocean px-1.5 py-0.5 rounded-full mb-2 inline-block">ของผู้อื่น</span>
                                                )}
                                                <div className="flex items-center gap-3 text-xs text-brand-earth mb-2">
                                                    <span className="flex items-center">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        {project.location}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {project.date}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-brand-earth line-clamp-2">{project.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold px-2 py-1 rounded bg-brand-ocean/10 text-brand-ocean">
                                                    {project.category}
                                                </span>
                                                {/* Visibility Toggle (Admin Only) */}
                                                {adminMode && (
                                                  <button
                                                    onClick={async () => {
                                                      try {
                                                        await apiService.toggleProjectVisibility(project.id, !project.isHidden);
                                                        setMyProjects(prev => prev.map(p => 
                                                          p.id === project.id ? { ...p, isHidden: !p.isHidden } : p
                                                        ));
                                                      } catch (e) {
                                                        alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
                                                      }
                                                    }}
                                                    className={`p-1.5 rounded transition-colors ${
                                                      project.isHidden 
                                                        ? 'text-green-600 hover:bg-green-50' 
                                                        : 'text-gray-400 hover:bg-gray-100'
                                                    }`}
                                                    title={project.isHidden ? 'แสดงโครงการ' : 'ซ่อนโครงการ'}
                                                  >
                                                    {project.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                  </button>
                                                )}
                                                <button
                                                    onClick={() => startEditingProject(project)}
                                                    className="p-1.5 text-brand-earth hover:text-brand-ocean hover:bg-brand-ocean/10 rounded transition-colors"
                                                    title="แก้ไขโครงการ"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProject(String(project.id!))}
                                                    className="p-1.5 text-brand-earth hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                    title="ลบโครงการ"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : null}
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
              <h3 className="text-xl font-bold text-brand-obsidian mb-2">
                {deleteModal.type === 'group' && 'ยืนยันการลบกลุ่ม'}
                {deleteModal.type === 'activity' && 'ยืนยันการลบกิจกรรม'}
                {deleteModal.type === 'project' && 'ยืนยันการลบโครงการ'}
              </h3>
              <p className="text-brand-earth text-sm px-4">
                {deleteModal.type === 'group' && 'คุณแน่ใจหรือไม่ที่จะลบกลุ่มนี้?'}
                {deleteModal.type === 'activity' && 'คุณแน่ใจหรือไม่ที่จะลบกิจกรรมนี้?'}
                {deleteModal.type === 'project' && 'คุณแน่ใจหรือไม่ที่จะลบโครงการนี้?'}
                <br/>
                การกระทำนี้ไม่สามารถย้อนกลับได้ และข้อมูลทั้งหมดจะหายไป
              </p>
            </div>
            <div className="p-6 flex gap-3 justify-center bg-white">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, type: 'group', id: null })}
                className="px-6 py-2.5 rounded-lg border-2 border-brand-gray text-brand-earth font-bold hover:bg-brand-linen hover:text-brand-obsidian transition-colors flex-1"
              >
                ยกเลิก
              </button>
              <button 
                onClick={confirmDelete}
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