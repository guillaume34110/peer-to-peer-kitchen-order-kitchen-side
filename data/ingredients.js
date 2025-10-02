const ingredients = [
  {
    id: "farine",
    name: {
      fr: "Farine",
      th: "แป้ง",
      en: "Flour",
      de: "Mehl",
      ja: "小麦粉",
      zh: "面粉",
      ru: "Мука",
      ko: "밀가루",
      es: "Harina",
      it: "Farina",
      nl: "Bloem",
      pt: "Farinha"
    }
  },
  {
    id: "oeufs",
    name: {
      fr: "Œufs",
      th: "ไข่",
      en: "Eggs",
      de: "Eier",
      ja: "卵",
      zh: "鸡蛋",
      ru: "Яйца",
      ko: "달걀",
      es: "Huevos",
      it: "Uova",
      nl: "Eieren",
      pt: "Ovos"
    }
  },
  {
    id: "lait",
    name: {
      fr: "Lait",
      th: "นม",
      en: "Milk",
      de: "Milch",
      ja: "牛乳",
      zh: "牛奶",
      ru: "Молоко",
      ko: "우유",
      es: "Leche",
      it: "Latte",
      nl: "Melk",
      pt: "Leite"
    }
  },
  {
    id: "beurre",
    name: {
      fr: "Beurre",
      th: "เนย",
      en: "Butter",
      de: "Butter",
      ja: "バター",
      zh: "黄油",
      ru: "Сливочное масло",
      ko: "버터",
      es: "Mantequilla",
      it: "Burro",
      nl: "Boter",
      pt: "Manteiga"
    }
  },
  {
    id: "sucre",
    name: {
      fr: "Sucre",
      th: "น้ำตาล",
      en: "Sugar",
      de: "Zucker",
      ja: "砂糖",
      zh: "糖",
      ru: "Сахар",
      ko: "설탕",
      es: "Azúcar",
      it: "Zucchero",
      nl: "Suiker",
      pt: "Açúcar"
    }
  },
  {
    id: "sel",
    name: {
      fr: "Sel",
      th: "เกลือ",
      en: "Salt",
      de: "Salz",
      ja: "塩",
      zh: "盐",
      ru: "Соль",
      ko: "소금",
      es: "Sal",
      it: "Sale",
      nl: "Zout",
      pt: "Sal"
    }
  },
  {
    id: "jambon",
    name: {
      fr: "Jambon",
      th: "แฮม",
      en: "Ham",
      de: "Schinken",
      ja: "ハム",
      zh: "火腿",
      ru: "Ветчина",
      ko: "햄",
      es: "Jamón",
      it: "Prosciutto",
      nl: "Ham",
      pt: "Presunto"
    }
  },
  {
    id: "fromage",
    name: {
      fr: "Fromage",
      th: "ชีส",
      en: "Cheese",
      de: "Käse",
      ja: "チーズ",
      zh: "奶酪",
      ru: "Сыр",
      ko: "치즈",
      es: "Queso",
      it: "Formaggio",
      nl: "Kaas",
      pt: "Queijo"
    }
  },
  {
    id: "champignons",
    name: {
      fr: "Champignons",
      th: "เห็ด",
      en: "Mushrooms",
      de: "Pilze",
      ja: "きのこ",
      zh: "蘑菇",
      ru: "Грибы",
      ko: "버섯",
      es: "Champiñones",
      it: "Funghi",
      nl: "Champignons",
      pt: "Cogumelos"
    }
  },
  {
    id: "chocolat",
    name: {
      fr: "Chocolat",
      th: "ช็อกโกแลต",
      en: "Chocolate",
      de: "Schokolade",
      ja: "チョコレート",
      zh: "巧克力",
      ru: "Шоколад",
      ko: "초콜릿",
      es: "Chocolate",
      it: "Cioccolato",
      nl: "Chocolade",
      pt: "Chocolate"
    }
  },
  {
    id: "bananes",
    name: {
      fr: "Bananes",
      th: "กล้วย",
      en: "Bananas",
      de: "Bananen",
      ja: "バナナ",
      zh: "香蕉",
      ru: "Бананы",
      ko: "바나나",
      es: "Plátanos",
      it: "Banane",
      nl: "Bananen",
      pt: "Bananas"
    }
  },
  {
    id: "vanille",
    name: {
      fr: "Vanille",
      th: "วานิลลา",
      en: "Vanilla",
      de: "Vanille",
      ja: "バニラ",
      zh: "香草",
      ru: "Ваниль",
      ko: "바닐라",
      es: "Vainilla",
      it: "Vaniglia",
      nl: "Vanille",
      pt: "Baunilha"
    }
  },
  {
    id: "cafe",
    name: {
      fr: "Café",
      th: "กาแฟ",
      en: "Coffee",
      de: "Kaffee",
      ja: "コーヒー",
      zh: "咖啡",
      ru: "Кофе",
      ko: "커피",
      es: "Café",
      it: "Caffè",
      nl: "Koffie",
      pt: "Café"
    }
  },
  {
    id: "the",
    name: {
      fr: "Thé",
      th: "ชา",
      en: "Tea",
      de: "Tee",
      ja: "お茶",
      zh: "茶",
      ru: "Чай",
      ko: "차",
      es: "Té",
      it: "Tè",
      nl: "Thee",
      pt: "Chá"
    }
  },
  {
    id: "eau",
    name: {
      fr: "Eau",
      th: "น้ำ",
      en: "Water",
      de: "Wasser",
      ja: "水",
      zh: "水",
      ru: "Вода",
      ko: "물",
      es: "Agua",
      it: "Acqua",
      nl: "Water",
      pt: "Água"
    }
  },
  {
    id: "wrap",
    name: {
      fr: "Wrap",
      th: "แผ่นแป้ง",
      en: "Wrap",
      de: "Wrap",
      ja: "トルティーヤ",
      zh: "卷饼皮",
      ru: "Тортилья",
      ko: "또띠아",
      es: "Tortilla",
      it: "Tortilla",
      nl: "Wrap",
      pt: "Tortilha"
    }
  },
  {
    id: "poulet",
    name: {
      fr: "Poulet",
      th: "ไก่",
      en: "Chicken",
      de: "Hähnchen",
      ja: "鶏肉",
      zh: "鸡肉",
      ru: "Курица",
      ko: "닭고기",
      es: "Pollo",
      it: "Pollo",
      nl: "Kip",
      pt: "Frango"
    }
  },
  {
    id: "basilic_thai",
    name: {
      fr: "Basilic Thaï",
      th: "กะเพรา",
      en: "Thai Basil",
      de: "Thai-Basilikum",
      ja: "タイバジル",
      zh: "泰国罗勒",
      ru: "Тайский базилик",
      ko: "태국 바질",
      es: "Albahaca tailandesa",
      it: "Basilico tailandese",
      nl: "Thaise basilicum",
      pt: "Manjericão tailandês"
    }
  },
  {
    id: "piment",
    name: {
      fr: "Piment",
      th: "พริก",
      en: "Chili Pepper",
      de: "Chili",
      ja: "唐辛子",
      zh: "辣椒",
      ru: "Перец чили",
      ko: "고추",
      es: "Chile",
      it: "Peperoncino",
      nl: "Chilipeper",
      pt: "Pimenta"
    }
  },
  {
    id: "ail",
    name: {
      fr: "Ail",
      th: "กระเทียม",
      en: "Garlic",
      de: "Knoblauch",
      ja: "にんにく",
      zh: "大蒜",
      ru: "Чеснок",
      ko: "마늘",
      es: "Ajo",
      it: "Aglio",
      nl: "Knoflook",
      pt: "Alho"
    }
  },
  {
    id: "sauce_huitre",
    name: {
      fr: "Sauce d'huître",
      th: "ซอสหอยนางรม",
      en: "Oyster Sauce",
      de: "Austernsauce",
      ja: "オイスターソース",
      zh: "蚝油",
      ru: "Устричный соус",
      ko: "굴소스",
      es: "Salsa de ostras",
      it: "Salsa di ostriche",
      nl: "Oestersaus",
      pt: "Molho de ostra"
    }
  },
  {
    id: "boeuf",
    name: {
      fr: "Bœuf",
      th: "เนื้อวัว",
      en: "Beef",
      de: "Rindfleisch",
      ja: "牛肉",
      zh: "牛肉",
      ru: "Говядина",
      ko: "소고기",
      es: "Carne de res",
      it: "Manzo",
      nl: "Rundvlees",
      pt: "Carne bovina"
    }
  },
  {
    id: "pomme_de_terre",
    name: {
      fr: "Pomme de terre",
      th: "มันฝรั่ง",
      en: "Potato",
      de: "Kartoffel",
      ja: "じゃがいも",
      zh: "土豆",
      ru: "Картофель",
      ko: "감자",
      es: "Patata",
      it: "Patata",
      nl: "Aardappel",
      pt: "Batata"
    }
  },
  {
    id: "arachides",
    name: {
      fr: "Arachides",
      th: "ถั่วลิสง",
      en: "Peanuts",
      de: "Erdnüsse",
      ja: "ピーナッツ",
      zh: "花生",
      ru: "Арахис",
      ko: "땅콩",
      es: "Cacahuetes",
      it: "Arachidi",
      nl: "Pinda's",
      pt: "Amendoins"
    }
  },
  {
    id: "curry_massaman",
    name: {
      fr: "Curry Massaman",
      th: "แกงมัสมั่น",
      en: "Massaman Curry",
      de: "Massaman-Curry",
      ja: "マッサマンカレー",
      zh: "马萨曼咖喱",
      ru: "Карри массаман",
      ko: "마사만 카레",
      es: "Curry massaman",
      it: "Curry massaman",
      nl: "Massaman-curry",
      pt: "Curry massaman"
    }
  },
  {
    id: "lait_de_coco",
    name: {
      fr: "Lait de coco",
      th: "กะทิ",
      en: "Coconut Milk",
      de: "Kokosmilch",
      ja: "ココナッツミルク",
      zh: "椰奶",
      ru: "Кокосовое молоко",
      ko: "코코넛 밀크",
      es: "Leche de coco",
      it: "Latte di cocco",
      nl: "Kokosmelk",
      pt: "Leite de coco"
    }
  },
  {
    id: "oignon",
    name: {
      fr: "Oignon",
      th: "หัวหอม",
      en: "Onion",
      de: "Zwiebel",
      ja: "玉ねぎ",
      zh: "洋葱",
      ru: "Лук",
      ko: "양파",
      es: "Cebolla",
      it: "Cipolla",
      nl: "Ui",
      pt: "Cebola"
    }
  },
  {
    id: "porc",
    name: {
      fr: "Porc",
      th: "หมู",
      en: "Pork",
      de: "Schweinefleisch",
      ja: "豚肉",
      zh: "猪肉",
      ru: "Свинина",
      ko: "돼지고기",
      es: "Cerdo",
      it: "Maiale",
      nl: "Varkensvlees",
      pt: "Carne de porco"
    }
  },
  {
    id: "confiture_fraise",
    name: {
      fr: "Confiture de fraise",
      th: "แยมสตรอเบอร์รี่",
      en: "Strawberry Jam",
      de: "Erdbeermarmelade",
      ja: "いちごジャム",
      zh: "草莓果酱",
      ru: "Клубничный джем",
      ko: "딸기잼",
      es: "Mermelada de fresa",
      it: "Marmellata di fragole",
      nl: "Aardbeienjam",
      pt: "Geleia de morango"
    }
  },
  {
    id: "confiture_mure",
    name: {
      fr: "Confiture de mûre",
      th: "แยมแบล็คเบอร์รี่",
      en: "Blackberry Jam",
      de: "Brombeermarmelade",
      ja: "ブラックベリージャム",
      zh: "黑莓果酱",
      ru: "Ежевичный джем",
      ko: "블랙베리잼",
      es: "Mermelada de mora",
      it: "Marmellata di mora",
      nl: "Bramenjam",
      pt: "Geleia de amora"
    }
  },
  {
    id: "confiture_mulberry",
    name: {
      fr: "Confiture de mûre (mulberry)",
      th: "แยมมัลเบอร์รี่",
      en: "Mulberry Jam",
      de: "Maulbeermarmelade",
      ja: "マルベリージャム",
      zh: "桑葚果酱",
      ru: "Шелковичный джем",
      ko: "오디 잼",
      es: "Mermelada de morera",
      it: "Marmellata di gelso",
      nl: "Moerbeienjam",
      pt: "Geleia de amoreira"
    }
  },
  {
    id: "confiture_gingembre",
    name: {
      fr: "Confiture de gingembre",
      th: "แยมขิง",
      en: "Ginger Jam",
      de: "Ingwer-Konfitüre",
      ja: "ジンジャージャム",
      zh: "姜味果酱",
      ru: "Имбирный джем",
      ko: "생강 잼",
      es: "Mermelada de jengibre",
      it: "Marmellata di zenzero",
      nl: "Gemberjam",
      pt: "Geleia de gengibre"
    }
  },
  {
    id: "confiture_papaye_passion",
    name: {
      fr: "Confiture de papaye passion",
      th: "แยมมะละกอเสาวรส",
      en: "Papaya & Passion Fruit Jam",
      de: "Papaya-Passionsfrucht-Konfitüre",
      ja: "パパイヤとパッションフルーツのジャム",
      zh: "木瓜百香果酱",
      ru: "Джем из папайи и маракуйи",
      ko: "파파야 패션프루트 잼",
      es: "Mermelada de papaya y maracuyá",
      it: "Marmellata di papaya e frutto della passione",
      nl: "Papaja-passievruchtjam",
      pt: "Geleia de papaia e maracujá"
    }
  },
  {
    id: "confiture_ananas",
    name: {
      fr: "Confiture d'ananas",
      th: "แยมสับปะรด",
      en: "Pineapple Jam",
      de: "Ananasmarmelade",
      ja: "パイナップルジャム",
      zh: "菠萝果酱",
      ru: "Ананасовый джем",
      ko: "파인애플 잼",
      es: "Mermelada de piña",
      it: "Marmellata di ananas",
      nl: "Ananasjam",
      pt: "Geleia de abacaxi"
    }
  },
  {
    id: "confiture_ananas_passion",
    name: {
      fr: "Confiture d'ananas passion",
      th: "แยมสับปะรดเสาวรส",
      en: "Pineapple & Passion Fruit Jam",
      de: "Ananas-Passionsfrucht-Konfitüre",
      ja: "パイナップルとパッションフルーツのジャム",
      zh: "菠萝百香果酱",
      ru: "Ананасово-маракуйевый джем",
      ko: "파인애플 패션프루트 잼",
      es: "Mermelada de piña y maracuyá",
      it: "Marmellata di ananas e frutto della passione",
      nl: "Ananas-passievruchtjam",
      pt: "Geleia de abacaxi e maracujá"
    }
  },
  {
    id: "confiture_mangue",
    name: {
      fr: "Confiture de mangue",
      th: "แยมมะม่วง",
      en: "Mango Jam",
      de: "Mangomarmelade",
      ja: "マンゴージャム",
      zh: "芒果果酱",
      ru: "Манговый джем",
      ko: "망고 잼",
      es: "Mermelada de mango",
      it: "Marmellata di mango",
      nl: "Mangojam",
      pt: "Geleia de manga"
    }
  },
  {
    id: "confiture_mangue_passion",
    name: {
      fr: "Confiture de mangue passion",
      th: "แยมมะม่วงเสาวรส",
      en: "Mango & Passion Fruit Jam",
      de: "Mango-Passionsfrucht-Konfitüre",
      ja: "マンゴーとパッションフルーツのジャム",
      zh: "芒果百香果酱",
      ru: "Манго-маракуйевый джем",
      ko: "망고 패션프루트 잼",
      es: "Mermelada de mango y maracuyá",
      it: "Marmellata di mango e frutto della passione",
      nl: "Mango-passievruchtjam",
      pt: "Geleia de manga e maracujá"
    }
  },
  {
    id: "confiture_mangue_verte_citron_vert",
    name: {
      fr: "Confiture de mangue verte & citron vert",
      th: "แยมมะม่วงดิบและมะนาว",
      en: "Green Mango & Lime Jam",
      de: "Grüne Mango-Limetten-Konfitüre",
      ja: "青マンゴーとライムのジャム",
      zh: "青芒果青柠果酱",
      ru: "Джем из зелёного манго и лайма",
      ko: "풋망고 라임 잼",
      es: "Mermelada de mango verde y lima",
      it: "Marmellata di mango verde e lime",
      nl: "Groene mango-limoenjam",
      pt: "Geleia de manga verde e limão"
    }
  },
  {
    id: "confiture_passion",
    name: {
      fr: "Confiture de fruit de la passion",
      th: "แยมเสาวรส",
      en: "Passion Fruit Jam",
      de: "Passionsfruchtkonfitüre",
      ja: "パッションフルーツジャム",
      zh: "百香果酱",
      ru: "Джем из маракуйи",
      ko: "패션프루트 잼",
      es: "Mermelada de maracuyá",
      it: "Marmellata di frutto della passione",
      nl: "Passievruchtjam",
      pt: "Geleia de maracujá"
    }
  },
  {
    id: "confiture_coco",
    name: {
      fr: "Confiture de coco",
      th: "แยมมะพร้าว",
      en: "Coconut Jam",
      de: "Kokoskonfitüre",
      ja: "ココナッツジャム",
      zh: "椰子果酱",
      ru: "Кокосовый джем",
      ko: "코코넛 잼",
      es: "Mermelada de coco",
      it: "Marmellata di cocco",
      nl: "Kokosjam",
      pt: "Geleia de coco"
    }
  }
];

export const getIngredientById = (id) => {
  return ingredients.find(ingredient => ingredient.id === id);
};

// Rendre ingredients accessible globalement pour les autres scripts
window.ingredients = ingredients; 