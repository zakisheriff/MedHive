import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { TrendingUp, TrendingDown, ArrowRight, Eye } from 'lucide-react';

export const DiseaseTrendView: React.FC = () => {
    // Mock Data
    const trends = [
        { name: 'Dengue Fever', trend: 'up', growth: '+12%', confidence: 0.92, volume: 'High' },
        { name: 'Influenza A', trend: 'up', growth: '+8%', confidence: 0.85, volume: 'Medium' },
        { name: 'Respiratory', trend: 'down', growth: '-4%', confidence: 0.78, volume: 'High' },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">AI Disease Trend Intelligence</h2>
                    <p className="text-muted text-sm">Real-time analysis of anonymized prescription data</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="primary-button">Export Report</button>
                    {/* I need to define primary-button logic/style or use a Button component */}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {trends.map((t) => (
                    <Card key={t.name} title={t.name} icon={t.trend === 'up' ? TrendingUp : TrendingDown}>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-muted text-sm">Growth (WoW)</span>
                                <span style={{
                                    color: t.trend === 'up' ? 'var(--color-danger)' : 'var(--color-success)',
                                    fontWeight: 'bold',
                                    fontSize: '1.25rem'
                                }}>
                                    {t.growth}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-muted text-sm">Confidence</span>
                                <Badge variant={t.confidence > 0.9 ? 'success' : 'warning'}>
                                    {(t.confidence * 100).toFixed(0)}%
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted text-sm">Volume</span>
                                <span className="font-medium">{t.volume}</span>
                            </div>
                            <button style={{
                                marginTop: '1rem',
                                border: '1px solid var(--color-border)',
                                background: 'transparent',
                                padding: '6px',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                color: 'var(--color-primary-dark)'
                            }}>
                                <Eye size={14} /> View Evidence
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            <Card title="District-wise Breakdown" className="mt-4">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--color-bg-dark-secondary)', textAlign: 'left' }}>
                            <th className="p-4 text-muted font-medium">District</th>
                            <th className="p-4 text-muted font-medium">Top Disease</th>
                            <th className="p-4 text-muted font-medium">Prescription Vol</th>
                            <th className="p-4 text-muted font-medium">Risk Label</th>
                            <th className="p-4 text-muted font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { d: 'Colombo', dis: 'Dengue', vol: '12,403', risk: 'High' },
                            { d: 'Gampaha', dis: 'Influenza', vol: '8,211', risk: 'Medium' },
                            { d: 'Kandy', dis: 'Dengue', vol: '5,302', risk: 'High' },
                            { d: 'Galle', dis: 'Viral Fever', vol: '3,110', risk: 'Low' },
                        ].map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td className="p-4 font-medium">{row.d}</td>
                                <td className="p-4">{row.dis}</td>
                                <td className="p-4">{row.vol}</td>
                                <td className="p-4">
                                    <Badge variant={row.risk === 'High' ? 'danger' : row.risk === 'Medium' ? 'warning' : 'success'}>
                                        {row.risk}
                                    </Badge>
                                </td>
                                <td className="p-4">
                                    <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                                        Analyze <ArrowRight size={14} />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};
