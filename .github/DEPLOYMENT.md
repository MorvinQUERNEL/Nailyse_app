# Deployment Guide - Nailyse

## GitHub Actions Workflow

Le workflow CI/CD se declenche automatiquement lors d'un push sur les branches `main` ou `develop`.

### Pipeline

1. **Backend Job**: Installe PHP 8.2, les dependances Composer, cree la base de donnees de test, valide le schema Doctrine
2. **Frontend Job**: Installe Node.js 20, les dependances npm, lint le code, build le projet React
3. **Deploy Job**: Se declenche uniquement sur la branche `main` apres validation des deux jobs precedents

## Secrets a configurer

Dans **Settings > Secrets and variables > Actions** de votre repository GitHub:

### Variables d'environnement (Settings > Variables)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `API_URL` | URL de l'API backend en production | `https://api.nailyse.fr` |

### Secrets requis selon le type de deploiement

#### Option 1: Deploiement VPS (SSH)

| Secret | Description |
|--------|-------------|
| `SERVER_HOST` | Adresse IP ou domaine du serveur |
| `SERVER_USER` | Utilisateur SSH pour la connexion |
| `SSH_PRIVATE_KEY` | Cle SSH privee (format OpenSSH) |

#### Option 2: Vercel (Frontend) + Railway/Render (Backend)

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Token API Vercel |
| `VERCEL_ORG_ID` | ID de l'organisation Vercel |
| `VERCEL_PROJECT_ID` | ID du projet Vercel |

#### Option 3: Platform.sh

| Secret | Description |
|--------|-------------|
| `PLATFORMSH_PROJECT_ID` | ID du projet Platform.sh |
| `PLATFORMSH_CLI_TOKEN` | Token CLI Platform.sh |

### Secrets de l'application (Production)

Ces secrets doivent etre configures sur votre serveur de production:

| Variable | Description |
|----------|-------------|
| `APP_SECRET` | Cle secrete Symfony (32 caracteres) |
| `DATABASE_URL` | URL de connexion PostgreSQL/MySQL |
| `STRIPE_SECRET_KEY` | Cle secrete Stripe (commence par `sk_live_`) |
| `STRIPE_PUBLISHABLE_KEY` | Cle publique Stripe (commence par `pk_live_`) |
| `MAILER_DSN` | Configuration SMTP pour les emails |

## Configuration Production

### Backend (.env.local sur le serveur)

```env
APP_ENV=prod
APP_SECRET=votre_secret_32_caracteres
DATABASE_URL=postgresql://user:password@localhost:5432/nailyse?serverVersion=15
STRIPE_SECRET_KEY=sk_live_...
MAILER_DSN=smtp://user:password@smtp.mailtrap.io:2525
CORS_ALLOW_ORIGIN='^https?://(www\.)?nailyse\.fr$'
```

### Frontend (.env.production)

```env
VITE_API_URL=https://api.nailyse.fr
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Commandes de deploiement manuel

### Backend
```bash
cd backend
composer install --no-dev --optimize-autoloader
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console cache:clear --env=prod
php bin/console cache:warmup --env=prod
```

### Frontend
```bash
cd frontend
npm ci
npm run build
# Les fichiers sont dans dist/
```

## Architecture recommandee

```
                    [GitHub Actions]
                          |
        +-----------------+-----------------+
        |                                   |
   [Backend Build]                   [Frontend Build]
        |                                   |
        v                                   v
   [PHP/Symfony]                      [Static Files]
   [API Server]                       [CDN/Nginx]
        |                                   |
        +-----------------------------------+
                          |
                    [Load Balancer]
                          |
                    [Production]
```

## Support

Pour toute question: contact@nailyse.fr
