// ─── MOCK DATA ───────────────────────────────────────────────
export const rcaData = {
  nodes: [
    { id: "0", label: "Marge nette", value: "-3.2 pts", delta: -3.2, type: "kpi", detail: "Marge nette passée de 12.1% à 8.9% sur Q1" },
    { id: "1", label: "Coût unitaire", value: "+18%", delta: 18, type: "kpi", detail: "Hausse du coût de production par unité" },
    { id: "2", label: "Coût matières premières", value: "+25%", delta: 25, type: "kpi", detail: "Augmentation prix d'achat MP" },
    { id: "3", label: "Volume fournisseur A", value: "-40%", delta: -40, type: "kpi", detail: "Réduction capacité fournisseur principal" },
    { id: "4", label: "Retard livraisons", value: "+12 jours", delta: 12, type: "operational", detail: "Délai moyen passé de 5 à 17 jours" },
    { id: "5", label: "Pénurie logistique", value: "Critique", delta: null, type: "qualitative", detail: "Congestion portuaire Asie du Sud-Est depuis Janvier" },
  ],
  links: [
    { source: "0", target: "1" },
    { source: "1", target: "2" },
    { source: "2", target: "3" },
    { source: "3", target: "4" },
    { source: "4", target: "5" },
  ],
};

export const typeColors = {
  kpi: { bg: "#FEE2E2", border: "#EF4444", text: "#991B1B", accent: "#EF4444" },
  operational: { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E", accent: "#F59E0B" },
  qualitative: { bg: "#DBEAFE", border: "#3B82F6", text: "#1E3A8A", accent: "#3B82F6" },
};

export const typeLabels = { kpi: "KPI", operational: "Opérationnel", qualitative: "Qualitatif" };
