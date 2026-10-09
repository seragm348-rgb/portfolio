/* ==========================================================================
   CONTENT CONFIG — the single place to edit site data.
   Anything in [SQUARE BRACKETS] is a placeholder you must replace with real data.
   Strings can be plain text or { en:'…', ar:'…' } (Arabic falls back to English).
   ========================================================================== */
window.CONTENT = {

  site: {
    name: 'Serag Abotaleb',
    fullName: 'Serag Mohamed Abdelkareem Abotaleb',
    role: 'Cloud & Infrastructure Engineer',
    email: 'seragdevops@gmail.com',
    linkedin: 'https://www.linkedin.com/in/serag-mohamed/',
    github: 'https://github.com/seragm348-rgb', // empty hides every GitHub button
    cv: 'Serag_Mohamed_CV.pdf',
    siteUrl: 'https://seragm348-rgb.github.io/portfolio/',
    location: { en: 'Tanta, Egypt', ar: 'طنطا، مصر' },
    // Contact form backend. Create a free form at https://formspree.io and paste its endpoint,
    // e.g. 'https://formspree.io/f/abcdwxyz'. Empty = form falls back to opening the mail client.
    formEndpoint: '',
    // CI badge: live once .github/workflows/ci.yml (in the zip) is added to the repo.
    ciBadge: 'https://github.com/seragm348-rgb/portfolio/actions/workflows/ci.yml/badge.svg',
    ciLink: 'https://github.com/seragm348-rgb/portfolio/actions',
    hosting: { en: 'Hosted on GitHub Pages', ar: 'مستضاف على GitHub Pages' } // or 'S3 + CloudFront'
  },

  /* ---------- 4. CREDENTIALS (only real items; status: 'done' | 'progress') ---------- */
  credentials: [
    {
      title: { en: 'DEPI — DevOps Track', ar: 'DEPI — مسار DevOps' },
      issuer: { en: 'Digital Egypt Pioneers Initiative', ar: 'مبادرة رواد مصر الرقمية' },
      date: '2026', cat: 'devops', status: 'progress',
      learnings: { en: 'Infrastructure and deployment concepts, CI/CD and containerization fundamentals.', ar: 'مفاهيم البنية التحتية والنشر، وأساسيات CI/CD والحاويات.' },
      tags: ['DevOps', 'CI/CD', 'Linux'],
      link: ''                          // [ADD CERTIFICATE URL WHEN ISSUED]
    },
    {
      title: { en: 'CCNA — Routing & Switching Fundamentals', ar: 'CCNA — أساسيات التوجيه والتحويل' },
      issuer: { en: 'Self-study (not yet certified)', ar: 'دراسة ذاتية (لم يُعتمد بعد)' },
      date: '2026', cat: 'networking', status: 'progress',
      learnings: { en: 'Routing, switching, VLANs and subnetting practiced in Cisco Packet Tracer.', ar: 'التوجيه والتحويل وVLANs والـ subnetting عملياً على Packet Tracer.' },
      tags: ['Routing', 'Switching', 'VLANs'],
      link: ''
    }
    // Template — copy for each real certificate:
    // { title:'[CERT NAME]', issuer:'[ISSUER]', date:'[YYYY]', cat:'aws', status:'done',
    //   learnings:'[WHAT YOU LEARNED]', tags:['[TAG]'], link:'[VERIFY URL]' },
  ],

  /* ---------- 5. SKILLS (highlight:true → shown up front, max ~12; level: 'hands' | 'learning') ---------- */
  skills: [
    { group: 'cloud', label: { en: 'Cloud & AWS', ar: 'السحابة و AWS' }, brand: 'aws', items: [
      { name: 'IAM — users, roles, policies, trust policies', level: 'hands', highlight: true },
      { name: 'EC2 & Launch Templates', level: 'hands', highlight: true },
      { name: 'S3', level: 'hands', highlight: true },
      { name: 'ALB & Target Groups', level: 'hands', highlight: true },
      { name: 'Auto Scaling Groups', level: 'hands', highlight: true },
      { name: 'CloudFront + OAC', level: 'hands', highlight: true },
      { name: 'Security Groups', level: 'hands' },
      { name: 'AWS Console', level: 'hands' },
      { name: 'EBS', level: 'learning' }
    ]},
    { group: 'net', label: { en: 'Networking', ar: 'الشبكات' }, brand: 'network', items: [
      { name: 'Routing & Switching', level: 'hands', highlight: true },
      { name: 'VLANs & Subnetting', level: 'hands', highlight: true },
      { name: 'Network Troubleshooting (L1–L3)', level: 'hands', highlight: true },
      { name: 'IP & MAC Addressing', level: 'hands' },
      { name: 'TCP/IP', level: 'learning' },
      { name: 'NAT', level: 'learning' },
      { name: 'ACLs', level: 'learning' }
    ]},
    { group: 'linux', label: { en: 'Linux', ar: 'لينكس' }, brand: 'linux', items: [
      { name: 'Linux CLI & Fundamentals', level: 'hands', highlight: true },
      { name: 'Basic Sysadmin', level: 'learning' },
      { name: 'Linux Networking', level: 'learning' }
    ]},
    { group: 'devops', label: { en: 'DevOps', ar: 'DevOps' }, brand: 'docker', items: [
      { name: 'CI/CD Fundamentals', level: 'learning', highlight: true },
      { name: 'Containerization Fundamentals', level: 'learning' },
      { name: 'Infrastructure & Deployment Concepts', level: 'learning' }
    ]},
    { group: 'tools', label: { en: 'Tools', ar: 'الأدوات' }, brand: 'git', items: [
      { name: 'Cisco Packet Tracer', level: 'hands', highlight: true },
      { name: 'Git & GitHub', level: 'learning' }
    ]}
  ],

  /* Tech-stack strip (real tool logos). level 'learning' is shown as such. */
  stack: [
    { brand: 'aws', name: 'AWS', level: 'hands' },
    { brand: 'linux', name: 'Linux', level: 'hands' },
    { brand: 'network', name: 'Networking', level: 'hands' },
    { brand: 'cisco', name: 'Packet Tracer', level: 'hands' },
    { brand: 'iam', name: 'IAM', level: 'hands' },
    { brand: 'git', name: 'Git', level: 'learning' },
    { brand: 'docker', name: 'Docker', level: 'learning' },
    { brand: 'terraform', name: 'Terraform', level: 'learning' }
  ],

  /* ---------- 6. EXPERIENCE / TRAINING JOURNEY (Challenge → Action → Result) ---------- */
  experience: [
    {
      org: 'DEPI', title: { en: 'DevOps Track Trainee', ar: 'متدرب مسار DevOps' },
      sub: { en: 'Digital Egypt Pioneers Initiative', ar: 'مبادرة رواد مصر الرقمية' },
      date: { en: '2026 – Present', ar: '2026 – حتى الآن' }, mode: '[ADD: Online / On-site / Hybrid]', ongoing: true,
      challenge: { en: 'Moving from cloud labs to a structured DevOps workflow: deployment, automation and CI/CD.', ar: 'الانتقال من معامل السحابة إلى سير عمل DevOps منظم: النشر والأتمتة وCI/CD.' },
      action: { en: '[ADD: what you are building in the track — e.g. pipelines, containers, labs].', ar: '[أضف: ما تبنيه في المسار].' },
      result: { en: '[ADD REAL RESULT] — in progress.', ar: '[أضف نتيجة حقيقية] — قيد التنفيذ.' },
      tags: ['DevOps', 'CI/CD', 'Linux']
    },
    {
      org: 'LAB', title: { en: 'Self-directed AWS & networking labs', ar: 'معامل AWS وشبكات ذاتية' },
      sub: { en: 'Independent, hands-on', ar: 'عمل ذاتي وعملي' },
      date: { en: '[ADD START] – Present', ar: '[أضف البداية] – حتى الآن' }, mode: 'Self-directed', ongoing: true,
      challenge: { en: 'No professional experience yet — needed real, verifiable infrastructure practice.', ar: 'لا توجد خبرة مهنية بعد — احتجت ممارسة حقيقية قابلة للتحقق.' },
      action: { en: 'Built a multi-AZ ALB + Auto Scaling stack, key-free EC2 → S3 access via IAM roles, a private-origin CloudFront site, and Packet Tracer topologies.', ar: 'بنيت ALB + Auto Scaling متعدد المناطق، ووصول EC2 → S3 بدون مفاتيح عبر IAM roles، وموقع CloudFront بأصل خاص، وطوبولوجيات Packet Tracer.' },
      result: { en: 'Four documented case studies (see Projects). Diagnosed and fixed a real AssumeRole trust-policy failure.', ar: 'أربع دراسات حالة موثقة (انظر المشاريع)، وتشخيص وإصلاح فشل AssumeRole حقيقي.' },
      tags: ['AWS', 'IAM', 'Networking']
    }
  ],

  /* ---------- 7. SERVICES ---------- */
  services: [
    { id: 'iam', icon: 'key', plan: 'iam',
      title: { en: 'AWS Access & IAM Troubleshooting', ar: 'حل مشاكل الوصول و IAM في AWS' },
      desc: { en: 'Root-causing broken role/policy access instead of patching around it — for small teams that need it fixed properly.', ar: 'الوصول لجذر مشاكل الـ roles والـ policies بدلاً من الترقيع — للفرق الصغيرة.' },
      deliverables: [{ en: 'Root-cause write-up', ar: 'تقرير السبب الجذري' }, { en: 'Corrected policy / trust relationship', ar: 'سياسة أو trust relationship مصححة' }, { en: 'Verification steps you can re-run', ar: 'خطوات تحقق قابلة للتكرار' }] },
    { id: 'review', icon: 'search', plan: 'review',
      title: { en: 'Cloud Architecture Review', ar: 'مراجعة معمارية السحابة' },
      desc: { en: 'A second pair of eyes on a small AWS setup — security groups, IAM boundaries, and basic cost/availability sanity checks.', ar: 'نظرة ثانية على إعداد AWS صغير — Security Groups وحدود IAM وفحص التكلفة والتوافرية.' },
      deliverables: [{ en: 'Findings list ranked by risk', ar: 'قائمة ملاحظات مرتبة حسب الخطورة' }, { en: 'Architecture diagram', ar: 'مخطط معماري' }, { en: 'Prioritized fix plan', ar: 'خطة إصلاح بالأولوية' }] },
    { id: 'setup', icon: 'layers', plan: 'setup',
      title: { en: 'Basic Infrastructure Setup', ar: 'إعداد بنية تحتية أساسية' },
      desc: { en: "Getting a lean team's first EC2/S3/CloudFront setup running securely, from scratch.", ar: 'تشغيل أول إعداد EC2/S3/CloudFront بشكل آمن من الصفر.' },
      deliverables: [{ en: 'Working EC2 / S3 / CloudFront setup', ar: 'إعداد EC2 / S3 / CloudFront يعمل' }, { en: 'Least-privilege IAM', ar: 'IAM بأقل صلاحيات' }, { en: 'Hand-off documentation', ar: 'توثيق التسليم' }] }
  ],

  /* ---------- 8. PRICING (edit prices here only) ---------- */
  pricing: {
    currency: '$',
    plans: [
      { id: 'iam', name: { en: 'IAM Fix', ar: 'إصلاح IAM' }, from: 40, to: 120, unit: { en: 'per engagement', ar: 'لكل مهمة' },
        includes: [{ en: 'Diagnosis of one access issue', ar: 'تشخيص مشكلة وصول واحدة' }, { en: 'Fix + verification', ar: 'إصلاح + تحقق' }, { en: 'Short written root cause', ar: 'تقرير مختصر بالسبب' }, { en: '[ADD: revisions / turnaround]', ar: '[أضف: التعديلات / مدة التسليم]' }] },
      { id: 'review', name: { en: 'Architecture Review', ar: 'مراجعة معمارية' }, from: 60, to: 150, unit: { en: 'per review', ar: 'لكل مراجعة' }, recommended: true,
        includes: [{ en: 'Security group & IAM boundary audit', ar: 'تدقيق Security Groups وحدود IAM' }, { en: 'Cost / availability sanity check', ar: 'فحص التكلفة والتوافرية' }, { en: 'Diagram + ranked findings', ar: 'مخطط + ملاحظات مرتبة' }, { en: '[ADD: call / revisions]', ar: '[أضف: مكالمة / تعديلات]' }] },
      { id: 'setup', name: { en: 'Infrastructure Setup', ar: 'إعداد البنية' }, from: 80, to: 200, unit: { en: 'per setup', ar: 'لكل إعداد' },
        includes: [{ en: 'EC2 / S3 / CloudFront from scratch', ar: 'EC2 / S3 / CloudFront من الصفر' }, { en: 'Least-privilege IAM', ar: 'IAM بأقل صلاحيات' }, { en: 'Hand-off docs', ar: 'توثيق التسليم' }, { en: '[ADD: support window]', ar: '[أضف: فترة الدعم]' }] }
    ],
    custom: { name: { en: 'Custom quote', ar: 'عرض سعر مخصص' }, desc: { en: 'Something different or larger? Describe it and get a scoped quote.', ar: 'شيء مختلف أو أكبر؟ اشرحه واحصل على عرض مخصص.' } }
  },

  /* ---------- 9. PROJECT EXTRAS (merged into the existing case studies by id) ---------- */
  projectsExtra: {
    'ha-web': { role: 'Solo — designed, built and documented', metric: '[ADD REAL NUMBER: e.g. instances scaled / failover time]', repo: '', proof: 'alb',
      how: ['Launch Template defines the instance image, user-data and security group', 'ASG spans [ADD AZ COUNT] AZs with target-tracking on CPU [ADD TARGET %]', 'ALB health checks gate traffic to the target group'] },
    'iam-ec2-s3': { role: 'Solo — diagnosed and fixed', metric: '[ADD REAL NUMBER: e.g. long-term keys removed]', repo: '', proof: 'iam',
      how: ['Instance profile attaches the EC2 → S3 role', 'Trust policy Principal corrected to the right service/account', 'Verified with aws sts assume-role and an S3 read'] },
    'static-site': { role: 'Solo — designed and deployed', metric: '[ADD REAL NUMBER: e.g. direct S3 requests blocked]', repo: '', proof: 's3',
      how: ['S3 Block Public Access enabled on the bucket', 'CloudFront distribution with Origin Access Control', 'Bucket policy allows only the distribution ARN; HTTPS-only viewer policy'] },
    'packet-tracer': { role: 'Solo — lab work', metric: '[ADD REAL NUMBER: e.g. VLANs / subnets designed]', repo: '', proof: 'vlan',
      how: ['Router-on-a-stick / inter-VLAN routing [EDIT TO MATCH]', 'Subnetting plan per VLAN', 'Layer 1 → 3 troubleshooting with show commands'] }
  },

  /* ---------- 11. ACHIEVEMENTS & LEARNING LOG (leave empty to hide the section) ---------- */
  achievements: [
    // { title:'[ACHIEVEMENT]', desc:'[ONE LINE]', date:'[YYYY]' }
  ]
};

