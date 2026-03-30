import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

/* ─── Demo Data Fallback ─────────────────────────────────── */
const demoData = (title) => ({
  songs: [{ title: `أغنية: ${title}`, content: `(اللازمة)\nهيا يا أبطال، هيا نغني سوا\nفي مخيمنا الحلو وأجمل الهوا!\n\n(المقطع الأول)\nنلعب ونضحك، نبني صداقات\nفي الطبيعة الجميلة تحت السماوات\n\n⏱️ المدة: 3-4 دقائق` }],
  games: [{ title: `لعبة: ${title}`, content: `🎯 الهدف: التعاون\n👥 العدد: 6-20\n⏱️ المدة: 10-15 دقيقة\n\n📋 الخطوات:\n1. قسم الأطفال لفريقين\n2. اشرح القواعد\n3. ابدأ اللعبة\n4. الفريق الأول ينجح يفوز\n\n💡 شجع الجميع` }],
  activities: [{ title: `نشاط: ${title}`, content: `💡 نشاط تعاوني يعزز القيم الإيجابية\n\n👥 الأدوار: قائد، مستكشف، مشجع، حكيم\n\n📋 الخطوات:\n1. وزع الأدوار (5 دقائق)\n2. تدرب (5 دقائق)  \n3. عرض (10 دقائق)\n\n🎯 الأهداف: العمل الجماعي، الثقة، التعبير` }],
  plays: [{ title: `مسرحية: ${title}`, content: `🎭 مسرحية احترافية - 5-6 دقائق\n\n👥 الشخصيات:\n• علي الشجاع (البطل)\n• محمد الوفي (الصديق)\n• فاطمة الحكيمة (المرشدة)\n\n📝 المشاهد:\n[البداية] استعداد وتحفيز\n[الصراع] تحدي ولغز\n[النجاح] تعاون وانتصار\n\n🎯 الأهداف: التعاون، الثقة، الشجاعة` }],
  icebreakers: [{ title: "شبكة التعارف", content: `🎯 تعريف الأطفال ببعضهم\n⏱️ 7-10 دقائق\n🔧 كرة خيط\n\n📝 الخطوات:\n1. دائرة كبيرة\n2. المنشط يعرف بنفسه\n3. يرمي الكرة مع الخيط\n4. الطفل يعرف ويرمي\n\n💬 الخاتمة: "نحن متصلون - فريق واحد!"` }],
});

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const callWithRetry = async (fn, retries = 1, delayMs = 2000) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const is429 = err?.status === 429 || err?.message?.includes('429');
      if (is429 && attempt < retries) {
        console.warn(`Rate limited — retrying in ${delayMs / 1000}s... (attempt ${attempt + 1}/${retries})`);
        await sleep(delayMs);
      } else {
        throw err;
      }
    }
  }
};

/* ─── Main export ──────────────────────────────────── */
export const generateActivityContent = async (title, description, options = {}) => {
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey === "") {
    throw new Error("🔑 API key missing! Set VITE_GEMINI_API_KEY in .env.local");
  }

  const {
    ageGroups = [],
    environments = [],
    groupSize = "",
  } = options;

  const contextLines = [
    ageGroups.length    ? `الفئة العمرية: ${ageGroups.join("، ")}`   : "",
    environments.length ? `بيئة المخيم: ${environments.join("، ")}`  : "",
    groupSize           ? `حجم المجموعة: ${groupSize}`               : "",
  ].filter(Boolean).join("\n");

  const prompt = `أنت خبير احترافي في: مسرحيات للأطفال، أغانٍ، ألعاب تربوية، أنشطة، تقنيات كسر الجليد.

الموضوع: "${title}"
${description ? `الوصف: "${description}"` : ""}
${contextLines ? `${contextLines}` : ""}

اجعل محتوى احترافي جاهز للعرض مباشرة. العربية الفصحى، آمن للأطفال، مفصل وعملي.

أخرج JSON فقط:
{
  "songs": [{"title": "عنوان", "content": "نص أغنية كامل مع لازمة سهلة"}],
  "games": [{"title": "اسم", "content": "🎯الهدف\\n👥العدد\\n⏱️المدة\\n📝الخطوات\\n1..."}],
  "activities": [{"title": "اسم", "content": "💡الفكرة\\n👥الأدوار\\n📋الخطوات\\n🎯الأهداف"}],
  "plays": [{"title": "اسم", "content": "🎭مسرحية احترافية 5-6دقائق شاملة"}],
  "icebreakers": [{"title": "اسم", "content": "🎯الهدف\\n⏱️المدة\\n📝الخطوات\\n💬الخاتمة"}]
}`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
    });

    const result = await callWithRetry(() => model.generateContent(prompt), 1, 2000);
    let text = result.response.text().trim();
    
    // Parse safely
    try {
      return JSON.parse(text);
    } catch (parseErr) {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw parseErr;
    }

  } catch (err) {
    const isQuota = err?.message?.includes('429') || err?.message?.includes('Quota');
    const isParseErr = err instanceof SyntaxError || err?.message?.includes('JSON');
    
    if (isQuota || isParseErr) {
      console.warn(`⚠️ ${isQuota ? 'Quota exceeded' : 'JSON parsing error'} - Using demo data`);
      return demoData(title);
    }
    
    console.error("API Error:", err);
    throw err;
  }
};
