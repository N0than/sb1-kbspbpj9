import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { FileProcessor } from '../utils/fileProcessor';
import { CampaignData } from '../types';

interface FileUploadProps {
  onDataProcessed: (data: CampaignData[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsProcessing(true);
    setUploadStatus({ type: null, message: '' });

    try {
      const allData: CampaignData[] = [];
      
      for (const file of acceptedFiles) {
        const result = await FileProcessor.processFile(file);
        
        if (result.success && result.data) {
          allData.push(...result.data);
        } else {
          console.error(`Erreur avec ${file.name}:`, result.error);
        }
      }

      if (allData.length > 0) {
        onDataProcessed(allData);
        setUploadStatus({
          type: 'success',
          message: `${allData.length} campagne(s) importée(s) avec succès`
        });
      } else {
        setUploadStatus({
          type: 'error',
          message: 'Aucune donnée valide trouvée dans les fichiers'
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: 'Erreur lors du traitement des fichiers'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onDataProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/zip': ['.zip']
    },
    disabled: isProcessing
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'cursor-not-allowed opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <Loader className="w-12 h-12 text-blue-500 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isProcessing ? 'Traitement en cours...' : 'Importez vos fichiers'}
            </h3>
            <p className="text-gray-600">
              {isDragActive 
                ? 'Déposez vos fichiers ici' 
                : 'Glissez-déposez vos fichiers Excel (.xlsx, .xls) ou ZIP ici, ou cliquez pour sélectionner'
              }
            </p>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>Excel</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>ZIP</span>
            </div>
          </div>
        </div>
      </div>

      {uploadStatus.type && (
        <div className={`
          mt-4 p-4 rounded-lg flex items-center space-x-3
          ${uploadStatus.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
          }
        `}>
          {uploadStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="font-medium">{uploadStatus.message}</p>
        </div>
      )}
    </div>
  );
};