
export interface User {
  uid: string;
  email: string;
  name: string;
  profileImage?: string;
  bio?: string;
  role?: 'admin' | 'user'; 
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Group {
  id: string;
  ownerId: string;
  name: string;
  province: string;
  amphoe?: string;
  tambon?: string;
  coordinates: Coordinates;
  issues: string[];
  description: string;
  contact: string;
  imageUrl: string;
  createdAt: string;
  isHidden?: boolean;
}

export interface Activity {
  id: string;
  ownerId: string;
  groupId: string;
  title: string;
  date: string; // ISO string
  location: string;
  status: 'Open' | 'Closing Soon' | 'Closed';
  imageUrl?: string;
  groupName: string;
  description?: string;
  createdAt?: string;
}

export interface Project {
  id: number | string;
  ownerId: string;
  groupId?: string;
  activityIds?: string[]; // Linked activities
  title: string;
  location: string;
  date: string;
  category: string;
  projectStatus: 'ongoing' | 'completed'; // Project lifecycle status
  description: string;
  fullContent?: string; // Extended description for detail page
  image: string;
  stats: {
    volunteers: number | string;
    beneficiaries: string;
  };
  createdAt?: string;
}

export const ISSUES = [
  "ความยุติธรรมทางสภาพอากาศ",
  "การพัฒนาเมือง",
  "สิทธิชนเผ่าพื้นเมือง",
  "ปฏิรูปการศึกษา",
  "ความเท่าเทียมทางเพศ",
  "สิทธิดิจิทัล",
  "ศิลปะและวัฒนธรรม"
];

export const PROVINCES = [
  "กรุงเทพมหานคร",
  "เชียงใหม่",
  "ขอนแก่น",
  "ภูเก็ต",
  "สงขลา",
  "นครราชสีมา"
];

export const PROJECT_CATEGORIES = [
  "สิ่งแวดล้อม",
  "วัฒนธรรม",
  "การศึกษา",
  "สิทธิมนุษยชน",
  "ชุมชนและสังคม",
  "ศิลปะและสร้างสรรค์",
  "เทคโนโลยี",
  "อื่นๆ"
];

export const PROJECT_STATUSES = [
  { value: 'ongoing', label: 'กำลังดำเนินการ' },
  { value: 'completed', label: 'เสร็จสิ้นแล้ว' }
];