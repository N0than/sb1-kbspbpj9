import React from 'react';
import { TrendingUp, Target, Users, BarChart3, Eye } from 'lucide-react';
import { KPIData } from '../types';

interface KPICardsProps {
  data: KPIData;
}

export const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  const kpis = [
    {
      label: 'Campagnes',
      value: data.totalCampaigns,
      icon: BarChart3,
      color: 'blue',
      suffix: ''
    },
    {
      label: 'GRP Moyen',
      value: data.avgGRP,
      icon: TrendingUp,
      color: 'green',
      suffix: ''
    },
    {
      label: 'Couverture Moy.',
      value: data.avgCouverture,
      icon: Eye,
      color: 'purple',
      suffix: '%'
    },
    {
      label: 'Répétition Moy.',
      value: data.avgRepetition,
      icon: Target,
      color: 'orange',
      suffix: ''
    },
    {
      label: 'Nb Total',
      value: data.totalNb,
      icon: Users,
      color: 'indigo',
      suffix: ''
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      green: 'bg-green-500 text-green-600 bg-green-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50',
      orange: 'bg-orange-500 text-orange-600 bg-orange-50',
      indigo: 'bg-indigo-500 text-indigo-600 bg-indigo-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {kpis.map((kpi, index) => {
        const colorClasses = getColorClasses(kpi.color).split(' ');
        const iconBg = colorClasses[0];
        const textColor = colorClasses[1];
        const cardBg = colorClasses[2];

        return (
          <div
            key={kpi.label}
            className={`${cardBg} p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {kpi.label}
                </p>
                <p className={`text-2xl font-bold ${textColor}`}>
                  {typeof kpi.value === 'number' ? 
                    (kpi.suffix === '%' || kpi.suffix === '' && kpi.label.includes('Moy.') ? 
                      kpi.value.toFixed(2) : 
                      kpi.value.toLocaleString('fr-FR')
                    ) : kpi.value}
                  {kpi.suffix}
                </p>
              </div>
              <div className={`p-3 ${iconBg} rounded-lg`}>
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};