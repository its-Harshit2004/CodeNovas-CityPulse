import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ErrorBoundary from './components/ErrorBoundary';
import { useCityData } from './hooks/useCityData';

import Dashboard from './pages/Dashboard';
import SignalPage from './pages/SignalPage';
import Analytics from './pages/Analytics';

export const DataContext = React.createContext(null);

function App() {
  const cityData = useCityData();

  return (
    <DataContext.Provider value={cityData}>
      <div className="flex h-screen w-screen overflow-hidden relative z-0">
        <ErrorBoundary>
          <Sidebar />
        </ErrorBoundary>
        <div className="flex flex-col flex-1 overflow-hidden relative">
          <ErrorBoundary>
            <TopBar />
          </ErrorBoundary>
          <main className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0 p-4 md:p-6 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/signals/:signalId" element={<SignalPage />} />
                {/* Legacy route aliases */}
                <Route path="/traffic" element={<Navigate to="/signals/traffic" replace />} />
                <Route path="/weather" element={<Navigate to="/signals/rainfall" replace />} />
                <Route path="/incidents" element={<Navigate to="/signals/incidents" replace />} />
                <Route path="/analytics" element={<ErrorBoundary><Analytics /></ErrorBoundary>} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </DataContext.Provider>
  );
}

export default App;
