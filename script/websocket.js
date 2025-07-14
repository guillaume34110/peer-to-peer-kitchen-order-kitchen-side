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
      const wsUrl = `http://guillaume.local:3000`;
      
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
      
      this.processOrderMessage(data);
      
    } catch (error) {
      console.error('Erreur lors du parsing du message WebSocket:', error);
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
    } else if (data.action === 'modify') {
      // Modification d'une commande existante
      this.handleOrderModification(data);
    } else if (data.action === 'getState') {
      // Demande d'état
      this.handleGetState(data);
    } else if (data.action === 'getMenu') {
      // Demande de menu
      this.handleGetMenu(data);
    } else if (data.action === 'getIngredients') {
      // Demande d'ingrédients
      this.handleGetIngredients(data);
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

    // Pour les demandes d'état, menu ou ingrédients
    if (data.action === 'getState' || data.action === 'getMenu' || data.action === 'getIngredients') {
      return true;
    }

    // Pour les modifications, vérifier la structure
    if (data.action === 'modify') {
      // Vérifier que l'item est présent et valide
      if (!data.item || !data.item.id || !data.item.price || !data.item.name) {
        return false;
      }
      // Vérifier que name est un objet avec au moins fr ou th
      if (typeof data.item.name !== 'object' || 
          (!data.item.name.fr && !data.item.name.th)) {
        return false;
      }
      // Vérifier que le timestamp original est présent pour identifier la commande à modifier
      if (!data.originalTimestamp) {
        return false;
      }
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
    // Ajouter l'article au state - l'UI se synchronisera automatiquement
    State.addItem(data);
    
    // Renvoyer l'état mis à jour
    this.sendUpdatedState();
  },

  /**
   * Envoie le menu mis à jour à tous les clients connectés.
   */
  broadcastMenuUpdate() {
    if (!this.wss) {
      console.warn("WebSocket Server (wss) non initialisé. Impossible de diffuser.");
      return;
    }

    console.log('📢 Diffusion de la mise à jour du menu à tous les clients...');
    const menu = MenuManager.getMenuItems();

    // On prépare un message standardisé
    const message = {
      type: 'menuUpdate',
      payload: menu
    };
    const messageString = JSON.stringify(message);

    // Envoyer à chaque client connecté
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  },

  /**
   * Gère la suppression d'un article via WebSocket
   */
  handleOrderRemoval(data) {
    // Déterminer le nom de l'article dans la langue actuelle
    const currentLang = I18n.getCurrentLanguage();
    const itemName = data.item.name[currentLang] || data.item.name.fr || data.item.name.th;
    
    // Supprimer l'article du state - l'UI se synchronisera automatiquement
    const success = State.removeItemByNameAndTable(itemName, data.table);
    
    if (success) {
      // Renvoyer l'état mis à jour
      this.sendUpdatedState();
    } else {
      console.warn('❌ Échec de la suppression via WebSocket:', itemName, 'table:', data.table);
    }
  },

  /**
   * Gère la modification d'un article existant via WebSocket
   */
  handleOrderModification(data) {
    // Modifier l'article dans le state - l'UI se synchronisera automatiquement
    const success = State.modifyItemByTimestamp(data.originalTimestamp, data);
    
    if (success) {
      // Renvoyer l'état mis à jour
      this.sendUpdatedState();
    } else {
      console.warn('❌ Échec de la modification via WebSocket:', data.originalTimestamp);
    }
  },

  /**
   * Gère la demande d'état via WebSocket
   */
  handleGetState(data) {
    // Générer l'état au format demandé
    const stateResponse = this.generateStateResponse();
    
    // Envoyer la réponse
    this.sendState(stateResponse);
  },

  /**
   * Gère la demande de menu via WebSocket
   */
  async handleGetMenu(data) {
    const menuItems = window.MenuManager ? MenuManager.getMenuItems() : (window.menuItems || []);
    
    // Convertir les chemins d'images en Base64
    const processedMenuPromises = menuItems.map(async (item) => {
      if (item.image && !item.image.startsWith('data:image')) {
        try {
          const imageAsBase64 = await this.convertImageToBase64(item.image);
          return { ...item, image: imageAsBase64 };
        } catch (error) {
          console.warn(`Impossible de charger l'image ${item.image}. Le chemin original sera utilisé.`, error);
          return item; // En cas d'erreur, renvoyer l'item tel quel
        }
      }
      return item;
    });

    const processedMenu = await Promise.all(processedMenuPromises);
    
    // Renvoyer le menu avec les images encodées
    this.sendMenu(processedMenu);
  },

  /**
   * Récupère un fichier image local et le convertit en Base64.
   * @param {string} url - Le chemin local vers l'image.
   * @returns {Promise<string>} Une promesse qui se résout avec la data URL en Base64.
   */
  convertImageToBase64(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            console.error(`❌ Erreur HTTP ${response.status}: ${response.statusText} pour ${url}`);
            throw new Error(`Erreur HTTP lors du chargement de l'image: ${response.statusText}`);
          }
          return response.blob();
        })
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = (error) => {
            console.error(`❌ Erreur de lecture du fichier: ${url}`, error);
            reject(error);
          };
          reader.readAsDataURL(blob);
        })
        .catch(error => {
          console.error(`❌ Échec de la conversion de l'image: ${url}`, error);
          reject(error);
        });
    });
  },

  /**
   * Gère la demande d'ingrédients via WebSocket
   */
  handleGetIngredients(data) {
    // Récupérer les ingrédients depuis le IngredientsManager (localStorage)
    const ingredients = window.IngredientsManager ? IngredientsManager.getIngredients() : (window.ingredients || []);
    
    // Renvoyer les ingrédients
    this.sendIngredients(ingredients);
  },

  /**
   * Génère la réponse d'état au format demandé
   */
  generateStateResponse() {
    const allItems = State.data.orders || [];
    
    // Récupérer la configuration de la grille depuis le localStorage
    const gridCols = parseInt(localStorage.getItem('kitchen-grid-cols')) || 3;
    const gridRows = parseInt(localStorage.getItem('kitchen-grid-rows')) || 3;
    const totalTables = gridCols * gridRows;

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
      
      // Trouver la recette originale pour obtenir la liste des ingrédients de base
      const menuItem = window.menuItems.find(mi => mi.id === item.item.id);

      // Ajouter l'item à ce groupe
      orderGroups.get(orderId).items.push({
        id: item.item.id,
        price: item.item.price,
        supplementPrice: item.item.supplementPrice || 0,
        name: item.item.name,
        status: item.status,
        ingredients: menuItem ? menuItem.ingredients : [],
        ingredientsRemoved: item.ingredientsRemoved || [],
        ingredientsAdded: item.ingredientsAdded || [],
        supplements: item.supplements || []
      });
    });
    
    // Convertir en array
    const orders = Array.from(orderGroups.values());
    
    return {
      totalTables: totalTables,
      orders: orders
    };
  },

  /**
   * Envoie l'état via WebSocket
   */
  sendState(stateData) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('❌ Impossible d\'envoyer l\'état: WebSocket non connecté');
      return false;
    }
    
    try {
      const message = JSON.stringify(stateData);
      this.socket.send(message);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'état:', error);
      return false;
    }
  },

  /**
   * Envoie le menu via WebSocket
   */
  sendMenu(menuData) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('❌ Impossible d\'envoyer le menu: WebSocket non connecté');
      return false;
    }
    
    try {
      const menuResponse = {
        menu: menuData
      };
      
      const message = JSON.stringify(menuResponse);
      this.socket.send(message);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du menu:', error);
      return false;
    }
  },

  /**
   * Envoie les ingrédients via WebSocket
   */
  sendIngredients(ingredientsData) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('❌ Impossible d\'envoyer les ingrédients: WebSocket non connecté');
      return false;
    }
    
    try {
      const ingredientsResponse = {
        ingredients: ingredientsData
      };
      const message = JSON.stringify(ingredientsResponse);
      this.socket.send(message);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi des ingrédients:', error);
      return false;
    }
  },

  /**
   * Génère et envoie l'état mis à jour après une modification
   */
  sendUpdatedState() {
    const stateResponse = this.generateStateResponse();
    this.sendState(stateResponse);
  },

  /**
   * Envoie les ingrédients mis à jour après une modification
   */
  sendUpdatedIngredients() {
    const ingredients = window.IngredientsManager ? IngredientsManager.getIngredients() : (window.ingredients || []);
    this.sendIngredients(ingredients);
  },

  /**
   * Envoie une modification de commande via WebSocket
   */
  sendOrderModification(originalTimestamp, modificationData) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Impossible d\'envoyer la modification: WebSocket non connecté');
      return false;
    }
    
    try {
      const message = {
        action: 'modify',
        originalTimestamp: originalTimestamp,
        timestamp: Date.now(),
        ...modificationData
      };
      
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la modification:', error);
      return false;
    }
  },

  /**
   * Gère la fermeture de la connexion
   * @param {CloseEvent} event - Événement de fermeture
   */
  handleClose(event) {
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

// Rendre WebSocketManager accessible globalement
window.WebSocketManager = WebSocketManager; 