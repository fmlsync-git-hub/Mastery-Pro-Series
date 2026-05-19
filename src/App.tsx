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
  Terminal
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
    <div id="certificate-template" className="w-[841.89px] h-[595.28px] bg-[#0a0a0a] text-white p-12 flex flex-col items-center justify-between border-[12px] border-double border-accent-emerald/40 relative overflow-hidden font-sans uppercase">
      {/* Decorative background elements */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-accent-emerald/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-accent-emerald/5 blur-[100px] rounded-full" />
      <div className="absolute inset-0 border border-white/5 m-4 pointer-events-none" />
      
      <div className="text-center z-10 w-full">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-0.5 bg-accent-emerald/50" />
          <Trophy className="w-12 h-12 text-accent-emerald" />
          <div className="w-12 h-0.5 bg-accent-emerald/50" />
        </div>
        <h1 className="text-xl font-black tracking-[0.5em] text-accent-emerald mb-2">Certificate of Achievement</h1>
        <p className="text-[0.6rem] font-black tracking-[0.2em] text-text-secondary">Official Mastery Pro Series Certification</p>
      </div>

      <div className="text-center z-10">
        <p className="text-[0.7rem] font-bold tracking-[0.3em] mb-4 text-text-secondary">THIS IS TO CERTIFY THAT</p>
        <h2 className="text-5xl font-black tracking-tighter text-white mb-2">{user}</h2>
        <div className="w-24 h-1 bg-accent-emerald mx-auto mb-8" />
        <p className="text-sm font-bold tracking-[0.1em] text-text-secondary leading-relaxed max-w-lg mx-auto">
          HAS SUCCESSFULLY COMPLETED THE <span className="text-white">{level.toUpperCase()}</span> TIER ASSESSMENT 
          IN <span className="text-white">{topic.toUpperCase()}</span> WITH A MERIT SCORE OF <span className="text-accent-emerald">{score}/{total}</span>
        </p>
      </div>

      <div className="w-full flex justify-between items-end z-10 px-12">
        <div className="text-left">
          <div className="w-40 h-px bg-white/20 mb-3" />
          <p className="text-[0.5rem] font-black tracking-[0.2em] text-text-secondary">DATE OF ISSUANCE</p>
          <p className="text-[0.6rem] font-mono text-accent-emerald mt-1">{date}</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 border-2 border-accent-emerald/20 rounded-full flex items-center justify-center mb-2">
            <div className="w-16 h-16 border border-accent-emerald/10 rounded-full flex items-center justify-center">
               <Trophy className="w-8 h-8 text-accent-emerald/30" />
            </div>
          </div>
          <p className="text-[0.5rem] font-black tracking-[0.2em] text-text-secondary">OFFICIAL SEAL</p>
        </div>
        <div className="text-right">
          <div className="flex justify-end gap-2 mb-3">
             <div className="w-8 h-px bg-white/20" />
             <div className="w-24 h-px bg-accent-emerald" />
          </div>
          <p className="text-[0.5rem] font-black tracking-[0.2em] text-text-secondary">SYSTEM ADMINISTRATOR</p>
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
  const [lastActivity, setLastActivity] = useState(Date.now());
  const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  // Admin Search & Verification State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserForReview, setSelectedUserForReview] = useState<UserProfile | null>(null);
  const [userCerts, setUserCerts] = useState<Certification[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  // Session Timeout Listener
  useEffect(() => {
    if (!state.user) return;

    const updateActivity = () => setLastActivity(Date.now());
    
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > TIMEOUT_DURATION) {
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
  }, [state.user, lastActivity]);

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
    <nav className="fixed top-0 left-0 right-0 z-[100] glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center h-20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent-emerald rounded-xl flex items-center justify-center font-black text-black">M</div>
        <div className="text-xl font-display font-black tracking-tighter uppercase italic">
          Mastery<span className="text-accent-emerald">Pro</span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary hover:text-white transition-colors">Enterprise</a>
        <a href="#" className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary hover:text-white transition-colors">Verification Cloud</a>
        <a href="#" className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary hover:text-white transition-colors">Academic Protocols</a>
      </div>
      <div className="flex items-center gap-4">
        {state.user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[0.6rem] font-black uppercase text-white/50">{state.user.fullName}</div>
              <div className="text-[0.5rem] font-bold text-accent-emerald uppercase tracking-widest">Verified Dev</div>
            </div>
            <button onClick={handleLogout} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={() => setAuthMode('login')} className="px-6 py-2.5 rounded-xl bg-accent-emerald text-black font-black text-[0.65rem] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20">
            Sign In
          </button>
        )}
      </div>
    </nav>
  );

  const LandingPageView = () => (
    <div className="min-h-screen bg-bg-dark text-text-primary font-sans overflow-x-hidden selection:bg-accent-emerald selection:text-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-44 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-indigo/10 blur-[120px] rounded-full -mr-96 -mt-96" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-emerald/5 blur-[100px] rounded-full -ml-44 -mb-44" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald"></span>
                </span>
                <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-white/70">Global Standards Authorization Active</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-display font-black leading-[0.9] tracking-tighter uppercase mb-8">
                Standardizing <br />
                <span className="text-gradient">Competency.</span>
              </h1>
              
              <p className="text-lg text-text-secondary font-medium leading-relaxed mb-10 max-w-lg">
                The global benchmark for professional and academic auditing. Verify your domain mastery through rigorous technical protocols recognized by industry leaders.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => { playClick(); setState(prev => ({...prev, hasSeenLanding: true})); }}
                  className="px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-white/5"
                >
                  Get Started Free
                </button>
                <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                  Watch Demo
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200" 
                  alt="High Tech Dashboard" 
                  className="w-full aspect-[4/3] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent" />
              </div>
              
              {/* Floating Stat Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 glass-panel p-6 rounded-3xl z-20 hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-emerald/20 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-accent-emerald" />
                  </div>
                  <div>
                    <div className="text-2xl font-black font-display tracking-tight leading-none">12.4k</div>
                    <div className="text-[0.6rem] font-black uppercase text-text-secondary tracking-widest mt-1">Verified Credentials</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-24 px-6 md:px-12 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-sm font-black text-accent-indigo uppercase tracking-[0.4em] mb-4">Industrial Standards</h2>
            <h3 className="text-4xl font-display font-black tracking-tighter uppercase leading-none">Designed for Global Impact</h3>
          </div>
          
          <div className="bento-grid">
            <div className="col-span-12 md:col-span-8 glass-panel p-10 rounded-[3.5rem] relative overflow-hidden group">
              <div className="relative z-10">
                <BookOpen className="w-10 h-10 text-accent-indigo mb-6" />
                <h4 className="text-3xl font-black font-display tracking-tighter uppercase mb-4">Competency Modeling</h4>
                <p className="text-sm text-text-secondary font-medium leading-relaxed max-w-md">
                   Our algorithmic assessment engine identifies granular performance gaps, ensuring 100% technical saturation before certification issuance.
                </p>
                <div className="mt-8 flex gap-4 overflow-hidden">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-2 w-12 rounded-full bg-white/5 overflow-hidden">
                      <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                        className="h-full w-full bg-accent-indigo"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent-indigo/10 blur-[80px] rounded-full group-hover:bg-accent-indigo/20 transition-colors" />
            </div>
            
            <div className="col-span-12 md:col-span-4 glass-panel p-10 rounded-[3.5rem] border-accent-emerald/30 shadow-lg shadow-emerald-500/5">
              <ShieldCheck className="w-10 h-10 text-accent-emerald mb-6" />
              <h4 className="text-3xl font-black font-display tracking-tighter uppercase mb-4">Institutional Integrity</h4>
              <p className="text-sm text-text-secondary font-medium leading-relaxed">
                 Anti-breach proctoring protocols designed for corporate and academic regulatory compliance.
              </p>
            </div>
            
            <div className="col-span-12 md:col-span-5 glass-panel p-10 rounded-[3rem]">
              <Target className="w-10 h-10 text-accent-rose mb-6" />
              <h4 className="text-3xl font-black font-display tracking-tighter uppercase mb-4">Precision Analytics</h4>
              <p className="text-sm text-text-secondary font-medium leading-relaxed">
                 Detailed performance metrics across every evaluation node.
              </p>
            </div>
            
            <div className="col-span-12 md:col-span-7 bg-accent-emerald p-10 rounded-[3rem] text-black overflow-hidden relative">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <Award className="w-12 h-12 mb-6 opacity-40" />
                  <h4 className="text-4xl font-black font-display tracking-tighter uppercase italic leading-none">Standardized <br /> Recognition</h4>
                </div>
                <p className="text-sm font-bold uppercase tracking-tight mt-10 max-w-xs">
                  Your verification is globally accessible via a unique cryptographic hash.
                </p>
              </div>
              <div className="absolute top-10 right-10 text-8xl font-display font-black opacity-10">V4</div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Partnerships */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="glass-panel p-16 rounded-[4rem] flex flex-col md:flex-row items-center gap-16 overflow-hidden relative">
            <div className="flex-1 relative z-10">
              <h3 className="text-sm font-black text-accent-indigo uppercase tracking-[0.4em] mb-6">Strategic Expansion</h3>
              <h4 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase italic leading-[0.9] mb-8">
                Institutional & <br />
                <span className="text-gradient">Professional Synergy</span>
              </h4>
              <p className="text-text-secondary font-medium leading-relaxed mb-10">
                Mastery Pro is built to interface directly with major professional entities like LinkedIn, Glassdoor, and Global Enterprise HR systems. Our long-term mission is to standardize human competency across every academic and professional domain worldwide.
              </p>
              <div className="flex flex-wrap gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                <span className="text-xl font-black italic">LINKEDIN READY</span>
                <span className="text-xl font-black italic">GLASSDOOR SYNC</span>
                <span className="text-xl font-black italic">VERIFIED HR</span>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center relative overflow-hidden">
               <Globe className="w-32 h-32 text-accent-indigo opacity-20" />
               <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/20 to-transparent" />
            </div>
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-accent-indigo/5 blur-[120px] rounded-full" />
          </div>
        </div>
      </section>

      {/* Pricing / Tiers */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase italic mb-6">Certification Tracks</h2>
            <p className="text-text-secondary max-w-2xl mx-auto uppercase tracking-widest font-black text-xs">A modular framework for global career recognition</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            <div className="glass-panel p-12 rounded-[4rem] relative group border-white/5">
              <div className="text-accent-indigo text-xs font-black tracking-[0.4em] uppercase mb-10">Access Tier 01 & 02</div>
              <h4 className="text-5xl font-display font-black tracking-tighter uppercase mb-4 italic">Foundational</h4>
              <p className="text-sm text-text-secondary font-medium mb-12">Core and Intermediate verification tracks are open for public professional development.</p>
              <ul className="space-y-4 mb-12">
                {['Public Ledger Export', 'Core Skillsets', 'Verified Profile', 'Global Benchmarking'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-xs font-black uppercase text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-accent-emerald" /> {item}
                  </li>
                ))}
              </ul>
              <div className="text-3xl font-display font-black italic">$0.00</div>
            </div>
            
            <div className="bg-white p-12 rounded-[4rem] relative group text-black shadow-[0_0_80px_rgba(255,255,255,0.1)]">
              <div className="bg-accent-rose text-white text-[0.6rem] font-black tracking-[0.4em] uppercase py-1.5 px-6 rounded-full inline-block mb-10">Professional Tier</div>
              <h4 className="text-5xl font-display font-black tracking-tighter uppercase mb-4 italic">Elite Audit</h4>
              <p className="text-sm text-black/60 font-bold uppercase tracking-tight mb-12 italic">The industry benchmark for senior professional and technical verification.</p>
              <ul className="space-y-4 mb-12">
                {['Advanced Field Auditing', 'Priority Recruitment Sync', 'Lifetime Pro Status', 'Institutional Print Ready'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-xs font-black uppercase text-black/80">
                    <CheckCircle2 className="w-4 h-4 text-accent-emerald" /> {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-end gap-3 font-display">
                <span className="text-5xl font-black italic">$9.99</span>
                <span className="text-xs font-black uppercase opacity-40 mb-2">Certification Fee</span>
              </div>
            </div>
          </div>
          
          <div className="mt-20 text-center">
            <button 
              onClick={() => { playClick(); setState(prev => ({...prev, hasSeenLanding: true})); }}
              className="px-12 py-6 bg-accent-emerald text-black rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl shadow-emerald-500/20"
            >
              Begin Verification Sequence
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming Expansion */}
      <section className="py-24 px-6 md:px-12 opacity-40">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-[0.6rem] font-black uppercase tracking-[0.5em] text-text-secondary mb-12 italic">Expansion Protocol: Scheduled Domains</div>
          <div className="flex flex-wrap justify-center gap-12">
            {['Medical Sciences', 'Aerospace Engineering', 'Legal Jurisprudence', 'Quantum Computing', 'Economic Modeling'].map(domain => (
              <div key={domain} className="text-xl font-display font-black tracking-tighter uppercase italic">{domain}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 mt-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center font-black text-black text-[0.6rem]">M</div>
              <div className="text-md font-display font-black tracking-tighter uppercase italic">MasteryPro</div>
            </div>
            <div className="text-[0.5rem] font-black uppercase tracking-[0.2em] text-text-secondary opacity-30 mt-2">
              The Global Standard for Competency Auditing
            </div>
          </div>
          <div className="flex gap-8">
            {['Privacy', 'Ethics', 'Compliance', 'Security'].map(item => (
              <a key={item} href="#" className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-colors">{item}</a>
            ))}
          </div>
          <div className="text-[0.6rem] font-black uppercase tracking-widest text-text-secondary opacity-50">
            © 2026 MASTERY PRO SERIES | GS V4.2.0-ELITE
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
      <div className="min-h-screen bg-bg-dark text-text-primary p-6 flex flex-col items-center justify-center font-sans overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-indigo/5 blur-[120px] rounded-full -mr-44 -mt-44" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-emerald/5 blur-[120px] rounded-full -ml-44 -mb-44" />

        <header className="mb-12 text-center relative z-10">
          <button 
            onClick={() => setState(prev => ({...prev, hasSeenLanding: false}))}
            className="mb-8 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all inline-flex items-center gap-2 text-[0.6rem] font-black uppercase tracking-widest group"
          >
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Matrix
          </button>

          {appLogo ? (
            <img src={appLogo} alt="Logo" className="h-20 mx-auto mb-8 rounded-[2rem] shadow-2xl shadow-emerald-500/20 grayscale hover:grayscale-0 transition-all cursor-pointer" />
          ) : (
            <div className="brand text-4xl font-display font-black tracking-tighter mb-4 uppercase italic">
              Mastery<span className="text-accent-emerald">Pro</span>
            </div>
          )}
          <p className="text-[0.65rem] text-text-secondary uppercase tracking-[0.3em] font-black border-y border-white/10 py-3 inline-block px-12">
            {authMode === 'login' ? 'Authentication Required' : 'Protocol Initialization'}
          </p>
        </header>

        <div className="w-full max-w-md relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-10 md:p-12 rounded-[3.5rem] shadow-2xl shadow-black/50 border border-white/10">
            <div className="flex bg-bg-dark p-1 rounded-2xl mb-10 border border-white/5">
              <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 rounded-xl font-black text-[0.6rem] uppercase tracking-widest transition-all ${authMode === 'login' ? 'bg-accent-emerald text-black shadow-lg shadow-emerald-500/10' : 'text-text-secondary hover:text-white'}`}>Login</button>
              <button onClick={() => setAuthMode('register')} className={`flex-1 py-3 rounded-xl font-black text-[0.6rem] uppercase tracking-widest transition-all ${authMode === 'register' ? 'bg-accent-emerald text-black shadow-lg shadow-emerald-500/10' : 'text-text-secondary hover:text-white'}`}>Register</button>
            </div>
            
            <form onSubmit={handleAuth} className="space-y-6">
              {authMode === 'register' && (
                <div className="space-y-2">
                  <label className="text-[0.6rem] font-black uppercase tracking-widest text-text-secondary px-1">Identity Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input required type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-sm focus:border-accent-emerald outline-none transition-all placeholder:opacity-30" value={regData.fullName} onChange={e => setRegData(prev => ({ ...prev, fullName: e.target.value }))} />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                  <label className="text-[0.6rem] font-black uppercase tracking-widest text-text-secondary px-1">Network Identity (Email)</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input required type="email" placeholder="name@standard.com" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-sm focus:border-accent-emerald outline-none transition-all placeholder:opacity-30" value={regData.email} onChange={e => setRegData(prev => ({ ...prev, email: e.target.value }))} />
                  </div>
              </div>
              <div className="space-y-2">
                  <label className="text-[0.6rem] font-black uppercase tracking-widest text-text-secondary px-1">Security Token</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input required type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-sm focus:border-accent-emerald outline-none transition-all placeholder:opacity-30" value={regData.password} onChange={e => setRegData(prev => ({ ...prev, password: e.target.value }))} />
                  </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-6 bg-accent-emerald text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all mt-8 text-[0.7rem] flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/10">
                {authMode === 'login' ? 'Establish Session' : 'Register Profile'} <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
          
          <div className="mt-12 flex items-center justify-center gap-10 opacity-30">
             <ShieldCheck className="w-5 h-5" />
             <div className="h-px bg-white/20 w-12" />
             <Lock className="w-5 h-5" />
             <div className="h-px bg-white/20 w-12" />
             <Target className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  }

  if (state.viewingAdmin && state.user.isAdmin) {
    return (
      <div className="min-h-screen bg-bg-dark text-text-primary p-6 md:p-12 font-sans overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-border-dark pb-8 gap-6">
            <div>
              <h1 className="text-3xl font-display font-black tracking-tighter flex items-center gap-4 italic uppercase">
                <LayoutDashboard className="text-accent-indigo text-4xl" /> 
                Executive Governance
              </h1>
              <p className="text-[0.65rem] text-text-secondary font-black uppercase tracking-[0.3em] mt-2">Administrative auditing and global metric intelligence</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={exportToExcel} className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500 hover:text-black rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all flex items-center gap-2"><Table className="w-3 h-3" /> Export Excel</button>
              <button onClick={exportToPDF} className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all flex items-center gap-2"><FileText className="w-3 h-3" /> Export PDF</button>
              <button onClick={exportToWord} className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-500 hover:bg-blue-50 hover:text-black rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all flex items-center gap-2"><FileCheck className="w-3 h-3" /> Export Word</button>
              <button onClick={() => setState(prev => ({...prev, viewingAdmin: false}))} className="px-6 py-2 bg-white/5 border border-border-dark hover:bg-white/10 rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all">Close</button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-card-dark border border-border-dark p-6 rounded-3xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="text-text-secondary text-[0.6rem] font-black uppercase tracking-widest mb-2">Total Candidates</div>
                <div className="text-5xl font-black tracking-tighter">{adminData.users.length}</div>
              </div>
              <UsersIcon className="w-20 h-20 text-white/[0.02] absolute -bottom-4 -right-4 group-hover:scale-110 transition-transform" />
            </div>
            <div className="bg-card-dark border border-border-dark p-6 rounded-3xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="text-text-secondary text-[0.6rem] font-black uppercase tracking-widest mb-2">Quiz Syncs</div>
                <div className="text-5xl font-black tracking-tighter">{adminData.sessions.length}</div>
              </div>
              <BarChart3 className="w-20 h-20 text-white/[0.02] absolute -bottom-4 -right-4 group-hover:scale-110 transition-transform" />
            </div>
            <div className="bg-card-dark border border-border-dark p-6 rounded-3xl relative overflow-hidden group flex flex-col justify-between">
              <div className="relative z-10">
                <div className="text-text-secondary text-[0.6rem] font-black uppercase tracking-widest mb-2">Logo Management</div>
                {appLogo && <img src={appLogo} className="h-8 mb-4 rounded border border-white/10" />}
              </div>
              <label className="cursor-pointer flex items-center justify-center gap-2 bg-emerald-500 text-black py-3 rounded-xl text-[0.6rem] font-black uppercase tracking-widest hover:opacity-90 transition-all">
                <Upload className="w-3 h-3" /> REFRESH BRANDING
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </label>
            </div>
            <div className="bg-card-dark border border-border-dark p-6 rounded-3xl relative">
              <div className="text-text-secondary text-[0.6rem] font-black uppercase tracking-widest mb-2">System Status</div>
              <div className="text-xs font-bold text-accent-emerald flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse" />
                ONLINE • FIREBASE V10
              </div>
              <div className="mt-4 text-[0.6rem] text-text-secondary leading-relaxed uppercase font-bold">Latency: 24ms • Storage: 0.4MB / 5GB</div>
            </div>
          </div>

          <div className="bg-card-dark border border-border-dark rounded-[2rem] overflow-hidden shadow-2xl">
             <div className="p-8 border-b border-border-dark flex flex-col md:flex-row justify-between items-start md:items-center bg-white/[0.02] gap-4">
                <div className="flex items-center gap-3">
                  <Table className="text-accent-emerald w-4 h-4" />
                  <h3 className="font-black text-xs uppercase tracking-[0.2em]">Candidate Broadsheet</h3>
                </div>
                <div className="relative w-full md:w-72">
                  <input 
                    type="text" 
                    placeholder="Search Identity..." 
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-[0.65rem] font-bold outline-none focus:border-accent-emerald/50 transition-all uppercase"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <UsersIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary" />
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-white/[0.03] text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-secondary align-middle">
                     <th className="px-8 py-5">Full Name</th>
                     <th className="px-8 py-5">Identity (Email)</th>
                     <th className="px-8 py-5">Registration Date</th>
                     <th className="px-8 py-5">Clearance Level</th>
                     <th className="px-8 py-5 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/[0.03] text-sm">
                   {adminData.users
                    .filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((u, i) => (
                      <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                         <td className="px-8 py-5 font-bold uppercase tracking-tight">{u.fullName}</td>
                         <td className="px-8 py-5 text-text-secondary text-xs">{u.email}</td>
                         <td className="px-8 py-5 font-mono text-xs text-text-secondary">{new Date(u.registeredAt).toLocaleString()}</td>
                         <td className="px-8 py-5">
                           <span className={`px-3 py-1 rounded-full text-[0.55rem] font-black tracking-[0.15em] border ${u.isAdmin ? 'bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald' : 'bg-white/5 border-white/10 text-text-secondary'}`}>
                             {u.isAdmin ? 'EXECUTIVE' : 'CANDIDATE'}
                           </span>
                         </td>
                         <td className="px-8 py-5 text-right">
                            <button 
                              onClick={() => fetchUserDetails(u)}
                              className="px-4 py-2 bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald hover:bg-accent-emerald hover:text-black rounded-lg text-[0.55rem] font-black uppercase tracking-widest transition-all"
                            >
                              Verify
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
      <div className="min-h-screen bg-bg-dark text-text-primary font-sans overflow-x-hidden selection:bg-accent-emerald selection:text-black">
        <Navbar />
        
        {isProcessingPayment && (
          <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 border-[6px] border-accent-emerald border-t-transparent rounded-full animate-spin mx-auto mb-10 shadow-[0_0_80px_rgba(0,242,164,0.3)]" />
              <h2 className="text-4xl font-display font-black uppercase tracking-tighter italic">Initializing Gateway</h2>
              <p className="text-[0.7rem] text-text-secondary font-black uppercase tracking-[0.3em] mt-4 flex items-center justify-center gap-3">
                 <ShieldCheck className="w-5 h-5 text-accent-emerald" /> 
                 End-to-End Encrypted Handshake
              </p>
            </div>
          </div>
        )}

        <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-[0.55rem] font-black uppercase tracking-widest text-text-secondary mb-4 border border-white/5">
                Session Protocol 08.2
              </div>
              <h2 className="text-5xl md:text-6xl font-display font-black tracking-tighter uppercase italic leading-none">
                Select Your <br />
                <span className="text-gradient">Verification Node</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setViewingHistory(true)}
                className="px-8 py-4 glass-panel rounded-2xl font-black text-[0.65rem] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
              >
                <Award className="w-4 h-4 text-accent-rose" /> History
              </button>
              {state.user?.isAdmin && (
                 <button 
                   onClick={() => { setState(prev => ({...prev, viewingAdmin: true})); fetchAdminData(); }}
                   className="px-8 py-4 bg-accent-indigo text-white rounded-2xl font-black text-[0.65rem] uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-3 shadow-lg shadow-indigo-500/20"
                 >
                   <ShieldCheck className="w-4 h-4" /> Management
                 </button>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {notification && (
              <motion.div initial={{ opacity: 0, y: -50, scale: 0.9 }} animate={{ opacity: 1, y: 30, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-6">
                <div className={`flex items-center gap-4 p-5 rounded-2xl border shadow-2xl backdrop-blur-xl ${notification.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                   {notification.type === 'error' ? <AlertTriangle className="w-6 h-6 shrink-0" /> : <CheckCircle2 className="w-6 h-6 shrink-0" />}
                   <div className="flex-1">
                     <p className="text-[0.6rem] font-black uppercase tracking-widest opacity-50">{notification.type === 'error' ? 'System Warning' : 'Success Protocol'}</p>
                     <p className="text-xs font-bold leading-relaxed">{notification.message}</p>
                   </div>
                   <button onClick={() => setNotification(null)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!state.currentCourseId ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {Object.entries(courses).map(([id, course], i) => (
                <motion.div 
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => { playClick(); setState(prev => ({...prev, currentCourseId: id as CourseId})); }}
                  className="group glass-panel p-10 rounded-[3.5rem] cursor-pointer hover:border-accent-emerald transition-all relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform">
                      {id === 'html' ? <FileCode2 className="w-8 h-8 text-orange-400" /> : <Layers className="w-8 h-8 text-blue-400" />}
                    </div>
                    <h3 className="text-4xl font-display font-black tracking-tighter uppercase mb-2 leading-none">{course.title}</h3>
                    <p className="text-xs text-text-secondary uppercase font-bold tracking-widest leading-relaxed mb-12">{course.description}</p>
                    <div className="flex justify-between items-center">
                       <div className="text-[0.6rem] font-black uppercase tracking-widest opacity-40">{Object.keys(course.levels).length} Performance Tiers</div>
                       <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform opacity-40" />
                    </div>
                  </div>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 blur-[60px] rounded-full group-hover:bg-accent-emerald/5 transition-colors" />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setState(prev => ({...prev, currentCourseId: null}))}
                  className="p-4 glass-panel rounded-2xl hover:bg-white/10 transition-all border border-white/5"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-3xl font-display font-black tracking-tighter uppercase italic">{currentCourse?.title} Curriculum</h3>
                  <p className="text-[0.6rem] text-text-secondary uppercase font-black tracking-widest opacity-50 mt-1">Select assessment layer to begin</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {(Object.keys(currentCourse?.levels || {}) as Level[]).map((level, i) => {
                  const isPaid = level === 'advanced';
                  const purchaseId = `${state.currentCourseId || 'html'}_${level}`;
                  const isPurchased = state.user?.purchasedLevels?.includes(purchaseId) || state.user?.isAdmin;
                  const isLocked = isPaid && !isPurchased;

                  return (
                    <motion.div 
                      key={level} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`group glass-panel p-10 rounded-[3.5rem] relative overflow-hidden flex flex-col justify-between min-h-[420px] transition-all hover:translate-y-[-5px] ${isLocked ? 'border-amber-500/20' : 'hover:border-accent-emerald/40'}`}
                    >
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${i === 0 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : i === 1 ? 'bg-accent-indigo/10 border-accent-indigo/20 text-accent-indigo' : 'bg-accent-rose/10 border-accent-rose/20 text-accent-rose'}`}>
                            {i === 0 ? <BookOpen className="w-7 h-7" /> : i === 1 ? <Target className="w-7 h-7" /> : <Award className="w-7 h-7" />}
                          </div>
                          <div className="px-3 py-1.5 bg-white/5 rounded-full text-[0.55rem] font-bold text-text-secondary uppercase tracking-widest border border-white/5">{currentCourse?.levels[level].questions.length} Protocols</div>
                        </div>

                        {isLocked && (
                           <div className="absolute top-0 right-0 flex flex-col items-end">
                             <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-full">
                               <Lock className="w-3.5 h-3.5 text-amber-500" />
                               <span className="text-[0.6rem] font-black text-amber-500 uppercase tracking-widest">PRO TIER</span>
                             </div>
                             <div className="text-[0.75rem] font-black mt-3 text-white/40 tracking-tight uppercase">$9.99 ACCESS</div>
                           </div>
                        )}

                        <h4 className="text-4xl font-display font-black mb-4 uppercase tracking-tighter flex items-center gap-4 italic shrink-0">
                          {level}
                          {isPurchased && isPaid && <CheckCircle2 className="w-6 h-6 text-accent-emerald" />}
                        </h4>
                        <p className="text-[0.7rem] text-text-secondary uppercase font-bold tracking-widest leading-relaxed">
                          {currentCourse?.levels[level].description}
                        </p>
                      </div>

                      <div className="space-y-4 mt-12 relative z-10">
                        <button onClick={() => handleSelectLevel(level)} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-[0.7rem] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">Practice Mode <Eye className="w-4 h-4" /></button>
                        <button 
                          onClick={() => handleSelectLevel(level, true)} 
                          className={`w-full py-5 ${isLocked ? 'bg-amber-500 text-black shadow-amber-500/10' : 'bg-accent-emerald text-black shadow-emerald-500/10'} rounded-2xl font-black text-[0.7rem] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg`}
                        >
                          {isLocked ? (
                            <><Lock className="w-4 h-4" /> Unlock High-Tier</>
                          ) : (
                            <><ShieldCheck className="w-4 h-4" /> Initialize Exam</>
                          )}
                        </button>
                      </div>

                      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/[0.01] blur-[60px] rounded-full group-hover:bg-accent-emerald/[0.05] transition-colors" />
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
      <div className="min-h-screen bg-bg-dark text-text-primary p-6 flex items-center justify-center font-sans uppercase selection:bg-accent-emerald selection:text-black">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl w-full glass-panel rounded-[4rem] border border-white/10 shadow-2xl p-16 text-center bg-white/[0.02]">
          <div className="mb-12 relative inline-block">
            <div className="absolute inset-0 bg-accent-emerald/20 blur-3xl rounded-full" />
            <Trophy className="w-24 h-24 text-accent-emerald relative z-10 mx-auto" />
          </div>
          <h2 className="text-4xl font-display font-black tracking-tighter mb-4 italic uppercase">Competency Verified</h2>
          <p className="text-[0.7rem] text-text-secondary font-black tracking-[0.3em] mb-12 border-y border-white/5 py-4 inline-block px-10">
             Protocol Level: {state.currentLevel} | Node Accuracy: {currentProgress}%
          </p>
          <p className="text-sm text-text-secondary leading-relaxed mb-12 max-w-sm mx-auto font-medium">
            Subject performance is within certified parameters. Your profile is being synchronized with the global professional ledger.
          </p>
          <button onClick={handleContinue} className="w-full py-6 bg-accent-emerald text-black rounded-2xl font-black tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-[0.7rem] shadow-xl shadow-emerald-500/10">
             INITIALIZE NEXT PHASE <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  if (state.viewingReview) {
    return (
      <div className="min-h-screen bg-bg-dark text-text-primary p-6 md:p-12 font-sans overflow-x-hidden uppercase">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
            <button onClick={() => setState(prev => ({ ...prev, viewingReview: false }))} className="flex items-center gap-3 text-text-secondary hover:text-white transition-colors font-black tracking-[0.2em] text-[0.6rem]"><ArrowLeft className="w-4 h-4" /> REVERT TO PERFORMANCE</button>
            <div className="text-right">
              <div className="text-2xl font-black text-accent-emerald tracking-tighter">{state.score} / {currentLevelQuestions.length}</div>
              <div className="text-[0.55rem] font-black tracking-[0.25em] text-text-secondary">VERIFIED LOAD</div>
            </div>
          </header>
          <div className="space-y-8">
            <h2 className="text-4xl font-black tracking-tighter mb-12">Diagnostic Data Flow</h2>
            {currentLevelData?.questions.map((q, idx) => {
              const userAnswer = state.answers[q.id];
              const isCorrect = userAnswer === q.answer;
              return (
                <motion.div key={q.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className={`p-8 rounded-[2.5rem] border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
                  <div className="flex items-start gap-6">
                    <div className={`mt-1 font-black text-xl italic ${isCorrect ? 'text-accent-emerald' : 'text-red-500'}`}>{String(idx + 1).padStart(2, '0')}</div>
                    <div className="flex-1">
                      <h3 className="font-black text-lg mb-6 leading-tight lowercase first-letter:uppercase tracking-tight">{q.question}</h3>
                      <div className="grid gap-3">
                        {q.options.map((opt, optIdx) => {
                          const label = String.fromCharCode(65 + optIdx);
                          const isUserSelection = userAnswer === label;
                          const isRightAnswer = q.answer === label;
                          return (
                            <div key={optIdx} className={`text-[0.65rem] font-black tracking-widest p-4 rounded-xl border flex items-center justify-between transition-all ${isRightAnswer ? 'bg-emerald-500 border-emerald-500 text-black' : isUserSelection ? 'bg-red-500 border-red-500 text-black' : 'bg-white/5 border-white/5 text-text-secondary'}`}>
                              <div className="flex items-center gap-4"><span className="opacity-50">{label}</span> {opt}</div>
                              {isRightAnswer && <CheckCircle2 className="w-4 h-4" />}
                              {!isCorrect && isUserSelection && <XCircle className="w-4 h-4" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-16 flex justify-center"><button onClick={resetQuiz} className="px-16 py-6 bg-accent-emerald text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:opacity-90 transition-all text-xs">TERMINATE SESSION</button></div>
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
      <div className="min-h-screen bg-bg-dark text-text-primary p-6 flex items-center justify-center font-sans uppercase">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl w-full bg-card-dark rounded-[3.5rem] border border-border-dark shadow-2xl p-12 text-center relative overflow-hidden">
          {verificationToken && passed && <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck className="w-32 h-32" /></div>}
          
          <div className="mb-10 relative inline-block">
            <div className={`absolute inset-0 blur-3xl rounded-full ${passed ? 'bg-accent-emerald/20' : 'bg-red-500/20'}`} />
            <Trophy className={`w-24 h-24 relative z-10 mx-auto ${passed ? 'text-accent-emerald' : 'text-red-500'}`} />
          </div>
          <h2 className="text-4xl font-black mb-2 tracking-tighter italic">Evaluation Terminates</h2>
          <p className="text-[0.65rem] text-text-secondary font-black tracking-widest mb-10 border-b border-white/5 pb-6">Final accuracy verified by Pro Series Protocol</p>
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-bg-dark border border-border-dark rounded-3xl p-8">
              <div className="text-5xl font-black text-accent-emerald mb-2 tracking-tighter">{percentage}%</div>
              <div className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-text-secondary">Precision Ratio</div>
            </div>
            <div className="bg-bg-dark border border-border-dark rounded-3xl p-8 flex flex-col justify-center">
              <div className="text-[0.6rem] font-black uppercase tracking-widest text-text-secondary mb-2">Assessment Status</div>
              <div className={`text-sm font-black tracking-widest ${passed ? 'text-accent-emerald' : 'text-red-500'}`}>
                {passed ? 'CERTIFIED' : 'CORE INCOMPLETE'}
              </div>
            </div>
          </div>

          {verificationToken && passed && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 mb-10 text-left">
               <div className="flex items-center justify-between mb-4">
                 <span className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-accent-emerald">Pro Series Credential Token</span>
                 <Lock className="w-3 h-3 text-accent-emerald/50" />
               </div>
               <code className="text-xs font-mono text-white block mb-4 bg-black/40 p-3 rounded-xl border border-white/5">{verificationToken}</code>
               <div className="flex gap-2">
                 <button onClick={() => { navigator.clipboard.writeText(verificationUrl); notify("Verification Link Copied", "success"); }} className="flex-1 py-3 bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald rounded-xl font-black text-[0.6rem] uppercase tracking-widest hover:bg-accent-emerald hover:text-black transition-all flex items-center justify-center gap-2"><Share2 className="w-3 h-3" /> Copy Verify Link</button>
                 <button onClick={shareOnLinkedIn} className="flex-1 py-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl font-black text-[0.6rem] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"><Linkedin className="w-3 h-3" /> Share Mastery</button>
               </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {passed && (
              <button 
                onClick={downloadCertificate} 
                className="w-full py-5 bg-accent-emerald text-black rounded-2xl font-black uppercase tracking-widest text-[0.6rem] hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" /> Download Official PDF
              </button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setState(prev => ({ ...prev, viewingReview: true }))} className="py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[0.6rem] hover:bg-white/10 transition-all flex items-center justify-center gap-2"><BookOpen className="w-4 h-4" /> Audit Data</button>
              <button onClick={resetQuiz} className="py-4 bg-white/5 border border-white/10 text-text-secondary hover:text-white rounded-2xl font-black uppercase tracking-widest text-[0.6rem] hover:bg-white/10 transition-all">Select Tier</button>
            </div>
          </div>
        </motion.div>

        {/* Certificate hidden for PDF export */}
        <div className="fixed -left-[2000px] top-0 pointer-events-none">
          {state.user && state.currentLevel && (
            <Certificate 
              user={state.user.fullName}
              level={state.currentLevel}
              topic={currentCourse?.title || "Professional Domain Recovery"}
              score={state.score}
              total={currentLevelQuestions.length}
              date={new Date().toLocaleDateString()}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark text-text-primary p-6 md:p-12 font-sans selection:bg-accent-emerald selection:text-black overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col flex-1">
        <header className="flex items-center justify-between mb-16 shrink-0">
          <div className="flex items-center gap-4">
            <div className="brand text-3xl font-display font-black tracking-tighter uppercase italic">
              {appLogo ? <img src={appLogo} alt="Logo" className="h-10 rounded-lg" /> : <>Mastery<span className="text-accent-emerald">Pro</span></>}
            </div>
            <div className="h-6 w-px bg-white/10 hidden md:block" />
            <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-full hidden md:flex items-center gap-3">
               <div className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse shadow-[0_0_10px_rgba(0,242,164,0.5)]" />
               <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-text-secondary">Uplink Secured: 256-BIT TLS</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-4 px-8 py-3.5 rounded-2xl border transition-all ${timeLeft < 10 ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.15)]' : 'bg-white/5 border-white/10 text-white'}`}>
              <Timer className={`w-5 h-5 ${timeLeft < 10 ? 'animate-pulse' : 'opacity-40'}`} />
              <span className="text-lg font-black font-mono tracking-tighter">{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>
            <button onClick={resetQuiz} className="p-4 glass-panel rounded-2xl hover:bg-white/10 hover:text-red-400 transition-all border border-white/5 group relative overflow-hidden">
              <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors" />
              <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform relative z-10" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start flex-1 overflow-visible">
          {/* Main Assessment Area */}
          <div className="lg:col-span-8 glass-panel p-10 md:p-20 rounded-[5rem] flex flex-col relative overflow-hidden group border border-white/10 bg-white/[0.02] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 p-20 opacity-[0.015] group-hover:opacity-[0.03] transition-opacity pointer-events-none">
              <div className="text-[20rem] font-display font-black tracking-tighter leading-none italic">{state.currentQuestionIndex + 1}</div>
            </div>
            
            <div className="flex justify-between items-center mb-20 relative z-10">
              <div className="flex items-center gap-4">
                <span className="px-6 py-2.5 bg-accent-emerald text-black rounded-full text-[0.65rem] font-black uppercase tracking-[0.4em] italic shadow-lg shadow-emerald-500/20">
                  Tier: {state.currentLevel}
                </span>
                <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[0.6rem] font-black uppercase text-text-secondary tracking-widest">
                  Assessment ID: {Math.random().toString(36).substring(7).toUpperCase()}
                </span>
              </div>
              <div className="text-[0.75rem] font-black uppercase tracking-[0.5em] text-text-secondary opacity-20 italic">
                {state.currentQuestionIndex + 1} / {currentLevelQuestions.length} PROTOCOLS
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={state.currentQuestionIndex} 
                initial={{ opacity: 0, x: 40 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -40 }} 
                className="flex flex-col flex-1 relative z-10"
              >
                <div className="text-accent-indigo text-[0.65rem] font-black tracking-[0.4em] uppercase mb-6 opacity-60">System Inquiry // {state.currentQuestionIndex + 1}</div>
                <h2 className="text-4xl md:text-6xl font-display font-black mb-24 leading-[0.95] tracking-tighter uppercase italic">
                  {currentQuestion?.question}
                </h2>
                
                <div className="grid gap-5 mt-auto">
                  {currentQuestion?.options.map((option, idx) => {
                    const label = String.fromCharCode(64 + idx + 1);
                    const isCorrect = showFeedback === 'correct' && label === currentQuestion.answer;
                    const isWrong = showFeedback === 'wrong' && label === state.answers[currentQuestion.id];
                    
                    return (
                      <button 
                        key={idx} 
                        onClick={() => handleAnswer(label)} 
                        disabled={!!showFeedback} 
                        className={`group relative text-left p-8 md:p-10 rounded-[3rem] border transition-all flex items-center justify-between ${
                          isCorrect ? 'bg-accent-emerald border-accent-emerald text-black shadow-2xl shadow-emerald-500/30 scale-[1.02]' : 
                          isWrong ? 'bg-accent-rose border-accent-rose text-white shadow-2xl shadow-rose-500/30' : 
                          showFeedback && label === currentQuestion.answer ? 'border-accent-emerald border-4' :
                          'bg-white/[0.04] border-white/5 hover:border-white/20 hover:bg-white/[0.08] hover:translate-x-2'
                        }`}
                      >
                        <div className="flex items-center gap-10">
                          <span className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
                            showFeedback ? (isCorrect || isWrong ? 'bg-black/10' : 'bg-transparent') : 'bg-white/5 group-hover:bg-white/10'
                          }`}>
                            {label}
                          </span>
                          <span className="font-display font-black text-lg md:text-2xl uppercase tracking-tighter italic">{option}</span>
                        </div>
                        {isCorrect && <CheckCircle2 className="w-8 h-8 shrink-0" />}
                        {isWrong && <XCircle className="w-8 h-8 shrink-0" />}
                        <div className="absolute inset-0 rounded-[3rem] bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Proctoring & Intelligence Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10 h-full">
            {/* AI Proctoring Mock */}
            <div className="glass-panel p-8 rounded-[4rem] bg-white/[0.02] border-white/10 overflow-hidden relative group">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-blink shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                    <span className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-white">Live AI Monitoring</span>
                  </div>
                  <div className="text-[0.5rem] font-bold text-text-secondary opacity-40 uppercase tracking-widest italic">NODE_GLOBAL_IV</div>
                </div>
                
                {/* Webcam Simulation */}
                <div className="aspect-video bg-black rounded-3xl relative overflow-hidden border border-white/10 mb-8">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <UserIcon className="w-20 h-20 text-white/5" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                       <div>
                         <div className="text-[0.4rem] font-black uppercase text-accent-emerald tracking-widest mb-1">Face Recognition: ACTIVE</div>
                         <div className="text-[0.4rem] font-black uppercase text-accent-emerald tracking-widest">Integrity: 100%</div>
                       </div>
                       <div className="space-y-1">
                          <div className="h-1 w-8 bg-accent-emerald/20 overflow-hidden rounded-full"><motion.div className="h-full bg-accent-emerald" animate={{ width: ["20%", "80%", "40%"] }} transition={{ duration: 2, repeat: Infinity }} /></div>
                          <div className="h-1 w-8 bg-accent-emerald/20 overflow-hidden rounded-full"><motion.div className="h-full bg-accent-emerald" animate={{ width: ["60%", "30%", "90%"] }} transition={{ duration: 1.5, repeat: Infinity }} /></div>
                       </div>
                    </div>
                    {/* Face Scan Mesh */}
                    <div className="absolute inset-0 border border-accent-emerald/10 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none">
                      {Array.from({ length: 36 }).map((_, i) => <div key={i} className="border-[0.5px] border-accent-emerald/10" />)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-accent-indigo opacity-60" />
                      <span className="text-[0.55rem] font-black uppercase tracking-widest text-text-secondary">Browser Lock</span>
                    </div>
                    <span className="text-[0.55rem] font-black text-accent-emerald uppercase tracking-widest italic">SECURED</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-accent-indigo opacity-60" />
                      <span className="text-[0.55rem] font-black uppercase tracking-widest text-text-secondary">Proctor Eye</span>
                    </div>
                    <span className="text-[0.55rem] font-black text-accent-emerald uppercase tracking-widest italic">MONITORING</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Node */}
            <div className="glass-panel p-10 rounded-[4rem] relative overflow-hidden bg-white/[0.02]">
               <div className="relative z-10">
                 <h3 className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-text-secondary mb-12 opacity-50 italic">Dynamic Performance Core</h3>
                 <div className="space-y-12">
                   <div>
                     <div className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-secondary mb-3">Cognitive Saturation</div>
                     <div className="text-6xl font-display font-black text-white tracking-tighter italic leading-none">
                       {Math.round((state.score / (state.currentQuestionIndex || 1)) * 100)}%
                     </div>
                     <div className="h-2.5 w-full bg-white/5 rounded-full mt-8 overflow-hidden border border-white/10 p-[2px]">
                       <motion.div 
                         initial={{ width: 0 }} 
                         animate={{ width: `${(state.score / (currentLevelQuestions.length || 1)) * 100}%` }} 
                         className="h-full bg-gradient-to-r from-accent-indigo to-accent-emerald rounded-full shadow-[0_0_30px_rgba(0,242,164,0.3)]" 
                       />
                     </div>
                   </div>
                   
                   <div className="pt-8 border-t border-white/10">
                     <div className="flex justify-between items-end">
                       <div>
                         <div className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-secondary mb-3">Global Rank Pulse</div>
                         <div className="text-4xl font-display font-black text-accent-indigo tracking-tight italic leading-none">
                           TOP 4.2% <span className="text-[0.5rem] uppercase tracking-widest pl-2 opacity-50">PERCENTILE</span>
                         </div>
                       </div>
                       <div className="flex gap-1 items-end h-10">
                          {[40, 70, 50, 90, 60, 80].map((h, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              className="w-1 bg-accent-indigo rounded-full opacity-40" 
                            />
                          ))}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
               <div className="absolute -left-10 -top-10 w-40 h-40 bg-accent-indigo/5 blur-[80px] rounded-full" />
            </div>

            <div className="glass-panel p-10 rounded-[4rem] bg-white/[0.02] flex flex-col justify-between flex-1 border-white/5 group">
              <div className="relative z-10">
                <div className="flex items-center gap-4 text-accent-rose mb-8 uppercase text-[0.65rem] font-black tracking-widest italic font-display">
                  <Activity className="w-5 h-5 animate-pulse" /> Diagnostic Protocol
                </div>
                <p className="text-[0.7rem] text-text-secondary leading-relaxed font-black uppercase tracking-[0.1em] opacity-40 group-hover:opacity-100 transition-opacity">
                   Session stability verified. All competency protocols are recorded in the cryptographic ledger for institutional auditing.
                </p>
              </div>
              
              <div className="mt-12 flex justify-between items-end opacity-20 group-hover:opacity-60 transition-all">
                 <Globe className="w-12 h-12 text-white" />
                 <Target className="w-12 h-12 text-white" />
                 <ShieldCheck className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Timeline */}
        <div className="mt-12 mb-12 shrink-0">
           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
             <motion.div 
               className="h-full bg-gradient-to-r from-accent-indigo via-accent-rose to-accent-emerald" 
               initial={{ width: 0 }} 
               animate={{ width: `${((state.currentQuestionIndex + 1) / (currentLevelQuestions.length || 1)) * 100}%` }} 
               transition={{ duration: 0.8, ease: "circOut" }} 
             />
           </div>
           <div className="flex justify-between mt-4">
              <div className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-text-secondary opacity-30">Assessment Initiation</div>
              <div className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-accent-emerald italic">Node Synchronization Checkpoint</div>
              <div className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-text-secondary opacity-30">Certification Finalization</div>
           </div>
        </div>
      </div>
    </div>
  );
}
