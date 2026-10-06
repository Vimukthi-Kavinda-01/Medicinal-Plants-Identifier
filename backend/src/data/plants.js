'use strict';

/**
 * Digital herbarium – curated reference records for medicinal plants.
 *
 * `features` hold the accepted answers for the rule-based verification
 * questions (see services/ruleEngine.js). A plant may accept several values
 * for one feature when it varies naturally.
 *
 * `lookalikes` are hand-written comparisons used by the "similar plants" step.
 *
 * Educational use only – not medical advice.
 */
const PLANTS = [
  {
    id: 'aloe-vera',
    name: 'Aloe Vera',
       aliases: ['aloe', 'aloe barbadensis', 'aloe barbadensis miller', 'aleovera'],
    scientificName: 'Aloe barbadensis miller',
    family: 'Asphodelaceae',
    medicinalUses:
      'Soothes burns and sunburns, skin hydration, anti-inflammatory properties, digestive health support.',
    activeCompounds: 'Aloin, Acemannan, Polysaccharides, Vitamins A, C, and E',
    habitat: 'Tropical and arid climates; native to the Arabian Peninsula and widely cultivated.',
    precautions:
      'Oral consumption of unprocessed latex can cause abdominal cramps. Consult healthcare professionals before ingesting.',
    features: {
      leafArrangement: ['basal'],
      leafShape: ['fleshy'],
      scent: ['none'],
      growthHabit: ['succulent'],
    },
    lookalikes: [],
  },
  {
    id: 'neem',
    name: 'Neem',
    aliases: ['azadirachta indica', 'margosa', 'kohomba'],
    scientificName: 'Azadirachta indica',
    family: 'Meliaceae',
    medicinalUses:
      'Potent antimicrobial, antifungal, blood purifier, traditional dental hygiene, acne treatment.',
    activeCompounds: 'Nimbin, Nimbidin, Azadirachtin, Quercetin',
    habitat: 'Dry and tropical regions; native to the Indian subcontinent.',
    precautions: 'Excessive internal use not recommended for children or pregnant individuals.',
    features: {
      leafArrangement: ['alternate'],
      leafShape: ['compound'],
      scent: ['pungent'],
      growthHabit: ['tree'],
    },
    lookalikes: [
      {
        id: 'moringa',
        tip: 'Neem leaflets have serrated edges and a bitter, pungent smell; moringa leaflets are small, rounded and smooth-edged.',
      },
      {
        id: 'curry-leaf',
        tip: 'Curry leaf leaflets are smooth-edged and give a strong curry aroma when crushed; neem leaflets are toothed.',
      },
    ],
  },
  {
    id: 'tulsi',
    name: 'Tulsi',
    aliases: ['holy basil', 'ocimum tenuiflorum', 'ocimum sanctum', 'sacred basil'],
    scientificName: 'Ocimum tenuiflorum (Holy Basil)',
    family: 'Lamiaceae',
    medicinalUses:
      'Powerful adaptogen, immune booster, respiratory relief (cough, cold, asthma), stress reduction.',
    activeCompounds: 'Eugenol, Ursolic acid, Rosmarinic acid, Caryophyllene',
    habitat: 'Warm tropical and subtropical climates; revered across South and Southeast Asia.',
    precautions:
      'May have mild blood-thinning effects; use cautiously alongside anti-coagulant medications.',
    features: {
      leafArrangement: ['opposite'],
      leafShape: ['oval'],
      scent: ['spicy'],
      growthHabit: ['herb', 'shrub'],
    },
    lookalikes: [
      {
        id: 'peppermint',
        tip: 'Crush a leaf: peppermint smells cool and menthol-like, tulsi smells warm and clove-like. Tulsi stems are often purplish and hairy.',
      },
    ],
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    aliases: ['curcuma longa', 'curcuma', 'kaha', 'haldi'],
    scientificName: 'Curcuma longa',
    family: 'Zingiberaceae',
    medicinalUses:
      'Renowned anti-inflammatory, powerful antioxidant, joint relief, cognitive support, wound healing.',
    activeCompounds: 'Curcumin, Demethoxycurcumin, Curcuminoids, Tumerone',
    habitat: 'Warm, humid climates with heavy rainfall; native to South Asia.',
    precautions:
      'Very high doses may cause mild stomach irritation; enhances absorption when taken with black pepper.',
    features: {
      leafArrangement: ['basal'],
      leafShape: ['lanceolate'],
      scent: ['spicy'],
      growthHabit: ['herb'],
    },
    lookalikes: [
      {
        id: 'ginger',
        tip: 'Dig a little of the rhizome: turmeric is bright orange inside, ginger is pale yellow. Turmeric leaves are broader.',
      },
    ],
  },
  {
    id: 'ginger',
    name: 'Ginger',
    aliases: ['zingiber officinale', 'inguru'],
    scientificName: 'Zingiber officinale',
    family: 'Zingiberaceae',
    medicinalUses:
      'Eases motion sickness and nausea, promotes digestion, reduces systemic inflammation, relieves sore throat.',
    activeCompounds: 'Gingerols, Shogaols, Zingerone, Paradols',
    habitat: 'Tropical and subtropical forest understories; widely cultivated.',
    precautions:
      'Can increase bile production; consult physician if dealing with active gallstones.',
    features: {
      leafArrangement: ['alternate'],
      leafShape: ['lanceolate'],
      scent: ['spicy'],
      growthHabit: ['herb'],
    },
    lookalikes: [
      {
        id: 'turmeric',
        tip: 'Ginger rhizome is pale yellow inside with a sharp, peppery smell; turmeric is deep orange.',
      },
    ],
  },
  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    aliases: ['withania somnifera', 'withania', 'indian ginseng', 'winter cherry'],
    scientificName: 'Withania somnifera (Indian Ginseng)',
    family: 'Solanaceae',
    medicinalUses:
      'Adaptogen for chronic stress and adrenal fatigue, restful sleep aid, physical vitality and focus.',
    activeCompounds: 'Withanolides, Withaferin A, Alkaloids, Saponins',
    habitat: 'Dry stony areas of India, the Middle East, and parts of Africa.',
    precautions: 'Not recommended during pregnancy; may increase thyroid hormone activity.',
    features: {
      leafArrangement: ['alternate'],
      leafShape: ['oval'],
      scent: ['none'],
      growthHabit: ['shrub'],
    },
    lookalikes: [],
  },
  {
    id: 'brahmi',
    name: 'Brahmi',
    aliases: ['bacopa monnieri', 'bacopa', 'water hyssop', 'lunuwila'],
    scientificName: 'Bacopa monnieri',
    family: 'Plantaginaceae',
    medicinalUses:
      'Nootropic memory booster, cognitive clarity, neuroprotective antioxidant, anxiety and tension relief.',
    activeCompounds: 'Bacosides A and B, Hersaponin, Betulinic acid',
    habitat: 'Wetlands, shallow waters, and marshy environments across warm climates.',
    precautions: 'Take with food or healthy fats to avoid mild digestive upset or dry mouth.',
    features: {
      leafArrangement: ['opposite'],
      leafShape: ['oval'],
      scent: ['none'],
      growthHabit: ['creeping'],
    },
    lookalikes: [
      {
        id: 'gotu-kola',
        tip: 'Brahmi has small, thick, fleshy oval leaves in opposite pairs; gotu kola has round to kidney-shaped leaves with scalloped edges on long stalks.',
      },
    ],
  },
  {
    id: 'moringa',
    name: 'Moringa',
    aliases: ['moringa oleifera', 'drumstick tree', 'drumstick', 'murunga'],
    scientificName: 'Moringa oleifera (Drumstick Tree)',
    family: 'Moringaceae',
    medicinalUses:
      'Nutrient-dense superfood, helps regulate blood sugar and cholesterol, combats free radical damage.',
    activeCompounds: 'Isothiocyanates, Quercetin, Chlorogenic acid, Beta-sitosterol',
    habitat: 'Drought-resistant tropical and sub-Himalayan plains.',
    precautions: 'Bark and roots contain compounds to be avoided during pregnancy.',
    features: {
      leafArrangement: ['alternate'],
      leafShape: ['compound'],
      scent: ['none'],
      growthHabit: ['tree'],
    },
    lookalikes: [
      {
        id: 'neem',
        tip: 'Moringa leaflets are small, rounded and smooth-edged on a feathery leaf; neem leaflets are longer, pointed and toothed.',
      },
    ],
  },
  {
    id: 'gotu-kola',
    name: 'Gotu Kola',
    aliases: ['centella asiatica', 'centella', 'indian pennywort', 'asiatic pennywort', 'gotukola'],
    scientificName: 'Centella asiatica',
    family: 'Apiaceae',
    medicinalUses:
      'Improves venous circulation, enhances memory, promotes collagen synthesis, accelerates wound healing.',
    activeCompounds: 'Asiaticoside, Madecassoside, Asiatic acid, Triterpenoids',
    habitat: 'Tropical marshlands, moist paddy fields, and riverbanks.',
    precautions: 'Rarely causes sensitivity; avoid extremely high doses over extended periods.',
    features: {
      leafArrangement: ['basal'],
      leafShape: ['round'],
      scent: ['none'],
      growthHabit: ['creeping'],
    },
    lookalikes: [
      {
        id: 'brahmi',
        tip: 'Gotu kola leaves are round to kidney-shaped with scalloped edges; brahmi leaves are small, oval and fleshy.',
      },
    ],
  },
  {
    id: 'peppermint',
    name: 'Peppermint',
    aliases: ['mentha piperita', 'mentha', 'mint', 'mentha x piperita'],
    scientificName: 'Mentha × piperita',
    family: 'Lamiaceae',
    medicinalUses:
      'Soothes irritable bowel syndrome (IBS), eases tension headaches, clears nasal passages, aids digestion.',
    activeCompounds: 'Menthol, Menthone, Cineole, Limonene',
    habitat: 'Moist soils and stream borders in temperate regions worldwide.',
    precautions: 'Avoid applying pure essential oil directly to the face of small infants.',
    features: {
      leafArrangement: ['opposite'],
      leafShape: ['oval'],
      scent: ['minty'],
      growthHabit: ['herb', 'creeping'],
    },
    lookalikes: [
      {
        id: 'tulsi',
        tip: 'Peppermint smells strongly of menthol and has square stems with toothed leaves; tulsi smells warm and clove-like.',
      },
    ],
  },
  {
    id: 'lemongrass',
    name: 'Lemongrass',
    aliases: ['cymbopogon citratus', 'cymbopogon', 'lemon grass', 'sera'],
    scientificName: 'Cymbopogon citratus',
    family: 'Poaceae',
    medicinalUses:
      'Relieves digestive distress, antimicrobial, reduces fever, soothing herbal tea for calming tension.',
    activeCompounds: 'Citral, Geraniol, Myrcene, Linalool',
    habitat: 'Warm tropical and subtropical grasslands.',
    precautions: 'Generally safe in dietary amounts; concentrated oil must be diluted.',
    features: {
      leafArrangement: ['basal'],
      leafShape: ['grass'],
      scent: ['citrus'],
      growthHabit: ['grass'],
    },
    lookalikes: [],
  },
  {
    id: 'curry-leaf',
    name: 'Curry Leaf',
    aliases: ['murraya koenigii', 'curry leaves', 'curry tree', 'karapincha'],
    scientificName: 'Murraya koenigii',
    family: 'Rutaceae',
    medicinalUses:
      'Traditionally used to support digestion and as a flavouring herb; studied for antioxidant and blood-sugar effects.',
    activeCompounds: 'Mahanimbine, Girinimbine, Linalool, Carbazole alkaloids',
    habitat: 'Tropical and subtropical forests; native to India and Sri Lanka.',
    precautions:
      'Safe as a food in normal amounts; people taking blood-sugar-lowering medication should ask a clinician before using medicinal quantities.',
    features: {
      leafArrangement: ['alternate'],
      leafShape: ['compound'],
      scent: ['curry'],
      growthHabit: ['tree', 'shrub'],
    },
    lookalikes: [
      {
        id: 'neem',
        tip: 'Curry leaf smells strongly of curry when crushed and has smooth-edged leaflets; neem leaflets are toothed and pungent.',
      },
    ],
  },
];

module.exports = { PLANTS };