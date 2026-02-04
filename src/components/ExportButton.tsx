import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';
import { ValidationError } from '../types';

interface ExportButtonProps {
    errors: ValidationError[];
}

export function ExportButton({ errors }: ExportButtonProps) {
    const handleExport = () => {
        if (errors.length === 0) return;

        // Flatten data for export
        const exportData = errors.map(err => {
            // Clone original data
            const rowData = { ...err.data };

            // Add specific validation columns usually requested:
            // "Motivo da Inativação" column detailing what needs to be fixed.
            rowData['Motivo da Inativação'] = err.errors.join('; ');
            rowData['Status Validação'] = err.status;

            return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Erros');

        // Auto-width columns slightly
        const wscols = [
            { wch: 15 }, // SKU
            { wch: 30 }, // Status
            { wch: 50 }, // Motivo
        ];
        worksheet['!cols'] = wscols;

        XLSX.writeFile(workbook, 'vtex-audit-errors.xlsx');
    };

    if (errors.length === 0) return null;

    return (
        <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
        >
            <Download className="w-4 h-4" />
            <span>Exportar Relatório de Erros</span>
        </button>
    );
}
