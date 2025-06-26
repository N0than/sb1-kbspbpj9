import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CampaignData } from '../types';

export class ExportUtils {
  static exportToCSV(data: CampaignData[], filename: string = 'sponsorama-export.csv') {
    const headers = [
      'Nom', 'Période', 'Cible', 'Nb BA', 'Nb BB', 'Nb Total',
      'GRP BA', 'GRP BB', 'GRP Total', 'Couverture', 'Répétition'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        `"${row.nom}"`,
        `"${row.periode}"`,
        `"${row.cible}"`,
        row.nbBA,
        row.nbBB,
        row.nbTotal,
        row.grpBA,
        row.grpBB,
        row.grpTotal,
        row.couverture,
        row.repetition
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  }

  static exportToExcel(data: CampaignData[], filename: string = 'sponsorama-export.xlsx') {
    const worksheet = XLSX.utils.json_to_sheet(data.map(row => ({
      'Nom': row.nom,
      'Période': row.periode,
      'Cible': row.cible,
      'Nb BA': row.nbBA,
      'Nb BB': row.nbBB,
      'Nb Total': row.nbTotal,
      'GRP BA': row.grpBA,
      'GRP BB': row.grpBB,
      'GRP Total': row.grpTotal,
      'Couverture': row.couverture,
      'Répétition': row.repetition
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Données Sponsorama');
    
    XLSX.writeFile(workbook, filename);
  }
}