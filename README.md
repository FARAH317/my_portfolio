# Portfolio — Lahcine Farah

Portfolio personnel premium (Vue 3 + Vite + Three.js + GSAP + Lenis)

## Démarrer

```bash
npm install
npm run dev
```

Build de production :

```bash
npm run build
npm run preview
```



## Compléter ton LinkedIn

Dans `src/data/profile.js`, remplis le champ `linkedin: ''` avec ton URL — les liens apparaissent automatiquement dans le Hero, le Contact et le Footer dès qu'il est renseigné.

## Structure des données

Tout le contenu (profil, expérience, compétences, projets, certificats) vit dans `src/data/*.js` — aucune information n'est codée en dur dans les composants. Pour mettre à jour le contenu, modifie uniquement ces fichiers.

## Déploiement

Le projet est un site statique standard Vite — compatible Vercel, Netlify ou Render (commande de build : `npm run build`, dossier de sortie : `dist`).
