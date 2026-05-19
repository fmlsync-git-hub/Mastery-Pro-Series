/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  Layers,
  FileCode2,
  Award, 
  Target, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  RotateCcw,
  Timer,
  LogOut,
  Mail,
  User as UserIcon,
  BookOpen,
  Lock,
  Download,
  FileText,
  Table,
  LayoutDashboard,
  Upload,
  BarChart3,
  Users as UsersIcon,
  Image as ImageIcon,
  FileCheck,
  Music,
  Volume2,
  VolumeX,
  Activity,
  Globe,
  AlertTriangle,
  X,
  Linkedin,
  Share2,
  Printer,
  ShieldCheck,
  Eye,
  ExternalLink,
  History,
  Layout,
  Palette,
  Code2,
  Terminal,
  Copy,
  Search
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  collection, 
  getDocs,
  serverTimestamp as firestoreTimestamp, 
  query,
  orderBy,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  ref as dbRef, 
  set as dbSet, 
  push as dbPush, 
  onValue, 
  onDisconnect, 
  serverTimestamp as dbTimestamp,
  limitToLast,
  query as dbQuery
} from 'firebase/database';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { auth, db, storage, rdb, handleFirestoreError, OperationType } from './lib/firebase';
import { levels, courses } from './data';
import { Question, Level, AppState, UserProfile } from './types';

interface Certification {
  id: string;
  userId: string;
  userName: string;
  courseId?: string;
  courseTitle?: string;
  level: string;
  score: number;
  total: number;
  timestamp: any;
  dateString: string;
}

