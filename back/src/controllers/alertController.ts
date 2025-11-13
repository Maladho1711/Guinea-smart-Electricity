import { Response } from 'express';
import { createAlert, getAlertsByUserId, getActiveAlertsByUserId, markAlertAsRead, archiveAlert, deleteAlert } from '../models/alertModel';
import { AuthRequest } from '../middleware/authMiddleware';

// Créer une alerte
export const createUserAlert = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { type, title, message, priority } = req.body;

    // Validation
    if (!type || !title || !message) {
      return res.status(400).json({ error: 'Type, titre et message sont requis' });
    }

    const validTypes = ['consommation', 'facture', 'panne', 'maintenance', 'paiement', 'autre'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Type d\'alerte invalide' });
    }

    const alert = await createAlert({
      userId: userId as any,
      type,
      title,
      message,
      priority: priority || 'moyenne',
      status: 'active',
    });

    res.status(201).json({
      message: 'Alerte créée avec succès',
      alert: {
        id: alert._id,
        type: alert.type,
        title: alert.title,
        message: alert.message,
        priority: alert.priority,
        status: alert.status,
        createdAt: alert.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'alerte:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de l\'alerte',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Récupérer toutes les alertes de l'utilisateur
export const getUserAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { status } = req.query;
    let alerts;

    if (status === 'active') {
      alerts = await getActiveAlertsByUserId(userId);
    } else {
      alerts = await getAlertsByUserId(userId);
    }

    res.status(200).json({
      alerts: alerts.map(alert => ({
        id: alert._id,
        type: alert.type,
        title: alert.title,
        message: alert.message,
        priority: alert.priority,
        status: alert.status,
        readAt: alert.readAt,
        createdAt: alert.createdAt,
        updatedAt: alert.updatedAt,
      })),
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des alertes:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des alertes',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Marquer une alerte comme lue
export const markAlertRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { id } = req.params;
    const alert = await markAlertAsRead(id, userId);

    if (!alert) {
      return res.status(404).json({ error: 'Alerte non trouvée' });
    }

    res.status(200).json({
      message: 'Alerte marquée comme lue',
      alert: {
        id: alert._id,
        status: alert.status,
        readAt: alert.readAt,
      },
    });
  } catch (error: any) {
    console.error('Erreur lors du marquage de l\'alerte:', error);
    res.status(500).json({
      error: 'Erreur lors du marquage de l\'alerte',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Archiver une alerte
export const archiveUserAlert = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { id } = req.params;
    const alert = await archiveAlert(id, userId);

    if (!alert) {
      return res.status(404).json({ error: 'Alerte non trouvée' });
    }

    res.status(200).json({
      message: 'Alerte archivée',
      alert: {
        id: alert._id,
        status: alert.status,
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'archivage de l\'alerte:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'archivage de l\'alerte',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Supprimer une alerte
export const deleteUserAlert = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { id } = req.params;
    await deleteAlert(id, userId);

    res.status(200).json({ message: 'Alerte supprimée avec succès' });
  } catch (error: any) {
    console.error('Erreur lors de la suppression de l\'alerte:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression de l\'alerte',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

