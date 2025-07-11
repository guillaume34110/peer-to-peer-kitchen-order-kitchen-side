/**
 * Module de gestion des ingrédients
 * Gère le stockage localStorage et les opérations CRUD sur les ingrédients
 */
const IngredientsManager = {
  STORAGE_KEY: 'kitchen_ingredients',
  
  /**
   * Initialise le gestionnaire d'ingrédients
   */
  init() {
    this.loadIngredientsFromStorage();
    console.log('IngredientsManager initialisé');
  },

  /**
   * Charge les ingrédients depuis localStorage ou utilise le template par défaut
   */
  loadIngredientsFromStorage() {
    const storedIngredients = localStorage.getItem(this.STORAGE_KEY);
    
    if (storedIngredients) {
      try {
        const ingredients = JSON.parse(storedIngredients);
        window.ingredients = ingredients;
        console.log('Ingrédients chargés depuis localStorage:', ingredients.length, 'ingrédients');
      } catch (error) {
        console.error('Erreur lors du chargement des ingrédients:', error);
        this.resetToDefaultIngredients();
      }
    } else {
      // Premier chargement, sauvegarder le template par défaut
      this.saveIngredientsToStorage(window.ingredients);
      console.log('Ingrédients par défaut sauvegardés en localStorage');
    }
  },

  /**
   * Sauvegarde les ingrédients en localStorage
   */
  saveIngredientsToStorage(ingredients = window.ingredients) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ingredients));
      window.ingredients = ingredients;
      console.log('Ingrédients sauvegardés en localStorage');
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des ingrédients:', error);
      return false;
    }
  },

  /**
   * Remet les ingrédients par défaut depuis ingredients.js
   */
  resetToDefaultIngredients() {
    // Recharger la page pour récupérer le ingredients.js original
    if (window.ingredients && window.ingredients.length > 0) {
      this.saveIngredientsToStorage(window.ingredients);
    }
  },

  /**
   * Obtient tous les ingrédients
   */
  getIngredients() {
    return window.ingredients || [];
  },

  /**
   * Obtient un ingrédient par son ID
   */
  getIngredientById(id) {
    return this.getIngredients().find(ingredient => ingredient.id === id);
  },

  /**
   * Ajoute un nouvel ingrédient
   */
  addIngredient(ingredient) {
    const ingredients = this.getIngredients();
    
    // Vérifier que l'ID n'existe pas déjà
    if (this.getIngredientById(ingredient.id)) {
      throw new Error(`Un ingrédient avec l'ID "${ingredient.id}" existe déjà`);
    }

    // Valider la structure de l'ingrédient
    if (!this.validateIngredient(ingredient)) {
      throw new Error('Structure d\'ingrédient invalide');
    }

    ingredients.push(ingredient);
    this.saveIngredientsToStorage(ingredients);
    
    // Envoyer les ingrédients mis à jour via WebSocket
    if (window.WebSocketManager && window.WebSocketManager.sendUpdatedIngredients) {
      window.WebSocketManager.sendUpdatedIngredients();
    }
    
    return ingredient;
  },

  /**
   * Met à jour un ingrédient existant
   */
  updateIngredient(id, updatedIngredient) {
    const ingredients = this.getIngredients();
    const index = ingredients.findIndex(ingredient => ingredient.id === id);
    
    if (index === -1) {
      throw new Error(`Ingrédient avec l'ID "${id}" non trouvé`);
    }

    // Si l'ID change, vérifier qu'il n'existe pas déjà
    if (updatedIngredient.id !== id && this.getIngredientById(updatedIngredient.id)) {
      throw new Error(`Un ingrédient avec l'ID "${updatedIngredient.id}" existe déjà`);
    }

    // Valider la structure
    if (!this.validateIngredient(updatedIngredient)) {
      throw new Error('Structure d\'ingrédient invalide');
    }

    ingredients[index] = updatedIngredient;
    this.saveIngredientsToStorage(ingredients);
    
    // Envoyer les ingrédients mis à jour via WebSocket
    if (window.WebSocketManager && window.WebSocketManager.sendUpdatedIngredients) {
      window.WebSocketManager.sendUpdatedIngredients();
    }
    
    return updatedIngredient;
  },

  /**
   * Supprime un ingrédient
   */
  deleteIngredient(id) {
    const ingredients = this.getIngredients();
    const index = ingredients.findIndex(ingredient => ingredient.id === id);
    
    if (index === -1) {
      throw new Error(`Ingrédient avec l'ID "${id}" non trouvé`);
    }

    const deletedIngredient = ingredients.splice(index, 1)[0];
    this.saveIngredientsToStorage(ingredients);
    
    // Envoyer les ingrédients mis à jour via WebSocket
    if (window.WebSocketManager && window.WebSocketManager.sendUpdatedIngredients) {
      window.WebSocketManager.sendUpdatedIngredients();
    }
    
    return deletedIngredient;
  },

  /**
   * Valide la structure d'un ingrédient
   */
  validateIngredient(ingredient) {
    if (!ingredient || typeof ingredient !== 'object') return false;
    if (!ingredient.id || typeof ingredient.id !== 'string') return false;
    if (!ingredient.name || typeof ingredient.name !== 'object') return false;
    if (!ingredient.name.fr || !ingredient.name.th) return false;
    
    return true;
  },

  /**
   * Crée un nouvel ingrédient avec une structure par défaut
   */
  createNewIngredient() {
    return {
      id: this.generateUniqueId(),
      name: {
        fr: "Nouvel ingrédient",
        th: "ส่วนผสมใหม่"
      }
    };
  },

  /**
   * Génère un ID unique pour un nouvel ingrédient
   */
  generateUniqueId() {
    let id;
    let counter = 1;
    
    do {
      id = `ingredient_${Date.now()}_${counter}`;
      counter++;
    } while (this.getIngredientById(id));
    
    return id;
  },

  /**
   * Duplique un ingrédient existant
   */
  duplicateIngredient(id) {
    const originalIngredient = this.getIngredientById(id);
    if (!originalIngredient) {
      throw new Error(`Ingrédient avec l'ID "${id}" non trouvé`);
    }

    const duplicatedIngredient = {
      ...originalIngredient,
      id: this.generateUniqueId(),
      name: {
        fr: originalIngredient.name.fr + " (copie)",
        th: originalIngredient.name.th + " (สำเนา)"
      }
    };

    return this.addIngredient(duplicatedIngredient);
  },

  /**
   * Importe des ingrédients depuis un fichier JSON
   */
  importIngredients(ingredientsData) {
    if (!Array.isArray(ingredientsData)) {
      throw new Error('Les ingrédients doivent être un tableau');
    }

    // Valider tous les ingrédients
    for (const ingredient of ingredientsData) {
      if (!this.validateIngredient(ingredient)) {
        throw new Error(`Ingrédient invalide: ${JSON.stringify(ingredient)}`);
      }
    }

    this.saveIngredientsToStorage(ingredientsData);
    
    // Envoyer les ingrédients mis à jour via WebSocket
    if (window.WebSocketManager && window.WebSocketManager.sendUpdatedIngredients) {
      window.WebSocketManager.sendUpdatedIngredients();
    }
    
    return ingredientsData;
  },

  /**
   * Exporte les ingrédients actuels
   */
  exportIngredients() {
    return this.getIngredients();
  },

  /**
   * Réinitialise les ingrédients avec le template par défaut
   */
  resetIngredients() {
    localStorage.removeItem(this.STORAGE_KEY);
    window.location.reload(); // Recharge pour récupérer le ingredients.js original
  }
};

// Rendre IngredientsManager accessible globalement
window.IngredientsManager = IngredientsManager; 