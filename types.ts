
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
  title: string;
  date: string; // ISO string
  location: string;
  status: 'Open' | 'Closing Soon' | 'Closed';
  imageUrl?: string;
  groupName: string;
  description?: string;
}

export interface Project {
  id: number | string;
  title: string;
  location: string;
  date: string;
  category: string;
  description: string;
  fullContent?: string; // Extended description for detail page
  image: string;
  stats: {
    volunteers: number | string;
    beneficiaries: string;
  };
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