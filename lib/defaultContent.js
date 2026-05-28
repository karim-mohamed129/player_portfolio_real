export const defaultContent = {
  site: {
    title: "Mohamed Hossam | بورتفوليو لاعب كرة قدم",
    description: "Portfolio احترافي للاعب كرة قدم مصري يعرض الإحصائيات، المسيرة، الإنجازات، الصور، وملف CV PDF.",
    faviconUrl: "/favicon.svg",
    logoText: "MH10",
    logoImage: "/logo-mark.svg",
    logoIcon: "football",
    footerText: "© 2026 Mohamed Hossam Portfolio",
    direction: "rtl",
    language: "ar"
  },
  nav: [
    { label: "نظرة عامة", href: "#overview", hidden: false },
    { label: "الإحصائيات", href: "#stats", hidden: false },
    { label: "المسيرة", href: "#career", hidden: false },
    { label: "الصور", href: "#media", hidden: false },
    { label: "التواصل", href: "#contact", hidden: false },
    { label: "إرسال رسالة", href: "#message", hidden: false }
  ],
  hero: {
    tag: "لاعب كرة قدم مصري | القاهرة",
    name: "محمد حسام",
    position: "جناح أيمن هجومي",
    summary: "بورتفوليو احترافي مخصص للأندية ووكلاء اللاعبين، يعرض البيانات الفنية، الإحصائيات، المسيرة، نقاط القوة، والصور الرياضية في صفحة سريعة ومتجاوبة.",
    primaryButtonText: "تحميل الـ CV",
    primaryButtonUrl: "/assets/cv/player-cv.pdf",
    secondaryButtonText: "تواصل مباشر",
    secondaryButtonUrl: "#contact",
    backgroundImage: "/assets/hero/background.jpg",
    playerImage: "/assets/player/profile.webp",
    statusTitle: "Available for Trials",
    statusSubtitle: "Season 2026",
    quickInfo: [
      { icon: "shirt", label: "رقم القميص", value: "10" },
      { icon: "running", label: "المركز", value: "RW / ST" },
      { icon: "flag", label: "الجنسية", value: "مصري" }
    ]
  },
  overview: {
    label: "ملف اللاعب",
    title: "واجهة قوية تقدم اللاعب بشكل احترافي أمام الأندية",
    summary: "الصفحة مصممة لإظهار شخصية اللاعب، قيمته الفنية، ومستوى جاهزيته؛ مع تجربة ممتازة على الموبايل لأن أغلب المشاهدة الأولى من النادي أو الوكيل تكون عبر الهاتف.",
    image: "/assets/sections/overview.jpg",
    rows: [
      { label: "السن", value: "23 سنة" },
      { label: "الطول", value: "178 سم" },
      { label: "الوزن", value: "73 كجم" },
      { label: "القدم المفضلة", value: "اليمنى" },
      { label: "الحالة", value: "جاهز للتعاقد" }
    ]
  },
  stats: {
    label: "أرقام الموسم",
    title: "إحصائيات مختصرة وسريعة القراءة",
    items: [
      { icon: "calendar", value: "34", label: "مباراة" },
      { icon: "target", value: "19", label: "هدف" },
      { icon: "handshake", value: "12", label: "أسيست" },
      { icon: "clock", value: "2960", label: "دقيقة لعب" }
    ]
  },
  skills: {
    label: "نقاط القوة",
    title: "لاعب سريع في التحول الهجومي وصاحب تأثير في الثلث الأخير",
    image: "/assets/sections/skills.jpg",
    items: [
      { label: "السرعة والانطلاق", percent: 93 },
      { label: "المراوغة 1 ضد 1", percent: 88 },
      { label: "إنهاء الهجمات", percent: 84 },
      { label: "الضغط واسترجاع الكرة", percent: 79 }
    ]
  },
  career: {
    label: "المسيرة",
    title: "رحلة اللاعب الكروية",
    items: [
      { year: "2018", title: "مرحلة الناشئين", description: "بداية التطور الفني داخل أكاديمية محلية والتركيز على المهارات الفردية والسرعة.", image: "/assets/career/2018.jpg" },
      { year: "2021", title: "أول موسم تنافسي", description: "مشاركات منتظمة مع الفريق وتحقيق مساهمات تهديفية مؤثرة في أكثر من بطولة.", image: "/assets/career/2021.jpg" },
      { year: "2024", title: "التصعيد للفريق الأول", description: "زيادة دقائق اللعب والمشاركة في مباريات رسمية وودية أمام مستويات أعلى.", image: "/assets/career/2024.jpg" },
      { year: "2026", title: "جاهز للتقييم", description: "ملف احترافي متكامل للأندية يشمل السيرة الذاتية، الإحصائيات، والصور والفيديوهات.", image: "/assets/career/2026.jpg" }
    ]
  },
  achievements: {
    label: "الإنجازات",
    title: "أبرز إنجازات اللاعب",
    items: [
      { icon: "trophy", title: "أفضل لاعب في الشهر", description: "بسبب تأثير هجومي واضح ومعدل مساهمات مرتفع.", image: "/assets/achievements/trophy.jpg" },
      { icon: "medal", title: "هداف الفريق", description: "أعلى عدد مساهمات مباشرة في الأهداف خلال الموسم.", image: "/assets/achievements/scorer.jpg" },
      { icon: "star", title: "معدل التزام قوي", description: "حضور تدريبي منتظم وجاهزية بدنية عالية.", image: "/assets/achievements/commitment.jpg" }
    ]
  },
  media: {
    label: "الصور",
    title: "معرض صور حقيقي",
    summary: "مجموعة مختارة من صور اللاعب داخل الملعب وخارجه لإبراز حضوره ومستواه.",
    items: [
      { image: "/assets/media/gallery-1.jpg", alt: "صورة اللاعب أثناء المباراة" },
      { image: "/assets/media/gallery-2.webp", alt: "صورة تدريبية للاعب" },
      { image: "/assets/media/gallery-3.webp", alt: "صورة احترافية للاعب كرة القدم" }
    ]
  },
  contact: {
    label: "للتواصل والتعاقد",
    title: "متاح للتقييم الفني والتجارب والمفاوضات",
    summary: "يمكن وضع رقم اللاعب أو الوكيل، البريد الرسمي، وروابط الفيديو التحليلي.",
    image: "/assets/contact/contact.jpg",
    email: "agent@example.com",
    phone: "+20 100 000 0000",
    messageLabel: "رسالة مباشرة",
    messageTitle: "نموذج تواصل سريع",
    messageSummary: "اكتب رسالتك بوضوح، وسيتم التواصل معك في أقرب وقت ممكن.",
    messageImage: "/assets/contact/message.webp"
  }
};
