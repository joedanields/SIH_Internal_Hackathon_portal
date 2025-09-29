import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './Layout.jsx';
import Landing from './pages/landing.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import JudgeDashboard from './pages/JudgeDashboard.jsx';
import ManageTeam from './pages/manageTeam.jsx';
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route
          path="/"
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route path="admindashboard" element={<AdminDashboard />} />
          <Route path="judgedashboard" element={<JudgeDashboard />} />
          <Route path="manageteam" element={<ManageTeam />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);