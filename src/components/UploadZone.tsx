import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, X } from 'lucide-react';

interface UploadZoneProps {
    onUpload: (file: File, imageList: string) => void;
    isProcessing: boolean;
}

export function UploadZone({ onUpload, isProcessing }: UploadZoneProps) {
    const [file, setFile] = useState<File | null>(null);
    const [imageList, setImageList] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        multiple: false,
        disabled: isProcessing
    });

    const handleProcess = () => {
        if (file) {
            onUpload(file, imageList);
        }
    };

    return (
        <div className="space-y-6 w-full max-w-2xl mx-auto">
            {/* File Drop Zone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input {...getInputProps()} />
                {file ? (
                    <div className="flex flex-col items-center">
                        <FileSpreadsheet className="w-12 h-12 text-green-600 mb-2" />
                        <p className="text-sm font-medium text-gray-700">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                            }}
                            disabled={isProcessing}
                            className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                        >
                            Remover
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-base text-gray-600">Arraste sua planilha VTEX aqui (.xlsx)</p>
                        <p className="text-xs text-gray-400 mt-1">ou clique para selecionar</p>
                    </div>
                )}
            </div>

            {/* Image List Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lista de Imagens (JPG)
                </label>
                <textarea
                    className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Cole aqui a lista de nomes de arquivos (ex: 12345.jpg, 67890.jpg...)"
                    value={imageList}
                    onChange={(e) => setImageList(e.target.value)}
                    disabled={isProcessing}
                />
                <p className="text-xs text-gray-500 mt-1">
                    Separe por quebra de linha ou vírgula.
                </p>
            </div>

            {/* Action Button */}
            <button
                onClick={handleProcess}
                disabled={!file || isProcessing}
                className={`w-full py-3 px-4 rounded-md font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
          ${!file || isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}
        `}
            >
                {isProcessing ? 'Processando...' : 'Iniciar Auditoria'}
            </button>
        </div>
    );
}
