import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Recycle, FileCheck, ShieldCheck, Download } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const WasteView: React.FC = () => {

    const wasteData = {
        labels: ['Hazardous (Incineration)', 'Non-Hazardous (Landfill)', 'Recyclable', 'Deep Burial'],
        datasets: [
            {
                data: [35, 25, 30, 10],
                backgroundColor: [
                    '#ef4444', // Red
                    '#6b7280', // Gray
                    '#10b981', // Green
                    '#8b5cf6', // Violet
                ],
                borderWidth: 0,
            },
        ],
    };

    const wasteOptions = {
        cutout: '70%',
        plugins: {
            legend: { position: 'bottom' as const },
        }
    };

    const complianceLogs = [
        { id: 'LOG-8821', type: 'Hazardous', volume: '120kg', method: 'Incineration', partner: 'EcoCycle Ltd', status: 'Cert. Received' },
        { id: 'LOG-8822', type: 'Recyclable', volume: '450kg', method: 'Recycling', partner: 'GreenEarth', status: 'Pending Cert.' },
        { id: 'LOG-8823', type: 'Non-Hazardous', volume: '200kg', method: 'Landfill', partner: 'City Waste', status: 'Completed' },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Medical Waste & Compliance Intelligence</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700">
                    <Download size={16} /> Export Audit Report (PDF)
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <Card title="Waste Classification Breakdown">
                    <div className="p-4 flex flex-col items-center">
                        <div style={{ height: '250px', width: '250px' }}>
                            <Doughnut data={wasteData} options={wasteOptions} />
                        </div>
                        <div className="mt-4 text-center">
                            <div className="text-2xl font-bold text-gray-800">1,240 kg</div>
                            <div className="text-sm text-muted">Total Waste Generated (This Month)</div>
                        </div>
                    </div>
                </Card>

                <div className="flex flex-col gap-4">
                    <Card title="Compliance Alert System" icon={ShieldCheck}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-green-700 font-bold">
                                    <FileCheck size={18} /> CEA Compliance
                                </div>
                                <div className="text-2xl font-bold text-green-800">100%</div>
                                <p className="text-xs text-green-600">All disposal records match Central Environmental Authority regulations.</p>
                            </div>
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-blue-700 font-bold">
                                    <Recycle size={18} /> Recycling Target
                                </div>
                                <div className="text-2xl font-bold text-blue-800">85%</div>
                                <p className="text-xs text-blue-600">On track to meet Q1 sustainability goals.</p>
                            </div>
                        </div>
                    </Card>

                    <Card title="Recent Disposal Logs">
                        <table style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left' }}>
                            <thead>
                                <tr className="border-b border-gray-100 text-muted">
                                    <th className="p-2">Log ID</th>
                                    <th className="p-2">Type</th>
                                    <th className="p-2">Volume</th>
                                    <th className="p-2">Partner</th>
                                    <th className="p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complianceLogs.map(log => (
                                    <tr key={log.id} className="border-b border-gray-50">
                                        <td className="p-2 font-medium">{log.id}</td>
                                        <td className="p-2">{log.type}</td>
                                        <td className="p-2">{log.volume}</td>
                                        <td className="p-2">{log.partner}</td>
                                        <td className="p-2">
                                            <Badge variant={log.status === 'Cert. Received' ? 'success' : log.status === 'Pending Cert.' ? 'warning' : 'neutral'}>
                                                {log.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </div>
        </div>
    );
};
