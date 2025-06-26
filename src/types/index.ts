export interface CampaignData {
  id: string;
  nom: string;
  periode: string;
  cible: string;
  nbBA: number;
  nbBB: number;
  nbTotal: number;
  grpBA: number;
  grpBB: number;
  grpTotal: number;
  couverture: number;
  repetition: number;
}

export interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
}

export interface ProcessingResult {
  success: boolean;
  data?: CampaignData[];
  error?: string;
  fileName?: string;
}

export interface FilterState {
  periode: string;
  cible: string;
  searchTerm: string;
}

export interface KPIData {
  totalCampaigns: number;
  avgGRP: number;
  avgCouverture: number;
  avgRepetition: number;
  totalNb: number;
}