import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { CampaignData, ProcessingResult } from '../types';

export class FileProcessor {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private static cleanValue(value: any): string | number {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') {
      const cleaned = value.trim().replace(/[^\w\s.-]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? cleaned : num;
    }
    return value;
  }

  private static extractDataFromWorkbook(workbook: XLSX.WorkBook, fileName: string): CampaignData | null {
    try {
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      // Extraction des données selon les cellules spécifiées
      const data: CampaignData = {
        id: this.generateId(),
        nom: fileName.replace(/\.(xlsx?|xls)$/i, ''),
        periode: this.cleanValue(sheet['B8']?.v) as string || '',
        cible: this.cleanValue(sheet['G6']?.v) as string || '',
        nbBA: Number(this.cleanValue(sheet['C8']?.v)) || 0,
        nbBB: Number(this.cleanValue(sheet['D8']?.v)) || 0,
        nbTotal: Number(this.cleanValue(sheet['E8']?.v)) || 0,
        grpBA: Number(this.cleanValue(sheet['G8']?.v)) || 0,
        grpBB: Number(this.cleanValue(sheet['H8']?.v)) || 0,
        grpTotal: Number(this.cleanValue(sheet['I8']?.v)) || 0,
        couverture: Number(this.cleanValue(sheet['J8']?.v)) || 0,
        repetition: Number(this.cleanValue(sheet['K8']?.v)) || 0,
      };

      // Validation des données essentielles
      if (!data.nom || data.grpTotal === 0) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de l\'extraction des données:', error);
      return null;
    }
  }

  static async processFile(file: File): Promise<ProcessingResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        return await this.processZipFile(arrayBuffer, file.name);
      } else {
        return await this.processExcelFile(arrayBuffer, file.name);
      }
    } catch (error) {
      return {
        success: false,
        error: `Erreur lors du traitement du fichier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }

  private static async processZipFile(arrayBuffer: ArrayBuffer, fileName: string): Promise<ProcessingResult> {
    try {
      const zip = new JSZip();
      const zipFile = await zip.loadAsync(arrayBuffer);
      const results: CampaignData[] = [];

      for (const [path, file] of Object.entries(zipFile.files)) {
        if (!file.dir && (path.endsWith('.xlsx') || path.endsWith('.xls'))) {
          try {
            const excelBuffer = await file.async('arraybuffer');
            const workbook = XLSX.read(excelBuffer, { type: 'buffer' });
            const data = this.extractDataFromWorkbook(workbook, path);
            
            if (data) {
              results.push(data);
            }
          } catch (error) {
            console.warn(`Impossible de traiter le fichier ${path}:`, error);
          }
        }
      }

      if (results.length === 0) {
        return {
          success: false,
          error: 'Aucun fichier Excel valide trouvé dans l\'archive ZIP'
        };
      }

      return {
        success: true,
        data: results,
        fileName
      };
    } catch (error) {
      return {
        success: false,
        error: `Erreur lors du traitement du fichier ZIP: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }

  private static async processExcelFile(arrayBuffer: ArrayBuffer, fileName: string): Promise<ProcessingResult> {
    try {
      const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
      const data = this.extractDataFromWorkbook(workbook, fileName);

      if (!data) {
        return {
          success: false,
          error: 'Impossible d\'extraire les données du fichier Excel'
        };
      }

      return {
        success: true,
        data: [data],
        fileName
      };
    } catch (error) {
      return {
        success: false,
        error: `Erreur lors du traitement du fichier Excel: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }
}