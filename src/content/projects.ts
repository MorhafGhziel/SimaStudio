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
  /** Base path of a short screen recording (`.mp4`, `-poster.jpg`) shown in place of the hero still. */
  video?: string;
  /** What the client actually received. Facts only. */
  deliverables?: T[];
  /** Words that identify this client in an approved review's "brand" field, so the review appears in the case study. */
  reviewBrand?: string[];
  /** Measured outcomes, shown only when filled. Never estimate: add a line only with a number the client gave you. */
  results?: { value: string; label: T }[];
  /** Screenshot of the site we replaced (`/work/…`). Needs the client's permission before it is added. */
  before?: string;
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
    video: '/work/nasaq-loop',
    // Shown with the client's permission (given 20 Sep 2026). Captured from the repo's old main branch.
    before: '/work/nasaq-before.jpg',
    reviewBrand: ['نسق', 'nasaq'],
    deliverables: [
      t('A new logo and visual identity: a one-stroke «نسق» wordmark with a geometric NASAQ lockup.', 'شعار وهوية بصرية جديدة: كلمة «نسق» بخط واحد متصل مع كتابة NASAQ الهندسية.'),
      t('A 3D T-shirt sewn in a cloth simulation from a real sewing pattern, down to the hems and stitching.', 'تيشيرت ثلاثي الأبعاد مخيط في محاكاة قماش من باترون حقيقي، حتى الحواشي والغرز.'),
      t('A live configurator: colour, embroidery or print, thread and placement, feeding the quote request.', 'مصمم مباشر: اللون، والتطريز أو الطباعة، والخيط والموضع، وكلها تصب في طلب عرض السعر.'),
      t('The whole site in Arabic and English, designed right to left first.', 'الموقع كاملًا بالعربية والإنجليزية، ومصمم من اليمين إلى اليسار أولًا.'),
      t('Twelve industries, from aviation to education, each with colour-graded photography.', 'اثنا عشر قطاعًا، من الطيران إلى التعليم، ولكل قطاع صور موحدة المعالجة اللونية.'),
      t('A Saudi National Day page and site-wide banner.', 'صفحة لليوم الوطني السعودي مع شريط يظهر في الموقع كله.'),
    ],
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
    slug: 'liwan',
    number: '02',
    name: 'LIWAN',
    arName: 'ليوان',
    industry: t('Architecture · Real estate', 'العمارة · العقار'),
    kind: t('Architecture site + 3D residence configurator', 'موقع معماري + مصمم مسكن ثلاثي الأبعاد'),
    summary: t(
      'An architecture studio whose house is the interface: a villa drawn entirely in code that you walk through and specify, in Arabic first.',
      'استوديو معماري بيته هو الواجهة: فيلا مرسومة بالكامل بالشيفرة تتجوّل فيها وتختار تشطيباتها، بالعربية أولًا.',
    ),
    tags: [t('Architecture', 'عمارة'), t('Real estate', 'عقار'), t('3D', 'ثلاثي الأبعاد'), t('Arabic-first', 'عربي أولًا')],
    services: [t('Art direction', 'التوجيه الفني'), t('3D experience', 'تجربة ثلاثية الأبعاد'), t('Web development', 'تطوير الويب')],
    tech: ['Next.js', 'React Three Fiber', 'Three.js', 'GSAP', 'TypeScript'],
    year: '2026',
    live: 'https://liwan-studio.vercel.app/ar',
    overview: t(
      'A concept for a Riyadh architecture studio and residential developer. Instead of a gallery of renders, the site opens on the house itself, and the visitor moves through it.',
      'مفهوم لاستوديو معماري ومطوّر سكني في الرياض. بدل معرض صور جاهزة، يفتح الموقع على البيت نفسه، ويتنقّل الزائر داخله.',
    ),
    challenge: t(
      'A villa buyer decides on finishes months before anything is built, from a sample box and a flat drawing. The site had to let them stand inside the house and see each finish in its real light — on a phone, in Arabic.',
      'يختار مشتري الفيلا تشطيباتها قبل شهور من البناء، من علبة عيّنات ومخطط مسطّح. كان على الموقع أن يضعه داخل البيت ليرى كل تشطيب في ضوئه الحقيقي — على الجوال، وبالعربية.',
    ),
    concept: t(
      'One house, modelled from a real plan in metres: walls are extruded outlines with their openings cut through, so a window is a hole with a reveal. Scrolling runs a camera through it — wide, threshold, living, kitchen, pool — and then the same house becomes the configurator.',
      'بيت واحد، مبني من مخطط حقيقي بالمتر: الجدران مقاطع ممتدّة بفتحات مقطوعة فيها، فالنافذة ثقب له عمق. التمرير يقود الكاميرا داخله — من بعيد، ثم العتبة والمعيشة والمطبخ والمسبح — ثم يتحوّل البيت نفسه إلى أداة التخصيص.',
    ),
    design: t(
      'Arabic is the default language with full RTL and its own type: Alexandria for headings, IBM Plex Sans Arabic for reading, Noto Naskh for the editorial line. Ink, paper and a single bronze accent, and a restrained filmic grade on the 3D — no bloom, no blur.',
      'العربية هي اللغة الافتراضية باتجاه كامل من اليمين وخطوط خاصة بها: الإسكندرية للعناوين، و IBM Plex Sans Arabic للقراءة، ونسخ نوتو للسطر التحريري. حبر وورق ولمسة برونزية واحدة، ومعالجة لونية سينمائية هادئة للمشهد ثلاثي الأبعاد — بلا توهّج ولا ضبابية.',
    ),
    interactions: [
      {
        title: t('Scroll-driven camera film', 'فيلم كاميرا مع التمرير'),
        text: t('Four screens of scroll fly the camera from the garden into the house and out to the pool.', 'أربع شاشات من التمرير تنقل الكاميرا من الحديقة إلى داخل البيت ثم إلى المسبح.'),
      },
      {
        title: t('Live finish configurator', 'تخصيص التشطيبات مباشرة'),
        text: t('Walls, window frames, entrance door, flooring, cabinets, countertop and more — each dissolves into the next on the house itself.', 'الجدران وإطارات النوافذ وباب المدخل والأرضيات والخزائن وسطح العمل وغيرها — كل تشطيب يذوب في التالي على البيت نفسه.'),
      },
      {
        title: t('Every surface drawn in code', 'كل سطح مرسوم بالشيفرة'),
        text: t('Stone, oak, marble and plaster are generated as textures at their real size in metres — no downloaded models or texture packs.', 'الحجر والبلوط والرخام واللياسة تُولَّد كخامات بمقاسها الحقيقي بالمتر — بلا نماذج أو خامات جاهزة.'),
      },
    ],
  },
  {
    slug: 'noble-immersive',
    number: '03',
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
    slug: 'rashfa',
    number: '04',
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
