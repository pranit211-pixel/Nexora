import {
  UserProfile,
  Department,
  Subject,
  TimetableSlot,
  AttendanceRecord,
  AttendanceLog,
  Assignment,
  AssignmentSubmission,
  StudyMaterial,
  Examination,
  SemesterResultSummary,
  Notice,
  AppNotification,
  FeeRecord,
  Complaint,
  CampusFacility,
  AuditLog
} from '../../types';

// Sole initial institutional administrator account
export const DEMO_ADMIN: UserProfile = {
  id: 'usr_admin_ajay',
  email: 'ajayshewale211@gmail.com',
  fullName: 'Ajay Shewale',
  role: 'admin',
  department: 'Administration',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  isApproved: true,
  status: 'Active',
  password: 'ajay123',
  createdAt: '2026-10-31T00:00:00Z',
};

// Registered users directory starting with only the authorized administrator
export const INITIAL_REGISTERED_USERS: UserProfile[] = [DEMO_ADMIN];

// All departments removed per user request: admin can charter departments from portal
export const INITIAL_DEPARTMENTS: Department[] = [];

// Zero default attendance records: attendance is only tracked when faculty conducts classroom sessions
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

export const INITIAL_ATTENDANCE_LOGS: AttendanceLog[] = [];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  { id: 'tt_1', department: 'AIDS', semester: 5, section: 'A', dayOfWeek: 'Monday', periodStart: '09:00', periodEnd: '10:30', subjectName: 'Deep Neural Networks & Vision', facultyName: 'Dr. Marcus Sterling', roomNumber: 'Lab Alpha-302' },
  { id: 'tt_2', department: 'AIDS', semester: 5, section: 'A', dayOfWeek: 'Monday', periodStart: '11:00', periodEnd: '12:30', subjectName: 'Distributed Cloud Architecture', facultyName: 'Prof. Sarah Jenkins', roomNumber: 'Hall B-105' },
  { id: 'tt_3', department: 'AIDS', semester: 5, section: 'A', dayOfWeek: 'Tuesday', periodStart: '10:00', periodEnd: '12:00', subjectName: 'Autonomous Robotics & SLAM Lab', facultyName: 'Dr. Samantha Reed', roomNumber: 'Robotics Center' },
  { id: 'tt_4', department: 'AIDS', semester: 5, section: 'A', dayOfWeek: 'Tuesday', periodStart: '13:30', periodEnd: '15:00', subjectName: 'Applied Quantum Information', facultyName: 'Dr. Evelyn Carter', roomNumber: 'Hall A-201' },
  { id: 'tt_5', department: 'AIDS', semester: 5, section: 'A', dayOfWeek: 'Wednesday', periodStart: '09:00', periodEnd: '10:30', subjectName: 'Cybersecurity & Cryptographic Proofs', facultyName: 'Dr. Aris Thorne', roomNumber: 'Hall C-110' },
  { id: 'tt_6', department: 'AIDS', semester: 5, section: 'A', dayOfWeek: 'Wednesday', periodStart: '11:00', periodEnd: '12:30', subjectName: 'Deep Neural Networks & Vision', facultyName: 'Dr. Marcus Sterling', roomNumber: 'Lab Alpha-302' },
  { id: 'tt_7', department: 'AIDS', semester: 5, section: 'A', dayOfWeek: 'Thursday', periodStart: '14:00', periodEnd: '16:00', subjectName: 'Capstone Project Studio', facultyName: 'Panel Faculty', roomNumber: 'Design Incubator' },
  { id: 'tt_8', department: 'AIDS', semester: 5, section: 'A', dayOfWeek: 'Friday', periodStart: '10:00', periodEnd: '11:30', subjectName: 'Distributed Cloud Architecture', facultyName: 'Prof. Sarah Jenkins', roomNumber: 'Hall B-105' },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_1',
    title: 'Transformer Attention Mechanism Implementation',
    description: 'Implement multi-head self-attention and cross-attention in PyTorch from scratch without using nn.MultiheadAttention. Submit verified Jupyter notebook with unit tests.',
    subjectName: 'Deep Neural Networks & Vision',
    department: 'Artificial Intelligence & Data Science',
    facultyName: 'Dr. Marcus Sterling',
    semester: 5,
    dueDate: '2026-11-06T23:59:00Z',
    maxMarks: 50,
    status: 'Submitted',
    marksObtained: 47,
    submittedAt: '2026-10-29T18:32:00Z',
    submissionFile: 'chen_alex_mha_implementation.zip',
    feedback: 'Flawless matrix scaling and attention mask handling. Good documentation.',
  },
  {
    id: 'asg_2',
    title: 'Raft Consensus Protocol Simulation in Go / Python',
    description: 'Construct a 5-node cluster with leader election, log replication, and partition handling under simulated network latency drops.',
    subjectName: 'Distributed Cloud Architecture',
    department: 'Artificial Intelligence & Data Science',
    facultyName: 'Prof. Sarah Jenkins',
    semester: 5,
    dueDate: '2026-11-12T23:59:00Z',
    maxMarks: 100,
    status: 'Pending',
  },
  {
    id: 'asg_3',
    title: 'EKF-SLAM Map Generation from LiDAR Point Clouds',
    description: 'Parse 2D range-bearing scan datasets to construct 2D occupancy grid and estimate landmark covariance matrices.',
    subjectName: 'Autonomous Robotics & SLAM',
    department: 'Artificial Intelligence & Data Science',
    facultyName: 'Dr. Samantha Reed',
    semester: 5,
    dueDate: '2026-11-18T23:59:00Z',
    maxMarks: 75,
    status: 'Pending',
  },
];

