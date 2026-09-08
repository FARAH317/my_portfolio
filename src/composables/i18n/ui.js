// Static interface strings — { fr, en } pairs consumed via tr() from useLocale().
// Content data (profile, experience, projects, skills, certificates) lives in
// src/data/*.js instead, with bilingual fields defined right next to the facts.

export const ui = {
  nav: {
    home: { fr: 'Accueil', en: 'Home' },
    about: { fr: 'À propos', en: 'About' },
    experience: { fr: 'Expérience', en: 'Experience' },
    skills: { fr: 'Compétences', en: 'Skills' },
    projects: { fr: 'Projets', en: 'Projects' },
    certificates: { fr: 'Certificats', en: 'Certificates' },
    contact: { fr: 'Contact', en: 'Contact' },
  },

  loader: {
    line1: { fr: 'Initialisation du portfolio…', en: 'Initializing portfolio…' },
    line2: { fr: 'Construction d\u2019expériences numériques.', en: 'Building digital experiences.' },
    skip: { fr: 'Passer', en: 'Skip' },
  },

  hero: {
    hi: { fr: 'Bonjour, je suis', en: "Hi, I'm" },
    titleLine1: { fr: 'INGÉNIEURE', en: 'SOFTWARE' },
    titleLine2: { fr: 'LOGICIEL', en: 'ENGINEER' },
    ctaExplore: { fr: 'Découvrir mes projets', en: 'Explore my work' },
    ctaResume: { fr: 'Télécharger mon CV', en: 'Download résumé' },
  },

  about: {
    eyebrow: { fr: 'À propos', en: 'About' },
    title: { fr: 'Identité numérique', en: 'Digital identity' },
    location: { fr: 'Localisation', en: 'Location' },
    focus: { fr: 'Focus actuel', en: 'Current focus' },
    focusValue: { fr: 'Résoudre de vrais problèmes, de bout en bout', en: 'Solving real problems, end-to-end' },
  },

  experience: {
    eyebrow: { fr: 'Parcours', en: 'Journey' },
    title: { fr: 'Expérience', en: 'Experience' },
    subtitle: {
      fr: "Un chemin ponctué d'étapes concrètes — chaque point représente une expérience clé.",
      en: 'A path marked by concrete milestones — each point represents a key experience.',
    },
  },

  skills: {
    eyebrow: { fr: 'Compétences', en: 'Skills' },
    title: { fr: 'Univers technique', en: 'Technical universe' },
    subtitle: {
      fr: "Chaque face du cube représente un domaine. Glisse pour tourner, clique une face pour l'explorer.",
      en: 'Each face of the cube represents a domain. Drag to rotate, click a face to explore it.',
    },
  },

  projects: {
    eyebrow: { fr: 'Réalisations', en: 'Work' },
    title: { fr: 'Projets', en: 'Projects' },
    subtitle: {
      fr: 'Une sélection de projets full-stack et solutions d\u2019entreprise, du concept au déploiement.',
      en: 'A selection of full-stack projects and enterprise solutions, from concept to deployment.',
    },
    viewCode: { fr: 'Voir le code', en: 'View code' },
    liveDemo: { fr: 'Démo live', en: 'Live demo' },
    screenshotSoon: { fr: 'Capture à venir', en: 'Screenshot coming soon' },
  },

  certificates: {
    eyebrow: { fr: 'Formations', en: 'Learning' },
    title: { fr: 'Certificats', en: 'Certificates' },
    subtitle: {
      fr: 'Un carrousel spatial de mes certifications — glisse, utilise la molette ou les flèches.',
      en: 'A spatial carousel of my certifications — drag, use the wheel, or the arrows.',
    },
    empty: {
      fr: "Section prête à accueillir tes certificats — ajoute-les dans src/data/certificates.js et le carrousel 3D s'affichera automatiquement.",
      en: 'This section is ready for your certificates — add them in src/data/certificates.js and the 3D carousel will appear automatically.',
    },
    viewCredential: { fr: 'Voir le certificat →', en: 'View credential →' },
    zoom: { fr: 'Agrandir ⤢', en: 'Enlarge ⤢' },
  },

  github: {
    eyebrow: { fr: 'Code', en: 'Code' },
    title: { fr: 'Activité de développement', en: 'Development activity' },
    languages: { fr: 'Langages principaux', en: 'Main languages' },
    note: {
      fr: "Retrouve l'ensemble de mes dépôts, y compris les projets full-stack et les expérimentations, sur mon profil GitHub.",
      en: 'Find all of my repositories, including full-stack projects and experiments, on my GitHub profile.',
    },
    viewProfile: { fr: 'Voir le profil GitHub', en: 'View GitHub profile' },
  },

  philosophy: {
    eyebrow: { fr: 'Approche', en: 'Approach' },
    title: { fr: "Philosophie d'ingénierie", en: 'Engineering philosophy' },
  },

  contact: {
    eyebrow: { fr: 'Contact', en: 'Contact' },
    heading: { fr: 'Construisons quelque chose de sens.', en: "Let's build something meaningful." },
    intro: {
      fr: 'Disponible immédiatement pour un stage à distance (1 à 3 mois). N\u2019hésite pas à me contacter directement ou via le formulaire.',
      en: 'Immediately available for a remote internship (1 to 3 months). Feel free to reach out directly or through the form.',
    },
    formName: { fr: 'Nom', en: 'Name' },
    formNamePlaceholder: { fr: 'Votre nom', en: 'Your name' },
    formEmail: { fr: 'Email', en: 'Email' },
    formMessage: { fr: 'Message', en: 'Message' },
    formMessagePlaceholder: { fr: 'Parlez-moi de votre projet...', en: 'Tell me about your project...' },
    send: { fr: 'Envoyer le message', en: 'Send Message' },
    sent: { fr: 'Message envoyé ✓', en: 'Message sent ✓' },
    copied: { fr: 'Copié !', en: 'Copied!' },
  },

  footer: {
    credit: {
      fr: 'Conçu et développé avec Vue + Three.js + GSAP',
      en: 'Designed & engineered with Vue + Three.js + GSAP',
    },
  },
}