import { Group, Activity, Project } from '../types';
import { db, storage } from './firebase';
import { collection, getDocs, addDoc, updateDoc, doc, getDoc, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- MOCK DATA FALLBACK ---
let MOCK_GROUPS: Group[] = [
  {
    id: '1',
    ownerId: 'admin',
    name: 'Chiang Mai Urban Green',
    province: 'เชียงใหม่',
    coordinates: { lat: 18.7883, lng: 98.9853 },
    issues: ['การพัฒนาเมือง', 'ความยุติธรรมทางสภาพอากาศ'],
    description: 'รณรงค์เพื่อเพิ่มพื้นที่สีเขียวในตัวเมืองเชียงใหม่และการวางผังเมืองที่ยั่งยืน',
    contact: 'contact@cmug.org',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    ownerId: 'mock-user-123',
    name: 'เครือข่ายสิทธิอีสาน',
    province: 'ขอนแก่น',
    coordinates: { lat: 16.4322, lng: 102.8236 },
    issues: ['สิทธิดิจิทัล', 'ปฏิรูปการศึกษา'],
    description: 'เครือข่ายนักกิจกรรมเยาวชนที่ทำงานด้านสิทธิพลเมืองและความเสมอภาคทางการศึกษาในภาคตะวันออกเฉียงเหนือ',
    contact: 'info@isanrights.org',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    ownerId: 'user3',
    name: 'Songkhla Heritage Youth',
    province: 'สงขลา',
    coordinates: { lat: 7.1988, lng: 100.5951 },
    issues: ['ศิลปะและวัฒนธรรม', 'การพัฒนาเมือง'],
    description: 'กลุ่มเยาวชนที่สนใจในการอนุรักษ์ย่านเมืองเก่าสงขลาผ่านศิลปะร่วมสมัย',
    contact: 'hello@songkhlayouth.com',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    createdAt: new Date().toISOString()
  }
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '101',
    title: 'เวิร์กช็อปสวนผักคนเมือง',
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    location: 'หอศิลปวัฒนธรรมเชียงใหม่',
    status: 'Closing Soon',
    groupName: 'Chiang Mai Urban Green',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    description: 'เรียนรู้วิธีการปลูกผักในพื้นที่จำกัด การทำปุ๋ยหมัก และการจัดการขยะอินทรีย์ในครัวเรือน เพื่อสร้างความมั่นคงทางอาหารและเพิ่มพื้นที่สีเขียวให้กับเมืองเชียงใหม่ เหมาะสำหรับผู้เริ่มต้นและผู้ที่สนใจวิถีชีวิตที่เป็นมิตรต่อสิ่งแวดล้อม'
  },
  {
    id: '102',
    title: 'เวทีเยาวชนอีสาน 2024',
    date: new Date(Date.now() + 86400000 * 14).toISOString(),
    location: 'มหาวิทยาลัยขอนแก่น',
    status: 'Open',
    groupName: 'เครือข่ายสิทธิอีสาน',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    description: 'เวทีสาธารณะเพื่อเปิดพื้นที่ให้เยาวชนคนรุ่นใหม่ในภาคอีสานได้ร่วมแลกเปลี่ยนความคิดเห็นเกี่ยวกับทิศทางการพัฒนาภูมิภาค การอนุรักษ์วัฒนธรรมท้องถิ่น และสิทธิในการจัดการทรัพยากรธรรมชาติ พร้อมวงเสวนาและดนตรีโฟล์คซอง'
  },
  {
    id: '103',
    title: 'เดินเมืองสงขลา: ย้อนรอยอดีต',
    date: new Date(Date.now() + 86400000 * 7).toISOString(),
    location: 'ถนนนางงาม สงขลา',
    status: 'Open',
    groupName: 'Songkhla Heritage Youth',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    description: 'กิจกรรมเดินเท้าสำรวจย่านเมืองเก่าสงขลา เรียนรู้ประวัติศาสตร์ สถาปัตยกรรม และวิถีชีวิตของผู้คนในย่านถนนนางงาม นครใน และนครนอก นำชมโดยยุวมัคคุเทศก์ท้องถิ่น พร้อมกิจกรรม Sketchwalk วาดภาพลายเส้นเมืองเก่า'
  }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "โครงการอากาศสะอาดเชียงใหม่",
    location: "เชียงใหม่",
    date: "มกราคม 2024",
    category: "สิ่งแวดล้อม",
    description: "การรวมตัวของเยาวชนในจังหวัดเชียงใหม่เพื่อพัฒนาระบบตรวจวัดฝุ่น PM2.5 ราคาประหยัด และการรณรงค์ลดการเผาในพื้นที่เกษตรกรรม ผ่านกระบวนการมีส่วนร่วมของชุมชน",
    fullContent: "โครงการนี้เริ่มต้นจากการตั้งคำถามของกลุ่มเยาวชนในเชียงใหม่เกี่ยวกับปัญหามลพิษทางอากาศที่เรื้อรังมานานหลายปี เราได้ร่วมมือกับมหาวิทยาลัยในท้องถิ่นเพื่อพัฒนาเครื่องตรวจวัดคุณภาพอากาศแบบ Low-cost sensor ที่สามารถติดตั้งได้ในทุกชุมชน นอกจากนี้ยังมีการจัดเวิร์กช็อปให้ความรู้แก่เกษตรกรเกี่ยวกับทางเลือกในการจัดการวัสดุเหลือใช้ทางการเกษตร เพื่อลดการเผาที่ต้นทาง ผลลัพธ์ที่ได้คือการสร้างเครือข่ายเฝ้าระวังคุณภาพอากาศที่มีประสิทธิภาพและการตื่นตัวของภาคประชาสังคมในการเรียกร้องสิทธิในอากาศสะอาด",
    image: "https://picsum.photos/800/600?random=10",
    stats: { volunteers: 150, beneficiaries: "5,000+" }
  },
  {
    id: 2,
    title: "ฟื้นฟูเมืองเก่าสงขลา",
    location: "สงขลา",
    date: "มีนาคม 2024",
    category: "วัฒนธรรม",
    description: "โครงการอนุรักษ์สถาปัตยกรรมชิโน-ยูโรเปียนและการสร้างพื้นที่สร้างสรรค์สำหรับศิลปินรุ่นใหม่ เพื่อเชื่อมโยงเรื่องราวในอดีตสู่อนาคตของเมืองสงขลา",
    fullContent: "ย่านเมืองเก่าสงขลาเต็มไปด้วยประวัติศาสตร์และสถาปัตยกรรมที่ทรงคุณค่า แต่เริ่มทรุดโทรมตามกาลเวลา กลุ่มเยาวชน 'Songkhla Heritage Youth' จึงได้ริเริ่มโครงการนี้เพื่อฟื้นคืนชีวิตให้ย่านเมืองเก่า ไม่ใช่แค่การซ่อมแซมตึก แต่คือการนำศิลปะ ดนตรี และกิจกรรมร่วมสมัยเข้าไปอยู่ในพื้นที่ประวัติศาสตร์ ทำให้คนรุ่นใหม่รู้สึกเชื่อมโยงกับรากเหง้าของตนเอง กิจกรรมประกอบด้วย Walking Tour ที่นำโดยมัคคุเทศก์น้อย การแสดงดนตรีในบ้านโบราณ และนิทรรศการภาพถ่าย",
    image: "https://picsum.photos/800/600?random=11",
    stats: { volunteers: 80, beneficiaries: "2,000+" }
  },
  {
    id: 3,
    title: "โรงเรียนพลเมืองขอนแก่น",
    location: "ขอนแก่น",
    date: "กุมภาพันธ์ 2024",
    category: "การศึกษา",
    description: "หลักสูตรนอกห้องเรียนที่เปิดโอกาสให้เยาวชนได้เรียนรู้เรื่องสิทธิพลเมือง การกระจายอำนาจ และการตรวจสอบการทำงานของภาครัฐในระดับท้องถิ่น",
    fullContent: "โรงเรียนพลเมืองขอนแก่นไม่ได้มีห้องเรียนสี่เหลี่ยม แต่คือการลงพื้นที่จริงเพื่อศึกษาปัญหาสังคม ทั้งเรื่องการจัดการขยะ การขนส่งสาธารณะ และการจัดสรรงบประมาณท้องถิ่น เยาวชนที่เข้าร่วมจะได้ฝึกทักษะการคิดวิเคราะห์ การอภิปราย และการนำเสนอข้อเสนอนโยบายต่อผู้บริหารท้องถิ่น เป้าหมายคือการสร้าง 'พลเมืองตื่นรู้' (Active Citizen) ที่พร้อมจะมีส่วนร่วมในการพัฒนาบ้านเกิดของตนเอง",
    image: "https://picsum.photos/800/600?random=12",
    stats: { volunteers: 45, beneficiaries: "300+" }
  }
];

