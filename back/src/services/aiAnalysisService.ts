import { HfInference } from '@huggingface/inference';

// Initialiser Hugging Face
let hf: HfInference | null = null;

if (process.env.HUGGINGFACE_API_KEY) {
  hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
} else {
  hf = new HfInference();
}

export interface ConsumptionData {
  currentMonth: number;
  previousMonth: number;
  averageConsumption: number;
  peakHours?: number[];
  dailyConsumption?: number[];
}

interface AnalysisResult {
  hasAnomaly: boolean;
  anomalyType?: 'surconsommation' | 'sous-consommation' | 'pic' | 'baisse';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendation: string;
  percentageChange: number;
  estimatedSavings?: number;
}

/**
 * Analyse la consommation électrique avec l'IA
 */
export async function analyzeConsumption(data: ConsumptionData): Promise<AnalysisResult> {
  const percentageChange = ((data.currentMonth - data.previousMonth) / data.previousMonth) * 100;
  const hasSignificantChange = Math.abs(percentageChange) > 10;

  // Analyse basique
  let hasAnomaly = false;
  let anomalyType: 'surconsommation' | 'sous-consommation' | 'pic' | 'baisse' | undefined;
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let message = '';
  let recommendation = '';
  let estimatedSavings: number | undefined;

  // Détection de surconsommation
  if (percentageChange > 20) {
    hasAnomaly = true;
    anomalyType = 'surconsommation';
    severity = percentageChange > 50 ? 'critical' : percentageChange > 30 ? 'high' : 'medium';
    message = `⚠️ Surconsommation détectée : +${Math.round(percentageChange)}% par rapport au mois dernier`;
    recommendation = await generateRecommendation(data, 'surconsommation');
    estimatedSavings = Math.round((data.currentMonth - data.previousMonth) * 1000); // Estimation en GNF
  }
  // Détection de baisse significative
  else if (percentageChange < -15) {
    hasAnomaly = true;
    anomalyType = 'baisse';
    severity = 'low';
    message = `✅ Baisse de consommation : ${Math.round(Math.abs(percentageChange))}% par rapport au mois dernier`;
    recommendation = 'Excellent ! Vous avez réduit votre consommation. Continuez ainsi !';
  }
  // Consommation normale avec variation
  else if (hasSignificantChange) {
    if (percentageChange > 0) {
      message = `📊 Hausse modérée : +${Math.round(percentageChange)}% par rapport au mois dernier`;
      recommendation = await generateRecommendation(data, 'hausse_moderee');
    } else {
      message = `📉 Baisse modérée : ${Math.round(Math.abs(percentageChange))}% par rapport au mois dernier`;
      recommendation = 'Bonne nouvelle ! Votre consommation diminue.';
    }
  } else {
    message = `✅ Consommation stable : ${Math.round(percentageChange)}% de variation`;
    recommendation = 'Votre consommation est stable. Continuez à surveiller vos habitudes.';
  }

  // Détection de pics de consommation
  if (data.peakHours && data.peakHours.length > 0) {
    const peakHour = data.peakHours[0];
    if (peakHour >= 20 && peakHour <= 23) {
      recommendation += ' Évitez d\'utiliser plusieurs appareils énergivores en même temps le soir (20h-23h).';
    }
  }

  return {
    hasAnomaly,
    anomalyType,
    severity,
    message,
    recommendation,
    percentageChange: Math.round(percentageChange),
    estimatedSavings,
  };
}

/**
 * Génère une recommandation personnalisée avec l'IA
 */
