/**
 * Module de l'interface utilisateur pour la gestion du menu
 * Gère l'affichage et l'édition des items de menu sous forme de cartes
 */
const MenuUI = {
  currentEditingItem: null,
  activeCategory: 'all', // Pour stocker la catégorie active
  selectedIngredients: [], // Pour stocker les ingrédients sélectionnés dans le formulaire

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
      <div class="menu-filters">
        <div class="filter-group" id="category-filters">
          <span data-i18n="filterByCategory">Filtrer par catégorie :</span>
          <!-- Les filtres seront générés dynamiquement -->
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
              <div class="input-with-icon">
                <input type="number" id="item-price" min="0" step="0.01" required>
                <img src="assets/images/fiscal.svg" class="icon" alt="Fiscal icon"/>
              </div>
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
          
          <div class="form-row">
            <div class="form-group">
              <label for="item-category-id" data-i18n="category">${I18n.t('category')} :</label>
              <select id="item-category-id" required>
                <!-- Les options seront générées dynamiquement -->
              </select>
            </div>
            <div class="form-group">
              <label for="item-image" data-i18n="imageUrl">${I18n.t('imageUrl')} :</label>
              <input type="url" id="item-image" required>
            </div>
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
            <div class="input-with-icon">
              <input type="number" id="item-supplement-price" min="0" step="0.01" placeholder="0.00">
              <img src="assets/images/fiscal.svg" class="icon" alt="Fiscal icon"/>
            </div>
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

    // Gestion des ingrédients
    document.getElementById('item-ingredients-select')?.addEventListener('change', (e) => {
      const value = e.target.value;
      if (value && !this.selectedIngredients.includes(value)) {
        this.selectedIngredients.push(value);
        this.updateIngredientsTags();
        e.target.value = ''; // Réinitialiser le select
      }
    });
  },

  /**
   * Affiche la vue menu
   */
  showMenuView() {
    document.getElementById('tables-grid').style.display = 'none';
    document.getElementById('menu-view').style.display = 'block';
    
    // Générer les filtres de catégorie
    this.generateCategoryFilters();
    
    // Par défaut, afficher tous les éléments
    this.activeCategory = 'all';
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
   * Génère les filtres de catégorie dynamiquement à partir des données du menu
   */
  generateCategoryFilters() {
    const filterContainer = document.getElementById('category-filters');
    if (!filterContainer) return;
    
    // Vider le conteneur
    filterContainer.innerHTML = `<span data-i18n="filterByCategory">${I18n.t('filterByCategory')}</span>`;
    
    // Ajouter le filtre "Tous"
    const allButton = document.createElement('button');
    allButton.id = 'filter-all';
    allButton.className = 'btn btn--filter active';
    allButton.dataset.categoryId = 'all';
    allButton.innerHTML = `<span>${I18n.t('all')}</span>`;
    allButton.addEventListener('click', () => this.filterByCategory('all'));
    filterContainer.appendChild(allButton);
    
    // Récupérer toutes les catégories uniques du menu
    const categories = this.getUniqueCategories();
    
    // Créer un bouton pour chaque catégorie
    categories.forEach(category => {
      const button = document.createElement('button');
      button.id = `filter-${category.id}`;
      button.className = 'btn btn--filter';
      button.dataset.categoryId = category.id;
      button.innerHTML = `<span>${category.name[I18n.getCurrentLanguage()] || category.name.fr}</span>`;
      button.addEventListener('click', () => this.filterByCategory(category.id));
      filterContainer.appendChild(button);
    });
    
    // Mettre à jour le sélecteur de catégorie dans le formulaire
    this.updateCategorySelect(categories);
  },

  /**
   * Récupère toutes les catégories uniques du menu
   */
  getUniqueCategories() {
    const menuItems = MenuManager.getMenuItems();
    const categoriesMap = {};
    
    menuItems.forEach(item => {
      if (item.category && item.category.id) {
        categoriesMap[item.category.id] = item.category;
      }
    });
    
    return Object.values(categoriesMap);
  },

  /**
   * Met à jour le sélecteur de catégorie dans le formulaire
   */
  updateCategorySelect(categories) {
    const select = document.getElementById('item-category-id');
    if (!select) return;
    
    select.innerHTML = '';
    
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name[I18n.getCurrentLanguage()] || category.name.fr;
      select.appendChild(option);
    });
    
    // Ajouter l'option "Autre" si elle n'existe pas déjà
    if (!categories.find(c => c.id === 'autre')) {
      const autreOption = document.createElement('option');
      autreOption.value = 'autre';
      autreOption.textContent = I18n.t('other');
      select.appendChild(autreOption);
    }
  },

  /**
   * Filtre les éléments du menu par catégorie
   */
  filterByCategory(categoryId) {
    // Mettre à jour les boutons de filtre
    const filterButtons = document.querySelectorAll('.btn--filter');
    filterButtons.forEach(btn => {
      if (btn.dataset.categoryId === categoryId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Stocker la catégorie active
    this.activeCategory = categoryId;

    // Rafraîchir la grille
    this.renderMenuGrid();
  },

  /**
   * Affiche la grille des éléments du menu
   */
  renderMenuGrid() {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const menuItems = MenuManager.getMenuItems();
    
    // Appliquer le filtre par catégorie
    const filteredItems = this.activeCategory === 'all' ? 
      menuItems : 
      menuItems.filter(item => item.category && item.category.id === this.activeCategory);
    
    if (filteredItems.length === 0) {
      grid.innerHTML = `<p class="empty-message">${I18n.t('noItemsFound')}</p>`;
      return;
    }
    
    filteredItems.forEach(item => {
      const card = this.createMenuCard(item);
      grid.appendChild(card);
    });
    
    this.bindCardEvents();
  },

  /**
   * Crée une carte pour un élément de menu
   */
  createMenuCard(item) {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.dataset.id = item.id;
    
    // Ajouter une classe pour la catégorie
    if (item.category && item.category.id) {
      card.classList.add(`category-${item.category.id}`);
    }
    
    const stockStatus = item.quantity.infinite ? 
      `<span class="stock-badge infinite">${I18n.t('infinite')}</span>` : 
      `<span class="stock-badge ${item.quantity.amount < 5 ? 'low' : ''}">${item.quantity.amount}</span>`;
    
    // Obtenir le nom de la catégorie
    const categoryName = item.category && item.category.name ? 
      (item.category.name[I18n.getCurrentLanguage()] || item.category.name.fr) : '';
    
    card.innerHTML = `
      <div class="menu-card__image">
        <img src="${item.image}" alt="${item.name[I18n.getCurrentLanguage()] || item.name.fr}">
        ${stockStatus}
        ${categoryName ? `<span class="category-badge">${categoryName}</span>` : ''}
        ${item.reference ? `<span class="reference-badge">${item.reference}</span>` : ''}
      </div>
      <div class="menu-card__content">
        <h3>${item.name[I18n.getCurrentLanguage()] || item.name.fr}</h3>
        <div class="menu-card__price">${item.price} ฿</div>
        <div class="menu-card__ingredients">
          ${(item.ingredients || []).map(ingId => {
            const ingredient = window.ingredients.find(ing => ing.id === ingId);
            if (!ingredient) return '';
            return `<span class="ingredient-pill" style="background-color: ${this.getRandomColorForId(ingId)}">${ingredient.name[I18n.getCurrentLanguage()] || ingredient.name.fr}</span>`;
          }).join('')}
        </div>
      </div>
      <div class="menu-card__actions">
        <button class="btn btn--icon edit-menu-item" title="${I18n.t('edit')}">✏️</button>
      </div>
    `;
    
    return card;
  },

  /**
   * Génère une couleur aléatoire mais cohérente pour un ID donné
   */
  getRandomColorForId(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash % 360);
    return `hsla(${hue}, 70%, 80%, 0.8)`;
  },

  /**
   * Attache les événements aux cartes du menu
   */
  bindCardEvents() {
    document.querySelectorAll('.edit-menu-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.closest('[data-id]').dataset.id;
        this.openEditModal(itemId);
      });
    });
  },

  /**
   * Ouvre le modal d'édition
   */
  openEditModal(itemId = null) {
    const modal = document.getElementById('menu-edit-modal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    
    // Réinitialiser le formulaire
    document.getElementById('menu-item-form').reset();
    this.selectedIngredients = [];
    
    // Titre du modal
    document.getElementById('edit-modal-title').textContent = itemId ? 
      I18n.t('editItem') : I18n.t('addItem');
    
    if (itemId) {
      // Édition d'un item existant
      const item = MenuManager.getItemById(itemId);
      if (item) {
        this.currentEditingItem = item;
        this.populateForm(item);
      }
    } else {
      // Nouvel item
      this.currentEditingItem = null;
      this.populateForm(MenuManager.createNewItem());
    }
  },

  /**
   * Ferme le modal d'édition
   */
  closeEditModal() {
    const modal = document.getElementById('menu-edit-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  },

  /**
   * Remplit le formulaire avec les données d'un item
   */
  populateForm(item) {
    document.getElementById('item-id').value = item.id || '';
    document.getElementById('item-id').disabled = !!item.id; // Désactiver l'édition de l'ID pour les items existants
    document.getElementById('item-price').value = item.price || 0;
    document.getElementById('item-name-fr').value = item.name?.fr || '';
    document.getElementById('item-name-th').value = item.name?.th || '';
    
    // Catégorie
    const categorySelect = document.getElementById('item-category-id');
    if (categorySelect && item.category && item.category.id) {
      // Vérifier si la catégorie existe dans le select
      let categoryExists = false;
      for (let i = 0; i < categorySelect.options.length; i++) {
        if (categorySelect.options[i].value === item.category.id) {
          categoryExists = true;
          break;
        }
      }
      
      // Si la catégorie n'existe pas, l'ajouter
      if (!categoryExists) {
        const option = document.createElement('option');
        option.value = item.category.id;
        option.textContent = item.category.name[I18n.getCurrentLanguage()] || item.category.name.fr;
        categorySelect.appendChild(option);
      }
      
      categorySelect.value = item.category.id;
    }
    
    document.getElementById('item-image').value = item.image || '';
    document.getElementById('item-quantity').value = item.quantity?.amount || 0;
    document.getElementById('item-infinite').checked = item.quantity?.infinite || false;
    document.getElementById('item-supplement-price').value = item.supplementPrice || '';
    
    // Prévisualisation de l'image
    const preview = document.getElementById('image-preview');
    if (preview) {
      preview.src = item.image || 'https://picsum.photos/300/200';
    }
    
    // Remplir les ingrédients
    this.selectedIngredients = [...(item.ingredients || [])];
    this.updateIngredientsTags();
  },

  /**
   * Met à jour l'affichage des tags d'ingrédients
   */
  updateIngredientsTags() {
    const tagsContainer = document.getElementById('ingredients-tags');
    if (!tagsContainer) return;
    
    tagsContainer.innerHTML = '';
    
    this.selectedIngredients.forEach(ingredientId => {
      const ingredient = window.ingredients.find(ing => ing.id === ingredientId);
      if (!ingredient) return;
      
      const tag = document.createElement('span');
      tag.className = 'ingredient-tag';
      tag.dataset.id = ingredientId;
      tag.textContent = ingredient.name[I18n.getCurrentLanguage()] || ingredient.name.fr;
      tag.style.backgroundColor = this.getRandomColorForId(ingredientId);
      
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-tag-btn';
      removeBtn.textContent = '×';
      removeBtn.onclick = () => {
        const idx = this.selectedIngredients.indexOf(ingredientId);
        if (idx !== -1) {
          this.selectedIngredients.splice(idx, 1);
          this.updateIngredientsTags();
        }
      };
      
      tag.appendChild(removeBtn);
      tagsContainer.appendChild(tag);
    });
    
    // Mettre à jour le select pour désactiver les options déjà sélectionnées
    const select = document.getElementById('item-ingredients-select');
    if (select) {
      Array.from(select.options).forEach(opt => {
        if (opt.value && this.selectedIngredients.includes(opt.value)) {
          opt.disabled = true;
        } else {
          opt.disabled = false;
        }
      });
    }
  },

  /**
   * Collecte les données du formulaire
   */
  collectFormData() {
    const id = document.getElementById('item-id').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const nameFr = document.getElementById('item-name-fr').value;
    const nameTh = document.getElementById('item-name-th').value;
    const categoryId = document.getElementById('item-category-id').value;
    const image = document.getElementById('item-image').value;
    const quantity = parseInt(document.getElementById('item-quantity').value);
    const infinite = document.getElementById('item-infinite').checked;
    const supplementPrice = document.getElementById('item-supplement-price').value ? 
      parseFloat(document.getElementById('item-supplement-price').value) : 0;
    
    // Récupérer les informations de catégorie
    let category;
    const existingCategories = this.getUniqueCategories();
    const existingCategory = existingCategories.find(c => c.id === categoryId);
    
    if (existingCategory) {
      category = existingCategory;
    } else {
      // Créer une nouvelle catégorie
      category = {
        id: categoryId,
        name: {
          fr: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
          th: categoryId
        }
      };
    }
    
    return {
      id: id,
      price: price,
      name: {
        fr: nameFr,
        th: nameTh
      },
      category: category,
      image: image,
      quantity: {
        amount: quantity,
        infinite: infinite
      },
      ingredients: [...this.selectedIngredients],
      supplementPrice: supplementPrice,
      supplements: []
    };
  },

  /**
   * Sauvegarde un item de menu
   */
  saveMenuItem() {
    try {
      const formData = this.collectFormData();
      
      if (this.currentEditingItem) {
        // Mise à jour d'un item existant
        MenuManager.updateItem(this.currentEditingItem.id, formData);
      } else {
        // Nouvel item
        MenuManager.addItem(formData);
      }
      
      this.closeEditModal();
      this.renderMenuGrid();
      
      // Regénérer les filtres de catégorie car ils ont pu changer
      this.generateCategoryFilters();
    } catch (error) {
      alert(error.message);
    }
  },

  /**
   * Duplique un item de menu
   */
  duplicateMenuItem() {
    if (!this.currentEditingItem) return;
    
    try {
      const formData = this.collectFormData();
      formData.id = MenuManager.generateUniqueId();
      
      MenuManager.addItem(formData);
      
      this.closeEditModal();
      this.renderMenuGrid();
    } catch (error) {
      alert(error.message);
    }
  },

  /**
   * Supprime un item de menu
   */
  deleteMenuItem() {
    if (!this.currentEditingItem) return;
    
    if (confirm(I18n.t('confirmDelete'))) {
      try {
        MenuManager.deleteItem(this.currentEditingItem.id);
        
        this.closeEditModal();
        this.renderMenuGrid();
        
        // Regénérer les filtres de catégorie car ils ont pu changer
        this.generateCategoryFilters();
      } catch (error) {
        alert(error.message);
      }
    }
  },

  /**
   * Importe un menu
   */
  importMenu() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const menu = JSON.parse(event.target.result);
          if (Array.isArray(menu)) {
            MenuManager.importMenu(menu);
            this.renderMenuGrid();
            this.generateCategoryFilters();
            alert(I18n.t('menuImported'));
          }
        } catch (error) {
          alert(error.message);
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  },

  /**
   * Exporte le menu
   */
  exportMenu() {
    const menu = MenuManager.exportMenu();
    const blob = new Blob([JSON.stringify(menu, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu.json';
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
      this.generateCategoryFilters();
    }
  },

  /**
   * Met à jour la langue de l'interface
   */
  updateLanguage() {
    // Mettre à jour les éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = I18n.t(key);
      }
    });
    
    // Regénérer les filtres de catégorie
    this.generateCategoryFilters();
    
    // Rafraîchir la grille pour mettre à jour les noms
    this.renderMenuGrid();
  }
};

// Rendre MenuUI accessible globalement
window.MenuUI = MenuUI; 