export const INITIAL_FACULTY_ASSIGNMENTS_ROSTER: AssignmentSubmission[] = [];

export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat_1',
    title: 'Module 3: Scaled Dot-Product Attention & Positional Encodings',
    subjectName: 'Deep Neural Networks & Vision',
    department: 'Artificial Intelligence & Data Science',
    semester: 5,
    uploadedBy: 'Dr. Marcus Sterling',
    fileType: 'PDF',
    fileSize: '14.8 MB',
    downloadUrl: '#',
    downloadCount: 142,
    uploadedAt: '2026-10-20',
  },
  {
    id: 'mat_2',
    title: 'Consensus Algorithms & Byzantine Fault Tolerance Reference Notes',
    subjectName: 'Distributed Cloud Architecture',
    department: 'Artificial Intelligence & Data Science',
    semester: 5,
    uploadedBy: 'Prof. Sarah Jenkins',
    fileType: 'PDF',
    fileSize: '8.4 MB',
    downloadUrl: '#',
    downloadCount: 98,
    uploadedAt: '2026-10-18',
  },
  {
    id: 'mat_3',
    title: 'ROS2 Galactic Architecture & Gazebo Simulation Starter Kit',
    subjectName: 'Autonomous Robotics & SLAM',
    department: 'Artificial Intelligence & Data Science',
    semester: 5,
    uploadedBy: 'Dr. Samantha Reed',
    fileType: 'ZIP',
    fileSize: '45.2 MB',
    downloadUrl: '#',
    downloadCount: 115,
    uploadedAt: '2026-10-15',
  },
  {
    id: 'mat_4',
    title: 'Shor & Grover Quantum Algorithms Lecture Handout',
    subjectName: 'Applied Quantum Information',
    department: 'Artificial Intelligence & Data Science',
    semester: 5,
    uploadedBy: 'Dr. Evelyn Carter',
    fileType: 'PDF',
    fileSize: '6.1 MB',
    downloadUrl: '#',
    downloadCount: 76,
    uploadedAt: '2026-10-10',
  },
];

export const INITIAL_EXAMS: Examination[] = [
  {
    id: 'ex_1',
    title: 'Mid-Semester Theory Examination Autumn 2026',
    type: 'Internal-1',
    department: 'Artificial Intelligence & Data Science',
    semester: 5,
    startDate: '2026-11-15',
    endDate: '2026-11-22',
    instructions: 'Exams begin sharp at 10:00 AM. Calculators are permitted for Quantum Information. Biometric attendance mandatory at examination hall entrance.',
    isPublished: true,
  },
  {
    id: 'ex_2',
    title: 'Autumn Practical & Laboratory Viva Voce 2026',
    type: 'Practical',
    department: 'Artificial Intelligence & Data Science',
    semester: 5,
    startDate: '2026-11-26',
    endDate: '2026-12-02',
    instructions: 'Bring hardcopy lab manuals signed by course instructor. 30-minute code evaluation followed by external viva.',
    isPublished: true,
  },
];