async function generateRecommendation(
  data: ConsumptionData,
  type: 'surconsommation' | 'hausse_moderee'
): Promise<string> {
  try {
    if (!hf) {
      return getDefaultRecommendation(type);
    }

    const prompt = `En tant qu'expert en efficacité énergétique, donne 2-3 conseils pratiques et concis pour réduire la consommation électrique. 
    Contexte: Consommation actuelle ${data.currentMonth} kWh, mois précédent ${data.previousMonth} kWh.
    Réponds en français de manière claire et actionnable.`;

    const response = await hf.textGeneration({
      model: 'google/flan-t5-large',
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    let recommendation = response.generated_text?.trim() || '';
    
    // Nettoyer la réponse
    recommendation = recommendation
      .replace(/Contexte:.*$/gm, '')
      .replace(/^\d+\.\s*/gm, '')
      .trim();

    if (recommendation.length < 20) {
      return getDefaultRecommendation(type);
    }

    return recommendation;
  } catch (error) {
    console.error('Erreur lors de la génération de recommandation IA:', error);
    return getDefaultRecommendation(type);
  }
}

function getDefaultRecommendation(type: 'surconsommation' | 'hausse_moderee'): string {
  if (type === 'surconsommation') {
    return 'Éteignez les appareils non utilisés, utilisez des ampoules LED, et évitez d\'utiliser plusieurs appareils énergivores simultanément. Vérifiez aussi s\'il n\'y a pas de fuites électriques.';
  } else {
    return 'Surveillez votre consommation, éteignez les lumières et appareils inutilisés, et privilégiez les heures creuses pour les gros appareils.';
  }
}

/**
 * Analyse les factures et détecte les anomalies
 */
export async function analyzeInvoices(invoices: any[]): Promise<{
  totalUnpaid: number;
  overdueCount: number;
  averageAmount: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  alert?: string;
}> {
  if (!invoices || invoices.length === 0) {
    return {
      totalUnpaid: 0,
      overdueCount: 0,
      averageAmount: 0,
      trend: 'stable',
    };
  }
  const unpaid = invoices.filter(inv => inv.status === 'impayee' || inv.status === 'en_retard');
  const totalUnpaid = unpaid.reduce((sum, inv) => sum + inv.amount, 0);
  const overdueCount = invoices.filter(inv => inv.status === 'en_retard').length;
  const averageAmount = invoices.length > 0 
    ? invoices.reduce((sum, inv) => sum + inv.amount, 0) / invoices.length 
    : 0;

  // Analyser la tendance
  const recentInvoices = invoices.slice(0, 3);
  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  
  if (recentInvoices.length >= 2) {
    const amounts = recentInvoices.map(inv => inv.amount);
    const isIncreasing = amounts[0] > amounts[amounts.length - 1];
    const change = Math.abs(amounts[0] - amounts[amounts.length - 1]) / amounts[amounts.length - 1];
    
    if (change > 0.1) {
      trend = isIncreasing ? 'increasing' : 'decreasing';
    }
  }

  let alert: string | undefined;
  if (overdueCount > 0) {
    alert = `⚠️ Vous avez ${overdueCount} facture(s) en retard. Pensez à les régler rapidement pour éviter les coupures.`;
  } else if (totalUnpaid > 0) {
    alert = `💡 Vous avez ${unpaid.length} facture(s) en attente de paiement (${totalUnpaid.toLocaleString('fr-FR')} GNF).`;
  } else if (trend === 'increasing') {
    alert = `📈 Vos factures augmentent. Surveillez votre consommation pour réduire vos coûts.`;
  }

  return {
    totalUnpaid,
    overdueCount,
    averageAmount,
    trend,
    alert,
  };
}

/**
 * Génère un rapport d'analyse complet avec l'IA
 */
export async function generateAnalysisReport(userData: {
  consumption: ConsumptionData;
  invoices: any[];
  alerts: any[];
}): Promise<string> {
  try {
    const consumptionAnalysis = await analyzeConsumption(userData.consumption);
    const invoiceAnalysis = await analyzeInvoices(userData.invoices);

    if (!hf) {
      return await generateDefaultReport(userData);
    }

    const prompt = `En tant qu'assistant IA pour Guinea Smart Electricity, génère un rapport d'analyse personnalisé en français pour un client.
    
    Données:
    - Consommation: ${userData.consumption.currentMonth} kWh ce mois (${consumptionAnalysis.percentageChange}% de variation)
    - Factures impayées: ${invoiceAnalysis.totalUnpaid.toLocaleString('fr-FR')} GNF
    - Alertes actives: ${userData.alerts.length}
    
    Génère un rapport concis (3-4 phrases) avec:
    1. Un résumé de la situation
    2. Les points d'attention
    3. Des recommandations pratiques
    
    Sois encourageant et professionnel.`;

    const response = await hf.textGeneration({
      model: 'google/flan-t5-large',
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.8,
        return_full_text: false,
      },
    });

    let report = response.generated_text?.trim() || '';
    
    if (report.length < 50) {
      return await generateDefaultReport(userData);
    }

    return report;
  } catch (error) {
    console.error('Erreur lors de la génération du rapport IA:', error);
    return await generateDefaultReport(userData);
  }
}

async function generateDefaultReport(userData: {
  consumption: ConsumptionData;
  invoices: any[];
  alerts: any[];
}): Promise<string> {
  const consumptionAnalysis = await analyzeConsumption(userData.consumption);
  const invoiceAnalysis = await analyzeInvoices(userData.invoices);

  let report = `📊 Rapport d'analyse de votre consommation\n\n`;
  report += `${consumptionAnalysis.message}\n\n`;
  
  if (invoiceAnalysis.alert) {
    report += `${invoiceAnalysis.alert}\n\n`;
  }
  
  report += `💡 Recommandation: ${consumptionAnalysis.recommendation}`;

  return report;
}

