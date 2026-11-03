export interface ServicePackage {
  id: string;
  title: string;
  titleEn: string;
  price: number;
  depositPercentage: number;
  duration: string;
  category: "bridal" | "engagement" | "evening" | "trial" | "group";
  popular?: boolean;
  active: boolean;
  description: string;
  features: string[];
  badge?: string;
}

export interface AddOnItem {
  id: string;
  title: string;
  price: number;
  description: string;
  popular?: boolean;
}

export interface BookingRecord {
  id: string;
  ref: string;
  clientName: string;
  phone: string;
  packageId: string;
  packageName: string;
  date: string;
  timeSlot: string;
  locationType: "HOTEL_HALL" | "CLIENT_HOME" | "STUDIO";
  venue: string;
  areaId: string;
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  status: "CONFIRMED" | "PENDING_PAYMENT" | "COMPLETED" | "CANCELLED";
  addonIds: string[];
  notes?: string;
  createdAt: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  bookingRef: string;
  clientName: string;
  packageName: string;
  issueDate: string;
  totalAmount: number;
  depositPaid: number;
  remainingBalance: number;
  paymentMethod: "Apple Pay" | "mada" | "تحويل بنكي";
  status: "مدفوع العربون (30%)" | "مسدد بالكامل" | "معلق" | "ملغاة / مسترجعة";
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  tier: "VIP Royal" | "Diamond" | "Gold";
  skinType: string;
  undertone: string;
  allergies?: string;
  favoritePalette: string;
  totalBookings: number;
  lastVisit: string;
  notes: string;
}

export interface ReviewItem {
  id: string;
  clientName: string;
  packageTitle: string;
  rating: number;
  date: string;
  venue: string;
  comment: string;
  approved: boolean;
  featured: boolean;
}

export interface GalleryLook {
  id: string;
  title: string;
  category: "bridal" | "evening" | "soft" | "engagement";
  categoryAr: string;
  image: string;
  clientType: string;
  styleTags: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "bridal-tips" | "skincare" | "trends" | "tutorials";
  categoryAr: string;
  author: string;
  authorRole: string;
  readTime: string;
  publishedAt: string;
  coverImage: string;
  featured?: boolean;
  published: boolean;
  tags: string[];
}

export interface FaqEntry {
  id: string;
  category: "bridal" | "products" | "location" | "trial" | "policies";
  categoryAr: string;
  question: string;
  answer: string;
  keywords: string[];
}

export interface RiyadhArea {
  id: string;
  nameAr: string;
  nameEn: string;
  zone: "شمال الرياض" | "شرق الرياض" | "وسط الرياض" | "غرب الرياض";
  travelFee: number;
}

