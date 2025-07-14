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
  },
  {
    id: "wrap",
    name: {
      fr: "Wrap",
      th: "แผ่นแป้ง"
    }
  },
  {
    id: "poulet",
    name: {
      fr: "Poulet",
      th: "ไก่"
    }
  },
  {
    id: "basilic_thai",
    name: {
      fr: "Basilic Thaï",
      th: "กะเพรา"
    }
  },
  {
    id: "piment",
    name: {
      fr: "Piment",
      th: "พริก"
    }
  },
  {
    id: "ail",
    name: {
      fr: "Ail",
      th: "กระเทียม"
    }
  },
  {
    id: "sauce_huitre",
    name: {
      fr: "Sauce d'huître",
      th: "ซอสหอยนางรม"
    }
  },
  {
    id: "boeuf",
    name: {
      fr: "Bœuf",
      th: "เนื้อวัว"
    }
  },
  {
    id: "pomme_de_terre",
    name: {
      fr: "Pomme de terre",
      th: "มันฝรั่ง"
    }
  },
  {
    id: "arachides",
    name: {
      fr: "Arachides",
      th: "ถั่วลิสง"
    }
  },
  {
    id: "curry_massaman",
    name: {
      fr: "Curry Massaman",
      th: "แกงมัสมั่น"
    }
  },
  {
    id: "lait_de_coco",
    name: {
      fr: "Lait de coco",
      th: "กะทิ"
    }
  },
  {
    id: "oignon",
    name: {
      fr: "Oignon",
      th: "หัวหอม"
    }
  },
  {
    id: "porc",
    name: {
      fr: "Porc",
      th: "หมู"
    }
  }
];

export const getIngredientById = (id) => {
  return ingredients.find(ingredient => ingredient.id === id);
};

// Rendre ingredients accessible globalement pour les autres scripts
window.ingredients = ingredients; 