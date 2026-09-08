// Niveaux qualitatifs uniquement (pas de faux pourcentages), basés sur le CV.
// Les noms de technologies restent identiques dans les deux langues (proper nouns).
export const skillCategories = [
  {
    id: 'frontend',
    label: { fr: 'Frontend', en: 'Frontend' },
    color: '#4FD1FF',
    items: [
      { name: 'React.js', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'JavaScript', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'TypeScript', level: { fr: 'Familier', en: 'Familiar' } },
      { name: 'Tailwind CSS', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'HTML / CSS', level: { fr: 'Expérimenté', en: 'Experienced' } },
    ],
  },
  {
    id: 'backend',
    label: { fr: 'Backend', en: 'Backend' },
    color: '#8B7CFF',
    items: [
      { name: 'Python', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'Django / DRF', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'Flask', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'Node.js', level: { fr: 'Familier', en: 'Familiar' } },
      { name: 'REST APIs', level: { fr: 'Expérimenté', en: 'Experienced' } },
    ],
  },
  {
    id: 'databases',
    label: { fr: 'Bases de données', en: 'Databases' },
    color: '#5CE1B8',
    items: [
      { name: 'PostgreSQL', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'MySQL', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'MongoDB', level: { fr: 'Familier', en: 'Familiar' } },
      { name: 'SOQL', level: { fr: 'Expérimenté', en: 'Experienced' } },
    ],
  },
  {
    id: 'salesforce',
    label: { fr: 'Salesforce', en: 'Salesforce' },
    color: '#00A1E0',
    items: [
      { name: 'Apex', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'Lightning Web Components', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'Flows & Triggers', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'SOQL', level: { fr: 'Expérimenté', en: 'Experienced' } },
    ],
  },
  {
    id: 'odoo',
    label: { fr: 'Odoo', en: 'Odoo' },
    color: '#8F5AFF',
    items: [
      { name: 'Modules Python', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'XML / QWeb', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'Odoo Studio', level: { fr: 'Familier', en: 'Familiar' } },
    ],
  },
  {
    id: 'tools',
    label: { fr: 'Outils', en: 'Tools' },
    color: '#FFC15C',
    items: [
      { name: 'Git / GitHub', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'Vercel / Render', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'VS Code', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'Jira', level: { fr: 'Expérimenté', en: 'Experienced' } },
      { name: 'Figma', level: { fr: 'Familier', en: 'Familiar' } },
    ],
  },
  {
    id: 'automation',
    label: { fr: 'IA & Automatisation', en: 'AI & Automation' },
    color: '#FF7CA8',
    items: [
      { name: 'n8n', level: { fr: 'Débutant — en apprentissage', en: 'Beginner — currently learning' } },
      { name: 'Prompt Engineering', level: { fr: 'Familier', en: 'Familiar' } },
      { name: 'Intégration LLM (API)', level: { fr: 'Familier', en: 'Familiar' } },
    ],
  },
]
