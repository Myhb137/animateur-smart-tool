import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Music, Gamepad2, Users, Snowflake,
  Tent, Sun, Moon, Sparkles, Settings, ChevronDown, ChevronUp,
  Baby, User, UserCheck,
  Waves, Trees, Home, Mountain,
  UsersRound, Building2,
  Heart, Copy, Printer, Check,
  Smile, Drama, Loader2,
  Star, Zap, Bookmark, Trash2, Info, X,
  FileJson, BarChart3, Flame, Share2
} from 'lucide-react';
import { generateActivityContent } from './aiService';

/* ── Splash Screen Component ─────────────────────── */
function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      zIndex: 9999,
      animation: 'fadeOut 0.5s ease-in 2s forwards'
    }}>
      <style>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; visibility: hidden; }
        }
        @keyframes bounce { 
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
      <Tent size={80} color="white" style={{ animation: 'bounce 1s infinite', marginBottom: '20px' }} />
      <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '10px', fontWeight: 'bold' }}>المنشط الذكي</h1>
      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>أداة ذكية لتوليد أنشطة المخيمات الصيفية</p>
      <Loader2 size={30} color="white" style={{ marginTop: '30px', animation: 'spin 2s linear infinite' }} />
    </div>
  );
}

/* ── Info Popup Component ──────────────────────── */
function InfoPopup({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <>
      <div 
        className="modal-overlay" 
        onClick={onClose}
      />
      <div 
        className="modal-content"
        dir="rtl"
      >
        <div className="modal-header">
          <h2>🎭 كيفية الاستخدام</h2>
          <button 
            onClick={onClose}
            className="modal-close-btn"
            aria-label="إغلاق"
          >
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <h3>1️⃣ أدخل الموضوع</h3>
          <p>اكتب عنوان النشاط أو الموضوع الذي تريد توليد محتوى له (مثل: رحلة البحث عن الكنز)</p>
          
          <h3>2️⃣ اختياري: أضف وصف</h3>
          <p>أضف تفاصيل إضافية أو أهداف لتحسين نوعية المحتوى المولد</p>
          
          <h3>3️⃣ خصص الإعدادات</h3>
          <p>اختر الفئة العمرية، البيئة، حجم المجموعة، وأنواع المحتوى المطلوب</p>
          
          <h3>4️⃣ ولد الأفكار</h3>
          <p>اضغط على الزر وسيتم توليد أغانٍ وألعاب وأنشطة احترافية</p>
          
          <h3>5️⃣ احفظ المفضلة</h3>
          <p>اضغط على القلب لحفظ أفكارك المفضلة واستخدمها لاحقاً</p>
        </div>
      </div>
    </>
  );
}

/* ── Floating background icons ─────────────────────── */
const BG_ICONS = [Music, Gamepad2, Tent, Star, Waves, Trees, Sparkles, Zap, Music, Snowflake, Users, Drama];

function BgCanvas() {
  const items = Array.from({ length: 14 }, (_, i) => {
    const Icon = BG_ICONS[i % BG_ICONS.length];
    return {
      id: i,
      Icon,
      left: `${5 + (i * 7) % 90}%`,
      delay: `${(i * 1.3) % 10}s`,
      duration: `${12 + (i * 2.7) % 10}s`,
      size: 20 + (i * 4) % 16,
      startY: `${(i * 13) % 80}vh`,
      opacity: 0.12 + (i * 0.03) % 0.15,
    };
  });

  return (
    <div className="bg-canvas" aria-hidden="true">
      <div className="bg-gradient" />
      {items.map(item => (
        <div
          key={item.id}
          className="bubble-icon"
          style={{
            left: item.left,
            top: item.startY,
            animationDelay: item.delay,
            animationDuration: item.duration,
            opacity: item.opacity,
          }}
        >
          <item.Icon size={item.size} strokeWidth={1.5} />
        </div>
      ))}
    </div>
  );
}

