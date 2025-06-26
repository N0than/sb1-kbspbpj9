import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { FilterState, CampaignData } from '../types';

interface FiltersProps {
  filters: FilterState;
  data: CampaignData[];
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ 
  filters, 
  data, 
  onFiltersChange, 
  onReset 
}) => {
  const uniquePeriodes = Array.from(new Set(data.map(d => d.periode))).sort();
  const uniqueCibles = Array.from(new Set(data.map(d => d.cible))).sort();

  const hasActiveFilters = filters.periode || filters.cible || filters.searchTerm;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une campagne..."
              value={filters.searchTerm}
              onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {filters.searchTerm && (
              <button
                onClick={() => onFiltersChange({ searchTerm: '' })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filtre par période */}
          <div className="relative">
            <select
              value={filters.periode}
              onChange={(e) => onFiltersChange({ periode: e.target.value })}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les périodes</option>
              {uniquePeriodes.map(periode => (
                <option key={periode} value={periode}>
                  {periode}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par cible */}
          <div className="relative">
            <select
              value={filters.cible}
              onChange={(e) => onFiltersChange({ cible: e.target.value })}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les cibles</option>
              {uniqueCibles.map(cible => (
                <option key={cible} value={cible}>
                  {cible}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bouton de réinitialisation */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réinitialiser</span>
          </button>
        )}
      </div>
    </div>
  );
};