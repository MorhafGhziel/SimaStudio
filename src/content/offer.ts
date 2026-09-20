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
    title: t('Company & Brand Websites', 'مواقع الشركات'),
    text: t('Your company online the way it looks in real life. Arabic first, English beside it.', 'شركتك على الإنترنت كما هي في الواقع. بالعربي أولًا، ومعه الإنجليزي.'),
    image: '/work/nasaq-hero.jpg',
    pricedBy: 'starter',
    timelineBy: 'signature',
    points: [
      t('Fast on a phone, with WhatsApp, Google Maps and your contact details wired in.', 'سريع على الجوال، وفيه زر واتساب وموقعك على خرائط Google وأرقام التواصل.'),
      t('Fully custom design in Arabic and English from the Signature package.', 'تصميم خاص بك بالكامل، بالعربي والإنجليزي، ابتداءً من باقة Signature.'),
      t('Domain and hosting included for the first year.', 'اسم الموقع (الدومين) والاستضافة مجانًا في السنة الأولى.'),
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
      t('In front of your Salla or Zid store: we design the brand site and product pages, and "buy" takes the customer to your existing store, with its payments and shipping.', 'إن كان عندك متجر في سلة أو زد: نصمم لك موقع الشركة وصفحات المنتجات، وزر الشراء ينقل العميل إلى متجرك كما هو، بالدفع والشحن اللذين فيه.'),
      t('Or a fully custom store with its own cart and checkout, quoted by number of products, payment methods and delivery.', 'أو نبني لك متجرًا كاملًا بسلة ودفع خاصين به، وسعره حسب عدد المنتجات وطرق الدفع والتوصيل.'),
      t('Either way: Arabic and English, and product pages built for a phone.', 'في الحالتين: عربي وإنجليزي، وصفحات منتجات مريحة على الجوال.'),
    ],
    project: 'noble-immersive',
  },
  {
    id: 'immersive',
    title: t('3D Product Experiences', 'عرض المنتجات ثلاثي الأبعاد (3D)'),
    text: t('Your product turns and changes colour before the buyer orders it, as we built for Nasaq.', 'منتجك يدور ويتغير لونه أمام العميل قبل أن يطلبه، كما بنينا لشركة نسق.'),
    image: '/work/nasaq-detail.jpg',
    pricedBy: 'immersive',
    timelineBy: 'immersive',
    points: [
      t('Your product built in 3D from drawings, photos or a sample.', 'نبني منتجك مجسّمًا (3D) من الرسومات أو الصور أو من عيّنة.'),
      t('Turn it, zoom in, change the colour or finish, by mouse or by touch.', 'العميل يحرّكه ويقرّبه ويغيّر لونه أو خامته، بالماوس أو بإصبعه.'),
      t('The buyer’s choices can fill your quote form, as they do on Nasaq.', 'ما يختاره العميل يُكتب تلقائيًا في طلب السعر، كما في موقع نسق.'),
    ],
    project: 'nasaq',
  },
  {
    id: 'landing',
    title: t('Campaign Pages', 'صفحات الإعلانات'),
    text: t('One page for one ad and one goal: the visitor contacts you.', 'صفحة واحدة لإعلان واحد وهدف واحد: أن يتواصل معك الزائر.'),
    image: '/work/rashfa-hero.jpg',
    pricedBy: 'starter',
    timelineBy: 'starter',
    points: [
      t('Built around one offer, so nothing pulls the visitor away from it.', 'كل الصفحة عن عرض واحد، فلا يتشتت الزائر.'),
      t('Made to be the link behind your Instagram, TikTok or Snapchat ad.', 'هي الرابط الذي تضعه في إعلانك على إنستغرام أو تيك توك أو سناب شات.'),
      t('WhatsApp and a short form as the only ways out.', 'لا يخرج منها الزائر إلا بواتساب أو بنموذج قصير.'),
    ],
  },
  {
    id: 'redesign',
    title: t('Website Redesign', 'تجديد موقعك القديم'),
    text: t('We keep what works on your site and rebuild what is costing you customers.', 'نُبقي ما ينفعك في موقعك، ونعيد بناء ما يُضيّع عليك العملاء.'),
    image: '/work/nasaq-extra.jpg',
    pricedBy: 'starter',
    timelineBy: 'signature',
    points: [
      t('Start free: send us the link and get three specific notes on how it works on a phone.', 'البداية مجانية: أرسل الرابط، ويصلك ثلاث ملاحظات واضحة عن شكله وسرعته على الجوال.'),
      t('We move your content across, so you do not start from zero.', 'ننقل محتواك إلى الموقع الجديد، فلا تبدأ من الصفر.'),
      t('Arabic rebuilt properly from right to left, not a translated copy.', 'نبني العربي من اليمين إلى اليسار بشكل صحيح، لا نسخة مترجمة من الإنجليزي.'),
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
  { id: 'ecommerce', label: t('E-Commerce', 'المتاجر الإلكترونية'), image: 'ind-ecommerce', projects: [] },
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
    tagline: t('A site that says who you are and how to reach you.', 'موقع يعرّف الناس بنشاطك ويوصلهم إليك.'),
    audience: t('For a business that needs a tidy, fast site without the extras.', 'لنشاط يحتاج موقعًا مرتبًا وسريعًا، بدون زيادات.'),
    features: [
      t('Professional responsive website', 'موقع احترافي يعمل على الجوال والكمبيوتر'),
      t('Mobile optimization', 'مضبوط ومريح على الجوال'),
      t('Brand & product presentation', 'عرض شركتك ومنتجاتك'),
      t('About section', 'قسم من نحن'),
      t('Contact information', 'معلومات التواصل'),
      t('WhatsApp integration', 'زر واتساب'),
      t('Instagram integration', 'ربط حساب إنستغرام'),
      t('Google Maps', 'موقعك على خرائط Google'),
      t('Domain & hosting', 'اسم الموقع (الدومين) والاستضافة'),
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
    tagline: t('Designed for your brand only, in two languages.', 'موقع مصمم لشركتك وحدها، بلغتين.'),
    audience: t('For a company with a clear identity that wants a site that looks like it.', 'لشركة لها شكل وألوان معروفة، وتريد موقعًا يشبهها.'),
    features: [
      t('Everything in Starter', 'كل ما في Starter'),
      t('Fully custom UI/UX', 'تصميم خاص بك بالكامل'),
      t('Multiple product pages', 'عدة صفحات للمنتجات'),
      t('Arabic + English', 'عربي + إنجليزي'),
      t('Product information', 'تفاصيل المنتجات'),
      t('Image gallery', 'معرض صور'),
      t('Performance optimization', 'موقع سريع وخفيف'),
      t('Basic SEO', 'تجهيز الموقع ليظهر في بحث Google'),
      t('Domain & hosting', 'اسم الموقع (الدومين) والاستضافة'),
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
    tagline: t('Your product in 3D, at the centre of the site.', 'منتجك مجسّمًا (3D) في وسط الموقع.'),
    audience: t('For a product that deserves to be seen from every angle.', 'لمنتج يستحق أن يُرى من كل زاوية.'),
    features: [
      t('Everything in Signature', 'كل ما في Signature'),
      t('Premium custom UI/UX', 'تصميم خاص وفاخر'),
      t('Interactive 3D homepage', 'صفحة رئيسية ثلاثية الأبعاد يتفاعل معها الزائر'),
      t('3D product elements', 'منتجات مجسّمة (3D)'),
      t('Advanced animations', 'حركات متقدمة'),
      t('Cinematic transitions', 'انتقال سلس بين الأقسام، كالأفلام'),
      t('Scroll, mouse & touch interactions', 'يتجاوب مع التمرير والماوس واللمس'),
      t('Advanced product presentation', 'عرض متقدم للمنتجات'),
      t('Domain & hosting', 'اسم الموقع (الدومين) والاستضافة'),
    ],
    cta: t('Choose Immersive', 'اختر Immersive'),
    fromPrice: true,
    timeline: t('3–5 weeks', '3 إلى 5 أسابيع'),
  },
];

/* ── Comparison ───────────────────────────────────────────── */
/** true / false, or a short text value. */
export const comparison: { label: T; values: [boolean | T, boolean | T, boolean | T] }[] = [
  { label: t('Responsive design', 'يعمل على الجوال والكمبيوتر'), values: [true, true, true] },
  { label: t('Custom UI/UX', 'تصميم خاص بك'), values: [false, true, t('Premium', 'فاخر')] },
  { label: t('Arabic + English', 'عربي + إنجليزي'), values: [false, true, true] },
  { label: t('Product pages', 'صفحات المنتجات'), values: [t('Showcase', 'عرض'), t('Multiple', 'متعددة'), t('Advanced', 'متقدمة')] },
  { label: t('SEO', 'الظهور في بحث Google'), values: [false, t('Basic', 'أساسي'), t('Basic', 'أساسي')] },
  { label: t('Performance optimization', 'السرعة'), values: [false, true, true] },
  { label: t('Motion', 'الحركة'), values: [false, t('Subtle', 'خفيفة'), t('Cinematic', 'سينمائية')] },
  { label: t('3D', 'ثلاثي الأبعاد'), values: [false, false, true] },
  { label: t('Advanced interactions', 'تفاعل متقدم مع الزائر'), values: [false, false, true] },
  { label: t('E-commerce', 'متجر إلكتروني'), values: [t('Custom quote', 'بسعر خاص'), t('Custom quote', 'بسعر خاص'), t('Custom quote', 'بسعر خاص')] },
];

/* ── Process ──────────────────────────────────────────────── */
export const processSteps = [
  { title: t('Discover', 'نفهم'), text: t('We ask who your customers are and what makes them buy, and study your current site.', 'نسألك عن عملائك ولماذا يشترون منك، وندرس موقعك الحالي.') },
  { title: t('Design', 'نصمم'), text: t('You see the full design and approve it before we start building.', 'ترى التصميم كاملًا وتوافق عليه قبل أن نبدأ البناء.') },
  { title: t('Build', 'نبني'), text: t('We build it in Arabic and English, and test it on a phone before a laptop.', 'نبنيه بالعربي والإنجليزي، ونجربه على الجوال قبل الكمبيوتر.') },
  { title: t('Launch', 'نطلق'), text: t('We connect your domain and go live. You stay in touch with the person who built it.', 'نربط اسم موقعك ونطلقه. وتبقى على تواصل مع من بناه.') },
];

/* ── Why us ───────────────────────────────────────────────── */
export const reasons = [
  { title: t('Designed around your brand.', 'مصمم لشركتك أنت.'), text: t('No generic templates. Every layout starts from your identity.', 'لا قوالب جاهزة. كل تصميم يبدأ من شكل شركتك وألوانها.') },
  { title: t('Built for real users.', 'مبني لمن يستخدمه فعلًا.'), text: t('Mobile-first, because that is where your customers find you.', 'نبدأ من الجوال، لأن أغلب عملائك يفتحون موقعك منه.') },
  { title: t('Fast by default.', 'سريع من الأساس.'), text: t('Optimised images, lean code and quick loading on any connection.', 'صور خفيفة وبرمجة نظيفة، فيفتح بسرعة حتى مع إنترنت ضعيف.') },
  { title: t('Ready to grow.', 'يكبر معك.'), text: t('Modern technology that can add pages, languages or a store later.', 'مبني بتقنيات حديثة، فتستطيع أن تضيف لاحقًا صفحات أو لغات أو متجرًا.') },
  { title: t('One-on-one communication.', 'تواصل مباشر.'), text: t('You work directly with the people designing and building your site.', 'تتكلم مباشرة مع من يصمم موقعك ويبنيه.') },
];

/* ── FAQ ──────────────────────────────────────────────────── */
export const faqs = [
  {
    q: t('How long does a website take?', 'كم يأخذ بناء الموقع من وقت؟'),
    a: t(
      'Starter takes 1–2 weeks, Signature 2–3 weeks and Immersive 3–5 weeks, counted from the day we have your content. Custom projects get a timeline in the proposal. If we launch more than a week after the agreed date, you get 10% back.',
      'باقة Starter تأخذ أسبوعًا إلى أسبوعين، وباقة Signature من أسبوعين إلى ثلاثة، وباقة Immersive من ثلاثة إلى خمسة أسابيع. نبدأ الحساب من يوم وصول محتواك إلينا. والمشاريع الخاصة نحدد مدتها في العرض. وإن تأخرنا عن الموعد المتفق عليه أكثر من أسبوع، نعيد لك 10٪.',
    ),
  },
  { q: t('Do you provide domain and hosting?', 'هل توفرون اسم الموقع والاستضافة؟'), a: t('Yes. Every package includes domain and hosting setup for the first year.', 'نعم. كل الباقات تشمل اسم الموقع (الدومين) والاستضافة في السنة الأولى.') },
  {
    q: t('What happens after the first year?', 'ماذا يحدث بعد السنة الأولى؟'),
    a: t(
      `The site is yours. From year two you can take the care plan for ${carePlan.price} SAR a month: hosting, domain renewal, small content edits and a monthly check. Or you can host it yourself and we hand everything over.`,
      `الموقع ملكك. من السنة الثانية تستطيع الاشتراك في خدمة ما بعد التسليم بـ${carePlan.price} ريال شهريًا: نتكفل بالاستضافة وتجديد اسم الموقع، ونعدّل لك النصوص والصور البسيطة، ونفحص الموقع كل شهر. أو تديره بنفسك ونسلّمك كل شيء.`,
    ),
  },
  {
    q: t('How does payment work?', 'كيف يتم الدفع؟'),
    a: t(
      `Half before we start and half at launch. Pay by ${paymentMethods.en.charAt(0).toLowerCase() + paymentMethods.en.slice(1)} The price you agree to is the final price; anything extra is quoted before we do it.`,
      `تدفع النصف قبل البدء، والنصف عند تسليم الموقع. طرق الدفع: ${paymentMethods.ar} السعر الذي نتفق عليه هو السعر النهائي، وأي إضافة نخبرك بسعرها قبل أن ننفذها.`,
    ),
  },
  { q: t('Can you build an Arabic website?', 'هل تبنون مواقع بالعربي؟'), a: t('Yes — with proper right-to-left layout, not just translated text. Signature and Immersive include Arabic + English.', 'نعم — مبني من اليمين إلى اليسار بشكل صحيح، وليس مجرد ترجمة. وباقتا Signature وImmersive فيهما العربي والإنجليزي معًا.') },
  { q: t('Can you build an online store?', 'هل تبنون متاجر إلكترونية؟'), a: t(
      'Yes, in two ways. From 4,500 SAR we design your brand site and product pages in front of your existing Salla or Zid store, so payments and shipping stay where they already work. A fully custom store with its own checkout is quoted by products, payment methods and delivery.',
      'نعم، بطريقتين. الأولى من 4,500 ريال: نصمم موقع شركتك وصفحات منتجاتك، ويبقى البيع في متجرك الحالي في سلة أو زد، بالدفع والشحن اللذين فيه. والثانية متجر كامل نبنيه لك بصفحة دفع خاصة به، وسعره حسب المنتجات وطرق الدفع والتوصيل.',
    ),
  },
  { q: t('Can you redesign an existing website?', 'هل تجددون موقعًا قديمًا؟'), a: t('Yes. We keep what works, rebuild what doesn’t, and move your content across.', 'نعم. نُبقي ما ينفعك، ونعيد بناء الباقي، وننقل محتواك إلى الموقع الجديد.') },
  { q: t('Can I request custom features?', 'هل يمكنني طلب إضافات خاصة؟'), a: t('Yes. Anything beyond a package is quoted separately before we start.', 'نعم. أي شيء خارج الباقة نخبرك بسعره قبل أن نبدأ.') },
  { q: t('Do you work with brands anywhere?', 'هل تعملون مع شركات خارج الرياض؟'), a: t('Yes. We work remotely with brands wherever they are.', 'نعم. نعمل عن بُعد مع الشركات أينما كانت.') },
];
