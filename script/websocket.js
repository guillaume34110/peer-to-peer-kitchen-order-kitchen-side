/**
 * Module de gestion WebSocket
 * Gère la connexion WebSocket et la réception des commandes
 */
const WebSocketManager = {
  socket: null,
  reconnectInterval: 3000, // 3 secondes
  maxReconnectAttempts: 10,
  reconnectAttempts: 0,
  isConnecting: false,
  statusDot: null,
  statusText: null,

  /**
   * Initialise la connexion WebSocket
   */
  init() {
    this.initStatusElements();
    this.connect();
    
    console.log('WebSocketManager initialisé');
  },

  /**
   * Initialise les éléments de statut de connexion
   */
  initStatusElements() {
    this.statusDot = document.getElementById('status-dot');
    this.statusText = document.getElementById('status-text');
  },

  /**
   * Établit la connexion WebSocket
   */
  connect() {
    if (this.isConnecting || (this.socket && this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isConnecting = true;
    this.updateConnectionStatus('connecting');

    try {
      // Connexion automatique à ws://${location.hostname}:3000
      const wsUrl = `https://kitchen-ws.loca.lt`;
      console.log('Tentative de connexion WebSocket vers:', wsUrl);
      
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
      
    } catch (error) {
      console.error('Erreur lors de la création de la connexion WebSocket:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  },

  /**
   * Gère l'ouverture de la connexion
   */
  handleOpen() {
    console.log('Connexion WebSocket établie');
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.updateConnectionStatus('connected');
  },

  /**
   * Gère la réception des messages
   * @param {MessageEvent} event - Événement de message
   */
  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      console.log('Message WebSocket reçu:', data);
      
      this.processOrderMessage(data);
      
    } catch (error) {
      console.error('Erreur lors du parsing du message WebSocket:', error);
      console.log('Message brut reçu:', event.data);
    }
  },

  /**
   * Traite un message de commande
   * @param {Object} data - Données de la commande
   */
  processOrderMessage(data) {
    // Validation du message
    if (!this.isValidOrderMessage(data)) {
      console.warn('Message de commande invalide:', data);
      return;
    }

    // Traitement selon l'action
    if (data.action === 'remove') {
      // Suppression d'une commande
      this.handleOrderRemoval(data);
    } else if (data.action === 'getState') {
      // Demande d'état
      this.handleGetState(data);
    } else {
      // Ajout d'une nouvelle commande
      this.handleOrderAddition(data);
    }
  },

  /**
   * Valide la structure d'un message de commande
   * @param {Object} data - Données à valider
   * @returns {boolean} True si valide
   */
  isValidOrderMessage(data) {
    // Vérification de base : timestamp requis pour tous
    if (!data.timestamp) {
      return false;
    }

    // Pour les demandes d'état
    if (data.action === 'getState') {
      return true;
    }

    // Pour les autres messages, table est requis
    if (!data.table) {
      return false;
    }

    // Pour les suppressions avec la nouvelle structure
    if (data.action === 'remove') {
      // Vérifier que l'item est présent et valide
      if (!data.item || !data.item.id || !data.item.price || !data.item.name) {
        return false;
      }
      // Vérifier que name est un objet avec au moins fr ou th
      if (typeof data.item.name !== 'object' || 
          (!data.item.name.fr && !data.item.name.th)) {
        return false;
      }
      return true;
    }

    // Pour les ajouts, vérifier la présence de orderId (ancien format) ou item (nouveau format)
    if (data.orderId || data.item) {
      // Si c'est un ajout, on a besoin de l'item complet
      if (!data.item || !data.item.id || !data.item.price || !data.item.name) {
        return false;
      }

      // Vérifier que name est un objet avec au moins fr ou th
      if (typeof data.item.name !== 'object' || 
          (!data.item.name.fr && !data.item.name.th)) {
        return false;
      }
      return true;
    }

    return false;
  },

  /**
   * Gère l'ajout d'un nouvel article
   */
  handleOrderAddition(data) {
    console.log('Ajout article:', data.item.name, 'Table:', data.table);
    
    // Ajouter l'article au state - l'UI se synchronisera automatiquement
    State.addItem(data);
    
    console.log('✅ Article ajouté au State, synchronisation UI automatique en cours...');
    
    // Renvoyer l'état mis à jour
    this.sendUpdatedState();
  },

  /**
   * Gère la suppression d'un article via WebSocket
   */
  handleOrderRemoval(data) {
    console.log('Suppression article via WebSocket:', data.item.name, 'Table:', data.table);
    
    // Déterminer le nom de l'article dans la langue actuelle
    const currentLang = I18n.getCurrentLanguage();
    const itemName = data.item.name[currentLang] || data.item.name.fr || data.item.name.th;
    
    // Supprimer l'article du state - l'UI se synchronisera automatiquement
    const success = State.removeItemByNameAndTable(itemName, data.table);
    
    if (success) {
      console.log('✅ Article supprimé avec succès via WebSocket, synchronisation UI automatique en cours...');
      
      // Renvoyer l'état mis à jour
      this.sendUpdatedState();
    } else {
      console.warn('❌ Échec de la suppression via WebSocket:', itemName, 'table:', data.table);
    }
  },

  /**
   * Gère la demande d'état via WebSocket
   */
  handleGetState(data) {
    console.log('Demande d\'état reçue, timestamp:', data.timestamp);
    
    // Générer l'état au format demandé
    const stateResponse = this.generateStateResponse();
    
    // Envoyer la réponse
    this.sendState(stateResponse);
  },

  /**
   * Génère la réponse d'état au format demandé
   */
  generateStateResponse() {
    const allItems = State.data.orders || [];
    
    // Grouper les items par table et timestamp pour créer des orderId
    const orderGroups = new Map();
    
    allItems.forEach(item => {
      // Créer un orderId basé sur table + timestamp
      const orderId = `${item.table}_${item.timestamp}`;
      
      if (!orderGroups.has(orderId)) {
        orderGroups.set(orderId, {
          orderId: orderId,
          table: item.table,
          timestamp: item.timestamp,
          items: []
        });
      }
      
      // Ajouter l'item à ce groupe
      orderGroups.get(orderId).items.push({
        id: item.item.id,
        price: item.item.price,
        name: item.item.name,
        status: item.status
      });
    });
    
    // Convertir en array
    const orders = Array.from(orderGroups.values());
    
    console.log(`Génération état: ${orders.length} commandes, ${allItems.length} items au total`);
    
    return {
      orders: orders
    };
  },

  /**
   * Envoie l'état via WebSocket
   */
  sendState(stateData) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Impossible d\'envoyer l\'état: WebSocket non connecté');
      return false;
    }
    
    try {
      const message = JSON.stringify(stateData);
      this.socket.send(message);
      console.log('✅ État envoyé:', stateData);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'état:', error);
      return false;
    }
  },

  /**
   * Génère et envoie l'état mis à jour après une modification
   */
  sendUpdatedState() {
    const stateResponse = this.generateStateResponse();
    this.sendState(stateResponse);
    console.log('🔄 État mis à jour envoyé automatiquement');
  },

  /**
   * Gère la fermeture de la connexion
   * @param {CloseEvent} event - Événement de fermeture
   */
  handleClose(event) {
    console.log('Connexion WebSocket fermée:', event.code, event.reason);
    this.isConnecting = false;
    this.updateConnectionStatus('disconnected');
    
    // Programmer une reconnexion automatique
    this.scheduleReconnect();
  },

  /**
   * Gère les erreurs de connexion
   * @param {Event} event - Événement d'erreur
   */
  handleError(event) {
    console.error('Erreur WebSocket:', event);
    this.isConnecting = false;
    this.updateConnectionStatus('disconnected');
  },

  /**
   * Programme une tentative de reconnexion
   */
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Nombre maximum de tentatives de reconnexion atteint');
      this.updateConnectionStatus('disconnected');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnexion programmée dans ${this.reconnectInterval}ms (tentative ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  },

  /**
   * Met à jour le statut de connexion dans l'UI
   * @param {string} status - Statut ('connecting', 'connected', 'disconnected')
   */
  updateConnectionStatus(status) {
    if (!this.statusDot || !this.statusText) return;

    // Nettoyer les classes existantes
    this.statusDot.className = 'status-dot';
    
    switch (status) {
      case 'connecting':
        this.statusDot.classList.add('connecting');
        this.statusText.textContent = I18n.t('connecting');
        break;
      case 'connected':
        this.statusDot.classList.add('connected');
        this.statusText.textContent = I18n.t('connected');
        break;
      case 'disconnected':
        this.statusDot.classList.add('disconnected');
        this.statusText.textContent = I18n.t('disconnected');
        break;
    }
  },

  /**
   * Ferme manuellement la connexion
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // Empêcher la reconnexion automatique
  },

  /**
   * Reconnecte manuellement
   */
  reconnect() {
    this.disconnect();
    this.reconnectAttempts = 0;
    setTimeout(() => this.connect(), 100);
  },

  /**
   * Obtient le statut actuel de la connexion
   * @returns {string} Statut de connexion
   */
  getConnectionStatus() {
    if (!this.socket) return 'disconnected';
    
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
      default:
        return 'disconnected';
    }
  },

  /**
   * Obtient des statistiques de connexion
   * @returns {Object} Statistiques
   */
  getConnectionStats() {
    return {
      status: this.getConnectionStatus(),
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      isConnecting: this.isConnecting,
      url: this.socket ? this.socket.url : null
    };
  }
}; 