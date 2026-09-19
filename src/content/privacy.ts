import type { T } from '@/lib/i18n';

const t = (en: string, ar: string): T => ({ en, ar });

/**
 * Privacy notice. Every sentence describes what the code actually does (see api/t, api/contact,
 * api/testimonials). If that behaviour changes, change this page in the same commit.
 */
export const privacy = {
  title: t('Privacy', 'الخصوصية'),
  description: t('What this website collects, why, and how to have it deleted.', 'ما الذي يجمعه هذا الموقع، ولماذا، وكيف تطلب حذفه.'),
  updated: '2026-09-20',
  intro: t(
    'Short version: no advertising trackers, no cookies for visitors, and what you send us is used only to answer you.',
    'باختصار: لا أدوات تتبع إعلانية، ولا ملفات ارتباط (كوكيز) للزوار، وما ترسله إلينا نستخدمه للرد عليك فقط.',
  ),
  sections: [
    {
      heading: t('When you send a project request', 'عندما ترسل طلب مشروع'),
      body: t(
        'We store what you type: your name, company, WhatsApp number or email, the service, budget and package you picked, and your message. We also keep the language you used, the first page you opened and your approximate city. We use this to reply to you and to prepare your quote, and for nothing else.',
        'نحفظ ما تكتبه: اسمك، وشركتك، ورقم واتساب أو بريدك الإلكتروني، والخدمة والميزانية والباقة التي اخترتها، ورسالتك. ونحفظ معها اللغة التي استخدمتها، وأول صفحة فتحتها، ومدينتك التقريبية. نستخدم ذلك للرد عليك وإعداد عرض السعر، ولا شيء غير ذلك.',
      ),
    },
    {
      heading: t('When you write to us on WhatsApp', 'عندما تراسلنا عبر واتساب'),
      body: t(
        'The WhatsApp buttons open WhatsApp with a message already written. Nothing is sent until you press send, and from there the conversation is covered by WhatsApp’s own privacy policy.',
        'أزرار واتساب تفتح التطبيق برسالة مكتوبة مسبقًا. لا يُرسل شيء حتى تضغط أنت على الإرسال، وبعدها تخضع المحادثة لسياسة الخصوصية الخاصة بواتساب.',
      ),
    },
    {
      heading: t('When you leave a review', 'عندما تكتب تقييمًا'),
      body: t(
        'We store your name, your company if you give it, your rating and your words. A review appears on the site only after we approve it, exactly as you wrote it. Ask us and we remove it.',
        'نحفظ اسمك، وشركتك إن ذكرتها، وتقييمك وكلماتك. لا يظهر التقييم في الموقع إلا بعد موافقتنا، وكما كتبته تمامًا. وإن طلبت حذفه حذفناه.',
      ),
    },
    {
      heading: t('Visit statistics', 'إحصاءات الزيارات'),
      body: t(
        'We count visits with our own small tool, not Google Analytics or any advertising pixel. It sets no cookies. It records the pages opened, the buttons pressed, the site you came from, your screen size, browser and language, and your approximate city taken from the connection. A random code kept in your browser tells a returning visit from a new one; it is scrambled before it is stored and cannot identify you. We do not store your IP address with these statistics.',
        'نحصي الزيارات بأداة صغيرة من صنعنا، لا عبر Google Analytics ولا أي أداة تتبع إعلانية. لا تضع أي ملفات ارتباط. تسجل الصفحات المفتوحة، والأزرار المضغوطة، والموقع الذي أتيت منه، وحجم شاشتك ومتصفحك ولغتك، ومدينتك التقريبية المأخوذة من الاتصال. ورمز عشوائي محفوظ في متصفحك يميّز الزيارة المتكررة عن الجديدة، ويُشفَّر قبل حفظه ولا يمكن أن يعرّف بك. ولا نحفظ عنوان IP الخاص بك مع هذه الإحصاءات.',
      ),
    },
    {
      heading: t('Protection against abuse', 'الحماية من إساءة الاستخدام'),
      body: t(
        'To stop automated spam, the forms keep a scrambled fingerprint of the connection for a short time and limit how many requests it can send. It is not used for anything else.',
        'لمنع الرسائل الآلية المزعجة، تحتفظ النماذج ببصمة مشفّرة للاتصال لفترة قصيرة، وتحدد عدد الطلبات التي يمكنه إرسالها. ولا تُستخدم لأي غرض آخر.',
      ),
    },
    {
      heading: t('Who handles the data', 'من يتعامل مع البيانات'),
      body: t(
        'The site runs on Vercel, the database is hosted by Neon, and emails are sent through Resend. They process the data only to run this website. We do not sell your data, share it for advertising, or add you to a mailing list.',
        'الموقع مستضاف لدى Vercel، وقاعدة البيانات لدى Neon، والبريد يُرسل عبر Resend. وهي تعالج البيانات لتشغيل هذا الموقع فقط. لا نبيع بياناتك، ولا نشاركها لأغراض إعلانية، ولا نضيفك إلى أي قائمة بريدية.',
      ),
    },
    {
      heading: t('Your rights', 'حقوقك'),
      body: t(
        'Ask us what we hold about you, ask us to correct it, or ask us to delete it. Write to the address below and we do it, normally within a few working days.',
        'اسألنا عمّا نحتفظ به عنك، أو اطلب تصحيحه، أو اطلب حذفه. راسلنا على العنوان أدناه وننفّذ طلبك، عادةً خلال أيام عمل قليلة.',
      ),
    },
  ],
  contact: t('Questions about privacy', 'للاستفسار عن الخصوصية'),
  updatedLabel: t('Last updated', 'آخر تحديث'),
};
