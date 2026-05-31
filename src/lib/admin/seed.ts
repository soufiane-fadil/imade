import type {
  Article,
  Author,
  Category,
  ContactSubmission,
  Media,
  Snapshot,
  User,
} from "./types";

// ---------------------------------------------------------------------------
// Deterministic seed for the admin dashboard.
// Timestamps are hardcoded to keep tests stable across runs.
// IDs are hand-picked ULIDs (generated once, then frozen) prefixed by entity.
// ---------------------------------------------------------------------------

const BASE_TIME = "2026-05-01T00:00:00Z";

/** Date(`2026-05-30T00:00:00Z`) anchors "now" for the dashboard. */
const REF_DAY = new Date("2026-05-30T00:00:00Z").getTime();
const DAY = 24 * 60 * 60 * 1000;

function isoMinusDays(days: number, hour = 9, minute = 0): string {
  const d = new Date(REF_DAY - days * DAY);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

// ----- Category IDs --------------------------------------------------------
const CAT = {
  isolation: "cat_01KSV20SHN3JVW4960PN0F61G1",
  pompes: "cat_01KSV20SHPQH00Q5KYYA7D1QA7",
  solaire: "cat_01KSV20SHPHCK16NM8Z7K5M9D3",
  ventilation: "cat_01KSV20SHPQE810J07REHVPXRB",
  fenetres: "cat_01KSV20SHPRXHH73ZT0QC1Q4ZJ",
  reglementation: "cat_01KSV20SHPA9SZBH03JNBFFYG1",
  aides: "cat_01KSV20SHPSNS24K2ABF6N4GEM",
  actualites: "cat_01KSV20SHPF71NW699XBS6E60A",
} as const;

// ----- Author IDs ----------------------------------------------------------
const AUT = {
  lea: "aut_01KSV20SHPKQN5FSMQJ46FGVSA",
  karim: "aut_01KSV20SHPQH69DQNZGGG10X6N",
  camille: "aut_01KSV20SHPE301PBJ3F89XGBP9",
  yann: "aut_01KSV20SHPTNWMMC2WG43EC3NK",
  sophie: "aut_01KSV20SHQMWR84F3JRGK8AEJN",
  theo: "aut_01KSV20SHQSSGAPWS46MNZ9Z77",
} as const;

// ----- User IDs ------------------------------------------------------------
const USR = {
  admin: "usr_01KSV20SHQ6BMSFGMDJJAHE2HD",
  editorMarie: "usr_01KSV20SHQ1J4YENZQEHE06G3C",
  editorThomas: "usr_01KSV20SHQG7Q4B3XBQ2YWM0E3",
  readerAnnie: "usr_01KSV20SHQXKBCW90R034PRXE0",
  readerJulien: "usr_01KSV20SHQ81AC2JQ3W7JVZ0Q0",
} as const;

// ----- Media IDs -----------------------------------------------------------
const MED_IMG: readonly string[] = [
  "med_01KSV20SHQBDCWHDNP59VGNJS1",
  "med_01KSV20SHQVT1KSEDRAEHRKJTJ",
  "med_01KSV20SHQJXAJ3727QT431P1E",
  "med_01KSV20SHQH1P4Y16A8WK0AQG5",
  "med_01KSV20SHQ2NZEA71A0QECVXBF",
  "med_01KSV20SHQ41QVZFVHYD9D880V",
  "med_01KSV20SHQ4B40N2PJ2BT39EC1",
  "med_01KSV20SHQGJMJZVNZ90CRMWVR",
  "med_01KSV20SHQ7QWXFNQT3ME3C5M7",
  "med_01KSV20SHQD58CX0X5PZGWT9TZ",
  "med_01KSV20SHQB3131WSM6HZNV385",
  "med_01KSV20SHQJ8RA3DHBJKN20MXK",
  "med_01KSV20SHQ9SZXMDJKV4Q3B9A5",
  "med_01KSV20SHRJ5B1ZPZ50CAXXVNZ",
  "med_01KSV20SHRH5H09PE77W5T077H",
  "med_01KSV20SHRV70MCYP4J7QZ233A",
  "med_01KSV20SHR16MV5941V5WPZ39K",
  "med_01KSV20SHR0E5F31DJKBG6XJ8A",
  "med_01KSV20SHRN6YMRYVWN3EG4W1S",
  "med_01KSV20SHRSHC2H3Q5ZDYRRPEQ",
  "med_01KSV20SHRE2TZGDTBW3Y58P3X",
  "med_01KSV20SHRPCQAJXNEFKS40W7J",
  "med_01KSV20SHR8V9S17AENCBSPXK5",
  "med_01KSV20SHS3RCCKSZQBY4W9R1R",
  "med_01KSV20SHSX7C25FF92C22XG93",
];

const MED_PDF: readonly string[] = [
  "med_01KSV20SHSF9BFC3DYAA8XTJXK",
  "med_01KSV20SHSFJT8VM67EPYBX2XW",
  "med_01KSV20SHSGQ8GHD38Z7EH384Z",
  "med_01KSV20SHSKAZS4EMM6MQ8XBQP",
  "med_01KSV20SHS1KBPQEA5X6C9A308",
];

// ----- Article IDs --------------------------------------------------------
const ART: readonly string[] = [
  "art_01KSV20SHS57987YDJY8RFV96F",
  "art_01KSV20SHSHA1G1XK5S3KYJEV6",
  "art_01KSV20SHSNGKE0R15SH3YY75Y",
  "art_01KSV20SHS5T3CRRRH41HZS6MP",
  "art_01KSV20SHSREABFQ0JM4NP9KEY",
  "art_01KSV20SHSZ9D8SZDB7EDW425R",
  "art_01KSV20SHSSFD4SVBNC2C59VYR",
  "art_01KSV20SHS9CSG4PEWYEV1599Y",
  "art_01KSV20SHSYF3D9YJXHGZ2YJQ6",
  "art_01KSV20SHSYJJQ1J7CHC935GBA",
  "art_01KSV20SHSPBHY0D9WNGESMJWX",
  "art_01KSV20SHSN262Z5327HWSYY9P",
  "art_01KSV20SHSFZ9QKAX2VKTJ4H2M",
  "art_01KSV20SHSR3JMQHRMS69BHD8R",
  "art_01KSV20SHSKKJ1WRWMEVTRVDCA",
  "art_01KSV20SHSPQZ10QRGP55WJFVZ",
  "art_01KSV20SHSNGPZD6DEKABHZKNT",
  "art_01KSV20SHS611SCXRQ1ESV8FKJ",
  "art_01KSV20SHTJPT069MP5JNRVZMB",
  "art_01KSV20SHTRM9M5F0EMWWD6FHS",
];

// ----- Contact IDs --------------------------------------------------------
const CON: readonly string[] = [
  "ctc_01KSV20SHTFDSRS1CVP7EVDB8V",
  "ctc_01KSV20SHT53N9PRPJM5FA7VQV",
  "ctc_01KSV20SHTHYY2HST4WSZB4X21",
  "ctc_01KSV20SHTWF97ZBRNX9319DA8",
  "ctc_01KSV20SHTXYG9J251G57EEGNK",
  "ctc_01KSV20SHTW8EGYX23TED05T4B",
  "ctc_01KSV20SHTNP369X00A2YC35NK",
  "ctc_01KSV20SHT3Q8NWTTM0NH0RJF1",
  "ctc_01KSV20SHTXT63DGRADDT7Y9ZG",
  "ctc_01KSV20SHTGCRT0RYWSAQTXXGT",
  "ctc_01KSV20SHT1MN088B9E23R5SG0",
  "ctc_01KSV20SHTFZRBGBNTEKJY1MM0",
];

// ---------------------------------------------------------------------------
// Categories (8) — matches `CATEGORIES` in `src/lib/data.ts`
// ---------------------------------------------------------------------------
const CATEGORIES: Category[] = [
  {
    id: CAT.isolation,
    name: "Isolation",
    slug: "isolation",
    descriptionHtml:
      "<p>Toits, murs, planchers : guides terrain et comparatifs de matériaux pour fiabiliser une rénovation thermique. Lambda, déphasage, perméabilité — les chiffres et les retours de chantier.</p>",
    articleCount: 0,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
  },
  {
    id: CAT.pompes,
    name: "Pompes à chaleur",
    slug: "pompes",
    descriptionHtml:
      "<p>Air-air, air-eau, géothermie. Dimensionnement, COP saisonnier, retours sur dix ans d'exploitation chez des particuliers et en petit collectif.</p>",
    articleCount: 0,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
  },
  {
    id: CAT.solaire,
    name: "Solaire",
    slug: "solaire",
    descriptionHtml:
      "<p>Photovoltaïque, thermique, hybride : rentabilité réelle, autoconsommation, contrats d'achat, stockage. Calculs et hypothèses détaillés.</p>",
    articleCount: 0,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
  },
  {
    id: CAT.ventilation,
    name: "Ventilation",
    slug: "ventilation",
    descriptionHtml:
      "<p>VMC simple flux, double flux, hygroréglable. Étanchéité du bâti, qualité de l'air intérieur, débits réglementaires et corrections fines.</p>",
    articleCount: 0,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
  },
  {
    id: CAT.fenetres,
    name: "Fenêtres",
    slug: "fenetres",
    descriptionHtml:
      "<p>Vitrages, menuiseries, pose. Uw, Sw, étanchéité à l'air — au-delà des étiquettes commerciales, ce que disent les études de terrain.</p>",
    articleCount: 0,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
  },
  {
    id: CAT.reglementation,
    name: "Réglementation",
    slug: "reglementation",
    descriptionHtml:
      "<p>RE2020, DPE, audit énergétique, décrets en consultation. Lectures annotées, calendriers, jurisprudence et arbitrages possibles.</p>",
    articleCount: 0,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
  },
  {
    id: CAT.aides,
    name: "Aides & financement",
    slug: "aides",
    descriptionHtml:
      "<p>MaPrimeRénov', CEE, éco-PTZ, aides locales. Montants à jour, cumuls possibles, pièces à fournir et délais réalistes par banque partenaire.</p>",
    articleCount: 0,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
  },
  {
    id: CAT.actualites,
    name: "Actualités",
    slug: "actualites",
    descriptionHtml:
      "<p>Décrets, salons, jurisprudence, mouvements de marché : le fil hebdomadaire des sujets qui font bouger la rénovation énergétique.</p>",
    articleCount: 0,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
  },
];

// ---------------------------------------------------------------------------
// Authors (6)
// ---------------------------------------------------------------------------
const AUTHORS: Author[] = [
  {
    id: AUT.lea,
    name: "Léa Marchand",
    slug: "lea-marchand",
    descriptionHtml:
      "<p>Journaliste rénovation énergétique depuis 2018. Couvre les pompes à chaleur et les arbitrages thermiques. Ancienne ingénieure thermicienne au CSTB.</p>",
    photoUrl: "https://i.pravatar.cc/256?img=47",
    articleCount: 0,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
  },
  {
    id: AUT.karim,
    name: "Karim El Hadi",
    slug: "karim-el-hadi",
    descriptionHtml:
      "<p>Reporter de terrain. Suit les chantiers d'isolation des combles et façades en région Centre depuis cinq ans. A signé deux enquêtes sur les déboires de l'ITE.</p>",
    photoUrl: "https://i.pravatar.cc/256?img=12",
    articleCount: 0,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
  },
  {
    id: AUT.camille,
    name: "Camille Roy",
    slug: "camille-roy",
    descriptionHtml:
      "<p>Spécialiste des aides publiques et de la réglementation. Décortique les textes en consultation et anime une veille hebdomadaire MaPrimeRénov' / CEE.</p>",
    photoUrl: "https://i.pravatar.cc/256?img=25",
    articleCount: 0,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
  },
  {
    id: AUT.yann,
    name: "Yann Petit",
    slug: "yann-petit",
    descriptionHtml:
      "<p>Couvre le solaire résidentiel et l'autoconsommation. Auteur de tableurs de rentabilité régulièrement mis à jour. Ancien installateur photovoltaïque.</p>",
    photoUrl: "https://i.pravatar.cc/256?img=13",
    articleCount: 0,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
  },
  {
    id: AUT.sophie,
    name: "Sophie Berthier",
    slug: "sophie-berthier",
    descriptionHtml:
      "<p>Architecte DPLG, suit la rénovation BBC du bâti ancien. Référente ventilation et qualité de l'air intérieur. Membre du jury d'un concours rénovation patrimoine.</p>",
    photoUrl: "https://i.pravatar.cc/256?img=33",
    articleCount: 0,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
  },
  {
    id: AUT.theo,
    name: "Théo Lemoine",
    slug: "theo-lemoine",
    descriptionHtml:
      "<p>Pigiste data. Construit les graphes et les jeux de données publiés sur Maison·Calorie. Spécialité : croisements DPE / cadastre / consommations Enedis.</p>",
    photoUrl: "https://i.pravatar.cc/256?img=51",
    articleCount: 0,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
  },
];

// ---------------------------------------------------------------------------
// Medias (25 images + 5 PDFs = 30)
// ---------------------------------------------------------------------------
type ImageSeed = {
  url: string;
  filename: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  size: number;
};

const IMAGE_SEEDS: ImageSeed[] = [
  {
    url: "https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?w=1600&auto=format&fit=crop",
    filename: "reportage-pac-installation.jpg",
    alt: "Pompe à chaleur en cours d'installation",
    caption: "Reportage · pompe à chaleur en cours d'installation",
    width: 1600,
    height: 1067,
    size: 218_400,
  },
  {
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&auto=format&fit=crop",
    filename: "reportage-chantier.jpg",
    alt: "Chantier de rénovation, intérieur",
    caption: "Reportage · chantier de rénovation thermique",
    width: 1600,
    height: 1067,
    size: 198_320,
  },
  {
    url: "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=1600&auto=format&fit=crop",
    filename: "pac-air-eau-exterieur.jpg",
    alt: "Unité extérieure d'une PAC air-eau",
    caption: "Reportage · PAC air-eau",
    width: 1600,
    height: 1067,
    size: 244_900,
  },
  {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&auto=format&fit=crop",
    filename: "isolation-mur-meuliere.jpg",
    alt: "Mur en meulière isolé par l'intérieur",
    caption: "Hero · pompe à chaleur, intervention Indre-et-Loire",
    width: 1600,
    height: 1067,
    size: 312_700,
  },
  {
    url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&auto=format&fit=crop",
    filename: "schema-stratigraphie-murale.jpg",
    alt: "Schéma annoté d'une stratigraphie murale",
    caption: "Schéma · stratigraphie murale",
    width: 1600,
    height: 1067,
    size: 184_100,
  },
  {
    url: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1600&auto=format&fit=crop",
    filename: "schema-circuit-hydraulique-pac.jpg",
    alt: "Circuit hydraulique PAC air-eau basse température",
    caption: "Schéma · circuit hydraulique PAC air-eau",
    width: 1600,
    height: 1067,
    size: 201_000,
  },
  {
    url: "https://images.unsplash.com/photo-1565608087341-404b25492fee?w=1600&auto=format&fit=crop",
    filename: "pompe-chaleur-monobloc.jpg",
    alt: "Pompe à chaleur monobloc, façade extérieure",
    caption: "Pompe à chaleur · monobloc",
    width: 1600,
    height: 1067,
    size: 224_800,
  },
  {
    url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&auto=format&fit=crop",
    filename: "panneaux-solaires-toit.jpg",
    alt: "Panneaux photovoltaïques sur toit ardoise",
    caption: "Solaire · photovoltaïque toiture",
    width: 1600,
    height: 1067,
    size: 268_500,
  },
  {
    url: "https://images.unsplash.com/photo-1581094019650-3e2dabaadcc7?w=1600&auto=format&fit=crop",
    filename: "vmc-double-flux.jpg",
    alt: "Centrale VMC double flux installée en comble",
    caption: "Ventilation · VMC double flux",
    width: 1600,
    height: 1067,
    size: 209_700,
  },
  {
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&auto=format&fit=crop",
    filename: "fenetre-triple-vitrage.jpg",
    alt: "Pose d'une fenêtre triple vitrage",
    caption: "Fenêtres · triple vitrage",
    width: 1600,
    height: 1067,
    size: 191_400,
  },
  {
    url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&auto=format&fit=crop",
    filename: "documents-reglementation.jpg",
    alt: "Pile de documents réglementaires",
    caption: "Réglementation · documents officiels",
    width: 1600,
    height: 1067,
    size: 174_900,
  },
  {
    url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&auto=format&fit=crop",
    filename: "calculatrice-aides.jpg",
    alt: "Calculatrice et tableaux financiers",
    caption: "Aides & financement · calcul du reste à charge",
    width: 1600,
    height: 1067,
    size: 158_300,
  },
  {
    url: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1600&auto=format&fit=crop",
    filename: "actualites-presse.jpg",
    alt: "Une de presse économique",
    caption: "Actualités · presse économique",
    width: 1600,
    height: 1067,
    size: 188_700,
  },
  {
    url: "https://images.unsplash.com/photo-1503424886307-b090341d25d1?w=1600&auto=format&fit=crop",
    filename: "ouate-cellulose-combles.jpg",
    alt: "Ouate de cellulose soufflée en combles",
    caption: "Isolation · ouate de cellulose en combles perdus",
    width: 1600,
    height: 1067,
    size: 234_100,
  },
  {
    url: "https://images.unsplash.com/photo-1597247241453-04d3eec47a93?w=1600&auto=format&fit=crop",
    filename: "laine-de-bois-rouleaux.jpg",
    alt: "Rouleaux de laine de bois entreposés",
    caption: "Isolation · laine de bois",
    width: 1600,
    height: 1067,
    size: 217_800,
  },
  {
    url: "https://images.unsplash.com/photo-1572213796326-fd5fa31cf08b?w=1600&auto=format&fit=crop",
    filename: "toiture-tuiles-renovation.jpg",
    alt: "Toiture en tuiles en cours de rénovation",
    caption: "Toit · rénovation et isolation par l'extérieur",
    width: 1600,
    height: 1067,
    size: 254_600,
  },
  {
    url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&auto=format&fit=crop",
    filename: "maison-rurale-renovee.jpg",
    alt: "Maison rurale après rénovation",
    caption: "Patrimoine · maison rénovée BBC",
    width: 1600,
    height: 1067,
    size: 281_900,
  },
  {
    url: "https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=1600&auto=format&fit=crop",
    filename: "thermometre-mural.jpg",
    alt: "Thermomètre infrarouge sur mur",
    caption: "Audit · mesure thermique paroi froide",
    width: 1600,
    height: 1067,
    size: 168_500,
  },
  {
    url: "https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?w=1600&auto=format&fit=crop",
    filename: "panneaux-solaires-champ.jpg",
    alt: "Champ photovoltaïque résidentiel",
    caption: "Solaire · ferme photovoltaïque",
    width: 1600,
    height: 1067,
    size: 297_400,
  },
  {
    url: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1600&auto=format&fit=crop",
    filename: "soufflage-ouate.jpg",
    alt: "Souffleuse de ouate de cellulose en action",
    caption: "Chantier · soufflage ouate de cellulose",
    width: 1600,
    height: 1067,
    size: 204_200,
  },
  {
    url: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1600&auto=format&fit=crop",
    filename: "ventilation-conduit.jpg",
    alt: "Conduits de ventilation en faux plafond",
    caption: "Ventilation · réseau aéraulique",
    width: 1600,
    height: 1067,
    size: 182_000,
  },
  {
    url: "https://images.unsplash.com/photo-1577017040065-650ee4d43339?w=1600&auto=format&fit=crop",
    filename: "menuiserie-bois-fenetre.jpg",
    alt: "Menuiserie bois extérieure",
    caption: "Fenêtres · menuiserie bois sur-mesure",
    width: 1600,
    height: 1067,
    size: 196_100,
  },
  {
    url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1600&auto=format&fit=crop",
    filename: "ampoule-economies-energie.jpg",
    alt: "Ampoule symbole d'économies d'énergie",
    caption: "Énergie · économies et sobriété",
    width: 1600,
    height: 1067,
    size: 159_500,
  },
  {
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1600&auto=format&fit=crop",
    filename: "salon-paris-energie.jpg",
    alt: "Salon professionnel de la rénovation énergétique",
    caption: "Actualités · salon professionnel",
    width: 1600,
    height: 1067,
    size: 245_700,
  },
  {
    url: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1600&auto=format&fit=crop&q=80",
    filename: "regulation-vanne-chauffage.jpg",
    alt: "Vanne de régulation thermostatique",
    caption: "PAC · régulation et vanne 3 voies",
    width: 1600,
    height: 1067,
    size: 175_000,
  },
];

const PDF_SEEDS: Array<{
  filename: string;
  caption: string;
  alt: string;
  pageCount: number;
  size: number;
}> = [
  {
    filename: "guide-maprimerenov-2026.pdf",
    caption: "Guide MaPrimeRénov' 2026 (extrait)",
    alt: "Guide officiel MaPrimeRénov' édition 2026",
    pageCount: 24,
    size: 1_840_000,
  },
  {
    filename: "decret-pac-2026-04-14.pdf",
    caption: "Décret PAC du 14 avril 2026",
    alt: "Décret n°2026-412 relatif aux pompes à chaleur",
    pageCount: 12,
    size: 920_000,
  },
  {
    filename: "fiche-cee-bar-th-160.pdf",
    caption: "Fiche CEE BAR-TH-160",
    alt: "Fiche d'opération standardisée CEE BAR-TH-160",
    pageCount: 8,
    size: 540_000,
  },
  {
    filename: "audit-energetique-modele.pdf",
    caption: "Modèle d'audit énergétique réglementaire",
    alt: "Trame d'audit énergétique réglementaire pour maison individuelle",
    pageCount: 32,
    size: 2_150_000,
  },
  {
    filename: "etude-comparative-isolants.pdf",
    caption: "Étude comparative isolants biosourcés",
    alt: "Comparatif chiffré entre laine de bois, ouate de cellulose et chanvre",
    pageCount: 18,
    size: 1_240_000,
  },
];

const PDF_URL = "https://www.africau.edu/images/default/sample.pdf";

function buildMedias(): Media[] {
  const images: Media[] = IMAGE_SEEDS.map((s, i) => ({
    id: MED_IMG[i],
    kind: "image",
    url: s.url,
    filename: s.filename,
    alt: s.alt,
    caption: s.caption,
    sizeBytes: s.size,
    width: s.width,
    height: s.height,
    pageCount: null,
    createdAt: isoMinusDays(40 - i, 10, i % 60),
  }));
  const pdfs: Media[] = PDF_SEEDS.map((s, i) => ({
    id: MED_PDF[i],
    kind: "pdf",
    url: PDF_URL,
    filename: s.filename,
    alt: s.alt,
    caption: s.caption,
    sizeBytes: s.size,
    width: null,
    height: null,
    pageCount: s.pageCount,
    createdAt: isoMinusDays(20 - i, 14, i * 7),
  }));
  return [...images, ...pdfs];
}

// ---------------------------------------------------------------------------
// Users (5)
// ---------------------------------------------------------------------------
const USERS: User[] = [
  {
    id: USR.admin,
    email: "soufianosse@gmail.com",
    firstName: "Soufiane",
    lastName: "Administrateur",
    role: "admin",
    status: "active",
    lastLoginAt: isoMinusDays(0, 7, 30),
    createdAt: isoMinusDays(120, 9, 0),
  },
  {
    id: USR.editorMarie,
    email: "marie.dubois@maison-calorie.fr",
    firstName: "Marie",
    lastName: "Dubois",
    role: "editor",
    status: "active",
    lastLoginAt: isoMinusDays(1, 17, 12),
    createdAt: isoMinusDays(95, 11, 0),
  },
  {
    id: USR.editorThomas,
    email: "thomas.legrand@maison-calorie.fr",
    firstName: "Thomas",
    lastName: "Legrand",
    role: "editor",
    status: "active",
    lastLoginAt: isoMinusDays(2, 9, 5),
    createdAt: isoMinusDays(80, 10, 0),
  },
  {
    id: USR.readerAnnie,
    email: "annie.foulon@gmail.com",
    firstName: "Annie",
    lastName: "Foulon",
    role: "reader",
    status: "active",
    lastLoginAt: isoMinusDays(5, 21, 0),
    createdAt: isoMinusDays(40, 18, 0),
  },
  {
    id: USR.readerJulien,
    email: "julien.malard@protonmail.com",
    firstName: "Julien",
    lastName: "Malard",
    role: "reader",
    status: "suspended",
    lastLoginAt: isoMinusDays(45, 8, 0),
    createdAt: isoMinusDays(60, 8, 0),
  },
];

// ---------------------------------------------------------------------------
// Articles (20) — 8 enrichis + 12 nouveaux
// ---------------------------------------------------------------------------
type ArticleSeed = {
  id: string;
  title: string;
  slug: string;
  seoExcerpt: string;
  metaDescription: string;
  metaKeywords: string[];
  contentHtml: string;
  categoryId: string;
  authorId: string;
  coverIdx: number; // index into MED_IMG
  attachedIdx: number[]; // mix of img / pdf indices (negative = pdf)
  faqs: { question: string; answer: string }[];
  status: "published" | "draft" | "archived";
  createdDaysAgo: number;
  publishedDaysAgo: number | null; // null when draft / not published
  readingMinutes: number;
};

const ARTICLE_SEEDS: ArticleSeed[] = [
  {
    id: ART[0],
    title:
      "Pompes à chaleur air-eau : ce qui change avec le décret du 14 avril 2026",
    slug: "pac-air-eau-decret-14-avril-2026",
    seoExcerpt:
      "Le seuil de COP minimum passe de 3,2 à 3,5. Conséquences sur les modèles certifiés, le rythme de pose et la prime « gros gestes ».",
    metaDescription:
      "Décret PAC air-eau du 14 avril 2026 : nouveau seuil COP 3,5, impact sur les modèles, la pose et MaPrimeRénov'.",
    metaKeywords: [
      "pompe à chaleur",
      "pac air-eau",
      "décret",
      "cop",
      "maprimerenov",
    ],
    contentHtml: `
<p>Le décret n°2026-412 du 14 avril 2026 relève le seuil de COP minimum exigé pour qu'une pompe à chaleur air-eau soit éligible aux aides nationales. Le palier passe de <strong>3,2 à 3,5</strong>, calculé en conditions A2W35. La mesure entre en vigueur au 1er juillet 2026 — six semaines pour écouler les stocks existants.</p>
<h2>Ce que dit le texte</h2>
<p>L'article 4 du décret modifie l'arrêté du 22 décembre 2014 en intégrant le nouveau seuil au point B (basse température) de la grille NF PAC. Les modèles certifiés avant publication conservent leur éligibilité jusqu'à épuisement des stocks déclarés au registre RGE.</p>
<ul>
  <li>Seuil COP : 3,5 minimum à A2W35 ;</li>
  <li>SCOP minimal exigé en zone climatique H1 : 3,8 ;</li>
  <li>Niveau sonore pondéré : 47 dB(A) à un mètre, contre 50 dB(A) auparavant.</li>
</ul>
<h2>Quels modèles décrochent ?</h2>
<p>D'après le registre Eurovent au 25 avril, environ 18 % des modèles aujourd'hui éligibles passent sous le seuil. Les <em>bi-bloc</em> de moyenne gamme installés en 2024 sont les plus exposés ; les monobloc R290 récents passent sans difficulté.</p>
<blockquote>« Les modèles les plus pénalisés sont ceux qui s'appuyaient encore sur du R410A. Le marché a anticipé, mais des stocks circulent. » — Yann Chevassu, RGE 91.</blockquote>
<h2>Effet sur la prime « gros gestes »</h2>
<p>La grille MaPrimeRénov' aligne ses primes sur le décret : <strong>plus de prime majorée pour les PAC sous 3,5</strong>. Pour les ménages très modestes, la prime de 5 000 € reste accessible, mais uniquement sur les modèles désormais conformes — vérifier la fiche produit à jour avant signature.</p>
<h2>Calendrier et garde-fous</h2>
<p>Les bons de commande signés avant le 30 juin restent éligibles aux anciennes conditions, sous réserve de pose avant fin décembre 2026. Au-delà, le retour au régime de droit commun s'applique sans dérogation possible.</p>
<p>Le décret fixe également un dispositif transitoire pour les rénovations en copropriété : l'éligibilité court jusqu'à fin 2027 dès lors que le vote en AG est antérieur au 14 avril.</p>
`.trim(),
    categoryId: CAT.pompes,
    authorId: AUT.lea,
    coverIdx: 3,
    attachedIdx: [0, -1],
    faqs: [
      {
        question: "Mon installation est-elle éligible si elle a été signée en mars 2026 ?",
        answer:
          "Oui, sous réserve que le bon de commande soit antérieur au 30 juin 2026 et que la pose intervienne avant le 31 décembre 2026.",
      },
      {
        question: "Les COP affichés en magasin sont-ils ceux du décret ?",
        answer:
          "Souvent non. Le COP commercial est mesuré à A7W35 (température extérieure 7 °C). Le décret impose A2W35, environ 0,3 point en deçà.",
      },
      {
        question: "Et pour la géothermie ?",
        answer:
          "La géothermie n'est pas concernée par ce décret ; elle reste régie par l'arrêté du 6 novembre 2018, en attente de révision en 2027.",
      },
    ],
    status: "published",
    createdDaysAgo: 7,
    publishedDaysAgo: 6,
    readingMinutes: 7,
  },
  {
    id: ART[1],
    title:
      "Laine de bois ou ouate de cellulose : le match thermique en combles perdus",
    slug: "laine-bois-ouate-cellulose-combles-perdus",
    seoExcerpt:
      "On a comparé R, déphasage, prix posé et bilan carbone sur six chantiers tests en région Centre.",
    metaDescription:
      "Comparatif laine de bois vs ouate de cellulose en combles perdus : R, déphasage, coût posé, bilan carbone.",
    metaKeywords: [
      "laine de bois",
      "ouate de cellulose",
      "isolation",
      "combles perdus",
      "biosourcé",
    ],
    contentHtml: `
<p>Six chantiers tests, deux isolants biosourcés, un seul critère : tenir 40 cm d'épaisseur en combles perdus avec un R cible de 9 m².K/W. On a chronométré, mesuré, pesé. Verdict en quatre chapitres.</p>
<h2>Méthodologie et hypothèses</h2>
<p>Mesures réalisées entre janvier et mars 2026 sur six maisons individuelles en région Centre (charpente fermette, ferme à entrait, panne sablière selon les cas). Souffleuse identique, plénum dégagé, pare-vapeur conservé.</p>
<h2>R, déphasage, masse volumique</h2>
<ul>
  <li><strong>Laine de bois</strong> en flocons (60 kg/m³) : R = 9,0 pour 38 cm, déphasage relevé en plein été ≈ 11 h ;</li>
  <li><strong>Ouate de cellulose</strong> (45 kg/m³) : R = 9,1 pour 36 cm, déphasage ≈ 9 h ;</li>
  <li>Sd équivalent maintenu &gt; 18 m côté chaud sur les deux produits.</li>
</ul>
<h2>Prix posé et bilan carbone</h2>
<p>Sur le panel : laine de bois à 38 €/m² posé HT en moyenne, ouate de cellulose à 28 €/m² HT. L'écart s'explique surtout par le coût matière (×2). Côté carbone, la laine de bois sort gagnante (-23 % vs ouate) mais reste tributaire des distances d'approvisionnement.</p>
<blockquote>« Pour viser un confort d'été en zone H2, le déphasage est l'argument décisif. C'est lui qui tient debout l'investissement laine de bois. »</blockquote>
<h2>Quel choix pour quel chantier ?</h2>
<p>Sur les charpentes accessibles, la ouate reste imbattable rapport qualité/prix dès lors que les pare-vapeur sont à jour. Sur les rénovations BBC haut de gamme avec exposition sud-ouest, la laine de bois justifie son surcoût.</p>
`.trim(),
    categoryId: CAT.isolation,
    authorId: AUT.karim,
    coverIdx: 13,
    attachedIdx: [14, -4],
    faqs: [
      {
        question: "Faut-il un pare-vapeur dans tous les cas ?",
        answer:
          "Oui, sauf charpente très ventilée et climat tempéré. La règle : Sd côté chaud au moins 5 fois supérieur au Sd côté froid.",
      },
      {
        question: "La ouate de cellulose tasse-t-elle vraiment ?",
        answer:
          "Le tassement réglementaire est intégré dans la fiche produit (souvent 12 %). En pratique, sur nos chantiers, on n'a pas observé plus de 8 % à un an, parois protégées.",
      },
    ],
    status: "published",
    createdDaysAgo: 9,
    publishedDaysAgo: 8,
    readingMinutes: 11,
  },
  {
    id: ART[2],
    title: "MaPrimeRénov' : la nouvelle grille 2026 décodée pas à pas",
    slug: "maprimerenov-grille-2026-decode",
    seoExcerpt:
      "Plafonds par geste, écrêtements, cumul CEE — un guide pour estimer son reste à charge avant signature.",
    metaDescription:
      "Décryptage de la grille MaPrimeRénov' 2026 : plafonds, cumuls, reste à charge. Cas pratiques.",
    metaKeywords: [
      "maprimerenov",
      "aides",
      "subventions",
      "rénovation énergétique",
      "cee",
    ],
    contentHtml: `
<p>La grille 2026 abaisse plusieurs plafonds, fusionne deux gestes et plafonne les cumuls CEE. Tour d'horizon pas à pas, avec trois cas chiffrés en fin d'article.</p>
<h2>Ce qui bouge</h2>
<p>La prime « parois vitrées » devient la prime « menuiseries extérieures » et intègre les portes d'entrée à fort impact thermique. Le plafond gros gestes redescend à 70 000 € après écrêtement.</p>
<ul>
  <li>Plafond modeste : 12 500 € (geste unique) ;</li>
  <li>Plafond très modeste : 18 000 € (parcours travaux) ;</li>
  <li>Cumul CEE : 80 % du reste à charge avant prime, contre 100 % en 2025.</li>
</ul>
<h2>Trois cas concrets</h2>
<p>Famille en zone H1, revenus intermédiaires, PAC air-eau + isolation combles + VMC double flux : reste à charge estimé 6 200 € avant éco-PTZ, contre 4 100 € sous l'ancienne grille.</p>
<p>Maison ancienne, classement DPE F, propriétaire occupant modeste : la trajectoire « audit + parcours travaux » reste la plus avantageuse, mais nécessite un MAR (Mon Accompagnateur Rénov').</p>
<h2>Pièges fréquents</h2>
<p>Les devis doivent désormais distinguer poste « fourniture » et « main-d'œuvre » au sou près. Une erreur d'arrondi suffit à différer le paiement de la prime.</p>
`.trim(),
    categoryId: CAT.aides,
    authorId: AUT.camille,
    coverIdx: 11,
    attachedIdx: [-0],
    faqs: [
      {
        question: "Le cumul avec les aides locales est-il maintenu ?",
        answer:
          "Oui, dans la limite du reste à charge. Certaines régions ont relevé leur enveloppe pour compenser l'érosion nationale.",
      },
      {
        question: "Quand intervient le versement ?",
        answer:
          "Sous 25 jours en moyenne après acceptation de la demande de paiement, en cycle normal. Comptez plus en période de pic (avril-mai).",
      },
    ],
    status: "published",
    createdDaysAgo: 10,
    publishedDaysAgo: 9,
    readingMinutes: 9,
  },
  {
    id: ART[3],
    title:
      "Autoconsommation : pourquoi le tarif d'achat 2026 redessine la rentabilité",
    slug: "autoconsommation-tarif-achat-2026",
    seoExcerpt:
      "Calculs, hypothèses, tableurs téléchargeables — et trois cas réels chez des particuliers.",
    metaDescription:
      "Tarif d'achat photovoltaïque 2026 : nouvelles hypothèses de rentabilité, simulateurs et cas réels.",
    metaKeywords: [
      "photovoltaïque",
      "autoconsommation",
      "tarif achat",
      "rentabilité",
      "solaire",
    ],
    contentHtml: `
<p>La baisse trimestrielle du tarif d'achat surplus passe à -3,5 % pour le trimestre en cours. À puissance et orientation égales, le temps de retour s'allonge d'environ 14 mois sur une installation 6 kWc.</p>
<h2>Méthodologie</h2>
<p>On compare trois installations 6 kWc posées en 2023, 2024 et début 2026 chez trois particuliers (Saintes, Limoges, Vannes). Compteurs Linky, monitoring inverter, données Enedis exportées.</p>
<h2>Résultats clés</h2>
<ul>
  <li>Taux d'autoconsommation moyen : 41 % sans pilotage, 62 % avec pilotage et eau chaude solaire ;</li>
  <li>Tarif surplus 2026 : 0,1063 €/kWh, contre 0,1244 en 2025 ;</li>
  <li>Temps de retour brut : 11 ans en moyenne sur 6 kWc orientés sud-est.</li>
</ul>
<h2>Quels arbitrages ?</h2>
<p>L'investissement dans un pilotage intelligent (gestion ECS + véhicule électrique) reste le levier le plus efficace pour absorber la baisse tarifaire. Le stockage batterie peine encore à se rentabiliser sous 8 ans.</p>
`.trim(),
    categoryId: CAT.solaire,
    authorId: AUT.yann,
    coverIdx: 7,
    attachedIdx: [18, -2],
    faqs: [
      {
        question: "Faut-il signer avant la prochaine révision tarifaire ?",
        answer:
          "L'effet est marginal sur un horizon 20 ans. Mieux vaut signer au bon moment du dimensionnement qu'au bon moment du tarif.",
      },
      {
        question: "Le stockage batterie est-il rentable ?",
        answer:
          "Sous 8 ans, rarement. Au-delà, oui, surtout couplé à un véhicule électrique et un pilotage actif.",
      },
      {
        question: "Et la revente totale ?",
        answer:
          "Réservée aux installations &gt; 9 kWc en surface industrielle. Pour le résidentiel, l'autoconsommation surplus reste l'option de droit commun.",
      },
    ],
    status: "published",
    createdDaysAgo: 11,
    publishedDaysAgo: 10,
    readingMinutes: 8,
  },
  {
    id: ART[4],
    title:
      "VMC double flux : faut-il vraiment l'installer dans une maison ancienne ?",
    slug: "vmc-double-flux-maison-ancienne",
    seoExcerpt:
      "Étanchéité, perméabilité à l'air, retours sur dix rénovations BBC en pierre meulière.",
    metaDescription:
      "VMC double flux en rénovation BBC : étanchéité, débit, retours de chantier sur dix maisons anciennes.",
    metaKeywords: [
      "vmc double flux",
      "rénovation",
      "bâti ancien",
      "perméabilité",
      "qualité air",
    ],
    contentHtml: `
<p>Dans le bâti ancien, la VMC double flux divise. Le coût et la place qu'elle réclame en partie haute interrogent dès lors qu'on n'a pas refait l'étanchéité à l'air. On a suivi dix rénovations BBC.</p>
<h2>Le verrou : la perméabilité</h2>
<p>Sans descendre à Q4Pa-surf ≤ 1,0 m³/(h·m²), une double flux ne tient pas sa promesse de rendement. Les passoires laissent fuiter l'air avant qu'il n'arrive à l'échangeur, et le COP énergétique du système s'effondre.</p>
<h2>Retours de chantier</h2>
<p>Sur les dix maisons : sept ont atteint Q4 = 0,8, deux à 1,2, une à 1,7. Cette dernière a finalement déposé son projet pour une simple hygroréglable type B et a réinvesti l'écart dans l'isolation.</p>
<blockquote>« La VMC double flux n'a de sens qu'après un test d'infiltrométrie favorable. Sinon, on suréquipe une maison qui n'en tirera rien. » — Sophie Berthier, archi DPLG.</blockquote>
<h2>Cible et coût</h2>
<p>Comptez 6 500 € à 9 200 € posés HT pour une installation correcte sur une maison de 120 m². L'amortissement énergétique seul tourne autour de 12 ans en zone H1.</p>
`.trim(),
    categoryId: CAT.ventilation,
    authorId: AUT.sophie,
    coverIdx: 8,
    attachedIdx: [20],
    faqs: [
      {
        question: "Et la VMI ?",
        answer:
          "La VMI (insufflation) est une alternative pertinente sur certains bâtis très perméables, mais sa place dans MaPrimeRénov' reste marginale.",
      },
      {
        question: "Quel impact qualité d'air ?",
        answer:
          "L'effet est mesurable (CO2 -30 % en pièces de nuit). Mais l'impact santé reste conditionné à la régularité de l'entretien filtres.",
      },
    ],
    status: "published",
    createdDaysAgo: 12,
    publishedDaysAgo: 11,
    readingMinutes: 6,
  },
  {
    id: ART[5],
    title: "Triple vitrage : quand le surcoût est-il vraiment justifié ?",
    slug: "triple-vitrage-surcout-justifie",
    seoExcerpt:
      "Au-delà du Uw affiché, ce que disent les études de terrain en climat océanique et continental.",
    metaDescription:
      "Triple vitrage en rénovation : quand le surcoût est rentabilisé, en climat océanique et continental.",
    metaKeywords: [
      "triple vitrage",
      "fenêtre",
      "uw",
      "isolation",
      "rénovation",
    ],
    contentHtml: `
<p>Le triple vitrage descend à Uw 0,75 W/m².K sur les meilleures séries. Le surcoût face au double vitrage à lames d'argon reste de 25 à 40 %. La question n'est plus technique mais économique.</p>
<h2>Climat continental : oui, sous conditions</h2>
<p>En zone H1 et H1b, le triple vitrage récupère son surcoût sous 14 ans dès lors que le mur derrière la menuiserie a un U &lt; 0,30 W/m².K. Sans isolation murale à la hauteur, c'est un thermostat sans système.</p>
<h2>Climat océanique : rarement</h2>
<p>Sur la façade atlantique, hors orientation nord exposée, le double vitrage performant remplit l'office à 90 %. Le triple vitrage devient un argument confort acoustique plutôt qu'énergétique.</p>
<h2>Trois pièges fréquents</h2>
<ul>
  <li>Surdimensionnement du dormant qui pénalise le Sw et le facteur solaire ;</li>
  <li>Mise en œuvre tunnel sans rupteurs de pont thermique ;</li>
  <li>Choix d'une intercalaire métal plutôt que warm-edge.</li>
</ul>
`.trim(),
    categoryId: CAT.fenetres,
    authorId: AUT.lea,
    coverIdx: 9,
    attachedIdx: [21],
    faqs: [
      {
        question: "Le triple vitrage pèse-t-il vraiment plus lourd ?",
        answer:
          "Oui, +30 % en moyenne. Cela impose un calcul de charge sur les gonds, surtout sur les baies coulissantes.",
      },
      {
        question: "Y a-t-il un risque de condensation extérieure ?",
        answer:
          "C'est un signe de bon fonctionnement : l'extérieur de la vitre se refroidit en dessous du point de rosée. Inesthétique le matin, sans conséquence.",
      },
    ],
    status: "published",
    createdDaysAgo: 13,
    publishedDaysAgo: 12,
    readingMinutes: 7,
  },
  {
    id: ART[6],
    title:
      "RE2026 : ce que le projet de décret change pour la rénovation des passoires",
    slug: "re2026-projet-decret-passoires",
    seoExcerpt:
      "Lecture annotée du texte mis en consultation. Calendrier, seuils DPE, arbitrages possibles.",
    metaDescription:
      "Projet de décret RE2026 : nouveaux seuils DPE, calendrier, arbitrages pour la rénovation des passoires énergétiques.",
    metaKeywords: [
      "re2026",
      "réglementation",
      "passoires",
      "dpe",
      "rénovation",
    ],
    contentHtml: `
<p>Le projet de décret RE2026 a été mis en consultation publique le 18 avril. Il étend l'interdiction de location des logements G+ à l'horizon 2027, et celle des G à 2028. Lecture annotée.</p>
<h2>Calendrier</h2>
<ul>
  <li>1er janvier 2027 : interdiction des G+ (consommation &gt; 450 kWh/m²/an) ;</li>
  <li>1er janvier 2028 : interdiction des G ;</li>
  <li>2030 : interdiction des F en location longue durée.</li>
</ul>
<h2>Seuils DPE révisés</h2>
<p>Le projet abaisse de 5 kWh/m².an le seuil de la classe F, ce qui fait basculer environ 320 000 logements supplémentaires dans la catégorie passoire.</p>
<h2>Arbitrages possibles</h2>
<p>Pour les propriétaires de logements G, la rénovation globale reste la voie royale. Le décret prévoit une dérogation pour les logements en zone Bâtiments de France, sous conditions.</p>
<blockquote>« Les propriétaires bailleurs sont sommés d'agir vite. Le coût d'une rénovation globale reste maîtrisable s'il est planifié avant 2027. » — Camille Roy.</blockquote>
`.trim(),
    categoryId: CAT.reglementation,
    authorId: AUT.camille,
    coverIdx: 10,
    attachedIdx: [-1, -3],
    faqs: [
      {
        question: "Que se passe-t-il si je n'ai pas rénové au 1er janvier 2027 ?",
        answer:
          "Le bail peut être contesté par le locataire et le loyer gelé. Le bien reste habitable, mais devient impropre à la location longue durée.",
      },
      {
        question: "La passoire est-elle constatée à la signature ou en cours de bail ?",
        answer:
          "À la signature. Un bail en cours conclu avant l'entrée en vigueur n'est pas remis en cause, mais ne pourra pas être renouvelé sans rénovation.",
      },
      {
        question: "Quel rôle pour le MAR ?",
        answer:
          "Mon Accompagnateur Rénov' devient quasi obligatoire pour accéder aux aides de parcours travaux dès 2027.",
      },
    ],
    status: "published",
    createdDaysAgo: 14,
    publishedDaysAgo: 13,
    readingMinutes: 12,
  },
  {
    id: ART[7],
    title: "Éco-PTZ + MaPrimeRénov' : monter un dossier sans erreur",
    slug: "eco-ptz-maprimerenov-dossier-sans-erreur",
    seoExcerpt:
      "Les six pièces qui bloquent 80 % des dossiers, et les délais réalistes par banque partenaire.",
    metaDescription:
      "Éco-PTZ et MaPrimeRénov' : pièces à fournir, blocages fréquents, délais des banques partenaires en 2026.",
    metaKeywords: [
      "eco-ptz",
      "maprimerenov",
      "financement",
      "rénovation",
      "banque",
    ],
    contentHtml: `
<p>Six pièces récurrentes bloquent 80 % des dossiers éco-PTZ. Quand le dossier est complet du premier coup, comptez quatre semaines au pire. Sinon, deux à quatre mois.</p>
<h2>Les six pièces qui font tomber</h2>
<ol>
  <li>Devis avec poste fourniture/main-d'œuvre séparé ;</li>
  <li>Mention RGE valide à la date du devis ET de la facture ;</li>
  <li>Attestation de fin de travaux conforme au modèle 2026 ;</li>
  <li>Notice d'éligibilité signée par l'artisan ;</li>
  <li>Plan de financement détaillant les autres aides ;</li>
  <li>Photo des compteurs avant/après travaux.</li>
</ol>
<h2>Délais par banque (panel)</h2>
<p>Sur un échantillon de douze banques partenaires : Crédit Agricole en tête (3,5 semaines moyennes), BNP Paribas en queue (8 semaines). Les caisses régionales et les banques mutualistes affichent les taux les plus bas mais aussi les délais les plus variables.</p>
<h2>Bonnes pratiques</h2>
<p>Soumettre le dossier en parallèle de la demande MaPrimeRénov' permet de figer les hypothèses de reste à charge. Les variations en cours de chantier sont mal supportées par les banques.</p>
`.trim(),
    categoryId: CAT.aides,
    authorId: AUT.karim,
    coverIdx: 11,
    attachedIdx: [-2],
    faqs: [
      {
        question: "Le taux est-il toujours à 0 % ?",
        answer:
          "Oui, l'éco-PTZ reste à 0 % par construction. C'est le différé d'amortissement qui varie selon la banque.",
      },
      {
        question: "Peut-on cumuler plusieurs éco-PTZ ?",
        answer:
          "Oui, sur des gestes différents et dans la limite de 50 000 € au total, désormais.",
      },
    ],
    status: "published",
    createdDaysAgo: 15,
    publishedDaysAgo: 14,
    readingMinutes: 10,
  },
  // ---------- 12 articles supplémentaires ----------
  {
    id: ART[8],
    title: "Audit énergétique réglementaire : le mode d'emploi 2026",
    slug: "audit-energetique-mode-emploi-2026",
    seoExcerpt:
      "L'audit devient le sésame des parcours travaux. Trame, durée, prix moyen et choix du prestataire — guide complet.",
    metaDescription:
      "Audit énergétique réglementaire en 2026 : trame, durée, prix, MAR, choix du prestataire pour une rénovation globale.",
    metaKeywords: [
      "audit énergétique",
      "rénovation globale",
      "mar",
      "dpe",
      "rénovation",
    ],
    contentHtml: `
<p>Depuis le 1er avril 2026, tout dossier de parcours travaux exige un audit énergétique réglementaire signé par un auditeur RGE Études. Le mode d'emploi pas à pas, du devis au rendu final.</p>
<h2>Ce que contient un audit</h2>
<p>L'audit fixe la situation initiale (DPE, état de l'enveloppe, équipements), définit un scénario sobre et un scénario performance, et chiffre les économies d'énergie attendues sur 30 ans.</p>
<ul>
  <li>Trois visites de terrain en moyenne ;</li>
  <li>Simulation thermique dynamique sur logiciel agréé ;</li>
  <li>Restitution écrite avec graphes de consommation prévisionnelle.</li>
</ul>
<h2>Combien ça coûte ?</h2>
<p>Le panier moyen 2026 s'établit à 1 250 € HT pour une maison individuelle. MaPrimeRénov' rembourse jusqu'à 80 % pour les ménages très modestes.</p>
<h2>Choisir son auditeur</h2>
<p>Vérifier la mention RGE Études, demander un rapport-type, lire la liste des logiciels utilisés. Un auditeur qui propose un seul scénario est à éviter — le décret en exige deux.</p>
`.trim(),
    categoryId: CAT.reglementation,
    authorId: AUT.theo,
    coverIdx: 17,
    attachedIdx: [-3],
    faqs: [
      {
        question: "L'audit est-il valable combien de temps ?",
        answer: "Cinq ans, à condition qu'aucun travaux d'envergure n'ait été réalisé entre temps.",
      },
      {
        question: "Faut-il refaire un DPE après l'audit ?",
        answer: "Non, l'audit intègre le DPE. Le DPE post-travaux sera réalisé en fin de chantier pour valoriser le saut de classe.",
      },
    ],
    status: "published",
    createdDaysAgo: 17,
    publishedDaysAgo: 16,
    readingMinutes: 8,
  },
  {
    id: ART[9],
    title: "RGE Qualibat ou Qualipac : quel signe choisir pour vos travaux ?",
    slug: "rge-qualibat-qualipac-quel-signe",
    seoExcerpt:
      "Qualibat, Qualipac, Qualisol, Qualibois : à chaque geste son signe RGE. La carte 2026 pour s'y retrouver.",
    metaDescription:
      "Comparatif RGE 2026 : Qualibat, Qualipac, Qualisol, Qualibois — quel signe pour quel geste de rénovation.",
    metaKeywords: ["rge", "qualibat", "qualipac", "qualisol", "rénovation"],
    contentHtml: `
<p>Quatre signes RGE concentrent l'essentiel des chantiers résidentiels. Chacun couvre un périmètre précis, et l'erreur d'attribution suffit à perdre les aides.</p>
<h2>Qualibat</h2>
<p>Le plus large : isolation, menuiseries, gros œuvre, plomberie. Subdivisé en plus de 200 qualifications. Pour la rénovation thermique, l'identifiant 8141 (isolation thermique intérieure) reste le plus courant.</p>
<h2>Qualipac</h2>
<p>Réservé aux installateurs de pompes à chaleur (air-eau, air-air, géothermie). Conditionne l'éligibilité de la prime PAC dès lors que le geste est subventionné.</p>
<h2>Qualisol et Qualibois</h2>
<p>Solaire thermique pour Qualisol, bois énergie pour Qualibois. Les chaudières granulés relèvent du second.</p>
<h2>Vérifier en ligne</h2>
<p>L'annuaire France Rénov' permet de vérifier en temps réel la validité d'une qualification. Toujours croiser le numéro Qualibat avec la base.</p>
`.trim(),
    categoryId: CAT.reglementation,
    authorId: AUT.camille,
    coverIdx: 10,
    attachedIdx: [],
    faqs: [
      {
        question: "Un artisan peut-il avoir plusieurs RGE ?",
        answer: "Oui, c'est fréquent. Un menuisier ITE peut être Qualibat 8141 et 8142.",
      },
    ],
    status: "published",
    createdDaysAgo: 19,
    publishedDaysAgo: 18,
    readingMinutes: 6,
  },
  {
    id: ART[10],
    title:
      "DPE 2026 : les corrections du moteur de calcul publié au Journal officiel",
    slug: "dpe-2026-corrections-moteur-calcul",
    seoExcerpt:
      "Le ministère revoit le coefficient de conversion en énergie primaire. Quatre points de méthode changent — explication.",
    metaDescription:
      "DPE 2026 : corrections du moteur de calcul, coefficient énergie primaire, impact sur les classements F et G.",
    metaKeywords: ["dpe", "moteur de calcul", "réglementation", "passoires", "énergie primaire"],
    contentHtml: `
<p>L'arrêté du 7 avril 2026 publie les corrections du moteur de calcul DPE. Le coefficient de conversion en énergie primaire de l'électricité tombe à 2,1 (contre 2,3). Quatre points de méthode bougent.</p>
<h2>Coefficient énergie primaire</h2>
<p>La baisse à 2,1 reflète l'évolution du mix électrique français. Mécaniquement, les maisons chauffées à l'électricité gagnent en moyenne 12 kWhep/m²/an, soit parfois une classe entière.</p>
<h2>Apports solaires</h2>
<p>Le calcul des apports gratuits intègre désormais un facteur d'inertie corrigé pour les bâtiments avec planchers chauffants basse température.</p>
<h2>Eau chaude sanitaire</h2>
<p>Les pertes en distribution sont recalées sur les données de campagnes 2023-2024, plus représentatives des installations modernes.</p>
<h2>Ventilation</h2>
<p>Le rendement de la double flux est désormais plafonné à 88 % en valeur conventionnelle, contre 92 % auparavant — un alignement sur les retours du terrain.</p>
`.trim(),
    categoryId: CAT.reglementation,
    authorId: AUT.theo,
    coverIdx: 10,
    attachedIdx: [-1],
    faqs: [
      {
        question: "Faut-il refaire son DPE après l'arrêté ?",
        answer:
          "Non, le DPE en cours reste valide jusqu'à son terme. Le nouveau calcul s'applique aux DPE émis à compter du 1er juillet 2026.",
      },
    ],
    status: "published",
    createdDaysAgo: 21,
    publishedDaysAgo: 20,
    readingMinutes: 7,
  },
  {
    id: ART[11],
    title: "Plancher chauffant basse température : le retour en grâce ?",
    slug: "plancher-chauffant-basse-temperature-retour",
    seoExcerpt:
      "Couplé à une PAC, le plancher chauffant retrouve des couleurs. Mode d'emploi sur dalle existante et rénovation lourde.",
    metaDescription:
      "Plancher chauffant basse température en rénovation : compatibilité PAC, mise en œuvre sur dalle, contraintes et bénéfices.",
    metaKeywords: ["plancher chauffant", "pac", "basse température", "rénovation", "chauffage"],
    contentHtml: `
<p>Longtemps cantonné au neuf, le plancher chauffant basse température fait son retour en rénovation. Le couplage avec une PAC air-eau y est pour beaucoup. Modes opératoires et pièges.</p>
<h2>Sur dalle existante</h2>
<p>Les systèmes sec sur lambourdes ou minces (épaisseur 25 mm) permettent de poser sans rehausse majeure des seuils. Le rendement reste correct, à condition d'isoler le sol de 80 mm minimum.</p>
<h2>Rénovation lourde</h2>
<p>Sur dalle déposée, le plancher humide reste la référence. Comptez 130 €/m² posé HT, isolant compris.</p>
<h2>Régulation</h2>
<p>La régulation par sonde extérieure couplée à une loi d'eau est indispensable. Sans elle, la PAC fonctionne en tout-ou-rien et perd 1,5 point de SCOP.</p>
`.trim(),
    categoryId: CAT.pompes,
    authorId: AUT.lea,
    coverIdx: 24,
    attachedIdx: [5],
    faqs: [
      {
        question: "Faut-il déposer le parquet existant ?",
        answer:
          "Pas systématiquement. Les systèmes secs s'installent par-dessus dès lors que l'épaisseur disponible est de 35 mm minimum.",
      },
    ],
    status: "published",
    createdDaysAgo: 23,
    publishedDaysAgo: 22,
    readingMinutes: 6,
  },
  {
    id: ART[12],
    title: "Isolation par l'extérieur : les pathologies les plus fréquentes",
    slug: "ite-pathologies-frequentes",
    seoExcerpt:
      "Cloquage, fissures, défauts de mise en œuvre — la liste des sinistres ITE recensés sur 600 chantiers.",
    metaDescription:
      "Isolation thermique par l'extérieur : pathologies, sinistres, défauts de mise en œuvre. Synthèse sur 600 chantiers.",
    metaKeywords: ["ite", "isolation extérieure", "pathologie", "sinistre", "rénovation"],
    contentHtml: `
<p>Sur 600 chantiers ITE suivis en 2024-2025, 11 % présentent au moins une pathologie majeure. Voici le top cinq des défauts récurrents et leurs facteurs déclencheurs.</p>
<h2>1. Cloquage de l'enduit</h2>
<p>Le défaut le plus visible. Cause principale : application sur un sous-enduit insuffisamment sec, ou par temps chaud sans humidification du support.</p>
<h2>2. Fissures en sous-bassement</h2>
<p>L'absence de profil de départ correctement calé ou d'arrêt d'enduit en pied de mur favorise ce phénomène. Apparait souvent dans les 18 mois suivant la pose.</p>
<h2>3. Décollement des plaques</h2>
<p>Lié à un défaut d'adhérence ou au choix d'un mortier inadapté au support. Les murs en parpaing creux peints anciennement sont les plus exposés.</p>
<h2>4. Ponts thermiques résiduels</h2>
<p>Les retours d'ITE en tableau de fenêtre sont systématiquement mal traités. Compter 1,5 cm minimum d'isolant en tableau.</p>
<h2>5. Infiltrations en tête de mur</h2>
<p>L'arrêt d'isolant en tête de mur, sous corniche ou bandeau, est un point de vigilance. Une bavette zinc bien dimensionnée prévient le sinistre.</p>
`.trim(),
    categoryId: CAT.isolation,
    authorId: AUT.karim,
    coverIdx: 15,
    attachedIdx: [4],
    faqs: [
      {
        question: "Une pathologie est-elle couverte par la garantie décennale ?",
        answer:
          "Oui, dès lors qu'elle compromet la solidité ou l'usage de l'ouvrage. Les défauts esthétiques relèvent de la biennale.",
      },
      {
        question: "Que faire si l'entreprise a disparu ?",
        answer:
          "La décennale est portée par l'assureur. Conserver le procès-verbal de réception et l'attestation d'assurance avec la décennale.",
      },
    ],
    status: "published",
    createdDaysAgo: 25,
    publishedDaysAgo: 24,
    readingMinutes: 9,
  },
  {
    id: ART[13],
    title: "Géothermie : que vaut-elle face à la PAC air-eau en 2026 ?",
    slug: "geothermie-vs-pac-air-eau-2026",
    seoExcerpt:
      "Coût installé, SCOP, durée de vie : la géothermie reprend des couleurs sur des bouquets bien dimensionnés.",
    metaDescription:
      "Géothermie en rénovation 2026 : comparaison coût, SCOP et durée de vie face à la PAC air-eau.",
    metaKeywords: ["géothermie", "pac", "scop", "rénovation", "chauffage"],
    contentHtml: `
<p>La géothermie sortait du marché résidentiel par le haut. Avec la flambée des prix de l'air-eau haut de gamme, elle reprend de la place. Comparaison à conditions équivalentes.</p>
<h2>SCOP</h2>
<p>SCOP géothermie : 4,2 à 4,8 en moyenne, contre 3,4 à 3,9 pour une PAC air-eau récente. L'écart est durable, indépendant des froids.</p>
<h2>Coût installé</h2>
<p>Comptez 22 000 € à 30 000 € posés HT pour une maison de 150 m², contre 11 000 € à 16 000 € pour une air-eau. Le différentiel s'amenuise dès qu'on intègre la durée de vie : 25 ans pour la géothermie, 15 pour l'air-eau.</p>
<h2>Contraintes</h2>
<p>La géothermie réclame une étude de sol (1 500 €) et de la place. Sur sondes verticales, on compte 30 à 50 m linéaires par kW de puissance.</p>
`.trim(),
    categoryId: CAT.pompes,
    authorId: AUT.yann,
    coverIdx: 6,
    attachedIdx: [3],
    faqs: [
      {
        question: "Faut-il un permis pour forer ?",
        answer:
          "Une déclaration suffit pour les sondes inférieures à 100 m, mais elle doit être conforme au code minier.",
      },
    ],
    status: "published",
    createdDaysAgo: 28,
    publishedDaysAgo: 27,
    readingMinutes: 7,
  },
  {
    id: ART[14],
    title: "Étanchéité à l'air : le test au début et à la fin du chantier",
    slug: "etancheite-air-test-debut-fin-chantier",
    seoExcerpt:
      "Le test d'infiltrométrie n'est plus optionnel sur une rénovation BBC. Quand le programmer, et que faire des résultats.",
    metaDescription:
      "Étanchéité à l'air et tests d'infiltrométrie en rénovation BBC : calendrier, interprétation, corrections sur chantier.",
    metaKeywords: ["étanchéité", "infiltrométrie", "blower door", "bbc", "rénovation"],
    contentHtml: `
<p>Le test d'infiltrométrie devient l'arbitre du rendement énergétique. Deux passages s'imposent : à mi-chantier et en réception. Programmer trop tard, c'est s'exposer à un mauvais résultat sans remède.</p>
<h2>Le test à mi-chantier</h2>
<p>Réalisé après pose des pare-vapeur et avant doublage, il permet de corriger les défauts (passage de gaine, jonction toit-mur). Comptez 350 à 500 € HT.</p>
<h2>Le test final</h2>
<p>Obligatoire pour les labels BBC Rénovation et Effinergie. Mesure pondérée Q4Pa-surf en m³/(h·m²).</p>
<h2>Que faire d'un Q4 dégradé ?</h2>
<ul>
  <li>Q4 ≤ 1 : excellent, conforme BBC ;</li>
  <li>Q4 entre 1 et 1,3 : acceptable, optimisations possibles ;</li>
  <li>Q4 &gt; 1,5 : test à recommencer après correction.</li>
</ul>
`.trim(),
    categoryId: CAT.ventilation,
    authorId: AUT.sophie,
    coverIdx: 20,
    attachedIdx: [4, -3],
    faqs: [
      {
        question: "Le test est-il obligatoire pour MaPrimeRénov' ?",
        answer:
          "Pour le parcours travaux conduisant à un saut de deux classes, oui depuis le 1er janvier 2026.",
      },
    ],
    status: "archived",
    createdDaysAgo: 95,
    publishedDaysAgo: 93,
    readingMinutes: 6,
  },
  // ---------- 4 drafts + 2 archives ----------
  {
    id: ART[15],
    title:
      "PAC hybride gaz : le dernier souffle des chaudières condensation ?",
    slug: "pac-hybride-gaz-derniere-chance",
    seoExcerpt:
      "Bouquet PAC + chaudière à condensation : un compromis transitoire qui s'effrite à mesure que les seuils CO2 se durcissent.",
    metaDescription:
      "PAC hybride couplée à une chaudière gaz à condensation : pertinence en 2026, coût et perspectives réglementaires.",
    metaKeywords: ["pac hybride", "chaudière gaz", "condensation", "transition", "chauffage"],
    contentHtml: `
<p>Brouillon en cours d'écriture — interviews à compléter sur trois cas chantier, et données d'exploitation à confirmer auprès de l'AFPG.</p>
<h2>Plan provisoire</h2>
<ul>
  <li>Définition d'une PAC hybride et schéma type ;</li>
  <li>Pertinence en climat continental ;</li>
  <li>Bouquet d'aides 2026 ;</li>
  <li>Horizon réglementaire (interdiction gaz fossile résidentiel ?).</li>
</ul>
`.trim(),
    categoryId: CAT.pompes,
    authorId: AUT.lea,
    coverIdx: 24,
    attachedIdx: [],
    faqs: [],
    status: "draft",
    createdDaysAgo: 4,
    publishedDaysAgo: null,
    readingMinutes: 1,
  },
  {
    id: ART[16],
    title:
      "Murs en pisé : isoler sans tuer la respiration du bâti ancien",
    slug: "pise-isoler-sans-tuer-respiration-bati",
    seoExcerpt:
      "Pisé, bauge, torchis : les isolants compatibles, les pièges hygriques, et les six chantiers en cours d'analyse.",
    metaDescription:
      "Isolation du pisé en rénovation patrimoniale : isolants compatibles, hygrothermie, retours de chantier.",
    metaKeywords: ["pisé", "bâti ancien", "isolation biosourcée", "hygrothermie", "patrimoine"],
    contentHtml: `
<p>Brouillon. Bibliographie en cours, à compléter avec Sophie Berthier sur le volet retours de chantier. Cible publication mi-juin.</p>
<h2>Pré-plan</h2>
<p>Pourquoi le pisé exige des isolants ouverts à la vapeur. Cas pratiques. Tableau Sd / lambda.</p>
`.trim(),
    categoryId: CAT.isolation,
    authorId: AUT.sophie,
    coverIdx: 16,
    attachedIdx: [],
    faqs: [],
    status: "draft",
    createdDaysAgo: 6,
    publishedDaysAgo: null,
    readingMinutes: 1,
  },
  {
    id: ART[17],
    title:
      "Solaire thermique : pourquoi a-t-il (presque) disparu des bouquets ?",
    slug: "solaire-thermique-pourquoi-disparu",
    seoExcerpt:
      "L'eau chaude solaire reste pertinente, mais la concurrence du photovoltaïque + ballon thermodynamique l'écrase. Analyse.",
    metaDescription:
      "Solaire thermique en 2026 : pertinence économique face au photovoltaïque + ballon thermodynamique, bilan détaillé.",
    metaKeywords: ["solaire thermique", "ecs", "ballon thermodynamique", "photovoltaïque", "rénovation"],
    contentHtml: `
<p>Brouillon. À chiffrer plus précisément sur cinq installations exemplaires, et croiser avec données SOCOL.</p>
`.trim(),
    categoryId: CAT.solaire,
    authorId: AUT.yann,
    coverIdx: 7,
    attachedIdx: [],
    faqs: [],
    status: "draft",
    createdDaysAgo: 3,
    publishedDaysAgo: null,
    readingMinutes: 1,
  },
  {
    id: ART[18],
    title:
      "Aides locales 2026 : la carte interactive des régions et métropoles",
    slug: "aides-locales-2026-carte-interactive",
    seoExcerpt:
      "Plus de 320 dispositifs recensés à fin avril. Choisir le bon, le cumuler, et anticiper les délais d'instruction.",
    metaDescription:
      "Aides locales à la rénovation 2026 : régions, métropoles, communes — cumul, plafonds et délais d'instruction.",
    metaKeywords: ["aides locales", "région", "métropole", "rénovation", "subvention"],
    contentHtml: `
<p>Brouillon. La carte interactive doit attendre la mise à jour du fond cartographique. Texte à finaliser après stabilisation des sources.</p>
`.trim(),
    categoryId: CAT.aides,
    authorId: AUT.theo,
    coverIdx: 11,
    attachedIdx: [],
    faqs: [],
    status: "draft",
    createdDaysAgo: 2,
    publishedDaysAgo: null,
    readingMinutes: 1,
  },
  {
    id: ART[19],
    title:
      "Chaudière à granulés : l'engouement de 2023 à l'épreuve du marché 2026",
    slug: "chaudiere-granules-engouement-2023-marche-2026",
    seoExcerpt:
      "Trois ans après le pic de subventions, on a rappelé 90 ménages équipés. Retour sur expérience, satisfaction et SAV.",
    metaDescription:
      "Chaudière à granulés : retour sur expérience à trois ans, satisfaction, SAV, prix du combustible et perspectives.",
    metaKeywords: ["chaudière granulés", "biomasse", "rénovation", "retour expérience", "pellets"],
    contentHtml: `
<p>Article archivé : la grille MaPrimeRénov' 2026 a profondément modifié l'équation, rendant les conclusions de 2024 partiellement obsolètes. Voir la nouvelle version (publication juin 2026).</p>
<h2>Pourquoi cet article est archivé</h2>
<p>La prime granulés 2026 a été abaissée de 40 %, et l'évolution du prix du pellet (+18 % YoY) remet en cause les retours sur investissement annoncés. Nous re-publierons une version actualisée d'ici juin.</p>
<h2>Conclusions de 2023, pour archive</h2>
<p>Sur l'échantillon initial : 81 % de satisfaction, SAV rapide en première année, consommations conformes aux prévisions à 8 % près. Voir la version archivée pour le détail.</p>
`.trim(),
    categoryId: CAT.actualites,
    authorId: AUT.karim,
    coverIdx: 12,
    attachedIdx: [],
    faqs: [
      {
        question: "Une nouvelle version est-elle prévue ?",
        answer:
          "Oui, en juin 2026. Le panel sera élargi à 120 ménages et la grille tarifaire 2026 intégrée.",
      },
    ],
    status: "archived",
    createdDaysAgo: 120,
    publishedDaysAgo: 118,
    readingMinutes: 5,
  },
];

function buildArticles(): Article[] {
  return ARTICLE_SEEDS.map((seed) => {
    const created = isoMinusDays(seed.createdDaysAgo, 8, seed.createdDaysAgo % 60);
    const updated = seed.publishedDaysAgo !== null
      ? isoMinusDays(seed.publishedDaysAgo, 10, 30)
      : created;
    const publishedAt = seed.publishedDaysAgo !== null
      ? isoMinusDays(seed.publishedDaysAgo, 9, 0)
      : null;

    const attachedMediaIds = seed.attachedIdx
      .map((idx) => (idx < 0 ? MED_PDF[-idx] : MED_IMG[idx]))
      .filter((v): v is string => typeof v === "string");

    return {
      id: seed.id,
      title: seed.title,
      slug: seed.slug,
      seoExcerpt: seed.seoExcerpt,
      metaDescription: seed.metaDescription,
      metaKeywords: seed.metaKeywords,
      contentHtml: seed.contentHtml,
      coverMediaId: MED_IMG[seed.coverIdx] ?? null,
      attachedMediaIds,
      readingMinutes: seed.readingMinutes,
      categoryId: seed.categoryId,
      authorId: seed.authorId,
      faqs: seed.faqs,
      status: seed.status,
      publishedAt,
      createdAt: created,
      updatedAt: updated,
    };
  });
}

// ---------------------------------------------------------------------------
// Contacts (12) — 5 unread / 4 handled / 3 archived
// ---------------------------------------------------------------------------
type ContactSeed = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "handled" | "archived";
  createdDaysAgo: number;
  handledDaysAgo: number | null;
  handledBy: string | null;
};