class ApiService {
  
  // Fetch all groups
  async getGroups(): Promise<Group[]> {
    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, "groups"));
        const groups = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group));
        return groups.length > 0 ? groups : MOCK_GROUPS;
      } catch (e) {
        console.error("Error fetching groups from Firestore", e);
        return MOCK_GROUPS;
      }
    }
    // Fallback Mock
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_GROUPS]), 500);
    });
  }

  // Get Single Group by ID
  async getGroupById(id: string): Promise<Group | undefined> {
    if (db) {
      try {
        const docRef = doc(db, "groups", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Group;
        }
      } catch (e) {
        console.error("Error getting group", e);
      }
    }
    // Fallback Mock
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_GROUPS.find(g => g.id === id));
      }, 300);
    });
  }

  // Fetch groups owned by specific user
  async getUserGroups(userId: string): Promise<Group[]> {
    if (db) {
      try {
        const q = query(collection(db, "groups"), where("ownerId", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group));
      } catch (e) {
        console.error("Error fetching user groups", e);
        return [];
      }
    }
    // Fallback Mock
    return new Promise((resolve) => {
      setTimeout(() => {
        const userGroups = MOCK_GROUPS.filter(g => g.ownerId === userId);
        resolve(userGroups);
      }, 300);
    });
  }

  // Add new group
  async addGroup(groupData: Omit<Group, 'id' | 'createdAt'>): Promise<Group> {
    const newGroupPayload = {
        ...groupData,
        createdAt: new Date().toISOString()
    };

    if (db) {
      const docRef = await addDoc(collection(db, "groups"), newGroupPayload);
      return { id: docRef.id, ...newGroupPayload } as Group;
    }

    // Fallback Mock
    return new Promise((resolve) => {
      setTimeout(() => {
        const newGroup: Group = {
          id: Math.random().toString(36).substr(2, 9),
          ...newGroupPayload
        };
        MOCK_GROUPS = [newGroup, ...MOCK_GROUPS];
        resolve(newGroup);
      }, 800);
    });
  }

  // Update existing group
  async updateGroup(id: string, groupData: Partial<Group>): Promise<void> {
    if (db) {
       const groupRef = doc(db, "groups", id);
       await updateDoc(groupRef, groupData);
       return;
    }

    // Fallback Mock
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_GROUPS.findIndex(g => g.id === id);
        if (index !== -1) {
          MOCK_GROUPS[index] = { ...MOCK_GROUPS[index], ...groupData };
          resolve();
        } else {
          reject(new Error("Group not found"));
        }
      }, 800);
    });
  }

  // Delete group
  async deleteGroup(id: string): Promise<void> {
    if (db) {
      try {
        const groupRef = doc(db, "groups", id);
        await deleteDoc(groupRef);
        return;
      } catch (e) {
        console.error("Error deleting group", e);
        throw e;
      }
    }

    // Fallback Mock
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_GROUPS.findIndex(g => g.id === id);
        if (index !== -1) {
          MOCK_GROUPS = MOCK_GROUPS.filter(g => g.id !== id);
          resolve();
        } else {
          reject(new Error("Group not found"));
        }
      }, 500);
    });
  }

  // Upload Image
  async uploadImage(file: File): Promise<string> {
    // Real Storage
    if (storage) {
       try {
         const storageRef = ref(storage, `groups/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`);
         const snapshot = await uploadBytes(storageRef, file);
         const downloadURL = await getDownloadURL(snapshot.ref);
         return downloadURL;
       } catch (e) {
         console.error("Upload failed", e);
         throw e;
       }
    }
    
    // Mock Fallback (Convert to Base64)
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
    });
  }

  // Fetch activities
  async getActivities(): Promise<Activity[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_ACTIVITIES]), 500);
    });
  }

  // Fetch activities for a specific group
  async getGroupActivities(groupName: string): Promise<Activity[]> {
    if (db) {
      try {
        // Query activities where 'groupName' matches
        const q = query(collection(db, "activities"), where("groupName", "==", groupName));
        const querySnapshot = await getDocs(q);
        const activities = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
        return activities;
      } catch (e) {
        console.error("Error fetching group activities", e);
        return [];
      }
    }

    // Mock Fallback
    return new Promise((resolve) => {
      setTimeout(() => {
        const relatedActivities = MOCK_ACTIVITIES.filter(a => a.groupName === groupName);
        resolve(relatedActivities);
      }, 400);
    });
  }

  // Fetch all projects
  async getProjects(): Promise<Project[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_PROJECTS]), 400);
    });
  }

  // Fetch single project by ID
  async getProjectById(id: string | number): Promise<Project | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const project = MOCK_PROJECTS.find(p => p.id == id);
        resolve(project);
      }, 400);
    });
  }
}

export const apiService = new ApiService();