export const INITIAL_PACKAGES: ServicePackage[] = [
  {
    id: "vip-bridal",
    title: "باقة العروس الملكية VIP",
    titleEn: "Royal Bridal VIP Package",
    price: 2800,
    depositPercentage: 30,
    duration: "٤ إلى ٥ ساعات تفرغ كامل",
    category: "bridal",
    popular: true,
    active: true,
    badge: "الأكثر طلباً للعرائس",
    description:
      "تتضمن الزيارة الخارجية لكافة فنادق وقصور أفراح الرياض، رموش Mink 3D مخصصة، عناية متكاملة قبل المكياج، وحقيبة رتوش فاخرة هدية (بقيمة ٤٥٠ ر.س).",
    features: [
      "حضور حصري لعروس واحدة يومياً لضمان التفرغ الملكي التام",
      "تهيئة كورية مكثفة للبشرة والمساج اللمفاوي قبل تطبيق الفاونديشن",
      "تقنية التثبيت الهيدروليكي المقاوم للدموع والأضواء السينمائية حتى ١٨ ساعة",
      "حقيبة رتوش فاخرة متكاملة تشمل أحمر الشفاه وبودرة التثبيت هدية",
      "تركيب رموش Mink ثلاثية الأبعاد خفيفة الوزن ومخصصة لمورفولوجيا العين",
      "شاملة رسوم الانتقال لكافة أحياء وقصور وفنادق مدينة الرياض",
    ],
  },
  {
    id: "milkah-engagement",
    title: "باقة الملكة والخطوبة الفاخرة",
    titleEn: "Luxury Engagement & Milkah",
    price: 1400,
    depositPercentage: 30,
    duration: "ساعتان ونصف",
    category: "engagement",
    active: true,
    badge: "إطلالة ملكية ناعمة",
    description:
      "إطلالة ملكية ناعمة مصممة لأضواء الحفل والتصوير الفوتوغرافي عالي الدقة. رموش فاخرة مع مستحضرات تثبيت مضادة للتعرق تدوم ١٦ ساعة.",
    features: [
      "تغطية مخملية خفيفة تبرز إشراقة الملامح دون لمعان زيتي",
      "مكياج عيون ساحر متناغم مع لون فستان الحفل والمجوهرات",
      "رموش طبيعية فاخرة تمنح العين عمقاً وتألقاً في لقطات الفيديو 4K",
      "جلسة ترطيب عميقة قبل المكياج مع فيكس بلس لتثبيت فائق",
      "خدمة الحضور للجناح الفندقي أو منزل العروس داخل الرياض",
    ],
  },
  {
    id: "evening-vip",
    title: "مكياج السهرات والمناسبات VIP",
    titleEn: "Evening VIP Glam",
    price: 850,
    depositPercentage: 30,
    duration: "ساعة ونصف",
    category: "evening",
    active: true,
    badge: "لسيدات النخبة",
    description:
      "مكياج سهرة كامل مع كونتورينغ سينمائي يبرز الملامح وألوان ناعمة متناسقة مع فستان السهرة، يشمل رموش طبيعية متعددة الطبقات.",
    features: [
      "نحت ونضارة كونتور الوجه بأحدث تقنيات Dior Backstage",
      "ظلال عيون برونزية أو سموكي ناعم بحسب اختياركِ",
      "تثبيت حراري متقدم يدوم طوال سهرة الحفل",
      "مستحضرات أصلية ١٠٠٪ لطيفة على البشرة الحساسة",
    ],
  },
  {
    id: "soft-glam",
    title: "مكياج ناعم وطبيعي (Soft Glam)",
    titleEn: "Soft Glam & Natural Glow",
    price: 650,
    depositPercentage: 30,
    duration: "ساعة وربع",
    category: "evening",
    active: true,
    description:
      "إطلالة ناعمة بأسلوب اللامكياج الفاخر تبرز نضارة البشرة مع لمسات إضاءة خافتة وأحمر شفاه طبيعي يدوم طويلاً.",
    features: [
      "توحيد خفيف ومشرق للون البشرة",
      "إبراز طبيعي لملامح العين والحواجب شعرة بشعرة",
      "جلوس وأحمر شفاه نيود بألوان تتماشى مع لون البشرة",
    ],
  },
  {
    id: "bridal-trial",
    title: "جلسة التجربة والاستشارة (Bridal Trial)",
    titleEn: "Bridal Trial & Consultation",
    price: 550,
    depositPercentage: 30,
    duration: "ساعتان كاملتان",
    category: "trial",
    active: true,
    description:
      "جلسة خاصة بالأكاديمية لتجربة رسمة العين ودرجات الفاونديشن وتنسيق الإطلالة المكتملة مع فستان الزفاف وتفاصيل الطرحة.",
    features: [
      "تجربة درجات الشفاه والفاونديشن تحت درجات إضاءة مختلفة",
      "تدوين ملف الجمال الخاص بكِ لتوثيق المستحضرات المختارة حرفياً",
      "استشارة متخصصة لمواءمة الإطلالة مع تسريحة الشعر وتصميم الفستان",
    ],
  },
  {
    id: "companions-group",
    title: "باقة المرافقات وأهل العروس",
    titleEn: "Bridal Companions & Family",
    price: 500,
    depositPercentage: 30,
    duration: "ساعة لكل مرافقة",
    category: "group",
    active: true,
    description:
      "مكياج سهرة راقٍ لأهل العروس ومرافقاتها بنفس معايير الفخامة والتعقيم مع خصم إضافي للمجموعات.",
    features: [
      "تنسيق إطلالات متناغمة ومتميزة لكل مرافقة",
      "خصم إضافي ١٠٪ عند حجز ٣ مرافقات فأكثر مع العروس",
      "مستحضرات عالمية فاخرة ومقاومة للتعرق",
    ],
  },
];

export const INITIAL_ADDONS: AddOnItem[] = [
  {
    id: "addon_hair",
    title: "مصففة شعر ملكية مرافقة من الفريق",
    price: 500,
    description: "تسريحة شعر متكاملة للعروس من خبيرة متخصصة ومصاحبة لجلسة المكياج.",
    popular: true,
  },
  {
    id: "addon_facial",
    title: "جلسة ترطيب كوري مكثفة (Glass Skin Facial)",
    price: 250,
    description: "تهيئة عميقة للبشرة بالكولاجين وحمض الهيالورونيك والمساج اللمفاوي.",
  },
  {
    id: "addon_hall_escort",
    title: "مرافقة القاعة ورتوش الزفة حتى خروج العروس",
    price: 800,
    description: "تواجد شخصي في جناح قاعة الفرح للرتوش، تعديل أحمر الشفاه وتثبيت الطرحة قبل الزفة.",
  },
  {
    id: "addon_body_glow",
    title: "تغطية ونضارة الرقبة والديكولتيه (Body Glow)",
    price: 300,
    description: "توحيد لون البشرة وإضاءة مخملية ناعمة مقاومة لانتقال اللون على قماش الفستان.",
  },
  {
    id: "addon_escort",
    title: "مكياج مرافقة إضافية (أخت العروس / الوالدة)",
    price: 450,
    description: "مكياج سهرة متكامل لمرافقة واحدة أثناء جلسة تجهيز العروس.",
  },
];

