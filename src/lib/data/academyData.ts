export interface Course {
  id: string;
  number: number;
  titleAr: string;
  titleEn: string;
  descriptionEn: string;
  descriptionAr: string;
  iconName: string;
  levelIds: string[];
  instructor: string;
  primaryTextEn?: string;
  primaryTextAr?: string;
  keyTopicsEn?: string[];
  keyTopicsAr?: string[];
}

export interface AcademicLevel {
  id: string;
  stage: number;
  stageNameEn: string;
  stageNameAr: string;
  titleAr: string;
  titleEn: string;
  durationEn: string;
  durationAr: string;
  descriptionEn: string;
  descriptionAr: string;
  badgeColor: string;
  prerequisiteEn: string;
  prerequisiteAr: string;
  featuredCourseIds: string[];
  learningOutcomesEn: string[];
  learningOutcomesAr: string[];
}

export interface Announcement {
  id: string;
  titleAr: string;
  titleEn: string;
  date: string;
  contentAr: string;
  contentEn: string;
  category: 'general' | 'assignment' | 'exam' | 'event';
}

export interface LiveClass {
  id: string;
  titleAr: string;
  titleEn: string;
  subjectAr: string;
  subjectEn: string;
  level: string;
  instructor: string;
  timeEn: string;
  timeAr: string;
  dayEn: string;
  dayAr: string;
  meetUrl: string;
  status: 'upcoming' | 'live' | 'completed';
}

export interface Assignment {
  id: string;
  courseId: string;
  titleAr: string;
  titleEn: string;
  dueDate: string;
  totalPoints: number;
  level: string;
  submittedCount: number;
  totalStudents: number;
  status: 'open' | 'graded' | 'pending';
}

export interface Material {
  id: string;
  courseId: string;
  titleAr: string;
  titleEn: string;
  type: 'pdf' | 'audio' | 'video';
  sizeOrDuration: string;
  downloadUrl: string;
  uploadedDate: string;
}

export interface FacultyMember {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  roleAr: string;
  roleEn: string;
  bioAr: string;
  bioEn: string;
  specializationAr: string;
  specializationEn: string;
  credentialsAr: string[];
  credentialsEn: string[];
  sanadCertificationAr?: string;
  sanadCertificationEn?: string;
  initials: string;
  accentColor: string;
  coursesTaught: string[];
}

export interface Testimonial {
  id: string;
  authorNameAr: string;
  authorNameEn: string;
  roleAr: string;
  roleEn: string;
  category: 'parent' | 'student' | 'graduate';
  countryAr: string;
  countryEn: string;
  quoteAr: string;
  quoteEn: string;
  rating: number;
  highlightAr: string;
  highlightEn: string;
}

export interface TuitionPlan {
  id: string;
  levelId: string;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  termFee: string;
  billingPeriodAr: string;
  billingPeriodEn: string;
  featuresAr: string[];
  featuresEn: string[];
  isPopular?: boolean;
}

export interface AdmissionFAQ {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  category: 'admissions' | 'academics' | 'tuition' | 'schedule';
}

export const ACADEMY_INFO = {
  nameAr: 'أكاديمية ابن بشير للدراسات العربية والإسلامية',
  nameEn: 'Ibn Basheer Academy for Arabic & Islamic Studies',
  subHeadingAr: 'ابن بشير حلقة العلمية للدراسات العربية والإسلامية',
  subHeadingEn: 'Circle of Learning for Arabic and Islamic Knowledge',
  taglineAr: 'طلب العلم فريضة على كل مسلم',
  taglineEn: 'Seeking Knowledge is an Obligation upon Every Muslim',
  leadInstructor: {
    nameAr: 'الشيخ أبو عبد الله المبارك',
    nameEn: 'Ustaz Abu Abdullah Al-Mubaarak',
    roleAr: 'المشرف العام والمدرس الرئيسي',
    roleEn: 'Lead Instructor & Academy Director',
    bioAr: 'باحث ومدرس في العلوم الشرعية واللغة العربية، مشرف على العديد من الحلقات العلمية والبرامج التعليمية.',
    bioEn: 'Scholar and instructor in Islamic Sciences and the Arabic Language, supervising numerous learning circles and educational programs.'
  },
  contact: {
    whatsappNumber: '070 8168 0864',
    whatsappFormatted: '+2347081680864',
    whatsappLink: 'https://wa.link/2ho74x',
    email: 'basheernumon@gmail.com',
  },
  features: [
    {
      titleAr: 'تقييمات واختبارات دورية',
      titleEn: 'Periodic Assessments',
      descAr: 'متابعة مستمرة لمستوى الطالب عبر اختبارات تحريرية وشفهية.',
      descEn: 'Continuous evaluation through written and oral periodic assessments.'
    },
    {
      titleAr: 'بيئة تعليمية باللغة العربية',
      titleEn: 'Arabic Speaking Community',
      descAr: 'ممارسة التحدث باللغة العربية الفصحى والتواصل الفعال بين الطلاب.',
      descEn: 'Immersive Arabic speaking environment and student interaction.'
    },
    {
      titleAr: 'فصول افتراضية وتفاعلية',
      titleEn: 'Interactive Online Classes',
      descAr: 'دروس مباشرة ومسجلة تتيح للطلاب التعلم من أي مكان في العالم.',
      descEn: 'Live and recorded sessions allowing students to learn from anywhere.'
    }
  ]
};

