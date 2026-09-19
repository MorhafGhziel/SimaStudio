import type { T } from '@/lib/i18n';

/**
 * Selected work. Client projects are flagged with `client`; the rest are
 * self-initiated concept projects designed and built by the studio — labelled as such everywhere. Screenshots live in
 * /public/work/{slug}-{hero|detail|extra|mobile}.jpg.
 */
export type Project = {
  slug: string;
  number: string;
  name: string;
  arName: string;
  industry: T;
  kind: T;
  summary: T;
  tags: T[];
  services: T[];
  tech: string[];
  year: string;
  live?: string;
  /** Real client work. Everything else is a self-initiated concept. */
  client?: boolean;
  overview: T;
  challenge: T;
  concept: T;
  design: T;
  interactions: { title: T; text: T }[];
};

const t = (en: string, ar: string): T => ({ en, ar });

export const projects: Project[] = [
  {
    slug: 'nasaq',
    number: '01',
    name: 'NASAQ',
    arName: 'نسق',
    client: true,
    industry: t('Uniforms · B2B', 'أزياء موحدة · B2B'),
    kind: t('Brand website + 3D configurator', 'موقع علامة + مصمم ثلاثي الأبعاد'),
    summary: t(
      'A Saudi workwear company: a new identity, a 3D shirt sewn from a real sewing pattern, and a live configurator that turns into a quote request.',
      'شركة أزياء عمل سعودية: هوية جديدة، وقميص ثلاثي الأبعاد مخيط من باترون حقيقي، ومصمم مباشر يتحول إلى طلب عرض سعر.',
    ),
    tags: [t('Client', 'عميل'), t('B2B', 'B2B'), t('3D', 'ثلاثي الأبعاد'), t('Arabic + English', 'عربي + إنجليزي')],
    services: [t('Brand identity', 'الهوية البصرية'), t('3D experience', 'تجربة ثلاثية الأبعاد'), t('Web development', 'تطوير الويب')],
    tech: ['Next.js', 'React Three Fiber', 'GSAP', 'Tailwind CSS', 'TypeScript'],
    year: '2026',
    live: 'https://www.nasaqksa.com/',
    overview: t(
      'Nasaq designs and manufactures uniforms for companies across Saudi Arabia — corporate, healthcare, hospitality, industrial and more. We replaced their existing site with a bilingual experience that sells confidence to procurement teams and lets them see their uniform before they order.',
      'نسق تصمم وتصنّع الأزياء الموحدة للشركات في أنحاء المملكة — القطاع المؤسسي والصحي والضيافة والصناعي وغيرها. استبدلنا موقعهم السابق بتجربة ثنائية اللغة تمنح فرق المشتريات الثقة، وتتيح لهم رؤية زيّهم قبل الطلب.',
    ),
    challenge: t(
      'Uniforms are bought by companies, not shoppers. The site had to work for a procurement manager on a laptop and an owner on a phone, Arabic first, and turn "we are interested" into a specific quote request.',
      'الأزياء الموحدة تشتريها الشركات لا المتسوقون. كان على الموقع أن يخدم مدير مشتريات على حاسوبه وصاحب عمل على هاتفه، بالعربية أولًا، وأن يحوّل "نحن مهتمون" إلى طلب عرض سعر محدد.',
    ),
    concept: t(
      'The shirt is the site. A T-shirt sewn in a cloth simulation from a real sewing pattern sits in the hero, turns under the cursor, and scrolling takes the camera into the fabric, the embroidery and the hem. The same shirt becomes a configurator — colour, embroidery or print, thread and placement — and the choice fills the quote form.',
      'القميص هو الموقع. تيشيرت مخيط في محاكاة قماش من باترون خياطة حقيقي يتصدر الواجهة، يدور مع المؤشر، ومع التمرير تدخل الكاميرا إلى القماش والتطريز والحاشية. القميص نفسه يتحول إلى مصمم — اللون، تطريز أو طباعة، الخيط والموضع — والاختيار يملأ نموذج عرض السعر.',
    ),
    design: t(
      'Paper and ink with a single thread-gold accent, Jost and Alexandria for headlines, a new monoline «نسق» wordmark, and photography for twelve industries from aviation to education.',
      'ورق وحبر مع لون ذهبي واحد كالخيط، وخطا Jost وAlexandria للعناوين، وشعار «نسق» جديد بخط أحادي، وصور لاثني عشر قطاعًا من الطيران إلى التعليم.',
    ),
    interactions: [
      { title: t('The hero shirt', 'قميص الواجهة'), text: t('Drag to turn; scroll zooms into the stitching.', 'اسحب للتدوير؛ التمرير يقرّب إلى الغرز.') },
      { title: t('Studio configurator', 'مصمم الاستوديو'), text: t('Colour, embroidery, thread and placement, straight into a quote.', 'اللون والتطريز والخيط والموضع، مباشرة إلى عرض السعر.') },
      { title: t('Twelve industries', 'اثنا عشر قطاعًا'), text: t('Pinned horizontal scroll on desktop, swipe on mobile.', 'تمرير أفقي مثبت على الحاسوب، وسحب على الجوال.') },
    ],
  },
  {
    slug: 'noble-immersive',
    number: '02',
    name: 'NOBLE Immersive',
    arName: 'نُبل — تجربة غامرة',
    industry: t('Perfume', 'العطور'),
    kind: t('Immersive experience', 'تجربة تفاعلية غامرة'),
    summary: t('A luxury fragrance house told as one cinematic 3D scroll story.', 'دار عطور فاخرة تُروى كقصة سينمائية ثلاثية الأبعاد مع التمرير.'),
    tags: [t('Luxury', 'فخامة'), t('Perfume', 'عطور'), t('3D', 'ثلاثي الأبعاد'), t('Interactive', 'تفاعلي')],
    services: [t('Art direction', 'التوجيه الفني'), t('3D experience', 'تجربة ثلاثية الأبعاد'), t('Web development', 'تطوير الويب')],
    tech: ['Next.js', 'React Three Fiber', 'GSAP ScrollTrigger', 'Motion', 'TypeScript'],
    year: '2026',
    live: 'https://3dperfume.vercel.app/en',
    overview: t(
      'A concept for a perfume house that wanted its website to feel like a fragrance campaign — the bottle is the hero, and every scroll moves the story forward.',
      'مفهوم لدار عطور أرادت أن يبدو موقعها كحملة إعلانية لعطر — القارورة هي البطل، وكل تمريرة تدفع القصة إلى الأمام.',
    ),
    challenge: t(
      'Perfume is sold through the senses. On a screen you cannot smell it, so the site had to make people feel the depth, warmth and craft of each fragrance.',
      'العطر يُباع عبر الحواس. على الشاشة لا يمكن شمّه، لذلك كان على الموقع أن يُشعر الزائر بعمق العطر ودفئه وحِرفيته.',
    ),
    concept: t(
      'One continuous film: the bottle arrives, the brand statement appears, oud, saffron and amber gather around it, and the bottle becomes the product you can add to your bag.',
      'فيلم واحد متصل: تظهر القارورة، ثم تأتي رسالة العلامة، يتجمع العود والزعفران والعنبر حولها، ثم تتحول القارورة إلى منتج يمكن إضافته للسلة.',
    ),
    design: t(
      'Dark cinematic chapters with ivory editorial sections, a champagne accent used sparingly, and bilingual typography that works equally well in Arabic and English.',
      'فصول سينمائية داكنة مع أقسام تحريرية فاتحة، ولمسة شمبانيا مستخدمة بحذر، وخطوط ثنائية اللغة تعمل بنفس الجودة بالعربية والإنجليزية.',
    ),
    interactions: [
      { title: t('Scroll-driven 3D story', 'قصة ثلاثية الأبعاد مع التمرير'), text: t('The camera orbits the bottle while chapters change.', 'الكاميرا تدور حول القارورة مع تغيّر الفصول.') },
      { title: t('Ingredient atmospheres', 'أجواء المكونات'), text: t('Choosing an ingredient changes light, colour and particles.', 'اختيار المكوّن يغيّر الإضاءة والألوان والجزيئات.') },
      { title: t('360° product showroom', 'معرض المنتج 360°'), text: t('Drag, rotate and zoom the bottle on the product page.', 'اسحب وأدر وقرّب القارورة في صفحة المنتج.') },
    ],
  },
  {
    slug: 'noble-store',
    number: '03',
    name: 'NOBLE Store',
    arName: 'نُبل — المتجر',
    industry: t('E-commerce', 'تجارة إلكترونية'),
    kind: t('Online store', 'متجر إلكتروني'),
    summary: t('A bilingual perfume store with search, filters, quick view and a full checkout.', 'متجر عطور ثنائي اللغة مع بحث وتصفية وعرض سريع وإتمام طلب كامل.'),
    tags: [t('E-commerce', 'تجارة إلكترونية'), t('Perfume', 'عطور'), t('Arabic + English', 'عربي + إنجليزي')],
    services: [t('UX design', 'تصميم تجربة المستخدم'), t('E-commerce', 'تجارة إلكترونية'), t('Web development', 'تطوير الويب')],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Motion', 'TypeScript'],
    year: '2026',
    overview: t(
      'The commerce side of NOBLE: twelve fragrances, collections, a scent quiz, wishlist, cart and checkout — Arabic first, English complete.',
      'الجانب التجاري من نُبل: اثنا عشر عطرًا ومجموعات واختبار للعطر المناسب وقائمة مفضلة وسلة وإتمام طلب — العربية أولًا والإنجليزية كاملة.',
    ),
    challenge: t(
      'Luxury and conversion usually pull in opposite directions. The store needed to feel like a fashion house while staying fast and obvious to buy from.',
      'الفخامة وسهولة الشراء غالبًا ما يتعارضان. كان على المتجر أن يبدو كدار أزياء راقية مع بقائه سريعًا وواضحًا للشراء.',
    ),
    concept: t(
      'Editorial storytelling on the home page, then a quiet, focused shopping flow: filters that remember state, quick view from any card, and a two-step checkout.',
      'سرد تحريري في الصفحة الرئيسية، ثم تجربة تسوق هادئة ومركّزة: فلاتر تحفظ الاختيارات، وعرض سريع من أي بطاقة، وإتمام طلب بخطوتين.',
    ),
    design: t(
      'Charcoal and ivory contrast, generous whitespace, large product photography and prices that are clear without shouting.',
      'تباين بين الفحمي والعاجي، ومساحات واسعة، وصور منتجات كبيرة، وأسعار واضحة دون مبالغة.',
    ),
    interactions: [
      { title: t('Search overlay', 'بحث بملء الشاشة'), text: t('Live results in Arabic and English as you type.', 'نتائج فورية بالعربية والإنجليزية أثناء الكتابة.') },
      { title: t('Scent quiz', 'اختبار العطر'), text: t('Three questions recommend a signature fragrance.', 'ثلاثة أسئلة ترشّح لك عطرك المميز.') },
      { title: t('Cart & checkout', 'السلة وإتمام الطلب'), text: t('Coupon codes, delivery options and order confirmation.', 'أكواد خصم وخيارات توصيل وتأكيد الطلب.') },
    ],
  },
  {
    slug: 'najdi-table',
    number: '04',
    name: 'Najdi Table',
    arName: 'مائدة نجد',
    industry: t('Restaurant', 'مطاعم'),
    kind: t('Restaurant website', 'موقع مطعم'),
    summary: t('A modern restaurant with a scannable menu, reservations and WhatsApp at every step.', 'مطعم عصري بمنيو سهل التصفح وحجوزات وواتساب في كل خطوة.'),
    tags: [t('Restaurant', 'مطعم'), t('Reservations', 'حجوزات'), t('Arabic + English', 'عربي + إنجليزي')],
    services: [t('Brand-led design', 'تصميم مستوحى من الهوية'), t('Web development', 'تطوير الويب'), t('SEO', 'تحسين محركات البحث')],
    tech: ['Next.js', 'Tailwind CSS', 'Radix UI', 'Motion', 'TypeScript'],
    year: '2026',
    live: 'https://najdi-table.vercel.app',
    overview: t(
      'A concept for a restaurant serving modern Najdi cuisine — built for guests deciding where to eat tonight, mostly on their phones.',
      'مفهوم لمطعم يقدّم المطبخ النجدي بروح عصرية — مصمم للضيوف الذين يقررون أين يتناولون العشاء الليلة، غالبًا من هواتفهم.',
    ),
    challenge: t(
      'Restaurant sites are often slow PDFs of a menu. Guests want three things fast: what the food looks like, what it costs, and how to book.',
      'مواقع المطاعم غالبًا ملفات منيو بطيئة. الضيف يريد ثلاثة أشياء بسرعة: شكل الطعام، والسعر، وطريقة الحجز.',
    ),
    concept: t(
      'Najdi architecture as the design language — plaster tones, indigo doors and stepped rooflines — with the menu, reservation and WhatsApp always one tap away.',
      'العمارة النجدية كلغة تصميم — ألوان الجص والأبواب النيلية وشرفات السطوح المتدرجة — مع المنيو والحجز وواتساب على بُعد لمسة دائمًا.',
    ),
    design: t(
      'Warm plaster, deep indigo and saffron, stepped parapet dividers between sections, and a menu set in large, readable type.',
      'جص دافئ ونيلي عميق وزعفران، وفواصل على شكل الشرفات النجدية بين الأقسام، ومنيو بخط كبير سهل القراءة.',
    ),
    interactions: [
      { title: t('Menu categories', 'أقسام المنيو'), text: t('Animated tabs that stay sticky while scrolling on mobile.', 'تبويبات متحركة تبقى ظاهرة أثناء التمرير على الجوال.') },
      { title: t('Reservation flow', 'تجربة الحجز'), text: t('Date, time and guests with a clear confirmation state.', 'التاريخ والوقت وعدد الضيوف مع تأكيد واضح.') },
      { title: t('Gallery lightbox', 'معرض الصور'), text: t('Swipe and keyboard navigation through the space and dishes.', 'تنقّل بالسحب ولوحة المفاتيح بين صور المكان والأطباق.') },
    ],
  },
  {
    slug: 'rashfa',
    number: '05',
    name: 'Rashfa',
    arName: 'رشفة',
    industry: t('Café', 'مقاهي'),
    kind: t('Café website', 'موقع مقهى'),
    summary: t('A specialty coffee brand with an editorial, sun-lit identity and a pinned scroll story.', 'علامة قهوة مختصة بهوية تحريرية مشمسة وقصة تتحرك مع التمرير.'),
    tags: [t('Café', 'مقهى'), t('Editorial', 'تحريري'), t('Motion', 'حركة')],
    services: [t('Art direction', 'التوجيه الفني'), t('Web development', 'تطوير الويب'), t('Motion design', 'تصميم الحركة')],
    tech: ['Astro', 'GSAP', 'TypeScript', 'CSS'],
    year: '2026',
    live: 'https://rashfa-nine.vercel.app/',
    overview: t(
      'A concept for a specialty coffee café where the website feels like a lifestyle magazine, not a menu board.',
      'مفهوم لمقهى قهوة مختصة، يبدو موقعه كمجلة أسلوب حياة لا كلوحة منيو.',
    ),
    challenge: t(
      'Cafés compete on atmosphere. The site had to capture the feeling of the place — light, texture, calm — while staying extremely fast on mobile.',
      'المقاهي تتنافس على الأجواء. كان على الموقع أن ينقل إحساس المكان — الضوء والملمس والهدوء — مع بقائه سريعًا جدًا على الجوال.',
    ),
    concept: t(
      'Harsh midday sunlight and long shadows as the art direction, with a pinned signature-drinks chapter that rolls from one drink to the next as you scroll.',
      'ضوء شمس الظهيرة الحاد والظلال الطويلة كتوجيه فني، مع فصل للمشروبات المميزة يتنقل من مشروب لآخر مع التمرير.',
    ),
    design: t(
      'Sand and espresso tones, geometric Kufi for Arabic headlines, a magazine serif for English, and photography that carries the mood.',
      'درجات الرمل والإسبريسو، وخط كوفي هندسي للعناوين العربية، وخط سيريف تحريري للإنجليزية، وصور تحمل المزاج.',
    ),
    interactions: [
      { title: t('Pinned signature drinks', 'المشروبات المميزة المثبتة'), text: t('Scroll rolls the counter and wipes in each drink.', 'التمرير يغيّر الرقم ويكشف كل مشروب.') },
      { title: t('Open-now status', 'حالة الفتح الآن'), text: t('Live opening hours in local time.', 'ساعات عمل مباشرة بالتوقيت المحلي.') },
      { title: t('Mobile action bar', 'شريط الإجراءات للجوال'), text: t('WhatsApp, directions and call, always in reach.', 'واتساب والاتجاهات والاتصال في متناول اليد دائمًا.') },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
