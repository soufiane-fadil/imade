export type Category = { slug: string; label: string };

export const CATEGORIES: Category[] = [
  { slug: "isolation", label: "Isolation" },
  { slug: "pompes", label: "Pompes à chaleur" },
  { slug: "solaire", label: "Solaire" },
  { slug: "ventilation", label: "Ventilation" },
  { slug: "fenetres", label: "Fenêtres" },
  { slug: "reglementation", label: "Réglementation" },
  { slug: "aides", label: "Aides & financement" },
  { slug: "actualites", label: "Actualités" },
];

export type Article = {
  id: string;
  cat: string;
  title: string;
  dek: string;
  author: string;
  date: string;
  read: number;
  docs?: number;
};

export const SAMPLE_ARTICLES: Article[] = [
  {
    id: "0421",
    cat: "Pompes à chaleur",
    title:
      "Pompes à chaleur air-eau : ce qui change avec le décret du 14 avril 2026",
    dek: "Le seuil de COP minimum passe de 3,2 à 3,5. Conséquences sur les modèles certifiés, le rythme de pose et la prime « gros gestes ».",
    author: "Léa Marchand",
    date: "24 avr. 2026",
    read: 7,
    docs: 2,
  },
  {
    id: "0420",
    cat: "Isolation",
    title:
      "Laine de bois ou ouate de cellulose : le match thermique en combles perdus",
    dek: "On a comparé R, déphasage, prix posé et bilan carbone sur six chantiers tests en région Centre.",
    author: "Karim El Hadi",
    date: "22 avr. 2026",
    read: 11,
    docs: 1,
  },
  {
    id: "0419",
    cat: "Aides & financement",
    title: "MaPrimeRénov’ : la nouvelle grille 2026 décodée pas à pas",
    dek: "Plafonds par geste, écrêtements, cumul CEE — un guide pour estimer son reste à charge avant signature.",
    author: "Camille Roy",
    date: "21 avr. 2026",
    read: 9,
  },
  {
    id: "0418",
    cat: "Solaire",
    title:
      "Autoconsommation : pourquoi le tarif d’achat 2026 redessine la rentabilité",
    dek: "Calculs, hypothèses, tableurs téléchargeables — et trois cas réels chez des particuliers.",
    author: "Yann Petit",
    date: "20 avr. 2026",
    read: 8,
    docs: 3,
  },
  {
    id: "0417",
    cat: "Ventilation",
    title:
      "VMC double flux : faut-il vraiment l’installer dans une maison ancienne ?",
    dek: "Étanchéité, perméabilité à l’air, retours sur dix rénovations BBC en pierre meulière.",
    author: "Sophie Berthier",
    date: "19 avr. 2026",
    read: 6,
  },
  {
    id: "0416",
    cat: "Fenêtres",
    title: "Triple vitrage : quand le surcoût est-il vraiment justifié ?",
    dek: "Au-delà du Uw affiché, ce que disent les études de terrain en climat océanique et continental.",
    author: "Léa Marchand",
    date: "18 avr. 2026",
    read: 7,
  },
  {
    id: "0415",
    cat: "Réglementation",
    title:
      "RE2026 : ce que le projet de décret change pour la rénovation des passoires",
    dek: "Lecture annotée du texte mis en consultation. Calendrier, seuils DPE, arbitrages possibles.",
    author: "Camille Roy",
    date: "17 avr. 2026",
    read: 12,
    docs: 2,
  },
  {
    id: "0414",
    cat: "Aides & financement",
    title: "Éco-PTZ + MaPrimeRénov’ : monter un dossier sans erreur",
    dek: "Les six pièces qui bloquent 80 % des dossiers, et les délais réalistes par banque partenaire.",
    author: "Karim El Hadi",
    date: "16 avr. 2026",
    read: 10,
  },
];

const IMG_BANK: Record<string, string> = {
  "reportage · pompe à chaleur en cours d’installation":
    "https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?w=1200&auto=format&fit=crop",
  reportage:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&auto=format&fit=crop",
  "reportage · pac air-eau":
    "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=900&auto=format&fit=crop",
  "hero · pompe à chaleur, intervention chez les Lefranc, Indre-et-Loire":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&auto=format&fit=crop",
  "schéma · stratigraphie murale":
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format&fit=crop",
  "schéma · circuit hydraulique pac air-eau, basse température":
    "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200&auto=format&fit=crop",
  "Pompes à chaleur":
    "https://images.unsplash.com/photo-1565608087341-404b25492fee?w=600&auto=format&fit=crop",
  "Pompes à chaleur · photo":
    "https://images.unsplash.com/photo-1565608087341-404b25492fee?w=600&auto=format&fit=crop",
  Isolation:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop",
  "Isolation · photo":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop",
  Solaire:
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop",
  "Solaire · photo":
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop",
  Ventilation:
    "https://images.unsplash.com/photo-1581094019650-3e2dabaadcc7?w=600&auto=format&fit=crop",
  "Ventilation · photo":
    "https://images.unsplash.com/photo-1581094019650-3e2dabaadcc7?w=600&auto=format&fit=crop",
  Fenêtres:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop",
  "Fenêtres · photo":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop",
  Réglementation:
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
  "Réglementation · photo":
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
  Aides:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop",
  "Aides · photo":
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop",
  "Aides & financement":
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop",
  "Aides & financement · photo":
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop",
  Actualités:
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&auto=format&fit=crop",
  LM: "https://i.pravatar.cc/128?img=47",
  MR: "https://i.pravatar.cc/256?img=12",
  img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=200&auto=format&fit=crop",
};

export function resolveImg(caption?: string): string | null {
  if (!caption) return null;
  if (IMG_BANK[caption]) return IMG_BANK[caption];
  const c = caption.toLowerCase();
  for (const [k, v] of Object.entries(IMG_BANK)) {
    const kl = k.toLowerCase();
    if (c.includes(kl) || kl.includes(c.split(" ")[0])) return v;
  }
  if (c.includes("pac") || c.includes("pompe"))
    return IMG_BANK["Pompes à chaleur"];
  if (c.includes("isol") || c.includes("mur") || c.includes("laine"))
    return IMG_BANK["Isolation"];
  if (c.includes("solaire") || c.includes("panneau"))
    return IMG_BANK["Solaire"];
  if (c.includes("vmc") || c.includes("vent")) return IMG_BANK["Ventilation"];
  if (c.includes("fenêtre") || c.includes("vitrage"))
    return IMG_BANK["Fenêtres"];
  if (c.includes("aide") || c.includes("prime") || c.includes("financ"))
    return IMG_BANK["Aides"];
  if (c.includes("régl") || c.includes("décret"))
    return IMG_BANK["Réglementation"];
  if (c.includes("schéma") || c.includes("diagramme"))
    return IMG_BANK["schéma · stratigraphie murale"];
  return IMG_BANK["reportage"];
}
