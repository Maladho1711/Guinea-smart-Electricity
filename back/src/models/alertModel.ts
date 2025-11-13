import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'consommation' | 'facture' | 'panne' | 'maintenance' | 'paiement' | 'autre';
  title: string;
  message: string;
  priority: 'basse' | 'moyenne' | 'haute' | 'critique';
  status: 'active' | 'lue' | 'archivée';
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['consommation', 'facture', 'panne', 'maintenance', 'paiement', 'autre'],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ['basse', 'moyenne', 'haute', 'critique'],
      default: 'moyenne',
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'lue', 'archivée'],
      default: 'active',
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

// Index pour améliorer les performances
alertSchema.index({ userId: 1, status: 1 });
alertSchema.index({ userId: 1, createdAt: -1 });

const Alert = mongoose.model<IAlert>('Alert', alertSchema);

export default Alert;

// Fonctions utilitaires
export const createAlert = async (alertData: Omit<IAlert, '_id' | 'createdAt' | 'updatedAt'>): Promise<IAlert> => {
  const alert = new Alert(alertData);
  return await alert.save();
};

export const getAlertsByUserId = async (userId: string): Promise<IAlert[]> => {
  return await Alert.find({ userId }).sort({ createdAt: -1 });
};

export const getActiveAlertsByUserId = async (userId: string): Promise<IAlert[]> => {
  return await Alert.find({ userId, status: 'active' }).sort({ createdAt: -1 });
};

export const markAlertAsRead = async (alertId: string, userId: string): Promise<IAlert | null> => {
  return await Alert.findOneAndUpdate(
    { _id: alertId, userId },
    { status: 'lue', readAt: new Date() },
    { new: true }
  );
};

export const archiveAlert = async (alertId: string, userId: string): Promise<IAlert | null> => {
  return await Alert.findOneAndUpdate(
    { _id: alertId, userId },
    { status: 'archivée' },
    { new: true }
  );
};

export const deleteAlert = async (alertId: string, userId: string): Promise<void> => {
  await Alert.findOneAndDelete({ _id: alertId, userId });
};

