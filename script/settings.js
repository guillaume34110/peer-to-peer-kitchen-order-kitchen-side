/**
 * Module de gestion des paramètres
 * Gère les paramètres utilisateur (langue, grille) et la modal de configuration
 */
const Settings = {
  modal: null,
  settingsBtn: null,
  closeBtn: null,
  languageSelect: null,
  gridColsInput: null,
  gridRowsInput: null,

  /**
   * Initialise le module des paramètres
   */
  async init() {
    this.initElements();
    this.initEventListeners();
    this.loadSettings();
    
    console.log('Settings initialisé');
  },

  /**
   * Initialise les références aux éléments DOM
   */
  initElements() {
    this.modal = document.getElementById('settings-modal');
    this.settingsBtn = document.getElementById('settings-btn');
    this.closeBtn = document.getElementById('settings-close');
    this.languageSelect = document.getElementById('language-select');
    this.gridColsInput = document.getElementById('grid-cols');
    this.gridRowsInput = document.getElementById('grid-rows');
  },

  /**
   * Initialise les écouteurs d'événements
   */
  initEventListeners() {
    if (this.settingsBtn) {
      this.settingsBtn.addEventListener('click', () => this.openModal());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }

    if (this.languageSelect) {
      this.languageSelect.addEventListener('change', (e) => {
        this.changeLanguage(e.target.value);
      });
    }

    if (this.gridColsInput) {
      this.gridColsInput.addEventListener('change', () => this.updateGrid());
    }

    if (this.gridRowsInput) {
      this.gridRowsInput.addEventListener('change', () => this.updateGrid());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isModalOpen()) {
        this.closeModal();
      }
    });
  },

  loadSettings() {
    const savedLanguage = localStorage.getItem('kitchen-language') || 'fr';
    if (this.languageSelect) {
      this.languageSelect.value = savedLanguage;
    }

    const savedCols = parseInt(localStorage.getItem('kitchen-grid-cols')) || 3;
    const savedRows = parseInt(localStorage.getItem('kitchen-grid-rows')) || 3;
    
    if (this.gridColsInput) {
      this.gridColsInput.value = savedCols;
    }
    
    if (this.gridRowsInput) {
      this.gridRowsInput.value = savedRows;
    }

    UI.updateGridConfig(savedCols, savedRows);
  },

  saveSettings() {
    if (this.languageSelect) {
      localStorage.setItem('kitchen-language', this.languageSelect.value);
    }

    if (this.gridColsInput && this.gridRowsInput) {
      localStorage.setItem('kitchen-grid-cols', this.gridColsInput.value);
      localStorage.setItem('kitchen-grid-rows', this.gridRowsInput.value);
    }
  },

  openModal() {
    if (this.modal) {
      this.modal.classList.add('show');
    }
  },

  closeModal() {
    if (this.modal) {
      this.modal.classList.remove('show');
    }
  },

  isModalOpen() {
    return this.modal && this.modal.classList.contains('show');
  },

  changeLanguage(language) {
    if (!I18n.isLanguageSupported(language)) {
      return;
    }

    I18n.setLanguage(language);
    UI.updateLanguage();
    this.saveSettings();
  },

  updateGrid() {
    if (!this.gridColsInput || !this.gridRowsInput) return;

    const cols = parseInt(this.gridColsInput.value);
    const rows = parseInt(this.gridRowsInput.value);

    if (cols < 1 || cols > 5 || rows < 1 || rows > 5) {
      return;
    }

    UI.updateGridConfig(cols, rows);
    this.saveSettings();
  }
}; 