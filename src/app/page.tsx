'use client';

import { UploadZone } from '@/components/UploadZone';
import { Dashboard } from '@/components/Dashboard';
import { ResultsTable } from '@/components/ResultsTable';
import { ExportButton } from '@/components/ExportButton';
import { useVtexValidator } from '@/hooks/useVtexValidator';
import { AlertTriangle } from 'lucide-react';

export default function Home() {
  const { validateFile, isProcessing, result, error, reset } = useVtexValidator();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex justify-between items-center pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Auditor de Catálogo VTEX
            </h1>
            <p className="text-gray-500 mt-1">
              Valide SKUs, Logística e Imagens antes de importar.
            </p>
          </div>
          {result && (
            <div className="flex space-x-4">
              <button
                onClick={reset}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Nova Validação
              </button>
              <ExportButton errors={result.errors} />
            </div>
          )}
        </header>

        {/* Upload Section */}
        {!result && (
          <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-3" />
                {error}
              </div>
            )}
            <UploadZone onUpload={validateFile} isProcessing={isProcessing} />
          </section>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Dashboard summary={result} />
            <ResultsTable errors={result.errors} />
          </div>
        )}

      </div>
    </main>
  );
}
