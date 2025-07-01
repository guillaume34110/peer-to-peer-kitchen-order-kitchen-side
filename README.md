# Kitchen Receiver

Une application web front-end pour recevoir et gérer les commandes de cuisine en temps réel via WebSocket.

## 🎯 Objectifs

- Recevoir des commandes structurées via WebSocket
- Afficher les commandes dans une grille de tables configurables
- Gérer l'état de chaque produit (à faire / fait)
- Permettre l'annulation des produits non terminés
- Support multilingue complet (FR/TH)
- Interface responsive pour tablettes

## 🏗️ Architecture

```
/kitchen-receiver
├── index.html              # Page principale
├── script/
│   ├── websocket.js        # Gestion WebSocket
│   ├── state.js            # État des commandes en RAM
│   ├── ui.js               # Interface utilisateur
│   ├── i18n.js             # Système multilingue
│   └── settings.js         # Configuration utilisateur
├── data/
│   └── lang.json           # Traductions FR/TH
├── styles/
│   └── main.css            # Styles responsive
└── README.md
```

## 🔌 Protocole WebSocket

### Ajouter une commande
```json
{
  "orderId": "abc123",
  "table": 3,
  "timestamp": 1720000000,
  "item": {
    "id": "cafe",
    "price": 50,
    "name": {
      "fr": "Café",
      "th": "กาแฟ"
    }
  }
}
```

### Supprimer une commande
```json
{
  "orderId": "abc123",
  "table": 3,
  "timestamp": 1720000000,
  "action": "remove"
}
```

## 🚀 Utilisation

### Démarrage rapide

1. **Cloner/télécharger** le projet
2. **Servir** les fichiers via un serveur web local
3. **Configurer** un serveur WebSocket sur le port 3000
4. **Ouvrir** `index.html` dans un navigateur

### Serveur de développement

```bash
# Serveur simple avec Python
python -m http.server 8080

# Ou avec Node.js
npx serve .

# L'application se connecte automatiquement à ws://localhost:3000
```

### Configuration WebSocket

L'application se connecte automatiquement à :
```
ws://${location.hostname}:3000
```

## ⚙️ Fonctionnalités

### Interface utilisateur

- **Grille configurable** : 1×1 à 5×5 tables
- **Numérotation inversée** : Table 1 en haut à droite
- **Gestion des commandes** : À faire ↔ Fait
- **Annulation** : Possible uniquement si "à faire"
- **Total par table** : Calcul automatique
- **Bouton "Terminer"** : Vide toute la table

### Multilingue

- **Français** et **Thaï** supportés
- **Traductions automatiques** de l'interface
- **Noms d'articles** multilingues dans les commandes
- **Devises appropriées** : € pour FR, ฿ pour TH

### Paramètres

Accès via le bouton ⚙️ :
- **Langue** : FR/TH
- **Taille de grille** : Colonnes × Lignes
- **Sauvegarde automatique** dans localStorage

## 🎨 Design

### Thème

- **Design moderne** et minimaliste
- **Contrastes élevés** pour la cuisine
- **Couleurs sémantiques** : vert (fait), rouge (annuler), bleu (principal)
- **Animations subtiles** pour les nouvelles commandes

### Responsive

- **Tablettes** : Optimisé pour iPad/Android
- **Mobile** : Grille adaptative en colonne unique
- **Desktop** : Support complet des grilles étendues

## 🔧 Modules JavaScript

### `I18n` - Internationalisation
- Chargement des traductions depuis `lang.json`
- Application dynamique des textes
- Formatage des devises par langue

### `State` - Gestion d'état
- Stockage en mémoire des commandes
- Structure Map pour les performances
- Notifications des changements via listeners

### `UI` - Interface utilisateur
- Rendu des grilles de tables
- Génération dynamique des éléments
- Gestion des interactions utilisateur

### `Settings` - Configuration
- Modal de paramètres
- Sauvegarde dans localStorage
- Gestion des événements de configuration

### `WebSocketManager` - Communication
- Connexion automatique au serveur
- Reconnexion automatique en cas d'erreur
- Validation des messages entrants

## 📱 Compatibilité

### Navigateurs supportés
- **Chrome/Edge** : 88+
- **Firefox** : 85+
- **Safari** : 14+
- **iOS Safari** : 14+
- **Android Chrome** : 88+

### Technologies utilisées
- **HTML5** : Structure sémantique
- **CSS3** : Variables, Grid, Flexbox
- **ES6+** : Modules, async/await, Map/Set
- **WebSocket API** : Communication temps réel

## 🛠️ Développement

### Structure du code

- **Modules autonomes** : Chaque fichier JS est indépendant
- **Pas de classes** : Utilisation d'objets littéraux uniquement
- **Fonctions pures** : Logique métier séparée de l'UI
- **Clean code** : Nommage explicite et fonctions courtes

### Ajout de langues

1. Modifier `data/lang.json` :
```json
{
  "fr": { ... },
  "th": { ... },
  "en": {
    "todo": "To do",
    "done": "Done",
    ...
  }
}
```

2. Ajouter l'option dans `index.html` :
```html
<option value="en">English</option>
```

### Personnalisation CSS

Variables CSS disponibles dans `:root` :
- `--primary-color` : Couleur principale
- `--success-color` : Couleur de réussite
- `--danger-color` : Couleur de danger
- `--spacing-*` : Espacements modulaires

## 🧪 Test manuel

### Simulation de commandes

Vous pouvez tester l'application en envoyant des messages WebSocket depuis la console du navigateur :

```javascript
// Ajouter une commande de test
WebSocketManager.handleMessage({
  data: JSON.stringify({
    orderId: "test123",
    table: 1,
    timestamp: Date.now(),
    item: {
      id: "cafe",
      price: 50,
      name: { fr: "Café", th: "กาแฟ" }
    }
  })
});

// Supprimer une commande
WebSocketManager.handleMessage({
  data: JSON.stringify({
    orderId: "test123",
    table: 1,
    timestamp: Date.now(),
    action: "remove"
  })
});
```

## 📄 Licence

Projet libre d'utilisation pour les restaurants et cuisines.

## 🤝 Contribution

Les améliorations sont les bienvenues :
- Nouvelles langues
- Optimisations d'interface
- Fonctionnalités supplémentaires
- Corrections de bugs 