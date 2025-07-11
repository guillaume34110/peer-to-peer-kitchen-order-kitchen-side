/**
 * Module de gestion des statistiques - Historique des commandes par jour
 */
const StatsManager = {
  STORAGE_KEY: 'kitchen-stats-history',

  /**
   * Initialise le gestionnaire de statistiques
   */
  init() {
    console.log('StatsManager initialisé');
  },

  /**
   * Obtient la date du jour au format YYYY-MM-DD
   * @returns {string} Date formatée
   */
  getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  },

  /**
   * Charge l'historique depuis localStorage
   * @returns {Object} Historique des statistiques
   */
  loadHistory() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Erreur chargement historique stats:', error);
      return {};
    }
  },

  /**
   * Sauvegarde l'historique dans localStorage
   * @param {Object} history - Historique à sauvegarder
   */
  saveHistory(history) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
      console.log('Historique stats sauvegardé');
    } catch (error) {
      console.error('Erreur sauvegarde historique stats:', error);
    }
  },

  /**
   * Archive une commande terminée dans l'historique
   * @param {Object} order - Commande à archiver
   */
  archiveCompletedOrder(order) {
    const today = this.getTodayDate();
    const history = this.loadHistory();

    if (!history[today]) {
      history[today] = {
        orders: [],
        totalRevenue: 0,
        orderCount: 0
      };
    }

    // Ajouter la commande à l'historique du jour
    const archivedOrder = {
      table: order.table,
      timestamp: order.timestamp,
      validatedAt: order.validatedAt || Date.now(), // Utiliser le timestamp de validation
      peopleCount: order.peopleCount || 0, // Nombre de personnes à cette table
      item: order.item,
      ingredientsRemoved: order.ingredientsRemoved || [],
      ingredientsAdded: order.ingredientsAdded || [],
      supplements: order.supplements || []
    };

    // Calculer le prix total incluant les suppléments
    const basePrice = order.item.price || 0;
    const ingredientsAdded = order.ingredientsAdded || [];
    const supplementPrice = order.item.supplementPrice || 0;
    const totalSupplementCost = ingredientsAdded.length * supplementPrice;
    const totalPrice = basePrice + totalSupplementCost;

    history[today].orders.push(archivedOrder);
    history[today].totalRevenue += totalPrice;
    history[today].orderCount += 1;

    this.saveHistory(history);
    console.log('Commande archivée:', order.item.name, 'pour', totalPrice, '฿');
  },

  /**
   * Archive une table complète terminée (méthode dépréciée, utilisée pour compatibilité)
   * @param {number} tableNumber - Numéro de la table
   * @param {Array} tableOrders - Commandes de la table
   */
  archiveCompletedTable(tableNumber, tableOrders) {
    console.log(`Archivage table ${tableNumber} avec ${tableOrders.length} commandes`);
    
    tableOrders.forEach(order => {
      this.archiveCompletedOrder(order);
    });
  },

  /**
   * Obtient les statistiques du jour
   * @param {string} date - Date au format YYYY-MM-DD (défaut: aujourd'hui)
   * @returns {Object} Statistiques du jour
   */
  getDailyStats(date = null) {
    const targetDate = date || this.getTodayDate();
    const history = this.loadHistory();
    const dayData = history[targetDate];

    if (!dayData || !dayData.orders.length) {
      return {
        date: targetDate,
        totalRevenue: 0,
        orderCount: 0,
        totalTables: 0,
        averageTicket: 0,
        totalCovers: 0,
        ordersByTable: {},
        dishCount: {},
        orders: [],
        chronologicalOrders: []
      };
    }

    // Grouper par table
    const ordersByTable = {};
    dayData.orders.forEach(order => {
      if (!ordersByTable[order.table]) {
        ordersByTable[order.table] = {
          orders: [],
          total: 0,
          count: 0
        };
      }
      const supplementPrice = order.item?.supplementPrice || 0;
      const ingredientsAdded = order.ingredientsAdded || [];
      const totalSupplementPrice = ingredientsAdded.length * supplementPrice;

      ordersByTable[order.table].orders.push(order);
      ordersByTable[order.table].total += (order.item.price || 0) + totalSupplementPrice;
      ordersByTable[order.table].count += 1;
    });

    // Compter les plats
    const dishCount = {};
    dayData.orders.forEach(order => {
      const dishName = typeof I18n !== 'undefined' ? I18n.getItemName(order.item) : (order.item.name?.fr || order.item.name || 'Sans nom');
      dishCount[dishName] = (dishCount[dishName] || 0) + 1;
    });

    // Compter les tables uniques
    const totalTables = Object.keys(ordersByTable).length;

    // Calculer les nouvelles métriques
    const averageTicket = totalTables > 0 ? dayData.totalRevenue / totalTables : 0;
    
    // Calculer le nombre total de couverts (personnes) en évitant les doublons par table
    const tablePeopleMap = {};
    dayData.orders.forEach(order => {
      tablePeopleMap[order.table] = order.peopleCount || 0;
    });
    const totalCovers = Object.values(tablePeopleMap).reduce((sum, count) => sum + count, 0);

    // Créer la liste chronologique des commandes
    const locale = typeof I18n !== 'undefined' && I18n.currentLang === 'th' ? 'th-TH' : 'fr-FR';
    const chronologicalOrders = dayData.orders
      .sort((a, b) => a.validatedAt - b.validatedAt)
      .map(order => ({
        ...order,
        validatedTime: new Date(order.validatedAt).toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit'
        })
      }));

    return {
      date: targetDate,
      totalRevenue: dayData.totalRevenue,
      orderCount: dayData.orderCount,
      totalTables,
      averageTicket,
      totalCovers,
      ordersByTable,
      dishCount,
      orders: dayData.orders,
      chronologicalOrders
    };
  },

  /**
   * Efface toutes les statistiques
   */
  clearAllStats() {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('Toutes les statistiques effacées');
  },

  /**
   * Obtient la liste des dates ayant des statistiques
   * @returns {Array} Liste des dates triées
   */
  getAvailableDates() {
    const history = this.loadHistory();
    return Object.keys(history).sort().reverse(); // Plus récent en premier
  },

  /**
   * Debug: affiche l'historique complet
   */
  debug() {
    const history = this.loadHistory();
    console.log('=== STATS HISTORY ===');
    console.log('Dates disponibles:', Object.keys(history));
    Object.entries(history).forEach(([date, data]) => {
      console.log(`${date}: ${data.orderCount} commandes, ${data.totalRevenue}฿`);
    });
    console.log('====================');
  }
};

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StatsManager;
} 