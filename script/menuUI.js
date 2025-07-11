/**
 * Module de l'interface utilisateur pour la gestion du menu
 * Gère l'affichage et l'édition des items de menu sous forme de cartes
 */
const MenuUI = {
  currentEditingItem: null,

  /**
   * Initialise l'interface de gestion du menu
   */
  init() {
    this.createMenuContainer();
    this.bindEvents();
    console.log('MenuUI initialisé');
  },

  /**
   * Crée le conteneur principal pour l'interface menu
   */
  createMenuContainer() {
    const main = document.querySelector('.main');
    
    // Créer le conteneur pour la vue menu
    const menuView = document.createElement('div');
    menuView.className = 'menu-view';
    menuView.id = 'menu-view';
    menuView.style.display = 'none';
    
    menuView.innerHTML = `
      <div class="menu-header">
        <h2 data-i18n="menuManagement">${I18n.t('menuManagement')}</h2>
        <div class="menu-actions">
          <button id="add-menu-item" class="btn btn--primary">
            <span data-i18n="addItem">➕ ${I18n.t('addItem')}</span>
          </button>
          <button id="import-menu" class="btn btn--secondary">
            <span data-i18n="importMenu">📥 ${I18n.t('importMenu')}</span>
          </button>
          <button id="export-menu" class="btn btn--secondary">
            <span data-i18n="exportMenu">📤 ${I18n.t('exportMenu')}</span>
          </button>
          <button id="reset-menu" class="btn btn--danger">
            <span data-i18n="resetMenu">🔄 ${I18n.t('resetMenu')}</span>
          </button>
        </div>
      </div>
      <div class="menu-grid" id="menu-grid">
        <!-- Cartes de menu générées dynamiquement -->
      </div>
    `;
    
    main.appendChild(menuView);
    
    // Créer le modal d'édition
    this.createEditModal();
  },

  /**
   * Crée le modal d'édition des items
   */
  createEditModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'menu-edit-modal';
    
    modal.innerHTML = `
      <div class="modal__content modal__content--large">
        <h3 id="edit-modal-title" data-i18n="editItem">${I18n.t('editItem')}</h3>
        
        <form id="menu-item-form" class="menu-form">
          <div class="form-row">
            <div class="form-group">
              <label for="item-id" data-i18n="itemId">${I18n.t('itemId')} :</label>
              <input type="text" id="item-id" required>
            </div>
            <div class="form-group">
              <label for="item-price" data-i18n="price">${I18n.t('price')} :</label>
              <input type="number" id="item-price" min="0" step="0.01" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="item-name-fr" data-i18n="nameFr">${I18n.t('nameFr')} :</label>
              <input type="text" id="item-name-fr" required>
            </div>
            <div class="form-group">
              <label for="item-name-th" data-i18n="nameTh">${I18n.t('nameTh')} :</label>
              <input type="text" id="item-name-th" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="item-image" data-i18n="imageUrl">${I18n.t('imageUrl')} :</label>
            <input type="url" id="item-image" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="item-quantity" data-i18n="quantity">${I18n.t('quantity')} :</label>
              <input type="number" id="item-quantity" min="0" required>
            </div>
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" id="item-infinite">
                <span data-i18n="infiniteQuantity">${I18n.t('infiniteQuantity')}</span>
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label for="item-ingredients" data-i18n="ingredients">${I18n.t('ingredients')} :</label>
            <div id="ingredients-tags" class="ingredients-tags"></div>
            <select id="item-ingredients-select">
              <option value="">${I18n.t('ingredientsPlaceholder')}</option>
              ${window.ingredients.map(ing => `<option value="${ing.id}">${ing.name[I18n.getCurrentLanguage()] || ing.name.fr}</option>`).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label for="item-supplement-price" data-i18n="supplementPrice">${I18n.t('supplementPrice')} :</label>
            <input type="number" id="item-supplement-price" min="0" step="0.01" placeholder="0.00">
          </div>
          
          <div class="image-preview">
            <img id="image-preview" src="" alt="Aperçu">
          </div>
        </form>
        
        <div class="modal__actions">
          <button type="button" id="save-menu-item" class="btn btn--primary" data-i18n="save">${I18n.t('save')}</button>
          <button type="button" id="duplicate-menu-item" class="btn btn--secondary" data-i18n="duplicate">${I18n.t('duplicate')}</button>
          <button type="button" id="delete-menu-item" class="btn btn--danger" data-i18n="delete">${I18n.t('delete')}</button>
          <button type="button" id="cancel-edit" class="btn btn--secondary" data-i18n="cancel">${I18n.t('cancel')}</button>
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
    document.getElementById('add-menu-item')?.addEventListener('click', () => {
      this.openEditModal();
    });

    // Boutons d'actions du menu
    document.getElementById('import-menu')?.addEventListener('click', () => this.importMenu());
    document.getElementById('export-menu')?.addEventListener('click', () => this.exportMenu());
    document.getElementById('reset-menu')?.addEventListener('click', () => this.resetMenu());

    // Modal d'édition
    document.getElementById('save-menu-item')?.addEventListener('click', () => this.saveMenuItem());
    document.getElementById('duplicate-menu-item')?.addEventListener('click', () => this.duplicateMenuItem());
    document.getElementById('delete-menu-item')?.addEventListener('click', () => this.deleteMenuItem());
    document.getElementById('cancel-edit')?.addEventListener('click', () => this.closeEditModal());

    // Aperçu de l'image
    document.getElementById('item-image')?.addEventListener('input', (e) => {
      const preview = document.getElementById('image-preview');
      if (preview) {
        preview.src = e.target.value || 'https://picsum.photos/300/200';
      }
    });

    // Fermeture du modal en cliquant à l'extérieur
    document.getElementById('menu-edit-modal')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.closeEditModal();
      }
    });
  },

  /**
   * Affiche la vue menu
   */
  showMenuView() {
    document.getElementById('tables-grid').style.display = 'none';
    document.getElementById('menu-view').style.display = 'block';
    this.renderMenuGrid();
  },

  /**
   * Cache la vue menu
   */
  hideMenuView() {
    document.getElementById('menu-view').style.display = 'none';
    document.getElementById('tables-grid').style.display = 'block';
  },

  /**
   * Rend la grille des cartes de menu
   */
  renderMenuGrid() {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    const menuItems = MenuManager.getMenuItems();
    
    grid.innerHTML = menuItems.map(item => this.createMenuCard(item)).join('');
    
    // Rebind les événements après le rendu
    this.bindCardEvents();
  },

  /**
   * Crée une carte pour un item de menu
   */
  createMenuCard(item) {
    const currentLang = I18n.getCurrentLanguage();
    const itemName = item.name[currentLang] || item.name.fr;
    
    return `
      <div class="menu-card" data-item-id="${item.id}">
        <div class="menu-card__image">
          <img src="${item.image}" alt="${itemName}" loading="lazy">
        </div>
        <div class="menu-card__content">
          <h3 class="menu-card__title">${itemName}</h3>
          <div class="menu-card__info">
            <span class="menu-card__price">${item.price} ฿</span>
            <span class="menu-card__quantity ${item.quantity.infinite ? 'infinite' : ''}">
              ${item.quantity.infinite ? '∞' : item.quantity.amount}
            </span>
          </div>
          <div class="menu-card__actions">
            <button class="btn btn--small btn--primary edit-item" data-item-id="${item.id}">
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
  openEditModal(itemId = null) {
    const modal = document.getElementById('menu-edit-modal');
    const title = document.getElementById('edit-modal-title');
    const duplicateBtn = document.getElementById('duplicate-menu-item');
    const deleteBtn = document.getElementById('delete-menu-item');
    
    if (itemId) {
      // Mode édition
      this.currentEditingItem = MenuManager.getItemById(itemId);
      title.textContent = I18n.t('editItem');
      duplicateBtn.style.display = 'inline-block';
      deleteBtn.style.display = 'inline-block';
      this.populateForm(this.currentEditingItem);
    } else {
      // Mode création
      this.currentEditingItem = MenuManager.createNewItem();
      title.textContent = I18n.t('addItem');
      duplicateBtn.style.display = 'none';
      deleteBtn.style.display = 'none';
      this.populateForm(this.currentEditingItem);
    }

    modal.style.display = 'block';
  },

  /**
   * Ferme le modal d'édition
   */
  closeEditModal() {
    document.getElementById('menu-edit-modal').style.display = 'none';
    this.currentEditingItem = null;
  },

  /**
   * Remplit le formulaire avec les données d'un item
   */
  populateForm(item) {
    document.getElementById('item-id').value = item.id;
    document.getElementById('item-price').value = item.price;
    document.getElementById('item-name-fr').value = item.name.fr;
    document.getElementById('item-name-th').value = item.name.th;
    document.getElementById('item-image').value = item.image;
    document.getElementById('item-quantity').value = item.quantity.amount;
    document.getElementById('item-infinite').checked = item.quantity.infinite;
    document.getElementById('item-supplement-price').value = item.supplementPrice || 0;
    document.getElementById('image-preview').src = item.image;

    // Gérer les ingrédients (tags)
    const tagsContainer = document.getElementById('ingredients-tags');
    tagsContainer.innerHTML = '';
    const selectedIngredients = item.ingredients || [];
    selectedIngredients.forEach(ingredientId => {
      const ingredient = window.ingredients.find(ing => ing.id === ingredientId);
      if (!ingredient) return;
      const tag = document.createElement('span');
      tag.className = 'ingredient-tag';
      tag.setAttribute('data-id', ingredientId);
      tag.textContent = ingredient.name[I18n.getCurrentLanguage()] || ingredient.name.fr;
      tag.style.backgroundColor = getRandomColorForId(ingredientId);
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-tag-btn';
      removeBtn.textContent = '×';
      removeBtn.onclick = () => {
        // Retirer l'ingrédient du tableau et re-populer
        const idx = selectedIngredients.indexOf(ingredientId);
        if (idx !== -1) selectedIngredients.splice(idx, 1);
        this.populateForm({ ...item, ingredients: selectedIngredients });
      };
      tag.appendChild(removeBtn);
      tagsContainer.appendChild(tag);
    });
    // Mettre à jour le select pour ne pas proposer les ingrédients déjà sélectionnés
    const select = document.getElementById('item-ingredients-select');
    if (select) {
      Array.from(select.options).forEach(opt => {
        if (opt.value && selectedIngredients.includes(opt.value)) {
          opt.disabled = true;
        } else {
          opt.disabled = false;
        }
      });
      select.value = '';
      select.onchange = (e) => {
        const val = e.target.value;
        if (val && !selectedIngredients.includes(val)) {
          selectedIngredients.push(val);
          this.populateForm({ ...item, ingredients: selectedIngredients });
        }
      };
    }
  },

  /**
   * Collecte les données du formulaire
   */
  collectFormData() {
    const tagsContainer = document.getElementById('ingredients-tags');
    const selectedIngredients = Array.from(tagsContainer.querySelectorAll('.ingredient-tag')).map(tag => {
      // On stocke l'id dans un attribut data-id
      return tag.getAttribute('data-id') || window.ingredients.find(ing => (ing.name[I18n.getCurrentLanguage()] || ing.name.fr) === tag.textContent.replace('×','').trim())?.id;
    }).filter(Boolean);
    return {
      id: document.getElementById('item-id').value,
      price: parseFloat(document.getElementById('item-price').value),
      name: {
        fr: document.getElementById('item-name-fr').value,
        th: document.getElementById('item-name-th').value
      },
      image: document.getElementById('item-image').value,
      quantity: {
        amount: parseInt(document.getElementById('item-quantity').value),
        infinite: document.getElementById('item-infinite').checked
      },
      ingredients: selectedIngredients,
      supplementPrice: parseFloat(document.getElementById('item-supplement-price').value) || 0
    };
  },

  /**
   * Sauvegarde l'item en cours d'édition
   */
  saveMenuItem() {
    try {
      const formData = this.collectFormData();
      const originalId = this.currentEditingItem.id;

      if (originalId === formData.id) {
        // Mise à jour
        MenuManager.updateItem(originalId, formData);
      } else {
        // L'ID a changé, supprimer l'ancien et créer le nouveau
        if (originalId.startsWith('item_')) {
          // Nouvel item
          MenuManager.addItem(formData);
        } else {
          // Renommer un item existant
          MenuManager.deleteItem(originalId);
          MenuManager.addItem(formData);
        }
      }

      this.renderMenuGrid();
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
   * Duplique l'item en cours d'édition
   */
  duplicateMenuItem() {
    try {
      if (this.currentEditingItem && !this.currentEditingItem.id.startsWith('item_')) {
        MenuManager.duplicateItem(this.currentEditingItem.id);
        this.renderMenuGrid();
        this.closeEditModal();
        I18n.applyTranslations();
        this.bindCardEvents();
      }
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  },

  /**
   * Supprime l'item en cours d'édition
   */
  deleteMenuItem() {
    try {
      if (this.currentEditingItem && !this.currentEditingItem.id.startsWith('item_')) {
        if (confirm(I18n.t('confirmDelete'))) {
          MenuManager.deleteItem(this.currentEditingItem.id);
          this.renderMenuGrid();
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
   * Attache les événements aux cartes de menu
   */
  bindCardEvents() {
    document.querySelectorAll('.edit-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.closest('[data-item-id]').dataset.itemId;
        this.openEditModal(itemId);
      });
    });
  },

  /**
   * Importe un menu depuis un fichier
   */
  importMenu() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const menuData = JSON.parse(e.target.result);
          MenuManager.importMenu(menuData);
          this.renderMenuGrid();
          I18n.applyTranslations();
          this.bindCardEvents();
          alert(I18n.t('menuImported'));
        } catch (error) {
          alert(`Erreur d'importation: ${error.message}`);
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  },

  /**
   * Exporte le menu actuel
   */
  exportMenu() {
    const menuData = MenuManager.exportMenu();
    const blob = new Blob([JSON.stringify(menuData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `menu_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  },

  /**
   * Réinitialise le menu
   */
  resetMenu() {
    if (confirm(I18n.t('confirmReset'))) {
      MenuManager.resetMenu();
      this.renderMenuGrid();
      I18n.applyTranslations();
      this.bindCardEvents();
    }
  },

  /**
   * Met à jour l'interface lors du changement de langue
   */
  updateLanguage() {
    if (document.getElementById('menu-view')?.style.display !== 'none') {
      this.renderMenuGrid();
    }
    
    // Mettre à jour les tags d'ingrédients si le modal est ouvert
    if (this.currentEditingItem && document.getElementById('menu-edit-modal')?.style.display !== 'none') {
      this.updateIngredientsTags();
    }
  },

  /**
   * Met à jour les tags d'ingrédients avec la langue actuelle
   */
  updateIngredientsTags() {
    const tagsContainer = document.getElementById('ingredients-tags');
    if (!tagsContainer) return;

    const currentLang = I18n.getCurrentLanguage();
    const tags = tagsContainer.querySelectorAll('.ingredient-tag');
    
    tags.forEach(tag => {
      const ingredientId = tag.getAttribute('data-id') || 
        window.ingredients.find(ing => (ing.name[currentLang] || ing.name.fr) === tag.textContent.replace('×','').trim())?.id;
      
      if (ingredientId) {
        const ingredient = window.ingredients.find(ing => ing.id === ingredientId);
        if (ingredient) {
          // Mettre à jour le texte du tag (sans le bouton ×)
          const removeBtn = tag.querySelector('.remove-tag-btn');
          tag.textContent = ingredient.name[currentLang] || ingredient.name.fr;
          if (removeBtn) {
            tag.appendChild(removeBtn);
          }
        }
      }
    });
  }
};

// Rendre MenuUI accessible globalement
window.MenuUI = MenuUI;

// Fonction utilitaire pour couleur aléatoire stable par id
function getRandomColorForId(id) {
  // Génère une couleur pastel à partir d'un hash de l'id
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 80%)`;
} 