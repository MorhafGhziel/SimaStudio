import type { T } from '@/lib/i18n';

const t = (en: string, ar: string): T => ({ en, ar });

/* ── Services ─────────────────────────────────────────────── */
export const services = [
  { id: 'brand', title: t('Brand Websites', 'مواقع العلامات التجارية'), text: t('Custom websites designed around your identity.', 'مواقع مخصصة مصممة حول هويتك.'), image: '/work/noble-store-hero.jpg' },
  { id: 'commerce', title: t('E-Commerce', 'التجارة الإلكترونية'), text: t('Online stores designed for a smooth shopping experience.', 'متاجر إلكترونية مصممة لتجربة تسوق سلسة.'), image: '/work/noble-store-extra.jpg' },
  { id: 'immersive', title: t('Interactive Experiences', 'التجارب التفاعلية'), text: t('Motion, 3D and immersive interactions for the web.', 'حركة وتجارب ثلاثية الأبعاد وتفاعلات غامرة على الويب.'), image: '/work/noble-immersive-hero.jpg' },
  { id: 'landing', title: t('Landing Pages', 'صفحات الهبوط'), text: t('Focused pages designed for campaigns and conversions.', 'صفحات مركّزة مصممة للحملات والتحويل.'), image: '/work/rashfa-hero.jpg' },
  { id: 'redesign', title: t('Website Redesign', 'إعادة تصميم المواقع'), text: t('Turn an outdated website into a modern experience.', 'حوّل موقعك القديم إلى تجربة رقمية حديثة.'), image: '/work/after.jpg' },
];

/* ── Industries ───────────────────────────────────────────── */
export const industries = [
  { id: 'perfume', label: t('Perfume', 'العطور'), image: 'ind-perfume', projects: ['noble-immersive'] },
  { id: 'fashion', label: t('Fashion', 'الأزياء'), image: 'ind-fashion', projects: [] },
  { id: 'beauty', label: t('Beauty', 'التجميل'), image: 'ind-beauty', projects: [] },
  { id: 'restaurants', label: t('Restaurants', 'المطاعم'), image: 'ind-restaurants', projects: [] },
  { id: 'cafes', label: t('Cafés', 'المقاهي'), image: 'ind-cafes', projects: ['rashfa'] },
  { id: 'lifestyle', label: t('Lifestyle', 'أسلوب الحياة'), image: 'ind-lifestyle', projects: [] },
  { id: 'ecommerce', label: t('E-Commerce', 'التجارة الإلكترونية'), image: 'ind-ecommerce', projects: [] },
];

/* ── Packages ─────────────────────────────────────────────── */
export type Package = {
  id: 'starter' | 'signature' | 'immersive';
  number: string;
  name: string;
  /** Full price. */
  price: number;
  /** Launch-offer price, shown instead of `price` while the offer runs (see launchOffer in content/site). */
  launchPrice: number;
  tagline: T;
  audience: T;
  features: T[];
  cta: T;
  popular?: boolean;
  timeline: T;
};

