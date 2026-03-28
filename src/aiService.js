import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

/* ─── Mock data fallback ─────────────────────────── */
const buildMockData = (title) => ({
  songs: [
    {
      title: `أغنية: ${title}`,
      content: `(اللازمة - مع الجميع)
هيا يا أبطال، هيا نغني سوا
في مخيمنا الحلو، في أجمل الهوا!

(المقطع الأول)
نلعب، نضحك، نبني صداقات
في الطبيعة الجميلة وتحت السماوات

(اللازمة)
هيا يا أبطال، هيا نغني سوا
في مخيمنا الحلو، في أجمل الهوا!`,
    },
    {
      title: "أنشودة الصباح",
      content: `(يُرددها الجميع معاً)
صباح الخير يا بطلي (مرحبا!)
صباح الشمس والأمل (مرحبا!)
في مخيمنا نجتمع (نعم!)
بقلوب مليئة بالفرح (نعم!)

(تكرار مع حركات)
أيدينا للأعلى — ياهو!
نقفز مع الأصحاب — ياهو!`,
    },
  ],
  games: [
    {
      title: `تحدي: ${title}`,
      content: `الهدف: تعزيز التعاون وسرعة البديهة.
عدد اللاعبين: فريقان (4-8 أطفال في كل فريق).
الأدوات: حبل، مخاريط تحديد المناطق.
المدة: 15 دقيقة.

طريقة اللعب:
1. يُقسّم المنشط الأطفال إلى فريقين متساويين.
2. يشرح القواعد بوضوح مع تمثيل عملي.
3. كل فريق يتعاون لإتمام التحدي قبل الآخر.
4. الفريق الأسرع والأكثر تعاوناً يفوز!

نصيحة للمنشط: شجّع الجميع ولا تترك أحداً يشعر بالإقصاء.`,
    },
    {
      title: "لعبة الثقة العمياء",
      content: `الهدف: بناء الثقة بين أفراد الفريق.
عدد اللاعبين: 10 - 20 طفلاً (أزواج).
الأدوات: أربطة للعيون.
المدة: 10 دقائق.

طريقة اللعب:
1. يُكوّن الأطفال أزواجاً.
2. يُغمض أحدهم عينيه والآخر يقوده بصوته فقط.
3. يتجنبون العقبات الموضوعة في الفضاء.
4. تُبدّل الأدوار بعد دقيقتين.

الهدف التربوي: تعليم الثقة والاستماع والتوجيه اللطيف.`,
    },
  ],
  activities: [
    {
      title: `نشاط: أبطال ${title}`,
      content: `الفكرة: نشاط تمثيلي يُعزز القيم الإيجابية.

الأدوار المقترحة:
• قائد الفريق: يتخذ القرارات ويستمع للجميع.
• المستكشف: يبحث عن الحلول الإبداعية.
• المشجّع: دوره رفع معنويات الفريق.
• الحكيم: يعطي نصائح عند الصعوبات.

خطوات التنفيذ:
1. وزّع الأدوار على الأطفال (5 دقائق).
2. اجعلهم يتدربون على أدوارهم (5 دقائق).
3. قدّم الموقف الذي سيتعاملون معه.
4. اعرض المسرحية أمام المجموعة (5 دقائق).

الهدف: تعليم العمل الجماعي والتعبير عن النفس.`,
    },
  ],
  icebreakers: [
    {
      title: "شبكة التعارف",
      content: `الهدف: تعارف سريع وممتع بين الأطفال.
المدة: 7-10 دقائق.
الأدوات: كرة خيط ملون.

الخطوات:
1. يقف الأطفال في دائرة.
2. يمسك المنشط بطرف الخيط ويعرّف بنفسه (اسمه + هوايته المفضلة).
3. يرمي الكرة لطفل آخر مع الاحتفاظ بطرف الخيط.
4. يكرر الطفل التعريف ويرمي الكرة، وهكذا...
5. في النهاية تتكوّن شبكة تربطهم جميعاً!

الرسالة الختامية: "انظروا! نحن متصلون — في المخيم نحن فريق واحد."`,
    },
  ],
});

/* ─── Retry helper ─────────────────────────────────── */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const callWithRetry = async (fn, retries = 2, delayMs = 15000) => {
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
    console.warn("No API key — using mock data.");
    await sleep(1800);
    return buildMockData(title);
  }

  const {
    ageGroups = [],
    environments = [],
    groupSize = "",
    contentTypes = ["songs", "games", "activities", "icebreakers"],
  } = options;

  const contextLines = [
    ageGroups.length    ? `الفئة العمرية: ${ageGroups.join("، ")}`   : "",
    environments.length ? `بيئة المخيم: ${environments.join("، ")}`  : "",
    groupSize           ? `حجم المجموعة: ${groupSize}`               : "",
  ].filter(Boolean).join("\n");

  const prompt = `أنت خبير في برمجة أنشطة المخيمات الصيفية للأطفال في الجزائر.
الموضوع: "${title}"
${description ? `وصف: "${description}"` : ""}
${contextLines ? `\nتفاصيل:\n${contextLines}` : ""}

أنتج JSON فقط (بدون أي نص خارجه):
{
  "songs": [{ "title": "...", "content": "كلمات مرحة إيقاعية بها لازمة" }],
  "games": [{ "title": "...", "content": "الهدف:...\nعدد اللاعبين:...\nالأدوات:...\nطريقة اللعب:\n1...." }],
  "activities": [{ "title": "...", "content": "الفكرة والأدوار والهدف التربوي" }],
  "icebreakers": [{ "title": "...", "content": "الهدف وخطوات التنفيذ" }]
}

قواعد: ولّد مقترحين لكل قسم، المحتوى بالعربية فقط، مناسب لأطفال آمن ومرح.`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await callWithRetry(() => model.generateContent(prompt), 2, 15000);
    const text = result.response.text();
    return JSON.parse(text);

  } catch (err) {
    const is429 = err?.status === 429 || err?.message?.includes('429');
    if (is429) {
      // All retries exhausted — fall back to mock data silently
      console.warn("All retries exhausted (429). Falling back to mock data.");
      await sleep(500);
      return buildMockData(title);
    }
    console.error("Gemini API Error:", err);
    throw err;
  }
};