export const ACADEMIC_LEVELS: AcademicLevel[] = [
  {
    id: 'tamheediy',
    stage: 1,
    stageNameEn: 'Stage 1 — Foundation',
    stageNameAr: 'المرحلة الأولى — التأسيس',
    titleAr: 'المستوى التمهيدي',
    titleEn: 'Tamheediy (Preparatory)',
    durationEn: '6 Months',
    durationAr: '٦ أشهر',
    descriptionEn: 'Designed for beginners to build foundational literacy in Arabic reading, basic Tajwīd rules, and core Aqīdah.',
    descriptionAr: 'مخصص للمبتدئين لبناء أساس قوي في قراءة العربية وتطبيق أحكام التجويد الأساسية ومبادئ العقيدة.',
    badgeColor: 'bg-brand-tint text-brand-ink ring-1 ring-brand-ring',
    prerequisiteEn: 'None (open to absolute beginners)',
    prerequisiteAr: 'لا يشترط وجود دراسة سابقة (متاح للجميع)',
    featuredCourseIds: ['quran', 'tajweed', 'arabic', 'aqidah'],
    learningOutcomesEn: [
      'Accurate Arabic reading with diacritics',
      'Basic Tajwīd rules (Nūn Sākinah, Tanwīn, Madd)',
      'Understanding the three categories of Tawḥīd',
      'Daily prophetic supplications & etiquette'
    ],
    learningOutcomesAr: [
      'إتقان قراءة النصوص العربية بالحركات',
      'تطبيق أحكام النون الساكنة والتنوين والمدود',
      'فهم أقسام التوحيد الثلاثة',
      'حفظ أذكار اليوم والليلة والآداب الأساسية'
    ]
  },
  {
    id: 'ibtidaiyya',
    stage: 2,
    stageNameEn: 'Stage 2 — Primary Shari’ah',
    stageNameAr: 'المرحلة الثانية — الابتدائية الشرعية',
    titleAr: 'المرحلة الابتدائية',
    titleEn: 'Ibtidā’iyya (Primary)',
    durationEn: '2 Years',
    durationAr: 'سنتان',
    descriptionEn: 'Comprehensive coverage of primary Islamic Fiqh, Sirah, Hadith collections, and intermediate Arabic grammar.',
    descriptionAr: 'دراسة شاملة لفقه العبادات، السيرة النبوية، الأحاديث الشريفة، ومعارف العربية التأسيسية.',
    badgeColor: 'bg-brand-tint text-brand-ink ring-1 ring-brand-ring',
    prerequisiteEn: 'Completion of Tamheediy or basic literacy test',
    prerequisiteAr: 'إتمام المستوى التمهيدي أو اجتياز اختبار تحديد المستوى',
    featuredCourseIds: ['fiqh', 'sirah', 'hadith', 'arabic', 'akhlaq'],
    learningOutcomesEn: [
      'Fiqh of purification, prayer, fasting, and Zakat',
      'Key chronological events of the Prophetic biography',
      'Study & memorization of An-Nawawī’s 40 Hadith',
      'Foundational Nahw parsing (Al-Ajrūmiyyah)'
    ],
    learningOutcomesAr: [
      'فقه الطهارة والصلاة والصيام والزكاة بالأدلة',
      'المحطات الكبرى في السيرة النبوية العطرة',
      'حفظ ودراسة الأربعين النووية بشروحها',
      'تطبيق قواعد النحو والإعراب من متن الآجرومية'
    ]
  },
  {
    id: 'idadiyya',
    stage: 3,
    stageNameEn: 'Stage 3 — Intermediate Analytical',
    stageNameAr: 'المرحلة الثالثة — الإعدادية والتحليل',
    titleAr: 'المرحلة الإعدادية',
    titleEn: 'I’dādiyya (Junior Secondary)',
    durationEn: '2 Years',
    durationAr: 'سنتان',
    descriptionEn: 'In-depth analytical study of Muṣṭalaḥ al-Ḥadīth, detailed Fiqh, Quranic Exegesis (Tafsīr), and advanced Nahw/Sarf.',
    descriptionAr: 'دراسة دراسة تحليليّة لمصطلح الحديث الشريف، الفقه المقارن، التفسير، وعلوم النحو والصرف.',
    badgeColor: 'bg-brand-tint text-brand-ink ring-1 ring-brand-ring',
    prerequisiteEn: 'Completion of Ibtidā’iyya',
    prerequisiteAr: 'إتمام المرحلة الابتدائية بنجاح',
    featuredCourseIds: ['mustalah', 'fiqh', 'quran', 'faraid', 'arabic'],
    learningOutcomesEn: [
      'Classification of Ḥadīth chains and text authenticity',
      'Comparative jurisprudence in transactions & family law',
      'Classical Sarf morphology & verbal derivation patterns',
      'Tafsīr methodology and thematic Quranic exegesis'
    ],
    learningOutcomesAr: [
      'قواعد دراسة أسانيد الحديث والتفريق بين الصحيح والضعيف',
      'فقه المعاملات المالية والأحوال الشخصية',
      'علم الصرف وأوزان الأفعال والمشتقات',
      'أصول التفسير وتدبر سور القرآن الكريم'
    ]
  },
  {
    id: 'thanawiyya',
    stage: 4,
    stageNameEn: 'Stage 4 — Senior Seminary',
    stageNameAr: 'المرحلة الرابعة — الثانوية التأصيلية',
    titleAr: 'المرحلة الثانوية',
    titleEn: 'Thanāwiyya (Senior Secondary)',
    durationEn: '2 Years',
    durationAr: 'سنتان',
    descriptionEn: 'Advanced specialization in Islamic Inheritance (Farā’iḍ), Usūl al-Fiqh, major Hadith texts, and Arabic literature.',
    descriptionAr: 'التخصص المتقدم في علم الفرائض والمواريث، أصول الفقه، أمهات كتب الحديث، والأدب العربي.',
    badgeColor: 'bg-brand-700 text-white ring-1 ring-brand-600',
    prerequisiteEn: 'Completion of I’dādiyya',
    prerequisiteAr: 'إتمام المرحلة الإعدادية',
    featuredCourseIds: ['faraid', 'hadith', 'mustalah', 'aqidah', 'fiqh'],
    learningOutcomesEn: [
      'Mastery of estate distribution and inheritance shares (Farā’iḍ)',
      'Legal maxims (Qawāʿid Fiqhiyyah) and Usūl al-Fiqh',
      'Detailed study of Sahih Bukhari / Muslim selections',
      'Classical Arabic Balāghah (rhetoric & eloquence)'
    ],
    learningOutcomesAr: [
      'إتقان حساب المواريث وتوزيع التركات وحالات الحجب',
      'القواعد الفقهية وأصول الاستنباط',
      'دراسة متعمقة لنصوص الصحاح والسنن',
      'علوم البلاغة العربية (المعاني والبيان والبديع)'
    ]
  },
  {
    id: 'tejweed-class',
    stage: 5,
    stageNameEn: 'Specialized — Recitation Mastery',
    stageNameAr: 'مسار تخصصي — إتقان التلاوة',
    titleAr: 'دورة التجويد المكثفة',
    titleEn: 'Tejweed Intensive Class',
    durationEn: 'Specialized Track',
    durationAr: 'مسار متخصص',
    descriptionEn: 'Dedicated theoretical and practical Quranic recitation rules (Makhārij, Sifāt, and Riwayah memorization).',
    descriptionAr: 'دراسة نظرية وتطبيقية مكثفة لأحكام تلاوة القرآن الكريم وتصحيح مخارج الحروف والصفات.',
    badgeColor: 'bg-accent-400/15 text-accent-700 dark:text-accent-300 ring-1 ring-accent-400/30',
    prerequisiteEn: 'Fluent Quranic Arabic reading',
    prerequisiteAr: 'القدرة على قراءة القرآن الكريم من المصحف',
    featuredCourseIds: ['tajweed', 'quran'],
    learningOutcomesEn: [
      'Theoretical mastery of Matn Al-Jazariyyah & Tuḥfat al-Aṭfāl',
      'Precise phonetic articulation points (Makhārij) & characteristics (Ṣifāt)',
      'Rules of Waqf (stopping) and Ibtidā’ (initiating recitation)',
      'Preparation for formal Recitation Authorization (Ijāzah)'
    ],
    learningOutcomesAr: [
      'حفظ ودراسة متن الجزرية وتحفة الأطفال',
      'تصحيح مخارج الحروف وصفاتها ذاتية وعارضة',
      'أحكام الوقف والابتداء ورسم المصحف',
      'التأهيل للإجازة بالسند المتصل'
    ]
  }
];

