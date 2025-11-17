import { useState } from 'react';
import { X, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { DocumentCategory, UploadCategory } from '../types';
import { uploadDocument } from '../services/libraryService';

interface UploadDocumentModalProps {
  userId: string;
  organizationId: string;
  uploadCategory: UploadCategory;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadDocumentModal({
  userId,
  organizationId,
  uploadCategory,
  onClose,
  onSuccess,
}: UploadDocumentModalProps) {

  const mapUploadToStorageCategory = (upload: UploadCategory): DocumentCategory => {
    if (upload === 'PER') return 'Contrats';
    if (upload === 'Assurance Vie') return 'Prévoyance';
    return 'Prévoyance';
  };
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Seuls les fichiers PDF sont autorisés');
        setFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('La taille du fichier ne doit pas dépasser 10 MB');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== 'application/pdf') {
        setError('Seuls les fichiers PDF sont autorisés');
        return;
      }
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError('La taille du fichier ne doit pas dépasser 10 MB');
        return;
      }
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Le titre est obligatoire');
      return;
    }

    if (title.length < 3) {
      setError('Le titre doit contenir au moins 3 caractères');
      return;
    }

    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const storageCategory = mapUploadToStorageCategory(uploadCategory);
      await uploadDocument(file, title, storageCategory, userId, organizationId);
      clearInterval(progressInterval);
      setProgress(100);
      setSuccess(true);

      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: any) {
      clearInterval(progressInterval);
      setProgress(0);
      setError(err.message || 'Erreur lors du téléchargement');
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-2xl w-full border border-gray-200 relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-light text-gray-900">Ajouter un document</h3>
            <p className="text-sm text-gray-500 font-light mt-1">
              Téléchargez un document PDF vers la bibliothèque
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Catégorie
            </label>
            <div className="px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-2xl text-sm text-blue-700 font-light">
              {uploadCategory}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-light">
              Sera classé dans : {mapUploadToStorageCategory(uploadCategory)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Titre du document *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Guide complet PER 2024"
              disabled={uploading}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Fichier PDF *
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer relative"
            >
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500 font-light">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-light">
                    Cliquez ou glissez un fichier PDF ici
                  </p>
                  <p className="text-xs text-gray-500 font-light mt-1">
                    Maximum 10 MB
                  </p>
                </>
              )}
            </div>
          </div>

          {uploading && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600 font-light">Téléchargement en cours...</span>
                <span className="text-xs text-gray-600 font-light">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700 font-light">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700 font-light">Document téléchargé avec succès !</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-light hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={uploading || !file || !title.trim()}
              className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {uploading ? 'Téléchargement...' : 'Télécharger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