export const packages: Package[] = [
  {
    id: 'starter',
    number: '01',
    name: 'Starter',
    price: 2500,
    launchPrice: 1500,
    tagline: t('A professional digital presence.', 'حضور رقمي احترافي.'),
    audience: t('For brands that need a clean, professional website.', 'للعلامات التي تحتاج موقعًا احترافيًا وأنيقًا.'),
    features: [
      t('Professional responsive website', 'موقع احترافي متجاوب'),
      t('Mobile optimization', 'تحسين كامل للجوال'),
      t('Brand & product presentation', 'عرض العلامة والمنتجات'),
      t('About section', 'قسم من نحن'),
      t('Contact information', 'معلومات التواصل'),
      t('WhatsApp integration', 'ربط واتساب'),
      t('Instagram integration', 'ربط إنستغرام'),
      t('Google Maps', 'خرائط Google'),
      t('Domain & hosting', 'النطاق والاستضافة'),
    ],
    cta: t('Choose Starter', 'اختر Starter'),
    timeline: t('2–3 days', '2–3 أيام'),
  },
  {
    id: 'signature',
    number: '02',
    name: 'Signature',
    price: 4500,
    launchPrice: 2500,
    popular: true,
    tagline: t('A complete brand experience.', 'تجربة متكاملة لعلامتك.'),
    audience: t('For brands ready for a fully custom, bilingual website.', 'للعلامات الجاهزة لموقع مخصص بالكامل وثنائي اللغة.'),
    features: [
      t('Everything in Starter', 'كل ما في Starter'),
      t('Fully custom UI/UX', 'تصميم واجهة وتجربة مخصص بالكامل'),
      t('Multiple product pages', 'صفحات متعددة للمنتجات'),
      t('Arabic + English', 'عربي + إنجليزي'),
      t('Product information', 'تفاصيل المنتجات'),
      t('Image gallery', 'معرض صور'),
      t('Performance optimization', 'تحسين الأداء والسرعة'),
      t('Basic SEO', 'تحسين أساسي لمحركات البحث'),
      t('Domain & hosting', 'النطاق والاستضافة'),
    ],
    cta: t('Choose Signature', 'اختر Signature'),
    timeline: t('2–7 days', '2–7 أيام'),
  },
  {
    id: 'immersive',
    number: '03',
    name: 'Immersive',
    price: 8000,
    launchPrice: 5000,
    tagline: t('For brands that want to stand out.', 'للعلامات التي تريد أن تتميّز.'),
    audience: t('For brands that want their website to be remembered.', 'للعلامات التي تريد موقعًا لا يُنسى.'),
    features: [
      t('Everything in Signature', 'كل ما في Signature'),
      t('Premium custom UI/UX', 'تصميم مخصص فاخر'),
      t('Interactive 3D homepage', 'صفحة رئيسية تفاعلية ثلاثية الأبعاد'),
      t('3D product elements', 'عناصر منتجات ثلاثية الأبعاد'),
      t('Advanced animations', 'حركات متقدمة'),
      t('Cinematic transitions', 'انتقالات سينمائية'),
      t('Scroll, mouse & touch interactions', 'تفاعلات مع التمرير والماوس واللمس'),
      t('Advanced product presentation', 'عرض متقدم للمنتجات'),
      t('Domain & hosting', 'النطاق والاستضافة'),
    ],
    cta: t('Choose Immersive', 'اختر Immersive'),
    timeline: t('1–2 weeks', '1–2 أسبوع'),
  },
];

/* ── Comparison ───────────────────────────────────────────── */
/** true / false, or a short text value. */
export const comparison: { label: T; values: [boolean | T, boolean | T, boolean | T] }[] = [
  { label: t('Responsive design', 'تصميم متجاوب'), values: [true, true, true] },
  { label: t('Custom UI/UX', 'تصميم مخصص'), values: [false, true, t('Premium', 'فاخر')] },
  { label: t('Arabic + English', 'عربي + إنجليزي'), values: [false, true, true] },
  { label: t('Product pages', 'صفحات المنتجات'), values: [t('Showcase', 'عرض'), t('Multiple', 'متعددة'), t('Advanced', 'متقدمة')] },
  { label: t('SEO', 'محركات البحث'), values: [false, t('Basic', 'أساسي'), t('Basic', 'أساسي')] },
  { label: t('Performance optimization', 'تحسين الأداء'), values: [false, true, true] },
  { label: t('Motion', 'الحركة'), values: [false, t('Subtle', 'خفيفة'), t('Cinematic', 'سينمائية')] },
  { label: t('3D', 'ثلاثي الأبعاد'), values: [false, false, true] },
  { label: t('Advanced interactions', 'تفاعلات متقدمة'), values: [false, false, true] },
  { label: t('E-commerce', 'تجارة إلكترونية'), values: [t('Custom quote', 'عرض خاص'), t('Custom quote', 'عرض خاص'), t('Custom quote', 'عرض خاص')] },
];

