# App Industrie Europe-Chine

## Description

Cette application présente une analyse comparative de l'industrie européenne et chinoise à travers 4 indicateurs clés :

## Structure

```
industrie-europe-chine/
├── AppIndustrieEuropeChine.vue    # Composant principal
├── components/                     # Composants de graphiques
│   ├── ChartOne.vue               # Graphique 1 - Production industrielle (line chart)
│   ├── ChartTwo.vue               # Graphique 2 - Investissements R&D (bar chart)
│   ├── ChartThree.vue             # Graphique 3 - Exportations (line chart avec fill)
│   └── ChartFour.vue              # Graphique 4 - Emploi industriel (bar chart)
├── store/                          # Store Vuex
│   └── index.js                   # État et mutations pour les données
├── assets/                         # Assets statiques
│   └── json/                      # Fichiers de données (à venir)
└── README.md                       # Ce fichier
```

## Technologies utilisées

- **Vue.js** - Framework JavaScript
- **Chart.js** - Bibliothèque de graphiques
- **chartjs-chart-treemap** - Plugin Chart.js pour les treemaps (Indicateur 4)
- **Vuex** - Gestion d'état
- **DSFR (Design System FR)** - Pour le style (via Marianne font)


## Fonctionnalités

### Sélecteur de pays

Un sélecteur DSFR permet de choisir le pays de référence parmi une liste de 28 pays (UE27 + USA). Lorsqu'un pays est sélectionné, tous les graphiques se rechargent automatiquement avec les données correspondantes via le paramètre `HOME__exact` des API.


