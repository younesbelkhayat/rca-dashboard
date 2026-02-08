# RCA Dashboard — Root Cause Analysis

Dashboard interactif de visualisation de chaîne causale pour comité exécutif.

## 6 visualisations comparées

| # | Nom | Package | Recommandation |
|---|-----|---------|----------------|
| ① | React Flow + Dagre (vertical) | `@xyflow/react` + `@dagrejs/dagre` | ★ RECOMMANDÉ |
| ② | React Flow Horizontal | `@xyflow/react` + `@dagrejs/dagre` | Excellent |
| ③ | Cascade Waterfall | Custom SVG | Très bon |
| ④ | Nivo Sankey | `@nivo/sankey` | Analytique |
| ⑤ | Drill-Down Vertical | Custom CSS | Compact |
| ⑥ | Recharts Treemap | `recharts` | Hiérarchique |

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Build & Déploiement GitHub Pages

1. Dans `vite.config.js`, ajuste `base` avec le nom de ton repo :
```js
base: '/ton-repo-name/',
```

2. Build + deploy :
```bash
npm run build
npm run deploy
```

3. GitHub → Settings → Pages → Source : branche `gh-pages`, dossier `/ (root)`

Ton dashboard sera live sur `https://<ton-username>.github.io/ton-repo-name/`

## Structure

```
src/
  App.jsx              # Dashboard principal avec sélecteur de vues
  data.js              # Données mockées (à remplacer par ton API)
  main.jsx             # Point d'entrée
  views/
    ReactFlowDagre.jsx     # ① React Flow vertical
    ReactFlowHorizontal.jsx # ② React Flow horizontal  
    WaterfallCascade.jsx    # ③ Cascade custom SVG
    NivoSankey.jsx          # ④ Nivo Sankey
    VerticalDrillDown.jsx   # ⑤ Drill-down custom
    RechartsTreemap.jsx     # ⑥ Recharts treemap
```

## Données

Modifie `src/data.js` pour brancher tes propres données. Le format attendu :

```json
{
  "nodes": [
    { "id": "0", "label": "KPI impacté", "value": "-3.2 pts", "type": "kpi", "detail": "..." },
    ...
  ],
  "links": [
    { "source": "0", "target": "1" },
    ...
  ]
}
```

Types supportés : `kpi`, `operational`, `qualitative`
