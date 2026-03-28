import React, { useState, useEffect, useCallback } from 'react';
import {
  Music, Gamepad2, Users, Snowflake,
  Tent, Sun, Moon, Sparkles, Settings, ChevronDown, ChevronUp,
  Baby, User, UserCheck,
  Waves, Trees, Home, Mountain,
  UsersRound, Building2,
  Heart, Copy, Printer, Check,
  Smile, Drama, Loader2,
  Star, Zap
} from 'lucide-react';
import { generateActivityContent } from './aiService';

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
  { key: 'icebreakers', Icon: Smile,     label: 'كسر الجليد',   color: '#FF6B6B' },
];

const AGE_OPTIONS = [
  { value: '6-8 سنوات',   label: '6–8 سنوات',   Icon: Baby },
  { value: '9-11 سنوات',  label: '9–11 سنوات',  Icon: User },
  { value: '12-14 سنوات', label: '12–14 سنوات', Icon: UserCheck },
];
const ENV_OPTIONS = [
  { value: 'شاطئ البحر',  label: 'شاطئ البحر',  Icon: Waves },
  { value: 'غابة وطبيعة', label: 'غابة وطبيعة', Icon: Trees },
  { value: 'فضاء داخلي',  label: 'فضاء داخلي',  Icon: Home },
  { value: 'جبال وتلال',  label: 'جبال وتلال',  Icon: Mountain },
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
  const [theme, setTheme]             = useState('light');
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [configOpen, setConfigOpen]   = useState(false);

  const [ageGroups, setAgeGroups]       = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [groupSize, setGroupSize]       = useState('');
  const [contentTypes, setContentTypes] = useState(['songs','games','activities','icebreakers']);

  const [isLoading, setIsLoading]   = useState(false);
  const [results, setResults]       = useState(null);
  const [activeTab, setActiveTab]   = useState('songs');
  const [copiedId, setCopiedId]     = useState(null);
  const [favorites, setFavorites]   = useState([]);
  const [toast, setToast]           = useState('');

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

  const toggleFav = useCallback((id) =>
    setFavorites(f => f.includes(id) ? f.filter(v => v !== id) : [...f, id]),
  []);

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

      <main className="app" dir="rtl">

        {/* ── Header ──────────────────────────────── */}
        <header className="header">
          <div className="header-top">
            <button
              id="theme-toggle-btn"
              className="theme-toggle"
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              aria-label="تبديل الوضع"
            >
              {theme === 'light'
                ? <><Moon size={16} /> وضع مظلم</>
                : <><Sun  size={16} /> وضع فاتح</>
              }
            </button>
          </div>

          <div className="header-logo" role="img" aria-label="خيمة">
            <Tent size={36} color="#fff" strokeWidth={1.8} />
          </div>
          <h1>المنشط الذكي</h1>
          <p>أداة مدعومة بالذكاء الاصطناعي لتوليد أغانٍ، ألعاب، وأنشطة لمخيماتك الصيفية!</p>
        </header>

        {/* ── Input Form ──────────────────────────── */}
        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <div className="section-label">
            <Sparkles size={14} /> وصف النشاط
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="activity-title">موضوع النشاط أو اسم اللعبة *</label>
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
                  <div className="config-section">
                    <h4><Sparkles size={15} /> ماذا تريد أن يولّد الذكاء الاصطناعي؟</h4>
                    <ChipGroup
                      options={CONTENT_OPTIONS}
                      selected={contentTypes}
                      onToggle={v => toggleArr(contentTypes, setContentTypes, v)}
                      color="danger"
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
          <div className="results-wrapper">
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
              {TAB_CONFIG.filter(t => results[t.key]?.length > 0).map(tab => (
                <button
                  key={tab.key}
                  role="tab"
                  className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                  aria-selected={activeTab === tab.key}
                >
                  <tab.Icon size={16} strokeWidth={2} />
                  {tab.label}
                  <span className="tab-count">{results[tab.key]?.length ?? 0}</span>
                </button>
              ))}
            </nav>

            {/* Cards */}
            <div className="result-list">
              {currentItems.length === 0 ? (
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
                            className={`icon-btn ${favorites.includes(cardId) ? 'active' : ''}`}
                            onClick={() => toggleFav(cardId)}
                            title="المفضلة"
                            aria-label="إضافة للمفضلة"
                          >
                            <Heart
                              size={18}
                              strokeWidth={2}
                              fill={favorites.includes(cardId) ? '#FF4757' : 'none'}
                              color={favorites.includes(cardId) ? '#FF4757' : 'currentColor'}
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
              )}
            </div>
          </div>
        )}
      </main>

      {toast && <div className="toast" role="alert">{toast}</div>}
    </>
  );
}
