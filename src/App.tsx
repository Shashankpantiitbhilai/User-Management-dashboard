import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserDashboard } from './pages/UserDashboard';
import { UserProfile } from './pages/UserProfile';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserDashboard />} />
      <Route path="/users/:userId" element={<UserProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;