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

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_1',
    subjectName: 'Deep Neural Networks & Vision',
    totalClasses: 36,
    attendedClasses: 32,
    percentage: 88.9,
    lastDate: '2026-10-30',
    status: 'Safe',
  },
  {
    id: 'att_2',
    subjectName: 'Distributed Cloud Architecture',
    totalClasses: 32,
    attendedClasses: 28,
    percentage: 87.5,
    lastDate: '2026-10-29',
    status: 'Safe',
  },
  {
    id: 'att_3',
    subjectName: 'Autonomous Robotics & SLAM',
    totalClasses: 30,
    attendedClasses: 21,
    percentage: 70.0,
    lastDate: '2026-10-28',
    status: 'Warning',
  },
  {
    id: 'att_4',
    subjectName: 'Applied Quantum Information',
    totalClasses: 28,
    attendedClasses: 24,
    percentage: 85.7,
    lastDate: '2026-10-27',
    status: 'Safe',
  },
  {
    id: 'att_5',
    subjectName: 'Cybersecurity & Cryptographic Proofs',
    totalClasses: 34,
    attendedClasses: 31,
    percentage: 91.2,
    lastDate: '2026-10-30',
    status: 'Safe',
  },
];

export const INITIAL_ATTENDANCE_LOGS: AttendanceLog[] = [
  { id: 'log_1', date: '2026-10-30', subjectName: 'Deep Neural Networks & Vision', facultyName: 'Dr. Marcus Sterling', status: 'Present', period: '09:00 - 10:30' },
  { id: 'log_2', date: '2026-10-30', subjectName: 'Cybersecurity & Cryptographic Proofs', facultyName: 'Dr. Aris Thorne', status: 'Present', period: '11:00 - 12:30' },
  { id: 'log_3', date: '2026-10-29', subjectName: 'Distributed Cloud Architecture', facultyName: 'Prof. Sarah Jenkins', status: 'Present', period: '13:30 - 15:00' },
  { id: 'log_4', date: '2026-10-28', subjectName: 'Autonomous Robotics & SLAM', facultyName: 'Dr. Samantha Reed', status: 'Absent', period: '10:00 - 12:00' },
  { id: 'log_5', date: '2026-10-27', subjectName: 'Applied Quantum Information', facultyName: 'Dr. Evelyn Carter', status: 'Present', period: '09:00 - 10:30' },
];

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

export const INITIAL_FACULTY_ASSIGNMENTS_ROSTER: AssignmentSubmission[] = [
  {
    id: 'sub_1',
    assignmentId: 'asg_1',
    studentId: 'usr_student_01',
    studentName: 'Alexandre Chen',
    enrollmentNo: 'NX-2023-AIDS-042',
    submittedAt: '2026-10-29T18:32:00Z',
    fileName: 'chen_alex_mha_implementation.zip',
    fileSize: '4.2 MB',
    status: 'Graded',
    marksObtained: 47,
    maxMarks: 50,
    feedback: 'Flawless matrix scaling and attention mask handling. Good documentation.',
  },
  {
    id: 'sub_2',
    assignmentId: 'asg_1',
    studentId: 'usr_student_02',
    studentName: 'Maya Patel',
    enrollmentNo: 'NX-2023-AIDS-019',
    submittedAt: '2026-10-30T09:14:00Z',
    fileName: 'patel_maya_transformer_code.zip',
    fileSize: '3.8 MB',
    status: 'Submitted',
    maxMarks: 50,
  },
  {
    id: 'sub_3',
    assignmentId: 'asg_1',
    studentId: 'usr_student_03',
    studentName: 'Julian Vance',
    enrollmentNo: 'NX-2023-AIDS-088',
    submittedAt: '2026-10-30T14:45:00Z',
    fileName: 'jvance_assignment1.tar.gz',
    fileSize: '5.1 MB',
    status: 'Submitted',
    maxMarks: 50,
  },
];

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

