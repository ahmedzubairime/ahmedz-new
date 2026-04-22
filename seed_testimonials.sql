-- Run this SQL in your Supabase SQL Editor to seed some testimonials
INSERT INTO public.homepage_testimonials (quote_en, quote_ar, author_name_en, author_name_ar, author_title_en, author_title_ar, sort_order)
VALUES 
(
  'Ahmed is a visionary leader. His strategic direction has profoundly impacted our organizational performance.',
  'أحمد قائد ذو رؤية. كان لتوجيهاته الاستراتيجية تأثير عميق على أداء منظمتنا.',
  'David Chen',
  'ديفيد تشين',
  'Regional Director, UN',
  'مدير إقليمي، الأمم المتحدة',
  1
),
(
  'The level of precision and dedication Ahmed brings to project execution is unmatched. A true sovereign in his field.',
  'مستوى الدقة والتفاني الذي يجلبه أحمد لإدارة المشاريع لا مثيل له. خبير حقيقي في مجاله.',
  'Sarah Al-Haj',
  'سارة الحاج',
  'Head of Partnerships',
  'رئيس قسم الشراكات',
  2
),
(
  'Working with Ahmed guarantees outcomes. He bridges the gap between high-level strategy and ground-level realities seamlessly.',
  'العمل مع أحمد يضمن النتائج. إنه يسد الفجوة بين الاستراتيجية رفيعة المستوى والواقع على الأرض بسلاسة.',
  'John Smith',
  'جون سميث',
  'Senior Consultant',
  'مستشار أول',
  3
);
