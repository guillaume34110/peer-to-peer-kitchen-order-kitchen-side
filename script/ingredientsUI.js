/**
 * Module de l'interface utilisateur pour la gestion des ingrédients
 * Gère l'affichage et l'édition des ingrédients disponibles
 */
const IngredientsUI = {
  currentEditingIngredient: null,

  /**
   * Initialise l'interface de gestion des ingrédients
   */
  init() {
    this.createIngredientsContainer();
    this.bindEvents();
    console.log('IngredientsUI initialisé');
  },

  /**
   * Crée le conteneur principal pour l'interface ingrédients
   */
  createIngredientsContainer() {
    const main = document.querySelector('.main');
    
    // Créer le conteneur pour la vue ingrédients
    const ingredientsView = document.createElement('div');
    ingredientsView.className = 'ingredients-view';
    ingredientsView.id = 'ingredients-view';
    ingredientsView.style.display = 'none';
    
    ingredientsView.innerHTML = `
      <div class="ingredients-header">
        <h2 data-i18n="ingredientsManagement">${I18n.t('ingredientsManagement')}</h2>
        <div class="ingredients-actions">
          <button id="add-ingredient" class="btn btn--primary">
            <span data-i18n="addIngredient">➕ ${I18n.t('addIngredient')}</span>
          </button>
          <button id="import-ingredients" class="btn btn--secondary">
            <span data-i18n="importIngredients">📥 ${I18n.t('importIngredients')}</span>
          </button>
          <button id="export-ingredients" class="btn btn--secondary">
            <span data-i18n="exportIngredients">📤 ${I18n.t('exportIngredients')}</span>
          </button>
          <button id="reset-ingredients" class="btn btn--danger">
            <span data-i18n="resetIngredients">🔄 ${I18n.t('resetIngredients')}</span>
          </button>
        </div>
      </div>
      <div class="ingredients-grid" id="ingredients-grid">
        <!-- Cartes d'ingrédients générées dynamiquement -->
      </div>
    `;
    
    main.appendChild(ingredientsView);
    
    // Créer le modal d'édition
    this.createEditModal();
  },

  /**
   * Crée le modal d'édition des ingrédients
   */
  createEditModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'ingredients-edit-modal';
    
    modal.innerHTML = `
      <div class="modal__content modal__content--large">
        <h3 id="ingredients-edit-modal-title" data-i18n="editIngredient">${I18n.t('editIngredient')}</h3>
        
        <form id="ingredients-form" class="ingredients-form">
          <div class="form-row">
            <div class="form-group">
              <label for="ingredient-id" data-i18n="ingredientId">${I18n.t('ingredientId')} :</label>
              <input type="text" id="ingredient-id" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="ingredient-name-fr" data-i18n="nameFr">${I18n.t('nameFr')} :</label>
              <input type="text" id="ingredient-name-fr" required>
            </div>
            <div class="form-group">
              <label for="ingredient-name-th" data-i18n="nameTh">${I18n.t('nameTh')} :</label>
              <input type="text" id="ingredient-name-th" required>
            </div>
          </div>
          

        </form>
        
        <div class="modal__actions">
          <button type="button" id="save-ingredient" class="btn btn--primary" data-i18n="save">${I18n.t('save')}</button>
          <button type="button" id="duplicate-ingredient" class="btn btn--secondary" data-i18n="duplicate">${I18n.t('duplicate')}</button>
          <button type="button" id="delete-ingredient" class="btn btn--danger" data-i18n="delete">${I18n.t('delete')}</button>
          <button type="button" id="cancel-ingredient-edit" class="btn btn--secondary" data-i18n="cancel">${I18n.t('cancel')}</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  },

  /**
   * Attache les événements
   */
  bindEvents() {
    // Bouton ajouter
    document.getElementById('add-ingredient')?.addEventListener('click', () => {
      this.openEditModal();
    });

    // Boutons d'actions des ingrédients
    document.getElementById('import-ingredients')?.addEventListener('click', () => this.importIngredients());
    document.getElementById('export-ingredients')?.addEventListener('click', () => this.exportIngredients());
    document.getElementById('reset-ingredients')?.addEventListener('click', () => this.resetIngredients());

    // Modal d'édition
    document.getElementById('save-ingredient')?.addEventListener('click', () => this.saveIngredient());
    document.getElementById('duplicate-ingredient')?.addEventListener('click', () => this.duplicateIngredient());
    document.getElementById('delete-ingredient')?.addEventListener('click', () => this.deleteIngredient());
    document.getElementById('cancel-ingredient-edit')?.addEventListener('click', () => this.closeEditModal());

    // Fermeture du modal en cliquant à l'extérieur
    document.getElementById('ingredients-edit-modal')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.closeEditModal();
      }
    });
  },

  /**
   * Affiche la vue ingrédients
   */
  showIngredientsView() {
    document.getElementById('tables-grid').style.display = 'none';
    document.getElementById('ingredients-view').style.display = 'block';
    this.renderIngredientsGrid();
  },

  /**
   * Cache la vue ingrédients
   */
  hideIngredientsView() {
    document.getElementById('ingredients-view').style.display = 'none';
    document.getElementById('tables-grid').style.display = 'block';
  },

  /**
   * Rend la grille des cartes d'ingrédients
   */
  renderIngredientsGrid() {
    const grid = document.getElementById('ingredients-grid');
    if (!grid) return;

    const ingredients = IngredientsManager.getIngredients();
    
    grid.innerHTML = ingredients.map(ingredient => this.createIngredientCard(ingredient)).join('');
    
    // Rebind les événements après le rendu
    this.bindCardEvents();
  },

  /**
   * Crée une carte pour un ingrédient
   */
  createIngredientCard(ingredient) {
    const currentLang = I18n.getCurrentLanguage();
    const ingredientName = ingredient.name[currentLang] || ingredient.name.fr;
    
    return `
      <div class="ingredient-card" data-ingredient-id="${ingredient.id}">
        <div class="ingredient-card__content">
          <h3 class="ingredient-card__title">${ingredientName}</h3>
          <div class="ingredient-card__actions">
            <button class="btn btn--small btn--primary edit-ingredient" data-ingredient-id="${ingredient.id}">
              <span data-i18n="edit">✏️ ${I18n.t('edit')}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Ouvre le modal d'édition
   */
  openEditModal(ingredientId = null) {
    const modal = document.getElementById('ingredients-edit-modal');
    const title = document.getElementById('ingredients-edit-modal-title');
    const duplicateBtn = document.getElementById('duplicate-ingredient');
    const deleteBtn = document.getElementById('delete-ingredient');
    
    if (ingredientId) {
      // Mode édition
      this.currentEditingIngredient = IngredientsManager.getIngredientById(ingredientId);
      title.textContent = I18n.t('editIngredient');
      duplicateBtn.style.display = 'inline-block';
      deleteBtn.style.display = 'inline-block';
      this.populateForm(this.currentEditingIngredient);
    } else {
      // Mode création
      this.currentEditingIngredient = IngredientsManager.createNewIngredient();
      title.textContent = I18n.t('addIngredient');
      duplicateBtn.style.display = 'none';
      deleteBtn.style.display = 'none';
      this.populateForm(this.currentEditingIngredient);
    }

    modal.style.display = 'block';
  },

  /**
   * Ferme le modal d'édition
   */
  closeEditModal() {
    document.getElementById('ingredients-edit-modal').style.display = 'none';
    this.currentEditingIngredient = null;
  },

  /**
   * Remplit le formulaire avec les données d'un ingrédient
   */
  populateForm(ingredient) {
    document.getElementById('ingredient-id').value = ingredient.id;
    document.getElementById('ingredient-name-fr').value = ingredient.name.fr;
    document.getElementById('ingredient-name-th').value = ingredient.name.th;
  },

  /**
   * Collecte les données du formulaire
   */
  collectFormData() {
    return {
      id: document.getElementById('ingredient-id').value,
      name: {
        fr: document.getElementById('ingredient-name-fr').value,
        th: document.getElementById('ingredient-name-th').value
      }
    };
  },

  /**
   * Sauvegarde l'ingrédient en cours d'édition
   */
  saveIngredient() {
    try {
      const formData = this.collectFormData();
      const originalId = this.currentEditingIngredient.id;

      if (originalId === formData.id) {
        // Mise à jour
        IngredientsManager.updateIngredient(originalId, formData);
      } else {
        // L'ID a changé, supprimer l'ancien et créer le nouveau
        if (originalId.startsWith('ingredient_')) {
          // Nouvel ingrédient
          IngredientsManager.addIngredient(formData);
        } else {
          // Renommer un ingrédient existant
          IngredientsManager.deleteIngredient(originalId);
          IngredientsManager.addIngredient(formData);
        }
      }

      this.renderIngredientsGrid();
      this.closeEditModal();
      
      // Réappliquer les traductions après re-rendu
      I18n.applyTranslations();
      
      // Rebind les événements sur les nouvelles cartes
      this.bindCardEvents();
      
      // Mettre à jour l'interface lors du changement de langue
      this.updateLanguage();

    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  },

  /**
   * Duplique l'ingrédient en cours d'édition
   */
  duplicateIngredient() {
    try {
      if (this.currentEditingIngredient && !this.currentEditingIngredient.id.startsWith('ingredient_')) {
        IngredientsManager.duplicateIngredient(this.currentEditingIngredient.id);
        this.renderIngredientsGrid();
        this.closeEditModal();
        I18n.applyTranslations();
        this.bindCardEvents();
      }
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  },

  /**
   * Supprime l'ingrédient en cours d'édition
   */
  deleteIngredient() {
    try {
      if (this.currentEditingIngredient && !this.currentEditingIngredient.id.startsWith('ingredient_')) {
        if (confirm(I18n.t('confirmDeleteIngredient'))) {
          IngredientsManager.deleteIngredient(this.currentEditingIngredient.id);
          this.renderIngredientsGrid();
          this.closeEditModal();
          I18n.applyTranslations();
          this.bindCardEvents();
        }
      }
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  },

  /**
   * Attache les événements aux cartes d'ingrédients
   */
  bindCardEvents() {
    document.querySelectorAll('.edit-ingredient').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ingredientId = e.target.closest('[data-ingredient-id]').dataset.ingredientId;
        this.openEditModal(ingredientId);
      });
    });
  },

  /**
   * Importe des ingrédients depuis un fichier
   */
  importIngredients() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const ingredientsData = JSON.parse(e.target.result);
          IngredientsManager.importIngredients(ingredientsData);
          this.renderIngredientsGrid();
          I18n.applyTranslations();
          this.bindCardEvents();
          alert(I18n.t('ingredientsImported'));
        } catch (error) {
          alert(`Erreur d'importation: ${error.message}`);
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  },

  /**
   * Exporte les ingrédients actuels
   */
  exportIngredients() {
    const ingredientsData = IngredientsManager.exportIngredients();
    const blob = new Blob([JSON.stringify(ingredientsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ingredients_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  },

  /**
   * Réinitialise les ingrédients
   */
  resetIngredients() {
    if (confirm(I18n.t('confirmResetIngredients'))) {
      IngredientsManager.resetIngredients();
      this.renderIngredientsGrid();
      I18n.applyTranslations();
      this.bindCardEvents();
    }
  },

  /**
   * Met à jour l'interface lors du changement de langue
   */
  updateLanguage() {
    if (document.getElementById('ingredients-view')?.style.display !== 'none') {
      this.renderIngredientsGrid();
    }
  }
};

// Rendre IngredientsUI accessible globalement
window.IngredientsUI = IngredientsUI; 