export const MAJOR_COURSES: Course[] = [
  {
    id: 'quran',
    number: 1,
    titleAr: 'دراسات القرآن الكريم',
    titleEn: 'Qur’an Studies',
    descriptionAr: 'حفظ وتفسير وتدبر آيات الكتاب العزيز وفق منهج سلف الأمة.',
    descriptionEn: 'Memorization, exegesis (Tafsīr), and contemplation of the Holy Qur’an.',
    iconName: 'BookOpen',
    levelIds: ['tamheediy', 'ibtidaiyya', 'idadiyya', 'thanawiyya', 'tejweed-class'],
    instructor: 'Ustaz Abu Abdullah Al-Mubaarak',
    primaryTextEn: 'Tafsīr al-Saʿdī & Muqaṭṭaʿāt al-Bayān',
    primaryTextAr: 'تيسير الكريم الرحمن (تفسير السعدي)',
    keyTopicsEn: ['Word-by-word Tafsīr', 'Causes of Revelation (Asbāb al-Nuzūl)', 'Reflective Journaling (Tadabbur)']
  },
  {
    id: 'tajweed',
    number: 2,
    titleAr: 'التجويد',
    titleEn: 'Tajwīd',
    descriptionAr: 'قواعد إتقان تلاوة القرآن الكريم ومخارج الحروف والصفات.',
    descriptionEn: 'Mastery of Quranic recitation rules, articulation points, and phonetic characteristics.',
    iconName: 'Mic',
    levelIds: ['tamheediy', 'ibtidaiyya', 'tejweed-class'],
    instructor: 'Ustaz Abu Abdullah Al-Mubaarak',
    primaryTextEn: 'Tuḥfat al-Aṭfāl & Al-Manẓūmah al-Jazariyyah',
    primaryTextAr: 'تحفة الأطفال والمنظومة الجزرية',
    keyTopicsEn: ['Nūn & Mīm Sākinah', 'Makhārij & Ṣifāt', 'Rules of Madd (Lengthening)', 'Waqf & Ibtidā’']
  },
  {
    id: 'arabic',
    number: 3,
    titleAr: 'اللغة العربية',
    titleEn: 'Arabic Language',
    descriptionAr: 'النحو والصرف والبلاغة وقواعد الإملاء والمحادثة اليومية.',
    descriptionEn: 'Arabic Grammar (Naḥw), Morphology (Ṣarf), Rhetoric (Balāghah), and conversational skills.',
    iconName: 'Languages',
    levelIds: ['tamheediy', 'ibtidaiyya', 'idadiyya', 'thanawiyya'],
    instructor: 'Ustaz Abu Abdullah Al-Mubaarak',
    primaryTextEn: 'Al-Ajrūmiyyah & Qaṭr an-Nadā',
    primaryTextAr: 'متن الآجرومية وقطر الندى وبل الصدى',
    keyTopicsEn: ['I’rāb (Syntactic Parsing)', 'Verb Conjugation Tables', 'Sentence Building Drills', 'Classical Eloquence']
  },
  {
    id: 'aqidah',
    number: 4,
    titleAr: 'التوحيد والعقيدة',
    titleEn: 'Tawḥīd & ʿAqīdah',
    descriptionAr: 'دراسة عقيدة أهل السنة والجماعة، أنواع التوحيد الثلاثة وأركان الإيمان.',
    descriptionEn: 'Foundational Islamic Creed, the three categories of Tawḥīd, and pillars of Imān.',
    iconName: 'Compass',
    levelIds: ['tamheediy', 'ibtidaiyya', 'thanawiyya'],
    instructor: 'Ustaz Abu Abdullah Al-Mubaarak',
    primaryTextEn: 'Al-Uṣūl al-Thalāthah & Al-ʿAqīdah al-Wāsiṭiyyah',
    primaryTextAr: 'الأصول الثلاثة والعقيدة الواسطية',
    keyTopicsEn: ['Rubūbiyyah, Ulūhiyyah, Asmā’ wa-Ṣifāt', '6 Pillars of Imān', 'Nullifiers of Islam', 'Refutation of Deviations']
  },
  {
    id: 'fiqh',
    number: 5,
    titleAr: 'الفقه الإسلامي',
    titleEn: 'Islamic Fiqh',
    descriptionAr: 'فقه العبادات والمعاملات والأحوال الشخصية على ضوء الدليل الشرعي.',
    descriptionEn: 'Jurisprudence of Worship (ʿIbādāt), Financial Transactions (Muʿāmalāt), and Family Law.',
    iconName: 'Scale',
    levelIds: ['ibtidaiyya', 'idadiyya', 'thanawiyya'],
    instructor: 'Ustaz Abu Abdullah Al-Mubaarak',
    primaryTextEn: 'Matn Abī Shujāʿ & Manhaj al-Sālikīn',
    primaryTextAr: 'متن أبي شجاع ومنهج السالكين',
    keyTopicsEn: ['Purification (Ṭahārah)', 'Prayer (Ṣalāh) & Fasting', 'Zakāh & Ḥajj', 'Trade, Contracts & Inheritance']
  },
  {
    id: 'hadith',
    number: 6,
    titleAr: 'الحديث النبوي',
    titleEn: 'Ḥadīth',
    descriptionAr: 'حفظ وفهم جوامع كلم النبي ﷺ وشروح الأربعين النووية ورياض الصالحين.',
    descriptionEn: 'Memorization and comprehension of prophetic traditions including Forty Hadith and Riyād al-Ṣāliḥīn.',
    iconName: 'ScrollText',
    levelIds: ['ibtidaiyya', 'idadiyya', 'thanawiyya'],
    instructor: 'Ustaz Abu Abdullah Al-Mubaarak',
    primaryTextEn: 'Al-Arbaʿūn al-Nawawiyyah & ʿUmdat al-Aḥkām',
    primaryTextAr: 'الأربعون النووية وعمدة الأحكام',
    keyTopicsEn: ['Narrator Biographies', 'Authenticity & Gradings', 'Fiqh Deductions', 'Moral Lessons']
  },
  {
    id: 'mustalah',
    number: 7,
    titleAr: 'مصطلح الحديث',
    titleEn: 'Muṣṭalaḥ al-Ḥadīth',
    descriptionAr: 'قواعد معرفة أحوال الرواية والمرويات وتصنيف الأحاديث صحة وضعفاً.',
    descriptionEn: 'Science of Ḥadīth terminology, evaluation of transmission chains, and authenticity grades.',
    iconName: 'CheckCheck',
    levelIds: ['idadiyya', 'thanawiyya'],
    instructor: 'Ustaz Abu Abdullah Al-Mubaarak',
    primaryTextEn: 'Al-Manẓūmah al-Bayqūniyyah & Nukhbat al-Fikar',
    primaryTextAr: 'المنظومة البيقونية ونخبة الفكر',
    keyTopicsEn: ['Ṣaḥīḥ, Ḥasan, and Ḍaʿīf', 'Chains (Isnād) & Narrators', 'Defects (ʿIlal)', 'Transmission Terms']
  },
  {
    id: 'sirah',
    number: 8,
    titleAr: 'السيرة النبوية',
    titleEn: 'Sīrah',
    descriptionAr: 'دراسة حيوية لسيرة النبي ﷺ من الميلاد حتى الوفاة والعبر المستفادة.',
    descriptionEn: 'Comprehensive biography of Prophet Muhammad ﷺ and lessons for personal development.',
    iconName: 'History',
    levelIds: ['tamheediy', 'ibtidaiyya', 'idadiyya'],
    instructor: 'Ustaz Abu Abdullah Al-Mubaarak',
    primaryTextEn: 'Al-Urjūzah al-Mi’iyyah & Al-Raḥīq al-Makhtūm',
    primaryTextAr: 'الأرجوزة المئية والرحيق المختوم',
    keyTopicsEn: ['Pre-Islamic Arabia', 'Makkah Period & Da’wah', 'Madīnah Governance & Battles', 'Farewell Pilgrimage']
  },
  {
    id: 'faraid',
    number: 9,
    titleAr: 'الفرائض وعلم المواريث',
    titleEn: 'Farā’iḍ / Islamic Inheritance',
    descriptionAr: 'أحكام التركات وحساب السهام وتوزيع المواريث حسب الشريعة الإسلامية.',
    descriptionEn: 'Islamic inheritance laws, share calculations, and estate distribution rules.',
    iconName: 'Calculator',
    levelIds: ['idadiyya', 'thanawiyya'],
    instructor: 'Ustaz Abu Abdullah Al-Mubaarak',
    primaryTextEn: 'Matn al-Raḥabiyyah (متن الرحبية)',
    primaryTextAr: 'متن الرحبية في علم الفرائض',
    keyTopicsEn: ['Fixed Shares (Aṣḥāb al-Furūḍ)', 'Residuary (ʿAṣabah)', 'Blockage (Ḥajb)', 'Estate Accounting Math']
  },
  {
    id: 'akhlaq',
    number: 10,
    titleAr: 'الأخلاق والآداب الإسلامية',
    titleEn: 'Akhlāq & Islamic Manners',
    descriptionAr: 'تهذيب النفوس والتحلي بآداب طالب العلم والأخلاق الإسلامية الفاضلة.',
    descriptionEn: 'Character refinement, etiquette of seeking knowledge, and practical Islamic morals.',
    iconName: 'Heart',
    levelIds: ['tamheediy', 'ibtidaiyya', 'idadiyya', 'thanawiyya'],
    instructor: 'Ustaz Abu Abdullah Al-Mubaarak',
    primaryTextEn: 'Hilyat Ṭālib al-ʿIlm & Bidāyat al-Hidāyah',
    primaryTextAr: 'حلية طالب العلم وبداية الهداية',
    keyTopicsEn: ['Etiquettes with Teachers', 'Purification of Heart', 'Speech & Social Conduct', 'Sincerity (Ikhlāṣ)']
  }
];

