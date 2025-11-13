import { API_ENDPOINTS, apiRequest } from '../config/api';

export interface ConsumptionAnalysis {
  hasAnomaly: boolean;
  anomalyType?: 'surconsommation' | 'sous-consommation' | 'pic' | 'baisse';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendation: string;
  percentageChange: number;
  estimatedSavings?: number;
}

export interface InvoiceAnalysis {
  totalUnpaid: number;
  overdueCount: number;
  averageAmount: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  alert?: string;
}

/**
 * Analyser la consommation avec l'IA
 */
export async function analyzeConsumption(data: {
  currentMonth: number;
  previousMonth: number;
  averageConsumption?: number;
  peakHours?: number[];
  dailyConsumption?: number[];
}): Promise<ConsumptionAnalysis> {
  try {
    const response = await apiRequest(`${API_ENDPOINTS.analysis}/consumption`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Erreur lors de l\'analyse de consommation:', error);
    // Fallback : analyse basique
    const percentageChange = ((data.currentMonth - data.previousMonth) / data.previousMonth) * 100;
    return {
      hasAnomaly: Math.abs(percentageChange) > 20,
      severity: Math.abs(percentageChange) > 50 ? 'critical' : Math.abs(percentageChange) > 30 ? 'high' : 'medium',
      message: `Variation de ${Math.round(percentageChange)}% par rapport au mois dernier`,
      recommendation: 'Surveillez votre consommation et éteignez les appareils non utilisés.',
      percentageChange: Math.round(percentageChange),
    };
  }
}

/**
 * Analyser les factures avec l'IA
 */
export async function analyzeInvoices(invoices: any[]): Promise<InvoiceAnalysis> {
  try {
    const response = await apiRequest(`${API_ENDPOINTS.analysis}/invoices`, {
      method: 'POST',
      body: JSON.stringify({ invoices }),
    });
    return response;
  } catch (error) {
    console.error('Erreur lors de l\'analyse des factures:', error);
    // Fallback
    const unpaid = invoices.filter(inv => inv.status === 'impayee' || inv.status === 'en_retard');
    return {
      totalUnpaid: unpaid.reduce((sum, inv) => sum + inv.amount, 0),
      overdueCount: invoices.filter(inv => inv.status === 'en_retard').length,
      averageAmount: invoices.length > 0 ? invoices.reduce((sum, inv) => sum + inv.amount, 0) / invoices.length : 0,
      trend: 'stable',
    };
  }
}

/**
 * Générer un rapport d'analyse complet
 */
export async function generateAnalysisReport(data: {
  consumption: {
    currentMonth: number;
    previousMonth: number;
    averageConsumption?: number;
  };
  invoices: any[];
  alerts: any[];
}): Promise<string> {
  try {
    const response = await apiRequest(`${API_ENDPOINTS.analysis}/report`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.report;
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    return 'Rapport d\'analyse non disponible pour le moment.';
  }
}

