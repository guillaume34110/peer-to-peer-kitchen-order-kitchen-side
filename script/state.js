/**
 * Module de gestion d'état des commandes - VERSION SIMPLE
 */
const State = {
  // État simple = juste un objet JavaScript
  data: {
    orders: []       // Array simple d'orders avec orderId inclus - PAS BESOIN DE TABLES !
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
   * Sauvegarde simple dans localStorage
   */
  saveToStorage() {
    try {
      const saveData = {
        ...this.data,
        timestamp: Date.now()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saveData));
      console.log('State sauvegardé:', this.data.orders.length, 'commandes');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  },

  /**
   * Chargement simple depuis localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const loadedData = JSON.parse(stored);
        
        // FORCER orders à être un array
        if (Array.isArray(loadedData.orders)) {
          this.data.orders = loadedData.orders;
        } else {
          console.warn('Format localStorage invalide, reset à []');
          this.data.orders = [];
        }
        
        console.log('State chargé:', this.data.orders.length, 'commandes');
        
        if (this.data.orders.length > 0) {
          this.notifyListeners('stateLoaded', this.data);
        }
      } else {
        // Pas de storage = array vide
        this.data.orders = [];
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
      this.data = { orders: [] };
    }
  },

  /**
   * Vide le localStorage
   */
  clearStorage() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.data = { orders: [] };
    console.log('Storage vidé');
  },

  /**
   * Ajoute un listener pour les changements d'état
   * @param {Function} callback - Fonction appelée lors des changements
   */
  addListener(callback) {
    this.listeners.add(callback);
  },

  /**
   * Supprime un listener
   * @param {Function} callback - Fonction à supprimer
   */
  removeListener(callback) {
    this.listeners.delete(callback);
  },

  /**
   * Notifie tous les listeners d'un changement
   * @param {string} type - Type de changement
   * @param {*} data - Données du changement
   */
  notifyListeners(type, data) {
    this.listeners.forEach(callback => {
      try {
        callback(type, data);
      } catch (error) {
        console.error('Erreur dans un listener:', error);
      }
    });
  },

  /**
   * Ajoute un nouvel article
   */
  addItem(itemData) {
    const item = {
      table: itemData.table,
      timestamp: itemData.timestamp || Date.now(),
      item: itemData.item,
      status: 'todo'
    };

    console.log('📥 Ajout article:', item.item.name, 'table:', item.table);
    
    // Ajouter à l'array
    this.data.orders.push(item);
    console.log('✅ Article ajouté. Total:', this.data.orders.length);
    
    this.saveToStorage();
    this.notifyListeners('itemAdded', item);
  },

  /**
   * Supprime un article par nom + table (premier "todo" trouvé)
   */
  removeItemByNameAndTable(itemName, tableNumber) {
    console.log('🔍 Recherche article à supprimer:', itemName, 'table:', tableNumber);
    
    // Chercher le premier article "todo" avec ce nom sur cette table
    const itemIndex = this.data.orders.findIndex(item => 
      item.table === tableNumber &&
      item.status === 'todo' &&
      (item.item.name.fr === itemName || item.item.name.th === itemName || item.item.name === itemName)
    );
    
    if (itemIndex === -1) {
      console.error('❌ Article non trouvé:', itemName, 'table:', tableNumber);
      return false;
    }
    
    const item = this.data.orders[itemIndex];
    console.log('📝 Article trouvé à l\'index', itemIndex, ':', item.item.name);
    
    // Supprimer l'article
    const removedItem = this.data.orders.splice(itemIndex, 1)[0];
    console.log('✅ Article supprimé:', removedItem.item.name);
    
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
    item.status = status;
    
    this.saveToStorage();
    this.notifyListeners('itemStatusChanged', { itemName, status, table: tableNumber });
    return true;
  },

  /**
   * Récupère tous les articles d'une table
   */
  getTableItems(tableNumber) {
    // Protection : s'assurer que orders est un array
    if (!Array.isArray(this.data.orders)) {
      console.error('ERREUR: this.data.orders n\'est pas un array:', this.data.orders);
      this.data.orders = [];
      return [];
    }
    
    return this.data.orders
      .filter(item => item.table === tableNumber)
      .sort((a, b) => a.timestamp - b.timestamp);
  },

  /**
   * Calcule le total d'une table
   */
  getTableTotal(tableNumber) {
    return this.getTableItems(tableNumber)
      .reduce((total, item) => total + (item.item?.price || 0), 0);
  },

  /**
   * Vide tous les articles d'une table
   */
  clearTable(tableNumber) {
    const tableItems = this.getTableItems(tableNumber);
    
    console.log(`Suppression de ${tableItems.length} articles de la table ${tableNumber}`);
    
    // Supprimer TOUS les articles de cette table (todo et done)
    this.data.orders = this.data.orders.filter(item => item.table !== tableNumber);
    
    this.saveToStorage();
    this.notifyListeners('tableCleared', { tableNumber, clearedCount: tableItems.length });
  },

  /**
   * Récupère toutes les tables avec commandes
   */
  getActiveTables() {
    const tables = [...new Set(this.data.orders.map(order => order.table))];
    return tables.sort((a, b) => a - b);
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
    this.data = { orders: [] };
    this.saveToStorage();
    this.notifyListeners('stateCleared', {});
    console.log('State vidé complètement');
  },

  /**
   * Debug: affiche le state actuel
   */
  debug() {
    console.log('=== STATE DEBUG ===');
    console.log('Orders:', this.data.orders.length);
    console.log('Tables actives:', this.getActiveTables().length);
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