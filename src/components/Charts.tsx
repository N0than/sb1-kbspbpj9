import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { CampaignData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartsProps {
  data: CampaignData[];
}

export const Charts: React.FC<ChartsProps> = ({ data }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const barData = {
    labels: data.map(d => d.nom.length > 15 ? d.nom.substring(0, 15) + '...' : d.nom),
    datasets: [
      {
        label: 'GRP Total',
        data: data.map(d => d.grpTotal),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const lineData = {
    labels: data.map(d => d.nom.length > 15 ? d.nom.substring(0, 15) + '...' : d.nom),
    datasets: [
      {
        label: 'Couverture (%)',
        data: data.map(d => d.couverture),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        tension: 0.4,
      },
      {
        label: 'Répétition',
        data: data.map(d => d.repetition),
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
        tension: 0.4,
      },
    ],
  };

  const cibleCounts = data.reduce((acc, campaign) => {
    acc[campaign.cible] = (acc[campaign.cible] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = {
    labels: Object.keys(cibleCounts),
    datasets: [
      {
        data: Object.values(cibleCounts),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucune donnée à afficher</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">GRP par Campagne</h3>
          <div className="h-80">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Cible</h3>
          <div className="h-80">
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Couverture & Répétition</h3>
        <div className="h-80">
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};