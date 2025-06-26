import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Download, Filter } from 'lucide-react';
import { CampaignData } from '../types';
import { ExportUtils } from '../utils/exportUtils';

interface DataTableProps {
  data: CampaignData[];
}

type SortConfig = {
  key: keyof CampaignData;
  direction: 'asc' | 'desc';
} | null;

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      
      if (sortConfig.direction === 'asc') {
        return aString < bString ? -1 : aString > bString ? 1 : 0;
      } else {
        return aString > bString ? -1 : aString < bString ? 1 : 0;
      }
    });
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key: keyof CampaignData) => {
    setSortConfig(prevConfig => {
      if (prevConfig?.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key: keyof CampaignData) => {
    if (sortConfig?.key !== key) {
      return <Filter className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-500" />
      : <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  const columns = [
    { key: 'nom' as keyof CampaignData, label: 'Nom' },
    { key: 'periode' as keyof CampaignData, label: 'Période' },
    { key: 'cible' as keyof CampaignData, label: 'Cible' },
    { key: 'nbTotal' as keyof CampaignData, label: 'Nb Total' },
    { key: 'grpTotal' as keyof CampaignData, label: 'GRP Total' },
    { key: 'couverture' as keyof CampaignData, label: 'Couverture' },
    { key: 'repetition' as keyof CampaignData, label: 'Répétition' },
  ];

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500 text-lg">Aucune donnée à afficher</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Données détaillées ({sortedData.length} campagnes)
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => ExportUtils.exportToCSV(sortedData)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => ExportUtils.exportToExcel(sortedData)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr 
                key={row.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.periode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.cible}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.nbTotal.toLocaleString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {row.grpTotal.toLocaleString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.couverture.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.repetition.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              Page {currentPage} sur {totalPages}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};