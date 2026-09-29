// All site copy. Every key carries two voices — `polished` (the base layer, the
// slick pitch) and `honest` (the vermillion spotlight layer, the solo-founder
// truth) — in both English and Arabic.

export type Lang = "en" | "ar";
export type Voice = "polished" | "honest";

type Bilingual = { en: string; ar: string };
type DualVoice = { polished: Bilingual; honest: Bilingual };

const dv = (
  polEn: string,
  polAr: string,
  honEn: string,
  honAr: string,
): DualVoice => ({
  polished: { en: polEn, ar: polAr },
  honest: { en: honEn, ar: honAr },
});

const bi = (en: string, ar: string): Bilingual => ({ en, ar });

export const ui = {
  brand: bi("yourfirstsite", "موقعك الأول"),
  navWork: bi("Work", "الأعمال"),
  navOffer: bi("What you get", "ما تحصل عليه"),
  navPricing: bi("Price", "السعر"),
  navContact: bi("Start", "ابدأ"),
  langToggle: bi("عربي", "EN"),
  spotlightHint: bi("Drag for the truth", "اسحب للحقيقة"),
  spotlightHandle: bi("HOLD\nTRUTH", "الحقيقة"),
  start: bi("Start", "ابدأ"),
  loading: bi("Building", "نبني"),
};

export const copy = {
  // Hero — 5-line stacked lockup, word per line
  heroLine1: dv("Your", "موقعك", "Your", "موقعك"),
  heroLine2: dv("first", "الأول", "only", "الوحيد"),
  heroLine3: dv("website", "على الإنترنت", "website", "على الإنترنت"),
  heroLine4: dv("in seven", "خلال سبعة", "before you", "قبل أن"),
  heroLine5: dv("days", "أيام", "chicken out", "تتراجع"),

  heroSub: dv(
    "Domain, SEO, and deployment. One flat price. One quick week.",
    "النطاق، وتحسين الظهور، والنشر. سعر واحد ثابت. أسبوع واحد سريع.",
    "It is one person, a laptop, and an alarming amount of coffee.",
    "شخص واحد، وحاسوب محمول، وكمية مقلقة من القهوة.",
  ),

  // About / pitch
  aboutLabel: dv("About", "من نحن", "Honestly", "بصراحة"),
  aboutBody: dv(
    "We build complete, fast, search-friendly websites for founders who are tired of waiting on agencies.",
    "نصنع مواقع كاملة وسريعة وصديقة لمحركات البحث لأصحاب المشاريع الذين سئموا انتظار الوكالات.",
    "We got tired of watching good ideas die in a three-month proposal queue.",
    "سئمنا من رؤية الأفكار الجيدة تموت في قائمة انتظار عروض تستغرق ثلاثة أشهر.",
  ),

  // Offer rows
  offerLabel: dv("What you get", "ما تحصل عليه", "The whole thing", "كل شيء"),
  offer1Title: dv("Domain", "النطاق", "Domain", "النطاق"),
  offer1Desc: dv(
    "We find, register, and wire up the name that fits.",
    "نبحث عن الاسم المناسب ونسجّله ونربطه بالكامل.",
    "Yes, we will stop you buying the .biz one. You are welcome.",
    "نعم، سنمنعك من شراء نطاق .biz. على الرحب والسعة.",
  ),
  offer2Title: dv("SEO", "تحسين الظهور", "SEO", "الظهور"),
  offer2Desc: dv(
    "Structured, indexed, and readable by every search engine.",
    "مبني ومفهرس وقابل للقراءة من كل محركات البحث.",
    "The real trick is having pages worth finding. We handle that too.",
    "الحيلة الحقيقية أن تستحق صفحاتك أن تُكتشف. نتكفل بذلك أيضًا.",
  ),
  offer3Title: dv("Deployment", "النشر", "Deployment", "النشر"),
  offer3Desc: dv(
    "Live on fast global hosting with SSL, done for you.",
    "منشور على استضافة عالمية سريعة مع شهادة SSL، جاهز لك.",
    "No 'it works on my machine'. It works on the actual internet.",
    "لا مزيد من «يعمل على جهازي». إنه يعمل على الإنترنت الحقيقي.",
  ),
  offer4Title: dv("Seven days", "سبعة أيام", "Seven days", "سبعة أيام"),
  offer4Desc: dv(
    "From first message to live site. A single, quick week.",
    "من أول رسالة إلى موقع منشور. أسبوع واحد سريع.",
    "Six if the coffee is good and you answer your messages.",
    "ستة أيام إذا كانت القهوة جيدة وأجبت على رسائلك.",
  ),

  // Pricing
  priceLabel: dv("The price", "السعر", "No asterisks", "بلا نجمة صغيرة"),
  priceCurrency: dv("SAR", "ريال", "SAR", "ريال"),
  priceNote: dv(
    "One flat price. Domain, build, SEO, and deployment included.",
    "سعر واحد ثابت. يشمل النطاق والبناء وتحسين الظهور والنشر.",
    "Total. Not 'starting from'. Not 'plus hosting'. Total.",
    "إجمالي. ليس «يبدأ من». ليس «بالإضافة إلى الاستضافة». إجمالي.",
  ),

  // Process / timeline
  processLabel: dv("The week", "الأسبوع", "The actual week", "الأسبوع الحقيقي"),
  step1: dv(
    "We talk. You tell us what the site is for.",
    "نتحدث. تخبرنا عن هدف الموقع.",
    "You send three references. Two are the same site.",
    "ترسل ثلاثة أمثلة. اثنان منها لنفس الموقع.",
  ),
  step2: dv(
    "We design and build the whole thing.",
    "نصمم ونبني كل شيء.",
    "This is the part where the coffee happens.",
    "هذا هو الجزء الذي تحدث فيه القهوة.",
  ),
  step3: dv(
    "You review. We refine every detail.",
    "تراجع. نحسّن كل تفصيل.",
    "You ask to make the logo bigger. We do it.",
    "تطلب تكبير الشعار. نفعلها.",
  ),
  step4: dv(
    "We deploy. Your site is live to the world.",
    "ننشر. موقعك متاح للعالم.",
    "You screenshot it for your family group chat.",
    "تلتقط صورة له لمجموعة العائلة.",
  ),

  // Testimonials
  testLabel: dv("They said", "قالوا", "They really said", "قالوا فعلًا"),
  test1: dv(
    "A real website in a week. I still don't fully believe it.",
    "موقع حقيقي في أسبوع. ما زلت لا أصدق تمامًا.",
    "I had budgeted for three months of stress. Refund, please.",
    "كنت قد رصدت ميزانية لثلاثة أشهر من التوتر. أعيدوا لي التوتر.",
  ),
  test2: dv(
    "Fast, clean, and it actually shows up on Google.",
    "سريع ونظيف ويظهر فعلًا على جوجل.",
    "My cousin quoted me ten times this. My cousin is fired.",
    "ابن عمي طلب عشرة أضعاف هذا. ابن عمي مفصول.",
  ),
  test3: dv(
    "One price, no surprises. That never happens.",
    "سعر واحد بلا مفاجآت. هذا لا يحدث أبدًا.",
    "I kept waiting for the upsell. It never came. Unsettling.",
    "ظللت أنتظر العرض الإضافي. لم يأتِ. أمر مقلق.",
  ),

  // Motto
  motto: dv(
    "Stop planning the website. Start having one.",
    "توقف عن التخطيط للموقع. ابدأ بامتلاك واحد.",
    "The best time was last year. The second best is this week.",
    "أفضل وقت كان العام الماضي. وثاني أفضل وقت هو هذا الأسبوع.",
  ),

  // Footer
  footerLabel: dv("Start", "ابدأ", "Go on then", "هيا إذًا"),
  footerHead: dv(
    "Let's build your first site.",
    "لنبنِ موقعك الأول.",
    "You have read this far. That is basically a yes.",
    "قرأت حتى هنا. هذا يعني نعم تقريبًا.",
  ),
} satisfies Record<string, DualVoice>;

