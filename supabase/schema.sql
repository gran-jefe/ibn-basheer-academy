-- ============================================================
-- Ibn Basheer Academy for Arabic & Islamic Studies
-- Complete PostgreSQL Schema & Row Level Security (RLS)
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Types & Enums
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE enrollment_status AS ENUM ('pending', 'active', 'completed', 'suspended');
CREATE TYPE material_type AS ENUM ('pdf', 'audio', 'video');
CREATE TYPE submission_status AS ENUM ('submitted', 'graded', 'revision_required');
CREATE TYPE recitation_status AS ENUM ('pending', 'reviewed');
CREATE TYPE class_status AS ENUM ('upcoming', 'live', 'completed');

-- 3. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  role user_role DEFAULT 'student' NOT NULL,
  enrolled_level_id TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Academic Levels Table (The 5 Graded Levels)
CREATE TABLE IF NOT EXISTS academic_levels (
  id TEXT PRIMARY KEY,
  stage_number INT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  duration_en TEXT NOT NULL,
  duration_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  badge_color TEXT NOT NULL,
  prerequisite_en TEXT NOT NULL,
  prerequisite_ar TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Courses Table (The 10 Core Academic Subjects)
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  number INT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  primary_text_en TEXT,
  primary_text_ar TEXT,
  instructor_name TEXT NOT NULL DEFAULT 'Ustaz Abu Abdullah Al-Mubaarak',
  icon_name TEXT NOT NULL DEFAULT 'BookOpen',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Course-to-Level Junction Table
CREATE TABLE IF NOT EXISTS course_levels (
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  level_id TEXT REFERENCES academic_levels(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, level_id)
);

-- 7. Enrollments & Admission Applications
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  level_id TEXT REFERENCES academic_levels(id) ON DELETE SET NULL,
  course_id TEXT REFERENCES courses(id) ON DELETE SET NULL,
  notes TEXT,
  status enrollment_status DEFAULT 'pending' NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  enrolled_at TIMESTAMPTZ
);

-- 8. Live Virtual Classes Table
CREATE TABLE IF NOT EXISTS live_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  subject_en TEXT NOT NULL,
  subject_ar TEXT NOT NULL,
  level_id TEXT REFERENCES academic_levels(id) ON DELETE SET NULL,
  instructor_name TEXT NOT NULL,
  day_en TEXT NOT NULL,
  day_ar TEXT NOT NULL,
  time_en TEXT NOT NULL,
  time_ar TEXT NOT NULL,
  meet_url TEXT NOT NULL,
  status class_status DEFAULT 'upcoming' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Course Materials Table (PDF Notes & Audio Recordings)
CREATE TABLE IF NOT EXISTS course_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  type material_type NOT NULL,
  size_or_duration TEXT NOT NULL,
  download_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  level_id TEXT REFERENCES academic_levels(id) ON DELETE SET NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  total_points INT DEFAULT 100 NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. Student Assignment Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  submission_text TEXT,
  file_url TEXT,
  status submission_status DEFAULT 'submitted' NOT NULL,
  grade INT,
  instructor_feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  graded_at TIMESTAMPTZ
);

-- 12. Recitation Studio Submissions Table (Studio Arabiya Model)
CREATE TABLE IF NOT EXISTS recitation_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  surah_name TEXT NOT NULL,
  verses_range TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration_seconds INT NOT NULL,
  status recitation_status DEFAULT 'pending' NOT NULL,
  score INT,
  max_score INT DEFAULT 50 NOT NULL,
  feedback_makharij TEXT,
  feedback_sifat TEXT,
  instructor_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  reviewed_at TIMESTAMPTZ
);

-- 13. Academy Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  category TEXT DEFAULT 'general' NOT NULL,
  published_at DATE DEFAULT CURRENT_DATE NOT NULL
);

-- ============================================================
-- 14. Row Level Security (RLS) Policies
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recitation_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Public Read for Catalog Data
CREATE POLICY "Public read academic levels" ON academic_levels FOR SELECT USING (true);
CREATE POLICY "Public read courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public read course levels" ON course_levels FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public create enrollment application" ON enrollments FOR INSERT WITH CHECK (true);

