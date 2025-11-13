import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  assignedTo: mongoose.Types.ObjectId;
  status: 'en cours' | 'terminé' | 'suspendu';
  progress: number; // 0-100
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['en cours', 'terminé', 'suspendu'],
      default: 'en cours',
    },
    progress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;

// Fonctions utilitaires
export const createProject = async (projectData: Omit<IProject, '_id' | 'createdAt' | 'updatedAt'>): Promise<IProject> => {
  const project = new Project(projectData);
  return await project.save();
};

export const getProjectById = async (id: string): Promise<IProject | null> => {
  return await Project.findById(id).populate('assignedTo').populate('createdBy');
};

export const getAllProjects = async (): Promise<IProject[]> => {
  return await Project.find().populate('assignedTo').populate('createdBy').sort({ createdAt: -1 });
};

export const getProjectsByAssignedTo = async (userId: string): Promise<IProject[]> => {
  return await Project.find({ assignedTo: userId }).populate('createdBy').sort({ createdAt: -1 });
};

export const updateProject = async (id: string, projectData: Partial<IProject>): Promise<IProject | null> => {
  return await Project.findByIdAndUpdate(id, projectData, { new: true }).populate('assignedTo').populate('createdBy');
};

export const deleteProject = async (id: string): Promise<void> => {
  await Project.findByIdAndDelete(id);
};