export type CopyKey = keyof typeof copy;

// contact links with witty second-voice sub-labels (the minhpham footer pattern)
export const contacts = [
  {
    label: bi("Email", "البريد"),
    value: "hello@yourfirstsite.com",
    href: "mailto:hello@yourfirstsite.com",
    sub: dv(
      "The fastest way in",
      "أسرع طريقة للتواصل",
      "100% chance I read it",
      "احتمال ١٠٠٪ أن أقرأها",
    ),
  },
  {
    label: bi("WhatsApp", "واتساب"),
    value: "+966 5X XXX XXXX",
    href: "https://wa.me/9665XXXXXXXX",
    sub: dv(
      "For the quick questions",
      "للأسئلة السريعة",
      "Where the real deals happen",
      "حيث تُعقد الصفقات الحقيقية",
    ),
  },
  {
    label: bi("Instagram", "إنستغرام"),
    value: "@yourfirstsite",
    href: "https://instagram.com",
    sub: dv(
      "Recent work",
      "أحدث الأعمال",
      "Mostly finished sites, some coffee",
      "غالبًا مواقع مكتملة، وبعض القهوة",
    ),
  },
  {
    label: bi("X", "إكس"),
    value: "@yourfirstsite",
    href: "https://x.com",
    sub: dv(
      "Thoughts on the web",
      "أفكار عن الويب",
      "90% opinions about fonts",
      "٩٠٪ آراء حول الخطوط",
    ),
  },
];