-- Authenticated Users: Read Live Classes & Materials
CREATE POLICY "Users read live classes" ON live_classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users read materials" ON course_materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users read assignments" ON assignments FOR SELECT TO authenticated USING (true);

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Submissions Policies (Students see only their own, Teachers see all)
CREATE POLICY "Students see own submissions" ON submissions 
  FOR SELECT TO authenticated 
  USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));

CREATE POLICY "Students create own submissions" ON submissions 
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers grade submissions" ON submissions 
  FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));

-- Recitation Submissions Policies
CREATE POLICY "Students see own recitations" ON recitation_submissions 
  FOR SELECT TO authenticated 
  USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));

CREATE POLICY "Students submit recitation" ON recitation_submissions 
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers review recitations" ON recitation_submissions 
  FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin')));

-- ============================================================
-- 15. User Creation Trigger (Sync auth.users -> profiles)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Student'),
    new.email,
    'student'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 16. Seed Initial Data for Academic Levels & Courses
-- ============================================================
INSERT INTO academic_levels (id, stage_number, title_en, title_ar, duration_en, duration_ar, description_en, description_ar, badge_color, prerequisite_en, prerequisite_ar)
VALUES
  ('tamheediy', 1, 'Tamheediy (Preparatory)', 'المستوى التمهيدي', '6 Months', '٦ أشهر', 'Foundational literacy in Arabic reading, basic Tajwīd rules, and core Aqīdah.', 'مخصص للمبتدئين لبناء أساس قوي في قراءة العربية وتطبيق أحكام التجويد الأساسية ومبادئ العقيدة.', 'bg-brand-50 text-brand-700 ring-1 ring-brand-200', 'None (open to beginners)', 'لا يشترط وجود دراسة سابقة'),
  ('ibtidaiyya', 2, 'Ibtidā’iyya (Primary)', 'المرحلة الابتدائية', '2 Years', 'سنتان', 'Primary Islamic Fiqh, Sirah, Hadith collections, and intermediate Arabic grammar.', 'دراسة شاملة لفقه العبادات، السيرة النبوية، الأحاديث الشريفة، ومعارف العربية التأسيسية.', 'bg-brand-100 text-brand-800 ring-1 ring-brand-300', 'Completion of Tamheediy', 'إتمام المستوى التمهيدي'),
  ('idadiyya', 3, 'I’dādiyya (Junior Secondary)', 'المرحلة الإعدادية', '2 Years', 'سنتان', 'Analytical study of Muṣṭalaḥ al-Ḥadīth, detailed Fiqh, Tafsīr, and advanced Nahw/Sarf.', 'دراسة دراسة تحليليّة لمصطلح الحديث الشريف، الفقه المقارن، التفسير، وعلوم النحو والصرف.', 'bg-brand-200 text-brand-900 ring-1 ring-brand-400', 'Completion of Ibtidā’iyya', 'إتمام المرحلة الابتدائية'),
  ('thanawiyya', 4, 'Thanāwiyya (Senior Secondary)', 'المرحلة الثانوية', '2 Years', 'سنتان', 'Specialization in Islamic Inheritance (Farā’iḍ), Usūl al-Fiqh, and major Hadith texts.', 'التخصص المتقدم في علم الفرائض والمواريث، أصول الفقه، أمهات كتب الحديث، والأدب العربي.', 'bg-brand-600 text-white ring-1 ring-brand-600', 'Completion of I’dādiyya', 'إتمام المرحلة الإعدادية'),
  ('tejweed-class', 5, 'Tejweed Intensive Class', 'دورة التجويد المكثفة', 'Specialized Track', 'مسار متخصص', 'Dedicated theoretical and practical Quranic recitation rules and Ijazah preparation.', 'دراسة نظرية وتطبيقية مكثفة لأحكام تلاوة القرآن الكريم وتصحيح مخارج الحروف والصفات.', 'bg-accent-100 text-accent-800 ring-1 ring-accent-300', 'Fluent Quran reading', 'القدرة على قراءة القرآن')
ON CONFLICT (id) DO NOTHING;

