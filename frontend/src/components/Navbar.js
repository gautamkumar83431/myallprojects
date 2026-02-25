import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 md:px-8 py-4 shadow-lg sticky top-0 z-50 flex flex-wrap justify-between items-center">
      <h1 
        onClick={() => handleNavigation('/')} 
        className="text-2xl md:text-3xl font-bold cursor-pointer"
      >
        🚀 Project Store
      </h1>
      
      <button 
        className="md:hidden bg-white bg-opacity-20 border-2 border-white border-opacity-30 px-4 py-2 rounded-lg text-2xl hover:bg-opacity-30 transition-all ml-auto"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>

      <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0 transition-all`}>
        {user ? (
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto items-center">
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-lg font-medium text-center w-full md:w-auto">
              👤 {user.name} ({user.role})
            </span>
            {user.role === 'admin' && (
              <>
                <button onClick={() => handleNavigation('/admin/add-project')} className="bg-white bg-opacity-20 border-2 border-white border-opacity-30 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all w-full md:w-auto">
                  ➕ Add Project
                </button>
                <button onClick={() => handleNavigation('/admin/payments')} className="bg-white bg-opacity-20 border-2 border-white border-opacity-30 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all w-full md:w-auto">
                  💳 Payments
                </button>
              </>
            )}
            {user.role === 'user' && (
              <button onClick={() => handleNavigation('/my-purchases')} className="bg-white bg-opacity-20 border-2 border-white border-opacity-30 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all w-full md:w-auto">
                📦 My Purchases
              </button>
            )}
            <button onClick={handleLogout} className="bg-white bg-opacity-20 border-2 border-white border-opacity-30 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all w-full md:w-auto">
              🚪 Logout
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => handleNavigation('/admin/login')} className="bg-white bg-opacity-20 border-2 border-white border-opacity-30 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all w-full md:w-auto">
              🔐 Admin
            </button>
            <button onClick={() => handleNavigation('/login')} className="bg-white bg-opacity-20 border-2 border-white border-opacity-30 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all w-full md:w-auto">
              👤 Login
            </button>
            <button onClick={() => handleNavigation('/register')} className="bg-white bg-opacity-20 border-2 border-white border-opacity-30 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all w-full md:w-auto">
              📝 Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
