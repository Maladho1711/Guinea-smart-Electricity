# 🚀 Configuration Rapide - Variables d'Environnement

## 📋 Guide Étape par Étape

### 1. Créer le fichier .env

```bash
cd back
cp .env.example .env
```

Ou créez manuellement un fichier `back/.env` et copiez le contenu de `.env.example`.

### 2. Configurer MongoDB

**Option A : MongoDB Atlas (Recommandé - Gratuit)**
1. Allez sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit
3. Copiez la connection string
4. Remplacez `<password>` par votre mot de passe
5. Collez dans `.env` :

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Option B : MongoDB Local**
```env
MONGODB_URI=mongodb://localhost:27017/guinea_smart_electricity
```

### 3. Configurer JWT Secret

Générez un secret sécurisé :

```bash
# Sur Linux/Mac
openssl rand -base64 32

# Sur Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Collez le résultat dans `.env` :

```env
JWT_SECRET=votre_secret_genere_ici
```

### 4. Configurer Hugging Face (Optionnel mais Recommandé)

**Pourquoi ?** 
- Sans token : ~30 requêtes/heure
- Avec token : ~1000 requêtes/jour

**Étapes :**
1. Créez un compte gratuit sur [huggingface.co](https://huggingface.co)
2. Allez dans **Settings → Access Tokens**
3. Cliquez sur **New token**
4. Nommez-le (ex: "EVA-GSE")
5. Sélectionnez **Read** (lecture seule)
6. Copiez le token (commence par `hf_`)
7. Collez dans `.env` :

```env
HUGGINGFACE_API_KEY=hf_votre-token-ici
```

### 5. Configurer le Frontend URL

**En développement :**
```env
FRONTEND_URL=http://localhost:5173
```

**En production (après déploiement Vercel) :**
```env
FRONTEND_URL=https://guinea-smart-electricity-mrxb.vercel.app
```

### 6. Variables Optionnelles

**Email (SMTP)** - Pour l'envoi d'emails :
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_application
```

## ✅ Vérification

Après configuration, redémarrez le serveur :

```bash
cd back
npm run dev
```

Vous devriez voir :
- ✅ MongoDB connecté avec succès
- ✅ Serveur démarré sur le port 3000
- ✅ Hugging Face initialisé (si token configuré)

## 🔒 Sécurité

- ⚠️ **NE COMMITEZ JAMAIS** le fichier `.env` dans Git
- Le fichier `.env` est déjà dans `.gitignore`
- Utilisez des secrets forts en production
- Changez `JWT_SECRET` en production

## 📝 Variables Minimales Requises

Pour que l'application fonctionne, vous devez au minimum configurer :

1. `MONGODB_URI` - Obligatoire
2. `JWT_SECRET` - Obligatoire (changez la valeur par défaut)
3. `FRONTEND_URL` - Recommandé pour CORS

Les autres variables sont optionnelles mais recommandées pour une meilleure expérience.

## 🚀 Déploiement

Pour Railway/Render/Vercel, configurez ces variables dans leur dashboard :
- Allez dans **Settings → Environment Variables**
- Ajoutez chaque variable une par une
- Redéployez après modification