export const INITIAL_RESULTS: SemesterResultSummary[] = [
  {
    semester: 4,
    sgpa: 9.42,
    cgpa: 9.28,
    totalCredits: 24,
    status: 'Distinction',
    results: [
      { id: 'res_401', semester: 4, academicYear: '2025-2026', examType: 'Semester End', subjectCode: 'AIDS-401', subjectName: 'Machine Learning Foundations', credits: 4, internalMarks: 28, externalMarks: 65, totalMarks: 93, maxMarks: 100, grade: 'O', gradePoints: 10 },
      { id: 'res_402', semester: 4, academicYear: '2025-2026', examType: 'Semester End', subjectCode: 'AIDS-402', subjectName: 'Database Engineering & NoSQL', credits: 4, internalMarks: 27, externalMarks: 62, totalMarks: 89, maxMarks: 100, grade: 'A+', gradePoints: 9 },
      { id: 'res_403', semester: 4, academicYear: '2025-2026', examType: 'Semester End', subjectCode: 'AIDS-403', subjectName: 'Operating Systems & Concurrency', credits: 4, internalMarks: 29, externalMarks: 67, totalMarks: 96, maxMarks: 100, grade: 'O', gradePoints: 10 },
      { id: 'res_404', semester: 4, academicYear: '2025-2026', examType: 'Semester End', subjectCode: 'AIDS-404', subjectName: 'Discrete Mathematical Structures', credits: 4, internalMarks: 26, externalMarks: 60, totalMarks: 86, maxMarks: 100, grade: 'A+', gradePoints: 9 },
      { id: 'res_405', semester: 4, academicYear: '2025-2026', examType: 'Semester End', subjectCode: 'AIDS-405P', subjectName: 'Data Engineering Laboratory', credits: 4, internalMarks: 48, externalMarks: 49, totalMarks: 97, maxMarks: 100, grade: 'O', gradePoints: 10 },
    ],
  },
  {
    semester: 3,
    sgpa: 9.14,
    cgpa: 9.21,
    totalCredits: 24,
    status: 'Distinction',
    results: [
      { id: 'res_301', semester: 3, academicYear: '2025-2026', examType: 'Semester End', subjectCode: 'AIDS-301', subjectName: 'Data Structures & Algorithms', credits: 4, internalMarks: 29, externalMarks: 64, totalMarks: 93, maxMarks: 100, grade: 'O', gradePoints: 10 },
      { id: 'res_302', semester: 3, academicYear: '2025-2026', examType: 'Semester End', subjectCode: 'AIDS-302', subjectName: 'Digital Logic & Computer Architecture', credits: 4, internalMarks: 25, externalMarks: 58, totalMarks: 83, maxMarks: 100, grade: 'A', gradePoints: 8 },
      { id: 'res_303', semester: 3, academicYear: '2025-2026', examType: 'Semester End', subjectCode: 'AIDS-303', subjectName: 'Linear Algebra & Optimization', credits: 4, internalMarks: 28, externalMarks: 63, totalMarks: 91, maxMarks: 100, grade: 'O', gradePoints: 10 },
    ],
  },
];

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

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'ntf_1', title: 'Assignment Evaluated', message: 'Dr. Marcus Sterling graded your Transformer Attention Mechanism assignment (47/50).', type: 'assignment', isRead: false, createdAt: '10 mins ago' },
  { id: 'ntf_2', title: 'Attendance Alert', message: 'Your attendance in Autonomous Robotics & SLAM is 70.0% (Threshold: 75%). Please meet Dr. Samantha Reed.', type: 'attendance_warning', isRead: false, createdAt: '2 hours ago' },
  { id: 'ntf_3', title: 'New Exam Timetable', message: 'Mid-Semester exam schedule Autumn 2026 published.', type: 'notice', isRead: true, createdAt: '1 day ago' },
  { id: 'ntf_4', title: 'Semester 4 Result Published', message: 'Official grade sheet released: SGPA 9.42 (Distinction).', type: 'result', isRead: true, createdAt: '3 days ago' },
];