export const INITIAL_AREAS: RiyadhArea[] = [
  { id: "area_hitin", nameAr: "حطين والملقا والنرجس", nameEn: "Hittin, Malqa, Narjis", zone: "شمال الرياض", travelFee: 0 },
  { id: "area_yasmin", nameAr: "الياسمين والصحافة والعقيق", nameEn: "Alyasmin, Sahafa, Aqeeq", zone: "شمال الرياض", travelFee: 0 },
  { id: "area_nakheel", nameAr: "النخيل والرحمانية والمعذر", nameEn: "Nakheel, Rahmaniyah, Maather", zone: "شمال الرياض", travelFee: 0 },
  { id: "area_hotels_vip", nameAr: "فنادق الرياض الكبرى (الريتز، فورسيزونز، الفيصلية)", nameEn: "Luxury Hotels (Ritz, Four Seasons, Faisaliah)", zone: "وسط الرياض", travelFee: 0 },
  { id: "area_east", nameAr: "اليرموك وقرطبة والحمراء والروضة", nameEn: "East Riyadh (Qurtubah, Hamra)", zone: "شرق الرياض", travelFee: 150 },
  { id: "area_west", nameAr: "لبن وعرقة والسفارات والدرعية", nameEn: "West Riyadh (Irqah, Diplomatic Quarter, Diriyah)", zone: "غرب الرياض", travelFee: 150 },
  { id: "area_south", nameAr: "جنوب الرياض والأحياء البعيدة", nameEn: "South Riyadh", zone: "وسط الرياض", travelFee: 250 },
];

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: "b-01",
    ref: "AK-2025-5038",
    clientName: "سارة الفهيد",
    phone: "0551234567",
    packageId: "vip-bridal",
    packageName: "باقة العروس الملكية VIP",
    date: "2025-10-09",
    timeSlot: "عصراً (02:30 م)",
    locationType: "HOTEL_HALL",
    venue: "فندق الريتز-كارلتون، الرياض — الجناح الملكي 412",
    areaId: "area_hotels_vip",
    totalAmount: 3550,
    depositAmount: 1065,
    remainingAmount: 2485,
    status: "CONFIRMED",
    addonIds: ["addon_hair", "addon_facial"],
    notes: "بشرة جافة، تفضل كونتور ناعم وألوان نيود روز مع رموش طبيعية.",
    createdAt: "2025-10-01T10:00:00Z",
  },
  {
    id: "b-02",
    ref: "AK-2025-4819",
    clientName: "نورة بنت مساعد آل سعود",
    phone: "0509876543",
    packageId: "bridal-trial",
    packageName: "جلسة الاستشارة وتجربة المكياج",
    date: "2025-10-09",
    timeSlot: "صباحاً (11:00 ص)",
    locationType: "STUDIO",
    venue: "أتيليه أماني خليل الخاص — جناح الاستشارات رقم 1",
    areaId: "area_hitin",
    totalAmount: 550,
    depositAmount: 165,
    remainingAmount: 385,
    status: "COMPLETED",
    addonIds: [],
    notes: "تم الاتفاق على لوك العرس النهائي وتوثيق المنتجات.",
    createdAt: "2025-10-02T14:30:00Z",
  },
  {
    id: "b-03",
    ref: "AK-2025-3921",
    clientName: "سمو الأميرة ريم بن فهد",
    phone: "0543219876",
    packageId: "evening-vip",
    packageName: "مكياج سهرة VIP ملكي",
    date: "2025-10-09",
    timeSlot: "مساءً (06:45 م)",
    locationType: "HOTEL_HALL",
    venue: "فندق فورسيزونز، برج المملكة — قاعة كبار الشخصيات",
    areaId: "area_hotels_vip",
    totalAmount: 1150,
    depositAmount: 345,
    remainingAmount: 805,
    status: "CONFIRMED",
    addonIds: ["addon_body_glow"],
    notes: "فستان كحلي داكن، تفضل سموكي برونزي ولمسة ذهبية.",
    createdAt: "2025-10-04T09:15:00Z",
  },
  {
    id: "b-04",
    ref: "AK-2025-2814",
    clientName: "العنود الشمري",
    phone: "0561122334",
    packageId: "vip-bridal",
    packageName: "باقة العروس الملكية VIP",
    date: "2025-11-28",
    timeSlot: "عصراً (02:00 م)",
    locationType: "HOTEL_HALL",
    venue: "قصر الثقافة، حي السفارات",
    areaId: "area_west",
    totalAmount: 3600,
    depositAmount: 1080,
    remainingAmount: 2520,
    status: "PENDING_PAYMENT",
    addonIds: ["addon_hall_escort"],
    notes: "بانتظار سداد العربون المتبقي.",
    createdAt: "2025-10-08T18:00:00Z",
  },
  {
    id: "b-05",
    ref: "AK-2025-1992",
    clientName: "د. رزان المقرن",
    phone: "0559988776",
    packageId: "milkah-engagement",
    packageName: "باقة الملكة والخطوبة الفاخرة",
    date: "2025-12-12",
    timeSlot: "مساءً (04:30 م)",
    locationType: "CLIENT_HOME",
    venue: "فيلا خاصة، حي النخيل الغربي",
    areaId: "area_nakheel",
    totalAmount: 1400,
    depositAmount: 420,
    remainingAmount: 980,
    status: "PENDING_PAYMENT",
    addonIds: [],
    createdAt: "2025-10-09T08:00:00Z",
  },
];

