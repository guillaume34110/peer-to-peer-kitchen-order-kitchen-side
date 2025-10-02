const menuItems = [
    {
      id: "cafe",
      reference: "B1",
      price: 40,
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
      },
      category: {
        id: "boisson",
        name: {
          fr: "Boissons",
          th: "เครื่องดื่ม",
          en: "Drinks",
          de: "Getränke",
          ja: "ドリンク",
          zh: "饮品",
          ru: "Напитки",
          ko: "음료",
          es: "Bebidas",
          it: "Bevande",
          nl: "Drankjes",
          pt: "Bebidas"
        }
      },
      image: "assets/images/cafe.png",
      quantity: {
        amount: 50,
        infinite: true
      },
      ingredients: ["cafe", "eau"],
      supplements: []
    },
    {
      id: "tea",
      reference: "B2",
      price: 30,
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
      },
      category: {
        id: "boisson",
        name: {
          fr: "Boissons",
          th: "เครื่องดื่ม",
          en: "Drinks",
          de: "Getränke",
          ja: "ドリンク",
          zh: "饮品",
          ru: "Напитки",
          ko: "음료",
          es: "Bebidas",
          it: "Bevande",
          nl: "Drankjes",
          pt: "Bebidas"
        }
      },
      image: "assets/images/the.png",
      quantity: {
        amount: 50,
        infinite: true
      },
      ingredients: ["the", "eau"],
      supplements: []
    },
    {
      id: "water",
      reference: "B3",
      price: 10,
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
      },
      category: {
        id: "boisson",
        name: {
          fr: "Boissons",
          th: "เครื่องดื่ม",
          en: "Drinks",
          de: "Getränke",
          ja: "ドリンク",
          zh: "饮品",
          ru: "Напитки",
          ko: "음료",
          es: "Bebidas",
          it: "Bevande",
          nl: "Drankjes",
          pt: "Bebidas"
        }
      },
      image: "assets/images/water.png",
      quantity: {
        amount: 100,
        infinite: true
      },
      ingredients: ["eau"],
      supplements: []
    },
    {
      id: "crepejambonfromageoeuf",
      reference: "S1",
      price: 110,
      name: {
        fr: "Crêpe jambon fromage oeuf",
        th: "ครีบจะมันฟอร์จีโอฟ",
        en: "Ham, Cheese & Egg Crêpe",
        de: "Crêpe mit Schinken, Käse und Ei",
        ja: "ハム・チーズ・卵のクレープ",
        zh: "火腿芝士鸡蛋可丽饼",
        ru: "Креп с ветчиной, сыром и яйцом",
        ko: "햄 치즈 달걀 크레프",
        es: "Crepe de jamón, queso y huevo",
        it: "Crêpe con prosciutto, formaggio e uovo",
        nl: "Crêpe met ham, kaas en ei",
        pt: "Crepe de presunto, queijo e ovo"
      },
      category: {
        id: "sale",
        name: {
          fr: "Salés",
          th: "ของคาว",
          en: "Savory",
          de: "Herzhaft",
          ja: "食事系",
          zh: "咸味",
          ru: "Солёные",
          ko: "짭짤한",
          es: "Salados",
          it: "Salati",
          nl: "Hartig",
          pt: "Salgados"
        }
      },
      image: "assets/images/crepe_jambon_fromage_oeuf.png",
      quantity: {
        amount: 20,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "jambon", "fromage", "beurre", "sel"],
      supplements: []
    },
    {
      id: "crepechampignonfromageoeuf",
      reference: "S2",
      price: 110,
      name: {
        fr: "Crêpe champignon fromage oeuf",
        th: "ครีบชั่มฟอร์จีโอฟ",
        en: "Mushroom, Cheese & Egg Crêpe",
        de: "Crêpe mit Pilzen, Käse und Ei",
        ja: "きのこ・チーズ・卵のクレープ",
        zh: "蘑菇芝士鸡蛋可丽饼",
        ru: "Креп с грибами, сыром и яйцом",
        ko: "버섯 치즈 달걀 크레프",
        es: "Crepe de champiñones, queso y huevo",
        it: "Crêpe con funghi, formaggio e uovo",
        nl: "Crêpe met champignons, kaas en ei",
        pt: "Crepe de cogumelos, queijo e ovo"
      },
      category: {
        id: "sale",
        name: {
          fr: "Salés",
          th: "ของคาว",
          en: "Savory",
          de: "Herzhaft",
          ja: "食事系",
          zh: "咸味",
          ru: "Солёные",
          ko: "짭짤한",
          es: "Salados",
          it: "Salati",
          nl: "Hartig",
          pt: "Salgados"
        }
      },
      image: "assets/images/crepe_champignon_fromage_oeuf.png",
      quantity: {
        amount: 25,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "champignons", "fromage", "beurre", "sel"],
      supplements: []
    },
    {
      id: "crepesucree",
      reference: "SU1",
      price: 60,
      name: {
        fr: "Crêpe sucrée",
        th: "ครีบสุกรี",
        en: "Sweet Crêpe",
        de: "Süße Crêpe",
        ja: "甘いクレープ",
        zh: "甜味可丽饼",
        ru: "Сладкий креп",
        ko: "달콤한 크레프",
        es: "Crepe dulce",
        it: "Crêpe dolce",
        nl: "Zoete crêpe",
        pt: "Crepe doce"
      },
      category: {
        id: "sucre",
        name: {
          fr: "Sucrés",
          th: "ของหวาน",
          en: "Sweet",
          de: "Süß",
          ja: "甘い",
          zh: "甜味",
          ru: "Сладкие",
          ko: "달콤한",
          es: "Dulces",
          it: "Dolci",
          nl: "Zoet",
          pt: "Doces"
        }
      },
      image: "assets/images/crepe_sucree.png",
      quantity: {
        amount: 30,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "sucre", "beurre", "vanille"],
      supplements: []
    },
    {
      id: "crepechocolatbannane",
      reference: "SU2",
      price: 80,
      name: {
        fr: "Crêpe chocolat banane",
        th: "ครีบชอคโละบันนัน",
        en: "Chocolate Banana Crêpe",
        de: "Schoko-Bananen-Crêpe",
        ja: "チョコバナナクレープ",
        zh: "巧克力香蕉可丽饼",
        ru: "Креп с шоколадом и бананом",
        ko: "초코 바나나 크레프",
        es: "Crepe de chocolate y plátano",
        it: "Crêpe al cioccolato e banana",
        nl: "Choco-banaan crêpe",
        pt: "Crepe de chocolate e banana"
      },
      category: {
        id: "sucre",
        name: {
          fr: "Sucrés",
          th: "ของหวาน",
          en: "Sweet",
          de: "Süß",
          ja: "甘い",
          zh: "甜味",
          ru: "Сладкие",
          ko: "달콤한",
          es: "Dulces",
          it: "Dolci",
          nl: "Zoet",
          pt: "Doces"
        }
      },
      image: "assets/images/crepe_chocolat_banane.png",
      quantity: {
        amount: 15,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "chocolat", "bananes", "beurre", "sucre"],
      supplements: []
    },
    {
      id: "wrapkapao",
      reference: "S3",
      price: 140,
      name: {
        fr: "Wrap Pad Kapao",
        th: "แร็พผัดกะเพรา",
        en: "Pad Krapao Wrap",
        de: "Pad Krapao Wrap",
        ja: "ガパオラップ",
        zh: "打抛罗勒卷饼",
        ru: "Врап Пад Кра Пау",
        ko: "팟크라파오 랩",
        es: "Wrap Pad Krapao",
        it: "Wrap Pad Krapao",
        nl: "Pad Krapao-wrap",
        pt: "Wrap Pad Krapao"
      },
      category: {
        id: "sale",
        name: {
          fr: "Salés",
          th: "ของคาว",
          en: "Savory",
          de: "Herzhaft",
          ja: "食事系",
          zh: "咸味",
          ru: "Солёные",
          ko: "짭짤한",
          es: "Salados",
          it: "Salati",
          nl: "Hartig",
          pt: "Salgados"
        }
      },
      image: "assets/images/wrapkapao.png",
      quantity: {
        amount: 20,
        infinite: false
      },
      ingredients: ["wrap", "porc", "basilic_thai", "piment", "ail", "sauce_huitre"],
      supplements: []
    },
    {
      id: "massamanwrap",
      reference: "S4",
      price: 140,
      name: {
        fr: "Wrap Massaman",
        th: "แร็พมัสมั่น",
        en: "Massaman Wrap",
        de: "Massaman-Wrap",
        ja: "マッサマンラップ",
        zh: "玛萨曼咖喱卷饼",
        ru: "Врап Массаман",
        ko: "마사만 랩",
        es: "Wrap Massaman",
        it: "Wrap Massaman",
        nl: "Massaman-wrap",
        pt: "Wrap Massaman"
      },
      category: {
        id: "sale",
        name: {
          fr: "Salés",
          th: "ของคาว",
          en: "Savory",
          de: "Herzhaft",
          ja: "食事系",
          zh: "咸味",
          ru: "Солёные",
          ko: "짭짤한",
          es: "Salados",
          it: "Salati",
          nl: "Hartig",
          pt: "Salgados"
        }
      },
      image: "assets/images/massamanwrap.png",
      quantity: {
        amount: 20,
        infinite: false
      },
      ingredients: ["wrap", "poulet", "pomme_de_terre", "arachides", "curry_massaman", "lait_de_coco", "oignon"],
      supplements: []
    },
    {
      id: "wrapfeta",
      reference: "S5",
      price: 120,
      name: {
        fr: "Wrap crudités à la feta",
        th: "แร็พผักสดกับชีสเฟต้า",
        en: "Feta Crudités Wrap",
        de: "Crudités-Feta-Wrap",
        ja: "フェタチーズと野菜のラップ",
        zh: "菲达奶酪蔬菜卷饼",
        ru: "Врап с овощами и фетой",
        ko: "페타 치즈 야채 랩",
        es: "Wrap de crudités con feta",
        it: "Wrap crudités alla feta",
        nl: "Wrap met crudités en feta",
        pt: "Wrap de crudités com feta"
      },
      category: {
        id: "sale",
        name: {
          fr: "Salés",
          th: "ของคาว",
          en: "Savory",
          de: "Herzhaft",
          ja: "食事系",
          zh: "咸味",
          ru: "Солёные",
          ko: "짭짤한",
          es: "Salados",
          it: "Salati",
          nl: "Hartig",
          pt: "Salgados"
        }
      },
      image: "assets/images/fetawrap.png",
      quantity: {
        amount: 15,
        infinite: false
      },
      ingredients: ["wrap", "laitue", "concombre", "carotte", "papaye_verte", "tomates_cerises", "feta", "huile_olive", "citron", "herbes_fraiches", "sel"],
      supplements: []
    },
    {
      id: "crepeconfiturefraise",
      reference: "C1",
      price: 70,
      name: {
        fr: "Crêpe confiture de fraise",
        th: "เครปแยมสตรอเบอร์รี่",
        en: "Strawberry Jam Crêpe",
        de: "Crêpe mit Erdbeermarmelade",
        ja: "いちごジャムクレープ",
        zh: "草莓果酱可丽饼",
        ru: "Креп с клубничным джемом",
        ko: "딸기 잼 크레프",
        es: "Crepe de mermelada de fresa",
        it: "Crêpe con marmellata di fragole",
        nl: "Crêpe met aardbeienjam",
        pt: "Crepe de geleia de morango"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม",
          en: "Jams",
          de: "Konfitüren",
          ja: "ジャム",
          zh: "果酱",
          ru: "Джемы",
          ko: "잼",
          es: "Mermeladas",
          it: "Confetture",
          nl: "Confituur",
          pt: "Geleias"
        }
      },
      image: "assets/images/crepe_confiture_fraise.png",
      quantity: {
        amount: 30,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "sucre", "beurre", "confiture_fraise"],
      supplements: []
    },
    {
      id: "crepeconfituremure",
      reference: "C2",
      price: 70,
      name: {
        fr: "Crêpe confiture de mûre",
        th: "เครปแยมแบล็คเบอร์รี่",
        en: "Blackberry Jam Crêpe",
        de: "Crêpe mit Brombeermarmelade",
        ja: "ブラックベリージャムクレープ",
        zh: "黑莓果酱可丽饼",
        ru: "Креп с ежевичным джемом",
        ko: "블랙베리 잼 크레프",
        es: "Crepe de mermelada de mora",
        it: "Crêpe con marmellata di mora",
        nl: "Crêpe met bramenjam",
        pt: "Crepe de geleia de amora"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม",
          en: "Jams",
          de: "Konfitüren",
          ja: "ジャム",
          zh: "果酱",
          ru: "Джемы",
          ko: "잼",
          es: "Mermeladas",
          it: "Confetture",
          nl: "Confituur",
          pt: "Geleias"
        }
      },
      image: "assets/images/crepe_confiture_mure.png",
      quantity: {
        amount: 30,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "sucre", "beurre", "confiture_mure"],
      supplements: []
    },
    {
      id: "crepeconfituremulberry",
      reference: "C3",
      price: 70,
      name: {
        fr: "Crêpe confiture de mûre (mulberry)",
        th: "เครปแยมมัลเบอร์รี่",
        en: "Mulberry Jam Crêpe",
        de: "Crêpe mit Maulbeermarmelade",
        ja: "マルベリージャムクレープ",
        zh: "桑葚果酱可丽饼",
        ru: "Креп с шелковичным джемом",
        ko: "뽕나무 열매 잼 크레프",
        es: "Crepe de mermelada de morera",
        it: "Crêpe con marmellata di gelso",
        nl: "Crêpe met moerbeienjam",
        pt: "Crepe de geleia de amoreira"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม",
          en: "Jams",
          de: "Konfitüren",
          ja: "ジャム",
          zh: "果酱",
          ru: "Джемы",
          ko: "잼",
          es: "Mermeladas",
          it: "Confetture",
          nl: "Confituur",
          pt: "Geleias"
        }
      },
      image: "assets/images/crepe_confiture_mulberry.png",
      quantity: {
        amount: 30,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "sucre", "beurre", "confiture_mulberry"],
      supplements: []
    },
    {
      id: "crepeconfituregingembre",
      reference: "C4",
      price: 70,
      name: {
        fr: "Crêpe confiture de gingembre",
        th: "เครปแยมขิง",
        en: "Ginger Jam Crêpe",
        de: "Crêpe mit Ingwermarmelade",
        ja: "ジンジャージャムクレープ",
        zh: "姜味果酱可丽饼",
        ru: "Креп с имбирным джемом",
        ko: "생강 잼 크레프",
        es: "Crepe de mermelada de jengibre",
        it: "Crêpe con marmellata di zenzero",
        nl: "Crêpe met gemberjam",
        pt: "Crepe de geleia de gengibre"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม",
          en: "Jams",
          de: "Konfitüren",
          ja: "ジャム",
          zh: "果酱",
          ru: "Джемы",
          ko: "잼",
          es: "Mermeladas",
          it: "Confetture",
          nl: "Confituur",
          pt: "Geleias"
        }
      },
      image: "assets/images/crepe_confiture_gingembre.png",
      quantity: {
        amount: 30,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "sucre", "beurre", "confiture_gingembre"],
      supplements: []
    },
    {
      id: "crepeconfiturepapayepassion",
      reference: "C5",
      price: 70,
      name: {
        fr: "Crêpe confiture papaye passion",
        th: "เครปแยมมะละกอเสาวรส",
        en: "Papaya & Passion Fruit Jam Crêpe",
        de: "Crêpe mit Papaya-Passionsfruchtmarmelade",
        ja: "パパイヤとパッションフルーツジャムのクレープ",
        zh: "木瓜百香果酱可丽饼",
        ru: "Креп с джемом из папайи и маракуйи",
        ko: "파파야 패션프루트 잼 크레프",
        es: "Crepe de mermelada de papaya y maracuyá",
        it: "Crêpe con marmellata di papaya e frutto della passione",
        nl: "Crêpe met papaja-passievruchtjam",
        pt: "Crepe de geleia de papaia e maracujá"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม",
          en: "Jams",
          de: "Konfitüren",
          ja: "ジャム",
          zh: "果酱",
          ru: "Джемы",
          ko: "잼",
          es: "Mermeladas",
          it: "Confetture",
          nl: "Confituur",
          pt: "Geleias"
        }
      },
      image: "assets/images/crepe_confiture_papaye_passion.png",
      quantity: {
        amount: 30,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "sucre", "beurre", "confiture_papaye_passion"],
      supplements: []
    },
    {
      id: "crepeconfitureananas",
      reference: "C6",
      price: 70,
      name: {
        fr: "Crêpe confiture d'ananas",
        th: "เครปแยมสับปะรด",
        en: "Pineapple Jam Crêpe",
        de: "Crêpe mit Ananasmarmelade",
        ja: "パイナップルジャムクレープ",
        zh: "菠萝果酱可丽饼",
        ru: "Креп с ананасовым джемом",
        ko: "파인애플 잼 크레프",
        es: "Crepe de mermelada de piña",
        it: "Crêpe con marmellata di ananas",
        nl: "Crêpe met ananasjam",
        pt: "Crepe de geleia de abacaxi"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม",
          en: "Jams",
          de: "Konfitüren",
          ja: "ジャム",
          zh: "果酱",
          ru: "Джемы",
          ko: "잼",
          es: "Mermeladas",
          it: "Confetture",
          nl: "Confituur",
          pt: "Geleias"
        }
      },
      image: "assets/images/crepe_confiture_ananas.png",
      quantity: {
        amount: 30,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "sucre", "beurre", "confiture_ananas"],
      supplements: []
    },
    {
      id: "crepeconfitureananaspassion",
      reference: "C7",
      price: 70,
      name: {
        fr: "Crêpe confiture ananas passion",
        th: "เครปแยมสับปะรดเสาวรส",
        en: "Pineapple & Passion Fruit Jam Crêpe",
        de: "Crêpe mit Ananas-Passionsfruchtmarmelade",
        ja: "パイナップルとパッションフルーツジャムのクレープ",
        zh: "菠萝百香果酱可丽饼",
        ru: "Креп с джемом из ананаса и маракуйи",
        ko: "파인애플 패션프루트 잼 크레프",
        es: "Crepe de mermelada de piña y maracuyá",
        it: "Crêpe con marmellata di ananas e frutto della passione",
        nl: "Crêpe met ananas-passievruchtjam",
        pt: "Crepe de geleia de abacaxi e maracujá"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม",
          en: "Jams",
          de: "Konfitüren",
          ja: "ジャム",
          zh: "果酱",
          ru: "Джемы",
          ko: "잼",
          es: "Mermeladas",
          it: "Confetture",
          nl: "Confituur",
          pt: "Geleias"
        }
      },
      image: "assets/images/crepe_confiture_ananas_passion.png",
      quantity: {
        amount: 30,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "sucre", "beurre", "confiture_ananas_passion"],
      supplements: []
    },
    {
      id: "crepeconfituremangue",
      reference: "C8",
      price: 70,
      name: {
        fr: "Crêpe confiture de mangue",
        th: "เครปแยมมะม่วง",
        en: "Mango Jam Crêpe",
        de: "Crêpe mit Mangomarmelade",
        ja: "マンゴージャムクレープ",
        zh: "芒果果酱可丽饼",
        ru: "Креп с манговым джемом",
        ko: "망고 잼 크레프",
        es: "Crepe de mermelada de mango",
        it: "Crêpe con marmellata di mango",
        nl: "Crêpe met mangojam",
        pt: "Crepe de geleia de manga"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม",
          en: "Jams",
          de: "Konfitüren",
          ja: "ジャム",
          zh: "果酱",
          ru: "Джемы",
          ko: "잼",
          es: "Mermeladas",
          it: "Confetture",
          nl: "Confituur",
          pt: "Geleias"
        }
      },
      image: "assets/images/crepe_confiture_mangue.png",
      quantity: {
        amount: 30,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "sucre", "beurre", "confiture_mangue"],
      supplements: []
    },
    {
      id: "crepeconfituremanguepassion",
      reference: "C9",
      price: 70,
      name: {
        fr: "Crêpe confiture mangue passion",
        th: "เครปแยมมะม่วงเสาวรส",
        en: "Mango & Passion Fruit Jam Crêpe",
        de: "Crêpe mit Mango-Passionsfruchtmarmelade",
        ja: "マンゴーとパッションフルーツジャムのクレープ",
        zh: "芒果百香果酱可丽饼",
        ru: "Креп с джемом из манго и маракуйи",
        ko: "망고 패션프루트 잼 크레프",
        es: "Crepe de mermelada de mango y maracuyá",
        it: "Crêpe con marmellata di mango e frutto della passione",
        nl: "Crêpe met mango-passievruchtjam",
        pt: "Crepe de geleia de manga e maracujá"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม",
          en: "Jams",
          de: "Konfitüren",
          ja: "ジャム",
          zh: "果酱",
          ru: "Джемы",
          ko: "잼",
          es: "Mermeladas",
          it: "Confetture",
          nl: "Confituur",
          pt: "Geleias"
        }
      },
      image: "assets/images/crepe_confiture_mangue_passion.png",
      quantity: {
        amount: 30,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "sucre", "beurre", "confiture_mangue_passion"],
      supplements: []
    },
    {
      id: "crepeconfituremanguevertecitronvert",
      reference: "C10",
      price: 70,
      name: {
        fr: "Crêpe confiture mangue verte & citron vert",
        th: "เครปแยมมะม่วงดิบและมะนาว",
        en: "Green Mango & Lime Jam Crêpe",
        de: "Crêpe mit grüner Mango-Limettenmarmelade",
        ja: "青マンゴーとライムジャムのクレープ",
        zh: "青芒果青柠果酱可丽饼",
        ru: "Креп с джемом из зелёного манго и лайма",
        ko: "풋망고 라임 잼 크레프",
        es: "Crepe de mermelada de mango verde y lima",
        it: "Crêpe con marmellata di mango verde e lime",
        nl: "Crêpe met groene mango-limoenjam",
        pt: "Crepe de geleia de manga verde e limão"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม",
          en: "Jams",
          de: "Konfitüren",
          ja: "ジャム",
          zh: "果酱",
          ru: "Джемы",
          ko: "잼",
          es: "Mermeladas",
          it: "Confetture",
          nl: "Confituur",
          pt: "Geleias"
        }
      },
      image: "assets/images/crepe_confiture_citron_vert_mangue.png",
      quantity: {
        amount: 30,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "sucre", "beurre", "confiture_mangue_verte_citron_vert"],
      supplements: []
    },
    {
      id: "crepeconfiturepassion",
      reference: "C11",
      price: 70,
      name: {
        fr: "Crêpe confiture de fruit de la passion",
        th: "เครปแยมเสาวรส",
        en: "Passion Fruit Jam Crêpe",
        de: "Crêpe mit Passionsfruchtmarmelade",
        ja: "パッションフルーツジャムクレープ",
        zh: "百香果果酱可丽饼",
        ru: "Креп с джемом из маракуйи",
        ko: "패션프루트 잼 크레프",
        es: "Crepe de mermelada de maracuyá",
        it: "Crêpe con marmellata di frutto della passione",
        nl: "Crêpe met passievruchtjam",
        pt: "Crepe de geleia de maracujá"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม",
          en: "Jams",
          de: "Konfitüren",
          ja: "ジャム",
          zh: "果酱",
          ru: "Джемы",
          ko: "잼",
          es: "Mermeladas",
          it: "Confetture",
          nl: "Confituur",
          pt: "Geleias"
        }
      },
      image: "assets/images/crepe_confiture_passion.png",
      quantity: {
        amount: 30,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "sucre", "beurre", "confiture_passion"],
      supplements: []
    },
    {
      id: "crepeconfiturecoco",
      reference: "C12",
      price: 70,
      name: {
        fr: "Crêpe confiture de coco",
        th: "เครปแยมมะพร้าว",
        en: "Coconut Jam Crêpe",
        de: "Crêpe mit Kokosnussmarmelade",
        ja: "ココナッツジャムクレープ",
        zh: "椰子果酱可丽饼",
        ru: "Креп с кокосовым джемом",
        ko: "코코넛 잼 크레프",
        es: "Crepe de mermelada de coco",
        it: "Crêpe con marmellata di cocco",
        nl: "Crêpe met kokosjam",
        pt: "Crepe de geleia de coco"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม",
          en: "Jams",
          de: "Konfitüren",
          ja: "ジャム",
          zh: "果酱",
          ru: "Джемы",
          ko: "잼",
          es: "Mermeladas",
          it: "Confetture",
          nl: "Confituur",
          pt: "Geleias"
        }
      },
      image: "assets/images/crepe_confiture_coco.png",
      quantity: {
        amount: 30,
        infinite: false
      },
      ingredients: ["farine", "oeufs", "lait", "sucre", "beurre", "confiture_coco"],
      supplements: []
    }
  ];
  
  export const getMenuItemById = (id) => {
    return menuItems.find(item => item.id === id);
  };

  export const getMenuItemByReference = (reference) => {
    return menuItems.find(item => item.reference === reference);
  };

  // Rendre menuItems accessible globalement pour les autres scripts
  window.menuItems = menuItems; 