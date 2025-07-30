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
    } else if (data.action === 'getQRCodes') {
      // Demande de QR codes
      this.handleGetQRCodes(data);
    } else if (data.type === 'get_server_info') {
      // Demande d'informations serveur
      this.handleGetServerInfo(data);
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
    // Pour les demandes d'état, menu, ingrédients ou QR codes, pas besoin de timestamp
    if (data.action === 'getState' || data.action === 'getMenu' || data.action === 'getIngredients' || data.action === 'getQRCodes') {
      return true;
    }

    // Vérification de base : timestamp requis pour tous les autres messages
    if (!data.timestamp) {
      return false;
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
    
    // Convertir les chemins d'images en Base64 et s'assurer que les codes de référence sont inclus
    const processedMenuPromises = menuItems.map(async (item) => {
      // S'assurer que chaque item a son code de référence
      const itemWithReference = {
        ...item,
        reference: item.reference || null // Garantir que le champ reference est présent
      };
      
      if (item.image && !item.image.startsWith('data:image')) {
        try {
          const imageAsBase64 = await this.convertImageToBase64(item.image);
          return { ...itemWithReference, image: imageAsBase64 };
        } catch (error) {
          console.warn(`Impossible de charger l'image ${item.image}. Le chemin original sera utilisé.`, error);
          return itemWithReference; // En cas d'erreur, renvoyer l'item avec référence
        }
      }
      return itemWithReference;
    });

    const processedMenu = await Promise.all(processedMenuPromises);
    
    // Renvoyer le menu avec les images encodées et les codes de référence
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
  },

  /**
   * Gère la demande de QR codes
   * @param {Object} data - Données de la demande
   */
  async handleGetQRCodes(data) {
    try {
      console.log('Demande de QR codes reçue:', data);
      
      // Utiliser l'IP qui a été trouvée par le QRCodeManager
      let serverIP = null;
      
      // Vérifier si QRCodeManager a une IP détectée
      if (window.QRCodeManager && window.QRCodeManager.lastDetectedIP) {
        serverIP = window.QRCodeManager.lastDetectedIP;
        console.log('Utilisation de l\'IP détectée par QRCodeManager:', serverIP);
      } else {
        // Fallback : récupérer l'IP du serveur
        serverIP = await this.getServerIP();
        console.log('IP récupérée par WebSocket:', serverIP);
      }
      
      if (!serverIP) {
        console.error('Impossible de récupérer l\'IP du serveur');
        this.sendQRCodesError('IP serveur non disponible');
        return;
      }
      
      // Générer les URLs
      const salleURL = `http://${serverIP}:7771`;
      const menuURL = `http://${serverIP}:7772`;
      
      console.log('URLs générées avec IP détectée:', { salleURL, menuURL });
      
      // Générer les QR codes
      const qrCodes = await this.generateQRCodes(salleURL, menuURL);
      
      // Envoyer la réponse
      this.sendQRCodes(qrCodes);
      
    } catch (error) {
      console.error('Erreur lors de la génération des QR codes:', error);
      this.sendQRCodesError('Erreur lors de la génération des QR codes');
    }
  },

  /**
   * Récupère l'IP du serveur
   * @returns {Promise<string>} IP du serveur
   */
  async getServerIP() {
    try {
      // Utiliser l'IP depuis la configuration WebSocket
      const wsUrl = this.socket.url;
      const url = new URL(wsUrl);
      const hostname = url.hostname;
      
      console.log('Hostname WebSocket:', hostname);
      
      // Si c'est une IP locale 192.168.x.x, l'utiliser directement
      if (hostname.startsWith('192.168.')) {
        console.log('IP 192.168.x.x trouvée dans WebSocket:', hostname);
        return hostname;
      }
      
      // Si c'est localhost ou 127.0.0.1, essayer de détecter l'IP locale
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        console.log('Localhost détecté, tentative de détection de l\'IP locale...');
        
        // Essayer de récupérer l'IP locale via WebRTC
        const localIP = await this.getLocalIP();
        if (localIP && localIP.startsWith('192.168.')) {
          console.log('IP locale 192.168.x.x trouvée via WebRTC:', localIP);
          return localIP;
        }
        
        // Si WebRTC échoue, essayer de récupérer depuis l'URL actuelle
        const currentIP = this.getIPFromCurrentURL();
        if (currentIP && currentIP.startsWith('192.168.')) {
          console.log('IP 192.168.x.x trouvée depuis l\'URL actuelle:', currentIP);
          return currentIP;
        }
        
        console.warn('Aucune IP 192.168.x.x trouvée, utilisation d\'une IP par défaut');
        return '192.168.1.100';
      }
      
      // Si c'est un nom de domaine local (comme guillaume.local)
      if (hostname.includes('.local') || hostname.includes('.home') || hostname.includes('.lan')) {
        console.log('Nom de domaine local trouvé:', hostname);
        
        // Essayer de récupérer l'IP locale via WebRTC
        const localIP = await this.getLocalIP();
        if (localIP && localIP.startsWith('192.168.')) {
          console.log('IP locale 192.168.x.x trouvée via WebRTC:', localIP);
          return localIP;
        }
        
        // Si WebRTC échoue, essayer de récupérer depuis l'URL actuelle
        const currentIP = this.getIPFromCurrentURL();
        if (currentIP && currentIP.startsWith('192.168.')) {
          console.log('IP 192.168.x.x trouvée depuis l\'URL actuelle:', currentIP);
          return currentIP;
        }
        
        console.warn('Aucune IP 192.168.x.x trouvée pour le domaine local');
        return '192.168.1.100';
      }
      
      console.warn('Hostname non reconnu:', hostname);
      return hostname;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'IP serveur:', error);
      return null;
    }
  },

  /**
   * Génère les QR codes pour les URLs données
   * @param {string} salleURL - URL de l'interface Salle
   * @param {string} menuURL - URL de l'interface Menu
   * @returns {Promise<Object>} QR codes en Base64
   */
  async generateQRCodes(salleURL, menuURL) {
    try {
      // Générer les QR codes via une API externe
      const salleQR = await this.generateQRCodeDataURL(salleURL);
      const menuQR = await this.generateQRCodeDataURL(menuURL);
      
      return {
        salle: {
          url: salleURL,
          qrCodeDataURL: salleQR
        },
        menu: {
          url: menuURL,
          qrCodeDataURL: menuQR
        }
      };
    } catch (error) {
      console.error('Erreur lors de la génération des QR codes:', error);
      throw error;
    }
  },

  /**
   * Génère un QR code en Base64 pour une URL
   * @param {string} url - URL à encoder
   * @returns {Promise<string>} QR code en Base64
   */
  async generateQRCodeDataURL(url) {
    try {
      const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
      
      // Récupérer l'image
      const response = await fetch(qrCodeURL);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Convertir en Base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
      throw error;
    }
  },

  /**
   * Envoie les QR codes générés
   * @param {Object} qrCodes - QR codes à envoyer
   */
  sendQRCodes(qrCodes) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket non connecté');
      return;
    }
    
    const response = {
      type: 'qr_codes_response',
      action: 'getQRCodes',
      qrCodes: qrCodes,
      timestamp: Date.now()
    };
    
    console.log('Envoi des QR codes:', response);
    this.socket.send(JSON.stringify(response));
  },

  /**
   * Envoie une erreur de QR codes
   * @param {string} error - Message d'erreur
   */
  sendQRCodesError(error) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket non connecté');
      return;
    }
    
    const response = {
      type: 'qr_codes_error',
      action: 'getQRCodes',
      error: error,
      timestamp: Date.now()
    };
    
    console.log('Envoi d\'erreur QR codes:', response);
    this.socket.send(JSON.stringify(response));
  },

  /**
   * Gère la demande d'informations serveur
   * @param {Object} data - Données de la demande
   */
  async handleGetServerInfo(data) {
    try {
      console.log('Demande d\'informations serveur reçue:', data);
      
      // Récupérer l'IP du serveur
      const serverIP = await this.getServerIP();
      if (!serverIP) {
        console.error('Impossible de récupérer l\'IP du serveur');
        this.sendServerInfoError('IP serveur non disponible');
        return;
      }
      
      // Envoyer les informations serveur
      this.sendServerInfo(serverIP);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des informations serveur:', error);
      this.sendServerInfoError('Erreur lors de la récupération des informations serveur');
    }
  },

  /**
   * Envoie les informations serveur
   * @param {string} serverIP - IP du serveur
   */
  sendServerInfo(serverIP) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket non connecté');
      return;
    }
    
    const response = {
      type: 'server_info',
      action: 'getServerInfo',
      ip: serverIP,
      port: 3000,
      wsUrl: `ws://${serverIP}:3000`,
      timestamp: Date.now()
    };
    
    console.log('Envoi des informations serveur:', response);
    this.socket.send(JSON.stringify(response));
  },

  /**
   * Envoie une erreur d'informations serveur
   * @param {string} error - Message d'erreur
   */
  sendServerInfoError(error) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket non connecté');
      return;
    }
    
    const response = {
      type: 'server_info_error',
      action: 'getServerInfo',
      error: error,
      timestamp: Date.now()
    };
    
    console.log('Envoi d\'erreur informations serveur:', response);
    this.socket.send(JSON.stringify(response));
  },

  /**
   * Récupère l'IP depuis l'URL actuelle
   * @returns {string|null} IP ou null
   */
  getIPFromCurrentURL() {
    try {
      const hostname = window.location.hostname;
      console.log('Hostname actuel:', hostname);
      
      // Vérifier si c'est une IP locale
      if (hostname.startsWith('192.168.')) {
        console.log('IP 192.168.x.x trouvée dans l\'URL actuelle:', hostname);
        return hostname;
      }
      
      return null;
    } catch (error) {
      console.warn('Erreur lors de la récupération de l\'IP depuis l\'URL actuelle:', error);
      return null;
    }
  },

  /**
   * Tente de récupérer l'IP locale via WebRTC
   * @returns {Promise<string|null>} IP locale ou null
   */
  async getLocalIP() {
    return new Promise((resolve) => {
      try {
        const RTCPeerConnection = window.RTCPeerConnection || 
                                 window.webkitRTCPeerConnection || 
                                 window.mozRTCPeerConnection;
        
        if (!RTCPeerConnection) {
          console.log('WebRTC non supporté');
          resolve(null);
          return;
        }

        const pc = new RTCPeerConnection({
          iceServers: []
        });
        
        pc.createDataChannel('');
        pc.createOffer()
          .then(offer => pc.setLocalDescription(offer))
          .catch(error => {
            console.warn('Erreur lors de la création de l\'offre WebRTC:', error);
            resolve(null);
          });
        
        const candidates = [];
        
        pc.onicecandidate = (ice) => {
          if (!ice || !ice.candidate || !ice.candidate.candidate) {
            // Fin de la collecte des candidats
            const bestIP = this.selectBestLocalIP(candidates);
            console.log('Candidats WebRTC finaux:', candidates, 'IP sélectionnée:', bestIP);
            resolve(bestIP);
            pc.close();
            return;
          }
          
          const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
          const match = ipRegex.exec(ice.candidate.candidate);
          
          if (match && match[1] && match[1] !== '127.0.0.1') {
            candidates.push(match[1]);
            console.log('Candidat IP WebRTC trouvé:', match[1]);
          }
        };
        
        // Timeout après 3 secondes
        setTimeout(() => {
          const bestIP = this.selectBestLocalIP(candidates);
          console.log('Timeout WebRTC - Candidats:', candidates, 'IP sélectionnée:', bestIP);
          resolve(bestIP);
          pc.close();
        }, 3000);
        
      } catch (error) {
        console.warn('Erreur lors de la récupération de l\'IP locale WebRTC:', error);
        resolve(null);
      }
    });
  },

  /**
   * Sélectionne la meilleure IP locale parmi les candidats
   * @param {Array<string>} candidates - Liste des candidats IP
   * @returns {string|null} Meilleure IP ou null
   */
  selectBestLocalIP(candidates) {
    if (candidates.length === 0) {
      return null;
    }
    
    // Priorité 1: IPs qui commencent par 192.168. (réseau local)
    const local192 = candidates.find(ip => ip.startsWith('192.168.'));
    if (local192) {
      console.log('IP 192.168.x.x sélectionnée:', local192);
      return local192;
    }
    
    // Priorité 2: IPs qui commencent par 10. (réseau local)
    const local10 = candidates.find(ip => ip.startsWith('10.'));
    if (local10) {
      console.log('IP 10.x sélectionnée:', local10);
      return local10;
    }
    
    // Priorité 3: IPs qui commencent par 172.16-31 (réseau local)
    const local172 = candidates.find(ip => {
      const parts = ip.split('.');
      return parts[0] === '172' && parseInt(parts[1]) >= 16 && parseInt(parts[1]) <= 31;
    });
    if (local172) {
      console.log('IP 172.x sélectionnée:', local172);
      return local172;
    }
    
    // Priorité 4: Première IP locale trouvée (pas publique)
    const localIP = candidates.find(ip => {
      // Exclure les IPs publiques communes
      return !ip.startsWith('184.') && 
             !ip.startsWith('8.8.') && 
             !ip.startsWith('1.1.') &&
             !ip.startsWith('208.') &&
             !ip.startsWith('216.');
    });
    
    if (localIP) {
      console.log('IP locale sélectionnée:', localIP);
      return localIP;
    }
    
    // Si aucune IP locale appropriée, retourner la première
    console.log('Aucune IP locale appropriée trouvée, utilisation de la première:', candidates[0]);
    return candidates[0];
  }
};

// Rendre WebSocketManager accessible globalement
window.WebSocketManager = WebSocketManager; 