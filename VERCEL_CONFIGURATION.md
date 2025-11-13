# ⚙️ Configuration Vercel - Instructions

## 🔧 Configuration Requise dans Vercel Dashboard

Pour que votre application fonctionne correctement sur Vercel, vous devez configurer les paramètres suivants :

### 1. Accéder aux Settings

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet : `guinea-smart-electricity-mrxb`
3. Cliquez sur **Settings** (Paramètres)

### 2. Configuration du Root Directory

1. Dans **Settings → General**
2. Trouvez la section **Root Directory**
3. Cliquez sur **Edit**
4. Sélectionnez `project` comme Root Directory
5. Cliquez sur **Save**

⚠️ **IMPORTANT** : Si le Root Directory n'est pas configuré sur `project`, Vercel ne trouvera pas votre application et vous verrez une erreur 404.

### 3. Configuration du Build

Dans **Settings → General → Build & Development Settings**, vérifiez :

- **Framework Preset** : `Vite`
- **Build Command** : `npm install --legacy-peer-deps && npm run build`
- **Output Directory** : `dist`
- **Install Command** : `npm install --legacy-peer-deps`
- **Development Command** : `npm run dev`

### 4. Variables d'Environnement

Dans **Settings → Environment Variables**, ajoutez :

```
VITE_API_URL=https://votre-backend-railway.up.railway.app
```

(Remplacez par l'URL réelle de votre backend Railway une fois déployé)

### 5. Redéployer

Après avoir modifié ces paramètres :

1. Allez dans **Deployments**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Sélectionnez **Redeploy**
4. Attendez 2-3 minutes

## ✅ Vérification

Après le redéploiement, testez ces URLs :

- ✅ `https://guinea-smart-electricity-mrxb.vercel.app/` → Doit afficher la page d'accueil
- ✅ `https://guinea-smart-electricity-mrxb.vercel.app/faq` → Doit afficher la FAQ (pas de 404)
- ✅ `https://guinea-smart-electricity-mrxb.vercel.app/pme-dashboard` → Doit rediriger ou afficher le dashboard (pas de 404)

## 🐛 Si le Problème Persiste

1. **Vérifiez les Build Logs** :
   - Allez dans **Deployments** → Cliquez sur le dernier déploiement
   - Regardez l'onglet **Build Logs**
   - Vérifiez s'il y a des erreurs

2. **Vérifiez que le build fonctionne localement** :
   ```bash
   cd project
   npm install --legacy-peer-deps
   npm run build
   npm run preview
   ```

3. **Supprimez et recréez le projet** (dernier recours) :
   - Supprimez le projet sur Vercel
   - Recréez-le en connectant votre repository GitHub
   - Configurez le Root Directory sur `project` dès le début

## 📝 Fichier vercel.json

Le fichier `project/vercel.json` contient déjà la bonne configuration pour React Router. Il redirige toutes les routes vers `index.html` pour permettre au routage côté client de fonctionner.

