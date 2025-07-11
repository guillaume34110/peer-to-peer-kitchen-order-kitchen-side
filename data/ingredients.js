const ingredients = [
  {
    id: "farine",
    name: {
      fr: "Farine",
      th: "แป้ง"
    }
  },
  {
    id: "oeufs",
    name: {
      fr: "Œufs",
      th: "ไข่"
    }
  },
  {
    id: "lait",
    name: {
      fr: "Lait",
      th: "นม"
    }
  },
  {
    id: "beurre",
    name: {
      fr: "Beurre",
      th: "เนย"
    }
  },
  {
    id: "sucre",
    name: {
      fr: "Sucre",
      th: "น้ำตาล"
    }
  },
  {
    id: "sel",
    name: {
      fr: "Sel",
      th: "เกลือ"
    }
  },
  {
    id: "jambon",
    name: {
      fr: "Jambon",
      th: "แฮม"
    }
  },
  {
    id: "fromage",
    name: {
      fr: "Fromage",
      th: "ชีส"
    }
  },
  {
    id: "champignons",
    name: {
      fr: "Champignons",
      th: "เห็ด"
    }
  },
  {
    id: "chocolat",
    name: {
      fr: "Chocolat",
      th: "ช็อกโกแลต"
    }
  },
  {
    id: "bananes",
    name: {
      fr: "Bananes",
      th: "กล้วย"
    }
  },
  {
    id: "vanille",
    name: {
      fr: "Vanille",
      th: "วานิลลา"
    }
  },
  {
    id: "cafe",
    name: {
      fr: "Café",
      th: "กาแฟ"
    }
  },
  {
    id: "the",
    name: {
      fr: "Thé",
      th: "ชา"
    }
  },
  {
    id: "eau",
    name: {
      fr: "Eau",
      th: "น้ำ"
    }
  }
];

export const getIngredientById = (id) => {
  return ingredients.find(ingredient => ingredient.id === id);
};

// Rendre ingredients accessible globalement pour les autres scripts
window.ingredients = ingredients; 