// Certificate Component for high-quality export
const Certificate = ({ user, level, score, total, topic, date }: { 
  user: string; 
  level: string; 
  score: number; 
  total: number;
  topic: string;
  date: string;
}) => {
  return (
    <div id="certificate-template" className="w-[841.89px] h-[595.28px] bg-bg-main text-text-primary p-12 flex flex-col items-center justify-between border-[12px] border-double border-accent-blue/40 relative overflow-hidden font-sans uppercase">
      {/* Decorative background elements */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-accent-blue/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-accent-blue/5 blur-[100px] rounded-full" />
      <div className="absolute inset-0 border border-white/5 m-4 pointer-events-none" />
      
      <div className="text-center z-10 w-full">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-0.5 bg-accent-blue/50" />
          <Trophy className="w-12 h-12 text-accent-blue" />
          <div className="w-12 h-0.5 bg-accent-blue/50" />
        </div>
        <h1 className="text-xl font-black tracking-[0.5em] text-accent-blue mb-2">Certificate of Achievement</h1>
        <p className="text-[0.6rem] font-black tracking-[0.2em] text-text-muted">Official Mastery Pro Series Certification</p>
      </div>

      <div className="text-center z-10">
        <p className="text-[0.7rem] font-bold tracking-[0.3em] mb-4 text-text-secondary">THIS IS TO CERTIFY THAT</p>
        <h2 className="text-5xl font-black tracking-tighter text-white mb-2">{user}</h2>
        <div className="w-24 h-1 bg-accent-blue mx-auto mb-8" />
        <p className="text-sm font-bold tracking-[0.1em] text-text-secondary leading-relaxed max-w-lg mx-auto">
          HAS SUCCESSFULLY COMPLETED THE <span className="text-white">{level.toUpperCase()}</span> TIER ASSESSMENT 
          IN <span className="text-white">{topic.toUpperCase()}</span> WITH A MERIT SCORE OF <span className="text-accent-blue">{score}/{total}</span>
        </p>
      </div>

      <div className="w-full flex justify-between items-end z-10 px-12">
        <div className="text-left">
          <div className="w-40 h-px bg-white/20 mb-3" />
          <p className="text-[0.5rem] font-black tracking-[0.2em] text-text-muted">DATE OF ISSUANCE</p>
          <p className="text-[0.6rem] font-mono text-accent-blue mt-1">{date}</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 border-2 border-accent-blue/20 rounded-full flex items-center justify-center mb-2">
            <div className="w-16 h-16 border border-accent-blue/10 rounded-full flex items-center justify-center">
               <Trophy className="w-8 h-8 text-accent-blue/30" />
            </div>
          </div>
          <p className="text-[0.5rem] font-black tracking-[0.2em] text-text-muted">OFFICIAL SEAL</p>
        </div>
        <div className="text-right">
          <div className="flex justify-end gap-2 mb-3">
             <div className="w-8 h-px bg-white/20" />
             <div className="w-24 h-px bg-accent-blue" />
          </div>
          <p className="text-[0.5rem] font-black tracking-[0.2em] text-text-muted">SYSTEM ADMINISTRATOR</p>
          <p className="text-[0.5rem] font-mono text-white mt-1">GEN-AUTH-UID-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      </div>
      
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
    </div>
  );
};

export default function App() {
  const [state, setState] = useState<AppState>({
    user: null,
    currentCourseId: null,
    currentLevel: null,
    currentQuestionIndex: 0,
    score: 0,
    answers: {},
    isFinished: false,
    showMilestone: false,
    viewingReview: false,
    viewingAdmin: false,
    hasSeenLanding: false,
  });

  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [regData, setRegData] = useState({ fullName: '', email: '', password: '' });
  const [timeLeft, setTimeLeft] = useState(30);
  const [showFeedback, setShowFeedback] = useState<null | 'correct' | 'wrong'>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Strict Exam State
  const [isStrictExam, setIsStrictExam] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [publicCert, setPublicCert] = useState<any>(null);
  const [viewingHistory, setViewingHistory] = useState(false);
  const [certHistory, setCertHistory] = useState<any[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Handle Payment Successful Redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('payment_status');
    const levelParam = urlParams.get('level');
    const courseIdParam = urlParams.get('courseId');
    
    if (status === 'success' && levelParam && state.user) {
      const handlePaymentSuccess = async () => {
        const purchaseId = `${courseIdParam || state.currentCourseId || 'html'}_${levelParam}`;
        const alreadyPurchased = state.user?.purchasedLevels?.includes(purchaseId);
        
        if (alreadyPurchased) {
           window.history.replaceState({}, document.title, window.location.pathname);
           return;
        }

        try {
          await updateDoc(doc(db, 'users', state.user!.uid), {
            purchasedLevels: arrayUnion(purchaseId)
          });
          
          setState(prev => prev.user ? ({
            ...prev,
            user: { ...prev.user!, purchasedLevels: [...(prev.user!.purchasedLevels || []), purchaseId] }
          }) : prev);
          
          notify(`PRO TIER UNLOCKED: ${levelParam.toUpperCase()} verification protocol authorized`, "success");
          
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) {
          console.error("Purchase Update Error", e);
          notify("Synchronization Error: Purchase verification failed", "error");
        }
      };
      handlePaymentSuccess();
    }
  }, [state.user, state.currentCourseId]);

  const handleInitiatePayment = async (level: string) => {
    if (!state.user) {
      notify("AUTHENTICATION REQUIRED: Identity verification needed for payment protocol", "error");
      setAuthMode('login');
      return;
    }

    setIsProcessingPayment(true);
    playClick();

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: state.user.uid,
          userEmail: state.user.email,
          level,
          courseId: state.currentCourseId || 'html',
          origin: window.location.origin
        })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (e: any) {
      notify(`PAYMENT GATEWAY ERROR: ${e.message}`, "error");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const currentCourse = state.currentCourseId ? courses[state.currentCourseId] : null;
  const currentLevelQuestions = shuffledQuestions.length > 0 ? shuffledQuestions : (state.currentLevel && currentCourse ? currentCourse.levels[state.currentLevel].questions : []);
  const currentLevelData = state.currentLevel && currentCourse ? currentCourse.levels[state.currentLevel] : null;
  const currentQuestion = currentLevelQuestions[state.currentQuestionIndex];

  // Verification Check
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('verify');
    if (token) {
      const fetchCert = async () => {
        try {
          const certDoc = await getDoc(doc(db, 'certifications', token));
          if (certDoc.exists()) {
            setPublicCert(certDoc.data());
          } else {
            notify("Invalid or expired certification token");
          }
        } catch (e) {
          notify("Error verifying certification");
        }
        setLoading(false);
      };
      fetchCert();
    }
  }, []);

  // Strict Mode Listener
  useEffect(() => {
    if (isStrictExam && !state.isFinished && !isDisqualified) {
      const handleSecurityViolation = () => {
        setIsDisqualified(true);
        notify("SECURITY BREACH: Disqualified for switching tabs/windows during Pro Exam", "error");
        dbPush(dbRef(rdb, 'activity'), {
          user: state.user?.fullName.split(' ')[0],
          type: 'disqualified',
          level: state.currentLevel,
          timestamp: dbTimestamp()
        });
      };

      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        notify("Action prohibited in Pro Series Exam", "error");
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'i' || e.key === 'u')) {
          e.preventDefault();
          notify("Shortcuts are disabled for integrity protection", "error");
        }
      };

      window.addEventListener('blur', handleSecurityViolation);
      window.addEventListener('visibilitychange', () => {
        if (document.hidden) handleSecurityViolation();
      });
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.userSelect = 'none';

      return () => {
        window.removeEventListener('blur', handleSecurityViolation);
        window.removeEventListener('visibilitychange', handleSecurityViolation);
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.userSelect = 'auto';
      };
    }
  }, [isStrictExam, state.isFinished, isDisqualified]);
  
  // Audio State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bgMusic] = useState(new Audio('https://assets.mixkit.co/music/preview/mixkit-night-sky-loop-215.mp3'));
  const [clickSound] = useState(new Audio('https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3'));

  // Realtime State
  const [onlineCount, setOnlineCount] = useState(0);
  const [liveActivity, setLiveActivity] = useState<any[]>([]);
  
  // Admin Analytics State
  const [adminData, setAdminData] = useState<{users: UserProfile[], sessions: any[]}>({ users: [], sessions: [] });
  const [appLogo, setAppLogo] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'error' | 'success'} | null>(null);

  // Session Timeout State
  const lastActivityRef = React.useRef(Date.now());
  const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  // Admin Search & Verification State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserForReview, setSelectedUserForReview] = useState<UserProfile | null>(null);
  const [userCerts, setUserCerts] = useState<Certification[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  // Session Timeout Listener
  useEffect(() => {
    if (!state.user) return;

    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };
    
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > TIMEOUT_DURATION) {
        handleLogout();
        notify("SESSION EXPIRED: Authenticity re-verification required due to inactivity", "error");
      }
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      clearInterval(interval);
    };
  }, [state.user]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            setState(prev => ({ ...prev, user: userData }));

            // Realtime Presence Logic
            const presenceRef = dbRef(rdb, `presence/${user.uid}`);
            dbSet(presenceRef, {
              status: 'online',
              fullName: userData.fullName,
              last_changed: dbTimestamp()
            });
            onDisconnect(presenceRef).set({
              status: 'offline',
              last_changed: dbTimestamp()
            });
          }
        } catch (error) {
          console.error("Profile Fetch Error", error);
        }
      } else {
        setState(prev => ({ ...prev, user: null }));
      }
      setLoading(false);
    });

    // Realtime Global Online Count
    const onlineRef = dbRef(rdb, 'presence');
    onValue(onlineRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const count = Object.values(data).filter((v: any) => v.status === 'online').length;
        setOnlineCount(count);
      }
    });

    // Realtime Activity Feed
    const activityRef = dbQuery(dbRef(rdb, 'activity'), limitToLast(10));
    onValue(activityRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const activities = Object.values(data).reverse();
        setLiveActivity(activities);
      }
    });

    // Background Music Setup
    bgMusic.loop = true;
    bgMusic.volume = 0.3;

    // Fetch Logo
    getDoc(doc(db, 'app_config', 'logo')).then(docSnap => {
      if (docSnap.exists()) {
        setAppLogo(docSnap.data().url);
      }
    });

    return () => unsubscribe();
  }, []);

  // Audio Control Effect
  useEffect(() => {
    if (soundEnabled && !loading && state.user) {
      bgMusic.play().catch(e => console.log("Audio play blocked", e));
    } else {
      bgMusic.pause();
    }
  }, [soundEnabled, loading, state.user]);

  const PublicVerificationView = () => (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans lowercase">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full bg-[#0a0a0a] border-2 border-accent-emerald/20 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.05)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-accent-emerald" />
        <ShieldCheck className="w-20 h-20 text-accent-emerald mx-auto mb-8 animate-pulse" />
        <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Certificate Verified</h1>
        <p className="text-[0.6rem] font-black uppercase tracking-[0.4em] text-text-secondary mb-12 border-b border-white/5 pb-6 inline-block">Official Mastery Pro Series Validation Gate</p>
        
        <div className="grid grid-cols-2 gap-8 text-left mb-12">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
             <div className="text-[0.55rem] font-black uppercase tracking-widest text-text-secondary mb-2">Recipient Name</div>
             <div className="text-lg font-black tracking-tight uppercase">{publicCert.userName}</div>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
             <div className="text-[0.55rem] font-black uppercase tracking-widest text-text-secondary mb-2">Assessed Domain</div>
             <div className="text-lg font-black tracking-tight uppercase text-accent-emerald">{publicCert.courseTitle || 'Mastery Pro'} - {publicCert.level}</div>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
             <div className="text-[0.55rem] font-black uppercase tracking-widest text-text-secondary mb-2">Score Accuracy</div>
             <div className="text-lg font-black tracking-tight uppercase">{Math.round((publicCert.score / publicCert.total) * 100)}% ({publicCert.score}/{publicCert.total})</div>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
             <div className="text-[0.55rem] font-black uppercase tracking-widest text-text-secondary mb-2">Completion Date</div>
             <div className="text-[0.7rem] font-mono uppercase text-text-secondary leading-tight">{publicCert.dateString}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
           <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-[0.6rem] font-black uppercase tracking-widest text-accent-emerald flex items-center justify-center gap-3">
             <CheckCircle2 className="w-4 h-4" /> Authenticity Confirmed by Mastery Pro Cloud
           </div>
           <button onClick={() => window.location.href = '/'} className="text-[0.6rem] font-black uppercase tracking-widest text-text-secondary hover:text-white transition-colors">Return to Central Hub</button>
        </div>
      </motion.div>
    </div>
  );

  const DisqualifiedView = () => (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 uppercase">
       <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-card-dark border-2 border-red-500/30 rounded-[3rem] p-12 text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]">
          <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-8 animate-bounce" />
          <h2 className="text-3xl font-black tracking-tighter mb-2">Security Breach</h2>
          <p className="text-[0.65rem] text-text-secondary font-black tracking-widest mb-10 leading-relaxed uppercase">The integrity monitor detected a tab switch or window blur. This assessment iteration has been terminated.</p>
          <button onClick={() => { setIsDisqualified(false); resetQuiz(); }} className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[0.6rem] hover:bg-white/10 transition-all">Establish New Session</button>
       </motion.div>
    </div>
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    notify("Copied to clipboard", "success");
  };

  const playClick = () => {
    if (soundEnabled) {
      clickSound.currentTime = 0;
      clickSound.play().catch(e => console.log("Click sound blocked", e));
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const sessionsSnap = await getDocs(query(collection(db, 'quiz_sessions'), orderBy('timestamp', 'desc')));
      
      const users = usersSnap.docs.map(d => d.data() as UserProfile);
      const sessions = sessionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      setAdminData({ users, sessions });
    } catch (error) {
      console.error("Admin Fetch Error", error);
    }
    setLoading(false);
  };

  const fetchUserDetails = async (user: UserProfile) => {
    setIsVerifying(true);
    setSelectedUserForReview(user);
    try {
      const q = query(collection(db, 'certifications'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      const certs = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as Certification))
        .filter(c => c.userId === user.uid);
      setUserCerts(certs);
    } catch (e) {
      notify("Failed to fetch user credentials");
    }
    setIsVerifying(false);
  };

  const generateVerificationEmail = (user: UserProfile, certs: Certification[]) => {
    const certList = certs.map(c => `- ${c.level} Tier: ${c.score}/${c.total} Accuracy (${c.dateString})`).join('\n');
    const body = `
OFFICIAL VERIFICATION REPORT: ${user.fullName}

Mastery Pro Series Protocol has verified the following professional competencies for candidate ${user.email}:

REGISTRATION IDENTITY: ${user.fullName}
VERIFIED CREDENTIALS:
${certs.length > 0 ? certList : 'NO CLOUD CERTIFICATIONS FOUND'}

This report serves as primary validation of technical mastery.
Generated on: ${new Date().toUTCString()}
Verification Token Reference: ${certs[0]?.id || 'N/A'}
    `;
    
    const mailto = `mailto:?subject=Professional Verification: ${user.fullName}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  useEffect(() => {
    if (state.currentLevel && !state.isFinished && !showFeedback && !state.showMilestone) {
      if (timeLeft <= 0) {
        handleAnswer('');
        return;
      }
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.currentLevel, state.currentQuestionIndex, state.isFinished, timeLeft, showFeedback, state.showMilestone]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !state.user?.isAdmin) return;

    try {
      const sRef = storageRef(storage, 'logos/app_logo');
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      await setDoc(doc(db, 'app_config', 'logo'), { url });
      setAppLogo(url);
      notify("Logo updated successfully!", "success");
    } catch (error) {
       console.error("Upload Error", error);
       notify("Branding update failed");
    }
  };

  const notify = (message: string, type: 'error' | 'success' = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    playClick();
    
    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (authMode === 'register' && regData.fullName.length < 2) {
      notify("Please enter your full legal name");
      setLoading(false);
      return;
    }
    if (!emailRegex.test(regData.email) && regData.email.toLowerCase() !== 'admin') {
      notify("Please provide a valid diagnostic email address");
      setLoading(false);
      return;
    }
    if (regData.password.length < 6 && regData.email.toLowerCase() !== 'admin') {
      notify("Access Token must be at least 6 characters for cloud security");
      setLoading(false);
      return;
    }

    try {
      // Special Admin Login Check
      if (regData.email.toLowerCase() === 'admin' && regData.password === 'admin*') {
        const adminEmail = 'admin@masterypro.series';
        const adminPass = 'admin_master_123';
        
        try {
          await signInWithEmailAndPassword(auth, adminEmail, adminPass);
        } catch (err: any) {
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-login-credentials') {
            const res = await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
            const user = res.user;
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              fullName: 'Executive Administrator',
              email: adminEmail,
              registeredAt: new Date().toISOString(),
              isAdmin: true
            });
          } else throw err;
        }
        return;
      }

      if (authMode === 'register') {
        const { user } = await createUserWithEmailAndPassword(auth, regData.email, regData.password);
        const profile: UserProfile = {
          uid: user.uid,
          fullName: regData.fullName,
          email: regData.email,
          registeredAt: new Date().toISOString(),
          isAdmin: false
        };
        await setDoc(doc(db, 'users', user.uid), { ...profile, registeredAt: firestoreTimestamp() });
        setState(prev => ({ ...prev, user: profile }));
        notify("Account created successfully", "success");
      } else {
        await signInWithEmailAndPassword(auth, regData.email, regData.password);
        notify("Welcome back", "success");
      }
    } catch (error: any) {
      notify(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async () => {
    const element = document.getElementById('certificate-template');
    if (!element) return;
    
    setLoading(true);
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${state.user?.fullName.replace(' ', '_')}_Certificate.pdf`);
      notify("Certificate downloaded successfully", "success");
    } catch (error) {
      console.error(error);
      notify("Failed to generate certificate");
    }
    setLoading(false);
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`I just completed the ${state.currentLevel} Tier on Mastery Pro Series!`);
    const summary = encodeURIComponent(`Completed the assessment with a score of ${state.score} / ${currentLevelQuestions.length}. Check out this professional certification platform.`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const handleLogout = async () => {
    playClick();
    await signOut(auth);
    resetQuiz();
  };

  // Export Functions
  const exportToExcel = () => {
    const data = adminData.sessions.map(s => ({
      Participant: adminData.users.find(u => u.uid === s.userId)?.fullName || 'Legacy User',
      Email: adminData.users.find(u => u.uid === s.userId)?.email || 'N/A',
      Tier: s.level.toUpperCase(),
      Score: s.score,
      Total: s.totalQuestions,
      Accuracy: `${Math.round((s.score / s.totalQuestions) * 100)}%`,
      Date: s.timestamp?.toDate ? s.timestamp.toDate().toLocaleString() : 'Recent'
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics");
    XLSX.writeFile(workbook, "MasteryPro_Broadsheet.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.text("MASTERY PRO SERIES - ANALYTICS BROADSHEET", 14, 15);
    const tableData = adminData.sessions.map(s => [
      adminData.users.find(u => u.uid === s.userId)?.fullName || 'Legacy User',
      adminData.users.find(u => u.uid === s.userId)?.email || 'N/A',
      s.level.toUpperCase(),
      `${s.score} / ${s.totalQuestions}`,
      `${Math.round((s.score / s.totalQuestions) * 100)}%`,
      s.timestamp?.toDate ? s.timestamp.toDate().toLocaleString() : 'Recent'
    ]);
    autoTable(doc, { 
      head: [['Participant', 'Email', 'Tier', 'Points', 'Accuracy', 'Timestamp']],
      body: tableData,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });
    doc.save("MasteryPro_Report.pdf");
  };

  const exportToWord = () => {
    let content = `
      <html>
        <head><meta charset='utf-8'></head>
        <body>
          <h1>MASTERY PRO SERIES - EXECUTIVE REPORT</h1>
          <table border='1' style='width:100%; border-collapse: collapse;'>
            <tr style='background: #10b981; color: white;'>
              <th>Name</th><th>Email</th><th>Tier</th><th>Score</th><th>Date</th>
            </tr>
            ${adminData.sessions.map(s => `
              <tr>
                <td>${adminData.users.find(u => u.uid === s.userId)?.fullName || 'N/A'}</td>
                <td>${adminData.users.find(u => u.uid === s.userId)?.email || 'N/A'}</td>
                <td>${s.level}</td>
                <td>${s.score}/${s.totalQuestions}</td>
                <td>${s.timestamp?.toDate ? s.timestamp.toDate().toLocaleString() : 'N/A'}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MasteryPro_Report.doc';
    link.click();
  };

  const handleSelectCourse = (courseId: string) => {
    playClick();
    setState(prev => ({
      ...prev,
      currentCourseId: courseId,
      currentLevel: null,
    }));
  };

  const handleSelectLevel = (level: Level, strict: boolean = false) => {
    if (level === 'advanced' && !state.user?.isAdmin) {
      const purchaseId = `${state.currentCourseId || 'html'}_${level}`;
      const isPurchased = state.user?.purchasedLevels?.includes(purchaseId);
      
      if (!isPurchased) {
        handleInitiatePayment(level);
        return;
      }
    }

    playClick();
    if (state.user && currentCourse) {
      dbPush(dbRef(rdb, 'activity'), {
        user: state.user.fullName.split(' ')[0],
        type: strict ? 'pro_exam_start' : 'level_select',
        level: level,
        course: currentCourse.title,
        timestamp: dbTimestamp()
      });
    }

    // Shuffle logic
    if (!currentCourse) return;
    const questions = [...currentCourse.levels[level].questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(questions);
    setIsStrictExam(strict);
    setIsDisqualified(false);
    setVerificationToken(null);

    setState(prev => ({
      ...prev,
      currentLevel: level,
      currentQuestionIndex: 0,
      score: 0,
      answers: {},
      isFinished: false,
      showMilestone: false,
      viewingReview: false,
    }));
    setTimeLeft(strict ? 20 : 30); // Stricter time limit for Pro Exam
  };

  const fetchCertHistory = async () => {
    if (!state.user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'certifications'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      const certs = snap.docs
        .map(d => ({id: d.id, ...d.data()}))
        .filter((c: any) => c.userId === state.user?.uid);
      setCertHistory(certs);
      setViewingHistory(true);
    } catch (e) {
      notify("Failed to fetch history");
    }
    setLoading(false);
  };

  const handleAnswer = (optionKey: string) => {
    if (!currentQuestion || showFeedback) return;

    playClick();
    const isCorrect = optionKey === currentQuestion.answer;
    setShowFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect && state.user && Math.random() > 0.7) { // Sample activity to avoid spam
      dbPush(dbRef(rdb, 'activity'), {
        user: state.user.fullName.split(' ')[0],
        type: 'correct_answer',
        course: currentCourse?.title,
        level: state.currentLevel,
        timestamp: dbTimestamp()
      });
    }

    setTimeout(async () => {
      const nextIndex = state.currentQuestionIndex + 1;
      const isFinished = nextIndex >= currentLevelQuestions.length;
      const isMilestone = !isFinished && (nextIndex > 0 && nextIndex % 20 === 0);

      const newAnswers = { ...state.answers, [currentQuestion.id]: optionKey };
      const newScore = isCorrect ? state.score + 1 : state.score;

      if (isFinished && state.user) {
        try {
          const sessionData = {
            userId: state.user.uid,
            courseId: state.currentCourseId,
            courseTitle: currentCourse?.title,
            level: state.currentLevel,
            score: newScore,
            totalQuestions: currentLevelQuestions.length,
            timestamp: firestoreTimestamp(),
            answers: newAnswers,
            isProExam: isStrictExam
          };
          await addDoc(collection(db, 'quiz_sessions'), sessionData);

          // Certification logic
          const passThreshold = isStrictExam ? 0.9 : 0.8; // 90% for pro, 80% for standard
          if (newScore / currentLevelQuestions.length >= passThreshold) {
            const token = Math.random().toString(36).substr(2, 6).toUpperCase() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            const certData: Certification = {
              id: token,
              userId: state.user.uid,
              userName: state.user.fullName,
              courseId: state.currentCourseId || undefined,
              courseTitle: currentCourse?.title,
              level: state.currentLevel || 'Beginner',
              score: newScore,
              total: currentLevelQuestions.length,
              timestamp: firestoreTimestamp(),
              dateString: new Date().toUTCString(),
            };
            await setDoc(doc(db, 'certifications', token), certData);
            setVerificationToken(token);
          }

          dbPush(dbRef(rdb, 'activity'), {
            user: state.user.fullName.split(' ')[0],
            type: isStrictExam ? 'pro_completed' : 'completed',
            level: state.currentLevel,
            score: newScore,
            accuracy: Math.round((newScore / currentLevelQuestions.length) * 100),
            timestamp: dbTimestamp()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'quiz_sessions');
        }
      }

      setState((prev) => ({
        ...prev,
        score: newScore,
        currentQuestionIndex: isFinished ? prev.currentQuestionIndex : nextIndex,
        isFinished: isFinished,
        showMilestone: isMilestone,
        answers: newAnswers,
      }));

      setShowFeedback(null);
      setTimeLeft(isStrictExam ? 20 : 30);
    }, 1000);
  };

  const resetQuiz = () => {
    playClick();
    setState(prev => ({
      ...prev,
      currentCourseId: null,
      currentLevel: null,
      currentQuestionIndex: 0,
      score: 0,
      answers: {},
      isFinished: false,
      showMilestone: false,
      viewingReview: false,
    }));
  };

  const handleContinue = () => {
    playClick();
    setState(prev => ({ ...prev, showMilestone: false }));
    setTimeLeft(30);
  };

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-[100] nav-blur py-4 px-6 md:px-12 flex justify-between items-center h-20">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => { playClick(); resetQuiz(); }}>
        <div className="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center shadow-lg shadow-accent-blue/20">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div className="text-xl font-display font-extrabold tracking-tight">
          Mastery<span className="text-accent-blue">Pro</span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <button onClick={() => { playClick(); resetQuiz(); }} className="text-sm font-semibold text-text-secondary hover:text-white transition-colors">Assessment Center</button>
      </div>
      <div className="flex items-center gap-4">
        {state.user ? (
          <div className="flex items-center gap-4">
            {state.user.isAdmin && (
              <button onClick={() => { playClick(); fetchAdminData(); setState(prev => ({...prev, viewingAdmin: true})); }} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                <LayoutDashboard className="w-4 h-4 text-accent-blue" />
              </button>
            )}
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white leading-none">{state.user.fullName}</div>
              <div className="text-[0.6rem] font-bold text-accent-blue uppercase tracking-widest mt-1">Professional Identity</div>
            </div>
            <button onClick={handleLogout} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
              <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        ) : (
          <button onClick={() => { playClick(); setAuthMode('login'); }} className="px-6 py-2.5 rounded-xl bg-accent-blue text-white font-bold text-sm hover:bg-accent-hover transition-all">
            Get Started
          </button>
        )}
      </div>
    </nav>
  );

  const LandingPageView = () => (
    <div className="min-h-screen bg-bg-main text-text-primary font-sans overflow-x-hidden selection:bg-accent-blue selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-6 md:px-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-blue/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-blue/5 blur-[120px] rounded-full" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 shadow-sm"
            >
              <div className="w-2 h-2 bg-accent-emerald rounded-full" />
              <span className="text-xs font-bold text-white/50 uppercase tracking-widest">v5.0 Global Assessment Protocol</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl md:text-8xl font-display font-black leading-[0.9] tracking-tighter mb-8"
            >
              Professional Mastery <br />
              <span className="text-accent-blue">Unified Authority.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed mb-12 max-w-3xl mx-auto opacity-80"
            >
              Elite competency verification for modern engineering and technology domains. Mastery Pro Series provides industrial-grade assessments recognized as the gold standard by global enterprises.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center flex-wrap gap-4"
            >
              <button 
                onClick={() => { playClick(); setState(prev => ({...prev, hasSeenLanding: true})); }}
                className="px-10 py-5 bg-accent-blue text-white rounded-xl font-bold text-lg hover:bg-accent-hover transition-all enterprise-shadow"
              >
                Launch Assessment Center
              </button>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-5xl mx-auto glass-card rounded-[2.5rem] p-4 overflow-hidden"
          >
            <div className="rounded-[1.5rem] overflow-hidden border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2400" 
                alt="Cloud Dashboard" 
                className="w-full aspect-video object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-bg-main/60 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Global Recognition Section */}
      <section className="py-32 px-6 md:px-12 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-sm font-bold text-accent-violet uppercase tracking-[0.4em] mb-4">Strategic Impact</h2>
              <h3 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-8">Bridging the Gap Between <span className="text-accent-violet">Ambition & Authority.</span></h3>
              <p className="text-lg text-text-secondary leading-relaxed mb-10">
                Our platform doesn't just test skills—it builds professional legacies. By integrating directly with LinkedIn, Glassdoor, and global HR networks, your Mastery Pro certificate acts as a dynamic verifiable credential that travels with your career.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-display font-black text-white mb-2">98%</div>
                  <div className="text-xs font-bold text-text-secondary uppercase tracking-widest">Industry Trust Score</div>
                </div>
                <div>
                  <div className="text-4xl font-display font-black text-white mb-2">1.2M+</div>
                  <div className="text-xs font-bold text-text-secondary uppercase tracking-widest">Verified Profiles</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Globe, title: 'Global Recognition', desc: 'Accepted by 4,000+ institutions.' },
                { icon: ShieldCheck, title: 'Secure Audits', desc: 'Enterprise-grade proctoring systems.' },
                { icon: Target, title: 'Field Agnostic', desc: 'IT, Healthcare, Finance, and Law.' },
                { icon: Award, title: 'Verifiable', desc: 'Cryptographically signed certificates.' }
              ].map((item, i) => (
                <div key={i} className="glass-card p-8 rounded-[2.5rem] group hover:border-accent-violet transition-all">
                  <item.icon className="w-10 h-10 text-accent-violet mb-6 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Domain Expansion Section */}
      <section className="py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-azure/5 blur-[120px] rounded-full -left-96 bottom-0" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-sm font-bold text-accent-azure uppercase tracking-[0.4em] mb-4">The Expansion Roadmap</h2>
          <h3 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-16">Universal Skill Verification</h3>
          
          <div className="flex flex-wrap justify-center gap-12 mb-20 opacity-40 grayscale group-hover:grayscale-0 transition-all">
            {['Medical Board', 'Engineering Standards', 'Legal Jurisprudence', 'Economics Core', 'Applied Sciences'].map((domain) => (
              <div key={domain} className="text-2xl font-display font-black tracking-tighter opacity-70 hover:opacity-100 transition-opacity whitespace-nowrap cursor-default uppercase">
                {domain}
              </div>
            ))}
          </div>
          
          <div className="glass-card p-12 md:p-20 rounded-[4rem] text-left max-w-4xl mx-auto border-accent-azure/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h4 className="text-3xl font-display font-black mb-6 italic">Are You Ready?</h4>
                <p className="text-text-secondary leading-relaxed mb-8 font-medium">
                  Join the elite circle of certified professionals. Whether you are a student establishing your first milestone or a veteran verifying your career status, Mastery Pro is your ultimate partner.
                </p>
                <button 
                  onClick={() => { playClick(); setState(prev => ({...prev, hasSeenLanding: true})); }}
                  className="px-10 py-5 bg-accent-azure text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-azure-500/20"
                >
                  Enter Assessment Hub
                </button>
              </div>
              <div className="hidden md:block">
                 <div className="aspect-square bg-gradient-to-br from-accent-azure to-accent-violet rounded-[3rem] p-1 shadow-2xl">
                    <div className="w-full h-full bg-bg-dark rounded-[2.8rem] flex items-center justify-center">
                       <Award className="w-24 h-24 text-accent-azure opacity-40 animate-float" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 relative z-10 bg-bg-dark">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-accent-violet rounded-lg flex items-center justify-center font-black text-white text-xs">M</div>
                <div className="text-lg font-display font-extrabold tracking-tight">Mastery<span className="text-accent-violet">Pro</span></div>
              </div>
              <p className="text-sm text-text-secondary max-w-sm font-medium">
                Standardizing global competency assessments through cryptographically secure auditing and proctoring.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5">
            <div className="text-[0.65rem] font-bold text-text-secondary uppercase tracking-[0.4em]">© 2026 Mastery Pro Series | Global Standards GS-v4</div>
            <div className="flex gap-8">
              {['Twitter', 'LinkedIn', 'Status'].map(item => (
                <span key={item} className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (publicCert) return <PublicVerificationView />;
  if (isDisqualified) return <DisqualifiedView />;
  if (!state.hasSeenLanding) return <LandingPageView />;

  if (!state.user) {
    return (
      <div className="min-h-screen bg-bg-main text-text-primary flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-blue/10 via-transparent to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl glass-card p-12 relative overflow-hidden"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-accent-blue mx-auto rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-accent-blue/30 rotate-3">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-display font-black tracking-tighter mb-4 italic uppercase">Mastery Pro Access</h2>
            <p className="text-sm font-medium text-text-secondary opacity-70 uppercase tracking-widest">{authMode === 'login' ? 'Institutional Identity Verification' : 'Protocol Registration Interface'}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {authMode === 'register' && (
              <div className="space-y-2">
                <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Legal Full Identity</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    required
                    className="w-full bg-bg-main border border-border-subtle rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:border-accent-blue transition-all outline-none"
                    placeholder="Enter full legal name..."
                    value={regData.fullName}
                    onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Registry Endpoint (Email)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  required
                  className="w-full bg-bg-main border border-border-subtle rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:border-accent-blue transition-all outline-none"
                  placeholder="name@organization.com"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Authorization Token</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  required
                  className="w-full bg-bg-main border border-border-subtle rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:border-accent-blue transition-all outline-none"
                  placeholder="••••••••"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-accent-blue text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-accent-hover transition-all disabled:opacity-50 enterprise-shadow mt-4"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AUTHENTICATING...
                </div>
              ) : (
                <>{authMode === 'login' ? 'Establish Session' : 'Create Credentials'}</>
              )}
            </button>
          </form>

          <button
            onClick={() => { playClick(); setAuthMode(authMode === 'login' ? 'register' : 'login'); }}
            className="w-full text-center mt-8 text-xs font-bold text-text-secondary hover:text-accent-blue transition-colors uppercase tracking-widest"
          >
            {authMode === 'login' ? "Registry Required? Create Account" : "Registered? Establish Session"}
          </button>
        </motion.div>
      </div>
    );
  }

  if (state.viewingAdmin && state.user.isAdmin) {
    return (
      <div className="min-h-screen bg-bg-dark text-text-primary p-6 md:p-12 font-sans overflow-x-hidden selection:bg-accent-violet selection:text-white">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b border-white/5 pb-12 gap-8">
            <div>
              <h1 className="text-4xl font-display font-black tracking-tighter flex items-center gap-6 italic uppercase">
                <LayoutDashboard className="text-accent-violet text-5xl" /> 
                Executive Hub
              </h1>
              <p className="text-[0.65rem] text-text-secondary font-bold uppercase tracking-[0.25em] mt-3 opacity-60">Strategic oversight and global competency intelligence</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={exportToExcel} className="px-6 py-3 bg-accent-emerald/5 border border-accent-emerald/20 text-accent-emerald hover:bg-accent-emerald hover:text-black rounded-2xl text-[0.65rem] font-bold uppercase tracking-widest transition-all flex items-center gap-3"><Table className="w-4 h-4" /> Export Ledger</button>
              <button onClick={exportToPDF} className="px-6 py-3 bg-accent-rose/5 border border-accent-rose/20 text-accent-rose hover:bg-accent-rose hover:text-black rounded-2xl text-[0.65rem] font-bold uppercase tracking-widest transition-all flex items-center gap-3"><FileText className="w-4 h-4" /> Secure PDF</button>
              <button onClick={() => setState(prev => ({...prev, viewingAdmin: false}))} className="px-10 py-3 glass-card border border-white/10 hover:bg-white/10 rounded-2xl text-[0.65rem] font-bold uppercase tracking-widest transition-all flex items-center gap-3">Exit Hub <X className="w-4 h-4" /></button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="glass-card border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
              <div className="relative z-10">
                <div className="text-text-secondary text-[0.65rem] font-bold uppercase tracking-widest mb-3 opacity-50">Verified Candidates</div>
                <div className="text-5xl font-display font-black tracking-tighter">{adminData.users.length}</div>
              </div>
              <UsersIcon className="w-24 h-24 text-white/[0.02] absolute -bottom-6 -right-6 group-hover:scale-110 transition-transform" />
            </div>
            <div className="glass-card border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
              <div className="relative z-10">
                <div className="text-text-secondary text-[0.65rem] font-bold uppercase tracking-widest mb-3 opacity-50">Global Syncs</div>
                <div className="text-5xl font-display font-black tracking-tighter">{adminData.sessions.length}</div>
              </div>
              <BarChart3 className="w-24 h-24 text-white/[0.02] absolute -bottom-6 -right-6 group-hover:scale-110 transition-transform" />
            </div>
            <div className="glass-card border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group flex flex-col justify-between">
              <div className="relative z-10">
                <div className="text-text-secondary text-[0.65rem] font-bold uppercase tracking-widest mb-3 opacity-50">Brand Authority</div>
                {appLogo && <img src={appLogo} className="h-8 mb-6 rounded-lg shadow-lg" />}
              </div>
              <label className="cursor-pointer flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl shadow-white/5">
                <Upload className="w-4 h-4" /> Refresh Brand
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </label>
            </div>
            <div className="glass-card border border-white/5 p-8 rounded-[2.5rem] relative">
              <div className="text-text-secondary text-[0.65rem] font-bold uppercase tracking-widest mb-3 opacity-50">Node Health</div>
              <div className="text-xs font-bold text-accent-emerald flex items-center gap-3 mt-1">
                <div className="w-2.5 h-2.5 bg-accent-emerald rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                OPERATIONAL
              </div>
              <div className="mt-8 text-[0.6rem] text-text-secondary leading-relaxed uppercase font-bold opacity-40">Load: 0.12% • Region: Global NW</div>
            </div>
          </div>

          <div className="glass-card border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
             <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center bg-white/[0.01] gap-6">
                <div className="flex items-center gap-4">
                  <Table className="text-accent-violet w-5 h-5" />
                  <h3 className="font-display font-black text-xs uppercase tracking-[0.2em] italic">Talent Ledger</h3>
                </div>
                <div className="relative w-full md:w-80">
                  <input 
                    type="text" 
                    placeholder="Search by Identity..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-12 text-sm font-medium outline-none focus:border-accent-violet transition-all placeholder:text-white/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-white/[0.02] text-[0.65rem] font-bold uppercase tracking-[0.1em] text-text-secondary">
                     <th className="px-10 py-6">Member Identity</th>
                     <th className="px-10 py-6">Protocol ID (Email)</th>
                     <th className="px-10 py-6">Registry Timestamp</th>
                     <th className="px-10 py-6">Authorization</th>
                     <th className="px-10 py-6 text-right">Verification</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/[0.02] text-sm italic">
                   {adminData.users
                    .filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((u, i) => (
                      <tr key={i} className="hover:bg-accent-violet/[0.02] transition-colors">
                         <td className="px-10 py-6 font-display font-black tracking-tight text-lg">{u.fullName}</td>
                         <td className="px-10 py-6 text-text-secondary text-xs">{u.email}</td>
                         <td className="px-10 py-6 font-mono text-xs text-text-secondary opacity-50">{new Date(u.registeredAt).toLocaleString()}</td>
                         <td className="px-10 py-6">
                           <span className={`px-4 py-1.5 rounded-full text-[0.6rem] font-bold tracking-[0.1em] border ${u.isAdmin ? 'bg-accent-violet/10 border-accent-violet/30 text-accent-violet' : 'bg-white/5 border-white/10 text-text-secondary'}`}>
                             {u.isAdmin ? 'EXECUTIVE' : 'MEMBER'}
                           </span>
                         </td>
                         <td className="px-10 py-6 text-right">
                            <button 
                              onClick={() => fetchUserDetails(u)}
                              className="px-6 py-2.5 bg-white/5 hover:bg-white text-text-secondary hover:text-black rounded-xl text-[0.65rem] font-bold uppercase tracking-widest transition-all"
                            >
                              Details
                            </button>
                         </td>
                      </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>

          <AnimatePresence>
            {selectedUserForReview && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl p-6 flex items-center justify-center">
                <div className="max-w-2xl w-full bg-card-dark border border-white/10 rounded-[3rem] p-10 relative overflow-hidden">
                   <button onClick={() => setSelectedUserForReview(null)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
                   
                   <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-8">
                      <div className="w-20 h-20 bg-accent-emerald/10 rounded-3xl flex items-center justify-center text-accent-emerald text-3xl font-black">{selectedUserForReview.fullName[0]}</div>
                      <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic">{selectedUserForReview.fullName}</h2>
                        <p className="text-[0.6rem] text-text-secondary font-black uppercase tracking-widest mt-1">{selectedUserForReview.email}</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h3 className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-accent-emerald">Verified Cloud Credentials</h3>
                      
                      {isVerifying ? (
                        <div className="py-12 flex justify-center"><div className="w-8 h-8 border-2 border-accent-emerald border-t-transparent rounded-full animate-spin" /></div>
                      ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                           {userCerts.length === 0 ? (
                             <div className="py-8 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                               <p className="text-[0.6rem] font-black uppercase tracking-widest text-text-secondary">No certifications found for this core</p>
                             </div>
                           ) : (
                             userCerts.map((cert, idx) => (
                               <div key={idx} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex items-center justify-between">
                                  <div className="flex-1 mr-4">
                                    <div className="text-[0.65rem] font-black uppercase tracking-widest flex items-center gap-2">
                                       {cert.courseTitle || 'Legacy'} • {cert.level} Protocol Success
                                    </div>
                                    <div className="text-[0.55rem] text-text-secondary font-bold uppercase tracking-widest mt-1">{cert.score}/{cert.total} Points • {cert.dateString.split(' ').slice(0,4).join(' ')}</div>
                                  </div>
                                  <div className="flex gap-2">
                                     <button onClick={() => window.open(`${window.location.origin}${window.location.pathname}?verify=${cert.id}`, '_blank')} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"><ExternalLink className="w-3.5 h-3.5" /></button>
                                  </div>
                               </div>
                             ))
                           )}
                        </div>
                      )}

                      <div className="pt-6 border-t border-white/5 flex gap-4">
                         <button 
                           onClick={() => generateVerificationEmail(selectedUserForReview, userCerts)}
                           className="flex-1 py-4 bg-accent-emerald text-black rounded-xl font-black text-[0.6rem] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                         >
                           <Mail className="w-3.5 h-3.5" /> Forward Verification Packet
                         </button>
                         <button 
                           onClick={() => setSelectedUserForReview(null)}
                           className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[0.6rem] uppercase tracking-widest hover:bg-white/10 transition-all"
                         >
                           Close
                         </button>
                      </div>
                   </div>

                   <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent-emerald/5 blur-[80px] rounded-full pointer-events-none" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-card-dark border border-border-dark rounded-[2rem] overflow-hidden">
                <div className="p-8 border-b border-border-dark">
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3"><FileText className="text-accent-emerald w-4 h-4" /> Activity Feed</h3>
                </div>
                <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {adminData.sessions.map((s, i) => {
                    const u = adminData.users.find(usr => usr.uid === s.userId);
                    const acc = Math.round((s.score / s.totalQuestions) * 100);
                    return (
                      <div key={i} className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl flex items-center justify-between hover:border-accent-emerald/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs border ${acc >= 80 ? 'bg-accent-emerald/10 border-accent-emerald text-accent-emerald' : 'bg-orange-500/10 border-orange-500 text-orange-500'}`}>{acc}%</div>
                          <div>
                            <div className="font-black text-xs uppercase tracking-widest">{u?.fullName || "Unverified Dev"}</div>
                            <div className="text-[0.6rem] text-text-secondary font-bold uppercase tracking-widest mt-1">{(s.courseTitle || 'HTML').toUpperCase()} • {s.level} Tier • {s.score}/{s.totalQuestions} Points</div>
                          </div>
                        </div>
                        <div className="text-right text-[0.55rem] font-mono text-text-secondary uppercase">
                          {s.timestamp?.toDate ? s.timestamp.toDate().toLocaleTimeString() : "Recent"}
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
             
             <div className="bg-card-dark border border-border-dark rounded-[2rem] p-10 flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-24 h-24 bg-accent-emerald/10 rounded-full flex items-center justify-center"><Download className="text-accent-emerald w-10 h-10" /></div>
                <div>
                  <h3 className="text-xl font-black tracking-tight mb-2 uppercase">Bulk Diagnostic Download</h3>
                  <p className="text-xs text-text-secondary max-w-xs uppercase leading-relaxed font-bold tracking-widest">Generate comprehensive data packages for offline analysis and auditing processes.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  <button onClick={exportToExcel} className="p-6 bg-white/5 border border-border-dark hover:border-emerald-500 transition-all rounded-3xl flex flex-col items-center gap-3 group">
                    <Table className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[0.6rem] font-black uppercase tracking-widest">Excel / CSV</span>
                  </button>
                  <button onClick={exportToPDF} className="p-6 bg-white/5 border border-border-dark hover:border-red-500 transition-all rounded-3xl flex flex-col items-center gap-3 group">
                    <FileText className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[0.6rem] font-black uppercase tracking-widest">PDF Report</span>
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (!state.currentLevel) {
    return (
      <div className="min-h-screen bg-bg-dark text-text-primary font-sans overflow-x-hidden selection:bg-accent-violet selection:text-white">
        <Navbar />
        
        {isProcessingPayment && (
          <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-3xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-accent-violet border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-[0_0_80px_rgba(139,92,246,0.2)]" />
              <h2 className="text-3xl font-display font-black uppercase tracking-tighter">Securing Gateway</h2>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-3 italic">
                 <ShieldCheck className="w-4 h-4 text-accent-violet" /> 
                 Institutional Encryption Active
              </p>
            </div>
          </div>
        )}

        <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-20"
          >
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-[0.6rem] font-bold text-text-secondary mb-4 border border-white/5">
                Institutional ID: {state.user.email}
              </div>
              <h2 className="text-5xl md:text-6xl font-display font-black tracking-tighter italic leading-[0.9] uppercase">
                Assessment <br />
                <span className="text-gradient-azure">Laboratories.</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setViewingHistory(true)}
                className="px-8 py-4 glass-card rounded-2xl font-bold text-[0.65rem] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
              >
                <Award className="w-4 h-4 text-accent-rose" /> Verification cloud
              </button>
              {state.user?.isAdmin && (
                 <button 
                   onClick={() => { setState(prev => ({...prev, viewingAdmin: true})); fetchAdminData(); }}
                   className="px-8 py-4 bg-accent-violet text-white rounded-2xl font-bold text-[0.65rem] uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-3 shadow-xl shadow-violet-500/20"
                 >
                   <ShieldCheck className="w-4 h-4" /> Global Control
                 </button>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {notification && (
              <motion.div initial={{ opacity: 0, y: -50, scale: 0.9 }} animate={{ opacity: 1, y: 30, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed top-0 left-1/2 -translate-x-1/2 z-[300] w-full max-w-sm px-6">
                <div className={`flex items-center gap-4 p-5 rounded-3xl border shadow-2xl backdrop-blur-3xl ${notification.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald'}`}>
                   {notification.type === 'error' ? <AlertTriangle className="w-6 h-6 shrink-0" /> : <CheckCircle2 className="w-6 h-6 shrink-0" />}
                   <div className="flex-1">
                     <p className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50">{notification.type === 'error' ? 'System Warning' : 'Success Protocol'}</p>
                     <p className="text-xs font-bold leading-relaxed">{notification.message}</p>
                   </div>
                   <button onClick={() => setNotification(null)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!state.currentCourseId ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.values(courses).map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => { playClick(); handleSelectCourse(course.id); }}
                  className="glass-card p-10 cursor-pointer group hover:bg-white/[0.02]"
                >
                  <div className="w-16 h-16 bg-bg-main border border-border-subtle rounded-2xl flex items-center justify-center mb-8 group-hover:border-accent-blue/40 transition-colors shadow-sm">
                    {course.icon === 'Layout' && <Layout className="w-8 h-8 text-accent-blue" />}
                    {course.icon === 'Palette' && <Palette className="w-8 h-8 text-accent-blue" />}
                    {course.icon === 'Code2' && <Code2 className="w-8 h-8 text-accent-blue" />}
                    {course.icon === 'Terminal' && <Terminal className="w-8 h-8 text-accent-blue" />}
                  </div>
                  <h3 className="text-2xl font-display font-black tracking-tighter mb-4 italic uppercase">{course.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-10 opacity-70">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-3 text-accent-blue text-[0.65rem] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    Enter Certification Tier <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => { playClick(); setState(prev => ({...prev, currentCourseId: null})); }}
                  className="p-4 glass-card rounded-2xl hover:bg-white/10 transition-all border border-border-subtle"
                >
                  <ChevronLeft className="w-5 h-5 text-accent-blue" />
                </button>
                <div>
                  <h3 className="text-3xl font-display font-black tracking-tighter uppercase italic">{currentCourse?.title} Hub</h3>
                  <p className="text-xs text-text-secondary font-bold uppercase tracking-widest opacity-50 mt-1">Select an assessment tier to begin global verification</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(['beginner', 'intermediate', 'advanced'] as Level[]).map((level, i) => {
                  const levelInfo = courses[state.currentCourseId!].levels[level];
                  const isPaid = level === 'advanced';
                  const purchaseId = `${state.currentCourseId}_${level}`;
                  const isPurchased = state.user?.purchasedLevels?.includes(purchaseId) || state.user?.isAdmin;
                  
                  return (
                    <motion.div
                      key={level}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -5 }}
                      onClick={() => handleSelectLevel(level)}
                      className="glass-card p-10 cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-10">
                          <div className="w-14 h-14 bg-bg-main border border-border-subtle rounded-2xl flex items-center justify-center group-hover:border-accent-blue/40 transition-colors">
                            {i === 0 ? <BookOpen className="w-6 h-6 text-accent-blue" /> : i === 1 ? <Target className="w-6 h-6 text-accent-blue" /> : <Award className="w-6 h-6 text-accent-blue" />}
                          </div>
                          {isPaid && !isPurchased && (
                            <span className="px-3 py-1 bg-accent-amber/10 border border-accent-amber/30 text-accent-amber text-[0.6rem] font-black uppercase tracking-widest">PRO TIER</span>
                          )}
                        </div>
                        <h4 className="text-2xl font-display font-black italic tracking-tighter uppercase mb-4">{levelInfo.title}</h4>
                        <p className="text-sm text-text-secondary opacity-70 leading-relaxed uppercase tracking-wide mb-12">{levelInfo.description}</p>
                      </div>
                      <button className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isPaid && !isPurchased ? 'bg-accent-amber text-white' : 'bg-accent-blue text-white'}`}>
                        {isPaid && !isPurchased ? 'Unlock Tier ($1)' : 'Initialize'}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  if (state.showMilestone) {
    const currentProgress = Math.round((state.score / state.currentQuestionIndex) * 100);
    return (
      <div className="min-h-screen bg-bg-main text-text-primary p-6 flex items-center justify-center font-sans selection:bg-accent-blue selection:text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="max-w-xl w-full glass-card rounded-[3rem] p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
             <Trophy className="w-32 h-32 text-accent-blue" />
          </div>
          <div className="mb-12 relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-accent-blue/20 blur-3xl rounded-full" />
            <Trophy className="w-24 h-24 text-accent-blue relative z-10" />
          </div>
          <h2 className="text-4xl font-display font-black tracking-tighter mb-4 italic uppercase">Competency Verified</h2>
          <p className="text-sm font-black text-text-secondary tracking-[0.2em] mb-12 border-y border-border-subtle py-5 inline-block px-10 uppercase">
             Tier: {state.currentLevel} | Node Accuracy: {currentProgress}%
          </p>
          <p className="text-sm text-text-secondary leading-relaxed mb-12 max-w-sm mx-auto font-medium opacity-70">
            Subject performance is within certified parameters. Your professional profile is being synchronized with the global mastery cloud ledger.
          </p>
          <button 
            onClick={() => { playClick(); handleContinue(); }} 
            className="w-full py-6 bg-accent-blue text-white rounded-2xl font-black tracking-widest hover:bg-accent-hover transition-all flex items-center justify-center gap-3 text-xs shadow-xl shadow-accent-blue/20"
          >
             INITIALIZE NEXT PHASE <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  if (state.viewingReview) {
    return (
      <div className="min-h-screen bg-bg-main text-text-primary p-6 md:p-12 font-sans selection:bg-accent-blue selection:text-white">
        <div className="max-w-4xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-accent-blue rounded-2xl flex items-center justify-center shadow-lg shadow-accent-blue/20">
                  <Eye className="w-8 h-8 text-white" />
               </div>
               <div>
                  <h2 className="text-4xl font-display font-black tracking-tighter italic uppercase">Assessment Review</h2>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1 opacity-60">Competency diagnostic feedback</p>
               </div>
            </div>
            <button 
              onClick={() => { playClick(); setState(prev => ({...prev, viewingReview: false})); }} 
              className="px-10 py-4 bg-accent-blue text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent-hover transition-all enterprise-shadow"
            >
              Back to Summary
            </button>
          </header>

          <div className="space-y-8">
            {currentLevelQuestions.map((q, idx) => {
              const userAnswer = state.answers[q.id];
              const isCorrect = userAnswer === q.answer;
              return (
                <div key={idx} className={`glass-card p-10 overflow-hidden border-l-8 ${isCorrect ? 'border-l-accent-emerald' : 'border-l-accent-rose'}`}>
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[0.65rem] font-bold text-text-muted uppercase tracking-[0.3em]">Query Sequence {idx + 1}</span>
                    <span className={`px-4 py-1.5 rounded-full text-[0.6rem] font-black uppercase tracking-widest ${isCorrect ? 'bg-accent-emerald/10 text-accent-emerald' : 'bg-accent-rose/10 text-accent-rose'}`}>
                      {isCorrect ? 'Verified Content' : 'Diagnostic Error'}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mb-10 leading-tight opacity-90">{q.question}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(q.options || {}).map(([key, val]) => {
                      const letter = ['A', 'B', 'C', 'D'][parseInt(key)];
                      const isCorrectOption = letter === q.answer;
                      const isUserOption = letter === userAnswer;
                      
                      let appearance = "bg-white/5 border-border-subtle text-text-secondary";
                      if (isCorrectOption) appearance = "bg-accent-emerald/20 border-accent-emerald/50 text-accent-emerald";
                      else if (isUserOption) appearance = "bg-accent-rose/20 border-accent-rose/50 text-accent-rose";

                      return (
                        <div key={key} className={`p-5 rounded-xl border text-sm font-medium flex items-center gap-4 transition-all ${appearance}`}>
                           <span className="text-xs font-black opacity-40">{letter}</span>
                           <span>{val}</span>
                           {isCorrectOption && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                           {isUserOption && !isCorrectOption && <XCircle className="w-4 h-4 ml-auto" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-16 flex justify-center">
             <button 
              onClick={() => { playClick(); setState(prev => ({...prev, viewingReview: false})); }} 
              className="px-12 py-5 bg-white text-black rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white/90 transition-all shadow-2xl"
            >
              Return to Session Summary
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.isFinished) {
    const totalQCount = currentLevelQuestions.length || 1;
    const percentage = Math.round((state.score / totalQCount) * 100);
    const passed = percentage >= (isStrictExam ? 90 : 80);
    const verificationUrl = `${window.location.origin}${window.location.pathname}?verify=${verificationToken}`;

    return (
      <div className="min-h-screen bg-bg-main text-text-primary px-6 p-12 flex items-center justify-center font-sans selection:bg-accent-blue selection:text-white">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full glass-card rounded-[3rem] p-16 text-center relative overflow-hidden">
          {verificationToken && passed && <div className="absolute top-0 right-0 p-10 opacity-[0.03]"><ShieldCheck className="w-48 h-48 text-accent-blue" /></div>}
          
          <div className="mb-12 relative inline-block">
            <div className={`absolute inset-0 blur-3xl rounded-full ${passed ? 'bg-accent-emerald/20' : 'bg-accent-rose/20'}`} />
            <Trophy className={`w-24 h-24 relative z-10 mx-auto ${passed ? 'text-accent-emerald' : 'text-accent-rose'}`} />
          </div>

          <p className="text-[0.6rem] font-black text-text-muted uppercase tracking-[0.4em] mb-4">Assessment Session Results</p>
          <h2 className="text-5xl md:text-6xl font-display font-black tracking-tighter mb-8 uppercase italic leading-none">{passed ? 'Qualified.' : 'Unsuccessful.'}</h2>
          
          <div className="flex justify-center items-center gap-8 mb-16 py-10 border-y border-border-subtle">
             <div className="text-center">
                <div className={`text-6xl font-display font-black tracking-tighter ${passed ? 'text-accent-emerald' : 'text-accent-rose'}`}>{percentage}%</div>
                <div className="text-[0.6rem] font-bold text-text-muted uppercase tracking-widest mt-2">Accuracy Rate</div>
             </div>
             <div className="w-px h-16 bg-border-subtle" />
             <div className="text-center">
                <div className="text-6xl font-display font-black tracking-tighter text-white">{state.score}/{totalQCount}</div>
                <div className="text-[0.6rem] font-bold text-text-muted uppercase tracking-widest mt-2">Points Awarded</div>
             </div>
          </div>

          {passed && verificationToken ? (
            <div className="space-y-6 mb-16">
               <div className="glass-card p-8 rounded-2xl border-accent-emerald/20 text-left">
                 <p className="text-sm font-medium mb-6 leading-relaxed opacity-70">Verification URL generated. This assessment success is cryptographically recorded for institutional compliance.</p>
                 <div className="flex flex-col sm:flex-row gap-3">
                   <input readOnly value={verificationUrl} className="flex-1 bg-bg-main border border-border-subtle rounded-xl px-4 font-mono text-[0.65rem] py-4 text-accent-emerald" />
                   <button onClick={() => { playClick(); copyToClipboard(verificationUrl); }} className="px-6 py-4 bg-accent-emerald text-black rounded-xl text-[0.65rem] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"><Copy className="w-4 h-4" /> Copy Access</button>
                 </div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => { playClick(); downloadCertificate(); }} className="w-full py-5 bg-accent-blue text-white rounded-xl font-black tracking-widest hover:bg-accent-hover transition-all flex items-center justify-center gap-3 text-[0.65rem] shadow-xl shadow-accent-blue/20">
                     <Download className="w-5 h-5" /> Download Asset
                  </button>
                  <button onClick={() => { playClick(); setShowPreview(true); }} className="w-full py-5 bg-white/5 border border-border-subtle text-white rounded-xl font-black tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-[0.65rem]">
                     <Eye className="w-5 h-5" /> Quick View
                  </button>
               </div>
            </div>
          ) : (
            <div className="glass-card mb-16 p-8 rounded-2xl border-accent-rose/20 text-left">
              <div className="flex items-center gap-4 mb-4 text-accent-rose">
                <AlertTriangle className="w-6 h-6" />
                <span className="font-black text-xs uppercase tracking-widest">Incomplete Verification</span>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-70 uppercase tracking-tight italic">Global standards require a minimum accuracy of 80% (90% for strict exams) to achieve professional accreditation status.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => { playClick(); setState(prev => ({...prev, viewingReview: true})); }} className="flex-1 py-5 bg-white/5 border border-border-subtle text-white rounded-xl font-black text-[0.65rem] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              <Eye className="w-4 h-4" /> Comprehensive Review
            </button>
            <button onClick={() => { playClick(); resetQuiz(); }} className="flex-1 py-5 bg-white text-black rounded-xl font-black text-[0.65rem] uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-2xl">
              <ChevronRight className="w-4 h-4" /> Return to Hub
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main text-text-primary p-6 md:p-12 font-sans selection:bg-accent-blue selection:text-white flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col flex-1">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 shrink-0">
          <div className="flex items-center gap-6">
            <div className="text-3xl font-display font-black tracking-tighter uppercase italic">
              {appLogo ? <img src={appLogo} alt="Logo" className="h-10 rounded-xl" /> : <>Mastery<span className="text-accent-blue">Pro</span></>}
            </div>
            <div className="h-8 w-px bg-border-subtle hidden md:block" />
            <div className="px-5 py-2 bg-white/5 border border-border-subtle rounded-full flex items-center gap-3">
               <div className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               <span className="text-[0.6rem] font-black uppercase tracking-widest text-text-muted">Assessment Mode Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className={`flex-1 md:flex-none flex items-center justify-between gap-6 px-10 py-4 rounded-xl border transition-all ${timeLeft < 20 ? 'bg-accent-rose/10 border-accent-rose/30 text-accent-rose' : 'bg-white/5 border-border-subtle text-white'}`}>
              <Timer className={`w-5 h-5 ${timeLeft < 20 ? 'animate-pulse' : 'opacity-40'}`} />
              <span className="text-2xl font-black font-mono tracking-tighter">{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>
            <button onClick={() => { playClick(); resetQuiz(); }} className="p-4 glass-card rounded-xl hover:bg-white/10 group transition-all">
              <LogOut className="w-6 h-6 group-hover:text-accent-rose transition-colors" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start flex-1">
          {/* Main Assessment Area */}
          <div className="lg:col-span-8 glass-card p-12 md:p-20 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none select-none">
              <div className="text-[12rem] font-display font-black italic">{state.currentQuestionIndex + 1}</div>
            </div>
            
            <div className="flex flex-col gap-4 mb-16 relative z-10">
               <div className="flex items-center gap-4">
                  <span className="px-5 py-2 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 rounded-full text-[0.65rem] font-black uppercase tracking-widest italic">
                    Node: {courses[state.currentCourseId!].title} {state.currentLevel}
                  </span>
                  {isStrictExam && (
                    <span className="px-5 py-2 bg-accent-rose/10 text-accent-rose border border-accent-rose/20 rounded-full text-[0.65rem] font-black uppercase tracking-widest italic">
                      Strict Exam Mode
                    </span>
                  )}
               </div>
               <p className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.4em]">Query Protocol Integrity Check</p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={state.currentQuestionIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="flex flex-col flex-1 relative z-10"
              >
                <h2 className="text-3xl md:text-5xl font-display font-black mb-20 leading-tight tracking-tighter uppercase italic">
                  {currentQuestion?.question}
                </h2>
                
                <div className="grid gap-4 mt-auto">
                  {currentQuestion?.options.map((option, idx) => {
                    const label = ['A', 'B', 'C', 'D'][idx];
                    const isCorrect = showFeedback === 'correct' && label === currentQuestion.answer;
                    const isWrong = showFeedback === 'wrong' && label === state.answers[currentQuestion.id];
                    
                    let behavior = "bg-white/5 border-border-subtle text-text-secondary hover:border-accent-blue/40 hover:bg-white/[0.08] hover:translate-x-2";
                    if (isCorrect) behavior = "bg-accent-emerald text-white border-accent-emerald shadow-xl scale-[1.02]";
                    else if (isWrong) behavior = "bg-accent-rose text-white border-accent-rose shadow-xl";
                    else if (showFeedback && label === currentQuestion.answer) behavior = "border-accent-emerald border-2 opacity-50";

                    return (
                      <button 
                        key={idx} 
                        onClick={() => handleAnswer(label)} 
                        disabled={!!showFeedback} 
                        className={`group relative text-left p-6 md:p-8 rounded-2xl border transition-all flex items-center justify-between ${behavior}`}
                      >
                        <div className="flex items-center gap-8">
                          <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                            showFeedback ? (isCorrect || isWrong ? 'bg-black/10' : 'bg-transparent') : 'bg-white/5 group-hover:bg-accent-blue/20'
                          }`}>
                            {label}
                          </span>
                          <span className="font-bold text-lg leading-tight">{option}</span>
                        </div>
                        {isCorrect && <CheckCircle2 className="w-6 h-6" />}
                        {isWrong && <XCircle className="w-6 h-6" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Performance & Status Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            <div className="glass-card p-12 rounded-[2.5rem]">
               <h3 className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-text-muted mb-12">Performance Analytics</h3>
               <div className="space-y-12">
                 <div>
                   <div className="flex justify-between items-end mb-4">
                     <span className="text-[0.65rem] font-bold text-text-muted uppercase">Logic Sync Rate</span>
                     <span className="text-4xl font-display font-black italic tracking-tighter text-white">
                        {Math.round((state.score / (state.currentQuestionIndex || 1)) * 100)}%
                     </span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-border-subtle p-[1px]">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(state.score / (currentLevelQuestions.length || 1)) * 100}%` }}
                        className="h-full bg-accent-blue rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                     />
                   </div>
                 </div>
                 
                 <div className="pt-10 border-t border-border-subtle grid grid-cols-2 gap-8">
                    <div>
                      <span className="text-[0.6rem] font-black uppercase tracking-widest text-text-muted mb-2 block">Verified</span>
                      <div className="text-3xl font-display font-black italic text-accent-emerald">{state.score}</div>
                    </div>
                    <div>
                      <span className="text-[0.6rem] font-black uppercase tracking-widest text-text-muted mb-2 block">Errors</span>
                      <div className="text-3xl font-display font-black italic text-accent-rose">{state.currentQuestionIndex - state.score}</div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="glass-card p-10 rounded-[2.5rem] flex-1">
               <div className="flex items-center gap-4 text-accent-amber mb-6 uppercase text-[0.65rem] font-black tracking-widest italic">
                  <Activity className="w-5 h-5 animate-pulse" /> Assessment Pulse
               </div>
               <p className="text-sm text-text-muted leading-relaxed font-medium"> Session data is being synchronized with the global certification cloud logic. Professional standards are active.</p>
            </div>
          </div>
        </div>
        
        {/* Progress Timeline */}
        <div className="mt-16 mb-8 w-full">
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-border-subtle relative">
             <motion.div 
                className="h-full bg-accent-blue" 
                initial={{ width: 0 }} 
                animate={{ width: `${((state.currentQuestionIndex + 1) / (currentLevelQuestions.length || 1)) * 100}%` }} 
                transition={{ duration: 0.5 }} 
             />
           </div>
           <div className="flex justify-between mt-4">
              <span className="text-[0.6rem] font-black uppercase tracking-widest text-text-muted opacity-40">Initialization</span>
              <span className="text-[0.6rem] font-black uppercase tracking-widest text-white italic">Node {state.currentQuestionIndex + 1} of {currentLevelQuestions.length}</span>
              <span className="text-[0.6rem] font-black uppercase tracking-widest text-text-muted opacity-40">Completion</span>
           </div>
        </div>

        {/* Certificate hidden for PDF export */}
        <div className="fixed -left-[4000px] top-0 pointer-events-none">
          {state.user && state.currentLevel && (
            <Certificate 
              user={state.user.fullName}
              level={state.currentLevel}
              topic={courses[state.currentCourseId!].title}
              score={state.score}
              total={currentLevelQuestions.length}
              date={new Date().toLocaleDateString()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
