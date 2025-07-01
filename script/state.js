/**
 * Module de gestion d'état des commandes
 * Stocke et manipule les orders en mémoire
 */
const State = {
  orders: new Map(), // Map<orderId, Order>
  tableOrders: new Map(), // Map<tableNumber, Set<orderId>>
  listeners: new Set(),

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
   * Ajoute ou met à jour une commande
   * @param {Object} orderData - Données de la commande
   */
  addOrder(orderData) {
    const order = {
      orderId: orderData.orderId,
      table: orderData.table,
      timestamp: orderData.timestamp,
      item: orderData.item,
      status: 'todo'
    };

    // Ajouter à la map des orders
    this.orders.set(order.orderId, order);

    // Ajouter à la map des tables
    if (!this.tableOrders.has(order.table)) {
      this.tableOrders.set(order.table, new Set());
    }
    this.tableOrders.get(order.table).add(order.orderId);

    this.notifyListeners('orderAdded', order);
    console.log('Commande ajoutée:', order.orderId, 'Table:', order.table);
  },

  /**
   * Supprime une commande (uniquement si status = 'todo')
   * @param {string} orderId - ID de la commande
   * @returns {boolean} True si supprimée avec succès
   */
  removeOrder(orderId) {
    const order = this.orders.get(orderId);
    if (!order) {
      console.warn('Commande non trouvée:', orderId);
      return false;
    }

    if (order.status === 'done') {
      console.warn('Impossible de supprimer une commande terminée:', orderId);
      return false;
    }

    // Supprimer de la map des orders
    this.orders.delete(orderId);

    // Supprimer de la map des tables
    const tableOrderSet = this.tableOrders.get(order.table);
    if (tableOrderSet) {
      tableOrderSet.delete(orderId);
      if (tableOrderSet.size === 0) {
        this.tableOrders.delete(order.table);
      }
    }

    this.notifyListeners('orderRemoved', { orderId, table: order.table });
    console.log('Commande supprimée:', orderId);
    return true;
  },

  /**
   * Change le statut d'une commande
   * @param {string} orderId - ID de la commande
   * @param {string} status - Nouveau statut ('todo' | 'done')
   * @returns {boolean} True si changé avec succès
   */
  changeOrderStatus(orderId, status) {
    const order = this.orders.get(orderId);
    if (!order) {
      console.warn('Commande non trouvée:', orderId);
      return false;
    }

    if (order.status === status) {
      return true; // Déjà le bon statut
    }

    order.status = status;
    this.notifyListeners('orderStatusChanged', { orderId, status, table: order.table });
    console.log('Statut changé:', orderId, '→', status);
    return true;
  },

  /**
   * Obtient une commande par ID
   * @param {string} orderId - ID de la commande
   * @returns {Object|null} Commande ou null
   */
  getOrder(orderId) {
    return this.orders.get(orderId) || null;
  },

  /**
   * Obtient toutes les commandes d'une table
   * @param {number} tableNumber - Numéro de table
   * @returns {Array} Liste des commandes
   */
  getTableOrders(tableNumber) {
    const orderIds = this.tableOrders.get(tableNumber);
    if (!orderIds) {
      return [];
    }

    return Array.from(orderIds)
      .map(orderId => this.orders.get(orderId))
      .filter(order => order) // Filtrer les orders null
      .sort((a, b) => a.timestamp - b.timestamp); // Trier par timestamp
  },

  /**
   * Calcule le total d'une table
   * @param {number} tableNumber - Numéro de table
   * @returns {number} Total des prix
   */
  getTableTotal(tableNumber) {
    const orders = this.getTableOrders(tableNumber);
    return orders.reduce((total, order) => total + order.item.price, 0);
  },

  /**
   * Vide toutes les commandes d'une table
   * @param {number} tableNumber - Numéro de table
   */
  clearTable(tableNumber) {
    const orderIds = this.tableOrders.get(tableNumber);
    if (!orderIds) {
      return;
    }

    // Supprimer toutes les commandes de cette table
    Array.from(orderIds).forEach(orderId => {
      this.orders.delete(orderId);
    });

    // Supprimer la table de la map
    this.tableOrders.delete(tableNumber);

    this.notifyListeners('tableCleared', tableNumber);
    console.log('Table vidée:', tableNumber);
  },

  /**
   * Obtient toutes les tables qui ont des commandes
   * @returns {Array} Liste des numéros de tables
   */
  getActiveTables() {
    return Array.from(this.tableOrders.keys()).sort((a, b) => a - b);
  },

  /**
   * Obtient le nombre total de commandes
   * @returns {number} Nombre de commandes
   */
  getTotalOrdersCount() {
    return this.orders.size;
  },

  /**
   * Obtient les statistiques générales
   * @returns {Object} Statistiques
   */
  getStats() {
    const totalOrders = this.orders.size;
    const activeTables = this.getActiveTables().length;
    const todoCount = Array.from(this.orders.values()).filter(o => o.status === 'todo').length;
    const doneCount = totalOrders - todoCount;

    return {
      totalOrders,
      activeTables,
      todoCount,
      doneCount
    };
  },

  /**
   * Vide complètement l'état (pour debug/reset)
   */
  clear() {
    this.orders.clear();
    this.tableOrders.clear();
    this.notifyListeners('stateCleared', null);
    console.log('État complètement vidé');
  }
}; 