const CONTACT_SEEDS: ContactSeed[] = [
  {
    id: CON[0],
    name: "Sandrine Cottin",
    email: "sandrine.cottin@orange.fr",
    subject: "Question PAC air-eau et VMC double flux",
    message:
      "Bonjour, nous prévoyons de coupler une PAC air-eau et une VMC double flux dans une maison de 1970. L'audit thermique propose deux scénarios différents. Pouvez-vous nous orienter vers un guide qui compare ces deux pistes ? Merci d'avance.",
    status: "unread",
    createdDaysAgo: 1,
    handledDaysAgo: null,
    handledBy: null,
  },
  {
    id: CON[1],
    name: "Hugo Vannier",
    email: "h.vannier@laposte.net",
    subject: "Devis triple vitrage : retour d'expérience ?",
    message:
      "J'ai trois devis triple vitrage pour ma maison en zone littorale Atlantique. Le surcoût va du simple au double. Avez-vous un retour d'expérience sur la justification d'un Uw 0,8 dans ce contexte ?",
    status: "unread",
    createdDaysAgo: 2,
    handledDaysAgo: null,
    handledBy: null,
  },
  {
    id: CON[2],
    name: "Aïcha Benyamina",
    email: "aicha.benyamina@gmail.com",
    subject: "MaPrimeRénov' refusée — recours possible ?",
    message:
      "Mon dossier MaPrimeRénov' a été refusé pour un motif que je ne comprends pas (devis non conforme). L'artisan affirme que tout est en règle. Quels recours avez-vous déjà documentés ?",
    status: "unread",
    createdDaysAgo: 3,
    handledDaysAgo: null,
    handledBy: null,
  },
  {
    id: CON[3],
    name: "Bertrand Quéré",
    email: "b.quere@ouvaton.org",
    subject: "Question sur l'audit énergétique réglementaire",
    message:
      "Je cherche un auditeur RGE Études dans le Morbihan. Avez-vous une liste recommandée par votre rédaction ? Merci pour votre travail.",
    status: "unread",
    createdDaysAgo: 4,
    handledDaysAgo: null,
    handledBy: null,
  },
  {
    id: CON[4],
    name: "Lucie Pasquier",
    email: "lucie.pasquier@yahoo.fr",
    subject: "Proposition d'article invité — solaire collectif",
    message:
      "Bonjour, je travaille sur le déploiement du solaire collectif en copropriété et serais intéressée pour proposer un article ou une interview à votre rédaction. Merci de me dire si cela vous intéresse.",
    status: "unread",
    createdDaysAgo: 6,
    handledDaysAgo: null,
    handledBy: null,
  },
  {
    id: CON[5],
    name: "Pierre Cazes",
    email: "pierre.cazes@free.fr",
    subject: "Erratum article ouate de cellulose",
    message:
      "Dans votre article sur le match laine de bois vs ouate, le tableau de R semble inverser deux lignes. Avez-vous pu vérifier ? Bonne continuation.",
    status: "handled",
    createdDaysAgo: 8,
    handledDaysAgo: 5,
    handledBy: USR.editorMarie,
  },
  {
    id: CON[6],
    name: "Inès Faure",
    email: "ines.faure@cnrs.fr",
    subject: "Demande source — étude DPE 2026",
    message:
      "Bonjour, je travaille au CNRS sur le DPE. Pourriez-vous m'indiquer la source utilisée dans votre article du 6 mai concernant les 320 000 logements ?",
    status: "handled",
    createdDaysAgo: 10,
    handledDaysAgo: 7,
    handledBy: USR.editorThomas,
  },
  {
    id: CON[7],
    name: "Mohamed Ouadah",
    email: "mohamed.ouadah@gmail.com",
    subject: "Newsletter — bug d'inscription",
    message:
      "Le formulaire d'inscription à votre newsletter renvoie une erreur 500 ce matin. À toutes fins utiles.",
    status: "handled",
    createdDaysAgo: 13,
    handledDaysAgo: 12,
    handledBy: USR.admin,
  },
  {
    id: CON[8],
    name: "Caroline Mainier",
    email: "c.mainier@hotmail.fr",
    subject: "Recommandation auditeur RGE Études",
    message:
      "Bonjour, suite à votre dossier audit, je cherche un auditeur en Loire-Atlantique. Avez-vous une recommandation ? Merci.",
    status: "handled",
    createdDaysAgo: 16,
    handledDaysAgo: 14,
    handledBy: USR.editorMarie,
  },
  {
    id: CON[9],
    name: "Patrick Salembier",
    email: "patrick.salembier@orange.fr",
    subject: "Propose de tester votre comparateur",
    message:
      "Bonjour, j'ai testé votre nouveau comparateur de PAC et trouvé deux modèles obsolètes encore listés. Je vous mets le détail en PJ — supprimés du registre Eurovent en 2024.",
    status: "archived",
    createdDaysAgo: 20,
    handledDaysAgo: 18,
    handledBy: USR.editorThomas,
  },
  {
    id: CON[10],
    name: "Élodie Renard",
    email: "elodie.renard@gmail.com",
    subject: "Mauvaise URL dans la newsletter du 18 avril",
    message:
      "Bonjour, le lien vers l'article RE2026 dans la newsletter du 18 avril renvoie en 404. Merci de corriger.",
    status: "archived",
    createdDaysAgo: 24,
    handledDaysAgo: 22,
    handledBy: USR.admin,
  },
  {
    id: CON[11],
    name: "Damien Touré",
    email: "damien.toure@gmail.com",
    subject: "Demande de partenariat éditorial",
    message:
      "Bonjour, je représente un éditeur spécialisé en cahiers techniques rénovation. Pouvons-nous échanger sur un partenariat ?",
    status: "archived",
    createdDaysAgo: 28,
    handledDaysAgo: 25,
    handledBy: USR.admin,
  },
];

function buildContacts(): ContactSubmission[] {
  return CONTACT_SEEDS.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    subject: s.subject,
    message: s.message,
    status: s.status,
    createdAt: isoMinusDays(s.createdDaysAgo, 14, s.createdDaysAgo % 60),
    handledAt: s.handledDaysAgo !== null ? isoMinusDays(s.handledDaysAgo, 16, 0) : null,
    handledByUserId: s.handledBy,
  }));
}

// ---------------------------------------------------------------------------
export function buildSeed(): Snapshot {
  return {
    version: 1,
    categories: CATEGORIES,
    articles: buildArticles(),
    authors: AUTHORS,
    users: USERS,
    medias: buildMedias(),
    contacts: buildContacts(),
  };
}