export const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: "inv-01",
    invoiceNumber: "INV-2025-0891",
    bookingRef: "AK-2025-5038",
    clientName: "سارة الفهيد",
    packageName: "باقة العروس الملكية VIP",
    issueDate: "2025-10-01",
    totalAmount: 3550,
    depositPaid: 1065,
    remainingBalance: 2485,
    paymentMethod: "Apple Pay",
    status: "مدفوع العربون (30%)",
  },
  {
    id: "inv-02",
    invoiceNumber: "INV-2025-0890",
    bookingRef: "AK-2025-4819",
    clientName: "نورة بنت مساعد آل سعود",
    packageName: "جلسة الاستشارة وتجربة المكياج",
    issueDate: "2025-10-02",
    totalAmount: 550,
    depositPaid: 550,
    remainingBalance: 0,
    paymentMethod: "mada",
    status: "مسدد بالكامل",
  },
  {
    id: "inv-03",
    invoiceNumber: "INV-2025-0889",
    bookingRef: "AK-2025-3921",
    clientName: "سمو الأميرة ريم بن فهد",
    packageName: "مكياج سهرة VIP ملكي",
    issueDate: "2025-10-04",
    totalAmount: 1150,
    depositPaid: 345,
    remainingBalance: 805,
    paymentMethod: "تحويل بنكي",
    status: "مدفوع العربون (30%)",
  },
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: "c-01",
    name: "سارة الفهيد",
    phone: "0551234567",
    tier: "VIP Royal",
    skinType: "جافة وحساسة",
    undertone: "دافئ (Warm Golden)",
    allergies: "حساسية من الزيوت العطرية الثقيلة",
    favoritePalette: "Tom Ford Nude Dip & Charlotte Tilbury Pillow Talk",
    totalBookings: 2,
    lastVisit: "2025-10-09",
    notes: "عروس راقية، تم تخصيص فاونديشن Dior Backstage مع مرطب كوري مضاعف.",
  },
  {
    id: "c-02",
    name: "نورة بنت مساعد آل سعود",
    phone: "0509876543",
    tier: "Diamond",
    skinType: "مختلطة نضرة",
    undertone: "محايد (Neutral)",
    favoritePalette: "Dior Warm Neutrals & NARS Orgasm",
    totalBookings: 3,
    lastVisit: "2025-10-09",
    notes: "تفضل الآيلاينر المجنح الناعم جداً والشفاه اللامعة مع كونتورينغ خفيف.",
  },
  {
    id: "c-03",
    name: "سمو الأميرة ريم بن فهد",
    phone: "0543219876",
    tier: "VIP Royal",
    skinType: "عادية",
    undertone: "دافئ زيتوني (Warm Olive)",
    favoritePalette: "Hourglass Ambient Lighting & Huda Beauty Rose Quartz",
    totalBookings: 5,
    lastVisit: "2025-10-09",
    notes: "عميلة دائمة لمناسبات القصور؛ تعتمد على ذوق أماني الكامل في اختيار الإطلالة.",
  },
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-01",
    clientName: "العروس حصة السبيعي",
    packageTitle: "باقة العروس الملكية VIP",
    rating: 5,
    date: "أكتوبر 2025",
    venue: "فندق الفورسيزونز، الرياض",
    comment:
      "أماني إنسانة وفنانة قبل كل شيء. تعامل راقٍ وهدوء أعصاب بث فيني الطمأنينة بيوم زفافي. المكياج استمر ثابت من الظهر لين الساعة ٤ الصباح وما تحرك ولا تأكسد، والكل انبهر بنضارة البشرة!",
    approved: true,
    featured: true,
  },
  {
    id: "rev-02",
    clientName: "ديمة آل الشيخ",
    packageTitle: "مكياج السهرات والمناسبات VIP",
    rating: 5,
    date: "سبتمبر 2025",
    venue: "قاعة نيارة الملكية",
    comment:
      "أفضل ميكب أرتست بالرياض بدون منازع. دقة المواعيد، نظافة وتعقيم الفرش أمام عيني، وفهمها لملامح الوجه بدون أي تغيير شاذ للمظهر. شكرًا أماني من كل قلبي.",
    approved: true,
    featured: true,
  },
  {
    id: "rev-03",
    clientName: "العروس شهد التميمي",
    packageTitle: "باقة العروس الملكية VIP",
    rating: 5,
    date: "سبتمبر 2025",
    venue: "فندق الريتز-كارلتون",
    comment:
      "تفرغ أماني لعروس واحدة باليوم كان السبب الرئيسي لاختياري لها. حسيت باهتمام استثنائي وحقيبة الرتوش الفاخرة أنقذتني بالقاعة. فخورة جدًا بالنتيجة.",
    approved: true,
    featured: true,
  },
  {
    id: "rev-04",
    clientName: "منى القحطاني",
    packageTitle: "باقة الملكة والخطوبة الفاخرة",
    rating: 5,
    date: "أغسطس 2025",
    venue: "منزل العروس — حي حطين",
    comment:
      "شغل نظيف وفخم ويواجه! الصور والفيديو طلعت خيالية وكأنها غلاف مجلة. الكل سألني عن سر لمعان البشرة.",
    approved: true,
    featured: false,
  },
];

