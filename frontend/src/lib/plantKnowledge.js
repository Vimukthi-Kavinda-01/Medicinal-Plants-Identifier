/**
 * Curated knowledge base for medicinal plants.
 * Keys are normalized (lowercase, single spaces, trimmed).
 */
export const PLANT_KNOWLEDGE = {
  // 1. Aloe Vera (Aleovera)
  'aloe vera': {
    scientificName: 'Aloe barbadensis miller',
    family: 'Asphodelaceae',
    medicinalUses: 'Accelerates thermal burn and wound healing, deeply hydrates dermal layers, soothes skin inflammation, and supports digestive mucosa.',
    activeCompounds: 'Aloin, Acemannan, Polysaccharides, Anthraquinones, Vitamins A, C, and E',
    habitat: 'Arid, tropical, and subtropical regions worldwide; drought-tolerant succulent.',
    precautions: 'Oral ingestion of unprocessed yellow latex can cause severe abdominal cramping and electrolyte imbalance. Avoid during pregnancy.',
  },
  'aleovera': {
    scientificName: 'Aloe barbadensis miller',
    family: 'Asphodelaceae',
    medicinalUses: 'Accelerates thermal burn and wound healing, deeply hydrates dermal layers, soothes skin inflammation, and supports digestive mucosa.',
    activeCompounds: 'Aloin, Acemannan, Polysaccharides, Anthraquinones, Vitamins A, C, and E',
    habitat: 'Arid, tropical, and subtropical regions worldwide; drought-tolerant succulent.',
    precautions: 'Oral ingestion of unprocessed yellow latex can cause severe abdominal cramping and electrolyte imbalance. Avoid during pregnancy.',
  },

  // 2. Artemisia (artamisa)
  'artamisa': {
    scientificName: 'Artemisia annua / Artemisia vulgaris',
    family: 'Asteraceae',
    medicinalUses: 'Source of Nobel-prize winning antimalarial artemisinin; reduces periodic fevers, relieves gastrointestinal cramps, and stimulates bile secretion.',
    activeCompounds: 'Artemisinin, Thujone, Sesquiterpene lactones, Flavonoids, Cineole',
    habitat: 'Temperate to subtropical regions, roadsides, disturbed soils, and open sunny hillsides.',
    precautions: 'Contains neuroactive thujone; contraindicated during pregnancy and lactation. Prolonged high-dose internal use is unsafe.',
  },
  'artemisia': {
    scientificName: 'Artemisia annua / Artemisia vulgaris',
    family: 'Asteraceae',
    medicinalUses: 'Source of Nobel-prize winning antimalarial artemisinin; reduces periodic fevers, relieves gastrointestinal cramps, and stimulates bile secretion.',
    activeCompounds: 'Artemisinin, Thujone, Sesquiterpene lactones, Flavonoids, Cineole',
    habitat: 'Temperate to subtropical regions, roadsides, disturbed soils, and open sunny hillsides.',
    precautions: 'Contains neuroactive thujone; contraindicated during pregnancy and lactation. Prolonged high-dose internal use is unsafe.',
  },

  // 3. Ashoka
  'ashoka': {
    scientificName: 'Saraca asoca',
    family: 'Fabaceae',
    medicinalUses: 'Premier Ayurvedic uterine tonic; manages menorrhagia, eases dysmenorrhea, reduces pelvic inflammation, and stabilizes menstrual rhythm.',
    activeCompounds: 'Saracin, Catechol, Tannins, Phytosterols, Ketosterol, Leucopelargonidin',
    habitat: 'Rainforests and sacred river valleys of the Indian subcontinent and Southeast Asia.',
    precautions: 'Influences uterine muscle tone and hormonal balance; contraindicated during pregnancy without qualified Ayurvedic oversight.',
  },

  // 4. Ashwagandha
  'ashwagandha': {
    scientificName: 'Withania somnifera (Indian Ginseng)',
    family: 'Solanaceae',
    medicinalUses: 'Powerful adaptogen; mitigates chronic cortisol stress, relieves insomnia, enhances endurance, and confers neuroprotective support.',
    activeCompounds: 'Withanolides, Withaferin A, Somniferine, Alkaloids, Saponins',
    habitat: 'Dry stony soils and semi-arid subtropical regions of South Asia and North Africa.',
    precautions: 'May increase thyroid hormone production; avoid during pregnancy and exercise caution in autoimmune disorders.',
  },

  // 5. Avocado (Avacado)
  'avacado': {
    scientificName: 'Persea americana',
    family: 'Lauraceae',
    medicinalUses: 'Leaf decoctions act as a mild hypotensive and diuretic; eases inflammatory joint stiffness and relieves bronchial spasms.',
    activeCompounds: 'Persin, Quercetin, Kaempferol, Monounsaturated fatty acids, Phytosterols',
    habitat: 'Humid subtropical and tropical highlands, native to Mesoamerica.',
    precautions: 'Fresh leaves contain persin which is toxic to domestic pets and livestock; culinary human use of pulp and strained tea is safe.',
  },
  'avocado': {
    scientificName: 'Persea americana',
    family: 'Lauraceae',
    medicinalUses: 'Leaf decoctions act as a mild hypotensive and diuretic; eases inflammatory joint stiffness and relieves bronchial spasms.',
    activeCompounds: 'Persin, Quercetin, Kaempferol, Monounsaturated fatty acids, Phytosterols',
    habitat: 'Humid subtropical and tropical highlands, native to Mesoamerica.',
    precautions: 'Fresh leaves contain persin which is toxic to domestic pets and livestock; culinary human use of pulp and strained tea is safe.',
  },

  // 6. Bamboo
  'bamboo': {
    scientificName: 'Bambusa vulgaris / Bambusa arundinacea',
    family: 'Poaceae',
    medicinalUses: 'Young shoot and leaf teas supply natural organic silica (Tabasheer) for collagen, cartilage, and bone health; cools fevers and aids detox.',
    activeCompounds: 'Bioactive Silica, Flavonoids, Phenolic acids, Choline, Betaine',
    habitat: 'Moist tropical riverbanks, rainforest understories, and moist hillsides.',
    precautions: 'Raw bamboo shoots contain poisonous cyanogenic glycosides and must always be thoroughly peeled and boiled before eating.',
  },

  // 7. Betel Leaf
  'betel leaf': {
    scientificName: 'Piper betle (Bulath)',
    family: 'Piperaceae',
    medicinalUses: 'Potent oral antiseptic and carminative; warm leaf poultices relieve bronchial chest congestion, eliminate oral bacteria, and soothe sore throats.',
    activeCompounds: 'Chavibetol, Eugenol, Hydroxychavicol, Caryophyllene, Betel-phenol',
    habitat: 'Warm, humid shaded forests and tropical gardens across South and Southeast Asia.',
    precautions: 'Chewing with areca nut and slaked lime is carcinogenic; use only as isolated herbal decoction, essential rinse, or topical poultice.',
  },

  // 8. Bitter Melon Leaf
  'bitter melon leaf': {
    scientificName: 'Momordica charantia (Karawila)',
    family: 'Cucurbitaceae',
    medicinalUses: 'Proven hypoglycemic herb; stimulates pancreatic insulin release, detoxifies hepatic tissue, expels intestinal parasites, and cleanses blood.',
    activeCompounds: 'Charantin, Vicine, Polypeptide-p, Momordicins, Cucurbitane triterpenoids',
    habitat: 'Tropical lowlands and cultivated gardens across Asia, Africa, and the Caribbean.',
    precautions: 'May induce severe hypoglycemia when taken alongside prescription diabetes medication; contraindicated during pregnancy.',
  },

  // 9. Boat Lily (boat lily)
  'boat lily': {
    scientificName: 'Tradescantia spathacea (Rhoeo discolor)',
    family: 'Commelinaceae',
    medicinalUses: 'Traditional floral and leaf decoctions soothe acute cough, bronchitis, dysentery, hemoptysis, and cool systemic internal heat.',
    activeCompounds: 'Anthocyanins, Flavonoids, Steroidal saponins, Terpenoids, Phenolic acids',
    habitat: 'Tropical limestone woodlands and ornamental shaded gardens.',
    precautions: 'Clear sap contains sharp calcium oxalate raphides that provoke contact dermatitis and mouth burning upon contact.',
  },

  // 10. Brahmi
  'brahmi': {
    scientificName: 'Bacopa monnieri (Water Hyssop)',
    family: 'Plantaginaceae',
    medicinalUses: 'Premier nootropic brain tonic; enhances memory retention and synaptic transmission, reduces anxiety, and shields brain cells from oxidative decay.',
    activeCompounds: 'Bacosides A and B, Hersaponin, Betulinic acid, D-mannitol',
    habitat: 'Wetlands, marshy borders, and warm tropical shallow waterways.',
    precautions: 'Consume with meals or healthy fats to avoid mild gastrointestinal cramps or dryness of the mouth.',
  },

  // 11. Candelabra Spurge
  'candelabra spurge': {
    scientificName: 'Euphorbia lactea / Euphorbia candelabrum',
    family: 'Euphorbiaceae',
    medicinalUses: 'Folk external escharotic remedy for cauterizing warts and cutaneous lesions; extracts investigated for bioactive antimicrobial diterpenoids.',
    activeCompounds: 'Ingenol esters, Phorbol esters, Diterpenes, Euphorbin',
    habitat: 'Arid tropical scrublands, rocky bluffs, and xerophytic gardens.',
    precautions: 'CAUTION: Acrid milky latex is intensely caustic. Causes severe skin blistering and permanent eye cornea damage. Never ingest.',
  },

  // 12. Cassava
  'cassava': {
    scientificName: 'Manihot esculenta (Manyokka)',
    family: 'Euphorbiaceae',
    medicinalUses: 'Cooked leaves are highly nutritious, providing iron, protein, and beta-carotene; pounded leaf compresses ease fevers and headaches.',
    activeCompounds: 'Linamarin, Lotaustralin, Rutin, Beta-carotene, Flavonoids',
    habitat: 'Lowland tropical agricultural zones and forest borders.',
    precautions: 'Raw leaves and roots contain deadly cyanogenic glycosides. Must be repeatedly washed, crushed, and fully cooked before ingestion.',
  },

  // 13. Castor
  'castor': {
    scientificName: 'Ricinus communis (Endaru)',
    family: 'Euphorbiaceae',
    medicinalUses: 'Topical castor oil packs stimulate lymphatic drainage, relieve arthritic pain, and soothe boils; leaves act as an anti-inflammatory poultice.',
    activeCompounds: 'Ricinoleic acid, Lupeol, Quercetin, Ricinine (in seeds)',
    habitat: 'Tropical river margins, disturbed wastelands, and roadside thickets.',
    precautions: 'LETHAL WARNING: Castor seeds contain ricin, a lethal ribosomal toxin. Only commercially processed, toxin-free castor oil is safe.',
  },

  // 14. Climbing Ylang-Ylang
  'climbing ylang ylang': {
    scientificName: 'Artabotrys hexapetalus (Manorangitham)',
    family: 'Annonaceae',
    medicinalUses: 'Aromatic leaves and root decoctions serve as traditional antipyretic remedies for cholera, malarial chills, scrofula, and inflammatory cardiac spasms.',
    activeCompounds: 'Artabotrine, Isoquinoline alkaloids, Monoterpenes, Sesquiterpenes, Flavonoids',
    habitat: 'Tropical rainforests, thickets, and garden trellises of South and Southeast Asia.',
    precautions: 'Rich in potent alkaloids; therapeutic use requires careful dosage control. Avoid during pregnancy.',
  },

  // 15. Coconut Leaf
  'coconut leaf': {
    scientificName: 'Cocos nucifera (Pol)',
    family: 'Arecaceae',
    medicinalUses: 'Astringent leaf and root decoctions provide an effective oral rinse for bleeding gums, soothe diarrhea, and lower fevers in coastal folk medicine.',
    activeCompounds: 'Condensed Tannins, Gallic acid, Epicatechin, Polysaccharides, Phenolics',
    habitat: 'Coastal tropical shorelines and sandy lowland agricultural soils.',
    precautions: 'Astringent and high in tannins; safe as a strained aqueous herbal tea or topical mouth rinse.',
  },

  // 16. Five-Leaved Chaste Tree
  'five leaved chaste tree': {
    scientificName: 'Vitex negundo (Nika / Nirgundi)',
    family: 'Lamiaceae',
    medicinalUses: 'Celebrated anti-inflammatory and analgesic; warm leaf steam compresses treat severe arthritis, sciatica, bronchitis, and catarrhal headache.',
    activeCompounds: 'Negundoside, Nishindine, Casticin, Luteolin, Betulinic acid',
    habitat: 'Tropical watercourses, scrub jungle margins, and rural village hedges.',
    precautions: 'May interact with hormonal and endocrine therapies due to mild progesterone-modulating properties.',
  },

  // 17. Guava
  'guava': {
    scientificName: 'Psidium guajava (Pera)',
    family: 'Myrtaceae',
    medicinalUses: 'Young leaf tea is a premier remedy for acute gastroenteritis, diarrhea, toothache, and postprandial blood sugar regulation.',
    activeCompounds: 'Quercetin, Guajaverin, Tannins, Caryophyllene, Ursolic acid',
    habitat: 'Tropical and subtropical orchards, gardens, and fertile river plains.',
    precautions: 'High tannin levels can cause mild constipation if consumed in excessively large quantities over extended periods.',
  },

  // 18. Heart-leaved Moonseed
  'heart leaved moonseed': {
    scientificName: 'Tinospora cordifolia (Guduchi / Giloy / Rasakinda)',
    family: 'Menispermaceae',
    medicinalUses: 'Supreme immunomodulator (Amrita); boosts white blood cell defense, rejuvenates liver tissue, purifies blood, and controls chronic recurring fevers.',
    activeCompounds: 'Tinosporide, Cordifolioside, Berberine, Giloin, Arabinogalactan',
    habitat: 'Tropical deciduous forests climbing across high canopies.',
    precautions: 'Hypoglycemic actions may enhance the effect of diabetic drugs; monitor glucose levels if medicated.',
  },

  // 19. Indian Borage
  'indian borage': {
    scientificName: 'Plectranthus amboinicus (Mexican Mint / Kapparawalliya)',
    family: 'Lamiaceae',
    medicinalUses: 'Renowned aromatic succulent for pediatric respiratory congestion, cough, asthma, bronchitis, and soothing insect bites and indigestion.',
    activeCompounds: 'Carvacrol, Thymol, Caryophyllene, Rosmarinic acid, Cirsimaritin',
    habitat: 'Moist tropical home gardens, rockeries, and partially shaded borders.',
    precautions: 'Safe in culinary and standard tea amounts; concentrated essential extracts may irritate sensitive gastric linings.',
  },

  // 20. Indian Gooseberry
  'indian gooseberry': {
    scientificName: 'Phyllanthus emblica (Amla / Nelli)',
    family: 'Phyllanthaceae',
    medicinalUses: 'Core ingredient of Triphala; exceptionally rich in stable vitamin C and polyphenols; protects gastric lining, restores liver cells, and stimulates hair growth.',
    activeCompounds: 'Emblicanin A and B, Punigluconin, Gallic acid, Ellagic acid, Chebulic acid',
    habitat: 'Tropical deciduous and dry scrub forests of South Asia.',
    precautions: 'May aggravate hyperacidity if consumed in concentrated form on an empty stomach due to natural sour acidity.',
  },

  // 21. Lemon
  'lemon': {
    scientificName: 'Citrus limon (Dehi)',
    family: 'Rutaceae',
    medicinalUses: 'Leaves and peels yield therapeutic volatile oils that dispel nausea, reduce phlegm, provide antimicrobial bioflavonoids, and strengthen capillary walls.',
    activeCompounds: 'D-Limonene, Citric acid, Hesperidin, Eriocitrin, Vitamin C',
    habitat: 'Subtropical and Mediterranean climates with well-drained fertile loam.',
    precautions: 'Direct topical application of citrus oils followed by sun exposure causes phytophotodermatitis skin pigmentation.',
  },

  // 22. Lemon grass
  'lemon grass': {
    scientificName: 'Cymbopogon citratus (Sera)',
    family: 'Poaceae',
    medicinalUses: 'Alleviates gastrointestinal cramps and nausea, stimulates diaphoretic fever reduction, halts fungal overgrowth, and eases stress.',
    activeCompounds: 'Citral (Geranial & Neral), Myrcene, Geraniol, Linalool, Isoorientin',
    habitat: 'Warm tropical grasslands and home herb gardens.',
    precautions: 'Always dilute concentrated lemongrass essential oil; avoid large therapeutic dosages during pregnancy.',
  },
  'lemongrass': {
    scientificName: 'Cymbopogon citratus (Sera)',
    family: 'Poaceae',
    medicinalUses: 'Alleviates gastrointestinal cramps and nausea, stimulates diaphoretic fever reduction, halts fungal overgrowth, and eases stress.',
    activeCompounds: 'Citral (Geranial & Neral), Myrcene, Geraniol, Linalool, Isoorientin',
    habitat: 'Warm tropical grasslands and home herb gardens.',
    precautions: 'Always dilute concentrated lemongrass essential oil; avoid large therapeutic dosages during pregnancy.',
  },

  // 23. Malabar Spinach
  'malabar spinach': {
    scientificName: 'Basella alba (Nivithi)',
    family: 'Basellaceae',
    medicinalUses: 'Cooling mucilaginous leaves relieve chronic constipation, heal gastric ulcers, soothe hemorrhoids, and cool skin burn poultices.',
    activeCompounds: 'Betacyanins, Mucilage polysaccharides, Kaempferol, Beta-carotene, Folate, Iron',
    habitat: 'Moist tropical and subtropical lowlands, river margins, and trellis gardens.',
    precautions: 'Contains soluble oxalates; individuals prone to calcium oxalate kidney stones should consume in moderation.',
  },

  // 24. Mango
  'mango': {
    scientificName: 'Mangifera indica (Amba)',
    family: 'Annonaceae',
    medicinalUses: 'Tender young leaf infusions help manage early-stage diabetes, vascular hypertension, varicose veins, respiratory asthma, and oral gum bleed.',
    activeCompounds: 'Mangiferin, Catechin, Tannins, Quercetin, Terpenoids',
    habitat: 'Tropical lowlands and fertile plains worldwide.',
    precautions: 'Mango tree resin and leaf trichomes contain urushiol-like allergens that can trigger dermatitis in hypersensitive individuals.',
  },

  // 25. Mint
  'mint': {
    scientificName: 'Mentha spicata / Mentha arvensis',
    family: 'Lamiaceae',
    medicinalUses: 'Relieves spastic irritable bowel symptoms, clears blocked nasal congestion, dispels flatulence, and freshens oral microbiota.',
    activeCompounds: 'Carvone, Menthol, Rosmarinic acid, Limonene, Diosmin',
    habitat: 'Moist soils, watercourses, and garden beds across temperate to tropical zones.',
    precautions: 'May relax lower esophageal sphincter; patients with active gastroesophageal reflux disease (GERD) should limit high intake.',
  },

  // 26. Moon Orchid
  'moon orchid': {
    scientificName: 'Phalaenopsis amabilis (Anggrek Bulan)',
    family: 'Orchidaceae',
    medicinalUses: 'Traditional ethnomedical applications use floral and leaf extracts for calming skin inflammation, burns, and as a cooling antioxidant restorative.',
    activeCompounds: 'Orchidaceous anthocyanins, Flavonoids, Bibenzyl derivatives, Phenanthrenes',
    habitat: 'Moist lowland tropical rainforest canopies; epiphytic on mossy trunks.',
    precautions: 'Non-toxic; wild populations are protected under international conservation treaties, so only cultivated plants should be used.',
  },

  // 27. Moringa
  'moringa': {
    scientificName: 'Moringa oleifera (Murunga)',
    family: 'Moringaceae',
    medicinalUses: 'Exceptional botanical nutrient source; stabilizes blood glucose, reduces elevated serum lipids, and curbs chronic systemic inflammation.',
    activeCompounds: 'Isothiocyanates (Moringin), Quercetin, Chlorogenic acid, Beta-sitosterol',
    habitat: 'Drought-resistant tropical and sub-Himalayan plains.',
    precautions: 'Bark and root extracts contain spirochin which can provoke uterine contractions; avoid root/bark preparations during pregnancy.',
  },

  // 28. Neem
  'neem': {
    scientificName: 'Azadirachta indica (Kohomba)',
    family: 'Meliaceae',
    medicinalUses: 'Supreme antibacterial, antifungal, blood purifier, and anti-parasitic; treats acneic skin, cures gingivitis, and helps clear psoriasis lesions.',
    activeCompounds: 'Nimbin, Azadirachtin, Nimbidin, Quercetin, Salannin',
    habitat: 'Dry tropical lowlands and plains of South and Southeast Asia.',
    precautions: 'Very potent; internal use is contraindicated for infants, young children, and individuals attempting to conceive.',
  },

  // 29. Oleander
  'oleander': {
    scientificName: 'Nerium oleander (Kaneru)',
    family: 'Apocynaceae',
    medicinalUses: 'Historically investigated for cardiotonic and anticancer glycosides; strictly used in controlled folk external pastes for severe ringworm.',
    activeCompounds: 'Oleandrin, Neriine, Cardiac glycosides, Folinerin, Rosagenin',
    habitat: 'Mediterranean and subtropical riverbeds and ornamental plantings.',
    precautions: 'LETHAL TOXICITY WARNING: All parts of oleander are deadly poisonous. Ingestion causes fatal cardiac arrest, arrhythmias, and death. Never ingest.',
  },

  // 30. Oregano (oregano)
  'oregano': {
    scientificName: 'Origanum vulgare',
    family: 'Lamiaceae',
    medicinalUses: 'Broad-spectrum antimicrobial and antifungal; oil of oregano halts gut dysbiosis, relieves upper respiratory infections, and eases sinusitis.',
    activeCompounds: 'Carvacrol, Thymol, Rosmarinic acid, Terpinene, Caryophyllene',
    habitat: 'Mountainous rocky soils and sunlit slopes of Mediterranean and tropical regions.',
    precautions: 'Pure essential oil is extremely caustic to mucous membranes and must always be diluted in a culinary carrier oil.',
  },

  // 31. Papaya (Pappaya)
  'pappaya': {
    scientificName: 'Carica papaya (Gaslabu)',
    family: 'Caricaceae',
    medicinalUses: 'Papaya leaf juice significantly boosts blood platelet counts during viral dengue fever; fruit enzymes enhance digestive protein assimilation.',
    activeCompounds: 'Papain, Chymopapain, Carpaine, Pseudocarpaine, Flavonoids',
    habitat: 'Tropical lowlands and fertile homestead gardens worldwide.',
    precautions: 'Unripe fruit and high latex concentrations can trigger uterine contractions; avoid concentrated leaf extract during pregnancy.',
  },
  'papaya': {
    scientificName: 'Carica papaya (Gaslabu)',
    family: 'Caricaceae',
    medicinalUses: 'Papaya leaf juice significantly boosts blood platelet counts during viral dengue fever; fruit enzymes enhance digestive protein assimilation.',
    activeCompounds: 'Papain, Chymopapain, Carpaine, Pseudocarpaine, Flavonoids',
    habitat: 'Tropical lowlands and fertile homestead gardens worldwide.',
    precautions: 'Unripe fruit and high latex concentrations can trigger uterine contractions; avoid concentrated leaf extract during pregnancy.',
  },

  // 32. Pepper
  'pepper': {
    scientificName: 'Piper nigrum (Gammiris)',
    family: 'Piperaceae',
    medicinalUses: 'Piperine boosts the bioavailability of curcumin and botanical nutrients by up to 2000%; stimulates digestion, clears mucus, and warms metabolism.',
    activeCompounds: 'Piperine, Chavicine, Piperidine, Caryophyllene, Pinene',
    habitat: 'Tropical rainforest understories clinging to support trees.',
    precautions: 'Excessive consumption can irritate active gastric ulcerations or acid-inflamed esophageal linings.',
  },

  // 33. Pepper Elder
  'pepper elder': {
    scientificName: 'Peperomia pellucida (Shiny Bush / Diya genda)',
    family: 'Piperaceae',
    medicinalUses: 'Traditional folk remedy for hyperuricemia, gout, and arthritic joint pain; acts as a soothing diuretic, treats kidney discomfort, and heals headaches.',
    activeCompounds: 'Pellucidatin, Dillapiole, Flavonoids, Phytosterols, Tannins',
    habitat: 'Shaded moist soils, brick crevices, and damp forest floors across the tropics.',
    precautions: 'Generally very safe and mild; individuals allergic to Piperaceae species should test for sensitivity.',
  },

  // 34. Physic Nut
  'physic nut': {
    scientificName: 'Jatropha curcas (Weta Endaru)',
    family: 'Euphorbiaceae',
    medicinalUses: 'Leaf decoctions act externally as an antiseptic wash for stubborn ulcers, scabies, toothache, and rheumatism; sap stems bleeding.',
    activeCompounds: 'Curcin, Phorbol esters, Diterpenes, Lignan derivatives',
    habitat: 'Arid and semi-arid tropical wastelands, living hedges, and roadsides.',
    precautions: 'TOXIC WARNING: Seeds contain curcin, a toxic toxalbumin, and purgative phorbol esters. Ingestion causes violent vomiting and collapse.',
  },

  // 35. Ringworm Bush
  'ringworm bush': {
    scientificName: 'Senna alata / Cassia alata (Eth-thora / Candle Bush)',
    family: 'Fabaceae',
    medicinalUses: 'Renowned dermatological remedy; freshly crushed leaves rapidly cure ringworm (tinea), fungal rashes, eczema, and cutaneous infections.',
    activeCompounds: 'Chrysophanic acid, Anthraquinones, Rhein, Emodin, Sennosides',
    habitat: 'Tropical marshy margins, damp riverbanks, and open sunny wastelands.',
    precautions: 'Potent anthraquinones make oral ingestion unsuitable for prolonged use or during pregnancy.',
  },

  // 36. Sapodilla
  'sapodilla': {
    scientificName: 'Manilkara zapota (Rambutan / Rata-me)',
    family: 'Sapotaceae',
    medicinalUses: 'Astringent bark and unripe fruit teas treat chronic diarrhea and dysentery; ripe fruit provides abundant prebiotic fiber and soothing antioxidants.',
    activeCompounds: 'Tannins, Saponins, Catechin, Quercetin, Triterpenoids',
    habitat: 'Coastal tropical lowlands and moist evergreen woodland gardens.',
    precautions: 'Hard seeds feature sharp apical hooks that can hook into intestinal walls if swallowed; remove seeds prior to consumption.',
  },

  // 37. Sweet Potato Leaves
  'sweet potato leaves': {
    scientificName: 'Ipomoea batatas (Bathala kola)',
    family: 'Convolvulaceae',
    medicinalUses: 'Superfood greens loaded with eye-protective lutein, polyphenols, and iron; improves insulin sensitivity, curbs lipid oxidation, and restores platelets.',
    activeCompounds: 'Lutein, Beta-carotene, Chlorogenic acid, Caffeoylquinic acids, Anthocyanins',
    habitat: 'Warm tropical and subtropical home garden beds.',
    precautions: 'High in vitamin K; individuals taking blood thinners such as Warfarin should consume consistent, measured amounts.',
  },

  // Legacy/Alternate support
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

  // Check no spaces / compact match (e.g. "aleovera" vs "aloe vera")
  const compactKey = normalizedKey.replace(/\s+/g, '');
  if (PLANT_KNOWLEDGE[compactKey]) {
    return PLANT_KNOWLEDGE[compactKey];
  }

  // Partial match fallback (e.g. if model output is "bitter melon leaf extract")
  for (const [key, info] of Object.entries(PLANT_KNOWLEDGE)) {
    if (normalizedKey.includes(key) || key.includes(normalizedKey)) {
      return info;
    }
  }

  return null;
}
