import type { T } from '@/lib/i18n';

/**
 * Landing pages that target what people actually search for. Each one is a real page with
 * its own title, description, copy and FAQ — not a thin doorway page. Arabic is written
 * first, because that is the language the searches happen in.
 */

const t = (en: string, ar: string): T => ({ en, ar });

export type LandingSection = { heading: T; body: T };

export type Landing = {
  slug: string;
  /** Used for the <title> and H1. */
  title: T;
  description: T;
  heading: T;
  intro: T[];
  sections: LandingSection[];
  faqs: { q: T; a: T }[];
  /** Project slugs shown as proof at the bottom. */
  projects: string[];
  /** City for local search, when the page is location-specific. */
  city?: T;
};

export const landings: Landing[] = [
  {
    slug: 'web-design-jeddah',
    city: t('Jeddah', 'جدة'),
    title: t('Website Design in Jeddah', 'تصميم مواقع في جدة'),
    description: t(
      'Website design and development for brands in Jeddah — bilingual Arabic and English sites, online stores and interactive experiences, delivered in days.',
      'تصميم وتطوير مواقع للعلامات التجارية في جدة — مواقع ثنائية اللغة ومتاجر إلكترونية وتجارب تفاعلية، تُسلَّم خلال أيام.',
    ),
    heading: t('Website design in Jeddah', 'تصميم مواقع في جدة'),
    intro: [
      t(
        'We design and build websites for brands in Jeddah: cafés, restaurants, perfume houses, fashion labels and service businesses that already have an audience on Instagram and need a home of their own online.',
        'نصمم ونبني مواقع للعلامات التجارية في جدة: المقاهي والمطاعم ودور العطور وعلامات الأزياء والشركات الخدمية التي لديها جمهور على إنستغرام وتحتاج إلى بيت رقمي خاص بها.',
      ),
      t(
        'Every site is built in Arabic and English with a proper right-to-left layout, not a translated copy. We work remotely with Jeddah brands, which keeps the process fast: most projects launch within days rather than months.',
        'كل موقع يُبنى بالعربية والإنجليزية بتصميم صحيح من اليمين إلى اليسار، وليس نسخة مترجمة. نعمل عن بُعد مع علامات جدة، ما يجعل العملية سريعة: معظم المشاريع تُطلق خلال أيام لا أشهر.',
      ),
    ],
    sections: [
      {
        heading: t('Why Jeddah brands need more than Instagram', 'لماذا تحتاج علامات جدة أكثر من إنستغرام'),
        body: t(
          'Instagram introduces your brand; your website is where people decide whether to trust it. A customer who finds your café on Instagram will search for your menu, your location and your opening hours. If there is nothing to find, the decision is made without you.',
          'إنستغرام يعرّف بعلامتك، أما موقعك فهو المكان الذي يقرر فيه الناس إن كانوا يثقون بها. العميل الذي يجد مقهاك على إنستغرام سيبحث عن المنيو والموقع وساعات العمل. وإن لم يجد شيئًا، يُتخذ القرار من دونك.',
        ),
      },
      {
        heading: t('What we build', 'ماذا نبني'),
        body: t(
          'Brand websites, online stores, landing pages for campaigns, and interactive 3D experiences for brands that want to be remembered. Each package includes the domain, hosting setup, mobile optimisation and WhatsApp integration, so you can start receiving enquiries the day it launches.',
          'مواقع للعلامات التجارية، ومتاجر إلكترونية، وصفحات هبوط للحملات، وتجارب تفاعلية ثلاثية الأبعاد للعلامات التي تريد أن تُتذكّر. كل باقة تشمل النطاق وإعداد الاستضافة وتحسين الجوال وربط واتساب، لتبدأ باستقبال الطلبات من يوم الإطلاق.',
        ),
      },
      {
        heading: t('How fast, and what it costs', 'كم تستغرق وكم تكلف'),
        body: t(
          'A Starter site takes two to three days, a fully custom bilingual Signature site two to seven days, and an Immersive 3D experience one to two weeks, once we have your content. Prices start at 2,500 SAR and every package includes domain and hosting for the first year.',
          'موقع Starter يستغرق يومين إلى ثلاثة أيام، وموقع Signature المخصص بالكامل وثنائي اللغة من يومين إلى سبعة أيام، وتجربة Immersive ثلاثية الأبعاد من أسبوع إلى أسبوعين، بعد استلام المحتوى. تبدأ الأسعار من 2,500 ريال وكل باقة تشمل النطاق والاستضافة للسنة الأولى.',
        ),
      },
    ],
    faqs: [
      {
        q: t('Do you meet clients in Jeddah?', 'هل تقابلون العملاء في جدة؟'),
        a: t(
          'We work remotely, which is what keeps delivery this fast. Everything happens over WhatsApp and email — brief, design review, revisions and launch.',
          'نعمل عن بُعد، وهذا ما يجعل التسليم بهذه السرعة. كل شيء يتم عبر واتساب والبريد: الفكرة والمراجعة والتعديلات والإطلاق.',
        ),
      },
      {
        q: t('Can you write the Arabic content?', 'هل يمكنكم كتابة المحتوى بالعربية؟'),
        a: t(
          'We structure and polish what you send, and we design around Arabic first so the typography and layout read naturally. Full copywriting is quoted separately.',
          'ننظّم ونصقل ما ترسله، ونصمم بالعربية أولًا لتبدو الخطوط والتنسيق طبيعية. كتابة المحتوى الكاملة تُسعّر بشكل منفصل.',
        ),
      },
    ],
    projects: ['rashfa', 'najdi-table'],
  },
  {
    slug: 'web-design-riyadh',
    city: t('Riyadh', 'الرياض'),
    title: t('Website Design in Riyadh', 'تصميم مواقع في الرياض'),
    description: t(
      'Website design and development for Riyadh brands — bilingual Arabic and English websites, e-commerce stores and 3D experiences, launched in days.',
      'تصميم وتطوير مواقع لعلامات الرياض — مواقع ثنائية اللغة ومتاجر إلكترونية وتجارب ثلاثية الأبعاد، تُطلق خلال أيام.',
    ),
    heading: t('Website design in Riyadh', 'تصميم مواقع في الرياض'),
    intro: [
      t(
        'Riyadh brands compete on presentation. We design and build websites that match the level of the brand behind them: bilingual, fast, and built around how your customers actually buy.',
        'تتنافس علامات الرياض على العرض والانطباع. نصمم ونبني مواقع بمستوى العلامة التي تقف خلفها: ثنائية اللغة، سريعة، ومبنية حول طريقة شراء عملائك الفعلية.',
      ),
      t(
        'Whether you are opening a restaurant, launching a fragrance line or moving an existing business online, the work starts from your identity rather than a template.',
        'سواء كنت تفتتح مطعمًا أو تطلق خط عطور أو تنقل نشاطًا قائمًا إلى الإنترنت، يبدأ العمل من هويتك لا من قالب جاهز.',
      ),
    ],
    sections: [
      {
        heading: t('Built for Saudi customers', 'مبني للعميل السعودي'),
        body: t(
          'Arabic-first layouts, WhatsApp as a primary contact channel, mobile-first design because that is where almost every visit comes from, and payment and delivery flows that match how people here expect to buy.',
          'تصاميم تبدأ من العربية، وواتساب كقناة تواصل أساسية، وتصميم يبدأ من الجوال لأن معظم الزيارات تأتي منه، ومسارات دفع وتوصيل تناسب توقعات العميل هنا.',
        ),
      },
      {
        heading: t('From brief to launch', 'من الفكرة إلى الإطلاق'),
        body: t(
          'We understand the brand and its audience, design a direction around it, build it, then connect your domain and go live. You work directly with the people designing and building the site — there is no account manager in between.',
          'نفهم العلامة وجمهورها، ونبني توجهًا بصريًا حولها، ثم ننفّذه ونربط نطاقك ونطلق الموقع. تتعامل مباشرة مع من يصمم وينفّذ، بلا وسطاء.',
        ),
      },
    ],
    faqs: [
      {
        q: t('Can you redesign our current website?', 'هل يمكنكم إعادة تصميم موقعنا الحالي؟'),
        a: t('Yes. We keep what works, rebuild what does not, and move your existing content across.', 'نعم. نحتفظ بما ينجح، ونعيد بناء ما لا ينجح، وننقل محتواك الحالي.'),
      },
      {
        q: t('Do you build online stores?', 'هل تبنون متاجر إلكترونية؟'),
        a: t(
          'Yes. Stores are quoted individually because the price depends on the number of products, payment methods and delivery setup.',
          'نعم. تُسعّر المتاجر بشكل مستقل لأن السعر يعتمد على عدد المنتجات وطرق الدفع وإعداد التوصيل.',
        ),
      },
    ],
    projects: ['noble-store', 'noble-immersive'],
  },
  {
    slug: 'ecommerce-website',
    title: t('E-Commerce Website Design', 'تصميم متجر إلكتروني'),
    description: t(
      'Custom online stores designed around your products — bilingual, fast, and built so customers can find, choose and buy without friction.',
      'متاجر إلكترونية مخصصة مصممة حول منتجاتك — ثنائية اللغة وسريعة ومبنية ليجد العميل ما يريد ويشتريه بسهولة.',
    ),
    heading: t('Online stores that sell', 'متاجر إلكترونية تبيع فعلًا'),
    intro: [
      t(
        'A store is judged in seconds: can I see the product clearly, do I trust this brand, and is buying simple. We design around those three questions.',
        'يُحكم على المتجر خلال ثوانٍ: هل أرى المنتج بوضوح، هل أثق بهذه العلامة، وهل الشراء سهل. نصمم حول هذه الأسئلة الثلاثة.',
      ),
      t(
        'Search that works in Arabic and English, filters that remember what you chose, quick product views, and a checkout that does not ask for more than it needs.',
        'بحث يعمل بالعربية والإنجليزية، وفلاتر تحفظ اختياراتك، وعرض سريع للمنتجات، وإتمام طلب لا يطلب أكثر مما يلزم.',
      ),
    ],
    sections: [
      {
        heading: t('What a custom store gives you', 'ماذا يمنحك المتجر المخصص'),
        body: t(
          'Ready-made platforms make every store look the same. A custom store presents your products the way your brand deserves, loads faster, and can grow with new pages, languages or features without being rebuilt.',
          'المنصات الجاهزة تجعل كل المتاجر متشابهة. المتجر المخصص يعرض منتجاتك بما يليق بعلامتك، ويحمّل أسرع، ويمكن أن ينمو بصفحات أو لغات أو خصائص جديدة دون إعادة بناء.',
        ),
      },
      {
        heading: t('How stores are priced', 'كيف تُسعّر المتاجر'),
        body: t(
          'Stores are quoted individually rather than sold as a fixed package, because the work depends on how many products you carry, which payment methods you need and how delivery is handled. Tell us those three things and you get a clear proposal.',
          'تُسعّر المتاجر بشكل مستقل لا كباقة ثابتة، لأن العمل يعتمد على عدد منتجاتك وطرق الدفع المطلوبة وطريقة التوصيل. أخبرنا بهذه الثلاثة وتحصل على عرض واضح.',
        ),
      },
    ],
    faqs: [
      {
        q: t('Can customers pay with Mada or Apple Pay?', 'هل يمكن الدفع عبر مدى أو Apple Pay؟'),
        a: t(
          'Yes — we connect the payment provider you choose, and local methods are part of that setup.',
          'نعم — نربط مزوّد الدفع الذي تختاره، وطرق الدفع المحلية جزء من هذا الإعداد.',
        ),
      },
      {
        q: t('Can I add products myself later?', 'هل أستطيع إضافة منتجات بنفسي لاحقًا؟'),
        a: t('Yes. We set up the store so you can add and edit products without needing us.', 'نعم. نجهّز المتجر لتتمكن من إضافة المنتجات وتعديلها دون الحاجة إلينا.'),
      },
    ],
    projects: ['noble-store'],
  },
  {
    slug: 'restaurant-website',
    title: t('Restaurant & Café Website Design', 'تصميم موقع مطعم أو كافيه'),
    description: t(
      'Websites for restaurants and cafés — a menu people can actually read on their phone, reservations, directions and WhatsApp one tap away.',
      'مواقع للمطاعم والمقاهي — منيو يمكن قراءته فعلًا من الجوال، وحجوزات واتجاهات وواتساب على بُعد لمسة واحدة.',
    ),
    heading: t('Websites for restaurants and cafés', 'مواقع للمطاعم والمقاهي'),
    intro: [
      t(
        'A guest deciding where to eat tonight wants three things quickly: what the food looks like, what it costs, and how to book or get there. Most restaurant websites make all three difficult.',
        'الضيف الذي يقرر أين يتناول العشاء يريد ثلاثة أشياء بسرعة: شكل الطعام، والسعر، وكيفية الحجز أو الوصول. معظم مواقع المطاعم تجعل الثلاثة صعبة.',
      ),
      t(
        'We build the menu as a real part of the website rather than a PDF, with categories that stay visible while scrolling, photography that carries the atmosphere, and booking or WhatsApp always within reach.',
        'نبني المنيو كجزء حقيقي من الموقع لا كملف PDF، بأقسام تبقى ظاهرة أثناء التمرير، وصور تنقل أجواء المكان، وحجز أو واتساب في متناول اليد دائمًا.',
      ),
    ],
    sections: [
      {
        heading: t('Why a PDF menu costs you customers', 'لماذا يكلفك منيو الـ PDF عملاء'),
        body: t(
          'PDFs load slowly, zoom badly on phones, cannot be found by Google and are painful to update. A menu built into the page loads instantly, reads well on any screen, and can appear in search results when someone looks for a dish you serve.',
          'ملفات PDF تحمّل ببطء، وتتكبّر بشكل سيئ على الجوال، ولا تظهر في نتائج Google، وتحديثها متعب. المنيو المدمج في الصفحة يحمّل فورًا، ويُقرأ جيدًا على أي شاشة، ويمكن أن يظهر في البحث حين يبحث أحدهم عن طبق تقدّمه.',
        ),
      },
      {
        heading: t('Built for the evening rush', 'مبني لوقت الذروة'),
        body: t(
          'Most visits happen on a phone, often on mobile data, often while someone is already out. The site is built to open fast in those conditions, with opening hours, directions and a call or WhatsApp button always one tap away.',
          'معظم الزيارات تتم من الجوال، غالبًا عبر بيانات الجوال، وغالبًا والشخص خارج المنزل. الموقع مبني ليفتح بسرعة في هذه الظروف، مع ساعات العمل والاتجاهات وزر الاتصال أو واتساب على بُعد لمسة.',
        ),
      },
    ],
    faqs: [
      {
        q: t('Can we update the menu ourselves?', 'هل نستطيع تحديث المنيو بأنفسنا؟'),
        a: t('Yes. Prices and dishes can be changed without touching the design or calling us.', 'نعم. يمكن تغيير الأسعار والأطباق دون المساس بالتصميم أو الحاجة إلينا.'),
      },
      {
        q: t('Do you handle reservations?', 'هل تتعاملون مع الحجوزات؟'),
        a: t(
          'Yes — a booking flow with date, time and number of guests, or a direct WhatsApp booking if you prefer to handle it by message.',
          'نعم — مسار حجز بالتاريخ والوقت وعدد الضيوف، أو حجز مباشر عبر واتساب إن كنت تفضّل التعامل بالرسائل.',
        ),
      },
    ],
    projects: ['najdi-table', 'rashfa'],
  },
  {
    slug: 'website-redesign',
    title: t('Website Redesign', 'إعادة تصميم موقع'),
    description: t(
      'Turn an outdated website into a modern, fast, bilingual experience — keeping what works and rebuilding what does not.',
      'حوّل موقعًا قديمًا إلى تجربة حديثة وسريعة وثنائية اللغة — نحتفظ بما ينجح ونعيد بناء ما لا ينجح.',
    ),
    heading: t('Redesign, without starting from zero', 'إعادة تصميم، دون البدء من الصفر'),
    intro: [
      t(
        'An old website is rarely worthless. Usually the content is fine and the presentation, speed and mobile experience are what let it down.',
        'الموقع القديم نادرًا ما يكون بلا قيمة. غالبًا يكون المحتوى جيدًا، والمشكلة في العرض والسرعة وتجربة الجوال.',
      ),
      t(
        'We audit what you have, keep the pages that earn their place, rebuild the rest, and move your content across so nothing is lost.',
        'نراجع ما لديك، ونبقي الصفحات التي تستحق البقاء، ونعيد بناء الباقي، وننقل محتواك دون فقدان شيء.',
      ),
    ],
    sections: [
      {
        heading: t('What usually needs fixing', 'ما الذي يحتاج إصلاحًا عادةً'),
        body: t(
          'Slow loading, a layout that breaks on phones, Arabic that was translated rather than designed, no clear way to contact you, and a look that no longer matches the brand.',
          'بطء التحميل، وتصميم ينكسر على الجوال، وعربية مترجمة لا مصممة، وغياب طريقة واضحة للتواصل، ومظهر لم يعد يشبه العلامة.',
        ),
      },
      {
        heading: t('Keeping your search rankings', 'الحفاظ على ترتيبك في البحث'),
        body: t(
          'If your current site already appears in search results, we keep those addresses working by redirecting old pages to their new equivalents, so you do not lose the position you built.',
          'إن كان موقعك الحالي يظهر في نتائج البحث، نحافظ على عناوينه بتحويل الصفحات القديمة إلى ما يقابلها الجديد، حتى لا تخسر ما بنيته من ترتيب.',
        ),
      },
    ],
    faqs: [
      {
        q: t('Will our website go offline during the work?', 'هل سيتوقف موقعنا أثناء العمل؟'),
        a: t('No. The new site is built separately and only replaces the old one at launch.', 'لا. يُبنى الموقع الجديد بشكل منفصل ولا يحل محل القديم إلا عند الإطلاق.'),
      },
    ],
    projects: ['noble-immersive'],
  },
  {
    slug: 'pricing',
    title: t('Website Design Prices in Saudi Arabia', 'أسعار تصميم المواقع في السعودية'),
    description: t(
      'Clear website design prices: what each package includes, how long it takes, and what changes the cost — no hidden fees.',
      'أسعار واضحة لتصميم المواقع: ما تشمله كل باقة، وكم تستغرق، وما الذي يغيّر التكلفة — بلا رسوم مخفية.',
    ),
    heading: t('What a website costs', 'كم يكلف الموقع'),
    intro: [
      t(
        'Most studios hide their prices until you contact them. Ours are published, because you deserve to know whether we fit your budget before you spend time explaining your project.',
        'معظم الاستوديوهات تخفي أسعارها حتى تتواصل معها. أسعارنا منشورة، لأنك تستحق أن تعرف إن كنا نناسب ميزانيتك قبل أن تقضي وقتًا في شرح مشروعك.',
      ),
      t(
        'Three packages cover most brands, and anything outside them is quoted before we start — never added afterwards.',
        'ثلاث باقات تغطي معظم العلامات، وأي شيء خارجها يُسعّر قبل البدء — ولا يُضاف لاحقًا أبدًا.',
      ),
    ],
    sections: [
      {
        heading: t('What changes the price', 'ما الذي يغيّر السعر'),
        body: t(
          'The number of pages, whether you need Arabic and English, whether products are sold directly on the site, and how much motion or 3D the brand calls for. An online store is always quoted individually.',
          'عدد الصفحات، وهل تحتاج العربية والإنجليزية، وهل تُباع المنتجات مباشرة عبر الموقع، وكم تحتاج العلامة من حركة أو عناصر ثلاثية الأبعاد. المتجر الإلكتروني يُسعّر دائمًا بشكل مستقل.',
        ),
      },
      {
        heading: t('What is always included', 'ما هو مشمول دائمًا'),
        body: t(
          'Domain and hosting setup for the first year, mobile optimisation, WhatsApp integration, and a site you own outright. There is no monthly fee unless you ask us to keep maintaining it.',
          'إعداد النطاق والاستضافة للسنة الأولى، وتحسين الجوال، وربط واتساب، وموقع تملكه بالكامل. لا توجد رسوم شهرية إلا إذا طلبت أن نستمر في صيانته.',
        ),
      },
      {
        heading: t('Paying', 'الدفع'),
        body: t(
          'Half before we start and half at launch. You see the design before the second half is due.',
          'نصف المبلغ قبل البدء والنصف عند الإطلاق. ترى التصميم قبل استحقاق النصف الثاني.',
        ),
      },
    ],
    faqs: [
      {
        q: t('Is there a monthly cost?', 'هل هناك تكلفة شهرية؟'),
        a: t(
          'Not by default. Domain and hosting are included for the first year, and after that you only pay if you want us to keep maintaining and updating the site.',
          'ليس بشكل افتراضي. النطاق والاستضافة مشمولان للسنة الأولى، وبعدها تدفع فقط إذا أردت أن نستمر في صيانة الموقع وتحديثه.',
        ),
      },
      {
        q: t('What if I need something not in a package?', 'ماذا لو احتجت شيئًا خارج الباقات؟'),
        a: t('We quote it separately before starting, so the price never changes mid-project.', 'نسعّره بشكل منفصل قبل البدء، حتى لا يتغير السعر في منتصف المشروع.'),
      },
    ],
    projects: ['rashfa', 'noble-store'],
  },
];

export const getLanding = (slug: string) => landings.find((l) => l.slug === slug);
