import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Music, Gamepad2, Users, Snowflake,
  Tent, Sun, Moon, Sparkles, Settings, ChevronDown, ChevronUp,
  Baby, User, UserCheck,
  Waves, Trees, Home, Mountain,
  UsersRound, Building2,
  Heart, Copy, Printer, Check,
  Smile, Drama, Loader2,
  Star, Zap, Bookmark, Trash2, Info, X
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
  const [contentTypes, setContentTypes] = useState(['songs','games','activities','plays','icebreakers']);

  const [isLoading, setIsLoading]   = useState(false);
  const [results, setResults]       = useState(null);
  const [activeTab, setActiveTab]   = useState('songs');
  const [copiedId, setCopiedId]     = useState(null);
  const [saved, setSaved]           = useState([]); // Array of saved items
  const [toast, setToast]           = useState('');
  const resultsRef = useRef(null);

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (results && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [results]);

  // Load saved items from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('animateur_saved_items');
    if (stored) {
      try {
        setSaved(JSON.parse(stored));
      } catch (err) {
        console.warn('Failed to load saved items:', err);
      }
    }
  }, []);

  // Save to localStorage whenever saved changes
  useEffect(() => {
    localStorage.setItem('animateur_saved_items', JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleArr = (arr, set, val) =>
    set(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

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
      showToast('تم الحذف من المحفوظات');
    } else {
      setSaved([...saved, { id: itemId, type, item, savedAt: new Date().toISOString() }]);
      showToast('تم الحفظ بنجاح! ✓');
    }
  }, [saved]);

  const isSaved = (item, type) => {
    return saved.some(s => s.type === type && s.item.title === item.title);
  };

  const removeSaved = useCallback((id) => {
    setSaved(saved.filter(s => s.id !== id));
    showToast('تم الحذف من المحفوظات');
  }, [saved]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsLoading(true);
    setResults(null);
    try {
      const data = await generateActivityContent(title, description, {
        ageGroups, environments, groupSize, contentTypes,
      });
      setResults(data);
      const firstAvail = contentTypes.find(k => data[k]?.length > 0) || 'songs';
      setActiveTab(firstAvail);
      setTitle('');
      setDescription('');
    } catch (err) {
      showToast('حدث خطأ. تحقق من مفتاح API والاتصال بالإنترنت.');
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading || !title.trim() || contentTypes.length === 0}
            >
              {isLoading
                ? <><Loader2 size={20} className="spin" /> جاري التوليد...</>
                : <><Sparkles size={20} /> ولّد الأفكار الآن!</>
              }
            </button>
          </form>
        </div>

        {/* ── Loading ─────────────────────────────── */}
        {isLoading && (
          <div className="glass-card loading-card">
            <div className="loading-icons">
              <Music size={32} className="bounce-1" color="#FF9F1C" />
              <Gamepad2 size={32} className="bounce-2" color="#2EC4B6" />
              <Drama size={32} className="bounce-3" color="#A78BFA" />
              <Snowflake size={32} className="bounce-4" color="#FF6B6B" />
            </div>
            <div className="loading-text">الذكاء الاصطناعي يبتكر لك...</div>
            <div className="loading-sub">يتم الآن توليد أغانٍ وألعاب وأنشطة مخصصة لمخيمك</div>
            <div className="progress-bar"><div className="progress-fill" /></div>
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
                  saved.map((savedItem, idx) => {
                    const meta = Object.fromEntries(TAB_CONFIG.map(t => [t.key, t]))[savedItem.type];
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
                              onClick={() => handleCopy(savedItem.item.content, savedItem.id)}
                              title="نسخ"
                              aria-label="نسخ المحتوى"
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
                              aria-label="حذف من المحفوظات"
                            >
                              <Trash2 size={18} strokeWidth={2} color="#FF6B6B" />
                            </button>
                          </div>
                        </div>
                        <div className="result-card-body">{savedItem.item.content}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                          محفوظ: {new Date(savedItem.savedAt).toLocaleDateString('ar-DZ')}
                        </div>
                      </div>
                    );
                  })
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

      {toast && <div className="toast" role="alert">{toast}</div>}
    </>
  );
}
