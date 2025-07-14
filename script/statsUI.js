/**
 * Module d'interface utilisateur pour les statistiques
 */
const StatsUI = {
  isVisible: false,

  /**
   * Initialise l'interface des statistiques
   */
  init() {
    this.createStatsView();
    this.bindEvents();
    console.log('StatsUI initialisé');
  },

  /**
   * Crée la vue des statistiques
   */
  createStatsView() {
    const main = document.querySelector('.main');
    
    const statsView = document.createElement('div');
    statsView.id = 'stats-view';
    statsView.className = 'stats-view';
    statsView.style.display = 'none';
    
    statsView.innerHTML = `
      <div class="stats-container">
        <div class="stats-header">
          <h2 data-i18n="dailyStats">${I18n.t('dailyStats')}</h2>
          <button id="clear-stats-btn" class="btn btn--danger">
            <span data-i18n="clearStats">${I18n.t('clearStats')}</span>
          </button>
        </div>
        
        <div class="stats-summary">
          <div class="stats-card">
            <h3 data-i18n="dailyTotal">${I18n.t('dailyTotal')}</h3>
            <div class="stats-total" id="daily-total">
                ${I18n.formatPrice(0)}
                <img src="assets/images/fiscal.svg" class="icon" alt="Fiscal icon"/>
            </div>
            <div class="stats-metrics">
              <div class="stats-metric">
                <span class="metric-label" data-i18n="completedOrders">${I18n.t('completedOrders')}</span>
                <span class="metric-value" id="daily-count">0</span>
              </div>
              <div class="stats-metric">
                <span class="metric-label" data-i18n="totalTablesServed">${I18n.t('totalTablesServed')}</span>
                <span class="metric-value" id="daily-tables">0</span>
              </div>
              <div class="stats-metric">
                <span class="metric-label" data-i18n="averageTicket">${I18n.t('averageTicket')}</span>
                <span class="metric-value" id="daily-average">
                    ${I18n.formatPrice(0)}
                    <img src="assets/images/fiscal.svg" class="icon" alt="Fiscal icon"/>
                </span>
              </div>
              <div class="stats-metric">
                <span class="metric-label" data-i18n="totalCovers">${I18n.t('totalCovers')}</span>
                <span class="metric-value" id="daily-covers">0</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="stats-sections">
          <div class="stats-section">
            <h3 data-i18n="chronologicalOrders">${I18n.t('chronologicalOrders')}</h3>
            <div class="stats-chronological" id="stats-chronological">
              <p class="no-data" data-i18n="noStatsToday">${I18n.t('noStatsToday')}</p>
            </div>
          </div>
          
          <div class="stats-section">
            <h3 data-i18n="ordersByTable">${I18n.t('ordersByTable')}</h3>
            <div class="stats-tables" id="stats-tables">
              <p class="no-data" data-i18n="noStatsToday">${I18n.t('noStatsToday')}</p>
            </div>
          </div>
          
          <div class="stats-section">
            <h3 data-i18n="dishCount">${I18n.t('dishCount')}</h3>
            <div class="stats-dishes" id="stats-dishes">
              <p class="no-data" data-i18n="noStatsToday">${I18n.t('noStatsToday')}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    main.appendChild(statsView);
  },

  /**
   * Lie les événements
   */
  bindEvents() {
    // Méthode principale : lier directement au bouton
    setTimeout(() => {
      const clearBtn = document.getElementById('clear-stats-btn');
      if (clearBtn) {
        // Supprimer l'ancien event listener s'il existe
        clearBtn.removeEventListener('click', this.handleClearStats.bind(this));
        // Ajouter le nouvel event listener
        clearBtn.addEventListener('click', this.handleClearStats.bind(this));
        console.log('Événement effacer stats lié directement');
      } else {
        console.error('Bouton clear-stats-btn non trouvé');
      }
    }, 100);

    // Méthode de secours : délégation d'événement
    const statsView = document.getElementById('stats-view');
    if (statsView) {
      statsView.addEventListener('click', (e) => {
        if (e.target.closest('#clear-stats-btn')) {
          console.log('Bouton effacer stats cliqué via délégation');
          this.handleClearStats();
        }
      });
      console.log('Délégation d\'événement configurée pour les stats');
    }
  },

  /**
   * Affiche la vue des statistiques
   */
  showStatsView() {
    const statsView = document.getElementById('stats-view');
    const tablesGrid = document.getElementById('tables-grid');
    const menuView = document.getElementById('menu-view');
    const orderListView = document.getElementById('orderlist-view');
    
    if (statsView) {
      statsView.style.display = 'block';
      this.isVisible = true;
      this.refreshStats();
      
      // S'assurer que les événements sont liés
      this.bindEvents();
    }
    
    if (tablesGrid) tablesGrid.style.display = 'none';
    if (menuView) menuView.style.display = 'none';
    if (orderListView) orderListView.style.display = 'none';
    
    console.log('Vue stats affichée');
  },

  /**
   * Cache la vue des statistiques
   */
  hideStatsView() {
    const statsView = document.getElementById('stats-view');
    if (statsView) {
      statsView.style.display = 'none';
      this.isVisible = false;
    }
    console.log('Vue stats cachée');
  },

  /**
   * Rafraîchit l'affichage des statistiques
   */
  refreshStats() {
    const stats = StatsManager.getDailyStats();
    console.log('Stats du jour:', stats);
    
    this.updateSummary(stats);
    this.updateChronologicalStats(stats);
    this.updateTableStats(stats);
    this.updateDishStats(stats);
  },

  /**
   * Met à jour le résumé des statistiques
   * @param {Object} stats - Statistiques du jour
   */
  updateSummary(stats) {
    const totalElement = document.getElementById('daily-total');
    const countElement = document.getElementById('daily-count');
    const tablesElement = document.getElementById('daily-tables');
    const averageElement = document.getElementById('daily-average');
    const coversElement = document.getElementById('daily-covers');
    
          if (totalElement) {
        totalElement.innerHTML = `${I18n.formatPrice(stats.totalRevenue)} <img src="assets/images/fiscal.svg" class="icon" alt="Fiscal icon">`;
      }
    
    if (countElement) {
      countElement.textContent = stats.orderCount.toString();
    }
    
    if (tablesElement) {
      tablesElement.textContent = stats.totalTables.toString();
    }
    
          if (averageElement) {
        averageElement.innerHTML = `${I18n.formatPrice(stats.averageTicket)} <img src="assets/images/fiscal.svg" class="icon" alt="Fiscal icon">`;
      }
    
    if (coversElement) {
      coversElement.textContent = stats.totalCovers.toString();
    }
  },

  /**
   * Met à jour l'historique chronologique des commandes
   * @param {Object} stats - Statistiques du jour
   */
  updateChronologicalStats(stats) {
    const container = document.getElementById('stats-chronological');
    if (!container) return;

    const orders = stats.chronologicalOrders || [];
    
    if (orders.length === 0) {
      container.innerHTML = `<p class="no-data" data-i18n="noStatsToday">${I18n.t('noStatsToday')}</p>`;
      return;
    }

    container.innerHTML = '';
    
    // Regrouper par timestamp de validation (même moment où les articles ont été marqués "fait")
    const groupedOrders = {};
    orders.forEach(order => {
      const groupKey = `${order.table}_${order.validatedAt}`;
      if (!groupedOrders[groupKey]) {
        groupedOrders[groupKey] = {
          table: order.table,
          validatedAt: order.validatedAt,
          validatedTime: order.validatedTime,
          orders: []
        };
      }
      groupedOrders[groupKey].orders.push(order);
    });

    // Trier les groupes par timestamp de validation
    const sortedGroups = Object.values(groupedOrders)
      .sort((a, b) => a.validatedAt - b.validatedAt);

    // Afficher chaque groupe
    sortedGroups.forEach(group => {
      const groupCard = document.createElement('div');
      groupCard.className = 'stats-order-group';
      
      const tableLabel = I18n.t('table');
      const groupTotal = group.orders.reduce((sum, order) => {
        const basePrice = order.item.price || 0;
        const ingredientsAdded = order.ingredientsAdded || [];
        const supplementPrice = order.item.supplementPrice || 0;
        const totalSupplementPrice = ingredientsAdded.length * supplementPrice;
        return sum + basePrice + totalSupplementPrice;
      }, 0);
      
      groupCard.innerHTML = `
        <div class="group-header">
          <div class="group-info">
            <span class="group-table">${tableLabel} ${group.table}</span>
            <span class="group-time">${group.validatedTime}</span>
          </div>
          <div class="group-total">${I18n.formatPrice(groupTotal)}</div>
        </div>
        <div class="group-orders">
          ${group.orders.map(order => {
            const dishName = I18n.getItemName(order.item);
            
            const ingredientsAdded = order.ingredientsAdded || [];
            const ingredientsRemoved = order.ingredientsRemoved || [];
            
            const basePrice = order.item.price || 0;
            const supplementPrice = order.item.supplementPrice || 0;
            const totalSupplementPrice = ingredientsAdded.length * supplementPrice;
            const totalPrice = basePrice + totalSupplementPrice;
            
            let ingredientsHTML = '';
            if (ingredientsRemoved.length > 0 || ingredientsAdded.length > 0) {
              ingredientsHTML = `
                <div class="stats-ingredients">
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
              <div class="order-item">
                <div class="order-item-header">
                  <span class="order-item-name">${dishName}</span>
                  <span class="order-item-price">${I18n.formatPrice(totalPrice)}</span>
                </div>
                ${ingredientsHTML}
              </div>
            `;
          }).join('')}
        </div>
      `;
      
      container.appendChild(groupCard);
    });
  },

  /**
   * Met à jour les statistiques par table
   * @param {Object} stats - Statistiques du jour
   */
  updateTableStats(stats) {
    const container = document.getElementById('stats-tables');
    if (!container) return;

    const tables = Object.keys(stats.ordersByTable);
    
    if (tables.length === 0) {
      container.innerHTML = `<p class="no-data" data-i18n="noStatsToday">${I18n.t('noStatsToday')}</p>`;
      return;
    }

    container.innerHTML = '';
    
    // Trier les tables par numéro
    tables.sort((a, b) => parseInt(a) - parseInt(b)).forEach(tableNum => {
      const tableData = stats.ordersByTable[tableNum];
      
      const tableCard = document.createElement('div');
      tableCard.className = 'stats-table-card';
      
      const tableLabel = I18n.t('table');
      const ordersLabel = I18n.t('completedOrders');
      
      tableCard.innerHTML = `
                  <div class="table-header">
            <h4>${tableLabel} ${tableNum}</h4>
            <div class="table-total">${I18n.formatPrice(tableData.orders.reduce((sum, order) => {
              const basePrice = order.item.price || 0;
              const ingredientsAdded = order.ingredientsAdded || [];
              const supplementPrice = order.item.supplementPrice || 0;
              const totalSupplementPrice = ingredientsAdded.length * supplementPrice;
              return sum + basePrice + totalSupplementPrice;
            }, 0))}</div>
          </div>
        <div class="table-count">${tableData.count} ${ordersLabel}</div>
        <div class="table-orders">
                      ${tableData.orders.map(order => {
              const dishName = I18n.getItemName(order.item);
              const basePrice = order.item.price || 0;
              const ingredientsAdded = order.ingredientsAdded || [];
              const supplementPrice = order.item.supplementPrice || 0;
              const totalSupplementPrice = ingredientsAdded.length * supplementPrice;
              return `<div class="order-item">${dishName} - ${I18n.formatPrice(basePrice + totalSupplementPrice)}</div>`;
            }).join('')}
        </div>
      `;
      
      container.appendChild(tableCard);
    });
  },

  /**
   * Met à jour les statistiques des plats
   * @param {Object} stats - Statistiques du jour
   */
  updateDishStats(stats) {
    const container = document.getElementById('stats-dishes');
    if (!container) return;

    const dishes = Object.entries(stats.dishCount);
    
    if (dishes.length === 0) {
      container.innerHTML = `<p class="no-data" data-i18n="noStatsToday">${I18n.t('noStatsToday')}</p>`;
      return;
    }

    container.innerHTML = '';
    
    // Trier par quantité décroissante
    dishes.sort((a, b) => b[1] - a[1]).forEach(([dishName, count]) => {
      const dishCard = document.createElement('div');
      dishCard.className = 'stats-dish-card';
      
      dishCard.innerHTML = `
        <div class="dish-name">${dishName}</div>
        <div class="dish-count">${count}</div>
      `;
      
      container.appendChild(dishCard);
    });
  },

  /**
   * Gère l'effacement des statistiques
   */
  handleClearStats() {
    const confirmMessage = I18n.t('confirmClearStats');
    
    console.log('Bouton effacer stats cliqué');
    
    if (confirm(confirmMessage)) {
      console.log('Effacement confirmé, suppression...');
      StatsManager.clearAllStats();
      this.refreshStats();
      
      // Afficher un message de confirmation
      const successMessage = I18n.t('statsCleared');
      console.log(successMessage);
      alert(successMessage);
    } else {
      console.log('Effacement annulé');
    }
  },

  /**
   * Met à jour l'interface lors du changement de langue
   */
  updateLanguage() {
    if (this.isVisible) {
      this.refreshStats();
    }
  }
};

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StatsUI;
} 