// Certificats réels de Farah — triés du plus récent au plus ancien.
// Les titres et organismes sont les intitulés officiels : on ne les traduit pas
// (certains cours ont été suivis en français, d'autres en anglais — c'est un fait,
// pas un choix de langue du site). Seuls la date et les tags génériques sont bilingues.
//
// Images placées directement à la racine de public/ (pas de sous-dossier).
// Attention : la casse des noms de fichiers est respectée à l'identique (Vercel
// est sensible à la casse, contrairement à Windows en local).

export const certificates = [
  {
    title: 'N8n Automation Beginners',
    organization: 'FreeAcademy.ai',
    date: { fr: 'Août 2026', en: 'August 2026' },
    credentialUrl: 'https://freeacademy.ai/verify/FA-2026-NAB-UB05NH',
    image: '/n8n.PNG',
    skills: ['n8n', { fr: 'Automatisation', en: 'Automation' }],
  },
  {
    title: 'Prompt Engineering Essentials',
    organization: 'FreeAcademy.ai',
    date: { fr: 'Août 2026', en: 'August 2026' },
    credentialUrl: 'https://freeacademy.ai/verify/FA-2026-MPE-S6SOGW',
    image: '/prompt.PNG',
    skills: ['Prompt Engineering'],
  },
  {
    title: 'Tech Innovators 2025 — Attestation de participation',
    organization: 'Université Abou Bekr Belkaïd, Tlemcen (Faculté des Sciences)',
    date: { fr: 'Avril 2025', en: 'April 2025' },
    credentialUrl: '',
    image: '/attestation.png',
    skills: ['Tech Innovators 2025'],
  },
  {
    title: 'OOP in Python',
    organization: 'Coddy',
    date: { fr: 'Août 2024', en: 'August 2024' },
    credentialUrl: '',
    image: '/oop_python.PNG',
    skills: ['Python', { fr: 'POO', en: 'OOP' }],
  },
  {
    title: "Create a Voice Assistant with OpenAI's GPT-3 and IBM Watson",
    organization: 'IBM Developer Skills Network / Cognitive Class',
    date: { fr: 'Juillet 2024', en: 'July 2024' },
    credentialUrl: 'https://courses.cognitiveclass.ai/certificates/d4e921750d6d492dabbe1c87a564de7e',
    image: '/ibm.PNG',
    skills: ['OpenAI GPT-3', 'IBM Watson', { fr: 'Assistant vocal', en: 'Voice assistant' }],
  },
  {
    title: "Les fondements de l'intelligence artificielle",
    organization: 'LinkedIn Learning',
    date: { fr: 'Juillet 2024', en: 'July 2024' },
    credentialUrl: '',
    image: '/fondements_ia.PNG',
    skills: [{ fr: 'Intelligence artificielle (IA)', en: 'Artificial Intelligence (AI)' }],
  },
  {
    title: "L'éthique à l'ère de l'IA générative",
    organization: 'LinkedIn Learning',
    date: { fr: 'Juillet 2024', en: 'July 2024' },
    credentialUrl: '',
    image: '/ethique_de_ia.PNG',
    skills: [
      { fr: "Éthique de l'informatique", en: 'Computing ethics' },
      { fr: 'IA générative', en: 'Generative AI' },
    ],
  },
  {
    title: "Découvrir l'IA générative",
    organization: 'LinkedIn Learning',
    date: { fr: 'Juillet 2024', en: 'July 2024' },
    credentialUrl: '',
    image: '/decouvrir_ia.PNG',
    skills: [{ fr: 'IA générative', en: 'Generative AI' }],
  },
  {
    title: 'Simplifiez votre travail avec Microsoft Copilot',
    organization: 'LinkedIn Learning',
    date: { fr: 'Juillet 2024', en: 'July 2024' },
    credentialUrl: '',
    image: '/copilot.PNG',
    skills: ['Microsoft Copilot'],
  },
]
