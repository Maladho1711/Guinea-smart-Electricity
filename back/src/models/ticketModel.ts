import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId; // Technicien
  status: 'ouvert' | 'en cours' | 'résolu';
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      required: true,
      enum: ['ouvert', 'en cours', 'résolu'],
      default: 'ouvert',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);

export default Ticket;

// Fonctions utilitaires
export const createTicket = async (ticketData: Omit<ITicket, '_id' | 'createdAt' | 'updatedAt'>): Promise<ITicket> => {
  const ticket = new Ticket(ticketData);
  return await ticket.save();
};

export const getTicketById = async (id: string): Promise<ITicket | null> => {
  return await Ticket.findById(id).populate('createdBy').populate('assignedTo');
};

export const getAllTickets = async (): Promise<ITicket[]> => {
  return await Ticket.find().populate('createdBy').populate('assignedTo').sort({ createdAt: -1 });
};

export const getTicketsByCreatedBy = async (userId: string): Promise<ITicket[]> => {
  return await Ticket.find({ createdBy: userId }).populate('assignedTo').sort({ createdAt: -1 });
};

export const getTicketsByAssignedTo = async (technicianId: string): Promise<ITicket[]> => {
  return await Ticket.find({ assignedTo: technicianId }).populate('createdBy').sort({ createdAt: -1 });
};

export const updateTicket = async (id: string, ticketData: Partial<ITicket>): Promise<ITicket | null> => {
  return await Ticket.findByIdAndUpdate(id, ticketData, { new: true }).populate('createdBy').populate('assignedTo');
};

export const deleteTicket = async (id: string): Promise<void> => {
  await Ticket.findByIdAndDelete(id);
};
