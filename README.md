# 🚀 Ma Boîte à Outils pour la Recherche d'Emploi

Une collection de userscripts open-source pour surcharger votre recherche d'emploi sur LinkedIn, Indeed, et plus encore. Gagnez du temps, évitez les clics inutiles et concentrez-vous sur les bonnes opportunités.

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
  <img src="https://img.shields.io/github/last-commit/AlexisRevol/job-search-userscripts" alt="Last Commit">
  <img src="https://img.shields.io/badge/Made%20with-JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="Made with JavaScript">
</p>

---

## 🤔 Pourquoi ce projet ?

Lors de ma recherche d'emploi, je me suis retrouvé à effectuer les mêmes tâches répétitives des dizaines de fois par jour : vérifier la note d'une entreprise, analyser les prérequis d'une offre, filtrer les annonces non pertinentes... J'ai donc décidé d'automatiser ces processus pour me concentrer sur l'essentiel. 

Ce projet est le résultat de cette démarche : une suite d'outils que j'utilise personnellement tous les jours.

## ✨ Fonctionnalités Principales

Chaque script peut être installé indépendamment.

### 1. ⭐️ Glassdoor Rating Fetcher
Affiche instantanément la note Glassdoor d'une entreprise sans quitter la page de l'offre d'emploi.

**Usage :** Survolez le nom d'une entreprise et appuyez sur `Alt + G`.

![Démo de Job Tracker](https://raw.githubusercontent.com/AlexisRevol/job-search-userscripts/main/.github/assets/demo_glassdoor.gif)


[▶️ **Installer ce script**](https://github.com/AlexisRevol/job-search-userscripts/raw/main/glassdoor-rating-fetcher/glassdoor-rating-fetcher.user.js)

---

### 2. 📊 Job Offer Analyzer
Eviter de lire des offres pour découvrir à la fin qu'elles demandent 10 ans d'expérience ? Ce script alerte visuellement si une offre exige plus de 3 ans d'expérience.

**Usage :** Sur une page d'offre, appuyez sur `Alt + C`.

*<p align="center">
  <img src="URL_DE_VOTRE_GIF_POUR_L_ANALYSEUR_ICI.gif" alt="Démo du Job Offer Analyzer" width="750">
</p>*

[▶️ **Installer ce script**](https://github.com/AlexisRevol/job-search-userscripts/raw/main/job-offer-summarizer/job-offer-summarizer.user.js)

---

### 3. 🔍 LinkedIn Filter Enhancer
Ajoute des filtres manquants directement dans l'interface de LinkedIn pour masquer les offres déjà vues, sponsorisées ou celles auxquelles vous avez déjà postulé.

**Usage :** Les filtres apparaissent automatiquement dans le panneau "Tous les filtres" de LinkedIn Jobs.

*<p align="center">
  <img src="URL_DE_VOTRE_GIF_POUR_LES_FILTRES_LINKEDIN_ICI.gif" alt="Démo du LinkedIn Filter Enhancer" width="750">
</p>*

[▶️ **Installer ce script**](https://github.com/AlexisRevol/job-search-userscripts/raw/main/linkedin-job-filters/linkedin-job-filters.user.js)

---

## 🛠️ Installation Générale

Pour utiliser ces scripts, vous avez besoin d'une extension de navigateur pour gérer les userscripts.

1.  **Installez un gestionnaire de scripts :**
    *   [Violentmonkey](https://violentmonkey.github.io/) (recommandé, open-source)
    *   ou [Tampermonkey](https://www.tampermonkey.net/)
2.  **Installez les scripts :** Cliquez sur les liens d'installation ci-dessus pour chaque script que vous souhaitez utiliser. L'extension vous demandera de confirmer l'installation.

## 💻 Stack Technique
*   **Langage Principal :** JavaScript (ES6+)
*   **API Userscript :** `GM.xmlHttpRequest` pour les appels cross-domain, et autres API standards de Violentmonkey/Tampermonkey.
*   **Analyse de Texte :** Expressions Régulières (RegExp) pour extraire les informations pertinentes du DOM.
*   **Manipulation du DOM :** Injection dynamique de CSS et d'éléments HTML pour créer des interfaces utilisateur non intrusives.

## 🤝 Contribution

Les contributions, les suggestions et les rapports de bugs sont les bienvenus ! N'hésitez pas à :
*   Ouvrir une **[Issue](https://github.com/AlexisRevol/job-search-userscripts/issues)** pour signaler un problème ou proposer une idée.
*   Créer une **[Pull Request](https://github.com/AlexisRevol/job-search-userscripts/pulls)** pour proposer une modification.

