import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/authMiddleware';
import { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket, getTicketsByCreatedBy } from '../models/ticketModel';

// Créer un ticket (citoyen ou PME)
export const createTicketHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, assignedTo } = req.body;

    // Validation des champs requis
    if (!title || !description) {
      return res.status(400).json({ error: 'Les champs title et description sont requis' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Vérifier que l'utilisateur est un citoyen ou PME
    if (!['citoyen', 'pme'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Seuls les citoyens et PME peuvent créer des tickets' });
    }

    // Créer le ticket
    const ticket = await createTicket({
      title,
      description,
      createdBy: new mongoose.Types.ObjectId(req.user.id),
      assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
      status: 'ouvert',
    } as any);

    // Populate les références
    await ticket.populate('createdBy');
    if (ticket.assignedTo) {
      await ticket.populate('assignedTo');
    }

    res.status(201).json({
      message: 'Ticket créé avec succès',
      ticket,
    });
  } catch (error: any) {
    console.error('Erreur lors de la création du ticket:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du ticket',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Liste des tickets
export const getTickets = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Si c'est un citoyen ou PME, retourner seulement ses tickets
    if (['citoyen', 'pme'].includes(req.user.role)) {
      const tickets = await getTicketsByCreatedBy(req.user.id);
      return res.status(200).json({ tickets });
    }

    // Sinon, retourner tous les tickets (manager, admin, technicien)
    const tickets = await getAllTickets();
    res.status(200).json({ tickets });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des tickets:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des tickets',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Voir un ticket par ID
export const getTicketByIdHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const ticket = await getTicketById(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket non trouvé' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Vérifier les permissions : citoyen/PME ne peuvent voir que leurs tickets
    if (['citoyen', 'pme'].includes(req.user.role)) {
      if (ticket.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Accès refusé' });
      }
    }

    res.status(200).json({ ticket });
  } catch (error: any) {
    console.error('Erreur lors de la récupération du ticket:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du ticket',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Modifier un ticket
export const updateTicketHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, status } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Vérifier que le ticket existe
    const existingTicket = await getTicketById(id);
    if (!existingTicket) {
      return res.status(404).json({ error: 'Ticket non trouvé' });
    }

    // Seuls les techniciens peuvent marquer un ticket comme 'résolu'
    if (status === 'résolu' && req.user.role !== 'technicien') {
      return res.status(403).json({ error: 'Seuls les techniciens peuvent marquer un ticket comme résolu' });
    }

    // Validation du statut si fourni
    if (status) {
      const validStatuses = ['ouvert', 'en cours', 'résolu'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Statut invalide' });
      }
    }

    // Préparer les données à mettre à jour
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (assignedTo) updateData.assignedTo = new mongoose.Types.ObjectId(assignedTo);
    if (status) updateData.status = status;

    const ticket = await updateTicket(id, updateData);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket non trouvé' });
    }

    res.status(200).json({
      message: 'Ticket mis à jour avec succès',
      ticket,
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du ticket:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du ticket',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Supprimer un ticket
export const deleteTicketHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Vérifier que le ticket existe
    const ticket = await getTicketById(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket non trouvé' });
    }

    // Vérifier les permissions : seul le créateur ou admin/manager peut supprimer
    if (!['admin', 'manager'].includes(req.user.role) && ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    await deleteTicket(id);

    res.status(200).json({ message: 'Ticket supprimé avec succès' });
  } catch (error: any) {
    console.error('Erreur lors de la suppression du ticket:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression du ticket',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
