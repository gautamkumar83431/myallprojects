import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const MyPurchases = () => {
  const [allPayments, setAllPayments] = useState([]);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const { data } = await api.get('/payments/user/all');
      console.log('Fetched payments:', data);
      setAllPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      alert('Failed to load purchases');
    }
  };

  const handleDownload = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://myallprojects-4iwz.onrender.com/api/projects/download/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'project.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Download failed. Please contact admin.');
      }
    } catch (error) {
      alert('Download failed');
    }
  };

  const pending = allPayments.filter(p => p.status === 'pending');
  const rejected = allPayments.filter(p => p.status === 'rejected');
  const approved = allPayments.filter(p => p.status === 'completed');

  const gradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-yellow-500 to-orange-500',
    'from-indigo-500 to-purple-700',
    'from-pink-500 to-red-500'
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-8">📦 My Purchases</h2>
      
      {allPayments.length === 0 ? (
        <div className="bg-white p-16 rounded-xl shadow-lg text-center animate-fadeIn">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-600 text-xl">No purchases yet. Buy a project to see it here.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {pending.length > 0 && (
            <div className="animate-slideUp">
              <h3 className="text-2xl font-bold text-yellow-600 mb-6 flex items-center gap-2">
                ⏳ Pending Verification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pending.map((payment, idx) => (
                  <div key={payment._id} className={`bg-gradient-to-br ${gradients[idx % gradients.length]} rounded-xl overflow-hidden shadow-xl opacity-80 transform hover:scale-105 transition-all duration-300 animate-pulse`}>
                    <img 
                      src={`http://localhost:5000/uploads/${payment.projectId?.image}`} 
                      alt={payment.projectId?.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="bg-white p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{payment.projectId?.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{payment.projectId?.description}</p>
                      <div className="text-2xl font-bold text-green-600 mb-3">₹{payment.amount}</div>
                      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded">
                        <p className="text-yellow-700 font-semibold">⏳ Waiting for admin approval</p>
                        <p className="text-sm text-gray-600 mt-1">Submitted: {new Date(payment.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rejected.length > 0 && (
            <div className="animate-slideUp">
              <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
                ❌ Rejected Payments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rejected.map((payment, idx) => (
                  <div key={payment._id} className={`bg-gradient-to-br ${gradients[idx % gradients.length]} rounded-xl overflow-hidden shadow-xl opacity-70 border-4 border-red-500 transform hover:scale-105 transition-all duration-300`}>
                    <img 
                      src={`http://localhost:5000/uploads/${payment.projectId?.image}`} 
                      alt={payment.projectId?.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="bg-white p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{payment.projectId?.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{payment.projectId?.description}</p>
                      <div className="text-2xl font-bold text-green-600 mb-3">₹{payment.amount}</div>
                      <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded">
                        <p className="text-red-700 font-semibold">❌ Payment Rejected</p>
                        <p className="text-sm text-gray-600 mt-1">Contact admin for details</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {approved.length > 0 && (
            <div className="animate-slideUp">
              <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
                ✅ Approved & Ready to Download
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approved.map((purchase, idx) => (
                  <div key={purchase._id} className={`bg-gradient-to-br ${gradients[idx % gradients.length]} rounded-xl overflow-hidden shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fadeIn`}>
                    <img 
                      src={`http://localhost:5000/uploads/${purchase.projectId?.image}`} 
                      alt={purchase.projectId?.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="bg-white p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{purchase.projectId?.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{purchase.projectId?.description}</p>
                      <div className="text-2xl font-bold text-green-600 mb-3">₹{purchase.amount}</div>
                      <div className="bg-green-100 border-l-4 border-green-500 p-3 rounded mb-3">
                        <p className="text-green-700 font-semibold">✅ Approved</p>
                        <p className="text-sm text-gray-600 mt-1">Purchased: {new Date(purchase.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button 
                        onClick={() => handleDownload(purchase.projectId._id)}
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg"
                      >
                        📥 Download Project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
