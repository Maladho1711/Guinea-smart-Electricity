import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  // Informations personnelles
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  // Données spécifiques selon le rôle
  meterNumber?: string; // Pour citoyen
  companyName?: string; // Pour PME
  responsibleName?: string; // Pour PME
  matricule?: string; // Pour technicien
  department?: string; // Pour technicien/manager/état
  sector?: string; // Pour technicien
  interventionZone?: string; // Pour technicien
  ministry?: string; // Pour état
  created_at: Date;
  updated_at: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['citoyen', 'pme', 'technicien', 'manager', 'etat', 'admin'],
    },
    // Informations personnelles
    fullName: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    // Données spécifiques selon le rôle
    meterNumber: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    responsibleName: {
      type: String,
      trim: true,
    },
    matricule: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    sector: {
      type: String,
      trim: true,
    },
    interventionZone: {
      type: String,
      trim: true,
    },
    ministry: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Index composé pour permettre plusieurs comptes avec le même email mais des rôles différents
userSchema.index({ email: 1, role: 1 }, { unique: true });

const User = mongoose.model<IUser>('User', userSchema);

export default User;

// Fonctions utilitaires
export const createUser = async (userData: Omit<IUser, '_id' | 'created_at' | 'updated_at'>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

export const getUserByEmail = async (email: string, role?: string): Promise<IUser | null> => {
  if (role) {
    return await User.findOne({ email, role });
  }
  return await User.findOne({ email });
};

export const getUserByEmailAndRole = async (email: string, role: string): Promise<IUser | null> => {
  return await User.findOne({ email, role });
};

export const getUsersByEmail = async (email: string): Promise<IUser[]> => {
  return await User.find({ email });
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

export const updateUser = async (id: string, userData: Partial<IUser>): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(id, userData, { new: true });
};

export const deleteUser = async (id: string): Promise<void> => {
  await User.findByIdAndDelete(id);
};