/* ── Process ──────────────────────────────────────────────── */
export const processSteps = [
  { title: t('Discover', 'نفهم'), text: t('We understand your brand, audience, products and goals.', 'نفهم علامتك وجمهورك ومنتجاتك وأهدافك.') },
  { title: t('Design', 'نصمم'), text: t('We create a visual direction and user experience around your brand.', 'نبني توجهًا بصريًا وتجربة استخدام حول علامتك.') },
  { title: t('Build', 'نبني'), text: t('We turn the approved design into a fast, responsive website.', 'نحوّل التصميم المعتمد إلى موقع سريع ومتجاوب.') },
  { title: t('Launch', 'نطلق'), text: t('We connect your domain, finalize everything and go live.', 'نربط نطاقك ونراجع كل التفاصيل ونطلق الموقع.') },
];

/* ── Why us ───────────────────────────────────────────────── */
export const reasons = [
  { title: t('Designed around your brand.', 'مصمم حول علامتك.'), text: t('No generic templates. Every layout starts from your identity.', 'بلا قوالب جاهزة. كل تصميم يبدأ من هويتك.') },
  { title: t('Built for real users.', 'مبني لمستخدمين حقيقيين.'), text: t('Mobile-first, because that is where your customers find you.', 'الجوال أولًا، لأنه المكان الذي يجدك فيه عملاؤك.') },
  { title: t('Fast by default.', 'سريع بطبيعته.'), text: t('Optimised images, lean code and quick loading on any connection.', 'صور محسّنة وكود خفيف وتحميل سريع على أي اتصال.') },
  { title: t('Ready to grow.', 'جاهز للنمو.'), text: t('Modern technology that can add pages, languages or a store later.', 'تقنيات حديثة تتيح إضافة صفحات أو لغات أو متجر لاحقًا.') },
  { title: t('One-on-one communication.', 'تواصل مباشر.'), text: t('You work directly with the people designing and building your site.', 'تتعامل مباشرة مع من يصمم ويبني موقعك.') },
];

/* ── FAQ ──────────────────────────────────────────────────── */
export const faqs = [
  {
    q: t('How long does a website take?', 'كم يستغرق بناء الموقع؟'),
    a: t(
      'Starter takes 2–3 days, Signature 2–7 days and Immersive 1–2 weeks, once we have your content. Custom projects get a timeline in the proposal.',
      'باقة Starter تستغرق 2–3 أيام، وباقة Signature من 2–7 أيام، وباقة Immersive من 1–2 أسبوع بعد استلام المحتوى. المشاريع المخصصة نحدد مدتها في العرض.',
    ),
  },
  { q: t('Do you provide domain and hosting?', 'هل توفرون النطاق والاستضافة؟'), a: t('Yes. Every package includes domain and hosting setup for the first year.', 'نعم. كل الباقات تشمل إعداد النطاق والاستضافة للسنة الأولى.') },
  { q: t('Can you build an Arabic website?', 'هل يمكنكم بناء موقع باللغة العربية؟'), a: t('Yes — with proper right-to-left layout, not just translated text. Signature and Immersive include Arabic + English.', 'نعم — بتصميم صحيح من اليمين لليسار وليس مجرد ترجمة. باقة Signature وباقة Immersive تشملان العربية والإنجليزية.') },
  { q: t('Can you build an online store?', 'هل يمكنكم بناء متجر إلكتروني؟'), a: t('Yes. Online stores are quoted as custom projects based on products, payments and delivery.', 'نعم. المتاجر الإلكترونية تُسعّر كمشاريع مخصصة حسب المنتجات والدفع والتوصيل.') },
  { q: t('Can you redesign an existing website?', 'هل يمكنكم إعادة تصميم موقع حالي؟'), a: t('Yes. We keep what works, rebuild what doesn’t, and move your content across.', 'نعم. نحتفظ بما ينجح، ونعيد بناء ما لا ينجح، وننقل محتواك.') },
  { q: t('Can I request custom features?', 'هل يمكنني طلب خصائص إضافية؟'), a: t('Yes. Anything beyond a package is quoted separately before we start.', 'نعم. أي خاصية خارج الباقة نسعّرها بشكل منفصل قبل البدء.') },
  { q: t('Do you work with brands anywhere?', 'هل تعملون مع علامات من أي مكان؟'), a: t('Yes. We work remotely with brands wherever they are.', 'نعم. نعمل عن بُعد مع العلامات أينما كانت.') },
];