export const MOCK_LIVE_CLASSES: LiveClass[] = [
  {
    id: 'live-1',
    titleAr: 'شرح منظومة حرز الأماني (الشاطبية)',
    titleEn: 'Explanation of Al-Shatibiyyah in Tajweed',
    subjectAr: 'التجويد والقراءات',
    subjectEn: 'Tajwīd Class',
    level: 'Tejweed Class',
    instructor: 'Ustaz Abu Abdullah Al-Mubaarak',
    timeEn: '08:00 PM (GMT+1)',
    timeAr: '٠٨:٠٠ مساءً',
    dayEn: 'Saturday & Sunday',
    dayAr: 'السبت والأحد',
    meetUrl: 'https://meet.google.com/ibn-basheer-tajweed',
    status: 'live'
  },
  {
    id: 'live-2',
    titleAr: 'دروس الآجرومية في النحو',
    titleEn: 'Al-Ajrumiyyah Grammar Session',
    subjectAr: 'اللغة العربية',
    subjectEn: 'Arabic Language',
    level: 'Ibtidā’iyya',
    instructor: 'Ustaz Abu Abdullah Al-Mubaarak',
    timeEn: '06:00 PM (GMT+1)',
    timeAr: '٠٦:٠٠ مساءً',
    dayEn: 'Tuesday & Thursday',
    dayAr: 'الثلاثاء والخميس',
    meetUrl: 'https://meet.google.com/ibn-basheer-arabic',
    status: 'upcoming'
  },
  {
    id: 'live-3',
    titleAr: 'أحكام التركات في علم الفرائض',
    titleEn: 'Estate Calculations in Farā’iḍ',
    subjectAr: 'الفرائض وعلم المواريث',
    subjectEn: 'Islamic Inheritance',
    level: 'Thanāwiyya',
    instructor: 'Ustaz Abu Abdullah Al-Mubaarak',
    timeEn: '09:00 PM (GMT+1)',
    timeAr: '٠٩:٠٠ مساءً',
    dayEn: 'Friday',
    dayAr: 'الجمعة',
    meetUrl: 'https://meet.google.com/ibn-basheer-faraid',
    status: 'upcoming'
  }
];

