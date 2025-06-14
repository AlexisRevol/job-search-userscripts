# Ma Boîte à Outils pour la Recherche d'Emploi (Job Search Userscript Toolkit)

Ce dépôt contient une collection de Userscripts conçus pour améliorer et automatiser certaines tâches répétitives lors de la recherche d'emploi sur des plateformes comme LinkedIn, Indeed, etc.

## Installation

1.  Assurez-vous d'avoir une extension de gestion de scripts comme [Violentmonkey](https://violentmonkey.github.io/) ou [Tampermonkey](https://www.tampermonkey.net/).
2.  Cliquez sur les liens d'installation ci-dessous pour ajouter les scripts que vous souhaitez.

---

## Liste des Scripts

| Script                                 | Description                                                                                             | Installation                                                                                |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| ⭐️ **Glassdoor Rating Fetcher**          | Affiche la note Glassdoor d'une entreprise au survol de son nom (raccourci `Alt+G`).                     | [Installer](https://github.com/AlexisRevol/job-search-userscripts/raw/main/glassdoor-rating-fetcher/glassdoor-rating-fetcher.user.js) |
| 📊 **Job Offer Analyzer**             | Détecte si une offre demande plus de 3 ans d'expérience et affiche une alerte visuelle (`Alt+C`).        | [Installer](https://github.com/AlexisRevol/job-search-userscripts/raw/main/job-offer-summarizer/job-offer-summarizer.user.js)     |
| 🔍 **LinkedIn Filter Enhancer**        | Ajoute des filtres natifs à LinkedIn pour masquer les offres déjà vues, sponsorisées ou postulées.       | [Installer](https://github.com/AlexisRevol/job-search-userscripts/raw/main/linkedin-job-filters/linkedin-job-filters.user.js)     |


## Comment ça marche ?

### Glassdoor Rating Fetcher
- **Usage :** Sur n'importe quel site de job, sélectionnez le nom d'une entreprise ou survolez-le, puis appuyez sur `Alt + G`.
- **Techno :** JavaScript, `GM.xmlHttpRequest` pour contourner les restrictions CORS.

### Job Offer Analyzer
- **Usage :** Sur une page d'offre d'emploi, appuyez sur `Alt + C`. Si plus de 3 ans d'expérience sont détectés, un effet visuel d'alerte apparaît.
- **Techno :** JavaScript, analyse de texte avec des expressions régulières.


## Contribution

Les suggestions et contributions sont les bienvenues ! N'hésitez pas à ouvrir une "Issue" pour signaler un bug ou proposer une amélioration.

## Licence

Ce projet est sous licence MIT.