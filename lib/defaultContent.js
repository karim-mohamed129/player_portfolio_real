export const defaultContent = {
  site: {
    title: "Mohamed Hossam | Football Player Portfolio",
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
    backgroundImage: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1800&q=90",
    playerImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=90",
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
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=90",
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
    image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=1000&q=90",
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
      { year: "2018", title: "مرحلة الناشئين", description: "بداية التطور الفني داخل أكاديمية محلية والتركيز على المهارات الفردية والسرعة.", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=700&q=90" },
      { year: "2021", title: "أول موسم تنافسي", description: "مشاركات منتظمة مع الفريق وتحقيق مساهمات تهديفية مؤثرة في أكثر من بطولة.", image: "https://images.unsplash.com/photo-1486286701208-1d58e9338013?auto=format&fit=crop&w=700&q=90" },
      { year: "2024", title: "التصعيد للفريق الأول", description: "زيادة دقائق اللعب والمشاركة في مباريات رسمية وودية أمام مستويات أعلى.", image: "https://images.unsplash.com/photo-1504305754058-2f08ccd89a0a?auto=format&fit=crop&w=700&q=90" },
      { year: "2026", title: "جاهز للتقييم", description: "ملف احترافي متكامل للأندية يشمل السيرة الذاتية، الإحصائيات، والصور والفيديوهات.", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=700&q=90" }
    ]
  },
  achievements: {
    label: "الإنجازات",
    title: "أبرز إنجازات اللاعب",
    items: [
      { icon: "trophy", title: "أفضل لاعب في الشهر", description: "بسبب تأثير هجومي واضح ومعدل مساهمات مرتفع.", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=900&q=90" },
      { icon: "medal", title: "هداف الفريق", description: "أعلى عدد مساهمات مباشرة في الأهداف خلال الموسم.", image: "https://images.unsplash.com/photo-1519766304817-4f37bda74a26?auto=format&fit=crop&w=900&q=90" },
      { icon: "star", title: "معدل التزام قوي", description: "حضور تدريبي منتظم وجاهزية بدنية عالية.", image: "https://images.unsplash.com/photo-1510051640316-cee39563ddab?auto=format&fit=crop&w=900&q=90" }
    ]
  },
  media: {
    label: "الصور",
    title: "معرض صور حقيقي",
    summary: "ارفع صور اللاعب الحقيقية من لوحة التحكم، وسيتم تخزينها على Cloudinary وحفظ روابطها في MongoDB.",
    items: [
      { image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1000&q=90", alt: "لاعب كرة قدم في مباراة" },
      { image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1000&q=90", alt: "لاعبون أثناء مباراة كرة قدم" },
      { image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1000&q=90", alt: "ملعب كرة قدم" }
    ]
  },
  contact: {
    label: "للتواصل والتعاقد",
    title: "متاح للتقييم الفني والتجارب والمفاوضات",
    summary: "يمكن وضع رقم اللاعب أو الوكيل، البريد الرسمي، وروابط الفيديو التحليلي.",
    image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=900&q=90",
    email: "agent@example.com",
    phone: "+20 100 000 0000",
    messageLabel: "رسالة مباشرة",
    messageTitle: "نموذج تواصل سريع",
    messageSummary: "اكتب رسالتك وسيتم حفظها داخل لوحة التحكم في قسم الرسائل.",
    messageImage: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?auto=format&fit=crop&w=900&q=90"
  }
};
