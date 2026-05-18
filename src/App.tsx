/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  ChevronRight, 
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
           <button onClick={() => window.location.href = '/'} className="text-[0.6rem] font-black uppercase tracking-widest text-text-secondary hover:text-white transition-colors">Return to Architecture Core</button>
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

Mastery Pro Series Protocol has verified the following architectural competencies for candidate ${user.email}:

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

  const LandingPageView = () => (
    <div className="min-h-screen bg-bg-dark text-text-primary p-6 md:p-12 font-sans overflow-x-hidden">
      <div className="max-w-6xl mx-auto py-12 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-3 bg-accent-emerald/10 border border-accent-emerald/30 px-6 py-2 rounded-full mb-8">
            <div className="w-2 h-2 bg-accent-emerald rounded-full animate-ping" />
            <span className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-accent-emerald">V4.0 Architecture Protocol Active</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-[0.1em] uppercase italic mb-6">
            Mastery<span className="text-accent-emerald">Pro</span>.Series
          </h1>
          <p className="text-sm md:text-lg text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-widest">
            The world's most advanced architectural verification system for 
            high-performance domain mastery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card-dark border border-border-dark p-10 rounded-[3rem] relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20">
                <BookOpen className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-4 uppercase">Practice Engine</h3>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-widest leading-relaxed">
                Analyze thousands of curated architectural patterns. Non-destructive learning cycles for deep semantic retention.
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-400/5 blur-[50px] rounded-full" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card-dark border border-accent-emerald/30 p-10 rounded-[3rem] relative overflow-hidden ring-1 ring-accent-emerald/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-accent-emerald/10 rounded-2xl flex items-center justify-center mb-8 border border-accent-emerald/20">
                <ShieldCheck className="w-7 h-7 text-accent-emerald" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-4 uppercase">Strict Exam Mode</h3>
              <p className="text-xs text-secondary font-black uppercase tracking-widest leading-relaxed text-accent-emerald">
                High-integrity verification gate. Zero-tolerance for tab switching or security breaches. Official certification only.
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-accent-emerald/10 blur-[50px] rounded-full" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card-dark border border-border-dark p-10 rounded-[3rem] relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 border border-amber-500/20">
                <Award className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-4 uppercase">Verification Cloud</h3>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-widest leading-relaxed">
                Export high-fidelity credentials to LinkedIn. Global pulse synchronization for verified mastery benchmarks.
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-amber-400/5 blur-[50px] rounded-full" />
          </motion.div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 md:p-20 relative overflow-hidden mb-24">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 uppercase italic">Subscription Matrix</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-[0.6rem]">01</div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest text-white">Tier I & II: Open Access</p>
                      <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mt-1">Beginner and Intermediate protocols are fully authorized for all verified identities.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full bg-accent-emerald/20 flex items-center justify-center text-accent-emerald font-bold text-[0.6rem]">02</div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest text-white">Advanced Tier: Premium Authorization</p>
                      <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mt-1">Senior architectural concepts require a one-time gateway payment ($9.99) for lifetime access and certification.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-72 h-72 bg-accent-emerald rounded-full flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-accent-emerald blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="text-center">
                  <p className="text-[0.6rem] font-black tracking-[0.4em] uppercase text-black/60 mb-2">Initialize Now</p>
                  <button 
                    onClick={() => { playClick(); setState(prev => ({...prev, hasSeenLanding: true})); }}
                    className="bg-black text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[0.8rem] hover:scale-105 transition-all shadow-2xl"
                  >
                    Enter Core
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-accent-emerald/5 blur-[120px] rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-60">
           {['256-BIT ENCRYPTION', 'GDPR COMPLIANT', 'REAL-TIME SYNC', 'PCI DSS SECURE'].map((tag, i) => (
             <div key={i} className="flex items-center justify-center gap-3 bg-white/5 border border-white/5 py-4 rounded-2xl">
               <ShieldCheck className="w-4 h-4 text-accent-emerald" />
               <span className="text-[0.6rem] font-black uppercase tracking-[0.2em]">{tag}</span>
             </div>
           ))}
        </div>
      </div>
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
      <div className="min-h-screen bg-bg-dark text-text-primary p-6 flex flex-col items-center justify-center font-sans overflow-hidden">
        <header className="mb-12 text-center">
          {appLogo ? (
            <img src={appLogo} alt="Logo" className="h-16 mx-auto mb-6 rounded-xl shadow-2xl shadow-emerald-500/10" />
          ) : (
            <div className="brand text-3xl font-black tracking-tighter mb-4">
              MASTERY<span className="text-accent-emerald">PRO</span>.SERIES
            </div>
          )}
          <p className="text-[0.6rem] text-text-secondary uppercase tracking-[0.2em] font-black border-y border-white/5 py-2 inline-block px-8">
            {authMode === 'login' ? 'Secure Credential Verification' : 'Protocol Synchronization Request'}
          </p>
        </header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-card-dark border border-border-dark p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex bg-bg-dark p-1 rounded-2xl mb-8 border border-border-dark">
            <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 rounded-xl font-black text-[0.6rem] uppercase tracking-widest transition-all ${authMode === 'login' ? 'bg-accent-emerald text-black shadow-lg shadow-emerald-500/20' : 'text-text-secondary hover:text-white'}`}>Login</button>
            <button onClick={() => setAuthMode('register')} className={`flex-1 py-3 rounded-xl font-black text-[0.6rem] uppercase tracking-widest transition-all ${authMode === 'register' ? 'bg-accent-emerald text-black shadow-lg shadow-emerald-500/20' : 'text-text-secondary hover:text-white'}`}>Register</button>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[0.6rem] font-black uppercase tracking-widest text-text-secondary px-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input required type="text" placeholder="John Doe" className="w-full bg-bg-dark border border-border-dark rounded-xl py-4 pl-12 pr-4 text-sm focus:border-accent-emerald outline-none transition-all" value={regData.fullName} onChange={e => setRegData(prev => ({ ...prev, fullName: e.target.value }))} />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
                <label className="text-[0.6rem] font-black uppercase tracking-widest text-text-secondary px-1">User ID / Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input required type="text" placeholder="name@domain.com" className="w-full bg-bg-dark border border-border-dark rounded-xl py-4 pl-12 pr-4 text-sm focus:border-accent-emerald outline-none transition-all" value={regData.email} onChange={e => setRegData(prev => ({ ...prev, email: e.target.value }))} />
                </div>
                {authMode === 'register' && (
                  <p className="text-[0.5rem] font-bold text-text-secondary/40 uppercase tracking-widest ml-1">Guideline: Standard corporate format</p>
                )}
            </div>
            <div className="space-y-1.5">
                <label className="text-[0.6rem] font-black uppercase tracking-widest text-text-secondary px-1">Access Token</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input required type="password" placeholder="••••••••" className="w-full bg-bg-dark border border-border-dark rounded-xl py-4 pl-12 pr-4 text-sm focus:border-accent-emerald outline-none transition-all" value={regData.password} onChange={e => setRegData(prev => ({ ...prev, password: e.target.value }))} />
                </div>
                {authMode === 'register' && (
                  <p className={`text-[0.5rem] font-black uppercase tracking-widest transition-colors ml-1 ${regData.password.length >= 6 ? 'text-accent-emerald' : 'text-text-secondary/40'}`}>
                    {regData.password.length >= 6 ? '🛡️ Encryption Verified' : 'Security: Minimum 6 characters'}
                  </p>
                )}
            </div>
            <button type="submit" disabled={loading} className="w-full py-5 bg-accent-emerald text-black font-black uppercase tracking-[0.2em] rounded-xl hover:opacity-90 disabled:opacity-50 transition-all mt-6 text-[0.65rem] flex items-center justify-center gap-2">
              {authMode === 'login' ? 'ESTABLISH SESSION' : 'INITIALIZE PROFILE'} <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (state.viewingAdmin && state.user.isAdmin) {
    return (
      <div className="min-h-screen bg-bg-dark text-text-primary p-6 md:p-12 font-sans overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-border-dark pb-8 gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                <LayoutDashboard className="text-accent-emerald text-4xl" /> 
                MASTER PANEL
              </h1>
              <p className="text-[0.6rem] text-text-secondary font-black uppercase tracking-[0.2em] mt-2">Executive Analytics & Data Exfiltration</p>
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
      <div className="min-h-screen bg-bg-dark text-text-primary p-6 md:p-12 font-sans overflow-x-hidden">
        {isProcessingPayment && (
          <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-accent-emerald border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.2)]" />
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Initializing Secure Gate</h2>
              <p className="text-[0.65rem] text-text-secondary font-black uppercase tracking-widest mt-3 flex items-center justify-center gap-3">
                 <ShieldCheck className="w-4 h-4 text-accent-emerald" /> 
                 Encrypted Payment Protocol Active
              </p>
            </div>
          </div>
        )}
        <div className="max-w-6xl mx-auto">
          {/* Hidden Certificate Template for Export */}
          <div className="fixed -left-[2000px] top-0 pointer-events-none">
            {state.user && state.currentLevel && (
              <Certificate 
                user={state.user.fullName}
                level={state.currentLevel}
                topic={currentCourse?.title || "Professional Architecture"}
                score={state.score}
                total={currentLevelQuestions.length}
                date={new Date().toLocaleDateString()}
              />
            )}
          </div>

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

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div className="flex items-center gap-4">
                {appLogo ? (
                  <img src={appLogo} alt="Logo" className="h-10 rounded-lg" />
                ) : (
                  <div className="brand text-2xl font-black tracking-tighter">
                    {currentCourse ? (
                      <>
                        {currentCourse.title}<span className="text-accent-emerald">.PRO</span>
                      </>
                    ) : (
                      <>
                        MASTERY<span className="text-accent-emerald">PRO</span>.SERIES
                      </>
                    )}
                  </div>
                )}
                <div className="h-4 w-px bg-border-dark hidden md:block" />
                <div className="text-[0.6rem] text-text-secondary font-black uppercase tracking-widest hidden md:block">
                  Series: <span className="text-text-primary">{currentCourse ? currentCourse.title : 'Architectural Core'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 {state.currentCourseId && (
                   <button onClick={() => setState(prev => ({...prev, currentCourseId: null}))} className="px-4 py-2.5 bg-white/5 border border-border-dark rounded-xl text-[0.6rem] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                     <ArrowLeft className="w-3 h-3" /> Change Course
                   </button>
                 )}
                 <button 
                   onClick={() => setSoundEnabled(!soundEnabled)} 
                   className={`p-2.5 rounded-xl border border-border-dark transition-all ${soundEnabled ? 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/30' : 'bg-white/5 text-text-secondary'}`}
                   title="Toggle Sound"
                 >
                   {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                 </button>

                 <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-border-dark px-4 py-2.5 rounded-xl text-[0.6rem] font-black uppercase tracking-widest text-text-secondary">
                   <Globe className="w-3 h-3 text-accent-emerald" />
                   <span className="text-text-primary">{onlineCount}</span> ONLINE
                 </div>

                 {state.user.isAdmin && (
                   <button onClick={() => { setState(prev => ({...prev, viewingAdmin: true})); fetchAdminData(); }} className="bg-white/5 border border-border-dark hover:bg-emerald-500 hover:text-black p-2.5 rounded-xl text-text-secondary transition-all" title="Admin Dashboard">
                     <LayoutDashboard className="w-5 h-5" />
                   </button>
                 )}
                 <div className="flex items-center gap-3 bg-white/5 border border-border-dark pl-2 pr-4 py-1.5 rounded-full text-[0.65rem] font-black uppercase tracking-widest text-text-secondary">
                  <div className="w-8 h-8 rounded-full bg-accent-emerald flex items-center justify-center text-black font-black">{(state.user.fullName || 'U')[0]}</div>
                  {state.user.fullName?.split(' ')[0] || 'User'}
                </div>
                <button onClick={handleLogout} className="p-2.5 hover:bg-red-500/10 rounded-xl text-text-secondary hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </header>

            <AnimatePresence>
              {viewingHistory && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl p-6 flex items-center justify-center">
                  <div className="max-w-4xl w-full bg-card-dark border border-white/10 rounded-[3rem] p-12 relative max-h-[80vh] flex flex-col">
                    <button onClick={() => setViewingHistory(false)} className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
                    <h2 className="text-3xl font-black tracking-tighter mb-2 italic">Certification History</h2>
                    <p className="text-[0.6rem] text-text-secondary font-black tracking-[0.3em] uppercase mb-10 pb-6 border-b border-white/5">Verified Credentials for {state.user.fullName}</p>
                    
                    <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                      {certHistory.length === 0 ? (
                        <div className="text-center py-20 bg-white/[0.02] rounded-[2rem] border border-white/5">
                           <Award className="w-16 h-16 text-white/5 mx-auto mb-4" />
                           <p className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary">No certifications finalized in cloud</p>
                        </div>
                      ) : (
                        certHistory.map((cert, i) => (
                          <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-accent-emerald/30 transition-all">
                             <div className="flex items-center gap-6">
                               <div className="w-12 h-12 bg-accent-emerald/10 rounded-xl flex items-center justify-center text-accent-emerald font-black text-xs border border-accent-emerald/20">{Math.round((cert.score / cert.total) * 100)}%</div>
                               <div>
                                 <div className="font-black text-sm uppercase tracking-tighter">{cert.level} Tier Certification</div>
                                 <div className="text-[0.55rem] text-text-secondary font-bold uppercase tracking-widest mt-1">Issued: {cert.dateString.split(' ').slice(0, 4).join(' ')}</div>
                               </div>
                             </div>
                             <div className="flex gap-2">
                               <button onClick={() => window.open(`${window.location.origin}${window.location.pathname}?verify=${cert.id}`, '_blank')} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors" title="Verify Online"><ExternalLink className="w-4 h-4" /></button>
                               <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?verify=${cert.id}`); notify("Verification Link Copied", "success"); }} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors" title="Copy Link"><Share2 className="w-4 h-4" /></button>
                             </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          <div className="bento-grid grid-rows-[auto_auto_auto]">
            {state.currentCourseId === null ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full">
                <div className="mb-12">
                   <h2 className="text-4xl font-black tracking-tighter uppercase italic">Select Learning Track</h2>
                   <p className="text-[0.65rem] text-text-secondary font-black uppercase tracking-widest mt-2 border-b border-white/5 pb-6">Initialize architecture protocol for specific domain mastery</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.values(courses).map((course, idx) => {
                    const Icon = ({ Layout, Palette, Code2, Terminal }[course.icon] || Code2) as any;
                    return (
                      <motion.button 
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleSelectCourse(course.id)}
                        className="group bg-card-dark border border-border-dark p-8 rounded-[3rem] text-left hover:border-accent-emerald transition-all relative overflow-hidden"
                      >
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:border-accent-emerald/30 group-hover:bg-accent-emerald/10 transition-all text-text-secondary group-hover:text-accent-emerald">
                          <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter mb-2 uppercase">{course.title}</h3>
                        <p className="text-[0.6rem] text-text-secondary font-bold uppercase tracking-widest leading-relaxed">{course.description}</p>
                        
                        <div className="mt-8 flex items-center justify-between">
                           <div className="text-[0.55rem] font-black uppercase tracking-[0.2em] px-3 py-1.5 bg-white/5 rounded-full border border-white/10">{Object.keys(course.levels).length} TIERS</div>
                           <ChevronRight className="w-6 h-6 text-text-secondary group-hover:text-accent-emerald group-hover:translate-x-1 transition-all" />
                        </div>

                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/[0.02] blur-[40px] rounded-full group-hover:bg-accent-emerald/5 transition-all" />
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-full md:col-span-2 bg-card-dark border border-border-dark p-10 rounded-[3rem] flex flex-col justify-center relative overflow-hidden">
                  <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Identity: {state.user.fullName?.split(' ')[0] || 'User'}.</h1>
                    <p className="text-text-secondary text-sm max-w-sm leading-relaxed font-medium">Continuing session across {currentCourse ? Object.values(currentCourse.levels).reduce((acc, l) => acc + l.questions.length, 0) : 0} curated questions in {currentCourse?.title}. High-precision analytics enabled.</p>
                  </div>
                  <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent-emerald/5 blur-[100px] rounded-full" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="col-span-full md:col-span-1 bg-card-dark border border-border-dark p-10 rounded-[3rem] flex flex-col justify-between">
                  <div className="text-text-secondary text-[0.55rem] font-black uppercase tracking-[0.25em] mb-4 bg-white/5 py-1.5 px-3 rounded-full w-fit">Domain Core</div>
                  <div className="text-5xl font-black tracking-tighter mb-1 uppercase">{currentCourse?.id}</div>
                  <div className="text-[0.6rem] text-accent-emerald font-black uppercase tracking-widest">Active Track</div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="col-span-full md:col-span-1 bg-card-dark border border-border-dark p-10 rounded-[3rem] flex flex-col justify-between">
                   <div className="text-text-secondary text-[0.55rem] font-black uppercase tracking-[0.25em] mb-4 bg-white/5 py-1.5 px-3 rounded-full w-fit">Tier Status</div>
                   <div className="text-xl font-black uppercase tracking-widest">{state.user.isAdmin ? 'Master Executive' : 'Apprentice'}</div>
                   <div className="h-2 w-full bg-border-dark rounded-full overflow-hidden mt-4">
                     <div className="h-full bg-accent-emerald w-1/3" />
                   </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-full bg-card-dark border border-border-dark p-10 rounded-[3rem]">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                      <h3 className="text-xl font-black tracking-tight flex items-center gap-3 uppercase italic">Assessment Tiers</h3>
                      <p className="text-[0.6rem] text-text-secondary font-black tracking-[0.2em] mt-2 uppercase">Select clearance level for {currentCourse?.title} assessment</p>
                    </div>
                    <div className="flex gap-3">
                       <button onClick={fetchCertHistory} className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl font-black text-[0.6rem] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"><History className="w-3 h-3" /> Certification History</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(Object.keys(currentCourse?.levels || {}) as Level[]).map((level, i) => {
                      const isPaid = level === 'advanced';
                      const purchaseId = `${state.currentCourseId || 'html'}_${level}`;
                      const isPurchased = state.user?.purchasedLevels?.includes(purchaseId) || state.user?.isAdmin;
                      const isLocked = isPaid && !isPurchased;

                      return (
                        <div key={level} className={`group bg-bg-dark border ${isLocked ? 'border-amber-500/20' : 'border-border-dark'} p-8 rounded-[2.5rem] hover:border-accent-emerald/40 transition-all relative overflow-hidden flex flex-col justify-between min-h-[320px]`}>
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${i === 0 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : i === 1 ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                {i === 0 ? <BookOpen className="w-6 h-6" /> : i === 1 ? <Target className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                              </div>
                              <div className="text-[0.55rem] font-black text-text-secondary uppercase tracking-[0.2em]">{currentCourse?.levels[level].questions.length} Items</div>
                            </div>

                            {isLocked && (
                               <div className="absolute top-0 right-0 flex flex-col items-end">
                                 <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full">
                                   <Lock className="w-3 h-3 text-amber-500" />
                                   <span className="text-[0.5rem] font-black text-amber-500 uppercase tracking-widest">PRO TIER</span>
                                 </div>
                                 <div className="text-[0.7rem] font-black mt-2 text-white/50 tracking-tighter uppercase">$9.99 Access</div>
                               </div>
                            )}

                            <h4 className="text-2xl font-black mb-2 uppercase tracking-tighter flex items-center gap-3">
                              {level}
                              {isPurchased && isPaid && <CheckCircle2 className="w-5 h-5 text-accent-emerald" />}
                            </h4>
                            <p className="text-[0.6rem] text-text-secondary uppercase font-bold tracking-widest leading-relaxed">
                              {currentCourse?.levels[level].description}
                            </p>
                          </div>

                          <div className="space-y-3 mt-8 relative z-10">
                            <button onClick={() => handleSelectLevel(level)} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-black text-[0.6rem] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">Practice Mode <Eye className="w-3 h-3" /></button>
                            <button 
                              onClick={() => handleSelectLevel(level, true)} 
                              className={`w-full py-4 ${isLocked ? 'bg-amber-500 text-black shadow-amber-500/10' : 'bg-accent-emerald text-black shadow-emerald-500/10'} rounded-xl font-black text-[0.6rem] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg`}
                            >
                              {isLocked ? (
                                <><Lock className="w-3 h-3" /> UNLOCK PRO SERIES</>
                              ) : (
                                <><ShieldCheck className="w-3 h-3" /> Pro Series Exam</>
                              )}
                            </button>
                          </div>

                          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/[0.02] blur-[40px] rounded-full group-hover:bg-accent-emerald/5 transition-colors" />
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="col-span-full md:col-span-1 bg-card-dark border border-border-dark p-10 rounded-[3rem] flex flex-col justify-between items-center text-center">
                  <Award className="w-12 h-12 text-accent-emerald mb-4" />
                  <h3 className="text-xl font-black uppercase tracking-tight mb-2">Credentials</h3>
                  <p className="text-[0.6rem] text-text-secondary font-bold uppercase tracking-widest leading-relaxed mb-6">Professional Certification Access</p>
                  
                  <div className="w-full space-y-3">
                     <button 
                       onClick={downloadCertificate}
                       disabled={state.score === 0} 
                       className="w-full py-4 bg-white/5 border border-border-dark hover:border-accent-emerald rounded-2xl flex items-center justify-center gap-2 transition-all group disabled:opacity-30 disabled:cursor-not-allowed"
                     >
                       <Download className="w-4 h-4 text-accent-emerald group-hover:scale-110 transition-transform" />
                       <span className="text-[0.6rem] font-black uppercase tracking-widest">GET CERTIFICATE</span>
                     </button>
                     <button 
                       onClick={shareOnLinkedIn}
                       disabled={state.score === 0}
                       className="w-full py-4 bg-white/5 border border-border-dark hover:border-blue-500 rounded-2xl flex items-center justify-center gap-2 transition-all group disabled:opacity-30 disabled:cursor-not-allowed"
                     >
                       <Linkedin className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                       <span className="text-[0.6rem] font-black uppercase tracking-widest">LINKEDIN SYNC</span>
                     </button>
                  </div>
                  
                  {!state.isFinished && state.score > 0 && (
                    <p className="mt-4 text-[0.5rem] font-black text-accent-emerald uppercase animate-pulse">Session Active</p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="col-span-full bg-card-dark border border-border-dark p-10 rounded-[3rem] overflow-hidden">
                   <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                       <Activity className="text-accent-emerald w-5 h-5" />
                       GLOBAL PULSE
                     </h3>
                     <div className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-accent-emerald flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-accent-emerald rounded-full animate-ping" />
                       LIVE SYNCHRONIZATION
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                     {liveActivity.length === 0 ? (
                       <div className="col-span-full py-8 text-center text-[0.6rem] font-black uppercase tracking-widest text-text-secondary opacity-50">Awaiting Signal...</div>
                     ) : (
                       liveActivity.map((act, i) => (
                         <div key={i} className="bg-white/5 border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-500/30 transition-all group">
                           <div className="text-[0.6rem] font-black uppercase tracking-widest mb-3 flex items-center justify-between">
                             <span className="text-accent-emerald truncate">{act.user}</span>
                             <span className="text-text-secondary opacity-40 font-mono">{act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'NOW'}</span>
                           </div>
                           <div className="text-[0.65rem] font-black uppercase tracking-tight leading-relaxed">
                             {act.type === 'level_select' && `ENGAGED ${act.level.toUpperCase()} TIER`}
                             {act.type === 'correct_answer' && `RESOLVED ${act.level.toUpperCase()} DATA`}
                             {act.type === 'completed' && `CERTIFIED: ${act.accuracy}% ACCURACY`}
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (state.showMilestone) {
    const currentProgress = Math.round((state.score / state.currentQuestionIndex) * 100);
    return (
      <div className="min-h-screen bg-bg-dark text-text-primary p-6 flex items-center justify-center font-sans uppercase">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-card-dark rounded-[3rem] border border-border-dark shadow-2xl p-12 text-center">
          <div className="mb-10 relative inline-block">
            <div className="absolute inset-0 bg-accent-emerald/20 blur-3xl rounded-full" />
            <Award className="w-24 h-24 text-accent-emerald relative z-10 mx-auto" />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-4">Milestone Reached</h2>
          <p className="text-[0.65rem] text-text-secondary font-black tracking-widest mb-10 leading-relaxed">System Verification Pending. You have processed {state.currentQuestionIndex} questions with {currentProgress}% architectural accuracy.</p>
          <button onClick={handleContinue} className="w-full py-5 bg-accent-emerald text-black rounded-2xl font-black tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3 text-xs">COMMENCE NEXT CYCLE <ChevronRight className="w-5 h-5" /></button>
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
              topic={currentCourse?.title || "Professional Architecture"}
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
    <div className="min-h-screen bg-bg-dark text-text-primary p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <header className="flex items-center justify-between mb-10">
          <div className="brand text-xl font-black tracking-tighter flex items-center gap-3 italic">
            {appLogo ? <img src={appLogo} alt="Logo" className="h-8" /> : <>MASTERY<span className="text-accent-emerald">PRO</span></>}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-[0.65rem] font-black uppercase tracking-[0.2em] bg-white/5 px-6 py-2.5 rounded-xl border border-white/5">
              <span className={`w-4 h-4 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-accent-emerald'}`}><Timer className="w-full h-full" /></span> {timeLeft}S
            </div>
            <button onClick={resetQuiz} className="text-[0.6rem] font-black uppercase tracking-widest text-text-secondary hover:text-white transition-colors border border-white/5 px-6 py-2.5 rounded-xl hover:bg-white/5">QUIT</button>
          </div>
        </header>

        <div className="bento-grid flex-1 items-stretch">
          <div className="col-span-full md:col-span-3 bg-card-dark border border-border-dark p-10 md:p-16 rounded-[3.5rem] flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <div className="text-[12rem] font-black tracking-tighter">{state.currentQuestionIndex + 1}</div>
            </div>
            <div className="flex justify-between items-center mb-10 relative z-10">
              <div className="level-tag inline-block px-4 py-2 bg-accent-emerald/10 border border-accent-emerald/30 rounded-xl text-[0.55rem] font-black uppercase tracking-[0.25em] text-accent-emerald">Tier: {state.currentLevel}</div>
              <div className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40 italic">{state.currentQuestionIndex + 1} OF {currentLevelQuestions.length}</div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={state.currentQuestionIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col flex-1 relative z-10">
                <h2 className="text-3xl md:text-5xl font-black mb-16 leading-[1.1] tracking-tighter lowercase first-letter:uppercase">{currentQuestion?.question}</h2>
                <div className="grid gap-4 mb-auto">
                  {currentQuestion?.options.map((option, idx) => {
                    const label = String.fromCharCode(65 + idx);
                    const isCorrect = showFeedback === 'correct' && label === currentQuestion.answer;
                    const isWrong = showFeedback === 'wrong' && label === state.answers[currentQuestion.id];
                    return (
                      <button key={idx} onClick={() => handleAnswer(label)} disabled={!!showFeedback} className={`group relative text-left p-6 rounded-[1.5rem] border transition-all flex items-center justify-between ${showFeedback === 'correct' && label === currentQuestion.answer ? 'bg-accent-emerald border-accent-emerald text-black shadow-xl shadow-emerald-500/20' : showFeedback === 'wrong' && label === currentQuestion.answer ? 'border-accent-emerald/50 border-2' : showFeedback === 'wrong' && label === state.answers[currentQuestion.id] ? 'bg-red-500 border-red-500 text-black shadow-xl shadow-red-500/20' : 'bg-white/[0.02] border-white/5 hover:border-accent-emerald hover:bg-emerald-500/5'}`}>
                        <div className="flex items-center gap-6"><span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${showFeedback ? 'bg-transparent' : 'bg-white/5 group-hover:bg-accent-emerald group-hover:text-black'}`}>{label}</span><span className="font-black text-sm uppercase tracking-widest">{option}</span></div>
                        {showFeedback && label === currentQuestion.answer && <CheckCircle2 className="w-6 h-6 shrink-0" />}
                        {showFeedback === 'wrong' && label === state.answers[currentQuestion.id] && <XCircle className="w-6 h-6 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="col-span-full md:col-span-1 space-y-6">
            <div className="bg-card-dark border border-border-dark p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-text-secondary mb-8 block">Live Analytics</h3>
                 <div className="space-y-10">
                   <div><div className="text-[0.55rem] font-black uppercase tracking-widest text-text-secondary mb-2">Points Accumulated</div><div className="text-4xl font-black text-emerald-500 tracking-tighter italic">{state.score * 12}</div></div>
                   <div><div className="text-[0.55rem] font-black uppercase tracking-widest text-text-secondary mb-2">Architectural Accuracy</div><div className="text-xl font-black tracking-tight">{Math.round((state.score / (state.currentQuestionIndex || 1)) * 100)}%</div><div className="h-1.5 w-full bg-white/5 rounded-full mt-4 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${(state.score / (currentLevelQuestions.length || 1)) * 100}%` }} className="h-full bg-accent-emerald" /></div></div>
                 </div>
               </div>
               <div className="absolute -left-10 -top-10 w-32 h-32 bg-accent-emerald/5 blur-[50px] rounded-full" />
            </div>
            <div className="bg-card-dark border border-border-dark p-10 rounded-[3rem] hidden md:block">
              <div className="flex items-center gap-4 text-accent-emerald mb-4 uppercase text-[0.6rem] font-black tracking-widest"><Target className="w-5 h-5 animate-pulse" /> Diagnostic Feedback</div>
              <p className="text-[0.6rem] text-text-secondary leading-relaxed font-bold uppercase tracking-widest">Architectural precision is required for full certification. All data streams are audited.</p>
            </div>
          </div>
          <div className="col-span-full bg-card-dark border border-border-dark p-8 rounded-[2.5rem]"><div className="h-2 w-full bg-white/5 rounded-full overflow-hidden"><motion.div className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" initial={{ width: 0 }} animate={{ width: `${((state.currentQuestionIndex + 1) / (currentLevelQuestions.length || 1)) * 100}%` }} transition={{ type: "spring", bounce: 0, duration: 0.5 }} /></div></div>
        </div>
      </div>
    </div>
  );
}