export const MOCK_MATERIALS: Material[] = [
  {
    id: 'mat-1',
    courseId: 'tajweed',
    titleAr: 'ملخص أحكام النون الساكنة والتنوين PDF',
    titleEn: 'Nun Sakinah & Tanween Summary Guide (PDF)',
    type: 'pdf',
    sizeOrDuration: '2.4 MB',
    downloadUrl: '#',
    uploadedDate: '2026-09-10'
  },
  {
    id: 'mat-2',
    courseId: 'arabic',
    titleAr: 'تسجيل صوتي: محادثة النحو — الدرس الأول',
    titleEn: 'Arabic Conversation & Nahw Audio Lecture 1',
    type: 'audio',
    sizeOrDuration: '45 mins',
    downloadUrl: '#',
    uploadedDate: '2026-09-12'
  },
  {
    id: 'mat-3',
    courseId: 'faraid',
    titleAr: 'جدول أسهم أصحاب الفروض المقدرة',
    titleEn: 'Inheritance Shares Reference Table (PDF)',
    type: 'pdf',
    sizeOrDuration: '1.8 MB',
    downloadUrl: '#',
    uploadedDate: '2026-09-14'
  }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assg-1',
    courseId: 'tajweed',
    titleAr: 'تطبيق أحكام الإظهار والإدغام في سورة الملك',
    titleEn: 'Recitation Audio Submission: Izhar & Idgham in Surah Al-Mulk',
    dueDate: '2026-09-20',
    totalPoints: 100,
    level: 'Tamheediy & Tejweed',
    submittedCount: 24,
    totalStudents: 30,
    status: 'open'
  },
  {
    id: 'assg-2',
    courseId: 'arabic',
    titleAr: 'إعراب الجمل العشر الأولى من كتاب النحو الواضح',
    titleEn: 'Grammatical Parsing (I’rāb) Assignment 2',
    dueDate: '2026-09-22',
    totalPoints: 50,
    level: 'Ibtidā’iyya',
    submittedCount: 18,
    totalStudents: 25,
    status: 'open'
  },
  {
    id: 'assg-3',
    courseId: 'faraid',
    titleAr: 'مسائل في حجب الحرمان وحجب النقصان',
    titleEn: 'Practical Inheritance Case Studies (Hajb)',
    dueDate: '2026-09-15',
    totalPoints: 100,
    level: 'Thanāwiyya',
    submittedCount: 12,
    totalStudents: 12,
    status: 'graded'
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    titleAr: 'بدء التسجيل للموسم الدراسي الجديد 1448هـ',
    titleEn: 'New Academic Year Enrollment Open (1448 AH)',
    date: '2026-09-01',
    contentAr: 'يسر أكاديمية ابن بشير إعلان فتح باب التسجيل لكافة المستويات الدراسية عبر المنصة الافتراضية.',
    contentEn: 'Ibn Basheer Academy is pleased to announce registration for all levels through our online platform.',
    category: 'general'
  },
  {
    id: 'ann-2',
    titleAr: 'جدول الاختبارات الدورية للمستوى الابتدائي',
    titleEn: 'Periodic Assessment Schedule for Ibtidaiyya Level',
    date: '2026-09-12',
    contentAr: 'ستجرى الاختبارات الشفهية والتحريرية نهاية الأسبوع القادم.',
    contentEn: 'Oral and written assessments will take place next weekend.',
    category: 'exam'
  }
];

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: 'ustaz-mubaarak',
    nameAr: 'الشيخ أبو عبد الله المبارك',
    nameEn: 'Ustaz Abu Abdullah Al-Mubaarak',
    titleAr: 'المشرف العام والمدرس الأول',
    titleEn: 'Academy Director & Senior Scholar',
    roleAr: 'أستاذ التجويد والقراءات والفقه المقارن',
    roleEn: 'Chair of Tajwīd, Qirā’āt & Comparative Fiqh',
    bioAr: 'فقيه ومقرئ متصل السند، كرس أكثر من عقد ونصف في تدريس المتون الشرعية وتحفيظ القرآن بروايتي حفص وشعبة. قاد المئات من طلبة العلم نحو نيل الإجازات العلمية المعتمدة وتأسيس الحلقات العلمية.',
    bioEn: 'Senior jurist and certified reciter with connected chains of transmission (Isnād). Over 15 years dedicated to teaching classical Islamic texts, Quranic recitation, and guiding students to formal academic mastery and certification.',
    specializationAr: 'علوم القرآن، القراءات المتواترة، الفقه وأصوله',
    specializationEn: 'Quranic Sciences, Recitation Isnād, Classical Jurisprudence',
    credentialsAr: [
      'إجازة مسندة برواية حفص عن عاصم من طريق الشاطبية',
      'إجازة في شرح ودراسة تحفة الأطفال والمقدمة الجزرية',
      'إشراف وتدريس لأكثر من ٤٥٠ طالب علم حول العالم',
      'أستاذ كرسي الفقه والفرائض بأكاديمية ابن بشير'
    ],
    credentialsEn: [
      'Authenticated Isnād in Hafs ‘an ‘Asim via the Shatibiyyah pathway',
      'Certified Licensure in Tuḥfat al-Aṭfāl & Al-Muqaddimah Al-Jazariyyah',
      '15+ Years Direct Seminary Teaching across West Africa & Diaspora',
      'Supervising Dean of Jurisprudence & Inheritance Studies'
    ],
    sanadCertificationAr: 'إسناد متصل إلى النبي ﷺ في تلاوة القرآن الكريم وتدريس المتون',
    sanadCertificationEn: 'Connected Isnād to the Prophet ﷺ in Quranic recitation and classical matn transmission',
    initials: 'AM',
    accentColor: 'from-amber-600 to-amber-800',
    coursesTaught: ['tajweed', 'aqeedah', 'fiqh', 'faraid']
  },
  {
    id: 'dr-sulaiman-bukhari',
    nameAr: 'د. سليمان البخاري',
    nameEn: 'Dr. Sulaiman Al-Bukhari',
    titleAr: 'عميد الدراسات الحديثية',
    titleEn: 'Dean of Hadith & Prophetic Tradition',
    roleAr: 'أستاذ مصطلح الحديث والسنن النبوية',
    roleEn: 'Professor of Hadith Sciences & Isnād Criticism',
    bioAr: 'دكتوراه في علوم الحديث ومناهج المحدثين، خريج الجامعة الإسلامية بالمدينة المنورة. باحث ومحقق لكتب التراث، متخصص في ضبط الأسانيد وعلل الحديث وشروح الأربعين النووية ورياض الصالحين.',
    bioEn: 'Ph.D. in Hadith Sciences and Methodology of Muhadditheen, alumnus of the Islamic University of Madinah. Researcher and editor of classical manuscripts specializing in chain criticism, Riyāḍ aṣ-Ṣāliḥīn, and Ar-Arba’īn an-Nawawiyyah.',
    specializationAr: 'علوم الحديث، مصطلح الحديث، تخريج ودراسة الأسانيد',
    specializationEn: 'Hadith Sciences, Methodology of Hadith Criticism, Isnād Verification',
    credentialsAr: [
      'دكتوراه في علوم الحديث النبوي الشريف',
      'إجازات عامة في الكتب الستة وموطأ الإمام مالك',
      'مؤلف لعدة أبحاث محكمة في فقه السيرة ومناهج المحدثين',
      'عضو هيئة الإشراف الأكاديمي والامتحانات العليا'
    ],
    credentialsEn: [
      'Ph.D. in Hadith & Prophetic Traditions (Islamic Univ. of Madinah)',
      'General Ijāzāt in the Six Canonical Hadith Compendiums & Muwaṭṭa Mālik',
      'Author of peer-reviewed works on Prophetic methodology',
      'Lead Examiner for Academic Level Assessments'
    ],
    sanadCertificationAr: 'إجازة سماع ورواية للكتب الستة بأسانيد متصلة',
    sanadCertificationEn: 'Transmitted authorization (Ijāzat Riwāyah) for the Kutub as-Sittah',
    initials: 'SB',
    accentColor: 'from-emerald-600 to-teal-800',
    coursesTaught: ['hadith', 'aqeedah']
  },
  {
    id: 'ustaz-bilal-mansoor',
    nameAr: 'الأستاذ بلال بن منصور',
    nameEn: 'Ustaz Bilal Ibn Mansoor',
    titleAr: 'رئيس قسم فقه اللغة واللسانيات',
    titleEn: 'Head of Arabic Philology & Grammar',
    roleAr: 'مدرس النحو التطبيقي والصرف والبلاغة',
    roleEn: 'Instructor of Classical Nahw, Sarf & Balāghah',
    bioAr: 'متخصص متمكن في علوم العربية الفصحى، تميز بأسلوبه التفاعلي في تبسيط قواعد النحو والصرف للناطقين بغيرها، وحفظ وتدريس الآجرومية وقطر الندى وشذور الذهب وألفية ابن مالك.',
    bioEn: 'Master of Classical Arabic linguistics known for his structured, accessible pedagogy in teaching applied grammar, morphology, and rhetoric. Specialist in Al-Ajrūmiyyah, Qaṭr an-Nadā, and Sharh Ibn ‘Aqīl.',
    specializationAr: 'النحو والصرف، البلاغة والأدب العربي، الإعراب التطبيقي',
    specializationEn: 'Classical Arabic Grammar, Morphology, Eloquence & Practical I’rāb',
    credentialsAr: [
      'إجازة تدريس متن الآجرومية وملحة الإعراب',
      'خبرة أكثر من ١٠ سنوات في إكساب الطلاب مهارة النطق والفهم السليم',
      'مؤلف سلسلة التمارين الإعرابية لطلاب المرحلة المتوسطة'
    ],
    credentialsEn: [
      'Certified Licensure in teaching Al-Ajrūmiyyah & Classical Grammar Matns',
      '10+ Years experience training non-native and native speakers',
      'Author of practical I’rāb parsing drill exercises for secondary levels'
    ],
    sanadCertificationAr: 'إجازة في متون العربية المتوارثة عن أئمة البصرة والكوفة',
    sanadCertificationEn: 'Certified teaching authority in foundational classical linguistic texts',
    initials: 'BM',
    accentColor: 'from-sky-600 to-indigo-800',
    coursesTaught: ['arabic']
  },
  {
    id: 'ustazah-umm-kulthum',
    nameAr: 'الأستاذة أم كلثوم بنت أحمد',
    nameEn: 'Ustazah Umm Kulthum bint Ahmad',
    titleAr: 'المشرفة على حلقات الأخوات والناشئة',
    titleEn: 'Director of Women & Youth Halaqahs',
    roleAr: 'مقرئة ومعلمة القرآن والتأسيس اللغوي',
    roleEn: 'Quran Reciter & Child Literacy Specialist',
    bioAr: 'حافظة لكتاب الله، ذات باع طويل وخبرة تربوية تتجاوز ١٢ عاماً في تعليم الأطفال والفتيات القراءة القرآنية الصحيحة عبر القاعدة النورانية وتجويد اللسان وضبط المخارج والصفات في بيئة وقورة.',
    bioEn: 'Hafidhah of the Noble Quran with 12+ years of dedicated pedagogical experience nurturing children and women in fluent Quranic literacy, Noorani Qa’idah phonetics, and essential Islamic character.',
    specializationAr: 'التأسيس القرآني، القاعدة النورانية، تلاوة وتحفيظ الإناث',
    specializationEn: 'Quranic Phonics, Noorani Literacy, Women & Youth Halaqahs',
    credentialsAr: [
      'إجازة في تحفيظ القرآن الكريم وتجويده',
      'شهادة تدريب معتمدة في تعليم القاعدة النورانية والتهجي',
      'تدريب وإرشاد أكثر من ٢٠٠ طالبة وطفل في المخارج الصحيحة'
    ],
    credentialsEn: [
      'Certified Quran Reciter with authorization in foundational Tajwīd',
      'Accredited Master Trainer in Noorani Qa’idah phonetics pedagogy',
      'Mentored over 200 young learners and female students to fluency'
    ],
    sanadCertificationAr: 'إسناد متصل في القرآن الكريم وسند في القاعدة النورانية',
    sanadCertificationEn: 'Verified pedagogical chain in Quranic recitation and phonetics',
    initials: 'UK',
    accentColor: 'from-rose-600 to-purple-800',
    coursesTaught: ['tajweed', 'aqeedah']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    authorNameAr: 'الحاج إبراهيم أديمولا',
    authorNameEn: 'Alhaji Ibrahim Ademola',
    roleAr: 'ولي أمر لطالبين في المستوى التمهيدي والابتدائي',
    roleEn: 'Parent of 2 Students (Tamheediy & Ibtidā’iyya)',
    category: 'parent',
    countryAr: 'نيجيريا / لاغوس',
    countryEn: 'Lagos, Nigeria',
    quoteAr: 'كنت أبحث طويلاً عن حلقة إلكترونية لا تعتمد على الشكليات وإنما تبني أطفالي بناءً علمياً رصيناً. خلال ٦ أشهر مع أكاديمية ابن بشير، بدأ ابني البالغ من العمر ١١ عاماً يقرأ القرآن بأحكام التجويد السليمة وبفهم واضح لمخارج الحروف. بارك الله في جهود الشيخ والمدرسين.',
    quoteEn: 'I spent years searching for a virtual academy that wasn’t just surface-level. Within 6 months at Ibn Basheer Academy, my 11-year-old son began reciting with precise Tajwīd and confidence. The discipline and live teacher interaction give parents complete peace of mind.',
    rating: 5,
    highlightAr: 'متابعة شخصية ودقة متناهية في التأسيس القرآني للأطفال',
    highlightEn: 'Personal follow-up and unmatched Quranic foundation for youth'
  },
  {
    id: 'test-2',
    authorNameAr: 'المهندس فاروق أوبينسيه',
    authorNameEn: 'Eng. Farooq Obinshe',
    roleAr: 'مهندس برمجيات وطالب في المرحلة الإعدادية',
    roleEn: 'Software Engineer & I’dādiyya Student',
    category: 'student',
    countryAr: 'المملكة المتحدة / لندن',
    countryEn: 'London, United Kingdom',
    quoteAr: 'جدولي المهني مزدحم للغاية في لندن، لكن تنظيم حلقات عطلة نهاية الأسبوع وتوفير التسجيلات والمواد العلمية بصيغة PDF مكنني من دراسة الآجرومية وعلم الفرائض بكل سهولة. هذا ليس مجرد محتوى مسجل، بل شيخ يجيبك ويصحح لك أخطاءك مباشرة.',
    quoteEn: 'Balancing a demanding software career in London made full-time madrasah impossible. Ibn Basheer Academy’s structured weekend circles and downloadable lecture recordings made classical Nahw and Fiqh accessible. Having an authentic scholar verify your recitations live is priceless.',
    rating: 5,
    highlightAr: 'مرونة في الأوقات ومنهج دراسي أصيل يناسب العاملين',
    highlightEn: 'Flexible schedules and authentic classical pedagogy for professionals'
  },
  {
    id: 'test-3',
    authorNameAr: 'الدكتورة زينب عبد الله',
    authorNameEn: 'Dr. Zainab Abdullah',
    roleAr: 'طبيبة ووالدة لطالبة في حلقة الأخوات',
    roleEn: 'Physician & Mother of a Female Student',
    category: 'parent',
    countryAr: 'الإمارات العربية المتحدة / دبي',
    countryEn: 'Dubai, UAE',
    quoteAr: 'أعجبتني البيئة التعليمية المحتشمة والوقورة، وإشراف المعلمات الفاضلات في حلقة الفتيات. ابنتي تشعر بشغف كبير لحضور درس التجويد الأسبوعي والتسميع الشفهي.',
    quoteEn: 'The respectful, dignified environment and female faculty supervision for sisters gave us immense confidence. My daughter looks forward eagerly to her weekend recitation circle and oral evaluations.',
    rating: 5,
    highlightAr: 'بيئة حوارية وقورة وتأطير نسائي متخصص',
    highlightEn: 'Dignified environment with dedicated female scholarly supervision'
  },
  {
    id: 'test-4',
    authorNameAr: 'محمد الأمين بلو',
    authorNameEn: 'Muhammad Al-Amin Bello',
    roleAr: 'طالب جامعي وحاصل على إجازة تحفة الأطفال',
    roleEn: 'University Student & Tuḥfat al-Aṭfāl Graduate',
    category: 'graduate',
    countryAr: 'نيجيريا / أبوجا',
    countryEn: 'Abuja, Nigeria',
    quoteAr: 'أتممت حفظ ودراسة تحفة الأطفال مع الشيخ أبي عبد الله ونلت شهادة إتمام المتن بعد اختبار شفوي دقيق. المنهجية هنا تجمع بين بركة التلقي المباشر ونظام التعليم الحديث.',
    quoteEn: 'I completed the recitation and explanation of Tuḥfat al-Aṭfāl under Ustaz Abu Abdullah, earning my formal certification after rigorous oral testing. It bridges traditional transmission with modern virtual organization.',
    rating: 5,
    highlightAr: 'إجازات علمية موثوقة واختبارات شفهية صارمة',
    highlightEn: 'Verified academic certifications and rigorous oral assessments'
  }
];

