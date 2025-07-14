/**
 * Module de gestion du menu
 * Gère le stockage localStorage et les opérations CRUD sur le menu
 */
const MenuManager = {
  STORAGE_KEY: 'kitchen_menu',
  
  /**
   * Initialise le menu manager
   */
  init() {
    this.loadMenuFromStorage();
    console.log('MenuManager initialisé');
  },

  /**
   * Charge le menu depuis localStorage ou utilise le template par défaut
   */
  loadMenuFromStorage() {
    const storedMenu = localStorage.getItem(this.STORAGE_KEY);
    
    if (storedMenu) {
      try {
        const menu = JSON.parse(storedMenu);
        window.menuItems = menu;
        console.log('Menu chargé depuis localStorage:', menu.length, 'items');
      } catch (error) {
        console.error('Erreur lors du chargement du menu:', error);
        this.resetToDefaultMenu();
      }
    } else {
      // Premier chargement, sauvegarder le template par défaut
      this.saveMenuToStorage(window.menuItems);
      console.log('Menu par défaut sauvegardé en localStorage');
    }
  },

  /**
   * Sauvegarde le menu en localStorage
   */
  saveMenuToStorage(menu = window.menuItems) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(menu));
      window.menuItems = menu;
      console.log('Menu sauvegardé en localStorage');

      //  TRIGGER : Notifier tous les clients de la mise à jour du menu
      if (window.WebSocketManager) {
        window.WebSocketManager.broadcastMenuUpdate();
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du menu:', error);
      return false;
    }
  },

  /**
   * Remet le menu par défaut depuis menu.js
   */
  resetToDefaultMenu() {
    // Recharger la page pour récupérer le menu.js original
    if (window.menuItems && window.menuItems.length > 0) {
      this.saveMenuToStorage(window.menuItems);
    }
  },

  /**
   * Obtient tous les items du menu
   */
  getMenuItems() {
    return window.menuItems || [];
  },

  /**
   * Obtient un item par son ID
   */
  getItemById(id) {
    return this.getMenuItems().find(item => item.id === id);
  },

  /**
   * Ajoute un nouvel item au menu
   */
  addItem(item) {
    const menu = this.getMenuItems();
    
    // Vérifier que l'ID n'existe pas déjà
    if (this.getItemById(item.id)) {
      throw new Error(`Un item avec l'ID "${item.id}" existe déjà`);
    }

    // Valider la structure de l'item
    if (!this.validateItem(item)) {
      throw new Error('Structure d\'item invalide');
    }

    menu.push(item);
    this.saveMenuToStorage(menu);
    return item;
  },

  /**
   * Met à jour un item existant
   */
  updateItem(id, updatedItem) {
    const menu = this.getMenuItems();
    const index = menu.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item avec l'ID "${id}" non trouvé`);
    }

    // Si l'ID change, vérifier qu'il n'existe pas déjà
    if (updatedItem.id !== id && this.getItemById(updatedItem.id)) {
      throw new Error(`Un item avec l'ID "${updatedItem.id}" existe déjà`);
    }

    // Valider la structure
    if (!this.validateItem(updatedItem)) {
      throw new Error('Structure d\'item invalide');
    }

    menu[index] = updatedItem;
    this.saveMenuToStorage(menu);
    return updatedItem;
  },

  /**
   * Supprime un item du menu
   */
  deleteItem(id) {
    const menu = this.getMenuItems();
    const index = menu.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item avec l'ID "${id}" non trouvé`);
    }

    const deletedItem = menu.splice(index, 1)[0];
    this.saveMenuToStorage(menu);
    return deletedItem;
  },

  /**
   * Valide la structure d'un item
   */
  validateItem(item) {
    if (!item || typeof item !== 'object') return false;
    if (!item.id || typeof item.id !== 'string') return false;
    if (!item.price || typeof item.price !== 'number') return false;
    if (!item.name || typeof item.name !== 'object') return false;
    if (!item.name.fr || !item.name.th) return false;
    
    // Vérifier la structure de la catégorie
    if (!item.category || typeof item.category !== 'object') return false;
    if (!item.category.id || typeof item.category.id !== 'string') return false;
    if (!item.category.name || typeof item.category.name !== 'object') return false;
    if (!item.category.name.fr || !item.category.name.th) return false;
    
    if (!item.image || typeof item.image !== 'string') return false;
    if (!item.quantity || typeof item.quantity !== 'object') return false;
    if (typeof item.quantity.amount !== 'number') return false;
    if (typeof item.quantity.infinite !== 'boolean') return false;
    
    // Vérifier que ingredients est un tableau (optionnel)
    if (item.ingredients && !Array.isArray(item.ingredients)) return false;
    
    // Vérifier que supplementPrice est un nombre (optionnel)
    if (item.supplementPrice && typeof item.supplementPrice !== 'number') return false;
    
    // Vérifier que supplements est un tableau (optionnel)
    if (item.supplements && !Array.isArray(item.supplements)) return false;
    
    return true;
  },

  /**
   * Crée un nouvel item avec une structure par défaut
   */
  createNewItem() {
    return {
      id: this.generateUniqueId(),
      price: 0,
      name: {
        fr: "Nouveau produit",
        th: "สินค้าใหม่"
      },
      category: {
        id: "autre",
        name: {
          fr: "Autre",
          th: "อื่นๆ"
        }
      },
      image: "https://picsum.photos/300/200",
      quantity: {
        amount: 10,
        infinite: false
      },
      ingredients: [],
      supplementPrice: 0,
      supplements: []
    };
  },

  /**
   * Génère un ID unique pour un nouvel item
   */
  generateUniqueId() {
    let id;
    let counter = 1;
    
    do {
      id = `item_${Date.now()}_${counter}`;
      counter++;
    } while (this.getItemById(id));
    
    return id;
  },

  /**
   * Duplique un item existant
   */
  duplicateItem(id) {
    const originalItem = this.getItemById(id);
    if (!originalItem) {
      throw new Error(`Item avec l'ID "${id}" non trouvé`);
    }

    const duplicatedItem = {
      ...originalItem,
      id: this.generateUniqueId(),
      name: {
        fr: originalItem.name.fr + " (copie)",
        th: originalItem.name.th + " (สำเนา)"
      }
    };

    return this.addItem(duplicatedItem);
  },

  /**
   * Importe un menu depuis un fichier JSON
   */
  importMenu(menuData) {
    if (!Array.isArray(menuData)) {
      throw new Error('Le menu doit être un tableau');
    }

    // Valider tous les items
    for (const item of menuData) {
      if (!this.validateItem(item)) {
        throw new Error(`Item invalide: ${JSON.stringify(item)}`);
      }
    }

    this.saveMenuToStorage(menuData);
    return menuData;
  },

  /**
   * Exporte le menu actuel
   */
  exportMenu() {
    return this.getMenuItems();
  },

  /**
   * Réinitialise le menu avec le template par défaut
   */
  resetMenu() {
    localStorage.removeItem(this.STORAGE_KEY);
    window.location.reload(); // Recharge pour récupérer le menu.js original
  }
};

// Rendre MenuManager accessible globalement
window.MenuManager = MenuManager; 