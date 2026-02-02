import React from 'react';
import { Card } from '../../components/common/Card';

import { CloudRain, AlertTriangle, Info } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const ClimateView: React.FC = () => {

    const districts = [
        { name: 'Colombo', risk: 'High', temp: '32°C', rain: 'High' },
        { name: 'Gampaha', risk: 'High', temp: '31°C', rain: 'Med' },
        { name: 'Kalutara', risk: 'Medium', temp: '30°C', rain: 'Med' },
        { name: 'Kandy', risk: 'Medium', temp: '26°C', rain: 'Low' },
        { name: 'Galle', risk: 'Low', temp: '29°C', rain: 'Low' },
        { name: 'Jaffna', risk: 'High', temp: '34°C', rain: 'None' },
        { name: 'Trincomalee', risk: 'Medium', temp: '33°C', rain: 'Low' },
        { name: 'Anuradhapura', risk: 'Medium', temp: '33°C', rain: 'Low' },
        { name: 'Badulla', risk: 'Low', temp: '25°C', rain: 'High' },
        { name: 'Ratnapura', risk: 'High', temp: '28°C', rain: 'High' },
    ];

    const chartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
        datasets: [
            {
                label: 'Dengue Risk Factor',
                data: [20, 35, 45, 60, 85, 90, 75, 65],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Rainfall (mm)',
                data: [100, 150, 200, 250, 300, 150, 100, 80],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                yAxisID: 'y1',
                tension: 0.4,
                borderDash: [5, 5],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        stacked: false,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: false },
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                grid: { display: false },
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: { display: false },
            },
            x: {
                grid: { display: false },
            }
        },
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Climate & Geo-Based Forecasting</h2>
                    <p className="text-muted text-sm">Predicting disease outbreaks (2-Month Outlook)</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1rem' }}>
                <div className="flex flex-col gap-4">
                    <Card title="Disease Risk Forecast (Dengue Breakdown)">
                        <div style={{ padding: '0 0.5rem' }}>
                            <Line options={chartOptions} data={chartData} height={100} />
                        </div>
                    </Card>

                    {/* Heatmap Grid */}
                    <Card title="District Risk Heatmap">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
                            {districts.map(d => (
                                <div key={d.name} style={{
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    backgroundColor: d.risk === 'High' ? 'rgba(239, 68, 68, 0.1)' : d.risk === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                    border: `1px solid ${d.risk === 'High' ? 'rgba(239, 68, 68, 0.3)' : d.risk === 'Medium' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center'
                                }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{d.name}</span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{d.temp}</span>
                                    <div style={{ marginTop: '4px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.risk === 'High' ? 'var(--color-danger)' : d.risk === 'Medium' ? 'var(--color-warning)' : 'var(--color-success)' }} />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col gap-4">
                    <Card title="Active Alerts" icon={AlertTriangle}>
                        <div className="flex flex-col gap-3">
                            <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                                <div className="text-sm font-bold text-red-700 flex items-center gap-2">
                                    <AlertTriangle size={14} /> High Risk: Colombo
                                </div>
                                <p className="text-xs text-red-600 mt-1">
                                    Heavy rainfall predicted next week correlates with +40% Dengue risk.
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                                <div className="text-sm font-bold text-yellow-700 flex items-center gap-2">
                                    <Info size={14} /> Warning: Gampaha
                                </div>
                                <p className="text-xs text-yellow-600 mt-1">
                                    Rising humidity levels favoring viral spread.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card title="Weather Correlation" icon={CloudRain}>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted">Humidity Impact</span>
                                <span className="text-sm font-bold text-primary">+15% Risk</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-muted">Temp Impact</span>
                                <span className="text-sm font-bold text-primary">+5% Risk</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