export const INITIAL_GALLERY: GalleryLook[] = [
  {
    id: "look-01",
    title: "مكياج العروس الملكي (Royal Glow)",
    category: "bridal",
    categoryAr: "عرائس ملكي",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBsAGcs_awev92ZT2Mi6dY05VdBYQcCp-1Rf3SyuGFcSlRMD7Xu1bQ5ToymWmKy55wAfmdv17GExTP1qCaSNdhNMgrLkhBmHJy-SroDXt_nljfrgMWsxhW9j7CFapkyPhw28yOSjKJ0PHJLUgdTk6jfXXyqoHiejneKWotopn52bA_7X0IogtOStcGbYH21Zq6aQ5pNHJc5rHDn73aDMKCXwbsiDDqYfAsfHcRxLQ",
    clientType: "عروس فندق الريتز-كارلتون",
    styleTags: ["بشرة زجاجية", "آيلاينر كلاسيكي", "أحمر شفاه نيود روز"],
  },
  {
    id: "look-02",
    title: "مكياج سهرة مخملي (Velvet Bronze Glam)",
    category: "evening",
    categoryAr: "سهرة فخم",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXp0r6-80w5LhQcR3i-GfUf09Z7k08zI8Gj9g0Y6mI4xN8-L5h0J0y8k2a0oM6p3u4w8t1y0e9r8t7y6u5i4o3p2a1s0d9f8g7h6j5k4l3z2x1c0v9b8n7m6",
    clientType: "حفل قاعة نيارة",
    styleTags: ["سموكي برونزي", "كونتورينغ سينمائي", "رموش ثلاثية الأبعاد"],
  },
  {
    id: "look-03",
    title: "إطلالة ملكة ناعمة (Soft Pearl Bridal)",
    category: "engagement",
    categoryAr: "خطوبة وملكة",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH1N1YF4z175y2VjU2vC9J7gq4m6m8z110b2h1g6y8x2k1l0p9o8i7u6y5t4r3e2w1q0p9o8i7u6y5t4r3e2w1q0p9o8i7u6y5t4r3e2w1",
    clientType: "حفل عقد قران خاص",
    styleTags: ["تغطية ناعمة", "إشراقة وردية", "حواجب شعرة بشعرة"],
  },
  {
    id: "look-04",
    title: "لوك اللامكياج الفاخر (Dewy Clean Glam)",
    category: "soft",
    categoryAr: "ناعم وطبيعي",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-61K56j0s7Q8-F9w0Z8k3-4m8v7y1X9j2K0l4p8o1i6u0y4t8r2e6w0q4p8o2i6u0y4t8r2e6w0q4p8o2i6u0y4t8r2e6w0q4",
    clientType: "جلسة تصوير خاصة",
    styleTags: ["بشرة نضرة", "شفاه جلوس كرزي", "إضاءة خافتة"],
  },
];

