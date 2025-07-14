/**
 * Module de gestion d'état des commandes - VERSION SIMPLE
 */
const State = {
  // État simple = juste un objet JavaScript
  data: {
    orders: [],      // Array simple d'orders avec orderId inclus - PAS BESOIN DE TABLES !
    tablePeople: {}  // Objet pour stocker le nombre de personnes par table : { "1": 4, "2": 2, ... }
  },
  listeners: new Set(),
  STORAGE_KEY: 'kitchen-receiver-state',

  /**
   * Structure d'un Order:
   * {
   *   orderId: string,
   *   table: number,
   *   timestamp: number,
   *   item: {
   *     id: string,
   *     price: number,
   *     name: { fr: string, th: string }
   *   },
   *   status: 'todo' | 'done'
   * }
   */

  /**
   * Initialise le state depuis localStorage
   */
  init() {
    this.loadFromStorage();
    console.log('State initialisé avec', this.data.orders.length, 'commandes');
  },

  /**
   * Charge l'état depuis localStorage
   */
  loadFromStorage() {
    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      if (savedState) {
        this.data = JSON.parse(savedState);
        console.log('État chargé depuis localStorage');
      } else {
        console.log('Aucun état sauvegardé trouvé, utilisation de l\'état par défaut');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'état:', error);
    }
  },

  /**
   * Sauvegarde l'état en localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'état:', error);
    }
  },

  /**
   * Ajoute un écouteur d'événements
   * @param {Function} callback - Fonction à appeler lors d'un changement
   */
  addListener(callback) {
    if (typeof callback === 'function') {
      this.listeners.add(callback);
    }
  },

  /**
   * Supprime un écouteur d'événements
   * @param {Function} callback - Fonction à supprimer
   */
  removeListener(callback) {
    this.listeners.delete(callback);
  },

  /**
   * Notifie tous les écouteurs d'un changement
   * @param {string} event - Type d'événement
   * @param {Object} data - Données associées à l'événement
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Erreur dans un écouteur:', error);
      }
    });
  },

  /**
   * Obtient tous les articles d'une table
   * @param {number} tableNumber - Numéro de la table
   * @returns {Array} Articles de la table
   */
  getTableItems(tableNumber) {
    return this.data.orders.filter(item => item.table === tableNumber);
  },

  /**
   * Obtient le nombre d'articles en attente pour une table
   */
  getPendingItemsCount(tableNumber) {
    return this.data.orders.filter(item => 
      item.table === tableNumber && item.status === 'todo'
    ).length;
  },

  /**
   * Obtient le nombre d'articles terminés pour une table
   */
  getCompletedItemsCount(tableNumber) {
    return this.data.orders.filter(item => 
      item.table === tableNumber && item.status === 'done'
    ).length;
  },

  /**
   * Ajoute un nouvel article
   */
  addItem(itemData) {
    // S'assurer que l'item contient le supplementPrice de l'article du menu
    const menuItem = MenuManager.getItemById(itemData.item.id);
    if (menuItem && menuItem.supplementPrice !== undefined) {
      itemData.item.supplementPrice = menuItem.supplementPrice;
    }
    
    const item = {
      table: itemData.table,
      timestamp: itemData.timestamp || Date.now(),
      item: itemData.item,
      status: 'todo',
      ingredientsRemoved: itemData.ingredientsRemoved || [],
      ingredientsAdded: itemData.ingredientsAdded || [],
      supplements: itemData.supplements || []
    };

    console.log('📥 Ajout article:', item.item.name, 'table:', item.table);
    
    // Décrémenter le stock de l'article
    this.decrementItemStock(item.item.id);
    
    // Ajouter à l'array
    this.data.orders.push(item);
    console.log('✅ Article ajouté. Total:', this.data.orders.length);
    
    this.saveToStorage();
    this.notifyListeners('itemAdded', item);
  },

  /**
   * Décrémenter le stock d'un article
   * @param {string} itemId - ID de l'article
   */
  decrementItemStock(itemId) {
    const menuItem = MenuManager.getItemById(itemId);
    
    if (!menuItem || menuItem.quantity.infinite) {
      return; // Ne pas décrémenter si l'article n'existe pas ou a un stock infini
    }
    
    if (menuItem.quantity.amount > 0) {
      menuItem.quantity.amount -= 1;
      MenuManager.saveMenuToStorage();
      console.log(`Stock décrémenté pour ${menuItem.name.fr}: ${menuItem.quantity.amount} restants`);
    } else {
      console.warn(`Stock épuisé pour ${menuItem.name.fr}`);
    }
  },

  /**
   * Incrémenter le stock d'un article
   * @param {string} itemId - ID de l'article
   */
  incrementItemStock(itemId) {
    const menuItem = MenuManager.getItemById(itemId);
    
    if (!menuItem || menuItem.quantity.infinite) {
      return; // Ne pas incrémenter si l'article n'existe pas ou a un stock infini
    }
    
    menuItem.quantity.amount += 1;
    MenuManager.saveMenuToStorage();
    console.log(`Stock incrémenté pour ${menuItem.name.fr}: ${menuItem.quantity.amount} disponibles`);
  },

  /**
   * Supprime un article par nom et table
   */
  removeItemByNameAndTable(itemName, tableNumber) {
    const index = this.data.orders.findIndex(item => 
      item.table === tableNumber &&
      (item.item.name.fr === itemName || item.item.name.th === itemName || item.item.name === itemName)
    );
    
    if (index === -1) return false;
    
    const removedItem = this.data.orders[index];
    
    // Incrémenter le stock de l'article annulé
    this.incrementItemStock(removedItem.item.id);
    
    this.data.orders.splice(index, 1);
    this.saveToStorage();
    this.notifyListeners('itemRemoved', { itemName, table: tableNumber });
    return true;
  },

  /**
   * Change le statut d'un article par nom + table
   */
  changeItemStatus(itemName, tableNumber, status) {
    const item = this.data.orders.find(item => 
      item.table === tableNumber &&
      (item.item.name.fr === itemName || item.item.name.th === itemName || item.item.name === itemName)
    );
    
    if (!item || item.status === status) return false;
    
    console.log('Changement statut:', itemName, 'table:', tableNumber, '→', status);
    
    // Si l'article passe en "done", juste ajouter le timestamp de validation (sans archiver)
    // Note: Le stock a déjà été décrémenté lors de l'ajout de l'article, donc on ne le modifie pas ici
    if (status === 'done') {
      item.validatedAt = Date.now(); // Timestamp de validation pour les stats futures
      console.log('📋 Article marqué comme fait (sera archivé à la fin de table):', item.item.name);
    }
    
    item.status = status;
    
    this.saveToStorage();
    this.notifyListeners('itemStatusChanged', { itemName, status, table: tableNumber });
    return true;
  },

  /**
   * Change le statut d'un article par timestamp unique
   */
  changeItemStatusByTimestamp(timestamp, status) {
    const item = this.data.orders.find(item => item.timestamp === timestamp);
    
    if (!item || item.status === status) return false;
    
    console.log('Changement statut par timestamp:', timestamp, '→', status, 'Article:', item.item.name);
    
    // Si l'article passe en "done", juste ajouter le timestamp de validation (sans archiver)
    // Note: Le stock a déjà été décrémenté lors de l'ajout de l'article, donc on ne le modifie pas ici
    if (status === 'done') {
      item.validatedAt = Date.now(); // Timestamp de validation pour les stats futures
      console.log('📋 Article marqué comme fait (sera archivé à la fin de table):', item.item.name);
    }
    
    item.status = status;
    
    this.saveToStorage();
    this.notifyListeners('itemStatusChanged', { 
      itemName: item.item.name, 
      status, 
      table: item.table,
      timestamp 
    });
    return true;
  },

  /**
   * Récupère une commande par timestamp
   */
  getItemByTimestamp(timestamp) {
    return this.data.orders.find(item => item.timestamp === timestamp);
  },

  /**
   * Modifie une commande et envoie la modification via WebSocket
   */
  modifyOrderAndSync(originalTimestamp, modificationData) {
    const success = this.modifyItemByTimestamp(originalTimestamp, modificationData);
    
    if (success && window.WebSocketManager) {
      // Envoyer la modification via WebSocket
      window.WebSocketManager.sendOrderModification(originalTimestamp, modificationData);
    }
    
    return success;
  },

  /**
   * Modifie un article existant par timestamp
   */
  modifyItemByTimestamp(originalTimestamp, modificationData) {
    // Trouver l'article à modifier par son timestamp original
    const itemIndex = this.data.orders.findIndex(item => item.timestamp === originalTimestamp);
    
    if (itemIndex === -1) {
      console.error('Article non trouvé pour modification, timestamp:', originalTimestamp);
      return false;
    }
    
    const item = this.data.orders[itemIndex];
    console.log('📝 Modification article:', item.item.name, 'Timestamp:', originalTimestamp);
    
    // Mettre à jour les ingrédients et suppléments
    if (modificationData.ingredientsRemoved !== undefined) {
      item.ingredientsRemoved = modificationData.ingredientsRemoved;
    }
    if (modificationData.ingredientsAdded !== undefined) {
      item.ingredientsAdded = modificationData.ingredientsAdded;
    }
    if (modificationData.supplements !== undefined) {
      item.supplements = modificationData.supplements;
    }
    
    // Mettre à jour le prix si nécessaire (pour les suppléments)
    if (modificationData.item && modificationData.item.price !== undefined) {
      item.item.price = modificationData.item.price;
    }
    
    this.saveToStorage();
    this.notifyListeners('itemModified', { 
      originalTimestamp,
      table: item.table,
      timestamp: item.timestamp,
      modifications: modificationData
    });
    
    console.log('✅ Article modifié avec succès');
    return true;
  },

  /**
   * Calcule le total d'une table
   */
  getTableTotal(tableNumber) {
    return this.getTableItems(tableNumber)
      .reduce((total, item) => {
        const basePrice = item.item?.price || 0;
        const ingredientsAdded = item.ingredientsAdded || [];
        const supplementPrice = item.item?.supplementPrice || 0;
        
        // Logique correcte : multiplier le prix du supplément par le nombre d'ingrédients ajoutés
        const totalSupplementPrice = ingredientsAdded.length * supplementPrice;

        return total + basePrice + totalSupplementPrice;
      }, 0);
  },

  /**
   * Vide tous les articles d'une table
   */
  clearTable(tableNumber) {
    const tableItems = this.getTableItems(tableNumber);
    
    console.log(`Suppression de ${tableItems.length} articles de la table ${tableNumber}`);
    
    // Archiver TOUS les articles de la table (todo ET done) avec le même timestamp de fin
    if (typeof StatsManager !== 'undefined' && tableItems.length > 0) {
      console.log(`Archivage de ${tableItems.length} articles de la table terminée`);
      const tableEndTime = Date.now(); // Timestamp unique de fin de table
      const peopleCount = this.getTablePeopleCount(tableNumber);
      
      tableItems.forEach(item => {
        // Utiliser le timestamp de fin de table pour tous les articles
        item.validatedAt = tableEndTime;
        item.peopleCount = peopleCount;
        StatsManager.archiveCompletedOrder(item);
      });
    }
    
    // Incrémenter le stock pour tous les articles annulés de la table
    // (on ne le fait pas pour les articles déjà servis/terminés)
    tableItems.forEach(item => {
      if (item.status === 'todo') {
        this.incrementItemStock(item.item.id);
      }
    });
    
    // Supprimer TOUS les articles de cette table (todo et done)
    this.data.orders = this.data.orders.filter(item => item.table !== tableNumber);
    
    this.saveToStorage();
    this.notifyListeners('tableCleared', { tableNumber, clearedCount: tableItems.length });
  },

  /**
   * Obtient les tables actives
   * @returns {Array} Numéros des tables actives
   */
  getActiveTables() {
    const tables = new Set();
    this.data.orders.forEach(item => tables.add(item.table));
    return Array.from(tables).sort((a, b) => a - b);
  },

  /**
   * Compte total des commandes
   * @returns {number} Nombre de commandes
   */
  getTotalOrdersCount() {
    return this.data.orders.length;
  },

  /**
   * Obtient les statistiques générales
   * @returns {Object} Statistiques
   */
  getStats() {
    const todo = this.data.orders.filter(o => o.status === 'todo').length;
    const done = this.data.orders.filter(o => o.status === 'done').length;
    const tables = this.getActiveTables().length;
    
    return {
      totalOrders: this.data.orders.length,
      todoOrders: todo,
      doneOrders: done,
      activeTables: tables
    };
  },

  /**
   * Vide complètement le state
   */
  clear() {
    this.data = { orders: [], tablePeople: {} };
    this.saveToStorage();
    this.notifyListeners('stateCleared', {});
    console.log('State vidé complètement');
  },

  /**
   * Obtient le nombre de personnes pour une table
   */
  getTablePeopleCount(tableNumber) {
    return this.data.tablePeople[tableNumber] || 0;
  },

  /**
   * Définit le nombre de personnes pour une table
   * @param {number} tableNumber - Numéro de la table
   * @param {number} peopleCount - Nombre de personnes
   */
  setTablePeopleCount(tableNumber, peopleCount) {
    this.data.tablePeople[tableNumber] = peopleCount;
    this.saveToStorage();
    this.notifyListeners('tablePeopleChanged', { tableNumber, peopleCount });
    console.log(`Table ${tableNumber}: ${peopleCount} personnes`);
  },

  /**
   * Debug: affiche le state actuel
   */
  debug() {
    console.log('=== STATE DEBUG ===');
    console.log('Orders:', this.data.orders.length);
    console.log('Tables actives:', this.getActiveTables().length);
    console.log('Table people:', this.data.tablePeople);
    console.log('Data complète:', this.data);
    console.log('==================');
  },

  /**
   * Affiche le contenu brut du localStorage
   */
  debugStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        console.log('=== STORAGE ===');
        const data = JSON.parse(stored);
        console.log('Orders:', data.orders?.length || 0);
        console.log('Data complète:', data);
        console.log('===============');
      } else {
        console.log('LocalStorage vide');
      }
    } catch (e) {
      console.error('Erreur lecture storage:', e);
    }
  }
};

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = State;
} 