import React from 'react';
import { Card } from '../../components/common/Card';

import { Activity, CloudRain, Factory, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

// Mock data integration
const quickStats = [
    { label: 'Active Disease Alerts', value: '3', color: 'text-danger', icon: Activity },
    { label: 'High Risk Districts', value: '5', color: 'text-warning', icon: CloudRain },
    { label: 'Production Utilization', value: '92%', color: 'text-success', icon: Factory },
    { label: 'Batches Expiring (30d)', value: '12', color: 'text-danger', icon: Clock },
];

export const DashboardOverview: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Executive Dashboard</h1>
                <p className="text-muted">Welcome back, Admin. Here is today's intelligence summary.</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {quickStats.map((stat, idx) => (
                    <Card key={idx} className="hover:shadow-md cursor-pointer">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-muted text-sm font-medium">{stat.label}</p>
                                <h3 className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</h3>
                            </div>
                            <div className={`p-2 rounded-full bg-gray-50 text-gray-400`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Split: Intelligence & Actions */}
            <div className="grid grid-cols-3 gap-6" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

                <div className="flex flex-col gap-6">
                    {/* Critical Intelligence Feed */}
                    <Card title="Critical Intelligence Feed" icon={AlertTriangle}>
                        <div className="flex flex-col gap-0">
                            <div className="p-4 border-b border-gray-50 flex items-start gap-3 hover:bg-gray-50 cursor-pointer" onClick={() => onNavigate('disease')}>
                                <div className="mt-1"><Activity size={16} className="text-danger" /></div>
                                <div>
                                    <h4 className="font-bold text-sm">Dengue Spike Detected in Colombo</h4>
                                    <p className="text-xs text-muted mt-1">Prescription volume rose by 12% in the last 48 hours. Strong correlation with recent rainfall.</p>
                                    <div className="mt-2 text-xs text-primary font-medium flex items-center gap-1">View Details <ArrowRight size={10} /></div>
                                </div>
                            </div>
                            <div className="p-4 border-b border-gray-50 flex items-start gap-3 hover:bg-gray-50 cursor-pointer" onClick={() => onNavigate('manufacturing')}>
                                <div className="mt-1"><Factory size={16} className="text-warning" /></div>
                                <div>
                                    <h4 className="font-bold text-sm">Paracetamol Shortage Predicted</h4>
                                    <p className="text-xs text-muted mt-1">Demand tracking indicates a deficit of 5,000 units by next Friday in Gampaha district.</p>
                                    <div className="mt-2 text-xs text-primary font-medium flex items-center gap-1">Plan Allocation <ArrowRight size={10} /></div>
                                </div>
                            </div>
                            <div className="p-4 flex items-start gap-3 hover:bg-gray-50 cursor-pointer" onClick={() => onNavigate('expiry')}>
                                <div className="mt-1"><Clock size={16} className="text-danger" /></div>
                                <div>
                                    <h4 className="font-bold text-sm">Batch #2201 expiring in 12 days</h4>
                                    <p className="text-xs text-muted mt-1">High-value Insulin stock at risk. Recommended action: 15% discount or redistribution.</p>
                                    <div className="mt-2 text-xs text-primary font-medium flex items-center gap-1">Take Action <ArrowRight size={10} /></div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Performance Chart Placeholder */}
                    <Card title="Overall System Health">
                        <div className="h-48 flex items-center justify-center bg-gray-50 text-muted text-sm">
                            [System Health Trends Chart Placeholder]
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col gap-6">
                    {/* KPI Sidebar */}
                    <Card title="Operational Efficiency">
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Manufacturing Targets</span>
                                    <span className="font-bold">94%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-green-500 h-1.5 rounded-full w-[94%]" /></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Distribution Speed</span>
                                    <span className="font-bold">88%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-blue-500 h-1.5 rounded-full w-[88%]" /></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Waste Reduction</span>
                                    <span className="font-bold">72%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-yellow-500 h-1.5 rounded-full w-[72%]" /></div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Quick Actions">
                        <div className="flex flex-col gap-2">
                            <button className="p-2 text-sm text-left hover:bg-gray-50 rounded text-primary font-medium border border-transparent hover:border-gray-100">
                                + Generate Forecast Report
                            </button>
                            <button className="p-2 text-sm text-left hover:bg-gray-50 rounded text-primary font-medium border border-transparent hover:border-gray-100">
                                + Approve Pending Transfers
                            </button>
                            <button className="p-2 text-sm text-left hover:bg-gray-50 rounded text-primary font-medium border border-transparent hover:border-gray-100">
                                + Schedule Waste Pickup
                            </button>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};
