import { useState } from 'react';
import { SettingsProvider } from '@/context/SettingsContext';
import { Sidebar, TopBar, navItems, type PageId } from '@/components/Navigation';
import { HomePage } from '@/pages/HomePage';
import { WireGaugePage } from '@/pages/WireGaugePage';
import { CTSelectorPage } from '@/pages/CTSelectorPage';
import { PriceEstimatorPage } from '@/pages/PriceEstimatorPage';
import { SavedCalculationsPage } from '@/pages/SavedCalculationsPage';
import { SettingsPage } from '@/pages/SettingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentNav = navItems.find((n) => n.id === currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'calculator':
        return <WireGaugePage />;
      case 'ct-selector':
        return <CTSelectorPage />;
      case 'price-estimator':
        return <PriceEstimatorPage />;
      case 'saved':
        return <SavedCalculationsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <SettingsProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onMenuClick={() => setSidebarOpen(true)} title={currentNav?.label ?? 'Home'} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              {renderPage()}
            </div>
          </main>
          <footer className="border-t border-slate-200 px-4 py-4 text-center sm:px-6">
            <p className="text-xs text-slate-400">
              Wire Gauge Predictor Pro — Engineering estimates based on IEC 60364 & BS 7671 standards. Verify with local codes before installation.
            </p>
          </footer>
        </div>
      </div>
    </SettingsProvider>
  );
}

export default App;