INSERT INTO courses (id, number, title_en, title_ar, description_en, description_ar, primary_text_en, primary_text_ar, icon_name)
VALUES
  ('quran', 1, 'Qur’an Studies', 'دراسات القرآن الكريم', 'Memorization, exegesis (Tafsīr), and contemplation of the Holy Qur’an.', 'حفظ وتفسير وتدبر آيات الكتاب العزيز وفق منهج سلف الأمة.', 'Tafsīr al-Saʿdī', 'تيسير الكريم الرحمن (تفسير السعدي)', 'BookOpen'),
  ('tajweed', 2, 'Tajwīd', 'التجويد', 'Mastery of Quranic recitation rules, articulation points, and phonetic characteristics.', 'قواعد إتقان تلاوة القرآن الكريم ومخارج الحروف والصفات.', 'Tuḥfat al-Aṭfāl & Al-Manẓūmah al-Jazariyyah', 'تحفة الأطفال والمنظومة الجزرية', 'Mic'),
  ('arabic', 3, 'Arabic Language', 'اللغة العربية', 'Arabic Grammar (Naḥw), Morphology (Ṣarf), Rhetoric (Balāghah), and conversational skills.', 'النحو والصرف والبلاغة وقواعد الإملاء والمحادثة اليومية.', 'Al-Ajrūmiyyah & Qaṭr an-Nadā', 'متن الآجرومية وقطر الندى', 'Languages'),
  ('aqidah', 4, 'Tawḥīd & ʿAqīdah', 'التوحيد والعقيدة', 'Foundational Islamic Creed, the three categories of Tawḥīd, and pillars of Imān.', 'دراسة عقيدة أهل السنة والجماعة، أنواع التوحيد الثلاثة وأركان الإيمان.', 'Al-Uṣūl al-Thalāthah & Al-ʿAqīdah al-Wāsiṭiyyah', 'الأصول الثلاثة والعقيدة الواسطية', 'Compass'),
  ('fiqh', 5, 'Islamic Fiqh', 'الفقه الإسلامي', 'Jurisprudence of Worship (ʿIbādāt), Financial Transactions (Muʿāmalāt), and Family Law.', 'فقه العبادات والمعاملات والأحوال الشخصية على ضوء الدليل الشرعي.', 'Matn Abī Shujāʿ & Manhaj al-Sālikīn', 'متن أبي شجاع ومنهج السالكين', 'Scale'),
  ('hadith', 6, 'Ḥadīth', 'الحديث النبوي', 'Memorization and comprehension of prophetic traditions including Forty Hadith.', 'حفظ وفهم جوامع كلم النبي ﷺ وشروح الأربعين النووية ورياض الصالحين.', 'Al-Arbaʿūn al-Nawawiyyah & ʿUmdat al-Aḥkām', 'الأربعون النووية وعمدة الأحكام', 'ScrollText'),
  ('mustalah', 7, 'Muṣṭalaḥ al-Ḥadīth', 'مصطلح الحديث', 'Science of Ḥadīth terminology, evaluation of transmission chains, and authenticity grades.', 'قواعد معرفة أحوال الرواية والمرويات وتصنيف الأحاديث صحة وضعفاً.', 'Al-Manẓūmah al-Bayqūniyyah', 'المنظومة البيقونية ونخبة الفكر', 'CheckCheck'),
  ('sirah', 8, 'Sīrah', 'السيرة النبوية', 'Comprehensive biography of Prophet Muhammad ﷺ and lessons for personal development.', 'دراسة حيوية لسيرة النبي ﷺ من الميلاد حتى الوفاة والعبر المستفادة.', 'Al-Urjūzah al-Mi’iyyah & Al-Raḥīq al-Makhtūm', 'الأرجوزة المئية والرحيق المختوم', 'History'),
  ('faraid', 9, 'Farā’iḍ / Islamic Inheritance', 'الفرائض وعلم المواريث', 'Islamic inheritance laws, share calculations, and estate distribution rules.', 'أحكام التركات وحساب السهام وتوزيع المواريث حسب الشريعة الإسلامية.', 'Matn al-Raḥabiyyah', 'متن الرحبية في علم الفرائض', 'Calculator'),
  ('akhlaq', 10, 'Akhlāq & Islamic Manners', 'الأخلاق والآداب الإسلامية', 'Character refinement, etiquette of seeking knowledge, and practical Islamic morals.', 'تهذيب النفوس والتحلي بآداب طالب العلم والأخلاق الإسلامية الفاضلة.', 'Hilyat Ṭālib al-ʿIlm & Bidāyat al-Hidāyah', 'حلية طالب العلم وبداية الهداية', 'Heart')
ON CONFLICT (id) DO NOTHING;
