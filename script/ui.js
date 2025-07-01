/**
 * Module de gestion de l'interface utilisateur
 * Gère le rendu visuel des tables et des commandes
 */
const UI = {
  gridCols: 3,
  gridRows: 3,
  tablesGrid: null,

  /**
   * Initialise l'interface utilisateur
   */
  init() {
    this.tablesGrid = document.getElementById('tables-grid');
    
    // Écouter les changements d'état
    State.addListener(this.handleStateChange.bind(this));
    
    // Générer la grille initiale
    this.updateGrid();
    
    console.log('UI initialisé');
  },

  /**
   * Met à jour la configuration de la grille
   * @param {number} cols - Nombre de colonnes
   * @param {number} rows - Nombre de lignes
   */
  updateGridConfig(cols, rows) {
    this.gridCols = cols;
    this.gridRows = rows;
    this.updateGrid();
  },

  /**
   * Met à jour la grille des tables
   */
  updateGrid() {
    if (!this.tablesGrid) return;

    // Définir le nombre de colonnes CSS
    this.tablesGrid.className = `tables-grid tables-grid--cols-${this.gridCols}`;
    
    // Vider la grille
    this.tablesGrid.innerHTML = '';
    
    // Générer les tables selon la logique inversée
    const totalTables = this.gridCols * this.gridRows;
    
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        // Logique inversée : table 1 en haut à droite, progression droite → gauche
        const tableNumber = row * this.gridCols + (this.gridCols - col);
        
        if (tableNumber <= totalTables) {
          this.createTableCard(tableNumber);
        }
      }
    }
  },

  /**
   * Crée une carte de table
   * @param {number} tableNumber - Numéro de la table
   */
  createTableCard(tableNumber) {
    const card = document.createElement('div');
    card.className = 'table-card';
    card.dataset.table = tableNumber;
    
    const orders = State.getTableOrders(tableNumber);
    const hasOrders = orders.length > 0;
    
    if (hasOrders) {
      card.classList.add('has-orders');
    }

    card.innerHTML = `
      <div class="table-card__header">
        <h3 class="table-card__title">${I18n.t('table')} ${tableNumber}</h3>
      </div>
      <div class="table-card__content">
        <div class="table-card__orders" id="orders-${tableNumber}">
          ${hasOrders ? '' : `<div class="table-card__empty">${I18n.t('noOrders')}</div>`}
        </div>
        <div class="table-card__footer">
          <div class="table-card__total">
            ${I18n.t('total')}: ${I18n.formatPrice(State.getTableTotal(tableNumber))}
          </div>
          <button class="btn btn--danger btn--small" 
                  onclick="UI.clearTable(${tableNumber})" 
                  ${!hasOrders ? 'disabled' : ''}>
            ${I18n.t('finish')}
          </button>
        </div>
      </div>
    `;

    this.tablesGrid.appendChild(card);
    
    // Rendre les commandes si il y en a
    if (hasOrders) {
      this.renderTableOrders(tableNumber);
    }
  },

  /**
   * Rend les commandes d'une table
   * @param {number} tableNumber - Numéro de la table
   */
  renderTableOrders(tableNumber) {
    const ordersContainer = document.getElementById(`orders-${tableNumber}`);
    if (!ordersContainer) return;

    const orders = State.getTableOrders(tableNumber);
    
    if (orders.length === 0) {
      ordersContainer.innerHTML = `<div class="table-card__empty">${I18n.t('noOrders')}</div>`;
      return;
    }

    ordersContainer.innerHTML = orders.map(order => this.createOrderItemHTML(order)).join('');
  },

  /**
   * Crée le HTML d'un item de commande
   * @param {Object} order - Commande
   * @returns {string} HTML de l'item
   */
  createOrderItemHTML(order) {
    const isDone = order.status === 'done';
    const itemName = I18n.getItemName(order.item);
    const price = I18n.formatPrice(order.item.price);
    
    return `
      <div class="order-item ${isDone ? 'done' : ''}" data-order-id="${order.orderId}">
        <div class="order-item__header">
          <span class="order-item__name">${itemName}</span>
          <span class="order-item__price">${price}</span>
        </div>
        <div class="order-item__actions">
          <button class="btn ${isDone ? 'btn--secondary' : 'btn--success'} btn--small"
                  onclick="UI.toggleOrderStatus('${order.orderId}')">
            ${isDone ? I18n.t('todo') : I18n.t('done')}
          </button>
          ${!isDone ? `
            <button class="btn btn--danger btn--small"
                    onclick="UI.cancelOrder('${order.orderId}')">
              ${I18n.t('cancel')}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Gère les changements d'état
   * @param {string} type - Type de changement
   * @param {*} data - Données du changement
   */
  handleStateChange(type, data) {
    switch (type) {
      case 'orderAdded':
        this.updateTableCard(data.table);
        break;
      case 'orderRemoved':
        this.updateTableCard(data.table);
        break;
      case 'orderStatusChanged':
        this.updateTableCard(data.table);
        break;
      case 'tableCleared':
        this.updateTableCard(data);
        break;
      case 'stateCleared':
        this.updateGrid();
        break;
    }
  },

  /**
   * Met à jour une carte de table spécifique
   * @param {number} tableNumber - Numéro de la table
   */
  updateTableCard(tableNumber) {
    const card = document.querySelector(`[data-table="${tableNumber}"]`);
    if (!card) return;

    const orders = State.getTableOrders(tableNumber);
    const hasOrders = orders.length > 0;
    
    // Mettre à jour la classe has-orders
    if (hasOrders) {
      card.classList.add('has-orders');
    } else {
      card.classList.remove('has-orders');
    }

    // Mettre à jour le total
    const totalElement = card.querySelector('.table-card__total');
    if (totalElement) {
      totalElement.textContent = `${I18n.t('total')}: ${I18n.formatPrice(State.getTableTotal(tableNumber))}`;
    }

    // Mettre à jour le bouton terminer
    const finishButton = card.querySelector('.btn--danger');
    if (finishButton) {
      finishButton.disabled = !hasOrders;
    }

    // Re-rendre les commandes
    this.renderTableOrders(tableNumber);
  },

  /**
   * Bascule le statut d'une commande
   * @param {string} orderId - ID de la commande
   */
  toggleOrderStatus(orderId) {
    const order = State.getOrder(orderId);
    if (!order) return;

    const newStatus = order.status === 'todo' ? 'done' : 'todo';
    State.changeOrderStatus(orderId, newStatus);
  },

  /**
   * Annule une commande
   * @param {string} orderId - ID de la commande
   */
  cancelOrder(orderId) {
    if (confirm(I18n.t('confirmCancel') || 'Confirmer l\'annulation ?')) {
      State.removeOrder(orderId);
    }
  },

  /**
   * Vide une table
   * @param {number} tableNumber - Numéro de la table
   */
  clearTable(tableNumber) {
    if (confirm(I18n.t('confirmFinish') || 'Terminer cette table ?')) {
      State.clearTable(tableNumber);
    }
  },

  /**
   * Met à jour tous les textes de l'interface lors d'un changement de langue
   */
  updateLanguage() {
    // Mettre à jour la grille complète
    this.updateGrid();
  },

  /**
   * Anime l'ajout d'une nouvelle commande
   * @param {string} orderId - ID de la commande
   */
  animateNewOrder(orderId) {
    setTimeout(() => {
      const orderElement = document.querySelector(`[data-order-id="${orderId}"]`);
      if (orderElement) {
        orderElement.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
          orderElement.style.animation = '';
        }, 500);
      }
    }, 100);
  },

  /**
   * Obtient les statistiques d'affichage
   * @returns {Object} Statistiques UI
   */
  getDisplayStats() {
    const stats = State.getStats();
    const visibleTables = this.gridCols * this.gridRows;
    
    return {
      ...stats,
      visibleTables,
      gridSize: `${this.gridCols}×${this.gridRows}`
    };
  }
}; 