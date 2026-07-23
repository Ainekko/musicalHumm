import { writable, derived } from 'svelte/store';

export type Locale = 'fr' | 'en' | 'ar';

export const locale = writable<Locale>('fr');

// Simple persistent locale storage in browser
if (typeof window !== 'undefined') {
  const savedLocale = localStorage.getItem('bordprod_locale') as Locale;
  if (savedLocale && ['fr', 'en', 'ar'].includes(savedLocale)) {
    locale.set(savedLocale);
  }
  locale.subscribe((value) => {
    localStorage.setItem('bordprod_locale', value);
  });
}

export const translations = {
  fr: {
    nav_about: "Qui Sommes-Nous",
    nav_testimonials: "Avis Partenaires",
    nav_portfolio: "Nos Réalisations",
    nav_quote: "Devis gratuit",
    nav_cta: "Lancer un projet",
    
    hero_badge: "Agence de Production Vidéo Performance",
    hero_title: "Créer des vidéos qui propulsent votre marque vers le haut.",
    hero_highlight: "votre marque",
    hero_subtitle: "Nous combinons l'art de l'image de qualité cinéma et l'efficacité des stratégies d'acquisition. Donnez vie à vos idées grâce à des formats optimisés pour convertir.",
    hero_cta: "Demander ma stratégie vidéo",
    hero_secondary: "Découvrir nos formats",
    hero_player_badge: "BORDPROD 2026",
    hero_player_cta: "Découvrir notre showreel",
    
    about_badge: "QUI SOMMES-NOUS",
    about_title: "Donner de la hauteur à votre message de marque.",
    about_p1: "Chez BordProd, nous pensons que chaque marque a une histoire qui mérite d'être racontée.",
    about_p2: "Nous combinons créativité, stratégie et production pour créer du contenu qui ne se contente pas d'être beau — il génère des résultats.",
    about_p3: "Avec plus de 3 ans d'expérience, nous avons aidé des entreprises, des créateurs et des entrepreneurs à renforcer leur image et à développer leur présence grâce à une communication visuelle professionnelle.",
    about_experience: "Années d'Expérience",
    
    testimonials_badge: "TÉMOIGNAGES",
    testimonials_title: "Ce que disent nos partenaires",
    testimonials_highlight: "nos partenaires",
    testimonials_subtitle: "Plus de 30+ professionnels et créateurs nous font confiance pour développer leur image de marque.",
    
    portfolio_badge: "NOS RÉALISATIONS",
    portfolio_title: "Ils ont transformé leur présence",
    portfolio_highlight: "transformé",
    portfolio_subtitle: "Des vidéos qui font des millions de vues et qui remplissent les agendas de rendez-vous.",
    portfolio_cta: "REJOINDRE L'APPEL / CRÉER MA VIDÉO",
    
    contact_badge: "CONTACT",
    contact_title: "Démarrez votre projet vidéo",
    contact_subtitle: "Complétez le formulaire ci-dessous. Nous analyserons vos besoins et vous recontacterons sous 24h avec un plan d'action.",
    
    form_name: "Nom Complet *",
    form_name_placeholder: "Ex: Jean Dupont",
    form_email: "Adresse E-mail *",
    form_email_placeholder: "Ex: jean@entreprise.com",
    form_phone: "Téléphone",
    form_phone_placeholder: "Ex: +33 6 12 34 56 78",
    form_company: "Entreprise",
    form_company_placeholder: "Ex: My Startup",
    form_budget: "Budget Estimé",
    form_desc: "Objectifs & Détails du Projet *",
    form_desc_placeholder: "Décrivez votre besoin : objectifs de la vidéo, cible, durée souhaitée, exemples inspirants...",
    form_submit: "Envoyer ma demande",
    form_loading: "Traitement en cours...",
    form_success_title: "Demande enregistrée avec succès !",
    form_success_desc: "Merci de votre confiance. Vos informations ont été transmises à notre équipe dans notre CRM interne. Un conseiller BordProd va étudier votre projet et prendra contact avec vous rapidement.",
    form_success_btn: "Faire une autre demande",
    
    validation_name: "Le nom est requis",
    validation_email: "L'email est requis",
    validation_email_invalid: "Veuillez entrer une adresse email valide",
    validation_desc: "Les détails du projet sont requis",
    validation_error: "Une erreur est survenue. Veuillez réessayer.",
    
    footer_copy: "Tous droits réservés.",
    footer_legal: "Mentions Légales",
    footer_privacy: "Confidentialité",
    footer_crm: "Accès CRM Interne",

    // Testimonial Specific Data
    t1_author: "Julie Rinaldi",
    t1_role: "Responsable Marketing, NeoBank",
    t1_quote: "L'équipe de BordProd a su comprendre notre besoin instantanément. Les vidéos produites ont dépassé toutes nos attentes et ont transformé notre communication.",
    t1_metric: "🚀 +120K abonnés organiques",

    t2_author: "Thomas Lemoine",
    t2_role: "Fondateur, Velo D2C",
    t2_quote: "BordProd combine une réactivité sans faille et une créativité débordante. Nos campagnes publicitaires vidéo affichent des performances exceptionnelles.",
    t2_metric: "📈 ROAS moyen de 3.2x",

    t3_author: "Hugo Martinez",
    t3_role: "CEO, LeadFlow",
    t3_quote: "Un travail d'orfèvre sur l'écriture et le montage. Le pitch fondateur nous a permis d'attirer des leads de haute qualité en moins de deux semaines.",
    t3_metric: "🎯 +45% de leads qualifiés",

    t4_author: "Dr. Sofia Samadi",
    t4_role: "Directrice, Centre Clinique",
    t4_quote: "Grâce à leur accompagnement stratégique, nous avons modernisé notre image de marque et instauré une vraie relation de confiance avec notre audience.",
    t4_metric: "🩺 +600 nouveaux patients",

    // Portfolio items
    p1_title: "Hook Publicitaire App",
    p1_metric: "+120% Téléchargements",
    p2_title: "Vidéo Pitch Fondateur",
    p2_metric: "18 Leads Qualifiés",
    p3_title: "Publicité Produit D2C",
    p3_metric: "3.4x ROAS Validé",
    p4_title: "Vulgarisation Santé",
    p4_metric: "+22K Abonnés",
    p5_title: "UGC Commercial",
    p5_metric: "+45% Taux de Clic"
  },
  en: {
    nav_about: "About Us",
    nav_testimonials: "Testimonials",
    nav_portfolio: "Our Portfolio",
    nav_quote: "Free Quote",
    nav_cta: "Start a Project",
    
    hero_badge: "Performance Video Production Agency",
    hero_title: "Create videos that propel your brand to the top.",
    hero_highlight: "your brand",
    hero_subtitle: "We combine the art of cinema-quality visuals with the efficiency of acquisition strategies. Bring your ideas to life with formats optimized for conversion.",
    hero_cta: "Get My Video Strategy",
    hero_secondary: "Discover Our Formats",
    hero_player_badge: "BORDPROD 2026",
    hero_player_cta: "Discover our showreel",
    
    about_badge: "ABOUT US",
    about_title: "Elevate your brand message.",
    about_p1: "At BordProd, we believe that every brand has a story worth telling.",
    about_p2: "We combine creativity, strategy, and production to create content that doesn’t just look good—it delivers results.",
    about_p3: "With over 3 years of experience, we have helped businesses, creators, and entrepreneurs strengthen their image and grow their presence through professional visual communication.",
    about_experience: "Years of Experience",
    
    testimonials_badge: "TESTIMONIALS",
    testimonials_title: "What our partners say",
    testimonials_highlight: "our partners",
    testimonials_subtitle: "Over 30+ professionals and creators trust us to develop their brand image.",
    
    portfolio_badge: "OUR PORTFOLIO",
    portfolio_title: "They transformed their presence",
    portfolio_highlight: "transformed",
    portfolio_subtitle: "Videos that generate millions of views and fill up appointment schedules.",
    portfolio_cta: "JOIN THE CALL / CREATE MY VIDEO",
    
    contact_badge: "CONTACT",
    contact_title: "Start your video project",
    contact_subtitle: "Complete the form below. We will analyze your needs and get back to you within 24 hours with an action plan.",
    
    form_name: "Full Name *",
    form_name_placeholder: "Ex: John Doe",
    form_email: "Email Address *",
    form_email_placeholder: "Ex: john@company.com",
    form_phone: "Phone",
    form_phone_placeholder: "Ex: +1 234 567 8900",
    form_company: "Company",
    form_company_placeholder: "Ex: My Startup",
    form_budget: "Estimated Budget",
    form_desc: "Project Objectives & Details *",
    form_desc_placeholder: "Describe your needs: video goals, target audience, desired length, inspiring examples...",
    form_submit: "Submit Request",
    form_loading: "Processing...",
    form_success_title: "Request submitted successfully!",
    form_success_desc: "Thank you for your trust. Your information has been sent to our team in our internal CRM. A BordProd specialist will review your project and get back to you shortly.",
    form_success_btn: "Submit Another Request",
    
    validation_name: "Name is required",
    validation_email: "Email is required",
    validation_email_invalid: "Please enter a valid email address",
    validation_desc: "Project details are required",
    validation_error: "An error occurred. Please try again.",
    
    footer_copy: "All rights reserved.",
    footer_legal: "Legal Notice",
    footer_privacy: "Privacy Policy",
    footer_crm: "Internal CRM Access",

    t1_author: "Julie Rinaldi",
    t1_role: "Marketing Manager, NeoBank",
    t1_quote: "The BordProd team understood our needs instantly. The videos produced exceeded all our expectations and completely transformed our communication.",
    t1_metric: "🚀 +120K organic followers",

    t2_author: "Thomas Lemoine",
    t2_role: "Founder, Velo D2C",
    t2_quote: "BordProd combines flawless responsiveness with boundless creativity. Our video advertising campaigns show exceptional performance.",
    t2_metric: "📈 3.2x average ROAS",

    t3_author: "Hugo Martinez",
    t3_role: "CEO, LeadFlow",
    t3_quote: "A masterpiece of writing and editing. The founder pitch video helped us attract high-quality leads in less than two weeks.",
    t3_metric: "🎯 +45% qualified leads",

    t4_author: "Dr. Sofia Samadi",
    t4_role: "Director, Clinical Center",
    t4_quote: "Thanks to their strategic guidance, we modernized our brand image and established a real bond of trust with our audience.",
    t4_metric: "🩺 +600 new patients",

    p1_title: "Ad Hook App",
    p1_metric: "+120% Downloads",
    p2_title: "Founder Pitch Video",
    p2_metric: "18 Qualified Leads",
    p3_title: "D2C Product Ad",
    p3_metric: "3.4x ROAS Confirmed",
    p4_title: "Health Education",
    p4_metric: "+22K Followers",
    p5_title: "Commercial UGC",
    p5_metric: "+45% CTR"
  },
  ar: {
    nav_about: "من نحن",
    nav_testimonials: "آراء شركائنا",
    nav_portfolio: "أعمالنا",
    nav_quote: "طلب عرض سعر",
    nav_cta: "ابدأ مشروعاً",
    
    hero_badge: "وكالة إنتاج فيديو تركز على الأداء",
    hero_title: "إنشاء فيديوهات تدفع علامتك التجارية نحو القمة.",
    hero_highlight: "علامتك التجارية",
    hero_subtitle: "نحن نجمع بين فن الصورة بجودة السينما وفعالية استراتيجيات الاستحواذ. جسد أفكارك من خلال تنسيقات فيديوهات محسنة لزيادة التحويلات.",
    hero_cta: "اطلب استراتيجية الفيديو الخاصة بي",
    hero_secondary: "اكتشف تنسيقاتنا",
    hero_player_badge: "BORDPROD 2026",
    hero_player_cta: "اكتشف عرض أعمالنا",
    
    about_badge: "من نحن",
    about_title: "الارتقاء برسالة علامتك التجارية.",
    about_p1: "في BordProd، نؤمن بأن كل علامة تجارية لديها قصة فريدة تستحق أن تروى بقوة وأصالة.",
    about_p2: "نحن ندمج الإبداع والاستراتيجية والإنتاج لإنشاء محتوى فيديو لا يقتصر على كونه جميلاً فحسب - بل يحقق نتائج نمو حقيقية.",
    about_p3: "لأكثر من 3 سنوات، قمنا بمرافقة الشركات والمبدعين ورواد الأعمال ذوي الإمكانات العالية لتعزيز هوياتهم وتنمية حضورهم عبر وسائل التواصل البصري الاحترافي.",
    about_experience: "سنوات من الخبرة",
    
    testimonials_badge: "آراء العملاء",
    testimonials_title: "ماذا يقول شركاؤنا",
    testimonials_highlight: "شركاؤنا",
    testimonials_subtitle: "أكثر من 30+ شركة ومبدع يثقون بنا لتطوير ونشر هوياتهم التجارية.",
    
    portfolio_badge: "أعمالنا المميزة",
    portfolio_title: "لقد غيروا حضورهم الرقمي",
    portfolio_highlight: "غيروا",
    portfolio_subtitle: "فيديوهات قصيرة وديناميكية ومؤثرة تولد ملايين المشاهدات وتملأ جداول المواعيد.",
    portfolio_cta: "انضم للاتصال / أنشئ فيديوهاتك",
    
    contact_badge: "اتصل بنا",
    contact_title: "ابدأ مشروع الفيديو الخاص بك",
    contact_subtitle: "أكمل النموذج أدناه. سنقوم بتحليل احتياجاتك والاتصال بك في غضون 24 ساعة بخطة عمل واضحة.",
    
    form_name: "الاسم الكامل *",
    form_name_placeholder: "مثال: أحمد محمد",
    form_email: "البريد الإلكتروني *",
    form_email_placeholder: "مثال: ahmed@company.com",
    form_phone: "رقم الهاتف",
    form_phone_placeholder: "مثال: 966512345678+",
    form_company: "الشركة",
    form_company_placeholder: "مثال: شركتي الناشئة",
    form_budget: "الميزانية التقديرية",
    form_desc: "أهداف وتفاصيل المشروع *",
    form_desc_placeholder: "صف احتياجاتك بالتفصيل: أهداف الفيديو، الجمهور المستهدف، الطول المطلوب، أمثلة ملهمة...",
    form_submit: "إرسال الطلب",
    form_loading: "جاري المعالجة...",
    form_success_title: "تم تسجيل طلبك بنجاح!",
    form_success_desc: "نشكرك على ثقتك. تم إرسال معلوماتك إلى فريق العمل في نظام الـ CRM الداخلي. سيقوم مستشار BordProd بدراسة تفاصيل مشروعك والتواصل معك قريباً.",
    form_success_btn: "تقديم طلب آخر",
    
    validation_name: "الاسم الكامل مطلوب",
    validation_email: "البريد الإلكتروني مطلوب",
    validation_email_invalid: "يرجى إدخال بريد إلكتروني صحيح",
    validation_desc: "تفاصيل المشروع مطلوبة",
    validation_error: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    
    footer_copy: "جميع الحقوق محفوظة.",
    footer_legal: "الشروط والأحكام",
    footer_privacy: "سياسة الخصوصية",
    footer_crm: "لوحة الـ CRM الداخلية",

    t1_author: "جولي رينالدي",
    t1_role: "مديرة التسويق، NeoBank",
    t1_quote: "فهم فريق BordProd احتياجاتنا على الفور. تجاوزت مقاطع الفيديو المنتجة كل توقعاتنا وغيرت أسلوب تواصلنا تماماً.",
    t1_metric: "🚀 +120ألف متابع عضوي",

    t2_author: "توماس ليموين",
    t2_role: "مؤسس، Velo D2C",
    t2_quote: "تجمع BordProd بين الاستجابة السريعة والإبداع اللامتناهي. تحقق حملاتنا الإعلانية للفيديو نتائج وأداء استثنائياً.",
    t2_metric: "📈 3.2x متوسط عائد الإعلانات",

    t3_author: "هوغو مارتينيز",
    t3_role: "الرئيس التنفيذي، LeadFlow",
    t3_quote: "عمل متقن للغاية في الكتابة والمونتاج. ساعدنا فيديو عرض المؤسس على جذب عملاء مؤهلين بجودة عالية في أقل من أسبوعين.",
    t3_metric: "🎯 +45% عملاء مؤهلين",

    t4_author: "د. صوفيا صمادي",
    t4_role: "مديرة، المركز الطبي",
    t4_quote: "بفضل توجيهاتهم الاستراتيجية، قمنا بتحديث صورة علامتنا التجارية وبناء رابطة ثقة حقيقية مع جمهورنا المستهدف.",
    t4_metric: "🩺 +600 مريض جديد",

    p1_title: "خطاف إعلان تطبيق",
    p1_metric: "تحميلات +120%",
    p2_title: "فيديو عرض المؤسس",
    p2_metric: "18 عميل مؤهل",
    p3_title: "إعلان منتج مباشر",
    p3_metric: "عائد إعلان مؤكد 3.4x",
    p4_title: "تبسيط الوعي الصحي",
    p4_metric: "+22ألف متابع",
    p5_title: "محتوى UGC تجاري",
    p5_metric: "معدل نقر +45%"
  }
};

// Derived store to fetch translations easily
export const t = derived(locale, ($locale) => {
  return (key: keyof typeof translations['fr']) => {
    return translations[$locale][key] || translations['fr'][key] || key;
  };
});
