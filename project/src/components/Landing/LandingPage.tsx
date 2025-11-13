import { useState } from 'react';
import { Users, BarChart3, Smartphone, LogIn, UserPlus, CreditCard, Bell, MessageCircle, Building2, Wrench, Globe, HelpCircle, DollarSign, Bot, AlertTriangle, HeadphonesIcon, TrendingDown, Lock } from 'lucide-react';
import { MapPin, Mail, Phone, Link, ShieldCheck } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import logoImage from "../../assets/guineaSmart.jpg";
import heroImage from "../../../Asset/image.jpg";

interface LandingPageProps {
  onGetStarted: (isLogin: boolean) => void;
}

// Header Component
function LandingHeader({ onGetStarted }: { onGetStarted: (isLogin: boolean) => void }) {
  return (
    <header className="bg-white/80 text-gray-800 shadow-md sticky top-0 z-50 w-full rounded-b-lg">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 flex items-center justify-between gap-2">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logoImage}
            alt="Guinea Smart Electricity Logo"
            className="h-16 sm:h-20 object-contain"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <RouterLink
            to="/faq"
            className="text-green-600 hover:text-green-700 transition-all duration-200 p-2 rounded-full hover:bg-green-50 flex items-center justify-center group relative border-2 border-green-200 hover:border-green-400"
            title="Questions Fréquentes (FAQ)"
          >
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" strokeWidth={2.5} fill="currentColor" fillOpacity={0.1} />
          </RouterLink>
          <button
            onClick={() => onGetStarted(true)}
            className="px-2 sm:px-4 py-1 sm:py-2 border border-green-600 text-green-700 rounded-lg hover:bg-green-50 hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-xs sm:text-sm flex items-center gap-1"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Connexion</span>
          </button>
          <button
            onClick={() => onGetStarted(false)}
            className="px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-xs sm:text-sm flex items-center gap-1"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">S'inscrire</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | string | null>(null);

  const features = [
    { icon: DollarSign, title: 'Réduction de Vos Factures', description: 'Économies moyennes : 30%' },
    { icon: Bot, title: 'EVA : Votre Conseiller IA Personnel', description: '95% de satisfaction' },
    { icon: AlertTriangle, title: 'Détection Intelligente d\'Anomalies', description: 'Résolution 3x plus rapide' },
    { icon: HeadphonesIcon, title: 'Support Multicanal Unifié', description: 'Disponible 24h/24' },
    { icon: TrendingDown, title: 'Prédictions de Consommation', description: 'Précision de 92%' },
    { icon: Lock, title: 'Paiements Sécurisés Simplifiés', description: '100% sécurisé' },
  ];

  const testimonials = [
    { name: 'Mariama Diallo', role: 'Commerçante', location: 'Matam', content: 'Avant, j\'attendais des heures au guichet EDG. Avec EVA, je paie mes factures en 2 minutes depuis ma boutique. Le service client a vraiment changé !', image: '👩‍💼' },
    { name: 'Ibrahima Sow', role: 'Gérant PME', location: 'Kaloum', content: 'EVA a détecté une anomalie sur notre compteur qui nous coûtait 150 000 GNF par mois. L\'IA EDG m\'a fait économiser une fortune !', image: '👨‍💼' },
    { name: 'Aïssatou Bah', role: 'Enseignante', location: 'Ratoma', content: 'Je reçois mes alertes par SMS avant même d\'ouvrir l\'application. Plus de surprise sur les factures. EDG est devenu vraiment transparent !', image: '👩‍💼' },
    { name: 'Mamadou Kouyaté', role: 'Restaurateur', location: 'Dixinn', content: 'L\'IA prédit ma consommation avec une précision incroyable. Je planifie maintenant mon budget restaurant sans stress. Merci Guinea Smart !', image: '👨‍💼' },
    { name: 'Fatoumata Camara', role: 'Infirmière', location: 'Kipé', content: 'Payer avec Orange Money en quelques clics, parler à EVA la nuit quand j\'ai une question... EDG a enfin compris ses clients !', image: '👩‍💼' },
    { name: 'Moussa Sacko', role: 'Entrepreneur', location: 'Landréah', content: 'J\'ai signalé une panne via l\'app, le technicien EDG est arrivé en 2h avec tout l\'historique. Un service client digne du 21ème siècle !', image: '👨‍💼' },
  ];

  // Split features into two rows
  const topRow = features.slice(0, 3);
  const bottomRow = features.slice(3);

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader onGetStarted={onGetStarted} />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] max-h-[700px] flex items-center justify-center overflow-hidden -mt-1 mx-4 sm:mx-6 lg:mx-8 rounded-lg">
        <img
          src={heroImage}
          alt="Guinea Smart Electricity - Technologie et Innovation"
          className="absolute inset-0 w-full h-full object-cover filter blur-sm brightness-40 rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-green-900/30"></div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="mb-4 md:mb-5">
            <div className="flex items-center justify-center space-x-4 mb-2 md:mb-3">
              <img
                src={logoImage}
                alt="Guinea Smart Electricity Logo"
                className="h-16 md:h-24 object-contain drop-shadow-lg"
              />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
              L'IA qui révolutionne le service client EDG
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/90 mt-2">
              Guinea Smart Electricity : Votre relation avec EDG transformée par l'intelligence artificielle
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 md:gap-3 justify-center items-center mt-6 md:mt-8">
            <button
              onClick={() => onGetStarted(true)}
              className="px-4 md:px-6 py-2.5 md:py-3 bg-white text-gray-900 rounded-lg font-semibold text-sm md:text-base hover:shadow-lg hover:shadow-white/50 hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto animate-pulse hover:animate-none"
            >
              Espace client EDG (Citoyen / PME)
            </button>
            <button
              onClick={() => onGetStarted(true)}
              className="px-4 md:px-6 py-2.5 md:py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-sm md:text-base hover:bg-white/20 hover:scale-105 active:scale-95 hover:border-green-300 transition-all duration-300 w-full sm:w-auto hover:shadow-lg hover:shadow-white/30"
            >
              Espace EDG (Technicien / Manager)
            </button>
          </div>
        </div>
      </section>

      {/* Features Section with two scrolling rows */}
      <section className="py-16 px-6 bg-gradient-to-b from-green-50 via-white to-white overflow-hidden">
        <div className="max-w-6xl mx-auto text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            L'<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-600">Innovation EDG</span> au service de votre quotidien
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            Découvrez comment l'<span className="font-semibold text-green-700">intelligence artificielle</span> transforme votre expérience énergétique pour plus d'efficacité et d'économies.
          </p>
        </div>

        {/* Top Row */}
        <div className="relative overflow-hidden mb-8">
          <div className="flex gap-8 animate-scroll-left hover:animation-play-state-paused">
            {topRow.concat(topRow).map((feature, idx) => {
              const Icon = feature.icon;
              const isHovered = hoveredFeature === idx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredFeature(idx)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`min-w-[260px] p-6 rounded-xl border transition-all duration-300 
                    ${isHovered ? 'bg-gradient-to-br from-red-50 to-green-50 shadow-xl scale-105 border-transparent' : 'bg-white shadow-md border-gray-200 hover:shadow-lg'}`}
                >
                  <div className={`w-12 h-12 mb-4 flex items-center justify-center rounded-full transition-all duration-300
                    ${isHovered ? 'bg-gradient-to-r from-red-500 to-green-500 scale-110' : 'bg-gradient-to-r from-red-200 to-green-200'}`}>
                    <Icon className={`w-6 h-6 ${isHovered ? 'text-white' : 'text-gray-700'}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="relative overflow-hidden">
          <div className="flex gap-8 animate-scroll-right hover:animation-play-state-paused">
            {bottomRow.concat(bottomRow).map((feature, idx) => {
              const Icon = feature.icon;
              const isHovered = hoveredFeature === idx + 3;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredFeature(idx + 3)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`min-w-[260px] p-6 rounded-xl border transition-all duration-300 
                    ${isHovered ? 'bg-gradient-to-br from-red-50 to-green-50 shadow-xl scale-105 border-transparent' : 'bg-white shadow-md border-gray-200 hover:shadow-lg'}`}
                >
                  <div className={`w-12 h-12 mb-4 flex items-center justify-center rounded-full transition-all duration-300
                    ${isHovered ? 'bg-gradient-to-r from-red-500 to-green-500 scale-110' : 'bg-gradient-to-r from-red-200 to-green-200'}`}>
                    <Icon className={`w-6 h-6 ${isHovered ? 'text-white' : 'text-gray-700'}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Ce que nos utilisateurs disent</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Rejoignez des milliers de clients satisfaits qui font déjà confiance à GSE</p>
        </div>

        <div className="space-y-6 max-w-6xl mx-auto">
          {/* Première ligne : 3 témoignages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{t.image}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.name}</h4>
                    <p className="text-sm text-gray-600">{t.role} - {t.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{t.content}"</p>
              </div>
            ))}
          </div>

          {/* Deuxième ligne : 3 témoignages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(3, 6).map((t, idx) => (
              <div key={idx + 3} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{t.image}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.name}</h4>
                    <p className="text-sm text-gray-600">{t.role} - {t.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{t.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Comment <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-600">ça marche</span> ?
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Découvrez en 5 étapes simples comment GSE transforme votre gestion de l'électricité
            </p>
          </div>

          <div className="space-y-8">
            {/* Première ligne : 3 cartes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5">
              {[
                {
                  groupTitle: 'Pour les citoyens',
                  groupIcon: Users,
                  groupPoints: [
                    'Consultez et payez',
                    'Signalez des pannes',
                    'Discutez avec EVA notre assistant'
                  ],
                  color: 'red'
                },
                {
                  groupTitle: 'Pour les PME',
                  groupIcon: Building2,
                  groupPoints: [
                    'Gérez plusieurs compteurs professionnels',
                    'Analysez votre consommation avec l\'IA',
                    'Recevez des recommandations d\'économie'
                  ],
                  color: 'yellow'
                },
                {
                  groupTitle: 'Pour les Techniciens',
                  groupIcon: Wrench,
                  groupPoints: [
                    'Recevez des tickets géolocalisés',
                    'Optimisez vos trajets avec l\'IA',
                    'Historique complet de vos interventions'
                  ],
                  color: 'yellow'
                }
              ].map((item, idx) => {
                const GroupIcon = item.groupIcon;
                const isHovered = hoveredFeature === `step-${idx}`;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredFeature(`step-${idx}`)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    className="relative group"
                  >
                    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 ${idx === 0 ? 'border-red-500' :
                      idx === 1 ? 'border-yellow-500' :
                        'border-yellow-400'
                      } ${isHovered ? 'bg-gradient-to-br from-white to-gray-50 scale-[1.02] shadow-xl' : 'border-gray-100'
                      } p-5 h-full flex flex-col`}>
                      <div className="flex-1">
                        <div className="mb-2.5">
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${idx === 0 ? 'bg-red-100' :
                            idx === 1 ? 'bg-yellow-100' :
                              'bg-yellow-50'
                            }`}>
                            <GroupIcon className={`w-5 h-5 ${idx === 0 ? 'text-red-600' :
                              idx === 1 ? 'text-yellow-600' :
                                'text-yellow-500'
                              }`} />
                          </div>
                        </div>
                        <h3 className={`text-base font-bold mb-3 text-left ${idx === 0 ? 'text-red-600' :
                          idx === 1 ? 'text-yellow-600' :
                            'text-yellow-500'
                          }`}>
                          {item.groupTitle}
                        </h3>
                        <ul className="space-y-2.5 text-sm text-gray-700">
                          {item.groupPoints.map((point, pointIdx) => (
                            <li key={pointIdx} className="flex items-start gap-3">
                              <span className={`mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-red-500' :
                                idx === 1 ? 'bg-yellow-500' :
                                  'bg-yellow-400'
                                }`}></span>
                              <span className="leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Deuxième ligne : 2 cartes centrées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-5 max-w-4xl mx-auto">
              {[
                {
                  groupTitle: 'Pour les Managers',
                  groupIcon: BarChart3,
                  groupPoints: [
                    'Tableau de bord en temps réel',
                    'Suivez les performances des techniciens',
                    'Analysez la satisfaction client avec l\'IA'
                  ],
                  color: 'green'
                },
                {
                  groupTitle: 'Pour l\'État',
                  groupIcon: Globe,
                  groupPoints: [
                    'Vue nationale des performances EDG',
                    'Statistiques régionales en temps réel',
                    'Rapports prédictifs alimentés par l\'IA'
                  ],
                  color: 'green'
                }
              ].map((item, idx) => {
                const GroupIcon = item.groupIcon;
                const cardIdx = idx + 3;
                const isHovered = hoveredFeature === `step-${cardIdx}`;

                return (
                  <div
                    key={cardIdx}
                    onMouseEnter={() => setHoveredFeature(`step-${cardIdx}`)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    className="relative group"
                  >
                    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 ${cardIdx === 3 ? 'border-green-500' :
                      'border-green-600'
                      } ${isHovered ? 'bg-gradient-to-br from-white to-gray-50 scale-[1.02] shadow-xl' : 'border-gray-100'
                      } p-5 h-full flex flex-col`}>
                      <div className="flex-1">
                        <div className="mb-2.5">
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${cardIdx === 3 ? 'bg-green-100' :
                            'bg-green-100'
                            }`}>
                            <GroupIcon className={`w-5 h-5 ${cardIdx === 3 ? 'text-green-600' :
                              'text-green-700'
                              }`} />
                          </div>
                        </div>
                        <h3 className={`text-base font-bold mb-3 text-left ${cardIdx === 3 ? 'text-green-600' :
                          'text-green-700'
                          }`}>
                          {item.groupTitle}
                        </h3>
                        <ul className="space-y-2.5 text-sm text-gray-700">
                          {item.groupPoints.map((point, pointIdx) => (
                            <li key={pointIdx} className="flex items-start gap-3">
                              <span className={`mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${cardIdx === 3 ? 'bg-green-500' :
                                'bg-green-600'
                                }`}></span>
                              <span className="leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Titre et sous-titre */}
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Pourquoi choisir <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-600">Guinea Smart Electricity</span> ?
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              L'IA au service de votre expérience EDG
            </p>
          </div>

          {/* Cartes transparentes avec icône dans le titre */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-4">
            {[
              { title: 'Paiement Simplifié', icon: CreditCard, color: 'red', description: 'Sécurisé via Mobile Money' },
              { title: 'Alertes Intelligentes', icon: Bell, color: 'yellow', description: 'IA anticipe vos besoins' },
              { title: 'EVA Assistant IA', icon: MessageCircle, color: 'yellow', description: 'Support 24h/24' },
              { title: 'EDG Partout', icon: Smartphone, color: 'green', description: 'App, SMS, WhatsApp' }
            ].map((item, idx) => {
              const Icon = item.icon;
              const isHovered = hoveredFeature === `why-us-${idx}`;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredFeature(`why-us-${idx}`)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="relative group"
                >
                  <div className={`rounded-xl transition-all duration-300 border-l-4 border-gray-100 p-5 h-full flex flex-col
              ${item.color === 'red' ? 'border-red-500' :
                      item.color === 'yellow' ? 'border-yellow-500' :
                        'border-green-500'
                    } 
              ${isHovered ? 'bg-white/10 scale-[1.02] shadow-xl' : 'bg-transparent shadow-none'}`}
                  >
                    <div className="flex-1">
                      <h3 className={`text-base font-bold mb-2 flex items-center gap-2
                  ${item.color === 'red' ? 'text-red-600' :
                          item.color === 'yellow' ? 'text-yellow-600' :
                            'text-green-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-black px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Section 1 : Description */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-green-600" />
              Guinea Smart Electricity
            </h2>
            <p className="text-gray-700 text-sm">
              L'innovation IA au service de la relation client EDG en Guinée
            </p>
          </div>

          {/* Section 2 : Liens rapides */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Link className="w-5 h-5 text-green-600" />
              Liens rapides
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Link className="w-4 h-4 text-gray-600" />
                <a href="#" className="hover:text-green-600 transition-colors">Espace Citoyen</a>
              </li>
              <li className="flex items-center gap-2">
                <Link className="w-4 h-4 text-gray-600" />
                <a href="#" className="hover:text-green-600 transition-colors">Espace Manager</a>
              </li>
              <li className="flex items-center gap-2">
                <Link className="w-4 h-4 text-gray-600" />
                <a href="#" className="hover:text-green-600 transition-colors">Espace Technicien</a>
              </li>
              <li className="flex items-center gap-2">
                <Link className="w-4 h-4 text-gray-600" />
                <a href="#" className="hover:text-green-600 transition-colors">Support Client EDG</a>
              </li>
              <li className="flex items-center gap-2">
                <Link className="w-4 h-4 text-gray-600" />
                <a href="#" className="hover:text-green-600 transition-colors">FAQ</a>
              </li>
              <li className="flex items-center gap-2">
                <Link className="w-4 h-4 text-gray-600" />
                <a href="#" className="hover:text-green-600 transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Section 3 : Contact */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-600" />
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                Conakry, Guinée
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <a href="mailto:contact@guineasm.gn" className="hover:text-green-600 transition-colors">contact@guineasm.gn</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <a href="tel:+224XXXXXXXX" className="hover:text-green-600 transition-colors">+224 XX XXX XXXX</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <span>© 2025 Guinea Smart Electricity - Électricité Intelligente de Guinée</span>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-green-600 transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-green-600 transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-green-600 transition-colors">Mentions légales</a>
          </div>
        </div>
      </footer>


    </div>
  );
}
