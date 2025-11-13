import { Response } from 'express';
import User, { getUserById as getUserByIdModel, updateUser as updateUserModel, deleteUser as deleteUserModel } from '../models/userModel';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password'); // Exclure les mots de passe
    res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des utilisateurs',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdModel(id);
    
    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }
    
    // Exclure le mot de passe
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    res.status(200).json({ user: userWithoutPassword });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Erreur lors de la récupération de l\'utilisateur',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Ne pas permettre la modification du mot de passe via cette route
    delete updateData.password;
    
    const user = await updateUserModel(id, updateData);
    
    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }
    
    // Exclure le mot de passe
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    res.status(200).json({ 
      message: 'Utilisateur mis à jour',
      user: userWithoutPassword
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Erreur lors de la mise à jour de l\'utilisateur',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdModel(id);
    
    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }
    
    await deleteUserModel(id);
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Erreur lors de la suppression de l\'utilisateur',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

