import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Factory, Truck, TrendingUp } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const ManufacturingView: React.FC = () => {

    const productionData = {
        labels: ['Paracetamol', 'Amoxicillin', 'Metformin', 'Omeprazole', 'Atorvastatin'],
        datasets: [
            {
                label: 'Current Demand Forecast (Units)',
                data: [15000, 12000, 9000, 8500, 6000],
                backgroundColor: '#dca349',
            },
            {
                label: 'Current Stock Level',
                data: [5000, 8000, 9500, 2000, 7000],
                backgroundColor: '#e5e7eb',
            },
        ],
    };

    const productionOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { display: false } }
        }
    };

    const allocation = [
        { district: 'Colombo', product: 'Paracetamol', demand: 'High', suggested: 5000, status: 'Allocated' },
        { district: 'Gampaha', product: 'Paracetamol', demand: 'High', suggested: 3500, status: 'Pending' },
        { district: 'Kandy', product: 'Amoxicillin', demand: 'Medium', suggested: 2000, status: 'Allocated' },
        { district: 'Galle', product: 'Omeprazole', demand: 'Critical', suggested: 4000, status: 'Urgent' },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Smart Manufacturing & Distribution</h2>
            </div>

            <div className="grid grid-cols-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                <Card>
                    <div className="flex flex-col gap-1">
                        <span className="text-muted text-sm">Total Production Value</span>
                        <span className="text-2xl font-bold text-primary">$1.2M</span>
                        <span className="text-xs text-success flex items-center gap-1"><TrendingUp size={12} /> +8.5% WoW</span>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col gap-1">
                        <span className="text-muted text-sm">Efficiency Rate</span>
                        <span className="text-2xl font-bold">94.2%</span>
                        <span className="text-xs text-muted">Target: 95%</span>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col gap-1">
                        <span className="text-muted text-sm">Active Batches</span>
                        <span className="text-2xl font-bold">24</span>
                        <span className="text-xs text-success">All on schedule</span>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col gap-1">
                        <span className="text-muted text-sm">Critical Shortages</span>
                        <span className="text-2xl font-bold text-danger">2</span>
                        <span className="text-xs text-danger">Immediate action required</span>
                    </div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <Card title="Production vs Demand Forecast" icon={Factory}>
                    <Bar options={productionOptions} data={productionData} height={200} />
                </Card>

                <Card title="Distribution Efficiency" icon={Truck}>
                    <div className="flex flex-col gap-4 h-full justify-center">
                        <div className="flex items-center justify-between">
                            <span>On-Time Delivery</span>
                            <span className="font-bold text-success">98%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span>Fleet Utilization</span>
                            <span className="font-bold text-warning">85%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span>Inventory Turnover</span>
                            <span className="font-bold text-primary">12x</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                    </div>
                </Card>
            </div>

            <Card title="District Allocation Planner" className="mt-2">
                <table style={{ width: '100%', fontSize: '0.9rem', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <th className="p-3 text-muted">District</th>
                            <th className="p-3 text-muted">Product</th>
                            <th className="p-3 text-muted">Demand Level</th>
                            <th className="p-3 text-muted">Suggested Allocation</th>
                            <th className="p-3 text-muted">Status</th>
                            <th className="p-3 text-muted">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allocation.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--color-bg-dark-secondary)' }}>
                                <td className="p-3 font-medium">{item.district}</td>
                                <td className="p-3">{item.product}</td>
                                <td className="p-3">
                                    <Badge variant={item.demand === 'Critical' ? 'danger' : item.demand === 'High' ? 'warning' : 'neutral'}>
                                        {item.demand}
                                    </Badge>
                                </td>
                                <td className="p-3 font-semibold">{item.suggested.toLocaleString()} Units</td>
                                <td className="p-3">
                                    <span style={{
                                        color: item.status === 'Urgent' ? 'var(--color-danger)' :
                                            item.status === 'Pending' ? 'var(--color-warning)' : 'var(--color-success)',
                                        fontWeight: 500
                                    }}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <button className="text-primary hover:underline text-sm font-medium">
                                        {item.status === 'Pending' || item.status === 'Urgent' ? 'Approve' : 'Modify'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};
