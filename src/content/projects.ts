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
    slug: 'merit',
    number: '01',
    name: 'MERIT',
    arName: 'ميرت',
    client: true,
    industry: t('Fashion · E-commerce', 'أزياء · متجر إلكتروني'),
    kind: t('Fashion store + virtual fitting room', 'متجر أزياء + غرفة قياس افتراضية'),
    summary: t(
      'A Riyadh fashion label: a fitting room where the model puts on the jacket you pick, a full store, and an Arabic site written in Saudi dialect, not translated.',
      'علامة أزياء من الرياض: غرفة قياس يرتدي فيها العارض الجاكيت الذي تختاره، ومتجر كامل، وموقع عربي مكتوب باللهجة السعودية لا مترجم.',
    ),
    tags: [t('Client', 'عميل'), t('Fashion', 'أزياء'), t('E-commerce', 'متجر إلكتروني'), t('Arabic + English', 'عربي + إنجليزي')],
    services: [t('Brand identity', 'الهوية البصرية'), t('Art direction', 'التوجيه الفني'), t('Web development', 'تطوير الويب')],
    tech: ['Next.js', 'GSAP', 'WebGL shaders', 'Alpha video', 'Tailwind CSS', 'TypeScript'],
    year: '2026',
    live: 'https://www.meritbrand.store/',
    reviewBrand: ['merit', 'ميرت'],
    overview: t(
      'MERIT is a contemporary label from Riyadh that makes tailoring, outerwear and knitwear in small counts. The brief was a store that feels like walking into the shop: you try the clothes on before you read about them.',
      'ميرت علامة معاصرة من الرياض تصنع التفصيل والمعاطف والتريكو بكميات قليلة. الفكرة متجر يشعرك أنك داخل المحل: تجرّب الملابس قبل أن تقرأ عنها.',
    ),
    challenge: t(
      'Online, clothes are flat photos on a grid. The site had to show how a jacket actually sits on a body, carry a full shop (filters, bag, sizes, stock), and speak to a Saudi customer in their own Arabic.',
      'الملابس على الإنترنت مجرد صور مسطحة في شبكة. كان على الموقع أن يُظهر كيف يجلس الجاكيت فعلًا على الجسم، وأن يحمل متجرًا كاملًا (فلاتر وسلة ومقاسات ومخزون)، وأن يخاطب العميل السعودي بلهجته.',
    ),
    concept: t(
      'The Fitting Room: the model stands in front of a giant logotype, and clicking a jacket plays him putting it on, swapping it or taking it off. The clips were generated with AI video, then stabilised and cut out frame by frame so he stands in the page. A jacket anatomy with a loupe, a campaign film that plays with the scroll, and the logotype poured in liquid metal follow.',
      'غرفة القياس: العارض يقف أمام شعار ضخم، وبضغطة على جاكيت يرتديه أو يبدّله أو يخلعه أمامك. المقاطع مولّدة بفيديو الذكاء الاصطناعي، ثم ثبّتناها وفصلناها عن الخلفية إطارًا إطارًا ليقف داخل الصفحة. يليها تشريح للجاكيت بعدسة مكبّرة، وفيلم حملة يتحرك مع التمرير، والشعار مسكوبًا كمعدن سائل.',
    ),
    design: t(
      'Black, warm white, stone and graphite; a heavy grotesk and a custom liquid MERIT logotype. The Arabic site is its own voice: Jomhuria for headlines, collections named by meaning (الأساس، الفناء، الفهرس) and copy in white Saudi dialect.',
      'أسود وأبيض دافئ وحجري وجرافيت، وخط غروتسك ثقيل مع شعار MERIT سائل مرسوم خصيصًا. والموقع العربي له صوته الخاص: خط جمهورية للعناوين، ومجموعات بأسماء عربية لها معنى (الأساس، الفناء، الفهرس)، ونصوص باللهجة السعودية البيضاء.',
    ),
    interactions: [
      { title: t('The Fitting Room', 'غرفة القياس'), text: t('Pick a jacket and watch the model put it on.', 'اختر جاكيتًا وشاهد العارض يرتديه.') },
      { title: t('Jacket anatomy', 'تشريح الجاكيت'), text: t('Hotspots and a loupe read every seam and pocket.', 'نقاط وعدسة مكبّرة تشرح كل درزة وكل جيب.') },
      { title: t('A real store', 'متجر حقيقي'), text: t('Filters, sizes, stock, bag and wishlist, honest that nothing is charged.', 'فلاتر ومقاسات ومخزون وسلة ومفضّلة، مع توضيح صريح أن لا شيء يُخصم.') },
    ],
  },
  {
    slug: 'nasaq',
    number: '02',
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
    slug: 'azal',
    number: '03',
    name: 'AZAL',
    arName: 'أزل',
    industry: t('Perfume · E-commerce', 'عطور · متجر إلكتروني'),
    kind: t('Cinematic perfume store', 'متجر عطور سينمائي'),
    summary: t(
      'A fictional perfume house: a painted sky you fall through to reach the bottle, a story of where the scent comes from, and a full working shop from bag to checkout.',
      'دار عطور خيالية: سماء مرسومة تنزل خلالها حتى تصل للقارورة، وقصة من أين يأتي العطر، ومتجر كامل يعمل من الحقيبة حتى إتمام الطلب.',
    ),
    tags: [t('Concept', 'مفهوم'), t('E-commerce', 'متجر'), t('3D renders', 'ريندر ثلاثي الأبعاد'), t('Arabic + English', 'عربي + إنجليزي')],
    services: [t('Art direction', 'التوجيه الفني'), t('3D product renders', 'ريندر المنتج ثلاثي الأبعاد'), t('Web development', 'تطوير الويب'), t('E-commerce UX', 'تجربة المتجر')],
    tech: ['Vite', 'TypeScript', 'GSAP ScrollTrigger', 'Lenis', 'Blender'],
    year: '2026',
    live: 'https://azal-eight.vercel.app/',
    overview: t(
      'A self-initiated concept, not client work. AZAL is a made-up brand; we built it to show that a cinematic story and a real, clear shop can live on one site.',
      'مشروع بمبادرة منا، وليس عملًا لعميل. أزل علامة من خيالنا؛ بنيناها لنثبت أن القصة السينمائية والمتجر الواضح الحقيقي يقدرون يعيشون في موقع واحد.',
    ),
    challenge: t(
      'Luxury perfume sites are often beautiful and hard to buy from. The goal: keep the film, but make price, size and "Add to bag" easy to find on every page, in Arabic and English.',
      'مواقع العطور الفاخرة غالبًا جميلة لكن الشراء منها صعب. الهدف: نحافظ على الفيلم، ونخلي السعر والحجم وزر «أضف إلى الحقيبة» سهلة الوصول في كل صفحة، بالعربي والإنجليزي.',
    ),
    concept: t(
      'Scent as a memory: you fall from a dawn sky through the clouds to the bottle, visit the rose fields and the still, watch the notes fill the bottle layer by layer, and end at dusk.',
      'العطر ذكرى: تنزل من سماء الفجر عبر الغيوم حتى القارورة، تزور حقول الورد والتقطير، تشوف النوتات تملأ القارورة طبقة طبقة، وتنتهي عند الغروب.',
    ),
    design: t(
      'Painted clouds and ingredients made in Blender and finished with a brush-stroke painter, one arched glass bottle with a gold-foil mark in five colourways, Cormorant with Amiri for Arabic.',
      'غيوم ومكونات مصنوعة في بلندر ومرسومة بفرشاة رقمية، وقارورة زجاجية واحدة على شكل قوس بعلامة ذهبية بخمسة ألوان، وخط Cormorant مع Amiri للعربي.',
    ),
    interactions: [
      { title: t('Fall through the sky', 'انزل عبر السماء'), text: t('Layered painted clouds part to reveal the bottle.', 'طبقات غيوم مرسومة تنفتح وتكشف القارورة.') },
      { title: t('Notes that fill the bottle', 'نوتات تملأ القارورة'), text: t('Top, heart and base each bring their own painted ingredients.', 'القمة والقلب والقاعدة، كل طبقة بمكوناتها المرسومة.') },
      { title: t('A real shop flow', 'متجر يشتغل فعلًا'), text: t('Sizes, bag, gift wrap and a demo checkout, with no payment taken.', 'أحجام وحقيبة وتغليف هدية وإتمام طلب تجريبي، بدون أي دفع.') },
    ],
  },
  {
    slug: 'starbucks',
    number: '04',
    name: 'Starbucks (concept)',
    arName: 'ستاربكس (مفهوم)',
    industry: t('Coffee · Retail', 'قهوة · تجزئة'),
    kind: t('Unofficial concept redesign', 'إعادة تصميم غير رسمية (مفهوم)'),
    summary: t(
      'An unofficial concept we made on our own to show what we can do: a two-colour Starbucks site with a real-time 3D cup that flies from the hero and lands in the story. Not commissioned by, affiliated with or endorsed by Starbucks.',
      'مفهوم غير رسمي صممناه بمبادرة منا لنعرض ما نقدر عليه: موقع لستاربكس بلونين فقط، وكوب ثلاثي الأبعاد يطير من الواجهة ويهبط في قسم القصة. لم تطلبه ستاربكس، ولا علاقة لنا بها، ولا تتبناه.',
    ),
    tags: [t('Unofficial concept', 'مفهوم غير رسمي'), t('3D', 'ثلاثي الأبعاد'), t('Motion', 'حركة'), t('E-commerce', 'متجر')],
    services: [t('Art direction', 'التوجيه الفني'), t('3D experience', 'تجربة ثلاثية الأبعاد'), t('Web development', 'تطوير الويب')],
    tech: ['Next.js', 'React Three Fiber', 'GSAP ScrollTrigger', 'Lenis', 'TypeScript'],
    year: '2026',
    live: 'https://starbucks-rebuild.vercel.app/',
    overview: t(
      'A self-initiated showcase, not client work. Starbucks did not contact or commission us; we rebuilt their website as an exercise to show our design and 3D skills. Starbucks, the Siren logo and product names belong to Starbucks Corporation.',
      'مشروع استعراضي بمبادرة منا، وليس عملًا لعميل. لم تتواصل معنا ستاربكس ولم تكلّفنا؛ أعدنا بناء موقعها كتمرين لنعرض مهاراتنا في التصميم والتجارب ثلاثية الأبعاد. ستاربكس وشعار الحورية وأسماء المنتجات ملك لشركة ستاربكس.',
    ),
    challenge: t(
      'Make a famous brand feel new using only its green and cream, with real menu data and real products, and a 3D moment that never covers the content it passes.',
      'أن نجعل علامة مشهورة تبدو جديدة بلونيها الأخضر والكريمي فقط، ببيانات منيو ومنتجات حقيقية، وبلحظة ثلاثية الأبعاد لا تغطي المحتوى الذي تمر بجانبه.',
    ),
    concept: t(
      'One cup, one journey: it lifts off the hero pedestal, tumbles toward the camera, glides beside the drinks and lands softly in the story section.',
      'كوب واحد ورحلة واحدة: يرتفع عن منصة الواجهة، يدور نحو الكاميرا، يمر بجانب المشروبات، ثم يهبط بهدوء في قسم القصة.',
    ),
    design: t(
      'Only two colours, green and cream. Real product photography, a warm serif with a clean sans, and wave edges drawn from the Siren’s hair.',
      'لونان فقط، الأخضر والكريمي. صور منتجات حقيقية، وخط سيريف دافئ مع خط بسيط واضح، وحواف متموجة مستوحاة من شعر الحورية.',
    ),
    interactions: [
      { title: t('Flying 3D cup', 'كوب ثلاثي الأبعاد يطير'), text: t('A planned path that clears every card at 14 screen sizes.', 'مسار مخطط يتفادى كل البطاقات على 14 مقاس شاشة.') },
      { title: t('Focused product carousel', 'عرض منتجات مركّز'), text: t('The chosen product grows; the others blur away.', 'المنتج المختار يكبر، والباقي يتلاشى.') },
      { title: t('Lift the lid, add the sleeve', 'ارفع الغطاء وأضف الغلاف'), text: t('Inspect the cup and the real Insulated Sleeve.', 'افحص الكوب والغلاف المعزول الحقيقي.') },
    ],
  },
  {
    slug: 'noble-immersive',
    number: '05',
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
    number: '06',
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
