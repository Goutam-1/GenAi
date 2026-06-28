import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layout';
import Dashboard from './dashaboard';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