/* ── Chip toggle helper ───────────────────────────── */
function ChipGroup({ options, selected, onToggle, color = '' }) {
  return (
    <div className="chip-group">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={`chip ${selected.includes(opt.value) ? `selected ${color}` : ''}`}
          onClick={() => onToggle(opt.value)}
        >
          {opt.Icon && <opt.Icon size={15} strokeWidth={2} />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ChipSingle({ options, selected, onSelect, color = '' }) {
  return (
    <div className="chip-group">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={`chip ${selected === opt.value ? `selected ${color}` : ''}`}
          onClick={() => onSelect(opt.value === selected ? '' : opt.value)}
        >
          {opt.Icon && <opt.Icon size={15} strokeWidth={2} />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ── Static config data ───────────────────────────── */
const TAB_CONFIG = [
  { key: 'songs',       Icon: Music,     label: 'الأغاني',      color: '#FF9F1C' },
  { key: 'games',       Icon: Gamepad2,  label: 'الألعاب',      color: '#2EC4B6' },
  { key: 'activities',  Icon: Drama,     label: 'الأنشطة',      color: '#A78BFA' },
  { key: 'plays',       Icon: Smile,     label: 'المسرحيات',    color: '#FF6B9D' },
  { key: 'icebreakers', Icon: Smile,     label: 'كسر الجليد',   color: '#FF6B6B' },
  { key: 'saved',       Icon: Bookmark,  label: 'المحفوظات',    color: '#FFD700' },
];

const AGE_OPTIONS = [
  { value: '6-9 سنوات',   label: '6–9 سنوات',   Icon: Baby },
  { value: '10-14 سنوات',  label: '10–14 سنوات',  Icon: User },
  { value: '15-18 سنوات', label: '15–18 سنوات', Icon: UserCheck },
];
const ENV_OPTIONS = [
  { value: 'شاطئ البحر',  label: 'شاطئ البحر',  Icon: Waves },
  { value: 'فضاء داخلي',  label: 'فضاء داخلي',  Icon: Home },
];
const SIZE_OPTIONS = [
  { value: 'مجموعة صغيرة (5-10)',   label: '5–10 أطفال',  Icon: Users },
  { value: 'مجموعة متوسطة (10-20)', label: '10–20 طفل',   Icon: UsersRound },
  { value: 'مجموعة كبيرة (20+)',    label: '20+ طفل',     Icon: Building2 },
];
const CONTENT_OPTIONS = [
  { value: 'songs',       label: 'أغاني',      Icon: Music },
  { value: 'games',       label: 'ألعاب',      Icon: Gamepad2 },
  { value: 'activities',  label: 'أنشطة',      Icon: Drama },
  { value: 'icebreakers', label: 'كسر الجليد', Icon: Snowflake },
];

/* ══════════════════════════════════════════════════
   Main App
   ══════════════════════════════════════════════════ */
export default function App() {
  const [showSplash, setShowSplash]   = useState(true);
  const [showInfo, setShowInfo]       = useState(false);
  const [theme, setTheme]             = useState('light');
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [configOpen, setConfigOpen]   = useState(false);

  const [ageGroups, setAgeGroups]       = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [groupSize, setGroupSize]       = useState('');

  const [isLoading, setIsLoading]   = useState(false);
  const [results, setResults]       = useState(null);
  const [activeTab, setActiveTab]   = useState('songs');
  const [copiedId, setCopiedId]     = useState(null);
  const [saved, setSaved]           = useState([]); // Array of saved items
  const [toast, setToast]           = useState('');
  const [ratings, setRatings]       = useState({}); // Item ID -> rating (1-5)
  const [favorites, setFavorites]   = useState({}); // Item ID -> boolean
  const [generationCount, setGenerationCount] = useState(0);
  const [showStats, setShowStats]   = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0); // For loading animation phases
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [toastType, setToastType] = useState('info'); // 'success', 'error', 'info'















  const resultsRef = useRef(null);

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (results && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [results]);

  // Loading phase animation
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingPhase(prev => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Show success popup after results
  useEffect(() => {
    if (results && !isLoading) {
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3500);
    }
  }, [results, isLoading]);

  // Load all data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('animateur_saved_items');
    if (stored) {
      try {
        setSaved(JSON.parse(stored));
      } catch (error) {
        console.warn('Failed to load saved items:', error);
      }
    }
    const storedRatings = localStorage.getItem('animateur_ratings');
    if (storedRatings) {
      try {
        setRatings(JSON.parse(storedRatings));
      } catch (error) {
        console.warn('Failed to load ratings:', error);
      }
    }
    const storedFavorites = localStorage.getItem('animateur_favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.warn('Failed to load favorites:', error);
      }
    }
    const count = localStorage.getItem('animateur_generation_count');
    if (count) setGenerationCount(parseInt(count, 10));
    
    // Show welcome popup if first visit (or on fresh load)
    const hasVisited = localStorage.getItem('animateur_visited');
    if (!hasVisited) {
      setShowWelcomePopup(true);
      localStorage.setItem('animateur_visited', 'true');
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('animateur_saved_items', JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem('animateur_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('animateur_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('animateur_generation_count', generationCount.toString());
  }, [generationCount]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleArr = (arr, set, val) =>
    set(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  // Loading tips that rotate
  const loadingTips = [
    '💡 اطلب أنشطة مخصصة حسب الفئة العمرية',
    '🎨 يمكنك إضافة وصف تفصيلي لتحسين النتائج',
    '⭐ لا تنسى تقييم وحفظ أفضل الأنشطة!',
    '📱 استخدم الهاتف للوصول السريع لمحفوظاتك'
  ];

  const getLoadingMessage = () => {
    const messages = [
      'جاري البحث في قاعدة الأنشطة...',
      'يتم تحليل متطلباتك...',
      'جاري إنشاء محتوى فريد...',
      'شبه تمام! ⏰'
    ];
    return messages[loadingPhase];
  };

  const handleCopy = useCallback((text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const toggleSave = useCallback((item, type) => {
    const itemId = `${type}-${item.title}-${Date.now()}`;
    const isSaved = saved.some(s => s.id === itemId);
    
    if (isSaved) {
      setSaved(saved.filter(s => s.id !== itemId));
      showToast('تم الحذف من المحفوظات', 'info');
    } else {
      setSaved([...saved, { id: itemId, type, item, savedAt: new Date().toISOString() }]);
      showToast('تم الحفظ بنجاح! ✓', 'success');
    }
  }, [saved]);

  const isSaved = (item, type) => {
    return saved.some(s => s.type === type && s.item.title === item.title);
  };

  const removeSaved = useCallback((id) => {
    setSaved(saved.filter(s => s.id !== id));
    showToast('تم الحذف من المحفوظات', 'info');
  }, [saved]);

  const showToast = (msg, type = 'info') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(''), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsLoading(true);
    setResults(null);
    try {
      const contentTypes = ['songs','games','activities','plays','icebreakers'];
      const data = await generateActivityContent(title, description, {
        ageGroups, environments, groupSize, contentTypes,
      });
      setResults(data);
      setGenerationCount(prev => prev + 1);
      const firstAvail = contentTypes.find(k => data[k]?.length > 0) || 'songs';
      setActiveTab(firstAvail);
      setTitle('');
      setDescription('');
    } catch (error) {
      showToast('حدث خطأ. تحقق من مفتاح API والاتصال بالإنترنت.', 'error');
      console.warn('Generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Rate a saved item (1-5 stars)
  const rateItem = (itemId, rating) => {
    setRatings(prev => ({
      ...prev,
      [itemId]: rating === prev[itemId] ? 0 : rating
    }));
    if (rating !== ratings[itemId]) {
      showToast(`⭐ تصنيف: ${rating} نجوم`, 'success');
    }
  };

  // Toggle favorite status
  const toggleFavorite = (itemId) => {
    setFavorites(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
    showToast(favorites[itemId] ? '💔 تم إزالة من المفضلات' : '❤️ تم إضافة للمفضلات', 'success');
  };

  // Extract difficulty from content
  const getDifficulty = (content) => {
    const easy = ['سهل', 'بسيط', 'صغار', '6-9'];
    const hard = ['صعب', 'معقد', 'متقدم', 'كبار', '15-18'];
    const lower = content.toLowerCase();
    if (hard.some(word => lower.includes(word))) return 'صعب';
    if (easy.some(word => lower.includes(word))) return 'سهل';
    return 'متوسط';
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'سهل') return '#4ADE80';
    if (difficulty === 'صعب') return '#FF4757';
    return '#FFB74D';
  };

  // Export to file
  const exportFile = () => {
    const content = saved.map(item => 
      `${item.item.title}\n${item.item.content}\n---\n`
    ).join('\n');
    const element = document.createElement('a');
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    element.download = `انشطة-${new Date().toISOString().split('T')[0]}.txt`;
    element.click();
    showToast('✓ تم تحميل الملف بنجاح', 'success');
  };

  // Share activity
  const shareActivity = (item) => {
    const text = `شارك معك: ${item.title}\n\n${item.content}`;
    navigator.clipboard.writeText(text);
    showToast('✓ تم النسخ للمشاركة', 'success');
  };

  const currentItems = results?.[activeTab] ?? [];
  const tabMeta = Object.fromEntries(TAB_CONFIG.map(t => [t.key, t]));

  return (
    <>
        <BgCanvas />
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        <InfoPopup isOpen={showInfo} onClose={() => setShowInfo(false)} />
        {/* ── Header ──────────────────────────────── */}
        <header className="header">
          <div className="header-top">
            <button
              id="stats-btn"
              style={{ position: 'relative', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setShowStats(!showStats)}
              title="الإحصائيات"
            >
              <BarChart3 size={24} />
              {generationCount > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#FF4757', color: 'white', fontSize: '0.65rem', fontWeight: '700', padding: '2px 6px', borderRadius: '10px' }}>{generationCount}</span>}
            </button>
            <button
              id="theme-toggle-btn"
              className="theme-toggle"
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              aria-label="تبديل الوضع"
              title={theme === 'light' ? 'وضع مظلم' : 'وضع فاتح'}
            >
              {theme === 'light'
                ? <Moon size={24} />
                : <Sun size={24} />
              }
            </button>
          </div>
          {showStats && (
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem',
              marginTop: '1rem',
              textAlign: 'right',
              animation: 'slideDown 0.3s ease-out'
            }}>
              <div style={{ marginBottom: '0.5rem' }}>📊 <strong>الإحصائيات</strong></div>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>🎯 إجمالي النشاطات: {generationCount}</div>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>💾 المحفوظة: {saved.length}</div>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>⭐ المقيمة: {Object.values(ratings).filter(r => r > 0).length}</div>
              <div style={{ fontSize: '0.9rem' }}>❤️ المفضلات: {Object.values(favorites).filter(f => f).length}</div>
            </div>
          )}

          <div className="header-logo" role="img" aria-label="خيمة">
            <Tent size={36} color="#fff" strokeWidth={1.8} />
          </div>
          <h1>المنشط الذكي</h1>
          <p>أداة مدعومة بالذكاء الاصطناعي لتوليد أغانٍ، ألعاب، وأنشطة لمخيماتك الصيفية!</p>
        </header>

        <main className="app" dir="rtl">
        {/* ── Input Form ──────────────────────────── */}
        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <div className="section-label">
            <Sparkles size={14} /> وصف النشاط
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="activity-title">موضوع النشاط أو اسم اللعبة </label>
                <button
                  type="button"
                  onClick={() => setShowInfo(true)}
                  className="help-btn"
                  title="كيفية الاستخدام"
                >
                  <Info size={16} /> مساعدة
                </button>
              </div>
              <input
                id="activity-title"
                type="text"
                className="form-control"
                placeholder="مثال: رحلة البحث عن الكنز، أنشودة الصباح..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="activity-desc">وصف إضافي (اختياري)</label>
              <textarea
                id="activity-desc"
                className="form-control"
                placeholder="صف الفكرة، الأهداف، أو أي تفاصيل تريدها..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Config toggle */}
            <div className="config-panel">
              <button
                type="button"
                id="config-toggle"
                className={`config-toggle-btn ${configOpen ? 'open' : ''}`}
                onClick={() => setConfigOpen(o => !o)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Settings size={16} /> خصص نشاطك (الفئة العمرية، البيئة، الحجم...)
                </span>
                {configOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {configOpen && (
                <div className="config-body">
                  <div className="config-section">
                    <h4><Baby size={15} /> الفئة العمرية</h4>
                    <ChipGroup
                      options={AGE_OPTIONS}
                      selected={ageGroups}
                      onToggle={v => toggleArr(ageGroups, setAgeGroups, v)}
                    />
                  </div>
                  <div className="config-section">
                    <h4><Waves size={15} /> بيئة المخيم</h4>
                    <ChipGroup
                      options={ENV_OPTIONS}
                      selected={environments}
                      onToggle={v => toggleArr(environments, setEnvironments, v)}
                      color="secondary"
                    />
                  </div>
                  <div className="config-section">
                    <h4><Users size={15} /> حجم المجموعة</h4>
                    <ChipSingle
                      options={SIZE_OPTIONS}
                      selected={groupSize}
                      onSelect={setGroupSize}
                      color="accent"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              id="generate-btn"
              type="submit"
              className="btn-generate"
              disabled={isLoading || !title.trim()}
            >
              {isLoading
                ? <><Loader2 size={20} className="spin" /> جاري التوليد...</>
                : <><Sparkles size={20} /> ولّد الأفكار الآن!</>
              }
            </button>
          </form>
        </div>

        {/* ── Loading Popup ─────────────────────────── */}
        {isLoading && (
          <>
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.3s ease-out'
            }} />
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'var(--surface)',
              border: '2px solid var(--primary)',
              borderRadius: '20px',
              padding: '2.5rem',
              zIndex: 1001,
              textAlign: 'center',
              maxWidth: '400px',
              animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 25px 50px rgba(255, 159, 28, 0.3)'
            }}>
              <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                @keyframes popIn {
                  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
                @keyframes pulse-scale {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.1); }
                }
                @keyframes orbit {
                  0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
                  100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
                }
              `}</style>
              
              {/* Animated icons orbit */}
              <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  animation: 'orbit 3s linear infinite'
                }}>
                  <Music size={32} color="#FF9F1C" style={{ position: 'absolute', top: '0', left: '50%', marginLeft: '-16px' }} />
                </div>
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  animation: 'orbit 3s linear infinite',
                  animationDelay: '-0.75s'
                }}>
                  <Gamepad2 size={32} color="#2EC4B6" style={{ position: 'absolute', top: '0', left: '50%', marginLeft: '-16px' }} />
                </div>
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  animation: 'orbit 3s linear infinite',
                  animationDelay: '-1.5s'
                }}>
                  <Drama size={32} color="#A78BFA" style={{ position: 'absolute', top: '0', left: '50%', marginLeft: '-16px' }} />
                </div>
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  animation: 'orbit 3s linear infinite',
                  animationDelay: '-2.25s'
                }}>
                  <Sparkles size={32} color="#FF6B6B" style={{ position: 'absolute', top: '0', left: '50%', marginLeft: '-16px' }} />
                </div>
              </div>

              <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', color: 'var(--text)' }}>
                {getLoadingMessage()}
              </h2>
              <p style={{ margin: '0 0 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                لا تقفل الصفحة... جاري العمل 🔄
              </p>

              {/* Loading bar */}
              <div style={{
                background: 'var(--border)',
                height: '6px',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  background: `linear-gradient(90deg, var(--primary), var(--secondary))`,
                  height: '100%',
                  borderRadius: '3px',
                  animation: 'progress 2s ease-in-out infinite',
                  width: '30%'
                }} />
              </div>

              {/* Rotating tip */}
              <div style={{
                background: 'rgba(255, 159, 28, 0.1)',
                border: '1px solid rgba(255, 159, 28, 0.3)',
                borderRadius: '10px',
                padding: '1rem',
                animation: 'fadeIn 0.5s ease-out'
              }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)' }}>
                  💬 {loadingTips[loadingPhase]}
                </p>
              </div>
            </div>

            <style>{`
              @keyframes progress {
                0% { width: 30%; }
                50% { width: 70%; }
                100% { width: 30%; }
              }
            `}</style>
          </>
        )}

        {/* ── Success Popup ─────────────────────────── */}
        {showSuccessPopup && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #4ADE80 0%, #22c55e 100%)',
            borderRadius: '20px',
            padding: '2rem',
            zIndex: 1002,
            textAlign: 'center',
            maxWidth: '350px',
            color: 'white',
            animation: 'popInSuccess 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: '0 25px 50px rgba(74, 222, 128, 0.4)'
          }}>
            <style>{`
              @keyframes popInSuccess {
                0% { transform: translate(-50%, -50%) scale(0.3) rotate(-20deg); opacity: 0; }
                100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
              }
              @keyframes slideOutSuccess {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.3) translateY(-50px); }
              }
            `}</style>
            <Check size={48} style={{ marginBottom: '1rem', animation: 'pulse-scale 0.6s ease-in-out' }} />
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem' }}>تم بنجاح! 🎉</h2>
            <p style={{ margin: 0, opacity: 0.95, fontSize: '0.9rem' }}>تم توليد نشاطاتك بنجاح. استمتع بالمحتوى!</p>
          </div>
        )}

        {/* ── Results ─────────────────────────────── */}
        {results && !isLoading && (
          <div className="results-wrapper" ref={resultsRef} style={{ scrollMarginTop: '20px' }}>
            <div className="results-header">
              <div className="results-title">
                <Check size={18} strokeWidth={2.5} />
                تم التوليد بنجاح! استكشف نتائجك
              </div>
              <button className="btn-print" onClick={() => window.print()}>
                <Printer size={16} /> طباعة
              </button>
            </div>

            {/* Tabs */}
            <nav className="tabs-nav" role="tablist">
              {TAB_CONFIG.map(tab => {
                const count = tab.key === 'saved' 
                  ? saved.length 
                  : results[tab.key]?.length ?? 0;
                
                return count > 0 ? (
                  <button
                    key={tab.key}
                    role="tab"
                    className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                    aria-selected={activeTab === tab.key}
                  >
                    <tab.Icon size={16} strokeWidth={2} />
                    {tab.label}
                    <span className="tab-count">{count}</span>
                  </button>
                ) : null;
              })}
            </nav>

            {/* Cards */}
            <div className="result-list">
              {activeTab === 'saved' ? (
                // Saved items view
                saved.length === 0 ? (
                  <div className="empty-state glass-card">
                    <Bookmark size={48} color="var(--text-muted)" strokeWidth={1.5} />
                    <p style={{ marginTop: '1rem' }}>لا توجد عناصر محفوظة حتى الآن</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>احفظ أغانيك وألعابك المفضلة هنا!</p>
                  </div>
                ) : (
                  <>
                    {saved.length > 0 && (
                      <button
                        onClick={exportFile}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          marginBottom: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontWeight: '600'
                        }}
                      >
                        <FileJson size={16} /> تحميل جميع الملفات
                      </button>
                    )}
                    {saved.map((savedItem, idx) => {
                      const meta = Object.fromEntries(TAB_CONFIG.map(t => [t.key, t]))[savedItem.type];
                      const difficulty = getDifficulty(savedItem.item.content);
                      const isFav = favorites[savedItem.id];
                      const itemRating = ratings[savedItem.id] || 0;
                      return (
                        <div key={savedItem.id} className="result-card" style={{ animationDelay: `${idx * 0.08}s` }}>
                          <div className="result-card-header">
                            <div className="result-card-icon" style={{ background: `${meta.color}22` }}>
                              <meta.Icon size={20} color={meta.color} strokeWidth={2} />
                            </div>
                            <div className="result-card-title">{savedItem.item.title}</div>
                            <div className="result-card-actions">
                              <button
                                className="icon-btn"
                                onClick={() => toggleFavorite(savedItem.id)}
                                title={isFav ? "إزالة من المفضلات" : "إضافة للمفضلات"}
                              >
                                <Heart size={18} fill={isFav ? '#FF4757' : 'none'} color={isFav ? '#FF4757' : 'currentColor'} strokeWidth={2} />
                              </button>
                              <button
                                className="icon-btn"
                                onClick={() => shareActivity(savedItem.item)}
                                title="مشاركة"
                              >
                                <Share2 size={18} strokeWidth={2} />
                              </button>
                              <button
                                className="icon-btn"
                                onClick={() => handleCopy(savedItem.item.content, savedItem.id)}
                                title="نسخ"
                              >
                                {copiedId === savedItem.id
                                  ? <Check size={18} color="#4ADE80" strokeWidth={2.5} />
                                  : <Copy size={18} strokeWidth={2} />
                                }
                              </button>
                              <button
                                className="icon-btn"
                                onClick={() => removeSaved(savedItem.id)}
                                title="حذف"
                              >
                                <Trash2 size={18} strokeWidth={2} color="#FF6B6B" />
                              </button>
                            </div>
                          </div>
                          <div className="result-card-body">{savedItem.item.content}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  onClick={() => rateItem(savedItem.id, star)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                                >
                                  <Star size={16} fill={star <= itemRating ? '#FFD700' : 'none'} color={star <= itemRating ? '#FFD700' : '#ccc'} />
                                </button>
                              ))}
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: getDifficultyColor(difficulty), display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Flame size={14} /> {difficulty}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(savedItem.savedAt).toLocaleDateString('ar-DZ')}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )
              ) : (
                // Results view
                currentItems.length === 0 ? (
                  <div className="empty-state glass-card">
                    <Smile size={48} color="var(--text-muted)" strokeWidth={1.5} />
                    <p style={{ marginTop: '1rem' }}>لا توجد نتائج في هذا القسم</p>
                  </div>
                ) : (
                  currentItems.map((item, idx) => {
                    const meta = tabMeta[activeTab];
                    const cardId = `${activeTab}-${idx}`;
                    return (
                      <div key={cardId} className="result-card" style={{ animationDelay: `${idx * 0.08}s` }}>
                        <div className="result-card-header">
                          <div className="result-card-icon" style={{ background: `${meta.color}22` }}>
                            <meta.Icon size={20} color={meta.color} strokeWidth={2} />
                          </div>
                          <div className="result-card-title">{item.title}</div>
                          <div className="result-card-actions">
                            <button
                              className={`icon-btn ${isSaved(item, activeTab) ? 'active' : ''}`}
                              onClick={() => toggleSave(item, activeTab)}
                              title="حفظ"
                              aria-label="إضافة للمحفوظات"
                            >
                              <Heart
                                size={18}
                                strokeWidth={2}
                                fill={isSaved(item, activeTab) ? '#FF4757' : 'none'}
                                color={isSaved(item, activeTab) ? '#FF4757' : 'currentColor'}
                              />
                            </button>
                            <button
                              className={`icon-btn ${copiedId === cardId ? 'copied' : ''}`}
                              onClick={() => handleCopy(item.content, cardId)}
                              title="نسخ"
                              aria-label="نسخ المحتوى"
                            >
                              {copiedId === cardId
                                ? <Check size={18} color="#4ADE80" strokeWidth={2.5} />
                                : <Copy size={18} strokeWidth={2} />
                              }
                            </button>
                          </div>
                        </div>
                        <div className="result-card-body">{item.content}</div>
                      </div>
                    );
                  })
                )
              )}
            </div>
          </div>
        )}
      </main>

      {toast && (
        <div 
          className="toast" 
          role="alert"
          style={{
            background: toastType === 'success' ? '#4ADE80' : toastType === 'error' ? '#FF4757' : '#3B82F6',
            animation: 'toastSlide 0.3s ease-out, toastSlideOut 0.3s ease-out 3.2s forwards'
          }}
        >
          {toastType === 'success' ? '✓ ' : toastType === 'error' ? '✕ ' : 'ℹ '}{toast}
        </div>
      )}

      {/* Welcome Popup */}
      {showWelcomePopup && (
        <>
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(6px)',
            zIndex: 2000,
            animation: 'fadeIn 0.3s ease-out'
          }} onClick={() => setShowWelcomePopup(false)} />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: `linear-gradient(135deg, var(--surface) 0%, rgba(255, 159, 28, 0.05) 100%)`,
            border: '2px solid var(--primary)',
            borderRadius: '24px',
            padding: '2rem',
            zIndex: 2001,
            maxWidth: '420px',
            animation: 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
            textAlign: 'right',
            dir: 'rtl'
          }}>
            <button
              onClick={() => setShowWelcomePopup(false)}
              style={{
                float: 'left',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              ✕
            </button>
            <div style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>🎉</div>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', color: 'var(--text)' }}>مرحباً بك!</h2>
            <p style={{ margin: '0 0 1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              أنت جاهز الآن لتوليد نشاطات مخيم رائعة بقوة الذكاء الاصطناعي.
            </p>
            <div style={{ background: 'rgba(255, 159, 28, 0.1)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ marginBottom: '0.75rem', fontWeight: '600', color: 'var(--primary)' }}>✨ ماذا يمكنك فعله؟</div>
              <ul style={{ margin: 0, paddingRight: '1.5rem', fontSize: '0.9rem', lineHeight: '1.8', color: 'var(--text)' }}>
                <li>توليد أغاني وألعاب وأنشطة مخيم احترافية</li>
                <li>حفظ وتقييم أفضل الأنشطة برتب نجوم</li>
                <li>تحميل كل الأنشطة المحفوظة دفعة واحدة</li>
                <li>مراقبة إحصائيات نشاطاتك</li>
              </ul>
            </div>
            <button
              onClick={() => setShowWelcomePopup(false)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(255, 159, 28, 0.3)'
              }}
              onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.target.style.transform = 'translateY(0)'}
            >
              ابدأ الآن 🚀
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes toastSlide {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes toastSlideOut {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to { opacity: 0; transform: translateX(-50%) translateY(40px); }
        }
      `}</style>
    </>
  );
}
