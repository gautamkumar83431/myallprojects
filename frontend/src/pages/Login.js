import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-2xl max-w-md w-full transform hover:scale-105 transition-all duration-300 animate-slideUp">
        <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">👤 User Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-2">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-indigo-600 py-3 rounded-lg font-bold text-lg hover:scale-105 hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Logging in...' : '🚀 Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
