import React, { useState } from 'react';
import { BarChart3, LineChart, Table, Upload, Database } from 'lucide-react';
import { KPICards } from './KPICards';
import { Charts } from './Charts';
import { DataTable } from './DataTable';
import { Filters } from './Filters';
import { FileUpload } from './FileUpload';
import { useData } from '../hooks/useData';

type Tab = 'upload' | 'overview' | 'charts' | 'table';

export const Dashboard: React.FC = () => {
  const { 
    data, 
    filteredData, 
    filters, 
    kpiData, 
    updateFilters, 
    resetFilters, 
    addData, 
    clearData 
  } = useData();
  
  const [activeTab, setActiveTab] = useState<Tab>('upload');

  const tabs = [
    { id: 'upload' as Tab, label: 'Import', icon: Upload },
    { id: 'overview' as Tab, label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'charts' as Tab, label: 'Graphiques', icon: LineChart },
    { id: 'table' as Tab, label: 'Tableau', icon: Table },
  ];

  const handleDataProcessed = (newData: any[]) => {
    addData(newData);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sponsorama</h1>
              <p className="text-gray-600 mt-1">Analyse des Performances Publicitaires</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className={`${activeTab === 'table' ? 'w-full' : 'max-w-7xl mx-auto'} px-4 sm:px-6 lg:px-8 py-8`}>
        {activeTab === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Importez vos données publicitaires
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Glissez-déposez vos fichiers Excel ou ZIP contenant les données de campagnes 
                publicitaires. L'application extraira automatiquement les informations depuis 
                les cellules appropriées.
              </p>
            </div>
            <FileUpload onDataProcessed={handleDataProcessed} />
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {data.length > 0 && (
              <Filters
                filters={filters}
                data={data}
                onFiltersChange={updateFilters}
                onReset={resetFilters}
              />
            )}
            <KPICards data={kpiData} />
            {filteredData.length === 0 && data.length > 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Aucune donnée ne correspond aux filtres sélectionnés
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="space-y-8">
            {data.length > 0 && (
              <Filters
                filters={filters}
                data={data}
                onFiltersChange={updateFilters}
                onReset={resetFilters}
              />
            )}
            <Charts data={filteredData} />
          </div>
        )}

        {activeTab === 'table' && (
          <div className="space-y-8">
            {data.length > 0 && (
              <Filters
                filters={filters}
                data={data}
                onFiltersChange={updateFilters}
                onReset={resetFilters}
              />
            )}
            <DataTable data={filteredData} />
          </div>
        )}
      </main>
    </div>
  );
};