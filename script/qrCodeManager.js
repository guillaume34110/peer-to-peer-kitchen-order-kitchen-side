/**
 * Module de gestion des QR codes
 * Génère des QR codes pour les liens vers les interfaces Salle et Menu
 */
const QRCodeManager = {
  qrCodeContainer: null,
  
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
      // Essayer de récupérer l'IP locale d'abord
      const localIP = await this.getLocalIP();
      if (localIP && localIP !== '127.0.0.1') {
        console.log('IP locale détectée:', localIP);
        return localIP;
      }
      
      // Si pas d'IP locale, utiliser localhost plutôt que l'IP externe
      console.warn('Aucune IP locale détectée, utilisation de localhost');
      return 'localhost';
    } catch (error) {
      console.warn('Impossible de récupérer l\'IP, utilisation de localhost:', error);
      return 'localhost';
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
          resolve(null);
          return;
        }

        const pc = new RTCPeerConnection({
          iceServers: []
        });
        
        pc.createDataChannel('');
        pc.createOffer().then(offer => pc.setLocalDescription(offer));
        
        const candidates = [];
        
        pc.onicecandidate = (ice) => {
          if (!ice || !ice.candidate || !ice.candidate.candidate) {
            // Fin de la collecte des candidats
            const bestIP = this.selectBestLocalIP(candidates);
            resolve(bestIP);
            pc.close();
            return;
          }
          
          const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
          const match = ipRegex.exec(ice.candidate.candidate);
          
          if (match && match[1] && match[1] !== '127.0.0.1') {
            candidates.push(match[1]);
          }
        };
        
        // Timeout après 2 secondes
        setTimeout(() => {
          const bestIP = this.selectBestLocalIP(candidates);
          resolve(bestIP);
          pc.close();
        }, 2000);
        
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
    const machineIP = await this.getMachineIP();
    
    // URLs des interfaces
    const salleURL = `http://${machineIP}:7771`;
    const menuURL = `http://${machineIP}:7772`;
    
    // Créer le contenu HTML
    this.qrCodeContainer.innerHTML = `
      <div class="qr-codes-header">
        <h2>🔗 Liens d'accès</h2>
        <p>Scannez ces QR codes pour accéder aux interfaces depuis un autre appareil</p>
        <button class="btn btn--secondary refresh-btn" onclick="QRCodeManager.refreshQRCodes()">
          🔄 Rafraîchir les QR codes
        </button>
      </div>
      
      <div class="qr-codes-grid">
        <div class="qr-code-item">
          <h3>🍽️ Interface Salle</h3>
          <div class="qr-code-wrapper">
            <div id="qr-salle" class="qr-code"></div>
          </div>
          <p class="qr-url">${salleURL}</p>
          <button class="btn btn--secondary copy-btn" data-url="${salleURL}">
            📋 Copier le lien
          </button>
        </div>
        
        <div class="qr-code-item">
          <h3>📋 Interface Menu</h3>
          <div class="qr-code-wrapper">
            <div id="qr-menu" class="qr-code"></div>
          </div>
          <p class="qr-url">${menuURL}</p>
          <button class="btn btn--secondary copy-btn" data-url="${menuURL}">
            📋 Copier le lien
          </button>
        </div>
      </div>
    `;
    
    // Générer les QR codes avec une bibliothèque simple
    this.generateQRCode('qr-salle', salleURL);
    this.generateQRCode('qr-menu', menuURL);
    
    // Ajouter les événements pour copier les liens
    this.bindCopyEvents();
  },

  /**
   * Génère un QR code simple en utilisant une API en ligne
   */
  generateQRCode(elementId, url) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Utiliser l'API QR Server pour générer le QR code
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    
    element.innerHTML = `
      <img src="${qrCodeURL}" alt="QR Code" style="width: 200px; height: 200px;">
    `;
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