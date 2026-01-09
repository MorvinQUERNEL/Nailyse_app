# 💅 Nailyse - Application de Gestion d'Ongles

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Symfony](https://img.shields.io/badge/Symfony-7.4-000000?logo=symfony&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?logo=php&logoColor=white)

Application full-stack pour la gestion de rendez-vous et la vente de produits d'onglerie professionnelle.

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [Structure du Projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
- [Contribuer](#-contribuer)

## ✨ Fonctionnalités

### 🛍️ Boutique en Ligne
- Catalogue de produits avec images
- Panier persistant (localStorage)
- Paiement sécurisé via Stripe
- Mode clair/sombre

### 📅 Prise de Rendez-vous
- Calendrier interactif (week-ends uniquement)
- Créneaux horaires de 10h à 18h
- Validation des données (email, téléphone)
- Confirmation par email

### 🎨 Interface Utilisateur
- Design moderne avec Tailwind CSS
- Responsive (mobile, tablet, desktop)
- Thème sombre/clair avec persistance
- Animations fluides

## 🛠️ Technologies

### Frontend
- **React 19.2** - Framework UI
- **Vite 7.2** - Build tool ultra-rapide
- **React Router 7** - Routage SPA
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **Axios** - Client HTTP
- **React Calendar** - Widget calendrier
- **Stripe React** - Intégration paiement

### Backend
- **Symfony 7.4** - Framework PHP
- **API Platform 4.2** - REST API automatique
- **Doctrine ORM** - Mapping objet-relationnel
- **PostgreSQL/SQLite** - Base de données
- **Stripe PHP SDK** - Paiement serveur
- **Nelmio CORS** - Gestion CORS

## 📦 Prérequis

- **Node.js** >= 18.x
- **PHP** >= 8.2
- **Composer** >= 2.x
- **Symfony CLI** (optionnel mais recommandé)
- **PostgreSQL** >= 16 (ou utiliser SQLite en dev)
- **Git**

## 🚀 Installation

### 1. Cloner le Repository

\`\`\`bash
git clone <url-du-repo>
cd Nailyse_app
\`\`\`

### 2. Installation du Backend (Symfony)

\`\`\`bash
cd backend

# Installer les dépendances PHP
composer install

# Copier le fichier .env (déjà configuré)
# Le fichier .env contient déjà APP_SECRET et les variables nécessaires

# Créer la base de données
php bin/console doctrine:database:create

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# Charger les données de test (fixtures)
php bin/console doctrine:fixtures:load
\`\`\`

### 3. Installation du Frontend (React)

\`\`\`bash
cd ../frontend

# Installer les dépendances npm
npm install

# Le fichier .env est déjà configuré avec VITE_API_URL
\`\`\`

## ⚙️ Configuration

### Backend (.env)

Le fichier \`backend/.env\` est déjà configuré avec :

\`\`\`env
APP_ENV=dev
APP_SECRET=76f2d48ad35a5083cf67cdd9bc2245efc2b9545457a8f96dfd1b9cc8a53f3383
DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
STRIPE_SECRET_KEY=sk_test_***  # À remplacer par votre clé Stripe
MAILER_DSN=null://null
\`\`\`

**⚠️ Configuration Stripe :**
1. Créer un compte sur [Stripe](https://stripe.com)
2. Récupérer votre clé secrète de test (\`sk_test_...\`)
3. Remplacer \`STRIPE_SECRET_KEY\` dans \`.env\`

### Frontend (.env)

Le fichier \`frontend/.env\` contient :

\`\`\`env
VITE_API_URL=http://127.0.0.1:8000
\`\`\`

Pour la production, modifier cette valeur avec l'URL de votre API.

## 🏃 Lancement

### Démarrer le Backend

\`\`\`bash
cd backend

# Option 1 : Avec Symfony CLI (recommandé)
symfony server:start

# Option 2 : Avec le serveur PHP intégré
php -S 127.0.0.1:8000 -t public

# Le backend sera accessible sur http://127.0.0.1:8000
\`\`\`

### Démarrer le Frontend

Dans un nouveau terminal :

\`\`\`bash
cd frontend

# Démarrer le serveur de développement Vite
npm run dev

# L'application sera accessible sur http://localhost:5173
\`\`\`

### Accéder à l'Application

- **Frontend** : [http://localhost:5173](http://localhost:5173)
- **API** : [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
- **API Docs** : [http://127.0.0.1:8000/api/docs](http://127.0.0.1:8000/api/docs)

## 📁 Structure du Projet

\`\`\`
Nailyse_app/
├── backend/                    # API Symfony
│   ├── config/                # Configuration Symfony
│   │   ├── packages/          # Config bundles
│   │   └── routes/            # Routes personnalisées
│   ├── src/
│   │   ├── Controller/        # Contrôleurs (PaymentController)
│   │   ├── Entity/            # Entités Doctrine (Product, Appointment)
│   │   ├── Repository/        # Repositories Doctrine
│   │   └── DataFixtures/      # Données de test
│   ├── migrations/            # Migrations de base de données
│   ├── var/                   # Cache, logs, database SQLite
│   ├── .env                   # Variables d'environnement
│   └── composer.json          # Dépendances PHP
│
├── frontend/                   # Application React
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── layout/        # Layout, Navbar
│   │   │   ├── shop/          # ProductCard
│   │   │   └── AppointmentCalendar.jsx
│   │   ├── pages/             # Pages de l'application
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   └── PaymentCancel.jsx
│   │   ├── context/           # Contextes React
│   │   │   ├── ThemeContext.jsx    # Gestion thème
│   │   │   └── CartContext.jsx     # Gestion panier
│   │   ├── App.jsx            # Routeur principal
│   │   └── main.jsx           # Point d'entrée
│   ├── .env                   # Variables d'environnement
│   ├── .env.example           # Template .env
│   ├── package.json           # Dépendances npm
│   ├── vite.config.js         # Configuration Vite
│   └── tailwind.config.js     # Configuration Tailwind
│
└── README.md                   # Ce fichier
\`\`\`

## 📡 API Endpoints

### Produits

- \`GET /api/products\` - Liste tous les produits
- \`GET /api/products/{id}\` - Détails d'un produit
- \`POST /api/products\` - Créer un produit (admin)
- \`PUT /api/products/{id}\` - Modifier un produit (admin)
- \`DELETE /api/products/{id}\` - Supprimer un produit (admin)

### Rendez-vous

- \`GET /api/appointments\` - Liste tous les rendez-vous
- \`POST /api/appointments\` - Créer un rendez-vous
- \`GET /api/appointments/{id}\` - Détails d'un rendez-vous
- \`PUT /api/appointments/{id}\` - Modifier un rendez-vous
- \`DELETE /api/appointments/{id}\` - Supprimer un rendez-vous

### Paiement

- \`POST /api/payment/create-session\` - Créer une session Stripe

## 🧪 Tests

### Backend

\`\`\`bash
cd backend

# Lancer les tests PHPUnit
php bin/phpunit
\`\`\`

### Frontend

\`\`\`bash
cd frontend

# Lancer les tests
npm run test
\`\`\`

## 📦 Production

### Build Frontend

\`\`\`bash
cd frontend
npm run build
# Les fichiers de production seront dans le dossier dist/
\`\`\`

### Build Backend

\`\`\`bash
cd backend

# Optimiser l'autoloader Composer
composer install --no-dev --optimize-autoloader

# Vider le cache
php bin/console cache:clear --env=prod

# Générer les secrets de production
php bin/console secrets:generate-keys --env=prod
\`\`\`

## 🤝 Contribuer

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Fork le projet
2. Créer une branche (\`git checkout -b feature/AmazingFeature\`)
3. Commiter les changements (\`git commit -m 'Add AmazingFeature'\`)
4. Pusher sur la branche (\`git push origin feature/AmazingFeature\`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier \`LICENSE\` pour plus de détails.

## 👥 Auteurs

- **Nailyse Team** - *Initial work*

## 🙏 Remerciements

- [Symfony](https://symfony.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Stripe](https://stripe.com/)
- [Vite](https://vitejs.dev/)
- [API Platform](https://api-platform.com/)

---

⭐ **Si vous aimez ce projet, n'hésitez pas à lui donner une étoile !**