export const INITIAL_FAQS: FaqEntry[] = [
  {
    id: "faq-01",
    category: "bridal",
    categoryAr: "حجوزات العرائس وتأكيد الموعد",
    question: "متى يُفضل حجز موعد الزفاف لضمان توفر التاريخ؟",
    answer:
      "نوصي بحجز الموعد قبل موعد زفافكِ بمدة تتراوح بين ٣ إلى ٦ أشهر، لا سيما في موسم الأعراس الرئيسي بالرياض (أكتوبر حتى مايو). نظراً لالتزامنا بتقديم أعلى درجات الفخامة فإننا نستقبل عروساً واحدة فقط يومياً لضمان التفرغ الكامل لإطلالتكِ الملكية.",
    keywords: ["تاريخ", "توفر", "حجز", "موعد", "زفاف", "عروس", "قبل"],
  },
  {
    id: "faq-02",
    category: "bridal",
    categoryAr: "حجوزات العرائس وتأكيد الموعد",
    question: "هل يشمل حجز العروس مرافقة خبيرة التجميل للقاعة للرتوش؟",
    answer:
      "تشمل باقة العروس الملكية VIP التواجد الكامل بالجناح الفندقي حتى إنهاء كافة التفاصيل وخروج العروس باتجاه القاعة أو جلسة التصوير. كما تتوفر خدمة مرافقة القاعة قبل الزفة كإضافة خاصة (Add-on) بقيمة ٨٠٠ ر.س تشمل ضبط الروج، وتثبيت البودرة، وتأمين الطرحة والرموش حتى الزفة.",
    keywords: ["مرافقة", "رتوش", "قاعة", "فندق", "باقة", "زفة"],
  },
  {
    id: "faq-03",
    category: "bridal",
    categoryAr: "حجوزات العرائس وتأكيد الموعد",
    question: "كم تستغرق جلسة مكياج العروس يوم الزفاف؟",
    answer:
      "نخصص ما بين ساعتين ونصف إلى ٣ ساعات كاملة مكرسة لإطلالة العروس، مقسمة بين: تهيئة البشرة والترطيب العميق بالكولاجين (30 دقيقة)، نحت وتغطية الملامح ومكياج العيون والرموش (90 دقيقة)، وتثبيت الطرحة ومراجعة الإضاءة والتصوير والرتوش (45 دقيقة).",
    keywords: ["كم", "مدة", "وقت", "تستغرق", "جلسة", "تجهيز", "ترطيب"],
  },
  {
    id: "faq-04",
    category: "bridal",
    categoryAr: "حجوزات العرائس وتأكيد الموعد",
    question: "كيف يتم تثبيت الموعد النهائي وما هو العربون المطلوب؟",
    answer:
      "يتم تأكيد وتثبيت الحجز النهائي فور سداد عربون ٣٠٪ من إجمالي قيمة الباقة المختارة عن طريق قنوات الدفع الرسمية المعتمدة (مدى، Apple Pay، أو تحويل بنكي). ويتم إرسال عقد حجز إلكتروني رسمي وموثق فورياً عبر الواتساب لضمان حقوقكِ كاملة.",
    keywords: ["عربون", "دفع", "سداد", "تثبيت", "موعد", "عقد", "واتساب", "تحويل"],
  },
  {
    id: "faq-05",
    category: "products",
    categoryAr: "المستحضرات وثبات المكياج",
    question: "ما هي الماركات العالمية المستخدمة في جلسات المكياج؟",
    answer:
      "نعتمد حصرياً على مستحضرات أصلية ١٠٠٪ مستوردة من أرقى دور التجميل العالمية الرائدة: Dior Backstage, Charlotte Tilbury, Tom Ford Beauty, NARS Cosmetics, Laura Mercier, Huda Beauty, Hourglass.",
    keywords: ["ماركات", "مستحضرات", "ديور", "توم فورد", "شارلوت", "نارس", "براندات"],
  },
  {
    id: "faq-06",
    category: "products",
    categoryAr: "المستحضرات وثبات المكياج",
    question: "هل تدوم إطلالة المكياج تحت حرارة وإضاءة قاعات الأفراح بالرياض؟",
    answer:
      "نعم بكل تأكيد. نعتمد تقنية التثبيت الهيدروليكي المزدوج Hydra-Lock™ المدعمة ببودرة التثبيت المجهرية المقاومة للرطوبة وحرارة الأضواء وتصوير الـ 4K، مما يضمن ثباتاً ونضارة تتجاوز ١٨ ساعة دون أكسدة أو تكتل أو لمعان دهني.",
    keywords: ["ثبات", "حرارة", "قاعات", "إضاءة", "تصوير", "تعرق", "18 ساعة"],
  },
  {
    id: "faq-07",
    category: "products",
    categoryAr: "المستحضرات وثبات المكياج",
    question: "بشرتي حساسة ومعرضة للحبوب، هل المستحضرات آمنة تماماً؟",
    answer:
      "سلامة بشرتكِ أولويتنا المطلقة. كافة المستحضرات المختارة غير مسدة للمسام إطلاقاً (Non-comedogenic) وخالية من العطور المهيجة. كما نتبع بروتوكول تعقيم طبي يشمل تعقيم الفرش بمحاليل طبية متخصصة وأشعة UV واستخدام أدوات تطبيق أحادية الاستخدام.",
    keywords: ["بشرة", "حساسة", "حبوب", "مسام", "تعقيم", "فرش", "طبية"],
  },
  {
    id: "faq-08",
    category: "location",
    categoryAr: "الزيارات الخارجية والفنادق",
    question: "هل تقدمين خدمة المكياج في الفنادق والقاعات والمنازل؟",
    answer:
      "نعم، خدمة الزيارة الخارجية الفاخرة مشمولة كخيار رئيسي. نسعد بالحضور إلى كافة أجنحة الفنادق والقصور والقاعات الفخمة في مدينة الرياض (فورسيزونز، الريتز، نيارة، برج الفيصلية)، كما نغطي الفلل والمنازل الخاصة بشمال وشرق وغرب الرياض مع حقيبة إضاءة احترافية متنقلة.",
    keywords: ["فندق", "فورسيزونز", "ريتز", "قاعة", "نيارة", "قصور", "منازل", "تغطية"],
  },
  {
    id: "faq-09",
    category: "location",
    categoryAr: "الزيارات الخارجية والفنادق",
    question: "هل هناك رسوم تنقل إضافية داخل مدينة الرياض؟",
    answer:
      "خدمة التنقل والوصول إلى موقعكِ مشمولة ومجانية بالكامل ضمن باقة العروس الملكية VIP لكافة أحياء الرياض. أما حجوزات السهرة والمرافقات المنفصلة، فيتم احتساب بدل تنقل رمزي (١٥٠ إلى ٢٥٠ ر.س) بناءً على الحي الجغرافي داخل الرياض.",
    keywords: ["رسوم", "تنقل", "مواصلات", "تكلفة", "توصيل", "بدل"],
  },
  {
    id: "faq-10",
    category: "trial",
    categoryAr: "جلسات التجربة Trial والاستشارة",
    question: "هل جلسة تجربة المكياج (Trial) إلزامية؟",
    answer:
      "جلسة التجربة ليست إلزامية، لكننا نوصي بها بشدة لكل عروس ترغب في طمأنينة تامة قبل ليلة العمر. تتضمن تجربة تدرجات الشفاه والظلال والفاونديشن وتدوين ملف جمالي خاص بكِ لتطبيقه حرفياً بيوم الزفاف.",
    keywords: ["بروفة", "تجربة", "ترايل", "trial", "إلزامي", "ضروري", "استشارة"],
  },
  {
    id: "faq-11",
    category: "trial",
    categoryAr: "جلسات التجربة Trial والاستشارة",
    question: "متى يُفضل إجراء جلسة تجربة المكياج؟",
    answer:
      "أفضل توقيت لحجز جلسة التجربة هو قبل أسبوعين إلى ٤ أسابيع من موعد الزفاف في الأتيليه الخاص بنا بشمال الرياض، بعد الانتهاء من اختيار فستان الزفاف وتسريحة الشعر التقديرية.",
    keywords: ["موعد", "البروفة", "التجربة", "متى", "قبل", "أسبوعين"],
  },
  {
    id: "faq-12",
    category: "policies",
    categoryAr: "التعديل والإلغاء والسياسات",
    question: "ماذا يحدث في حال اضطررتِ لتغيير تاريخ المناسبة؟",
    answer:
      "نقدّر تماماً الظروف المفاجئة؛ يُمكنكِ تأجيل الموعد لمرة واحدة دون أي رسوم إضافية، بشرط تقديم إشعار مسبق قبل ٢١ يوماً على الأقل من التاريخ المحدد وتوفر التاريخ البديل في جدول حجوزاتنا المعتمد.",
    keywords: ["تغيير", "تاريخ", "تأجيل", "موعد", "مناسبة", "ظروف", "نقل"],
  },
  {
    id: "faq-13",
    category: "policies",
    categoryAr: "التعديل والإلغاء والسياسات",
    question: "ما هي سياسة استرجاع العربون في حال الإلغاء؟",
    answer:
      "يُعتبر العربون غير مسترد بعد تأكيد الحجز نظراً لإغلاق التاريخ والاعتذار عن قبول كافة طلبات العرائس الأخريات لنفس اليوم. وتسهيلاً لعميلاتنا، يمكن تحويل العربون بالكامل كرصيد دائن يُستخدم لأي خدمة أخرى خلال مدة تصل إلى ٦ أشهر.",
    keywords: ["استرجاع", "عربون", "إلغاء", "فلوس", "رصيد", "استرداد"],
  },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    slug: "riyadh-bride-skincare-timeline",
    title: "جدول العناية بالبشرة قبل الزفاف بـ 3 أشهر: أسرار نضارة عروس الرياض",
    excerpt:
      "دليلكِ الاحترافي المتكامل لتهيئة بشرتكِ قبل ليلة الزفاف، لضمان مظهر مكياج مخملي مشرق يدوم لأكثر من 18 ساعة في أجواء الرياض.",
    content: `
### مرحلة الأشهر الثلاثة قبل ليلة العمر
الاستعداد لليلة الزفاف لا يبدأ في يوم الحفل، بل يتطلب تخطيطاً دقيقاً لتهيئة حاجز البشرة الطبيعي. كخبيرة تجميل معتمدة من CIDESCO، ألاحظ دائماً أن المكياج الأجمل هو الذي يستند إلى بشرة صحية ومرطبة بعمق.

#### 1. الشهر الثالث: بناء الأساس وترميم الحاجز الجلدي
* **الترطيب المضاعف:** إدخال حمض الهيالورونيك والسيراميد صباحاً ومساءً لتعزيز مرونة البشرة.
* **التقشير المدروس:** الابتعاد عن المقشرات القاسية واختيار حمض اللاكتيك أو المندليك اللطيف مرتين أسبوعياً.
* **شرب الماء والأملاح المعدنية:** شرب 3 لترات من الماء يومياً للتغلب على جفاف طقس الرياض.

#### 2. الشهر الثاني: اختبار المستحضرات وتجنب المفاجآت
* تجنبي تماماً تجربة أي ليزر كربوني أو تقشير كيميائي عنيف لأول مرة خلال هذه الفترة.
* موعد حجز جلسة التجربة (Bridal Trial): التوقيت المثالي لمراجعة تدرجات الأساس والتأكد من مطابقة أندرتون رقبتك وصدركِ مع فستان الزفاف.

#### 3. الأسبوع الأخير ويوم الزفاف
* تركيز مكثف على أقنعة الكولاجين والماسكات المرطبة الورقية (Sheet Masks).
* تجنب إزالة شعر الوجه قبل يومين فقط من المناسبة لتفادي الاحمرار والتحسس.
* الاسترخاء والنوم الكافي: هرمون الكورتيزول هو العدو الأول لنضارة إطلالتكِ.
    `,
    category: "bridal-tips",
    categoryAr: "نصائح العرائس",
    author: "أماني خليل",
    authorRole: "خبيرة تجميل معتمدة دولياً دبلوم CIDESCO",
    readTime: "4 دقائق",
    publishedAt: "2025-10-10",
    coverImage: "/gallery/IMG_5729.webp",
    featured: true,
    published: true,
    tags: ["عروس الرياض", "عناية بالبشرة", "تجهيز العروس", "مكياج زفاف"],
  },
  {
    id: "post-2",
    slug: "makeup-longevity-riyadh-wedding-halls",
    title: "أسرار ثبات مكياج السهرات والعرائس تحت إضاءة القاعات وحرارة الرياض",
    excerpt:
      "كيف تضمنين بقاء مكياجك ثابتاً من العصر وحتى ساعات الفجر دون أكسدة أو لمعان دهني؟ تقنيات حصرية معتمدة عالمياً.",
    content: `
### تحدي إضاءة الـ 4K وحرارة القاعات
تتميز قاعات الأفراح في الرياض بإضاءات تصوير مسرحية شديدة القوة، إضافة إلى تقلبات درجات الحرارة بين التكييف الداخلي والرطوبة الخارجية. إليكِ كيف نحقق ثبات الـ 18 ساعة:

#### تقنية التثبيت الهيدروليكي المزدوج (Hydra-Lock™)
1. **الطبقة التأسيسية:** استخدام برايمر مانع للزيوت ومتحكم بالإفرازات الزهمية في منطقة T-zone، مع برايمر مضيء ومغذي على أطراف الخدود.
2. **البودرة المجهرية (Micro-milled Powders):** نعتمد بودرات مثبتة شديدة النعومة خالية من مادة التلك المسببة للارتداد الضوئي (Flashback) في الصور الفوتوغرافية.
3. **تثبيت متعدد الطبقات (Setting Sandwich):** رش رذاذ التثبيت الاحترافي بين طبقة الأساس وبودرة الخدود، ثم طبقة نهائية بعد الرموش والعيون.
    `,
    category: "tutorials",
    categoryAr: "دروس وتقنيات",
    author: "أماني خليل",
    authorRole: "خبيرة تجميل معتمدة دولياً دبلوم CIDESCO",
    readTime: "5 دقائق",
    publishedAt: "2025-10-02",
    coverImage: "/gallery/IMG_5730.webp",
    featured: true,
    published: true,
    tags: ["ثبات المكياج", "إضاءة القاعات", "تصوير 4K", "بودرة التثبيت"],
  },
  {
    id: "post-3",
    slug: "bridal-makeup-trends-2025",
    title: "أبرز صيحات مكياج العرائس لعام 2025: عودة الفخامة الهادئة والنعومة الملكية",
    excerpt:
      "وداعاً للتغطية الثقيلة؛ استكشفي صيحة 'Soft Glam' الملكية، درجات النيود الدافئة، والبشرة الزجاجية المشرقة المناسبة للملكة والزفاف.",
    content: `
### ما هي إطلالة العروس الأكثر طلباً هذا الموسم؟
نشهد هذا العام تحولاً كبيراً في ذوق العرائس نحو الفخامة الهادئة (Quiet Luxury) والمكياج الذي يبرز ملامح الوجه الطبيعية دون تغييرها أو طمس تفاصيلها:

* **العيون الترابية الناعمة:** دمج ظلال الشوكولاتة والبيج الدافئ مع لمسات خافتة من الشيمر الشامبيني بدلاً من الغليتر الصارخ.
* **البشرة الزجاجية الطبيعية:** إخفاء العيوب بدقة متناهية وإبقاء توهج الخدين والأنف حيوياً وصحياً.
* **شفاه الباوت المخملية:** تحديد الشفاه بدرجات الموكا مع حمرة نيود وردية متدرجة تمنح امتلاءً طبيعياً وناعماً.
    `,
    category: "trends",
    categoryAr: "صيحات الموضة",
    author: "أماني خليل",
    authorRole: "خبيرة تجميل معتمدة دولياً دبلوم CIDESCO",
    readTime: "3 دقائق",
    publishedAt: "2025-09-24",
    coverImage: "/gallery/IMG_5731.webp",
    featured: false,
    published: true,
    tags: ["صيحات 2025", "سوفت غلام", "مكياج ملكي", "نيود"],
  },
  {
    id: "post-4",
    slug: "dry-vs-oily-skin-foundation-guide",
    title: "دليل اختيار الفاونديشن المثالي: بين البشرة الجافة والدهنية في الخليج",
    excerpt:
      "تجنبي المظهر الباهت أو التكتل؛ تعرفي على التركيبة المناسبة لنوع بشرتكِ من أرقى البراندات العالمية.",
    content: `
### اختيار كريم الأساس الصحيح نصف جمال الإطلالة
كثيراً ما تسألني العميلات: لماذا يبدو الفاونديشن رائعاً في الصباح ويتشقق في المساء؟ السبب هو عدم التوافق بين قاعدة الفاونديشن (مائية، زيتية، سيليكونية) ونوع البشرة.

#### للبشرة الجافة والمختلطة المائلة للجفاف
ابحثي دائماً عن فاونديشن غني بحمض الهيالورونيك والسكوالان، وتجنبي التركيبات المات المطفية تماماً. مستحضرات مثل *Dior Backstage* و *Charlotte Tilbury Beautiful Skin* تقدم ترطيباً ولمعاناً صحياً جذاباً.

#### للبشرة الدهنية والمعرضة للمعان
القاعدة الذهبية هي تثبيت المسام دون تجفيفها. المستحضرات ذات التغطية القابلة للبناء مثل *Estée Lauder Double Wear* و *NARS Soft Matte* تضمن استقرار الزيوت وثباتاً يدوم لساعات طويلة.
    `,
    category: "skincare",
    categoryAr: "العناية والتأسيس",
    author: "أماني خليل",
    authorRole: "خبيرة تجميل معتمدة دولياً دبلوم CIDESCO",
    readTime: "4 دقائق",
    publishedAt: "2025-09-15",
    coverImage: "/gallery/IMG_5733.webp",
    featured: false,
    published: true,
    tags: ["فاونديشن", "بشرة دهنية", "بشرة جافة", "أساسيات المكياج"],
  },
];