export const TUITION_PLANS: TuitionPlan[] = [
  {
    id: 'plan-tamheediy',
    levelId: 'tamheediy',
    titleAr: 'المستوى التمهيدي (التأسيسي)',
    titleEn: 'Preparatory Foundation (Tamheediy)',
    taglineAr: 'للمبتدئين والناشئة — تأسيس الحروف وضبط مخارج التجويد',
    taglineEn: 'For beginners and youth building authentic Arabic and Tajwīd foundations',
    termFee: '₦15,000 / $25',
    billingPeriodAr: 'لكل فصل دراسي (٣ أشهر)',
    billingPeriodEn: 'Per Academic Term (3 Months)',
    featuresAr: [
      'حصتان تفاعليتان أسبوعياً مع المشرفين المباشرين',
      'حلقات صغيرة لا تتعدى ١٢ طالباً لضمان التسميع الشخصي',
      'كتب ومذكرات القاعدة النورانية والتجويد بصيغة PDF مجاناً',
      'وصول كامل للتسجيلات الصفية وبوابة الطالب الإلكترونية',
      'تقرير تقدم دوري يرسل لأولياء الأمور نهاية كل شهر'
    ],
    featuresEn: [
      '2 Interactive live circles per week with direct faculty',
      'Small halaqah size (max 12 students) ensuring 1-on-1 recitation',
      'Free digital workbooks and Noorani Qa’idah study notes (PDF)',
      'Full access to session video archives and student portal',
      'Monthly academic progress and attendance reports for parents'
    ],
    isPopular: false
  },
  {
    id: 'plan-ibtidaiyya',
    levelId: 'ibtidaiyya',
    titleAr: 'المرحلة الابتدائية الشرعية',
    titleEn: 'Primary Shari’ah (Ibtidā’iyya)',
    taglineAr: 'البرنامج الأكثر طلباً — دراسة النحو والفقه والعقيدة من المتون',
    taglineEn: 'Most popular program — Core Arabic grammar, jurisprudence and creed',
    termFee: '₦20,000 / $35',
    billingPeriodAr: 'لكل فصل دراسي (٣ أشهر)',
    billingPeriodEn: 'Per Academic Term (3 Months)',
    featuresAr: [
      '٣ حصص أسبوعية تشمل النحو، الفقه الميسر، والعقيدة',
      'دراسة متني الآجرومية في النحو والأصول الثلاثة',
      'تطبيقات إعرابية وتدريبات شفهية وتصحيح واجبات أسبوعي',
      'اختبارات تقييمية نصف فصلية ونهائية مع درجات رسمية',
      'شهادة اجتياز معتمدة وسجل أكاديمي موثق عند إكمال المرحلة'
    ],
    featuresEn: [
      '3 Live weekly sessions covering Grammar, Fiqh, and Aqeedah',
      'Structured study of Al-Ajrūmiyyah and Al-Uṣūl ath-Thalāthah',
      'Weekly practical grammatical parsing (I’rāb) & homework grading',
      'Mid-term and final written/oral assessments with transcript',
      'Verified Certificate of Completion upon finishing the stage'
    ],
    isPopular: true
  },
  {
    id: 'plan-advanced',
    levelId: 'thanawiyya',
    titleAr: 'المرحلة الثانوية والتخصصية',
    titleEn: 'Advanced & Specialized Seminary',
    taglineAr: 'للدارسين المتقدمين — الفرائض، مصطلح الحديث، والقراءات',
    taglineEn: 'For serious seekers — Inheritance math, Hadith science & Advanced Tajwīd',
    termFee: '₦25,000 / $40',
    billingPeriodAr: 'لكل فصل دراسي (٣ أشهر)',
    billingPeriodEn: 'Per Academic Term (3 Months)',
    featuresAr: [
      'حلقات نقاش متعمقة في علم الفرائض وقواعد المواريث',
      'شروح موسعة على متون الحديث ومصطلح المحدثين',
      'إشراف وإجازات بالسند المتصل للطلبة المتميزين',
      'ساعات مكتبية مفتوحة للمراجعة والمناقشة مع الشيخ',
      'سجل درجات أكاديمي رسمي متاح للطباعة من البوابة'
    ],
    featuresEn: [
      'Advanced seminar halaqahs in Islamic Inheritance law (Farā’iḍ)',
      'In-depth study of Hadith verification & classical commentaries',
      'Qualification pathway for certified chains of transmission (Isnād)',
      'Direct faculty office hours for consultation and recitation',
      'Official verifiable digital academic transcript'
    ],
    isPopular: false
  }
];

