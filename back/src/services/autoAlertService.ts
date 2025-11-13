import { createAlert } from '../models/alertModel';
import { analyzeConsumption, ConsumptionData } from './aiAnalysisService';

/**
 * Génère automatiquement une alerte si une anomalie est détectée
 */
export async function generateAutoAlert(
  userId: string,
  consumptionData: ConsumptionData
): Promise<void> {
  try {
    const analysis = await analyzeConsumption(consumptionData);

    // Générer une alerte uniquement si une anomalie critique ou haute est détectée
    if (analysis.hasAnomaly && (analysis.severity === 'critical' || analysis.severity === 'high')) {
      let title = '';
      let priority: 'basse' | 'moyenne' | 'haute' | 'critique' = 'moyenne';

      switch (analysis.anomalyType) {
        case 'surconsommation':
          title = `⚠️ Surconsommation détectée (+${analysis.percentageChange}%)`;
          priority = analysis.severity === 'critical' ? 'critique' : 'haute';
          break;
        case 'pic':
          title = '⚡ Pic de consommation détecté';
          priority = 'haute';
          break;
        default:
          title = '📊 Anomalie de consommation détectée';
          priority = 'moyenne';
      }

      const message = `${analysis.message}\n\n${analysis.recommendation}${
        analysis.estimatedSavings
          ? `\n\n💰 Économies potentielles : ${analysis.estimatedSavings.toLocaleString('fr-FR')} GNF/mois`
          : ''
      }`;

      await createAlert({
        userId: userId,
        type: 'consommation',
        title,
        message,
        priority,
        status: 'active',
      });

      console.log(`✅ Alerte automatique créée pour l'utilisateur ${userId}: ${title}`);
    }
  } catch (error) {
    console.error('Erreur lors de la génération automatique d\'alerte:', error);
    // Ne pas bloquer le processus si la génération d'alerte échoue
  }
}

