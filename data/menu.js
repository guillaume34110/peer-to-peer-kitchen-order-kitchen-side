const menuItems = [
    {
      id: "cafe",
      price: 40,
      name: {
        fr: "Café",
        th: "กาแฟ"
      },
      image: "assets/images/cafe.png",
      quantity: {
        amount: 50,
        infinite: true
      },
      ingredients: ["café", "eau"],
      supplements: []
    },
    {
      id: "tea",
      price: 30,
      name: {
        fr: "Thé",
        th: "ชา"
      },
      image: "assets/images/the.png",
      quantity: {
        amount: 50,
        infinite: true
      },
      ingredients: ["thé", "eau"],
      supplements: []
    },
    {
      id: "water",
      price: 10,
      name: {
        fr: "Eau",
        th: "น้ำ"
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
      price: 100,
      name: {
        fr: "Crêpe jambon fromage oeuf",
        th: "ครีบจะมันฟอร์จีโอฟ"
      },
      image: "assets/images/crepe_jambon_fromage_oeuf.png",
      quantity: {
        amount: 20,
        infinite: false
      },
      ingredients: ["farine", "œufs", "lait", "jambon", "fromage", "beurre", "sel"],
      supplements: []
    },
    {
      id: "crepechampignonfromageoeuf",
      price: 90,
      name: {
        fr: "Crêpe champignon fromage oeuf",
        th: "ครีบชั่มฟอร์จีโอฟ"
      },
      image: "assets/images/crepe_champignon_fromage_oeuf.png",
      quantity: {
        amount: 25,
        infinite: false
      },
      ingredients: ["farine", "œufs", "lait", "champignons", "fromage", "beurre", "sel"],
      supplements: []
    },
    {
      id: "crepesucree",
      price: 50,
      name: {
        fr: "Crêpe sucrée",
        th: "ครีบสุกรี"
      },
      image: "assets/images/crepe_sucree.png",
      quantity: {
        amount: 30,
        infinite: false
      },
      ingredients: ["farine", "œufs", "lait", "sucre", "beurre", "vanille"],
      supplements: []
    },
    {
      id: "crepechocolatbannane",
      price: 80,
      name: {
        fr: "Crêpe chocolat banane",
        th: "ครีบชอคโละบันนัน"
      },
      image: "assets/images/crepe_chocolat_banane.png",
      quantity: {
        amount: 15,
        infinite: false
      },
      ingredients: ["farine", "œufs", "lait", "chocolat", "bananes", "beurre", "sucre"],
      supplements: []
    },
  ];
  
  export const getMenuItemById = (id) => {
    return menuItems.find(item => item.id === id);
  }; 

  // Rendre menuItems accessible globalement pour les autres scripts
  window.menuItems = menuItems; 