export const INITIAL_RESULTS: SemesterResultSummary[] = [];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not_1',
    title: 'Autumn 2026 Mid-Semester Examination Schedule Announced',
    category: 'examination',
    targetAudience: 'all',
    content: 'The Mid-Semester Examination for all UG & PG branches commences on November 15, 2026. Hall tickets and seating arrangements are live in the student portal under the Examination tab.',
    publishedBy: 'Office of the Controller of Examinations',
    isPinned: true,
    date: '2026-10-30',
  },
  {
    id: 'not_2',
    title: 'NEXORA Global AI & Robotics Hackathon 2026 (Prize Pool $50,000)',
    category: 'events',
    targetAudience: 'all',
    content: 'Annual 48-hour hackathon sponsored by NVIDIA and Google. Tracks include Generative AI, Robotics Automation, Quantum Computing, and Green Tech. Register teams of up to 4.',
    publishedBy: 'Department of AI & Data Science',
    isPinned: true,
    date: '2026-10-28',
  },
  {
    id: 'not_3',
    title: 'Campus Placement Drive: Google, Microsoft & Tesla Initial Rounds',
    category: 'academic',
    targetAudience: 'students',
    content: 'Interviews commence November 4th at the Smart Auditorium. Eligible registered final year students must complete digital pre-assessment verification.',
    publishedBy: 'Director of Corporate Relations & Placements',
    isPinned: false,
    date: '2026-10-25',
  },
  {
    id: 'not_4',
    title: 'Smart Library Extended 24/7 Hours for Examination Month',
    category: 'general',
    targetAudience: 'all',
    content: 'The Central Smart Digital Library and silent study pods will operate around the clock with uninterrupted high-speed fiber internet and cafe access from Nov 1st.',
    publishedBy: 'Head Librarian & Campus Operations',
    isPinned: false,
    date: '2026-10-22',
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const INITIAL_FEES: FeeRecord[] = [];

export const INITIAL_COMPLAINTS: Complaint[] = [];

export const INITIAL_FACILITIES: CampusFacility[] = [
  {
    id: 'fac_1',
    name: 'Next-Gen AI Robotics & Autonomous Systems Lab',
    category: 'Research & Innovation',
    description: 'Equipped with 6-axis industrial KUKA manipulators, LiDAR mapping carts, humanoid development platforms, and NVIDIA DGX compute nodes.',
    capacity: '60 Researchers',
    timings: '07:00 AM – 11:00 PM',
    incharge: 'Dr. Marcus Sterling',
    imageUrl: '/src/assets/images/campus_robotics_lab_1793456929812.jpg',
    specs: ['NVIDIA DGX Cluster', '12 Industrial Robotic Arms', 'OptiTrack Motion Capture Arena', 'Full Hardware Fabrication Suite'],
  },
  {
    id: 'fac_2',
    name: 'Smart Central Digital Library & Holographic Commons',
    category: 'Learning Commons',
    description: 'Over 250,000 digital journals, IEEE Xplore & ACM digital access, acoustic silent study pods, and immersive 3D visualization headsets.',
    capacity: '850 Students',
    timings: '24 Hours / 7 Days',
    incharge: 'Prof. David Vance',
    imageUrl: '/src/assets/images/hero_campus_futuristic_1793456912931.jpg',
    specs: ['24/7 Biometric Entry', 'Acoustic Soundproof Study Pods', 'Gigabit Fiber Workbenches', 'Automated RFID Book Checkout'],
  },
  {
    id: 'fac_3',
    name: 'Futuristic Olympic Sports & Athletic Center',
    category: 'Athletics & Wellness',
    description: 'Olympic-size indoor swimming complex, synthetic basketball arenas, esports training lab, and full biomechanics training studio.',
    capacity: '1,200 Spectators',
    timings: '06:00 AM – 10:00 PM',
    incharge: 'Coach Elena Rostova',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    specs: ['Olympic Heated Pool', 'Smart Biometrics Gym', 'Indoor Badminton Courts', 'Esports Simulator Arena'],
  },
  {
    id: 'fac_4',
    name: 'Cybernetic Tech Canteen & Organic Bistro',
    category: 'Dining & Social',
    description: 'Zero-waste automated nutrition dining with mobile app ordering, organic chef-prepared meals, and neon outdoor terrace.',
    capacity: '600 Diners',
    timings: '07:30 AM – 11:30 PM',
    incharge: 'Chef Marco Bellini',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    specs: ['Mobile App Order & Skip Line', 'Organic Nutritional Calorie Display', 'Robotic Barista Station', 'High-Speed Charging Booths'],
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud_1', userEmail: 'ajayshewale211@gmail.com', action: 'INIT_SYSTEM', entityType: 'System', entityId: 'NEXORA', details: 'Institutional security ledger initialized with sole root admin Ajay Shewale.', timestamp: '2026-10-31 00:00:00' },
];

// LocalStorage persistence helpers so user edits persist across refreshes!
const STORAGE_PREFIX = 'nexora_portal_';

export function getStoredData<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

export function clearAllStoredData(): void {
  if (typeof window === 'undefined') return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith(STORAGE_PREFIX) || key.startsWith('nexora_portal_') || key.startsWith('nexora_theme'))) {
      if (key !== 'nexora_theme') {
        keysToRemove.push(key);
      }
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}

// Enforce single admin (ajayshewale211@gmail.com), 0 default students, and manual attendance on boot
const DB_VERSION_TAG = 'nexora_v8_strict_faculty_student_provisioning';
if (typeof window !== 'undefined') {
  try {
    const currentVersion = localStorage.getItem('nexora_version_tag');
    if (currentVersion !== DB_VERSION_TAG) {
      clearAllStoredData();
      localStorage.setItem('nexora_version_tag', DB_VERSION_TAG);
    }
  } catch (err) {
    console.warn('Storage sync error:', err);
  }
}
