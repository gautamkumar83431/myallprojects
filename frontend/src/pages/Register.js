import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-gradient-to-br from-green-500 to-teal-500 p-8 rounded-2xl shadow-2xl max-w-2xl w-full transform hover:scale-105 transition-all duration-300 animate-slideUp">
        <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">📝 Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Password</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Phone</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-white font-semibold mb-2">Address</label>
            <textarea 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              required 
              rows="3"
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all outline-none resize-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-green-600 py-3 rounded-lg font-bold text-lg hover:scale-105 hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Registering...' : '🚀 Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
