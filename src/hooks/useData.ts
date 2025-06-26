import { useState, useCallback, useMemo } from 'react';
import { CampaignData, FilterState, KPIData } from '../types';

export const useData = (initialData: CampaignData[] = []) => {
  const [data, setData] = useState<CampaignData[]>(initialData);
  const [filters, setFilters] = useState<FilterState>({
    periode: '',
    cible: '',
    searchTerm: ''
  });

  const filteredData = useMemo(() => {
    return data.filter(campaign => {
      const matchesPeriode = !filters.periode || campaign.periode.toLowerCase().includes(filters.periode.toLowerCase());
      const matchesCible = !filters.cible || campaign.cible.toLowerCase().includes(filters.cible.toLowerCase());
      const matchesSearch = !filters.searchTerm || 
        campaign.nom.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        campaign.periode.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        campaign.cible.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      return matchesPeriode && matchesCible && matchesSearch;
    });
  }, [data, filters]);

  const kpiData = useMemo((): KPIData => {
    const filtered = filteredData;
    const count = filtered.length;
    
    if (count === 0) {
      return {
        totalCampaigns: 0,
        avgGRP: 0,
        avgCouverture: 0,
        avgRepetition: 0,
        totalNb: 0
      };
    }

    return {
      totalCampaigns: count,
      avgGRP: Math.round(filtered.reduce((sum, c) => sum + c.grpTotal, 0) / count),
      avgCouverture: Math.round(filtered.reduce((sum, c) => sum + c.couverture, 0) / count * 10) / 10,
      avgRepetition: Math.round(filtered.reduce((sum, c) => sum + c.repetition, 0) / count * 10) / 10,
      totalNb: filtered.reduce((sum, c) => sum + c.nbTotal, 0)
    };
  }, [filteredData]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      periode: '',
      cible: '',
      searchTerm: ''
    });
  }, []);

  const addData = useCallback((newData: CampaignData[]) => {
    setData(prev => [...prev, ...newData]);
  }, []);

  const clearData = useCallback(() => {
    setData([]);
  }, []);

  return {
    data,
    filteredData,
    filters,
    kpiData,
    updateFilters,
    resetFilters,
    addData,
    clearData
  };
};