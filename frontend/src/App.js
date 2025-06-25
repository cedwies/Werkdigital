import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Overview from './components/Overview';

function App() {
  // Token aus localStorage ziehen (einfaches Auth-Handling)
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {/* Login-Seite immer erreichbar */}
        <Route path="/login" element={<LoginForm />} />

        {/* Dashboard: nur mit Token, sonst zurück zum Login */}
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Übersicht: ebenfalls nur mit Token sichtbar */}
        <Route
          path="/overview"
          element={token ? <Overview /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
