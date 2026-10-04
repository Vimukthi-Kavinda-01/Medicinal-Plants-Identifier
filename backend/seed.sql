-- ============================================================================
-- HerbSense: Medicinal Plants Comprehensive Botanical Seed Data (37+ Species)
-- Verified botanical profiles: taxonomy, medicinal uses, phytochemistry, and safety
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
    -- 1. Aloe Vera (Aleovera)
    (
        'aleovera',
        'Aloe Vera',
        'Aloe barbadensis miller',
        'Asphodelaceae',
        'Accelerates thermal burn and wound healing, deeply hydrates dermal layers, soothes skin inflammation, and supports digestive mucosa.',
        'Aloin, Acemannan, Polysaccharides, Anthraquinones, Vitamins A, C, and E',
        'Arid, tropical, and subtropical regions worldwide; drought-tolerant succulent.',
        'Oral ingestion of unprocessed yellow latex can cause severe abdominal cramping and electrolyte imbalance. Avoid during pregnancy.'
    ),
    (
        'aloe-vera',
        'Aloe Vera',
        'Aloe barbadensis miller',
        'Asphodelaceae',
        'Accelerates thermal burn and wound healing, deeply hydrates dermal layers, soothes skin inflammation, and supports digestive mucosa.',
        'Aloin, Acemannan, Polysaccharides, Anthraquinones, Vitamins A, C, and E',
        'Arid, tropical, and subtropical regions worldwide; drought-tolerant succulent.',
        'Oral ingestion of unprocessed yellow latex can cause severe abdominal cramping and electrolyte imbalance. Avoid during pregnancy.'
    ),

    -- 2. Artemisia (artamisa)
    (
        'artamisa',
        'Artemisia',
        'Artemisia annua / Artemisia vulgaris',
        'Asteraceae',
        'Source of Nobel-prize winning antimalarial artemisinin; reduces periodic fevers, relieves gastrointestinal cramps, and stimulates bile secretion.',
        'Artemisinin, Thujone, Sesquiterpene lactones, Flavonoids, Cineole',
        'Temperate to subtropical regions, roadsides, disturbed soils, and open sunny hillsides.',
        'Contains neuroactive thujone; contraindicated during pregnancy and lactation. Prolonged high-dose internal use is unsafe.'
    ),
    (
        'artemisia',
        'Artemisia',
        'Artemisia annua / Artemisia vulgaris',
        'Asteraceae',
        'Source of Nobel-prize winning antimalarial artemisinin; reduces periodic fevers, relieves gastrointestinal cramps, and stimulates bile secretion.',
        'Artemisinin, Thujone, Sesquiterpene lactones, Flavonoids, Cineole',
        'Temperate to subtropical regions, roadsides, disturbed soils, and open sunny hillsides.',
        'Contains neuroactive thujone; contraindicated during pregnancy and lactation. Prolonged high-dose internal use is unsafe.'
    ),

    -- 3. Ashoka
    (
        'ashoka',
        'Ashoka Tree',
        'Saraca asoca',
        'Fabaceae',
        'Premier Ayurvedic uterine tonic; manages menorrhagia, eases dysmenorrhea, reduces pelvic inflammation, and stabilizes menstrual rhythm.',
        'Saracin, Catechol, Tannins, Phytosterols, Ketosterol, Leucopelargonidin',
        'Rainforests and sacred river valleys of the Indian subcontinent and Southeast Asia.',
        'Influences uterine muscle tone and hormonal balance; contraindicated during pregnancy without qualified Ayurvedic oversight.'
    ),

    -- 4. Ashwagandha
    (
        'ashwagandha',
        'Ashwagandha',
        'Withania somnifera (Indian Ginseng)',
        'Solanaceae',
        'Powerful adaptogen; mitigates chronic cortisol stress, relieves insomnia, enhances endurance, and confers neuroprotective support.',
        'Withanolides, Withaferin A, Somniferine, Alkaloids, Saponins',
        'Dry stony soils and semi-arid subtropical regions of South Asia and North Africa.',
        'May increase thyroid hormone production; avoid during pregnancy and exercise caution in autoimmune disorders.'
    ),

    -- 5. Avocado (Avacado)
    (
        'avacado',
        'Avocado',
        'Persea americana',
        'Lauraceae',
        'Leaf decoctions act as a mild hypotensive and diuretic; eases inflammatory joint stiffness and relieves bronchial spasms.',
        'Persin, Quercetin, Kaempferol, Monounsaturated fatty acids, Phytosterols',
        'Humid subtropical and tropical highlands, native to Mesoamerica.',
        'Fresh leaves contain persin which is toxic to domestic pets and livestock; culinary human use of pulp and strained tea is safe.'
    ),
    (
        'avocado',
        'Avocado',
        'Persea americana',
        'Lauraceae',
        'Leaf decoctions act as a mild hypotensive and diuretic; eases inflammatory joint stiffness and relieves bronchial spasms.',
        'Persin, Quercetin, Kaempferol, Monounsaturated fatty acids, Phytosterols',
        'Humid subtropical and tropical highlands, native to Mesoamerica.',
        'Fresh leaves contain persin which is toxic to domestic pets and livestock; culinary human use of pulp and strained tea is safe.'
    ),

    -- 6. Bamboo
    (
        'bamboo',
        'Bamboo',
        'Bambusa vulgaris / Bambusa arundinacea',
        'Poaceae',
        'Young shoot and leaf teas supply natural organic silica (Tabasheer) for collagen, cartilage, and bone health; cools fevers and aids detox.',
        'Bioactive Silica, Flavonoids, Phenolic acids, Choline, Betaine',
        'Moist tropical riverbanks, rainforest understories, and moist hillsides.',
        'Raw bamboo shoots contain poisonous cyanogenic glycosides and must always be thoroughly peeled and boiled before eating.'
    ),

    -- 7. Betel Leaf
    (
        'betel-leaf',
        'Betel Leaf',
        'Piper betle (Bulath)',
        'Piperaceae',
        'Potent oral antiseptic and carminative; warm leaf poultices relieve bronchial chest congestion, eliminate oral bacteria, and soothe sore throats.',
        'Chavibetol, Eugenol, Hydroxychavicol, Caryophyllene, Betel-phenol',
        'Warm, humid shaded forests and tropical gardens across South and Southeast Asia.',
        'Chewing with areca nut and slaked lime is carcinogenic; use only as isolated herbal decoction, essential rinse, or topical poultice.'
    ),

    -- 8. Bitter Melon Leaf
    (
        'bitter-melon-leaf',
        'Bitter Melon Leaf',
        'Momordica charantia (Karawila)',
        'Cucurbitaceae',
        'Proven hypoglycemic herb; stimulates pancreatic insulin release, detoxifies hepatic tissue, expels intestinal parasites, and cleanses blood.',
        'Charantin, Vicine, Polypeptide-p, Momordicins, Cucurbitane triterpenoids',
        'Tropical lowlands and cultivated gardens across Asia, Africa, and the Caribbean.',
        'May induce severe hypoglycemia when taken alongside prescription diabetes medication; contraindicated during pregnancy.'
    ),

    -- 9. Boat Lily (boat lily)
    (
        'boat-lily',
        'Boat Lily',
        'Tradescantia spathacea (Rhoeo discolor)',
        'Commelinaceae',
        'Traditional floral and leaf decoctions soothe acute cough, bronchitis, dysentery, hemoptysis, and cool systemic internal heat.',
        'Anthocyanins, Flavonoids, Steroidal saponins, Terpenoids, Phenolic acids',
        'Tropical limestone woodlands and ornamental shaded gardens.',
        'Clear sap contains sharp calcium oxalate raphides that provoke contact dermatitis and mouth burning upon contact.'
    ),

    -- 10. Brahmi
    (
        'brahmi',
        'Brahmi',
        'Bacopa monnieri (Water Hyssop)',
        'Plantaginaceae',
        'Premier nootropic brain tonic; enhances memory retention and synaptic transmission, reduces anxiety, and shields brain cells from oxidative decay.',
        'Bacosides A and B, Hersaponin, Betulinic acid, D-mannitol',
        'Wetlands, marshy borders, and warm tropical shallow waterways.',
        'Consume with meals or healthy fats to avoid mild gastrointestinal cramps or dryness of the mouth.'
    ),

    -- 11. Candelabra Spurge
    (
        'candelabra-spurge',
        'Candelabra Spurge',
        'Euphorbia lactea / Euphorbia candelabrum',
        'Euphorbiaceae',
        'Folk external escharotic remedy for cauterizing warts and cutaneous lesions; extracts investigated for bioactive antimicrobial diterpenoids.',
        'Ingenol esters, Phorbol esters, Diterpenes, Euphorbin',
        'Arid tropical scrublands, rocky bluffs, and xerophytic gardens.',
        'CAUTION: Acrid milky latex is intensely caustic. Causes severe skin blistering and permanent eye cornea damage. Never ingest.'
    ),

    -- 12. Cassava
    (
        'cassava',
        'Cassava',
        'Manihot esculenta (Manyokka)',
        'Euphorbiaceae',
        'Cooked leaves are highly nutritious, providing iron, protein, and beta-carotene; pounded leaf compresses ease fevers and headaches.',
        'Linamarin, Lotaustralin, Rutin, Beta-carotene, Flavonoids',
        'Lowland tropical agricultural zones and forest borders.',
        'Raw leaves and roots contain deadly cyanogenic glycosides. Must be repeatedly washed, crushed, and fully cooked before ingestion.'
    ),

    -- 13. Castor
    (
        'castor',
        'Castor Plant',
        'Ricinus communis (Endaru)',
        'Euphorbiaceae',
        'Topical castor oil packs stimulate lymphatic drainage, relieve arthritic pain, and soothe boils; leaves act as an anti-inflammatory poultice.',
        'Ricinoleic acid, Lupeol, Quercetin, Ricinine (in seeds)',
        'Tropical river margins, disturbed wastelands, and roadside thickets.',
        'LETHAL WARNING: Castor seeds contain ricin, a lethal ribosomal toxin. Only commercially processed, toxin-free castor oil is safe.'
    ),

    -- 14. Climbing Ylang-Ylang
    (
        'climbing-ylang-ylang',
        'Climbing Ylang-Ylang',
        'Artabotrys hexapetalus (Manorangitham)',
        'Annonaceae',
        'Aromatic leaves and root decoctions serve as traditional antipyretic remedies for cholera, malarial chills, scrofula, and inflammatory cardiac spasms.',
        'Artabotrine, Isoquinoline alkaloids, Monoterpenes, Sesquiterpenes, Flavonoids',
        'Tropical rainforests, thickets, and garden trellises of South and Southeast Asia.',
        'Rich in potent alkaloids; therapeutic use requires careful dosage control. Avoid during pregnancy.'
    ),

    -- 15. Coconut Leaf
    (
        'coconut-leaf',
        'Coconut Palm',
        'Cocos nucifera (Pol)',
        'Arecaceae',
        'Astringent leaf and root decoctions provide an effective oral rinse for bleeding gums, soothe diarrhea, and lower fevers in coastal folk medicine.',
        'Condensed Tannins, Gallic acid, Epicatechin, Polysaccharides, Phenolics',
        'Coastal tropical shorelines and sandy lowland agricultural soils.',
        'Astringent and high in tannins; safe as a strained aqueous herbal tea or topical mouth rinse.'
    ),

    -- 16. Five-Leaved Chaste Tree
    (
        'five-leaved-chaste-tree',
        'Five-Leaved Chaste Tree',
        'Vitex negundo (Nika / Nirgundi)',
        'Lamiaceae',
        'Celebrated anti-inflammatory and analgesic; warm leaf steam compresses treat severe arthritis, sciatica, bronchitis, and catarrhal headache.',
        'Negundoside, Nishindine, Casticin, Luteolin, Betulinic acid',
        'Tropical watercourses, scrub jungle margins, and rural village hedges.',
        'May interact with hormonal and endocrine therapies due to mild progesterone-modulating properties.'
    ),

    -- 17. Guava
    (
        'guava',
        'Guava',
        'Psidium guajava (Pera)',
        'Myrtaceae',
        'Young leaf tea is a premier remedy for acute gastroenteritis, diarrhea, toothache, and postprandial blood sugar regulation.',
        'Quercetin, Guajaverin, Tannins, Caryophyllene, Ursolic acid',
        'Tropical and subtropical orchards, gardens, and fertile river plains.',
        'High tannin levels can cause mild constipation if consumed in excessively large quantities over extended periods.'
    ),

    -- 18. Heart-leaved Moonseed
    (
        'heart-leaved-moonseed',
        'Heart-leaved Moonseed',
        'Tinospora cordifolia (Guduchi / Giloy / Rasakinda)',
        'Menispermaceae',
        'Supreme immunomodulator (Amrita); boosts white blood cell defense, rejuvenates liver tissue, purifies blood, and controls chronic recurring fevers.',
        'Tinosporide, Cordifolioside, Berberine, Giloin, Arabinogalactan',
        'Tropical deciduous forests climbing across high canopies.',
        'Hypoglycemic actions may enhance the effect of diabetic drugs; monitor glucose levels if medicated.'
    ),

    -- 19. Indian Borage
    (
        'indian-borage',
        'Indian Borage',
        'Plectranthus amboinicus (Mexican Mint / Kapparawalliya)',
        'Lamiaceae',
        'Renowned aromatic succulent for pediatric respiratory congestion, cough, asthma, bronchitis, and soothing insect bites and indigestion.',
        'Carvacrol, Thymol, Caryophyllene, Rosmarinic acid, Cirsimaritin',
        'Moist tropical home gardens, rockeries, and partially shaded borders.',
        'Safe in culinary and standard tea amounts; concentrated essential extracts may irritate sensitive gastric linings.'
    ),

    -- 20. Indian Gooseberry
    (
        'indian-gooseberry',
        'Indian Gooseberry',
        'Phyllanthus emblica (Amla / Nelli)',
        'Phyllanthaceae',
        'Core ingredient of Triphala; exceptionally rich in stable vitamin C and polyphenols; protects gastric lining, restores liver cells, and stimulates hair growth.',
        'Emblicanin A and B, Punigluconin, Gallic acid, Ellagic acid, Chebulic acid',
        'Tropical deciduous and dry scrub forests of South Asia.',
        'May aggravate hyperacidity if consumed in concentrated form on an empty stomach due to natural sour acidity.'
    ),

    -- 21. Lemon
    (
        'lemon',
        'Lemon',
        'Citrus limon (Dehi)',
        'Rutaceae',
        'Leaves and peels yield therapeutic volatile oils that dispel nausea, reduce phlegm, provide antimicrobial bioflavonoids, and strengthen capillary walls.',
        'D-Limonene, Citric acid, Hesperidin, Eriocitrin, Vitamin C',
        'Subtropical and Mediterranean climates with well-drained fertile loam.',
        'Direct topical application of citrus oils followed by sun exposure causes phytophotodermatitis skin pigmentation.'
    ),

    -- 22. Lemon grass
    (
        'lemon-grass',
        'Lemongrass',
        'Cymbopogon citratus (Sera)',
        'Poaceae',
        'Alleviates gastrointestinal cramps and nausea, stimulates diaphoretic fever reduction, halts fungal overgrowth, and eases stress.',
        'Citral (Geranial & Neral), Myrcene, Geraniol, Linalool, Isoorientin',
        'Warm tropical grasslands and home herb gardens.',
        'Always dilute concentrated lemongrass essential oil; avoid large therapeutic dosages during pregnancy.'
    ),
    (
        'lemongrass',
        'Lemongrass',
        'Cymbopogon citratus (Sera)',
        'Poaceae',
        'Alleviates gastrointestinal cramps and nausea, stimulates diaphoretic fever reduction, halts fungal overgrowth, and eases stress.',
        'Citral (Geranial & Neral), Myrcene, Geraniol, Linalool, Isoorientin',
        'Warm tropical grasslands and home herb gardens.',
        'Always dilute concentrated lemongrass essential oil; avoid large therapeutic dosages during pregnancy.'
    ),

    -- 23. Malabar Spinach
    (
        'malabar-spinach',
        'Malabar Spinach',
        'Basella alba (Nivithi)',
        'Basellaceae',
        'Cooling mucilaginous leaves relieve chronic constipation, heal gastric ulcers, soothe hemorrhoids, and cool skin burn poultices.',
        'Betacyanins, Mucilage polysaccharides, Kaempferol, Beta-carotene, Folate, Iron',
        'Moist tropical and subtropical lowlands, river margins, and trellis gardens.',
        'Contains soluble oxalates; individuals prone to calcium oxalate kidney stones should consume in moderation.'
    ),

    -- 24. Mango
    (
        'mango',
        'Mango',
        'Mangifera indica (Amba)',
        'Annonaceae',
        'Tender young leaf infusions help manage early-stage diabetes, vascular hypertension, varicose veins, respiratory asthma, and oral gum bleed.',
        'Mangiferin, Catechin, Tannins, Quercetin, Terpenoids',
        'Tropical lowlands and fertile plains worldwide.',
        'Mango tree resin and leaf trichomes contain urushiol-like allergens that can trigger dermatitis in hypersensitive individuals.'
    ),

    -- 25. Mint
    (
        'mint',
        'Mint',
        'Mentha spicata / Mentha arvensis',
        'Lamiaceae',
        'Relieves spastic irritable bowel symptoms, clears blocked nasal congestion, dispels flatulence, and freshens oral microbiota.',
        'Carvone, Menthol, Rosmarinic acid, Limonene, Diosmin',
        'Moist soils, watercourses, and garden beds across temperate to tropical zones.',
        'May relax lower esophageal sphincter; patients with active gastroesophageal reflux disease (GERD) should limit high intake.'
    ),

    -- 26. Moon Orchid
    (
        'moon-orchid',
        'Moon Orchid',
        'Phalaenopsis amabilis (Anggrek Bulan)',
        'Orchidaceae',
        'Traditional ethnomedical applications use floral and leaf extracts for calming skin inflammation, burns, and as a cooling antioxidant restorative.',
        'Orchidaceous anthocyanins, Flavonoids, Bibenzyl derivatives, Phenanthrenes',
        'Moist lowland tropical rainforest canopies; epiphytic on mossy trunks.',
        'Non-toxic; wild populations are protected under international conservation treaties, so only cultivated plants should be used.'
    ),

    -- 27. Moringa
    (
        'moringa',
        'Moringa',
        'Moringa oleifera (Murunga)',
        'Moringaceae',
        'Exceptional botanical nutrient source; stabilizes blood glucose, reduces elevated serum lipids, and curbs chronic systemic inflammation.',
        'Isothiocyanates (Moringin), Quercetin, Chlorogenic acid, Beta-sitosterol',
        'Drought-resistant tropical and sub-Himalayan plains.',
        'Bark and root extracts contain spirochin which can provoke uterine contractions; avoid root/bark preparations during pregnancy.'
    ),

    -- 28. Neem
    (
        'neem',
        'Neem',
        'Azadirachta indica (Kohomba)',
        'Meliaceae',
        'Supreme antibacterial, antifungal, blood purifier, and anti-parasitic; treats acneic skin, cures gingivitis, and helps clear psoriasis lesions.',
        'Nimbin, Azadirachtin, Nimbidin, Quercetin, Salannin',
        'Dry tropical lowlands and plains of South and Southeast Asia.',
        'Very potent; internal use is contraindicated for infants, young children, and individuals attempting to conceive.'
    ),

    -- 29. Oleander
    (
        'oleander',
        'Oleander',
        'Nerium oleander (Kaneru)',
        'Apocynaceae',
        'Historically investigated for cardiotonic and anticancer glycosides; strictly used in controlled folk external pastes for severe ringworm.',
        'Oleandrin, Neriine, Cardiac glycosides, Folinerin, Rosagenin',
        'Mediterranean and subtropical riverbeds and ornamental plantings.',
        'LETHAL TOXICITY WARNING: All parts of oleander are deadly poisonous. Ingestion causes fatal cardiac arrest, arrhythmias, and death. Never ingest.'
    ),

    -- 30. Oregano (oregano)
    (
        'oregano',
        'Oregano',
        'Origanum vulgare',
        'Lamiaceae',
        'Broad-spectrum antimicrobial and antifungal; oil of oregano halts gut dysbiosis, relieves upper respiratory infections, and eases sinusitis.',
        'Carvacrol, Thymol, Rosmarinic acid, Terpinene, Caryophyllene',
        'Mountainous rocky soils and sunlit slopes of Mediterranean and tropical regions.',
        'Pure essential oil is extremely caustic to mucous membranes and must always be diluted in a culinary carrier oil.'
    ),

    -- 31. Papaya (Pappaya)
    (
        'pappaya',
        'Papaya',
        'Carica papaya (Gaslabu)',
        'Caricaceae',
        'Papaya leaf juice significantly boosts blood platelet counts during viral dengue fever; fruit enzymes enhance digestive protein assimilation.',
        'Papain, Chymopapain, Carpaine, Pseudocarpaine, Flavonoids',
        'Tropical lowlands and fertile homestead gardens worldwide.',
        'Unripe fruit and high latex concentrations can trigger uterine contractions; avoid concentrated leaf extract during pregnancy.'
    ),
    (
        'papaya',
        'Papaya',
        'Carica papaya (Gaslabu)',
        'Caricaceae',
        'Papaya leaf juice significantly boosts blood platelet counts during viral dengue fever; fruit enzymes enhance digestive protein assimilation.',
        'Papain, Chymopapain, Carpaine, Pseudocarpaine, Flavonoids',
        'Tropical lowlands and fertile homestead gardens worldwide.',
        'Unripe fruit and high latex concentrations can trigger uterine contractions; avoid concentrated leaf extract during pregnancy.'
    ),

    -- 32. Pepper
    (
        'pepper',
        'Black Pepper',
        'Piper nigrum (Gammiris)',
        'Piperaceae',
        'Piperine boosts the bioavailability of curcumin and botanical nutrients by up to 2000%; stimulates digestion, clears mucus, and warms metabolism.',
        'Piperine, Chavicine, Piperidine, Caryophyllene, Pinene',
        'Tropical rainforest understories clinging to support trees.',
        'Excessive consumption can irritate active gastric ulcerations or acid-inflamed esophageal linings.'
    ),

    -- 33. Pepper Elder
    (
        'pepper-elder',
        'Pepper Elder',
        'Peperomia pellucida (Shiny Bush / Diya genda)',
        'Piperaceae',
        'Traditional folk remedy for hyperuricemia, gout, and arthritic joint pain; acts as a soothing diuretic, treats kidney discomfort, and heals headaches.',
        'Pellucidatin, Dillapiole, Flavonoids, Phytosterols, Tannins',
        'Shaded moist soils, brick crevices, and damp forest floors across the tropics.',
        'Generally very safe and mild; individuals allergic to Piperaceae species should test for sensitivity.'
    ),

    -- 34. Physic Nut
    (
        'physic-nut',
        'Physic Nut',
        'Jatropha curcas (Weta Endaru)',
        'Euphorbiaceae',
        'Leaf decoctions act externally as an antiseptic wash for stubborn ulcers, scabies, toothache, and rheumatism; sap stems bleeding.',
        'Curcin, Phorbol esters, Diterpenes, Lignan derivatives',
        'Arid and semi-arid tropical wastelands, living hedges, and roadsides.',
        'TOXIC WARNING: Seeds contain curcin, a toxic toxalbumin, and purgative phorbol esters. Ingestion causes violent vomiting and collapse.'
    ),

    -- 35. Ringworm Bush
    (
        'ringworm-bush',
        'Ringworm Bush',
        'Senna alata / Cassia alata (Eth-thora / Candle Bush)',
        'Fabaceae',
        'Renowned dermatological remedy; freshly crushed leaves rapidly cure ringworm (tinea), fungal rashes, eczema, and cutaneous infections.',
        'Chrysophanic acid, Anthraquinones, Rhein, Emodin, Sennosides',
        'Tropical marshy margins, damp riverbanks, and open sunny wastelands.',
        'Potent anthraquinones make oral ingestion unsuitable for prolonged use or during pregnancy.'
    ),

    -- 36. Sapodilla
    (
        'sapodilla',
        'Sapodilla',
        'Manilkara zapota (Rambutan / Rata-me)',
        'Sapotaceae',
        'Astringent bark and unripe fruit teas treat chronic diarrhea and dysentery; ripe fruit provides abundant prebiotic fiber and soothing antioxidants.',
        'Tannins, Saponins, Catechin, Quercetin, Triterpenoids',
        'Coastal tropical lowlands and moist evergreen woodland gardens.',
        'Hard seeds feature sharp apical hooks that can hook into intestinal walls if swallowed; remove seeds prior to consumption.'
    ),

    -- 37. Sweet Potato Leaves
    (
        'sweet-potato-leaves',
        'Sweet Potato Leaves',
        'Ipomoea batatas (Bathala kola)',
        'Convolvulaceae',
        'Superfood greens loaded with eye-protective lutein, polyphenols, and iron; improves insulin sensitivity, curbs lipid oxidation, and restores platelets.',
        'Lutein, Beta-carotene, Chlorogenic acid, Caffeoylquinic acids, Anthocyanins',
        'Warm tropical and subtropical home garden beds.',
        'High in vitamin K; individuals taking blood thinners such as Warfarin should consume consistent, measured amounts.'
    )

ON CONFLICT (slug) DO UPDATE SET
    common_name = EXCLUDED.common_name,
    scientific_name = EXCLUDED.scientific_name,
    family = EXCLUDED.family,
    medicinal_uses = EXCLUDED.medicinal_uses,
    active_compounds = EXCLUDED.active_compounds,
    habitat = EXCLUDED.habitat,
    precautions = EXCLUDED.precautions;
