/**
 * Module d'interface utilisateur pour la liste chronologique des commandes
 */
const OrderListUI = {
  isVisible: false,
  tableColors: [
    '#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', 
    '#db2777', '#0891b2', '#65a30d', '#e11d48', '#0369a1'
  ],

  /**
   * Initialise l'interface de la liste des commandes
   */
  init() {
    this.createOrderListView();
    this.bindStateListeners();
  },

  /**
   * Lie les événements d'état pour mettre à jour l'affichage
   */
  bindStateListeners() {
    State.addListener((type, data) => {
      if (this.isVisible) {
        // Rafraîchir l'affichage lors de tout changement d'état
        this.refreshOrderList();
      }
    });
  },

  /**
   * Crée la vue de la liste des commandes
   */
  createOrderListView() {
    const main = document.querySelector('.main');
    
    const orderListView = document.createElement('div');
    orderListView.id = 'orderlist-view';
    orderListView.className = 'orderlist-view';
    orderListView.style.display = 'none';
    
    orderListView.innerHTML = `
      <div class="orderlist-container">
        <div class="orderlist-header">
          <h2 data-i18n="orderList">${I18n.t('orderList')}</h2>
        </div>
        <div class="orderlist-content" id="orderlist-content">
          <p class="no-orders" data-i18n="noOrdersInProgress">${I18n.t('noOrdersInProgress')}</p>
        </div>
      </div>
    `;
    
    main.appendChild(orderListView);
  },

  /**
   * Affiche la vue de la liste des commandes
   */
  showOrderListView() {
    const orderListView = document.getElementById('orderlist-view');
    const tablesGrid = document.getElementById('tables-grid');
    const menuView = document.getElementById('menu-view');
    const statsView = document.getElementById('stats-view');
    
    if (orderListView) {
      orderListView.style.display = 'block';
      this.isVisible = true;
      this.refreshOrderList();
    }
    
    if (tablesGrid) tablesGrid.style.display = 'none';
    if (menuView) menuView.style.display = 'none';
    if (statsView) statsView.style.display = 'none';
    
  },

  /**
   * Cache la vue de la liste des commandes
   */
  hideOrderListView() {
    const orderListView = document.getElementById('orderlist-view');
    if (orderListView) {
      orderListView.style.display = 'none';
      this.isVisible = false;
    }
  },

  /**
   * Rafraîchit l'affichage de la liste des commandes
   */
  refreshOrderList() {
    const container = document.getElementById('orderlist-content');
    if (!container) return;

    // Récupérer toutes les commandes actives (seulement les "todo")
    const allOrders = State.data.orders || [];
    const todoOrders = allOrders.filter(order => order.status === 'todo');
    
    if (todoOrders.length === 0) {
      container.innerHTML = `<p class="no-orders">${I18n.t('noOrdersInProgress')}</p>`;
      return;
    }

    // Organiser par table (seulement les tables avec des todos)
    const ordersByTable = {};
    todoOrders.forEach(order => {
      if (!ordersByTable[order.table]) {
        ordersByTable[order.table] = [];
      }
      ordersByTable[order.table].push(order);
    });

    // Trier les tables par timestamp de la plus ancienne commande
    const sortedTables = Object.keys(ordersByTable).sort((a, b) => {
      const oldestA = Math.min(...ordersByTable[a].map(o => o.timestamp));
      const oldestB = Math.min(...ordersByTable[b].map(o => o.timestamp));
      return oldestA - oldestB;
    });

    container.innerHTML = '';
    let firstTableCard = null;

    sortedTables.forEach((tableNumber, index) => {
      const tableOrders = ordersByTable[tableNumber];
      const tableCard = this.createTableOrderCard(tableNumber, tableOrders, index);
      container.appendChild(tableCard);

      // Mémoriser la première table pour l'auto-scroll
      if (index === 0) {
        firstTableCard = tableCard;
      }
    });

    // Auto-scroll vers la première table (plus ancienne avec des todos)
    if (firstTableCard) {
      setTimeout(() => {
        firstTableCard.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  },

  /**
   * Crée une carte pour les commandes d'une table
   * @param {string} tableNumber - Numéro de la table
   * @param {Array} orders - Commandes de la table (seulement todos)
   * @param {number} colorIndex - Index pour la couleur du badge
   * @returns {HTMLElement} Élément de la carte
   */
  createTableOrderCard(tableNumber, orders, colorIndex) {
    const card = document.createElement('div');
    card.className = 'orderlist-table-card';
    card.dataset.table = tableNumber;

    const color = this.tableColors[colorIndex % this.tableColors.length];
    const todoCount = orders.length; // Tous les orders sont des todos maintenant
     const totalAmount = orders.reduce((sum, o) => {
      const basePrice = o.item?.price || 0;
      const ingredientsAdded = o.ingredientsAdded || [];
      const supplementPrice = o.item?.supplementPrice || 0;
      const totalSupplementPrice = ingredientsAdded.length * supplementPrice;
      return sum + basePrice + totalSupplementPrice;
    }, 0);
    const peopleCount = State.getTablePeopleCount(parseInt(tableNumber));

    // Trier les commandes par timestamp
    const sortedOrders = [...orders].sort((a, b) => a.timestamp - b.timestamp);

    // Créer l'heure de la première commande
    const locale = I18n.currentLang === 'th' ? 'th-TH' : 'fr-FR';
    const firstOrderTime = new Date(sortedOrders[0].timestamp).toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    });

    const tableLabel = I18n.t('table');
    const peopleLabel = I18n.t('people');
    const todoLabel = I18n.t('completedOrders');

    card.innerHTML = `
      <div class="table-order-header">
        <div class="table-badge" style="background-color: ${color}">
          ${tableLabel} ${tableNumber}
        </div>
        <div class="table-info">
          <div class="table-time">${firstOrderTime}</div>
          <div class="table-people">${peopleCount} ${peopleLabel}</div>
        </div>
        <div class="table-status">
          <span class="status-todo">${todoCount} ${todoLabel}</span>
          <span class="table-total">${I18n.formatPrice(totalAmount)}</span>
        </div>
      </div>
      <div class="table-order-items">
        ${sortedOrders.map(order => this.createOrderItemHTML(order)).join('')}
      </div>
    `;

    return card;
  },

  /**
   * Crée le HTML d'un item de commande
   * @param {Object} order - Commande (toujours todo dans cette vue)
   * @returns {string} HTML de l'item
   */
  createOrderItemHTML(order) {
    const itemName = I18n.getItemName(order.item);
    
    // Gérer les ingrédients retirés et ajoutés
    const ingredientsAdded = order.ingredientsAdded || [];
    const ingredientsRemoved = order.ingredientsRemoved || [];
    
    // Calculer le prix total : prix de base + (prix du supplément * nombre d'ingrédients)
    const basePrice = order.item.price || 0;
    const supplementPrice = order.item.supplementPrice || 0;
    const totalSupplementPrice = ingredientsAdded.length * supplementPrice;
    const totalPrice = basePrice + totalSupplementPrice;
    const price = I18n.formatPrice(totalPrice);
    
    let ingredientsHTML = '';
    if (ingredientsRemoved.length > 0 || ingredientsAdded.length > 0) {
      ingredientsHTML = `
        <div class="orderlist-item__ingredients">
          ${ingredientsRemoved.length > 0 ? `
            <div class="ingredients-section">
              <span class="ingredients-label removed">${I18n.t('ingredientsRemoved')}:</span>
              <div class="ingredients-tags">
                ${ingredientsRemoved.map(ingId => {
                  const ingredient = window.ingredients.find(ing => ing.id === ingId);
                  if (!ingredient) return '';
                  const currentLang = I18n.getCurrentLanguage();
                  const ingName = ingredient.name[currentLang] || ingredient.name.fr;
                  return `<span class="ingredient-tag removed">${ingName}</span>`;
                }).join('')}
              </div>
            </div>
          ` : ''}
          ${ingredientsAdded.length > 0 ? `
            <div class="ingredients-section">
              <span class="ingredients-label added">${I18n.t('ingredientsAdded')}:</span>
              <div class="ingredients-tags">
                ${ingredientsAdded.map(ingId => {
                  const ingredient = window.ingredients.find(ing => ing.id === ingId);
                  if (!ingredient) return '';
                  const currentLang = I18n.getCurrentLanguage();
                  const ingName = ingredient.name[currentLang] || ingredient.name.fr;
                  return `<span class="ingredient-tag added">${ingName}</span>`;
                }).join('')}
              </div>
              ${totalSupplementPrice > 0 ? `<div class="supplement-price">+${I18n.formatPrice(totalSupplementPrice)}</div>` : ''}
            </div>
          ` : ''}
        </div>
      `;
    }
    
    return `
      <div class="orderlist-item todo">
        <div class="item-content">
          <span class="item-name">${itemName}</span>
          <span class="item-price">${price}</span>
        </div>
        ${ingredientsHTML}
        <div class="item-actions">
          <button class="btn btn--success btn--small"
                  onclick="OrderListUI.toggleItemStatusByTimestamp(${order.timestamp})">
            ✓
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Toggle le statut d'un article par timestamp (méthode recommandée)
   * @param {number} timestamp - Timestamp unique de l'article
   */
  toggleItemStatusByTimestamp(timestamp) {
    // Trouver l'article dans le state par timestamp
    const item = State.data.orders.find(order => order.timestamp === timestamp);
    
    if (!item) {
      console.error('Article non trouvé avec timestamp:', timestamp);
      return;
    }
    
    const newStatus = item.status === 'todo' ? 'done' : 'todo';
    State.changeItemStatusByTimestamp(timestamp, newStatus);
    
    // Envoyer l'état mis à jour via WebSocket
    WebSocketManager.sendUpdatedState();
    
    // Rafraîchir l'affichage
    this.refreshOrderList();
  },

  /**
   * Toggle le statut d'un article par nom (conservé pour compatibilité)
   * @param {string} itemName - Nom de l'article
   * @param {number} tableNumber - Numéro de la table
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
    
    // Envoyer l'état mis à jour via WebSocket
    WebSocketManager.sendUpdatedState();
    
    // Rafraîchir l'affichage
    this.refreshOrderList();
  },

  /**
   * Obtient la couleur d'une table
   * @param {number} tableNumber - Numéro de la table
   * @returns {string} Couleur hexadécimale
   */
  getTableColor(tableNumber) {
    return this.tableColors[(tableNumber - 1) % this.tableColors.length];
  },

  /**
   * Met à jour l'interface lors du changement de langue
   */
  updateLanguage() {
    if (this.isVisible) {
      this.refreshOrderList();
    }
  }
};

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OrderListUI;
} 