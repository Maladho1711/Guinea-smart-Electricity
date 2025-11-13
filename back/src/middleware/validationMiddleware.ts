import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware pour gérer les erreurs de validation
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Erreurs de validation',
      details: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg,
      })),
    });
  }
  next();
};

// Validation pour l'inscription
export const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
    .trim(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
  body('role')
    .isIn(['citoyen', 'pme', 'technicien', 'manager', 'etat', 'admin'])
    .withMessage('Rôle invalide'),
  body('fullName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Le nom complet ne doit pas dépasser 100 caractères'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Le prénom ne doit pas dépasser 50 caractères'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Le nom ne doit pas dépasser 50 caractères'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('L\'adresse ne doit pas dépasser 200 caractères'),
  handleValidationErrors,
];

// Validation pour la connexion
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
  handleValidationErrors,
];

// Validation pour la mise à jour d'utilisateur
export const validateUpdateUser = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
    .trim(),
  body('fullName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Le nom complet ne doit pas dépasser 100 caractères'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Numéro de téléphone invalide'),
  handleValidationErrors,
];

