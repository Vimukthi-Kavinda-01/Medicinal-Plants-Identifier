/**
 * Curated knowledge base for medicinal plants.
 * Keys are normalized (lowercase, single spaces, trimmed).
 */
export const PLANT_KNOWLEDGE = {
  'aloe vera': {
    scientificName: 'Aloe barbadensis miller',
    family: 'Asphodelaceae',
    medicinalUses: 'Soothes burns and sunburns, skin hydration, anti-inflammatory properties, digestive health support.',
    activeCompounds: 'Aloin, Acemannan, Polysaccharides, Vitamins A, C, and E',
    habitat: 'Tropical and arid climates; native to the Mediterranean and Arabian Peninsula.',
    precautions: 'Oral consumption of unprocessed latex can cause abdominal cramps. Consult healthcare professionals before ingesting.',
  },
  'neem': {
    scientificName: 'Azadirachta indica',
    family: 'Meliaceae',
    medicinalUses: 'Potent antimicrobial, antifungal, blood purifier, traditional dental hygiene, acne treatment.',
    activeCompounds: 'Nimbin, Nimbidin, Azadirachtin, Quercetin',
    habitat: 'Dry and tropical regions; native to the Indian subcontinent.',
    precautions: 'Excessive internal use not recommended for children or pregnant individuals.',
  },
  'tulsi': {
    scientificName: 'Ocimum tenuiflorum (Holy Basil)',
    family: 'Lamiaceae',
    medicinalUses: 'Powerful adaptogen, immune booster, respiratory relief (cough, cold, asthma), stress reduction.',
    activeCompounds: 'Eugenol, Ursolic acid, Rosmarinic acid, Caryophyllene',
    habitat: 'Warm tropical and subtropical climates; revered across Southeast Asia.',
    precautions: 'May have mild blood-thinning effects; use cautiously alongside anti-coagulant medications.',
  },
  'turmeric': {
    scientificName: 'Curcuma longa',
    family: 'Zingiberaceae',
    medicinalUses: 'Renowned anti-inflammatory, powerful antioxidant, joint relief, cognitive support, wound healing.',
    activeCompounds: 'Curcumin, Demethoxycurcumin, Curcuminoids, Tumerone',
    habitat: 'Warm, humid climates with heavy rainfall; native to South Asia.',
    precautions: 'Very high doses may cause mild stomach irritation; enhances absorption when taken with black pepper.',
  },
  'ginger': {
    scientificName: 'Zingiber officinale',
    family: 'Zingiberaceae',
    medicinalUses: 'Eases motion sickness and nausea, promotes digestion, reduces systemic inflammation, relieves sore throat.',
    activeCompounds: 'Gingerols, Shogaols, Zingerone, Paradols',
    habitat: 'Tropical and subtropical forest understories; widely cultivated.',
    precautions: 'Can increase bile production; consult physician if dealing with active gallstones.',
  },
  'ashwagandha': {
    scientificName: 'Withania somnifera (Indian Ginseng)',
    family: 'Solanaceae',
    medicinalUses: 'Adaptogen for chronic stress and adrenal fatigue, restful sleep aid, physical vitality and focus.',
    activeCompounds: 'Withanolides, Withaferin A, Alkaloids, Saponins',
    habitat: 'Dry stony areas of India, the Middle East, and parts of Africa.',
    precautions: 'Not recommended during pregnancy; may increase thyroid hormone activity.',
  },
  'brahmi': {
    scientificName: 'Bacopa monnieri',
    family: 'Plantaginaceae',
    medicinalUses: 'Nootropic memory booster, cognitive clarity, neuroprotective antioxidant, anxiety and tension relief.',
    activeCompounds: 'Bacosides A and B, Hersaponin, Betulinic acid',
    habitat: 'Wetlands, shallow waters, and marshy environments across warm climates.',
    precautions: 'Take with food or healthy fats to avoid mild digestive upset or dry mouth.',
  },
  'moringa': {
    scientificName: 'Moringa oleifera (Drumstick Tree)',
    family: 'Moringaceae',
    medicinalUses: 'Nutrient-dense superfood, helps regulate blood sugar and cholesterol, combats free radical damage.',
    activeCompounds: 'Isothiocyanates, Quercetin, Chlorogenic acid, Beta-sitosterol',
    habitat: 'Drought-resistant tropical and sub-Himalayan plains.',
    precautions: 'Bark and roots contain compounds to be avoided during pregnancy.',
  },
  'gotu kola': {
    scientificName: 'Centella asiatica',
    family: 'Apiaceae',
    medicinalUses: 'Improves venous circulation, enhances memory, promotes collagen synthesis, accelerates wound healing.',
    activeCompounds: 'Asiaticoside, Madecassoside, Asiatic acid, Triterpenoids',
    habitat: 'Tropical marshlands, moist paddy fields, and riverbanks.',
    precautions: 'Rarely causes sensitivity; avoid extremely high doses over extended periods.',
  },
  'peppermint': {
    scientificName: 'Mentha × piperita',
    family: 'Lamiaceae',
    medicinalUses: 'Soothes irritable bowel syndrome (IBS), eases tension headaches, clears nasal passages, aids digestion.',
    activeCompounds: 'Menthol, Menthone, Cineole, Limonene',
    habitat: 'Moist soils, stream borders in temperate regions worldwide.',
    precautions: 'Avoid applying pure essential oil directly to facial skin of small infants.',
  },
  'lemongrass': {
    scientificName: 'Cymbopogon citratus',
    family: 'Poaceae',
    medicinalUses: 'Relieves digestive distress, antimicrobial, reduces fever, soothing herbal tea for calming tension.',
    activeCompounds: 'Citral, Geraniol, Myrcene, Linalool',
    habitat: 'Warm tropical and subtropical grasslands.',
    precautions: 'Generally safe in dietary amounts; concentrated oil must be diluted.',
  },
};

/**
 * Normalizes a raw prediction label from Roboflow model.
 * E.g., "aloe_vera", "ALOE-VERA", "aloe vera plant" -> "Aloe Vera"
 */
export function formatPlantName(rawName) {
  if (!rawName) return 'Unknown Plant';
  return rawName
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Look up educational medicinal info for a plant label.
 */
export function getPlantInfo(rawName) {
  if (!rawName) return null;
  const normalizedKey = rawName.toLowerCase().replace(/[_-]+/g, ' ').trim();

  // Exact match
  if (PLANT_KNOWLEDGE[normalizedKey]) {
    return PLANT_KNOWLEDGE[normalizedKey];
  }

  // Partial match fallback (e.g. if model output is "aloe vera leaf")
  for (const [key, info] of Object.entries(PLANT_KNOWLEDGE)) {
    if (normalizedKey.includes(key) || key.includes(normalizedKey)) {
      return info;
    }
  }

  return null;
}

