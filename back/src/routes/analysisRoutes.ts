import { Router, Response } from 'express';
import { analyzeConsumption, analyzeInvoices, generateAnalysisReport } from '../services/aiAnalysisService';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { apiRateLimiter } from '../middleware/securityMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(apiRateLimiter);

// Analyser la consommation
router.post('/consumption', async (req: AuthRequest, res: Response) => {
  try {
    const { currentMonth, previousMonth, averageConsumption, peakHours, dailyConsumption } = req.body;

    if (!currentMonth || !previousMonth) {
      return res.status(400).json({ error: 'currentMonth et previousMonth sont requis' });
    }

    const analysis = await analyzeConsumption({
      currentMonth,
      previousMonth,
      averageConsumption: averageConsumption || 0,
      peakHours,
      dailyConsumption,
    });

    res.status(200).json(analysis);
  } catch (error: any) {
    console.error('Erreur lors de l\'analyse de consommation:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'analyse',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Analyser les factures
router.post('/invoices', async (req: AuthRequest, res: Response) => {
  try {
    const { invoices } = req.body;

    if (!invoices || !Array.isArray(invoices)) {
      return res.status(400).json({ error: 'invoices (array) est requis' });
    }

    const analysis = await analyzeInvoices(invoices);

    res.status(200).json(analysis);
  } catch (error: any) {
    console.error('Erreur lors de l\'analyse des factures:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'analyse',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Générer un rapport complet
router.post('/report', async (req: AuthRequest, res: Response) => {
  try {
    const { consumption, invoices, alerts } = req.body;

    if (!consumption || !invoices) {
      return res.status(400).json({ error: 'consumption et invoices sont requis' });
    }

    const report = await generateAnalysisReport({
      consumption,
      invoices: invoices || [],
      alerts: alerts || [],
    });

    res.status(200).json({ report });
  } catch (error: any) {
    console.error('Erreur lors de la génération du rapport:', error);
    res.status(500).json({
      error: 'Erreur lors de la génération du rapport',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;