/* Extra UI strings for the language toggle (merged into I18N in main.js) */
window.CONTENT_I18N = {
  en: {
    'nav.credentials':'Credentials','nav.experience':'Experience','nav.services':'Services','nav.pricing':'Pricing','nav.terminal':'Terminal','nav.more':'More',
    'hero.status':'open to junior Cloud / DevOps roles','hero.cvCmd':'./download-cv.sh','hero.github':'GitHub',
    'cred.eyebrow':'Credentials','cred.h2':'Certificates & training — shown honestly','cred.all':'All','cred.empty':'Nothing in this category yet — added when earned, never before.','cred.progress':'In progress','cred.done':'Completed','cred.learn':'Key learnings',
    'skills.more':'Show all skills','skills.less':'Show fewer','skills.hands':'Hands-on','skills.learning':'Learning',
    'exp.eyebrow':'Experience','exp.h2':'Training journey','exp.challenge':'Challenge','exp.action':'Action','exp.result':'Result','exp.ongoing':'Ongoing',
    'svc.request':'Request this','svc.deliverables':'Deliverables','svc.toPricing':'See pricing',
    'price.eyebrow':'Pricing','price.h2':'Simple, scoped pricing','price.rec':'Recommended','price.cta':'Choose plan','price.customCta':'Get a quote','price.incl':"What's included",
    'proj.problem':'Problem','proj.role':'Role','proj.solution':'Solution','proj.result':'Result','proj.how':'How it’s built','proj.repo':'Repo','proj.proof':'Proof','proj.metric':'Outcome',
    'term.eyebrow':'Terminal','term.h2':'ssh serag@portfolio','term.lede':'Type a command or tap one. Try the incident replay.','term.plain':'Plain-text version',
    'ach.eyebrow':'Achievements','ach.h2':'Learning log',
    'contact.copy':'Copy email','contact.copied':'Copied','contact.ssh':'ssh contact',
    'footer.pipeline':'pipeline','footer.social':'SOCIAL'
  },
  ar: {
    'nav.credentials':'الشهادات','nav.experience':'الخبرة','nav.services':'الخدمات','nav.pricing':'الأسعار','nav.terminal':'التيرمنال','nav.more':'المزيد',
    'hero.status':'متاح لوظائف Cloud / DevOps للمبتدئين','hero.cvCmd':'./download-cv.sh','hero.github':'GitHub',
    'cred.eyebrow':'الشهادات','cred.h2':'الشهادات والتدريب — بصدق','cred.all':'الكل','cred.empty':'لا يوجد شيء في هذا التصنيف بعد — يُضاف عند الحصول عليه فقط.','cred.progress':'قيد التنفيذ','cred.done':'مكتمل','cred.learn':'أهم ما تعلمته',
    'skills.more':'عرض كل المهارات','skills.less':'عرض أقل','skills.hands':'عملي','skills.learning':'أتعلم',
    'exp.eyebrow':'الخبرة','exp.h2':'رحلة التدريب','exp.challenge':'التحدي','exp.action':'الإجراء','exp.result':'النتيجة','exp.ongoing':'مستمر',
    'svc.request':'اطلب الخدمة','svc.deliverables':'المخرجات','svc.toPricing':'الأسعار',
    'price.eyebrow':'الأسعار','price.h2':'أسعار واضحة ومحددة','price.rec':'موصى به','price.cta':'اختر الخطة','price.customCta':'اطلب عرض سعر','price.incl':'ما يشمله',
    'proj.problem':'المشكلة','proj.role':'الدور','proj.solution':'الحل','proj.result':'النتيجة','proj.how':'كيف بُني','proj.repo':'المستودع','proj.proof':'الإثبات','proj.metric':'النتيجة القابلة للقياس',
    'term.eyebrow':'التيرمنال','term.h2':'ssh serag@portfolio','term.lede':'اكتب أمراً أو اضغط على واحد. جرّب إعادة تشغيل الحادثة.','term.plain':'نسخة نصية',
    'ach.eyebrow':'الإنجازات','ach.h2':'سجل التعلم',
    'contact.copy':'نسخ الإيميل','contact.copied':'تم النسخ','contact.ssh':'ssh contact',
    'footer.pipeline':'pipeline','footer.social':'روابط'
  }
};
