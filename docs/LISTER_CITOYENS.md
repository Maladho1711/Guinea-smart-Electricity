# 📧 Lister les Emails des Citoyens

## ✅ Script Disponible

Vous avez déjà un script `list-citoyens` dans votre projet qui liste tous les utilisateurs avec le rôle "citoyen".

---

## 🚀 Comment Utiliser

### Option 1 : Via Railway CLI (si installé)

```bash
# Dans le dossier back/
cd back
railway run npm run list-citoyens
```

---

### Option 2 : Via Railway Dashboard

1. Allez sur [Railway Dashboard](https://railway.app)
2. Sélectionnez votre service backend
3. Allez dans l'onglet **Deployments**
4. Cliquez sur le dernier déploiement
5. **View Logs** ou **Open Terminal**
6. Exécutez la commande :
   ```bash
   npm run list-citoyens
   ```

---

### Option 3 : Via MongoDB Atlas (Direct)

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Connectez-vous à votre cluster
3. Cliquez sur **Browse Collections**
4. Sélectionnez votre base de données : `guinea_smart_electricity`
5. Collection : `users`
6. Dans le filtre, tapez :
   ```json
   { "role": "citoyen" }
   ```
7. Vous verrez tous les utilisateurs citoyens avec leurs emails

---

### Option 4 : Créer un Endpoint API (Avancé)

Si vous voulez accéder à cette liste depuis le frontend, vous pouvez créer un endpoint API.

**Dans `back/src/routes/userRoutes.ts`**, ajoutez :

```typescript
import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import User from '../models/userModel';

const router = Router();

// Route pour lister les citoyens (admin seulement)
router.get('/citoyens', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const citoyens = await User.find({ role: 'citoyen' })
      .select('email fullName firstName lastName phone created_at')
      .sort({ created_at: -1 });
    
    res.json({
      count: citoyens.length,
      citoyens: citoyens.map(c => ({
        email: c.email,
        fullName: c.fullName,
        firstName: c.firstName,
        lastName: c.lastName,
        phone: c.phone,
        created_at: c.created_at,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

Puis accédez via : `https://guinea-smart-electricity-production.up.railway.app/api/users/citoyens`

---

## 📊 Ce que le Script Affiche

Le script `list-citoyens` affiche :

```
✅ X utilisateur(s) trouvé(s) avec le rôle "citoyen":

📧 Email: exemple@email.com
   Nom complet: Prénom Nom
   Prénom: Prénom
   Nom: Nom
   Téléphone: +224 000 000 000
   Adresse: Adresse complète
   Numéro de compteur: 123456
   Date de création: 14/11/2024, 18:30:00

📧 Liste des emails uniquement:
   • exemple1@email.com
   • exemple2@email.com
   • exemple3@email.com
```

---

## 🎯 Solution Rapide

**La méthode la plus simple** est d'utiliser Railway Dashboard :

1. Railway → Votre service → **Deployments**
2. **View Logs** ou **Open Terminal**
3. Tapez : `npm run list-citoyens`
4. Vous verrez tous les emails des citoyens

---

## 📝 Alternative : Via MongoDB Atlas

Si vous préférez voir directement dans MongoDB :

1. MongoDB Atlas → **Browse Collections**
2. Base : `guinea_smart_electricity`
3. Collection : `users`
4. Filtre : `{ "role": "citoyen" }`
5. Vous verrez tous les documents avec les emails

---

## ✅ Résumé

Pour voir les emails des citoyens :

**Méthode recommandée** :
```bash
# Sur Railway
npm run list-citoyens
```

**Méthode alternative** :
- MongoDB Atlas → Collections → `users` → Filtrer par `role: "citoyen"`

---

**Le script est déjà prêt à être utilisé !** 🚀

