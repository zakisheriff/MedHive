import { useState } from 'react';
import { DashboardLayoutControlled } from './components/layout/DashboardLayout';
import { DashboardOverview } from './features/dashboard/DashboardOverview';
import { DiseaseTrendView } from './features/disease-trends/DiseaseTrendView';
import { ClimateView } from './features/climate/ClimateView';
import { ManufacturingView } from './features/manufacturing/ManufacturingView';
import { ExpiryView } from './features/expiry/ExpiryView';
import { WasteView } from './features/waste/WasteView';

export const DashboardApp = () => {
  const [activePage, setActivePage] = useState('overview');

  const renderContent = () => {
    switch (activePage) {
      case 'overview':
        return <DashboardOverview onNavigate={setActivePage} />;
      case 'disease':
        return <DiseaseTrendView />;
      case 'climate':
        return <ClimateView />;
      case 'manufacturing':
        return <ManufacturingView />;
      case 'expiry':
        return <ExpiryView />;
      case 'waste':
        return <WasteView />;
      case 'reports':
        return (
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold">Reports & Analytics</h1>
            <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center text-muted">
              Report Generation Module Placeholder
            </div>
          </div>
        );
      default:
        return <div>Page Not Found</div>;
    }
  };

  return (
    <DashboardLayoutControlled activePage={activePage} onNavigate={setActivePage}>
      {renderContent()}
    </DashboardLayoutControlled>
  );
};
