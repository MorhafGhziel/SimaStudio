import type { T } from '@/lib/i18n';
import { paymentMethods } from './site';

const t = (en: string, ar: string): T => ({ en, ar });

/* ── Services ─────────────────────────────────────────────── */
/**
 * `pricedBy` ties a service to a package, so its "from" price and timeline follow the
 * package data (and the launch offer) instead of being typed twice. A service with its own
 * starting price uses `from`; without a package its timeline is set in the quote.
 */
export type Service = {
  id: string;
  title: T;
  text: T;
  image: string;
  pricedBy?: 'starter' | 'signature' | 'immersive';
  timelineBy?: 'starter' | 'signature' | 'immersive';
  from?: number;
  points: T[];
  /** Slug of a project that shows this service. */
  project?: string;
};

export const services: Service[] = [
  {
    id: 'brand',
    title: t('Company & Brand Websites', 'مواقع الشركات والعلامات'),
    text: t('Your company online the way it looks in real life. Arabic first, English beside it.', 'شركتك على الإنترنت كما هي على أرض الواقع. عربي أولًا، والإنجليزية بجانبه.'),
    image: '/work/nasaq-hero.jpg',
    pricedBy: 'starter',
    timelineBy: 'signature',
    points: [
      t('Fast on a phone, with WhatsApp, Google Maps and your contact details wired in.', 'سريع على الجوال، مع ربط واتساب وخرائط Google ومعلومات التواصل.'),
      t('Fully custom design in Arabic and English from the Signature package.', 'تصميم مخصص بالكامل بالعربية والإنجليزية ابتداءً من باقة Signature.'),
      t('Domain and hosting included for the first year.', 'النطاق والاستضافة ضمن السعر للسنة الأولى.'),
    ],
    project: 'nasaq',
  },
  {
    id: 'commerce',
    title: t('Online Stores', 'المتاجر الإلكترونية'),
    text: t('A store that is easy to buy from on a phone, from the first product photo to payment.', 'متجر يسهل الشراء منه بالجوال، من أول صورة للمنتج إلى الدفع.'),
    image: '/work/noble-immersive-detail.jpg',
    from: 4500,
    points: [
      t('In front of your Salla or Zid store: we design the brand site and product pages, and "buy" takes the customer to your existing store, with its payments and shipping.', 'أمام متجرك في سلة أو زد: نصمم موقع العلامة وصفحات المنتجات، وزر الشراء ينقل العميل إلى متجرك القائم بما فيه من دفع وشحن.'),
      t('Or a fully custom store with its own cart and checkout, quoted by number of products, payment methods and delivery.', 'أو متجر مخصص بالكامل بسلة ودفع خاصين به، يُسعّر حسب عدد المنتجات وطرق الدفع والتوصيل.'),
      t('Either way: Arabic and English, and product pages built for a phone.', 'في الحالتين: عربي وإنجليزي، وصفحات منتجات مبنية للجوال.'),
    ],
    project: 'noble-immersive',
  },
  {
    id: 'immersive',
    title: t('3D Product Experiences', 'تجارب المنتجات ثلاثية الأبعاد'),
    text: t('Your product turns and changes colour before the buyer orders it, as we built for Nasaq.', 'منتجك يدور ويتغير لونه أمام العميل قبل أن يطلبه، كما بنينا لشركة نسق.'),
    image: '/work/nasaq-detail.jpg',
    pricedBy: 'immersive',
    timelineBy: 'immersive',
    points: [
      t('Your product built in 3D from drawings, photos or a sample.', 'منتجك مبني بالأبعاد الثلاثة انطلاقًا من المخططات أو الصور أو عينة.'),
      t('Turn it, zoom in, change the colour or finish, by mouse or by touch.', 'يُدار ويُقرَّب ويتغير لونه أو خامته، بالماوس أو باللمس.'),
      t('The buyer’s choices can fill your quote form, as they do on Nasaq.', 'اختيارات العميل تملأ نموذج طلب عرض السعر، كما في موقع نسق.'),
    ],
    project: 'nasaq',
  },
  {
    id: 'landing',
    title: t('Campaign Pages', 'صفحات الحملات'),
    text: t('One page for one ad and one goal: the visitor contacts you.', 'صفحة واحدة لإعلان واحد وهدف واحد: أن يتواصل معك الزائر.'),
    image: '/work/rashfa-hero.jpg',
    pricedBy: 'starter',
    timelineBy: 'starter',
    points: [
      t('Built around one offer, so nothing pulls the visitor away from it.', 'مبنية حول عرض واحد، فلا شيء يشتت الزائر عنه.'),
      t('Made to be the link behind your Instagram, TikTok or Snapchat ad.', 'مصممة لتكون الرابط خلف إعلانك في إنستغرام أو تيك توك أو سناب شات.'),
      t('WhatsApp and a short form as the only ways out.', 'واتساب ونموذج قصير هما المخرجان الوحيدان.'),
    ],
  },
  {
    id: 'redesign',
    title: t('Website Redesign', 'إعادة تصميم موقعك'),
    text: t('We keep what works on your site and rebuild what is costing you customers.', 'نحتفظ بما ينجح في موقعك، ونعيد بناء ما يُخسرك عملاء.'),
    image: '/work/nasaq-extra.jpg',
    pricedBy: 'starter',
    timelineBy: 'signature',
    points: [
      t('Start free: send us the link and get three specific notes on how it works on a phone.', 'البداية مجانية: أرسل لنا الرابط ويصلك ثلاث ملاحظات محددة عن أدائه على الجوال.'),
      t('We move your content across, so you do not start from zero.', 'ننقل محتواك إلى الموقع الجديد، فلا تبدأ من الصفر.'),
      t('Arabic rebuilt properly from right to left, not a translated copy.', 'العربية تُبنى من اليمين إلى اليسار كما يجب، لا نسخة مترجمة.'),
    ],
    project: 'nasaq',
  },
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

/* ── Care plan ────────────────────────────────────────────── */
/** Monthly price in SAR, from the second year. Year one hosting and domain are in every package. */
export const carePlan = { price: 300 };

/* ── Packages ─────────────────────────────────────────────── */
export type Package = {
  id: 'starter' | 'signature' | 'immersive';
  number: string;
  name: string;
  /** Full price. */
  price: number;
  /** Launch-offer price, shown instead of `price` while the offer runs (see launchOffer in content/site). */
  launchPrice: number;
  /** The price is a starting point and the project is quoted individually. */
  fromPrice?: boolean;
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
    tagline: t('A site that says who you are and how to reach you.', 'موقع يعرّف بنشاطك ويوصل العميل إليك.'),
    audience: t('For a business that needs a tidy, fast site without the extras.', 'لنشاط يحتاج موقعًا مرتبًا وسريعًا، بلا إضافات.'),
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
    timeline: t('1–2 weeks', 'أسبوع إلى أسبوعين'),
  },
  {
    id: 'signature',
    number: '02',
    name: 'Signature',
    price: 4500,
    launchPrice: 2500,
    popular: true,
    tagline: t('Designed for your brand only, in two languages.', 'موقع مصمم لعلامتك وحدها، بلغتين.'),
    audience: t('For a company with a clear identity that wants a site that looks like it.', 'لشركة لها هوية واضحة وتريد موقعًا يشبهها.'),
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
    timeline: t('2–3 weeks', 'أسبوعان إلى 3 أسابيع'),
  },
  {
    id: 'immersive',
    number: '03',
    name: 'Immersive',
    price: 8000,
    launchPrice: 5000,
    tagline: t('Your product in 3D, at the centre of the site.', 'منتجك بالأبعاد الثلاثة في قلب الموقع.'),
    audience: t('For a product that deserves to be seen from every angle.', 'لمنتج يستحق أن يُرى من كل زاوية.'),
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
    fromPrice: true,
    timeline: t('3–5 weeks', '3 إلى 5 أسابيع'),
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
  { title: t('Discover', 'نفهم'), text: t('We ask who your customers are and what makes them buy, and study your current site.', 'نسألك عن عملائك وما يدفعهم للشراء، وندرس موقعك الحالي.') },
  { title: t('Design', 'نصمم'), text: t('You see the full design and approve it before we start building.', 'ترى التصميم كاملًا وتعتمده قبل أن نبدأ البناء.') },
  { title: t('Build', 'نبني'), text: t('We build it in Arabic and English, and test it on a phone before a laptop.', 'نبنيه بالعربية والإنجليزية، ونختبره على الجوال قبل الحاسوب.') },
  { title: t('Launch', 'نطلق'), text: t('We connect your domain and go live. You stay in touch with the person who built it.', 'نربط نطاقك ونطلق الموقع، وتبقى على تواصل مع من بناه.') },
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
      'Starter takes 1–2 weeks, Signature 2–3 weeks and Immersive 3–5 weeks, counted from the day we have your content. Custom projects get a timeline in the proposal. If we launch more than a week after the agreed date, you get 10% back.',
      'باقة Starter تستغرق أسبوعًا إلى أسبوعين، وباقة Signature من أسبوعين إلى ثلاثة، وباقة Immersive من ثلاثة إلى خمسة أسابيع، تُحسب من يوم استلام المحتوى. المشاريع المخصصة نحدد مدتها في العرض. وإن تأخر الإطلاق أكثر من أسبوع عن الموعد المتفق عليه، نعيد لك 10٪.',
    ),
  },
  { q: t('Do you provide domain and hosting?', 'هل توفرون النطاق والاستضافة؟'), a: t('Yes. Every package includes domain and hosting setup for the first year.', 'نعم. كل الباقات تشمل إعداد النطاق والاستضافة للسنة الأولى.') },
  {
    q: t('What happens after the first year?', 'ماذا يحدث بعد السنة الأولى؟'),
    a: t(
      `The site is yours. From year two you can take the care plan for ${carePlan.price} SAR a month: hosting, domain renewal, small content edits and a monthly check. Or you can host it yourself and we hand everything over.`,
      `الموقع ملكك. من السنة الثانية يمكنك الاشتراك في خطة العناية بـ${carePlan.price} ريال شهريًا: الاستضافة وتجديد النطاق وتعديلات المحتوى البسيطة وفحص شهري. أو تستضيفه بنفسك ونسلّمك كل شيء.`,
    ),
  },
  {
    q: t('How does payment work?', 'كيف يتم الدفع؟'),
    a: t(
      `Half before we start and half at launch. Pay by ${paymentMethods.en.charAt(0).toLowerCase() + paymentMethods.en.slice(1)} The price you agree to is the final price; anything extra is quoted before we do it.`,
      `نصف المبلغ قبل البدء والنصف عند الإطلاق. طرق الدفع: ${paymentMethods.ar} السعر المتفق عليه هو السعر النهائي، وأي إضافة نسعّرها لك قبل تنفيذها.`,
    ),
  },
  { q: t('Can you build an Arabic website?', 'هل يمكنكم بناء موقع باللغة العربية؟'), a: t('Yes — with proper right-to-left layout, not just translated text. Signature and Immersive include Arabic + English.', 'نعم — بتصميم صحيح من اليمين لليسار وليس مجرد ترجمة. باقة Signature وباقة Immersive تشملان العربية والإنجليزية.') },
  { q: t('Can you build an online store?', 'هل يمكنكم بناء متجر إلكتروني؟'), a: t(
      'Yes, in two ways. From 4,500 SAR we design your brand site and product pages in front of your existing Salla or Zid store, so payments and shipping stay where they already work. A fully custom store with its own checkout is quoted by products, payment methods and delivery.',
      'نعم، بطريقتين. ابتداءً من 4,500 ريال نصمم موقع علامتك وصفحات منتجاتك أمام متجرك القائم في سلة أو زد، فيبقى الدفع والشحن حيث يعملان أصلًا. أما المتجر المخصص بالكامل بصفحة دفع خاصة به فيُسعّر حسب المنتجات وطرق الدفع والتوصيل.',
    ),
  },
  { q: t('Can you redesign an existing website?', 'هل يمكنكم إعادة تصميم موقع حالي؟'), a: t('Yes. We keep what works, rebuild what doesn’t, and move your content across.', 'نعم. نحتفظ بما ينجح، ونعيد بناء ما لا ينجح، وننقل محتواك.') },
  { q: t('Can I request custom features?', 'هل يمكنني طلب خصائص إضافية؟'), a: t('Yes. Anything beyond a package is quoted separately before we start.', 'نعم. أي خاصية خارج الباقة نسعّرها بشكل منفصل قبل البدء.') },
  { q: t('Do you work with brands anywhere?', 'هل تعملون مع علامات من أي مكان؟'), a: t('Yes. We work remotely with brands wherever they are.', 'نعم. نعمل عن بُعد مع العلامات أينما كانت.') },
];
