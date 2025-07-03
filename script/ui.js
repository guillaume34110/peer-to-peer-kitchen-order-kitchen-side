/**
 * Module de gestion de l'interface utilisateur
 * Gère le rendu visuel des tables et des commandes
 */
const UI = {
  gridCols: 3,
  gridRows: 3,
  tablesGrid: null,
  syncTimer: null,

  /**
   * Initialise l'interface utilisateur
   */
  init() {
    this.tablesGrid = document.getElementById('tables-grid');
    
    // Générer la grille initiale
    this.updateGrid();
    
    // Démarrer la synchronisation automatique State → UI à 4fps (250ms)
    this.startAutoSync();
    
    console.log('UI initialisé avec synchronisation automatique à 4fps');
  },

  /**
   * Démarre la synchronisation automatique State → UI à 4fps
   */
  startAutoSync() {
    // Nettoyer l'ancien timer s'il existe
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    
    // Timer à 250ms = 4fps
    this.syncTimer = setInterval(() => {
      this.syncWithState();
    }, 250);
    
    console.log('🔄 Synchronisation automatique démarrée (4fps)');
  },

  /**
   * Arrête la synchronisation automatique
   */
  stopAutoSync() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
      console.log('🛑 Synchronisation automatique arrêtée');
    }
  },

  /**
   * Synchronise l'UI avec le State (fonction pure)
   */
  syncWithState() {
    const totalTables = this.gridCols * this.gridRows;
    
    for (let tableNumber = 1; tableNumber <= totalTables; tableNumber++) {
      this.renderTable(tableNumber);
    }
  },

  /**
   * Calcule et affiche le rendu de monnaie pour une table
   */
  calculateChange(tableNumber) {
    const paymentInput = document.getElementById(`payment-${tableNumber}`);
    const changeResult = document.getElementById(`change-${tableNumber}`);
    
    if (!paymentInput || !changeResult) return;
    
    const totalAmount = State.getTableTotal(tableNumber);
    const paidAmount = parseFloat(paymentInput.value) || 0;
    
    if (paidAmount === 0) {
      changeResult.style.display = 'none';
      return;
    }
    
    const change = paidAmount - totalAmount;
    changeResult.style.display = 'block';
    
    if (change >= 0) {
      changeResult.textContent = `Rendu: ${I18n.formatPrice(change)}`;
      changeResult.style.color = change > 0 ? '#28a745' : '#6c757d';
    } else {
      changeResult.textContent = `Manque: ${I18n.formatPrice(Math.abs(change))}`;
      changeResult.style.color = '#dc3545';
    }
  },

  /**
   * Réinitialise le montant payé pour une table
   */
  resetPayment(tableNumber) {
    const paymentInput = document.getElementById(`payment-${tableNumber}`);
    const changeResult = document.getElementById(`change-${tableNumber}`);
    
    if (paymentInput) {
      paymentInput.value = '';
    }
    
    if (changeResult) {
      changeResult.style.display = 'none';
    }
  },

  /**
   * Rend une table complète basée uniquement sur le State
   */
  renderTable(tableNumber) {
    const card = document.querySelector(`[data-table="${tableNumber}"]`);
    if (!card) return;

    const items = State.getTableItems(tableNumber);
    const hasItems = items.length > 0;
    const total = State.getTableTotal(tableNumber);
    
    // 1. Mettre à jour la classe has-orders
    if (hasItems) {
      card.classList.add('has-orders');
    } else {
      card.classList.remove('has-orders');
    }

    // 2. Mettre à jour le total
    const totalElement = card.querySelector('.table-card__total');
    if (totalElement) {
      totalElement.textContent = `${I18n.t('total')}: ${I18n.formatPrice(total)}`;
    }

    // 3. Mettre à jour le bouton terminer
    const finishButton = card.querySelector('.btn--danger');
    if (finishButton) {
      finishButton.disabled = !hasItems;
    }

    // 4. Rendre les items (pure fonction du state)
    this.renderTableItems(tableNumber);
    
    // 5. Recalculer le rendu de monnaie si le total a changé
    this.calculateChange(tableNumber);
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
    
    // Générer les tables dans l'ordre naturel 1,2,3,4,5,6...
    const totalTables = this.gridCols * this.gridRows;
    
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        // Ordre naturel : table 1 en haut à gauche, progression gauche → droite
        const tableNumber = row * this.gridCols + col + 1;
        
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
    
    const items = State.getTableItems(tableNumber);
    const hasItems = items.length > 0;
    
    if (hasItems) {
      card.classList.add('has-orders');
    }

    card.innerHTML = `
      <div class="table-card__header">
        <h3 class="table-card__title">${I18n.t('table')} ${tableNumber}</h3>
      </div>
      <div class="table-card__content">
        <div class="table-card__orders" id="orders-${tableNumber}">
          ${hasItems ? '' : `<div class="table-card__empty">${I18n.t('noOrders')}</div>`}
        </div>
        <div class="table-card__footer">
          <div class="table-card__total">
            ${I18n.t('total')}: ${I18n.formatPrice(State.getTableTotal(tableNumber))}
          </div>
          <input type="number" 
                 id="payment-${tableNumber}" 
                 placeholder="Montant reçu"
                 min="0"
                 step="0.01"
                 oninput="UI.calculateChange(${tableNumber})">
          <button class="btn btn--danger btn--small" 
                  onclick="UI.clearTable(${tableNumber})" 
                  ${!hasItems ? 'disabled' : ''}>
            ${I18n.t('finish')}
          </button>
          <div class="change-result" id="change-${tableNumber}" style="display: none;"></div>
        </div>
      </div>
    `;

    this.tablesGrid.appendChild(card);
    
    // Rendre les articles s'il y en a
    if (hasItems) {
      this.renderTableItems(tableNumber);
    }
  },

  /**
   * Rend les articles d'une table
   */
  renderTableItems(tableNumber) {
    const itemsContainer = document.getElementById(`orders-${tableNumber}`);
    if (!itemsContainer) return;

    const items = State.getTableItems(tableNumber);
    
    if (items.length === 0) {
      itemsContainer.innerHTML = `<div class="table-card__empty">${I18n.t('noOrders')}</div>`;
      return;
    }

    itemsContainer.innerHTML = items.map(item => this.createOrderItemHTML(item)).join('');
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
    
    // Échapper les caractères spéciaux pour les onclick
    const escapedItemName = itemName.replace(/'/g, "\\'").replace(/"/g, '\\"');
    
    return `
      <div class="order-item ${isDone ? 'done' : ''}">
        <div class="order-item__header">
          <span class="order-item__name">${itemName}</span>
          <span class="order-item__price">${price}</span>
        </div>
        <div class="order-item__actions">
          <button class="btn ${isDone ? 'btn--secondary' : 'btn--success'} btn--small"
                  onclick="UI.toggleItemStatus('${escapedItemName}', ${order.table})">
            ${isDone ? I18n.t('todo') : I18n.t('done')}
          </button>
          ${!isDone ? `
            <button class="btn btn--danger btn--small"
                    onclick="UI.cancelItem('${escapedItemName}', ${order.table})">
              ${I18n.t('cancel')}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Annule un article (modifie le State et envoie l'état mis à jour)
   */
  cancelItem(itemName, tableNumber) {
    console.log('🗑️ Annulation demandée pour:', itemName, 'table:', tableNumber);
    
    // Message de confirmation
    if (!confirm(`Annuler "${itemName}" ?`)) {
      return;
    }

    // Supprimer du state
    const success = State.removeItemByNameAndTable(itemName, tableNumber);
    if (!success) {
      alert(`Impossible de trouver "${itemName}" sur la table ${tableNumber}`);
      return;
    }

    console.log('✅ Article supprimé du State, envoi état mis à jour...');
    
    // Envoyer l'état mis à jour via WebSocket
    WebSocketManager.sendUpdatedState();
  },

  /**
   * Toggle statut d'un article (modifie le State et envoie l'état mis à jour)
   */
  toggleItemStatus(itemName, tableNumber) {
    // Trouver l'article dans le state pour connaître son statut actuel
    const items = State.getTableItems(tableNumber);
    const item = items.find(i => 
      i.item.name.fr === itemName || i.item.name.th === itemName || i.item.name === itemName
    );
    
    if (!item) return;
    
    const newStatus = item.status === 'todo' ? 'done' : 'todo';
    State.changeItemStatus(itemName, tableNumber, newStatus);
    
    console.log('✅ Statut modifié dans le State, envoi état mis à jour...');
    
    // Envoyer l'état mis à jour via WebSocket
    WebSocketManager.sendUpdatedState();
  },

  /**
   * Vide une table (modifie le State et envoie l'état mis à jour)
   */
  clearTable(tableNumber) {
    if (confirm(I18n.t('confirmFinish') || 'Terminer cette table ?')) {
      State.clearTable(tableNumber);
      console.log('✅ Table vidée dans le State, envoi état mis à jour...');
      
      // Réinitialiser le montant payé
      this.resetPayment(tableNumber);
      
      // Envoyer l'état mis à jour via WebSocket
      WebSocketManager.sendUpdatedState();
    }
  },

  /**
   * Met à jour tous les textes de l'interface lors d'un changement de langue
   */
  updateLanguage() {
    // Re-créer la grille complète avec les nouveaux textes
    this.updateGrid();
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