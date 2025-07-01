/**
 * Module de gestion multilingue
 * Gère le chargement des traductions et l'application dynamique des textes
 */
const I18n = {
  currentLanguage: 'fr',
  translations: {},

  /**
   * Initialise le système i18n
   */
  async init() {
    try {
      // Charger les traductions depuis lang.json
      const response = await fetch('./data/lang.json');
      this.translations = await response.json();
      
      // Récupérer la langue sauvegardée ou utiliser la langue par défaut
      const savedLanguage = localStorage.getItem('kitchen-language') || 'fr';
      this.setLanguage(savedLanguage);
      
      console.log('I18n initialisé avec succès');
    } catch (error) {
      console.error('Erreur lors du chargement des traductions:', error);
      // Utiliser des traductions par défaut en cas d'erreur
      this.translations = {
        fr: { error: 'Erreur de chargement' },
        th: { error: 'เกิดข้อผิดพลาด' }
      };
    }
  },

  /**
   * Change la langue active
   * @param {string} language - Code de langue (fr/th)
   */
  setLanguage(language) {
    if (!this.translations[language]) {
      console.warn(`Langue non supportée: ${language}`);
      return;
    }

    this.currentLanguage = language;
    localStorage.setItem('kitchen-language', language);
    
    // Mettre à jour l'attribut lang du document
    document.documentElement.lang = language;
    
    // Appliquer les traductions à tous les éléments avec data-i18n
    this.applyTranslations();
    
    console.log(`Langue changée vers: ${language}`);
  },

  /**
   * Obtient le texte traduit pour une clé donnée
   * @param {string} key - Clé de traduction
   * @returns {string} Texte traduit
   */
  t(key) {
    const translation = this.translations[this.currentLanguage]?.[key];
    if (!translation) {
      console.warn(`Traduction manquante pour la clé: ${key} (langue: ${this.currentLanguage})`);
      return key; // Retourner la clé si pas de traduction
    }
    return translation;
  },

  /**
   * Obtient le nom localisé d'un item
   * @param {Object} item - Item avec propriété name multilingue
   * @returns {string} Nom traduit
   */
  getItemName(item) {
    if (!item.name || typeof item.name !== 'object') {
      return item.name || 'Sans nom';
    }
    
    return item.name[this.currentLanguage] || 
           item.name.fr || 
           item.name.th || 
           'Sans nom';
  },

  /**
   * Applique les traductions à tous les éléments data-i18n
   */
  applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      // Appliquer selon le type d'élément
      if (element.tagName === 'INPUT' && element.type === 'text') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });
  },

  /**
   * Formate un prix avec la devise appropriée
   * @param {number} price - Prix à formater
   * @returns {string} Prix formaté
   */
  formatPrice(price) {
    const currency = this.currentLanguage === 'th' ? '฿' : '€';
    return `${price} ${currency}`;
  },

  /**
   * Obtient la langue actuelle
   * @returns {string} Code de langue actuel
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  },

  /**
   * Vérifie si une langue est supportée
   * @param {string} language - Code de langue à vérifier
   * @returns {boolean} True si supportée
   */
  isLanguageSupported(language) {
    return this.translations.hasOwnProperty(language);
  }
}; 