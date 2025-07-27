/**
 * Module de gestion des QR codes
 * Génère des QR codes pour les liens vers les interfaces Salle et Menu
 */
const QRCodeManager = {
  qrCodeContainer: null,
  lastDetectedIP: null,
  
  /**
   * Initialise le gestionnaire de QR codes
   */
  init() {
    this.createQRCodeContainer();
    this.generateQRCodes();
    console.log('QRCodeManager initialisé');
  },

  /**
   * Crée le conteneur pour les QR codes
   */
  createQRCodeContainer() {
    // Créer le conteneur principal
    this.qrCodeContainer = document.createElement('div');
    this.qrCodeContainer.id = 'qr-codes-container';
    this.qrCodeContainer.className = 'qr-codes-container';
    this.qrCodeContainer.style.display = 'none';
    
    // Ajouter le conteneur au body
    document.body.appendChild(this.qrCodeContainer);
  },

  /**
   * Récupère l'IP de la machine
   */
  async getMachineIP() {
    try {
      // Méthode 1: Récupérer l'IP depuis la configuration WebSocket
      const wsIP = await this.getIPFromWebSocket();
      if (wsIP && wsIP.startsWith('192.168.')) {
        console.log('IP 192.168.x.x détectée depuis WebSocket:', wsIP);
        this.lastDetectedIP = wsIP; // Stocker l'IP détectée
        return wsIP;
      }
      
      // Méthode 2: Essayer de récupérer l'IP depuis l'URL actuelle
      const currentIP = this.getIPFromCurrentURL();
      if (currentIP && currentIP.startsWith('192.168.')) {
        console.log('IP 192.168.x.x détectée depuis l\'URL actuelle:', currentIP);
        this.lastDetectedIP = currentIP; // Stocker l'IP détectée
        return currentIP;
      }
      
      // Méthode 3: Si on est sur localhost, essayer de détecter l'IP réelle
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Accès via localhost, tentative de détection de l\'IP réelle...');
        
        // Essayer de récupérer l'IP locale via WebRTC
        const localIP = await this.getLocalIP();
        console.log('Résultat getLocalIP:', localIP);
        
        if (localIP && localIP.startsWith('192.168.')) {
          console.log('IP 192.168.x.x détectée via WebRTC:', localIP);
          this.lastDetectedIP = localIP; // Stocker l'IP détectée
          return localIP;
        }
      }
      
      // Aucune IP 192.168.x.x trouvée
      console.warn('Aucune IP 192.168.x.x détectée');
      this.lastDetectedIP = null;
      return null;
    } catch (error) {
      console.warn('Erreur lors de la récupération de l\'IP:', error);
      this.lastDetectedIP = null;
      return null;
    }
  },

  /**
   * Récupère l'IP depuis l'URL actuelle
   */
  getIPFromCurrentURL() {
    try {
      const hostname = window.location.hostname;
      console.log('Hostname actuel:', hostname);
      
      // Si c'est localhost, essayer de détecter l'IP réelle
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        console.log('Accès via localhost, impossible de détecter l\'IP locale');
        return null;
      }
      
      // Vérifier si c'est une IP locale
      const ipRegex = /^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./;
      if (ipRegex.test(hostname)) {
        console.log('IP locale détectée depuis l\'URL:', hostname);
        return hostname;
      }
      
      // Si c'est un nom de domaine local (comme guillaume.local)
      if (hostname.includes('.local') || hostname.includes('.home') || hostname.includes('.lan')) {
        console.log('Nom de domaine local détecté:', hostname);
        // On ne peut pas extraire l'IP depuis un nom de domaine
        return null;
      }
      
      console.log('Hostname non reconnu comme IP locale:', hostname);
      return null;
    } catch (error) {
      console.warn('Erreur lors de la récupération de l\'IP depuis l\'URL:', error);
      return null;
    }
  },

  /**
   * Récupère l'IP depuis le serveur WebSocket
   */
  async getIPFromWebSocket() {
    try {
      // Vérifier si WebSocketManager est disponible et connecté
      if (window.WebSocketManager && window.WebSocketManager.socket && window.WebSocketManager.socket.readyState === WebSocket.OPEN) {
        console.log('Demande d\'informations serveur via WebSocket...');
        
        // Demander l'IP au serveur
        const request = { 
          type: "get_server_info",
          action: "getServerInfo",
          timestamp: Date.now()
        };
        window.WebSocketManager.socket.send(JSON.stringify(request));
        
        // Attendre la réponse du serveur
        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            console.warn('Timeout lors de la récupération de l\'IP serveur');
            // Restaurer le gestionnaire original en cas de timeout
            if (window.WebSocketManager && window.WebSocketManager.socket) {
              window.WebSocketManager.socket.onmessage = originalOnMessage;
            }
            resolve(null);
          }, 5000); // 5 secondes de timeout
          
          // Écouter la réponse
          const originalOnMessage = window.WebSocketManager.socket.onmessage;
          
          window.WebSocketManager.socket.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              
              if (data.type === 'server_info') {
                console.log('Informations serveur reçues:', data);
                clearTimeout(timeout);
                
                // Restaurer le gestionnaire original
                if (window.WebSocketManager && window.WebSocketManager.socket) {
                  window.WebSocketManager.socket.onmessage = originalOnMessage;
                }
                
                // Vérifier que l'IP est au format 192.168.x.x
                if (data.ip && data.ip.startsWith('192.168.')) {
                  console.log('IP serveur 192.168.x.x trouvée:', data.ip);
                  resolve(data.ip);
                } else {
                  console.warn('IP serveur ne commence pas par 192.168.x.x:', data.ip);
                  resolve(null);
                }
              } else {
                // Si ce n'est pas la réponse attendue, laisser le gestionnaire original traiter
                if (originalOnMessage) {
                  originalOnMessage(event);
                }
              }
            } catch (error) {
              console.warn('Erreur lors du parsing de la réponse serveur:', error);
              // Restaurer le gestionnaire original en cas d'erreur
              if (window.WebSocketManager && window.WebSocketManager.socket) {
                window.WebSocketManager.socket.onmessage = originalOnMessage;
              }
            }
          };
        });
      } else {
        console.warn('WebSocket non disponible ou non connecté');
        return null;
      }
    } catch (error) {
      console.warn('Erreur lors de la récupération de l\'IP depuis WebSocket:', error);
      return null;
    }
  },

  /**
   * Demande les QR codes via WebSocket
   */
  async requestQRCodesViaWebSocket() {
    try {
      // Vérifier si WebSocketManager est disponible et connecté
      if (window.WebSocketManager && window.WebSocketManager.socket && window.WebSocketManager.socket.readyState === WebSocket.OPEN) {
        console.log('Demande de QR codes via WebSocket...');
        
        // Demander les QR codes au serveur
        const request = { 
          type: "get_qr_codes",
          action: "getQRCodes",
          timestamp: Date.now()
        };
        window.WebSocketManager.socket.send(JSON.stringify(request));
        
        // Attendre la réponse du serveur
        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            console.warn('Timeout lors de la récupération des QR codes');
            // Restaurer le gestionnaire original en cas de timeout
            if (window.WebSocketManager && window.WebSocketManager.socket) {
              window.WebSocketManager.socket.onmessage = originalOnMessage;
            }
            resolve(null);
          }, 10000); // 10 secondes de timeout pour la génération des QR codes
          
          // Écouter la réponse
          const originalOnMessage = window.WebSocketManager.socket.onmessage;
          
          window.WebSocketManager.socket.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              
              if (data.type === 'qr_codes_response') {
                console.log('QR codes reçus:', data);
                clearTimeout(timeout);
                
                // Restaurer le gestionnaire original
                if (window.WebSocketManager && window.WebSocketManager.socket) {
                  window.WebSocketManager.socket.onmessage = originalOnMessage;
                }
                
                resolve(data.qrCodes);
              } else if (data.type === 'qr_codes_error') {
                console.error('Erreur QR codes:', data.error);
                clearTimeout(timeout);
                
                // Restaurer le gestionnaire original
                if (window.WebSocketManager && window.WebSocketManager.socket) {
                  window.WebSocketManager.socket.onmessage = originalOnMessage;
                }
                
                resolve(null);
              } else {
                // Si ce n'est pas la réponse attendue, laisser le gestionnaire original traiter
                if (originalOnMessage) {
                  originalOnMessage(event);
                }
              }
            } catch (error) {
              console.warn('Erreur lors du parsing de la réponse QR codes:', error);
              // Restaurer le gestionnaire original en cas d'erreur
              if (window.WebSocketManager && window.WebSocketManager.socket) {
                window.WebSocketManager.socket.onmessage = originalOnMessage;
              }
            }
          };
        });
      } else {
        console.warn('WebSocket non disponible ou non connecté');
        return null;
      }
    } catch (error) {
      console.warn('Erreur lors de la demande de QR codes via WebSocket:', error);
      return null;
    }
  },







  /**
   * Tente de récupérer l'IP locale via WebRTC
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
            console.log('Candidats finaux:', candidates, 'IP sélectionnée:', bestIP);
            resolve(bestIP);
            pc.close();
            return;
          }
          
          const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
          const match = ipRegex.exec(ice.candidate.candidate);
          
          if (match && match[1] && match[1] !== '127.0.0.1') {
            candidates.push(match[1]);
            console.log('Candidat IP trouvé:', match[1]);
          }
        };
        
        // Timeout après 3 secondes pour laisser plus de temps
        setTimeout(() => {
          const bestIP = this.selectBestLocalIP(candidates);
          console.log('Timeout - Candidats:', candidates, 'IP sélectionnée:', bestIP);
          resolve(bestIP);
          pc.close();
        }, 3000);
        
      } catch (error) {
        console.warn('Erreur lors de la récupération de l\'IP locale:', error);
        resolve(null);
      }
    });
  },

  /**
   * Sélectionne la meilleure IP locale parmi les candidats
   */
  selectBestLocalIP(candidates) {
    if (candidates.length === 0) {
      return null;
    }
    
    console.log('Candidats IP détectés:', candidates);
    
    // Priorité 1: IPs qui commencent par 192.168 (réseau local typique)
    const local192 = candidates.find(ip => ip.startsWith('192.168.'));
    if (local192) {
      console.log('IP 192.168 sélectionnée:', local192);
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
  },

  /**
   * Génère les QR codes pour les interfaces
   */
  async generateQRCodes() {
    console.log('Génération des QR codes...');
    
    // Essayer d'abord de récupérer les QR codes via WebSocket
    console.log('Tentative de récupération des QR codes via WebSocket...');
    const qrCodes = await this.requestQRCodesViaWebSocket();
    
    if (qrCodes) {
      console.log('QR codes reçus via WebSocket, affichage...');
      this.displayQRCodesFromWebSocket(qrCodes);
      return;
    }
    
    // Fallback : génération locale
    console.log('Fallback vers la génération locale des QR codes...');
    
    // Récupérer l'IP de la machine
    const machineIP = await this.getMachineIP();
    console.log('IP de la machine:', machineIP);
    
    if (!machineIP) {
      console.error('Aucune IP 192.168.x.x détectée');
      this.qrCodeContainer.innerHTML = `
        <div class="qr-codes-header">
          <h2>🔗 QR Codes</h2>
          <p>❌ Erreur : Aucune IP locale (192.168.x.x) détectée</p>
          <p>Vérifiez que vous êtes connecté au réseau local</p>
          <button class="btn btn--secondary refresh-btn" onclick="QRCodeManager.refreshQRCodes()">
            🔄 Réessayer
          </button>
        </div>
      `;
      return;
    }
    
    // Créer le contenu HTML avec champ de saisie IP
    this.qrCodeContainer.innerHTML = `
      <div class="qr-codes-header">
        <h2>🔗 QR Codes</h2>
        <p>Scannez ces QR codes pour accéder aux interfaces depuis un autre appareil</p>
        
        <div class="ip-controls">
          <label for="ip-input">IP de la machine :</label>
          <input 
            type="text" 
            id="ip-input" 
            class="ip-input" 
            placeholder="192.168.x.x" 
            value="${machineIP || ''}"
          >
          <button class="btn btn--primary" onclick="QRCodeManager.updateQRCodes()">
            ✅ Mettre à jour
          </button>
        </div>
        
        <button class="btn btn--secondary refresh-btn" onclick="QRCodeManager.refreshQRCodes()">
          🔄 Détecter automatiquement
        </button>
      </div>
    `;
    
    // Si une IP a été détectée, générer les QR codes
    if (machineIP) {
      this.generateQRCodesWithIP(machineIP);
    } else {
      // Afficher un message d'aide
      this.qrCodeContainer.innerHTML += `
        <div class="qr-codes-grid">
          <div class="qr-code-item">
            <h3>❓ IP non détectée</h3>
            <p>Entrez votre IP locale (192.168.x.x) dans le champ ci-dessus</p>
            <p>Exemple : 192.168.1.100</p>
          </div>
        </div>
      `;
    }
    
    // Ajouter les événements pour le champ IP
    this.bindIPInputEvents();
  },

  /**
   * Affiche les QR codes reçus via WebSocket
   * @param {Object} qrCodes - QR codes reçus du serveur
   */
  displayQRCodesFromWebSocket(qrCodes) {
    console.log('Affichage des QR codes reçus via WebSocket:', qrCodes);
    
    // Créer le contenu HTML
    this.qrCodeContainer.innerHTML = `
      <div class="qr-codes-header">
        <h2>🔗 QR Codes</h2>
        <p>Scannez ces QR codes pour accéder aux interfaces depuis un autre appareil</p>
        <p class="ip-info">QR codes générés par le serveur</p>
        <button class="btn btn--secondary refresh-btn" onclick="QRCodeManager.refreshQRCodes()">
          🔄 Régénérer via WebSocket
        </button>
      </div>
      
      <div class="qr-codes-grid">
        <div class="qr-code-item">
          <h3>🍽️ Interface Salle</h3>
          <div class="qr-code-wrapper">
            <div id="qr-salle" class="qr-code">
              ${qrCodes.salle ? `<img src="${qrCodes.salle.qrCodeDataURL}" alt="QR Code Salle" style="width: 200px; height: 200px;">` : '<div class="loading">❌ QR code non disponible</div>'}
            </div>
          </div>
          <p class="qr-url">${qrCodes.salle ? qrCodes.salle.url : 'URL non disponible'}</p>
          <button class="btn btn--secondary copy-btn" data-url="${qrCodes.salle ? qrCodes.salle.url : ''}">
            📋 Copier le lien
          </button>
        </div>
        
        <div class="qr-code-item">
          <h3>📋 Interface Menu</h3>
          <div class="qr-code-wrapper">
            <div id="qr-menu" class="qr-code">
              ${qrCodes.menu ? `<img src="${qrCodes.menu.qrCodeDataURL}" alt="QR Code Menu" style="width: 200px; height: 200px;">` : '<div class="loading">❌ QR code non disponible</div>'}
            </div>
          </div>
          <p class="qr-url">${qrCodes.menu ? qrCodes.menu.url : 'URL non disponible'}</p>
          <button class="btn btn--secondary copy-btn" data-url="${qrCodes.menu ? qrCodes.menu.url : ''}">
            📋 Copier le lien
          </button>
        </div>
      </div>
    `;
    
    // Ajouter les événements pour copier les liens
    this.bindCopyEvents();
  },

  /**
   * Génère les QR codes avec une IP spécifique
   */
  generateQRCodesWithIP(machineIP) {
    // URLs des interfaces
    const salleURL = `http://${machineIP}:7771`;
    const menuURL = `http://${machineIP}:7772`;
    
    console.log('URLs générées:', { salleURL, menuURL });
    
    // Ajouter le contenu des QR codes
    this.qrCodeContainer.innerHTML += `
      <div class="qr-codes-grid">
        <div class="qr-code-item">
          <h3>🍽️ Interface Salle</h3>
          <div class="qr-code-wrapper">
            <div id="qr-salle" class="qr-code">
              <div class="loading">⏳ Génération du QR code...</div>
            </div>
          </div>
          <p class="qr-url">${salleURL}</p>
          <button class="btn btn--secondary copy-btn" data-url="${salleURL}">
            📋 Copier le lien
          </button>
        </div>
        
        <div class="qr-code-item">
          <h3>📋 Interface Menu</h3>
          <div class="qr-code-wrapper">
            <div id="qr-menu" class="qr-code">
              <div class="loading">⏳ Génération du QR code...</div>
            </div>
          </div>
          <p class="qr-url">${menuURL}</p>
          <button class="btn btn--secondary copy-btn" data-url="${menuURL}">
            📋 Copier le lien
          </button>
        </div>
      </div>
    `;
    
    // Générer les QR codes directement avec une API simple
    this.generateSimpleQRCode('qr-salle', salleURL);
    this.generateSimpleQRCode('qr-menu', menuURL);
    
    // Ajouter les événements pour copier les liens
    this.bindCopyEvents();
  },

  /**
   * Met à jour les QR codes avec l'IP saisie
   */
  updateQRCodes() {
    const ipInput = document.getElementById('ip-input');
    if (!ipInput) {
      console.error('Champ IP non trouvé');
      return;
    }
    
    const machineIP = ipInput.value.trim();
    if (!machineIP) {
      alert('Veuillez entrer une IP valide');
      return;
    }
    
    // Validation basique de l'IP
    const ipRegex = /^192\.168\.\d{1,3}\.\d{1,3}$/;
    if (!ipRegex.test(machineIP)) {
      alert('Veuillez entrer une IP valide au format 192.168.x.x');
      return;
    }
    
    console.log('Mise à jour des QR codes avec IP:', machineIP);
    
    // Stocker l'IP saisie manuellement
    this.lastDetectedIP = machineIP;
    
    // Supprimer l'ancien contenu des QR codes
    const oldGrid = this.qrCodeContainer.querySelector('.qr-codes-grid');
    if (oldGrid) {
      oldGrid.remove();
    }
    
    // Générer les nouveaux QR codes
    this.generateQRCodesWithIP(machineIP);
  },

  /**
   * Ajoute les événements pour le champ IP
   */
  bindIPInputEvents() {
    const ipInput = document.getElementById('ip-input');
    if (!ipInput) {
      return;
    }
    
    // Permettre la validation avec Entrée
    ipInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.updateQRCodes();
      }
    });
  },

  /**
   * Génère un QR code simple avec une API directe
   */
  generateSimpleQRCode(elementId, url) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Élément non trouvé:', elementId);
      return;
    }
    
    console.log(`Génération QR code simple pour ${elementId}:`, url);
    
    // Utiliser l'API QR Server avec des paramètres simples
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    
    // Créer l'image
    const img = new Image();
    img.style.width = '200px';
    img.style.height = '200px';
    img.alt = `QR Code ${elementId}`;
    
    img.onload = () => {
      console.log(`QR code ${elementId} chargé avec succès`);
    };
    
    img.onerror = () => {
      console.error(`Erreur lors du chargement du QR code ${elementId}`);
      // Fallback simple : afficher l'URL
      element.innerHTML = `
        <div style="width: 200px; height: 200px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; background: #f9f9f9;">
          <div style="text-align: center; color: #666;">
            <div>🔗</div>
            <div style="font-size: 12px;">Lien direct</div>
            <div style="font-size: 10px; word-break: break-all; padding: 5px;">${url}</div>
          </div>
        </div>
      `;
    };
    
    // Charger l'image
    img.src = qrCodeURL;
    element.innerHTML = '';
    element.appendChild(img);
  },



  /**
   * Ajoute les événements pour copier les liens
   */
  bindCopyEvents() {
    const copyButtons = this.qrCodeContainer.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const url = button.getAttribute('data-url');
        
        try {
          await navigator.clipboard.writeText(url);
          
          // Feedback visuel
          const originalText = button.textContent;
          button.textContent = '✅ Copié !';
          button.style.backgroundColor = '#4CAF50';
          
          setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
          }, 2000);
          
        } catch (error) {
          console.error('Erreur lors de la copie:', error);
          
          // Fallback pour les navigateurs qui ne supportent pas clipboard API
          const textArea = document.createElement('textarea');
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          
          // Feedback visuel
          const originalText = button.textContent;
          button.textContent = '✅ Copié !';
          button.style.backgroundColor = '#4CAF50';
          
          setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
          }, 2000);
        }
      });
    });
  },

  /**
   * Affiche la vue des QR codes
   */
  showQRCodeView() {
    if (this.qrCodeContainer) {
      this.qrCodeContainer.style.display = 'block';
    }
  },

  /**
   * Cache la vue des QR codes
   */
  hideQRCodeView() {
    if (this.qrCodeContainer) {
      this.qrCodeContainer.style.display = 'none';
    }
  },



  /**
   * Rafraîchit les QR codes (utile si l'IP change)
   */
  async refreshQRCodes() {
    // Feedback visuel
    const refreshBtn = this.qrCodeContainer.querySelector('.refresh-btn');
    if (refreshBtn) {
      const originalText = refreshBtn.textContent;
      refreshBtn.textContent = '⏳ Actualisation...';
      refreshBtn.disabled = true;
      
      try {
        await this.generateQRCodes();
        refreshBtn.textContent = '✅ Actualisé !';
        setTimeout(() => {
          refreshBtn.textContent = originalText;
          refreshBtn.disabled = false;
        }, 2000);
      } catch (error) {
        console.error('Erreur lors du rafraîchissement des QR codes:', error);
        refreshBtn.textContent = '❌ Erreur';
        setTimeout(() => {
          refreshBtn.textContent = originalText;
          refreshBtn.disabled = false;
        }, 2000);
      }
    }
  }
};

// Rendre QRCodeManager accessible globalement
window.QRCodeManager = QRCodeManager; 