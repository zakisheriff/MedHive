import React from 'react';
import { Card } from '../../components/common/Card';

import { Clock, AlertOctagon, DollarSign, Archive } from 'lucide-react';

export const ExpiryView: React.FC = () => {

    const expiringBatches = [
        { id: 'BATCH-2023-001', product: 'Insulin Glargine', expiry: '12 Days', quantity: 450, value: '$12,500', risk: 'Critical' },
        { id: 'BATCH-2023-089', product: 'Amoxicillin Syp', expiry: '28 Days', quantity: 1200, value: '$3,200', risk: 'High' },
        { id: 'BATCH-2023-112', product: 'Vitamin C 500mg', expiry: '45 Days', quantity: 5000, value: '$1,500', risk: 'Medium' },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Expiry & Overstock Risk Management</h2>
            </div>

            <div className="grid grid-cols-3 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <Card className="border-l-4 border-l-green-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-full">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-muted">Loss Avoided (YTD)</div>
                            <div className="text-2xl font-bold text-gray-900">$145,000</div>
                        </div>
                    </div>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                            <Archive size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-muted">Stock Recovered</div>
                            <div className="text-2xl font-bold text-gray-900">24,500 Units</div>
                        </div>
                    </div>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-full">
                            <AlertOctagon size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-muted">High Risk Batches</div>
                            <div className="text-2xl font-bold text-gray-900">7</div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <Card title="Impending Expiry Timeline">
                    <div className="flex flex-col gap-4">
                        {expiringBatches.map(batch => (
                            <div key={batch.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold text-gray-900">{batch.product}</span>
                                    <span className="text-xs text-muted">Batch: {batch.id}</span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`font-bold ${batch.risk === 'Critical' ? 'text-red-600' : 'text-orange-500'}`}>
                                        Expires in {batch.expiry}
                                    </span>
                                    <span className="text-xs text-muted">Value: {batch.value}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600">Discount</button>
                                    <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300">Redistribute</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Optimization Suggestions" icon={Clock}>
                    <div className="flex flex-col gap-4">
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <h4 className="text-sm font-bold text-blue-800">Redistribute to Kandy</h4>
                            <p className="text-xs text-blue-600 mt-1">
                                Higher demand for Insulin Glargine detected in Kandy district. Move Batch-2023-001 by Friday.
                            </p>
                            <button className="mt-2 text-xs font-bold text-blue-700 underline">Approve Transfer</button>
                        </div>

                        <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                            <h4 className="text-sm font-bold text-yellow-800">Flash Sale Recommended</h4>
                            <p className="text-xs text-yellow-600 mt-1">
                                Amoxicillin Batch-2023-089 approaching 30-day window. Suggest 40% discount to clear stock.
                            </p>
                            <button className="mt-2 text-xs font-bold text-yellow-700 underline">Apply Discount</button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
