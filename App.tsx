
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CRMProvider } from './context/CRMContext';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsKanbanPage } from './pages/LeadsKanbanPage';
import { SettingsPage } from './pages/SettingsPage';
import { TasksPage } from './pages/TasksPage';
import { AutomationsPage } from './pages/AutomationsPage';
import { FormsPage } from './pages/FormsPage';
import { LandingPagesList } from './pages/LandingPagesList';
import { LandingPageBuilder } from './pages/LandingPageBuilder';
import { CalendarPage } from './pages/CalendarPage';

function App() {
  return (
    <CRMProvider>
      <HashRouter>
        <Routes>
          {/* Main Layout Routes */}
          <Route path="/" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/leads" element={<Layout><LeadsKanbanPage /></Layout>} />
          <Route path="/tasks" element={<Layout><TasksPage /></Layout>} />
          <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
          <Route path="/automations" element={<Layout><AutomationsPage /></Layout>} />
          <Route path="/forms" element={<Layout><FormsPage /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          
          {/* Landing Pages Routes */}
          <Route path="/landing-pages" element={<Layout><LandingPagesList /></Layout>} />
          
          {/* Full Screen Builder Route (No Layout) */}
          <Route path="/landing-pages/new" element={<LandingPageBuilder />} />
          <Route path="/landing-pages/edit/:id" element={<LandingPageBuilder />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </CRMProvider>
  );
}

export default App;