export const INITIAL_FEES: FeeRecord[] = [
  {
    id: 'fee_1',
    semester: 5,
    academicYear: '2026-2027',
    tuitionFee: 4200,
    labFee: 800,
    libraryFee: 250,
    totalAmount: 5250,
    paidAmount: 5250,
    status: 'Paid',
    receiptNo: 'NX-REC-2026-08912',
    transactionRef: 'TXN-ETH-98129038',
    dueDate: '2026-08-30',
    paymentDate: '2026-08-20',
  },
  {
    id: 'fee_2',
    semester: 6,
    academicYear: '2026-2027',
    tuitionFee: 4200,
    labFee: 800,
    libraryFee: 250,
    totalAmount: 5250,
    paidAmount: 0,
    status: 'Pending',
    receiptNo: 'NX-INVOICE-2027-0104',
    transactionRef: 'PENDING_PORTAL_PAYMENT',
    dueDate: '2027-01-15',
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp_1',
    studentId: 'usr_student_01',
    studentName: 'Alexandre Chen',
    category: 'Infrastructure',
    subject: 'High-Performance Workstation GPU Drivers in Lab Alpha-302',
    description: 'Workstation 14 in Lab Alpha-302 has an outdated CUDA 12.0 driver that fails while compiling Triton kernels for Deep Learning lab practicals.',
    status: 'In Progress',
    response: 'IT Systems engineer assigned. CUDA 12.6 driver roll-out scheduled for tonight 22:00.',
    createdAt: '2026-10-29',
  },
  {
    id: 'cmp_2',
    studentId: 'usr_student_01',
    studentName: 'Alexandre Chen',
    category: 'Hostel',
    subject: 'Block-D High-Speed WiFi AP Roaming Issue',
    description: 'Frequent packet drops when moving between study floor 3 and dorm rooms.',
    status: 'Resolved',
    response: 'Aruba AP cluster reconfigured and mesh channel handoff optimized. Signal verified at -42dBm.',
    createdAt: '2026-10-18',
  },
];

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
  { id: 'aud_1', userEmail: 'admin.provost@nexora.edu', action: 'APPROVE_STUDENT_ENROLLMENT', entityType: 'Profile', entityId: 'NX-2023-AIDS-042', details: 'Approved Alexandre Chen for Autumn 2026 Semester 5 registration.', timestamp: '2026-10-31 06:12:00' },
  { id: 'aud_2', userEmail: 'dr.marcus@nexora.edu', action: 'MARK_ATTENDANCE_SESSION', entityType: 'Attendance', entityId: 'AIDS-501', details: 'Recorded session attendance for Deep Neural Networks (28/32 present).', timestamp: '2026-10-30 10:35:14' },
  { id: 'aud_3', userEmail: 'dr.marcus@nexora.edu', action: 'GRADE_ASSIGNMENT', entityType: 'AssignmentSubmission', entityId: 'asg_1', details: 'Graded submission for student Alexandre Chen: 47/50.', timestamp: '2026-10-30 09:20:00' },
  { id: 'aud_4', userEmail: 'admin.provost@nexora.edu', action: 'PUBLISH_EXAMINATION_SCHEDULE', entityType: 'Examination', entityId: 'ex_1', details: 'Published Mid-Semester Theory Examination schedule Autumn 2026 to student portal.', timestamp: '2026-10-30 08:00:00' },
  { id: 'aud_5', userEmail: 'admin.provost@nexora.edu', action: 'CREATE_NOTICE', entityType: 'Notice', entityId: 'not_1', details: 'Published pinned examination notice to institutional noticeboard.', timestamp: '2026-10-30 08:05:00' },
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

// Enforce single admin (ajayshewale211@gmail.com) and 0 departments on initial boot
const DB_VERSION_TAG = 'nexora_v5_ajay_admin_strict';
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
