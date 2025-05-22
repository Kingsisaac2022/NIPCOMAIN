import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';
import AuthGuard from './components/AuthGuard';
import LoginPage from './pages/LoginPage';

// Pages
import Dashboard from './pages/Dashboard';
import StationPage from './pages/StationPage';
import OffloadPage from './pages/OffloadPage';
import CEOPage from './pages/CEOPage';
import CreatePurchaseOrder from './pages/CreatePurchaseOrder';
import PurchaseOrderPage from './pages/PurchaseOrderPage';
import NotificationsPage from './pages/NotificationsPage';
import TankManagementPage from './pages/TankManagementPage';
import TankOffloadPage from './pages/TankOffloadPage';
import PriceUpdatePage from './pages/PriceUpdatePage';
import StaffPage from './pages/StaffPage';
import StationStaffPage from './pages/StationStaffPage';
import DispenserManagementPage from './pages/DispenserManagementPage';
import GuidelinesPage from './pages/GuidelinesPage';
import SalesUpdatePage from './pages/SalesUpdatePage';
import FinancialOverviewPage from './pages/FinancialOverviewPage';
import AIConfigPage from './pages/AIConfigPage';
import CreateTankPage from './pages/CreateTankPage';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route element={<AuthGuard />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/guidelines" element={<GuidelinesPage />} />
              <Route path="/station/:stationId" element={<StationPage />} />
              <Route path="/station/:stationId/offload" element={<OffloadPage />} />
              <Route path="/station/:stationId/tanks" element={<TankManagementPage />} />
              <Route path="/station/:stationId/tank-offload" element={<TankOffloadPage />} />
              <Route path="/station/:stationId/staff" element={<StationStaffPage />} />
              <Route path="/station/:stationId/sales" element={<SalesUpdatePage />} />
              <Route path="/ceo" element={<CEOPage />} />
              <Route path="/ceo/create-purchase-order" element={<CreatePurchaseOrder />} />
              <Route path="/ceo/purchase-order/:orderId" element={<PurchaseOrderPage />} />
              <Route path="/ceo/price-update" element={<PriceUpdatePage />} />
              <Route path="/ceo/staff" element={<StaffPage />} />
              <Route path="/ceo/dispensers" element={<DispenserManagementPage />} />
              <Route path="/ceo/finance" element={<FinancialOverviewPage />} />
              <Route path="/ceo/ai-config" element={<AIConfigPage />} />
              <Route path="/ceo/tanks/create" element={<CreateTankPage />} />
              <Route path="/notifications/:stationId" element={<NotificationsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;