export const ADMISSION_FAQS: AdmissionFAQ[] = [
  {
    id: 'faq-1',
    category: 'admissions',
    questionAr: 'كيف تتم عملية القبول وما هي المتطلبات الأساسية؟',
    questionEn: 'How does admission work and what are the prerequisites?',
    answerAr: 'التسجيل مفتوح للجميع من عمر ٧ سنوات فما فوق. تبدأ العملية بملء استمارة التسجيل الإلكترونية، يتبعها تحديد موعد لمقابلة تقييمية قصيرة (عبر واتساب أو زووم) لتحديد المستوى المناسب للطالب سواء في التأسيس القرآني أو المستويات الشرعية المتقدمة.',
    answerEn: 'Admission is open to all applicants aged 7 and above. The process begins with submitting an online application, followed by a brief diagnostic assessment (via WhatsApp or Zoom) to place the student in the most suitable level, from beginner phonetics to advanced grammar.'
  },
  {
    id: 'faq-2',
    category: 'tuition',
    questionAr: 'كيف يتم سداد الرسوم الدراسية وهل تتوفر خصومات للعائلات؟',
    questionEn: 'How do I pay tuition fees, and are family discounts available?',
    answerAr: 'حرصاً على التيسير، يتم سداد الرسوم فصلياً عبر التحويل البنكي المباشر مع تأكيد الإيصال فوراً عبر واتساب مع أمين الصندوق. نقدم خصماً عائلياً بنسبة ١٥٪ للأخ الثاني و٢٥٪ للطفل الثالث المسجلين من نفس الأسرة.',
    answerEn: 'Tuition is billed per term and processed via transparent bank transfer. Simply confirm your transfer slip via WhatsApp with the academy bursar. We proudly offer a 15% discount for the second child and 25% for the third child enrolled from the same household.'
  },
  {
    id: 'faq-3',
    category: 'schedule',
    questionAr: 'ما هي مواعيد الحلقات وهل تتناسب مع أوقات المدارس والعمل؟',
    questionEn: 'What are the class timings and can they fit around school or work?',
    answerAr: 'تم تصميم أوقات الحلقات لتلائم الطلاب والمهنيين؛ حيث تعقد حلقات الناشئة والطلاب غالباً في عطلة نهاية الأسبوع (السبت والأحد صباحاً ومساءً)، بينما تعقد حلقات المتقدمين في أوقات مسائية مريحة. بالإضافة إلى ذلك، تسجل جميع الحصص تلقائياً وتكون متاحة للمراجعة على مدار الساعة.',
    answerEn: 'Schedules are intentionally crafted around modern obligations. Youth and working professionals primarily attend weekend halaqahs (Saturday & Sunday mornings/afternoons), while weekday tracks operate during relaxed evening hours. All live sessions are recorded for 24/7 review.'
  },
  {
    id: 'faq-4',
    category: 'academics',
    questionAr: 'هل يحصل الطالب على شهادة أو إجازة معتمدة عند إتمام دراسته؟',
    questionEn: 'Do students receive recognized certificates or academic credentials?',
    answerAr: 'نعم، يحصل كل طالب يجتاز الاختبارات الدورية والنهائية بنجاح على شهادة إتمام موثقة برقم تسلسلي وسجل درجات رسمي (Transcript). أما في فصول المتون والتجويد المتقدم، يمنح الطالب المتميز إجازة مسندة بالسند المتصل إلى مؤلف المتن عند استيفاء شروط الحفظ والإتقان.',
    answerEn: 'Yes. Students successfully passing assessments receive a formal, verifiable Certificate of Completion with an official academic transcript. In advanced Tajwīd and Matn courses, qualifying students can attain an authentic Isnād certification connecting them to classical authors.'
  },
  {
    id: 'faq-5',
    category: 'academics',
    questionAr: 'هل توجد حلقات مخصصة للأخوات والفتيات بإشراف معلمات؟',
    questionEn: 'Are there separate halaqahs for sisters and young girls?',
    answerAr: 'نعم بكل تأكيد. تخصص الأكاديمية حلقات منفصلة تماماً للأخوات والفتيات الناشئات تشرف عليها معلمات مجازات ومتخصصات في القرآن والعلوم الشرعية لضمان الراحة والوقار التام.',
    answerEn: 'Yes, absolutely. The academy provides dedicated circles for sisters and young girls supervised entirely by qualified female instructors, ensuring a comfortable, supportive, and dignified learning environment.'
  }
];
