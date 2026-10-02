-- ============================================================================
-- HerbSense: Initial Seed Data for Medicinal Plants
-- Source: frontend/src/lib/plantKnowledge.js (11 Curated Botanical Records)
-- ============================================================================

INSERT INTO plants (
    slug,
    common_name,
    scientific_name,
    family,
    medicinal_uses,
    active_compounds,
    habitat,
    precautions
)
VALUES
    (
        'aloe-vera',
        'Aloe Vera',
        'Aloe barbadensis miller',
        'Asphodelaceae',
        'Soothes burns and sunburns, skin hydration, anti-inflammatory properties, digestive health support.',
        'Aloin, Acemannan, Polysaccharides, Vitamins A, C, and E',
        'Tropical and arid climates; native to the Mediterranean and Arabian Peninsula.',
        'Oral consumption of unprocessed latex can cause abdominal cramps. Consult healthcare professionals before ingesting.'
    ),
    (
        'neem',
        'Neem',
        'Azadirachta indica',
        'Meliaceae',
        'Potent antimicrobial, antifungal, blood purifier, traditional dental hygiene, acne treatment.',
        'Nimbin, Nimbidin, Azadirachtin, Quercetin',
        'Dry and tropical regions; native to the Indian subcontinent.',
        'Excessive internal use not recommended for children or pregnant individuals.'
    ),
    (
        'tulsi',
        'Tulsi',
        'Ocimum tenuiflorum (Holy Basil)',
        'Lamiaceae',
        'Powerful adaptogen, immune booster, respiratory relief (cough, cold, asthma), stress reduction.',
        'Eugenol, Ursolic acid, Rosmarinic acid, Caryophyllene',
        'Warm tropical and subtropical climates; revered across Southeast Asia.',
        'May have mild blood-thinning effects; use cautiously alongside anti-coagulant medications.'
    ),
    (
        'turmeric',
        'Turmeric',
        'Curcuma longa',
        'Zingiberaceae',
        'Renowned anti-inflammatory, powerful antioxidant, joint relief, cognitive support, wound healing.',
        'Curcumin, Demethoxycurcumin, Curcuminoids, Tumerone',
        'Warm, humid climates with heavy rainfall; native to South Asia.',
        'Very high doses may cause mild stomach irritation; enhances absorption when taken with black pepper.'
    ),
    (
        'ginger',
        'Ginger',
        'Zingiber officinale',
        'Zingiberaceae',
        'Eases motion sickness and nausea, promotes digestion, reduces systemic inflammation, relieves sore throat.',
        'Gingerols, Shogaols, Zingerone, Paradols',
        'Tropical and subtropical forest understories; widely cultivated.',
        'Can increase bile production; consult physician if dealing with active gallstones.'
    ),
    (
        'ashwagandha',
        'Ashwagandha',
        'Withania somnifera (Indian Ginseng)',
        'Solanaceae',
        'Adaptogen for chronic stress and adrenal fatigue, restful sleep aid, physical vitality and focus.',
        'Withanolides, Withaferin A, Alkaloids, Saponins',
        'Dry stony areas of India, the Middle East, and parts of Africa.',
        'Not recommended during pregnancy; may increase thyroid hormone activity.'
    ),
    (
        'brahmi',
        'Brahmi',
        'Bacopa monnieri',
        'Plantaginaceae',
        'Nootropic memory booster, cognitive clarity, neuroprotective antioxidant, anxiety and tension relief.',
        'Bacosides A and B, Hersaponin, Betulinic acid',
        'Wetlands, shallow waters, and marshy environments across warm climates.',
        'Take with food or healthy fats to avoid mild digestive upset or dry mouth.'
    ),
    (
        'moringa',
        'Moringa',
        'Moringa oleifera (Drumstick Tree)',
        'Moringaceae',
        'Nutrient-dense superfood, helps regulate blood sugar and cholesterol, combats free radical damage.',
        'Isothiocyanates, Quercetin, Chlorogenic acid, Beta-sitosterol',
        'Drought-resistant tropical and sub-Himalayan plains.',
        'Bark and roots contain compounds to be avoided during pregnancy.'
    ),
    (
        'gotu-kola',
        'Gotu Kola',
        'Centella asiatica',
        'Apiaceae',
        'Improves venous circulation, enhances memory, promotes collagen synthesis, accelerates wound healing.',
        'Asiaticoside, Madecassoside, Asiatic acid, Triterpenoids',
        'Tropical marshlands, moist paddy fields, and riverbanks.',
        'Rarely causes sensitivity; avoid extremely high doses over extended periods.'
    ),
    (
        'peppermint',
        'Peppermint',
        'Mentha × piperita',
        'Lamiaceae',
        'Soothes irritable bowel syndrome (IBS), eases tension headaches, clears nasal passages, aids digestion.',
        'Menthol, Menthone, Cineole, Limonene',
        'Moist soils, stream borders in temperate regions worldwide.',
        'Avoid applying pure essential oil directly to facial skin of small infants.'
    ),
    (
        'lemongrass',
        'Lemongrass',
        'Cymbopogon citratus',
        'Poaceae',
        'Relieves digestive distress, antimicrobial, reduces fever, soothing herbal tea for calming tension.',
        'Citral, Geraniol, Myrcene, Linalool',
        'Warm tropical and subtropical grasslands.',
        'Generally safe in dietary amounts; concentrated oil must be diluted.'
    )
ON CONFLICT (slug) DO UPDATE SET
    common_name = EXCLUDED.common_name,
    scientific_name = EXCLUDED.scientific_name,
    family = EXCLUDED.family,
    medicinal_uses = EXCLUDED.medicinal_uses,
    active_compounds = EXCLUDED.active_compounds,
    habitat = EXCLUDED.habitat,
    precautions = EXCLUDED.precautions;
