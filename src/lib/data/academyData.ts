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
    badgeColor: 'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
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
    badgeColor: 'bg-brand-100 text-brand-800 ring-1 ring-brand-300',
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
    badgeColor: 'bg-brand-200 text-brand-900 ring-1 ring-brand-400',
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
    badgeColor: 'bg-brand-600 text-white ring-1 ring-brand-600',
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
    badgeColor: 'bg-accent-100 text-accent-800 ring-1 ring-accent-300',
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
