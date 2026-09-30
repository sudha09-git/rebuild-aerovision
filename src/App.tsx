import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { UserProfile } from './types';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import CommandCenter from './pages/CommandCenter';
import DisasterMap from './pages/DisasterMap';
import DebrisIntelligence from './pages/DebrisIntelligence';
import MaterialRecovery from './pages/MaterialRecovery';
import SalvagePassports from './pages/SalvagePassports';
import MaterialMatching from './pages/MaterialMatching';
import RecoveryOperations from './pages/RecoveryOperations';
import ImpactAnalytics from './pages/ImpactAnalytics';
import EmergencyClearance from './pages/EmergencyClearance';
import InspectionWorkflow from './pages/InspectionWorkflow';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);

  if (!user) {
    return <LandingPage onEnter={setUser} />;
  }

  return (
    <BrowserRouter>
      <AppLayout user={user} onLogout={() => setUser(null)}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<CommandCenter />} />
          <Route path="/map" element={<DisasterMap />} />
          <Route path="/debris" element={<DebrisIntelligence />} />
          <Route path="/recovery" element={<MaterialRecovery />} />
          <Route path="/passports" element={<SalvagePassports />} />
          <Route path="/matching" element={<MaterialMatching />} />
          <Route path="/operations" element={<RecoveryOperations />} />
          <Route path="/analytics" element={<ImpactAnalytics />} />
          <Route path="/clearance" element={<EmergencyClearance />} />
          <Route path="/inspection" element={<InspectionWorkflow />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
