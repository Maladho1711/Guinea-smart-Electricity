import nodemailer from 'nodemailer';

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

// Fonction générique pour envoyer un email
export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@guineasmart.gn',
      to,
      subject,
      text,
      html,
    });

    console.log('✅ Email envoyé:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

// Fonction pour envoyer une notification
export const sendNotification = async (to: string, subject: string, message: string) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Guinea Smart Electricity</h2>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #374151; line-height: 1.6;">${message}</p>
        </div>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          Ceci est un email automatique, merci de ne pas y répondre.
        </p>
      </div>
    `;

    return await sendEmail(to, subject, message, html);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    throw error;
  }
};

// Email de bienvenue
export const sendWelcomeEmail = async (email: string, name: string) => {
  const subject = 'Bienvenue sur Guinea Smart Electricity';
  const message = `
    <p>Bonjour ${name},</p>
    <p>Bienvenue sur Guinea Smart Electricity !</p>
    <p>Votre compte a été créé avec succès. Vous pouvez maintenant accéder à tous les services de la plateforme.</p>
    <p>Cordialement,<br>L'équipe Guinea Smart Electricity</p>
  `;
  return sendNotification(email, subject, message);
};

// Email de confirmation d'inscription
export const sendRegistrationConfirmation = async (email: string, name: string) => {
  const subject = 'Confirmation d\'inscription - Guinea Smart Electricity';
  const message = `
    <p>Bonjour ${name},</p>
    <p>Votre inscription sur Guinea Smart Electricity a été confirmée avec succès.</p>
    <p>Merci de nous faire confiance !</p>
  `;
  return sendNotification(email, subject, message);
};

// Email de réinitialisation de mot de passe
export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const subject = 'Réinitialisation de votre mot de passe';
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const message = `
    <p>Bonjour,</p>
    <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
    <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
    <p><a href="${resetUrl}" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Réinitialiser le mot de passe</a></p>
    <p>Ce lien est valide pendant 1 heure.</p>
    <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
  `;
  return sendNotification(email, subject, message);
};

// Email de notification d'assignation de projet
export const sendProjectAssignmentEmail = async (email: string, projectName: string) => {
  const subject = 'Nouveau projet assigné - Guinea Smart Electricity';
  const message = `
    <p>Bonjour,</p>
    <p>Un nouveau projet vous a été assigné : <strong>${projectName}</strong></p>
    <p>Connectez-vous à votre espace pour plus de détails.</p>
  `;
  return sendNotification(email, subject, message);
};

// Email de notification de ticket
export const sendTicketNotificationEmail = async (email: string, ticketTitle: string, status: string) => {
  const subject = `Mise à jour de votre ticket - ${ticketTitle}`;
  const message = `
    <p>Bonjour,</p>
    <p>Votre ticket "<strong>${ticketTitle}</strong>" a été mis à jour.</p>
    <p>Nouveau statut : <strong>${status}</strong></p>
    <p>Connectez-vous à votre espace pour plus de détails.</p>
  `;
  return sendNotification(email, subject, message);
};
