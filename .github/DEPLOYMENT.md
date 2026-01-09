# Deployment Guide - Nailyse sur Hostinger

## Configuration GitHub Actions

### Secrets a configurer

Dans **GitHub > Settings > Secrets and variables > Actions > Secrets**:

| Secret | Description | Exemple |
|--------|-------------|---------|
| `FTP_HOST` | Serveur FTP Hostinger | `ftp.tondomaine.com` |
| `FTP_USER` | Utilisateur FTP | `u123456789` |
| `FTP_PASSWORD` | Mot de passe FTP | `MotDePasseFTP123` |
| `APP_SECRET` | Cle secrete Symfony (32 chars) | `a1b2c3d4e5f6...` |
| `DATABASE_URL` | URL MySQL Hostinger | `mysql://user:pass@localhost:3306/dbname` |
| `STRIPE_SECRET_KEY` | Cle secrete Stripe | `sk_live_...` |
| `MAILER_DSN` | Config email Hostinger | `smtp://user:pass@smtp.hostinger.com:587` |

### Variables a configurer

Dans **GitHub > Settings > Secrets and variables > Actions > Variables**:

| Variable | Description | Exemple |
|----------|-------------|---------|
| `API_URL` | URL de l'API backend | `https://api.tondomaine.com` |
| `DOMAIN` | Domaine principal (sans www) | `tondomaine.com` |
| `BACKEND_PATH` | Chemin FTP du backend | `/public_html/api/` |
| `FRONTEND_PATH` | Chemin FTP du frontend | `/public_html/` |

## Ou trouver les infos sur Hostinger

### Credentials FTP
1. Connecte-toi a hPanel (panel.hostinger.com)
2. Va dans **Hebergement** > **Ton site**
3. Section **Fichiers** > **Comptes FTP**
4. Copie: Hote, Nom d'utilisateur, Mot de passe

### Base de donnees MySQL
1. hPanel > **Bases de donnees** > **MySQL**
2. Cree une base de donnees si necessaire
3. Note: Nom de la BDD, Utilisateur, Mot de passe, Hote (souvent `localhost`)
4. Format: `mysql://UTILISATEUR:MOT_DE_PASSE@localhost:3306/NOM_BDD`

### Email SMTP (pour Mailer)
1. hPanel > **Emails** > **Comptes email**
2. Cree un compte email (ex: `noreply@tondomaine.com`)
3. Config SMTP:
   - Hote: `smtp.hostinger.com`
   - Port: `587` (TLS) ou `465` (SSL)
   - Format: `smtp://EMAIL:MOT_DE_PASSE@smtp.hostinger.com:587`

## Structure des fichiers sur Hostinger

```
public_html/
├── index.html          (Frontend React)
├── assets/             (JS/CSS build)
├── api/                (Backend Symfony)
│   ├── public/
│   │   └── index.php   (Point d'entree API)
│   ├── src/
│   ├── config/
│   ├── var/
│   ├── vendor/
│   └── .env.local      (Config production)
```

## Configuration .htaccess

### Frontend (public_html/.htaccess)
```apache
RewriteEngine On
RewriteBase /

# Redirige vers HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# React Router - SPA fallback
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^ index.html [L]

# Proxy vers API
RewriteRule ^api/(.*)$ /api/public/index.php/$1 [L,QSA]
```

### Backend (public_html/api/public/.htaccess)
```apache
DirectoryIndex index.php

RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ index.php [QSA,L]

# CORS Headers
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

## Apres le premier deploiement

Connecte-toi en SSH ou utilise le terminal Hostinger:

```bash
cd public_html/api

# Lancer les migrations
php bin/console doctrine:migrations:migrate --no-interaction

# Charger les donnees de test (optionnel)
php bin/console doctrine:fixtures:load --no-interaction

# Verifier que tout fonctionne
php bin/console about
```

## Generer APP_SECRET

```bash
# Sur ton PC local
php -r "echo bin2hex(random_bytes(16));"
# ou
openssl rand -hex 32
```

## Depannage

### Erreur 500
- Verifie les logs: `public_html/api/var/log/prod.log`
- Verifie les permissions: `chmod -R 755 var/`

### API non accessible
- Verifie que `/api/public/index.php` existe
- Verifie le `.htaccess`
- Teste: `https://tondomaine.com/api/products`

### Probleme de base de donnees
- Verifie `DATABASE_URL` dans `.env.local`
- Teste la connexion MySQL dans hPanel

## Support

Pour toute question: contact@nailyse.fr
