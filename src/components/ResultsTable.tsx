import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table';
import { ValidationError } from '../types';

interface ResultsTableProps {
    errors: ValidationError[];
}

const columnHelper = createColumnHelper<ValidationError>();

const columns = [
    columnHelper.accessor('sku', {
        header: 'SKU / Row',
        cell: info => <span className="font-mono font-medium text-gray-900">{info.getValue()}</span>,
        size: 150,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
            const status = info.getValue();
            const colors = {
                'Ativo com Erro': 'bg-yellow-100 text-yellow-800',
                'Erro Logística': 'bg-red-100 text-red-800',
                'Erro Imagem': 'bg-orange-100 text-orange-800',
                'Erro Cadastro': 'bg-gray-100 text-gray-800',
            };
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100'}`}>
                    {status}
                </span>
            );
        },
        size: 150,
    }),
    columnHelper.accessor('errors', {
        header: 'Erros Identificados',
        cell: info => (
            <ul className="list-disc list-inside text-xs text-red-600">
                {info.getValue().map((err, i) => (
                    <li key={i}>{err}</li>
                ))}
            </ul>
        ),
    }),
];

export function ResultsTable({ errors }: ResultsTableProps) {
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const table = useReactTable({
        data: errors,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const { rows } = table.getRowModel();

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 60, // Estimate row height
        overscan: 10,
    });

    if (errors.length === 0) {
        return null;
    }

    return (
        <div className="border rounded-md shadow-sm bg-white">
            <div className="p-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">
                    Detalhamento de Erros ({errors.length})
                </h3>
            </div>

            <div
                ref={tableContainerRef}
                className="h-[500px] overflow-auto"
            >
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                                        style={{ width: header.getSize() }}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map(virtualRow => {
                            const row = rows[virtualRow.index];
                            return (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50 transition-colors border-b last:border-0 absolute w-full flex items-center"
                                    style={{
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className="p-3 text-sm"
                                            style={{ width: cell.column.getSize(), display: 'block' }} // Added display block for flex row
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
