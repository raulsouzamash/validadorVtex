import { ValidationSummary } from '../types';
import { CheckCircle, AlertTriangle, AlertCircle, Package } from 'lucide-react';

interface DashboardProps {
    summary: ValidationSummary;
}

export function Dashboard({ summary }: DashboardProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                    <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Total SKUs</p>
                    <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Aprovados</p>
                    <p className="text-2xl font-bold text-green-600">{summary.valid}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-full">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Reprovados</p>
                    <p className="text-2xl font-bold text-red-600">{summary.invalid}</p>
                </div>
            </div>

            {/* Example Metric: Efficiency */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Taxa de Erro</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {summary.total > 0 ? ((summary.invalid / summary.total) * 100).toFixed(1) : 0}%
                    </p>
                </div>
            </div>
        </div>
    );
}
