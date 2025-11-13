import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/authMiddleware';
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from '../models/projectModel';

// Créer un projet (seuls manager ou admin)
export const createProjectHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, assignedTo, status, progress } = req.body;

    // Validation des champs requis
    if (!name || !description || !assignedTo) {
      return res.status(400).json({ error: 'Les champs name, description et assignedTo sont requis' });
    }

    // Validation du statut
    const validStatuses = ['en cours', 'terminé', 'suspendu'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    // Validation du progrès (0-100)
    const progressValue = progress !== undefined ? Number(progress) : 0;
    if (progressValue < 0 || progressValue > 100) {
      return res.status(400).json({ error: 'Le progrès doit être entre 0 et 100' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Créer le projet
    const project = await createProject({
      name,
      description,
      assignedTo: new mongoose.Types.ObjectId(assignedTo),
      status: status || 'en cours',
      progress: progressValue,
      createdBy: new mongoose.Types.ObjectId(req.user.id),
    } as any);

    // Populate les références
    await project.populate('assignedTo');
    await project.populate('createdBy');

    res.status(201).json({
      message: 'Projet créé avec succès',
      project,
    });
  } catch (error: any) {
    console.error('Erreur lors de la création du projet:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du projet',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Liste des projets
export const getProjects = async (_req: AuthRequest, res: Response) => {
  try {
    const projects = await getAllProjects();
    res.status(200).json({ projects });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des projets',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Voir un projet par ID
export const getProjectByIdHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await getProjectById(id);

    if (!project) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    res.status(200).json({ project });
  } catch (error: any) {
    console.error('Erreur lors de la récupération du projet:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du projet',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Modifier un projet (seuls manager ou admin)
export const updateProjectHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, assignedTo, status, progress } = req.body;

    // Vérifier que le projet existe
    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    // Validation du statut si fourni
    if (status) {
      const validStatuses = ['en cours', 'terminé', 'suspendu'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Statut invalide' });
      }
    }

    // Validation du progrès si fourni
    if (progress !== undefined) {
      const progressValue = Number(progress);
      if (progressValue < 0 || progressValue > 100) {
        return res.status(400).json({ error: 'Le progrès doit être entre 0 et 100' });
      }
    }

    // Préparer les données à mettre à jour
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (assignedTo) updateData.assignedTo = new mongoose.Types.ObjectId(assignedTo);
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = Number(progress);

    const project = await updateProject(id, updateData);

    if (!project) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    res.status(200).json({
      message: 'Projet mis à jour avec succès',
      project,
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du projet',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Supprimer un projet (seuls manager ou admin)
export const deleteProjectHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier que le projet existe
    const project = await getProjectById(id);
    if (!project) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    await deleteProject(id);

    res.status(200).json({ message: 'Projet supprimé avec succès' });
  } catch (error: any) {
    console.error('Erreur lors de la suppression du projet:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression du projet',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
