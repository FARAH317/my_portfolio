export const projects = [
  {
    id: 'rnc',
    title: 'National Cancer Registry (RNC)',
    category: {
      fr: 'Plateforme full-stack · Santé publique',
      en: 'Full-stack platform · Public health',
    },
    featured: true,
    description: {
      fr: "Plateforme full-stack déployée en production pour le suivi épidémiologique des cas de cancer dans la wilaya de Tlemcen, utilisée par des professionnels de santé.",
      en: 'Full-stack web application for epidemiological management and tracking of cancer cases across the Tlemcen region, deployed in production and used by healthcare professionals.',
    },
    longDescription: {
      fr: "Conçu une API REST sécurisée (Django REST Framework) avec contrôle d'accès par rôle pour 4 types d'utilisateurs, des tableaux de bord statistiques et des exports de rapports médicaux. Ajouté un module RCP (réunion de concertation pluridisciplinaire) avec salles de réunion en direct, un assistant IA en oncologie (API Groq LLaMA), un vote collégial et des comptes-rendus PDF générés automatiquement. Débogage de problèmes de production (CORS, routage SPA sur Vercel, accès patient par QR code).",
      en: 'Implemented statistical dashboards, patient management and medical report exports. Designed a REST architecture with secure authentication and role-based access control for 4 user types. Added an RCP (multidisciplinary meeting) module with live meeting rooms, an AI oncology assistant (Groq LLaMA API), collegial voting, and auto-generated PDF meeting reports. Independently debugged production issues: CORS misconfiguration, Vercel SPA routing, and QR-code patient lookup.',
    },
    stack: ['React', 'Django REST Framework', 'PostgreSQL', 'Vercel', 'Render'],
    github: 'https://github.com/FARAH317/RNC-Registre-Nationale-De-Cancer',
    demo: '',
    images: ['/rnc1.png', '/rnc2.png', '/rnc3.png', '/rnc4.png', '/rnc5.png', '/rnc23.png', '/rnc24.png', '/rnc25.png', '/rnc6.png', '/rnc7.png', '/rnc8.png', '/rnc9.png', '/rnc10.png', '/rnc11.png', '/rnc12.png', '/rnc13.png', '/rnc14.png', '/rnc15.png', '/rnc16.png', '/rnc17.png', '/rnc18.png', '/rnc19.png', '/rnc20.png', '/rnc21.png', '/rnc22.png'],
  },
  {
    id: 'hotel',
    title: 'Hotel Reservation System',
    category: { fr: 'Application full-stack · Réservation', en: 'Full-stack application · Booking' },
    featured: false,
    description: {
      fr: 'Application de réservation complète : gestion des chambres, suivi de disponibilité et traitement des paiements.',
      en: 'Full reservation app: room management, availability tracking and payment processing.',
    },
    longDescription: {
      fr: "Interface client responsive pour la réservation et back-office admin avec tableau de bord de gestion pour plus de 50 types de chambres.",
      en: 'Built a responsive client interface and admin back-office with booking dashboards managing 50+ room types.',
    },
    stack: ['React', 'Django', 'PostgreSQL'],
    github: 'https://github.com/FARAH317/hotel-reservation-system',
    demo: '',
    images: ['/hotel4.png', '/hotel15.png', '/hotel14.png','/hotel2.png', '/hotel5.png','/hotel6.png', '/hotel7.png','/hotel8.png', '/hotel9.png','/hotel10.png', '/hotel11.png','/hotel12.png', '/hotel13.png','/hotel16.png'],
  },
  {
    id: 'clinic',
    title: 'Clinic Management System',
    category: { fr: 'Application full-stack · Santé', en: 'Full-stack application · Healthcare' },
    featured: false,
    description: {
      fr: 'Plateforme de gestion de clinique couvrant médecins, médicaments, rendez-vous et dossiers patients.',
      en: 'Full clinic management platform covering doctors, medicines, appointments and patient records.',
    },
    longDescription: {
      fr: "Tableau de bord admin pour la gestion des médecins, le suivi des stocks de médicaments et le suivi des rendez-vous quotidiens, plus une page de réservation en ligne côté patient.",
      en: 'Built an admin dashboard for staff to manage doctors, track medicine inventory and monitor daily appointments. Implemented a patient-facing reservation page allowing online booking and appointment scheduling.',
    },
    stack: ['Flask', 'Python', 'HTML'],
    github: 'https://github.com/FARAH317/clinic-management-system',
    demo: '',
    images: ['/clinic1.png', '/clinic2.png', '/clinic3.png', '/clinic4.png', '/clinic5.png', '/clinic6.png', '/clinic7.png', '/clinic8.png', '/clinic9.png', '/clinic11.png', '/clinic12.png', '/clinic13.png', '/clinic10.png'],
  },
  {
    id: 'devassist',
    title: 'DevAssistant — AI Developer Assistant',
    category: { fr: 'Outil IA pour développeurs', en: 'AI tool for developers' },
    featured: false,
    description: {
      fr: 'Assistant IA qui aide les développeurs à déboguer du code, analyser les erreurs logiques et obtenir des suggestions de correction automatisées.',
      en: 'Built an AI assistant dedicated to helping developers debug code, analyze logic errors and get automated fix suggestions.',
    },
    longDescription: {
      fr: "Backend LLM intégré pour fournir des explications de débogage contextuelles et une analyse de code multi-langages, exposé via une API REST Flask.",
      en: 'Integrated an LLM backend to provide contextual debugging explanations and code analysis across multiple languages. Designed a REST API with Flask to handle code input, error detection and AI-generated responses in real time.',
    },
    stack: ['MongoDB', 'TypeScript', 'LLM', 'Flask REST API'],
    github: 'https://github.com/FARAH317/devassist-ai',
    demo: '',
    images: [],
  },
  {
    id: 'elearning',
    title: 'E-Learning Platform (Palefrenier)',
    category: { fr: 'Plateforme full-stack · Éducation', en: 'Full-stack platform · Education' },
    featured: false,
    description: {
      fr: "Plateforme d'apprentissage de la programmation en ligne avec cours, quiz et suivi de progression.",
      en: 'Created an online learning platform focused on programming with courses, quizzes and progress tracking.',
    },
    longDescription: {
      fr: "Authentification, gestion de contenu et suivi de progression implémentés pour plus de 10 cours interactifs.",
      en: 'Implemented authentication, content management and progress tracking for 10+ interactive courses.',
    },
    stack: ['React', 'Django', 'PostgreSQL', 'TypeScript'],
    github: 'https://github.com/FARAH317/LearnCodeWebsite',
    demo: '',
    images: ['/learn1.png', '/learn2.png', '/learn3.png','/learn4.png', '/learn5.png', '/learn6.png','/learn7.png', '/learn8.png', '/learn9.png','/learn10.png', '/learn11.png'],
  },
  {
    id: 'salesforce-crm',
    title: 'Medical Management CRM',
    category: { fr: 'Salesforce · CRM', en: 'Salesforce · CRM' },
    featured: false,
    description: {
      fr: 'CRM Salesforce personnalisé pour la gestion des patients et des consultations médicales, gérant plus de 200 dossiers patients simulés.',
      en: 'Customized a Salesforce CRM for patient and medical consultation management, handling 200+ simulated patient records.',
    },
    longDescription: {
      fr: "Triggers Apex, Flows automatisés et Lightning Web Components personnalisés, réduisant la saisie manuelle d'environ 30%. Tableaux de bord et rapports pour le suivi des dossiers médicaux sur 5 objets personnalisés.",
      en: 'Developed Apex triggers, automated Flows and custom Lightning Web Components, reducing manual data entry by ~30%. Designed dashboards and reports for medical record tracking, enabling real-time visibility across 5 custom objects.',
    },
    stack: ['Salesforce', 'Apex', 'LWC', 'SOQL', 'Flows'],
    github: '',
    demo: '',
    images: [],
  },
 
]
