const menuItems = [
    {
      id: "cafe",
      reference: "B1",
      price: 40,
      name: {
        fr: "Café",
        th: "กาแฟ"
      },
      category: {
        id: "boisson",
        name: {
          fr: "Boissons",
          th: "เครื่องดื่ม"
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
        th: "ชา"
      },
      category: {
        id: "boisson",
        name: {
          fr: "Boissons",
          th: "เครื่องดื่ม"
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
        th: "น้ำ"
      },
      category: {
        id: "boisson",
        name: {
          fr: "Boissons",
          th: "เครื่องดื่ม"
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
        th: "ครีบจะมันฟอร์จีโอฟ"
      },
      category: {
        id: "sale",
        name: {
          fr: "Salés",
          th: "ของคาว"
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
        th: "ครีบชั่มฟอร์จีโอฟ"
      },
      category: {
        id: "sale",
        name: {
          fr: "Salés",
          th: "ของคาว"
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
        th: "ครีบสุกรี"
      },
      category: {
        id: "sucre",
        name: {
          fr: "Sucrés",
          th: "ของหวาน"
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
        th: "ครีบชอคโละบันนัน"
      },
      category: {
        id: "sucre",
        name: {
          fr: "Sucrés",
          th: "ของหวาน"
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
        th: "แร็พผัดกะเพรา"
      },
      category: {
        id: "sale",
        name: {
          fr: "Salés",
          th: "ของคาว"
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
        th: "แร็พมัสมั่น"
      },
      category: {
        id: "sale",
        name: {
          fr: "Salés",
          th: "ของคาว"
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
        th: "แร็พผักสดกับชีสเฟต้า"
      },
      category: {
        id: "sale",
        name: {
          fr: "Salés",
          th: "ของคาว"
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
        th: "เครปแยมสตรอเบอร์รี่"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม"
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
        th: "เครปแยมแบล็คเบอร์รี่"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม"
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
        th: "เครปแยมมัลเบอร์รี่"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม"
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
        th: "เครปแยมขิง"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม"
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
        th: "เครปแยมมะละกอเสาวรส"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม"
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
        th: "เครปแยมสับปะรด"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม"
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
        th: "เครปแยมสับปะรดเสาวรส"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม"
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
        th: "เครปแยมมะม่วง"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม"
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
        th: "เครปแยมมะม่วงเสาวรส"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม"
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
        th: "เครปแยมมะม่วงดิบและมะนาว"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม"
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
        th: "เครปแยมเสาวรส"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม"
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
        th: "เครปแยมมะพร้าว"
      },
      category: {
        id: "confiture",
        name: {
          fr: "Confitures",
          th: "แยม"
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