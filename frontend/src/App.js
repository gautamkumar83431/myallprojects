import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import AddProject from './pages/AddProject';
import Payment from './pages/Payment';
import MyPurchases from './pages/MyPurchases';
import AdminPayments from './pages/AdminPayments';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ 
          id: payload.id,
          name: payload.name || 'User',
          isAdmin: payload.isAdmin, 
          role: payload.role 
        });
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const ProtectedRoute = ({ children, adminOnly }) => {
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
    return children;
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/payment/:projectId" element={
            <ProtectedRoute><Payment /></ProtectedRoute>
          } />
          <Route path="/my-purchases" element={
            <ProtectedRoute><MyPurchases /></ProtectedRoute>
          } />
          <Route path="/admin/add-project" element={
            <ProtectedRoute adminOnly><AddProject /></ProtectedRoute>
          } />
          <Route path="/admin/payments" element={
            <ProtectedRoute adminOnly><AdminPayments /></ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
