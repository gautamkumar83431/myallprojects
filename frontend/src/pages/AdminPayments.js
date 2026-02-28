import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await api.get('/payments/admin/all');
      setPayments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/payments/approve/${id}`);
      alert('Payment approved!');
      fetchPayments();
    } catch (error) {
      alert('Error approving payment');
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Reject this payment?')) {
      try {
        await api.put(`/payments/reject/${id}`);
        alert('Payment rejected!');
        fetchPayments();
      } catch (error) {
        alert('Error rejecting payment');
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    const icons = {
      pending: '⏳',
      completed: '✅',
      rejected: '❌'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${styles[status]}`}>
        {icons[status]} {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        💳 All Payment Details
      </h2>
      
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">User</th>
                <th className="px-6 py-4 text-left font-semibold">Phone</th>
                <th className="px-6 py-4 text-left font-semibold">Project</th>
                <th className="px-6 py-4 text-left font-semibold">Amount</th>
                <th className="px-6 py-4 text-left font-semibold">Method</th>
                <th className="px-6 py-4 text-left font-semibold">Transaction ID</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Screenshot</th>
                <th className="px-6 py-4 text-left font-semibold">Date</th>
                <th className="px-6 py-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment, idx) => (
                <tr 
                  key={payment._id} 
                  className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">{payment.userId?.name}</div>
                    <div className="text-sm text-gray-500">{payment.userId?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{payment.userId?.phone}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{payment.projectId?.title}</td>
                  <td className="px-6 py-4">
                    <span className="text-xl font-bold text-green-600">₹{payment.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{payment.stripePaymentId}</code>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                  <td className="px-6 py-4">
                    {payment.screenshot ? (
                      <a 
                        href={`https://myallprojects-4iwz.onrender.com/uploads/${payment.screenshot}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                      >
                        📷 View
                      </a>
                    ) : (
                      <span className="text-gray-400">No screenshot</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {payment.status === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApprove(payment._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 shadow-md"
                        >
                          ✅ Approve
                        </button>
                        <button 
                          onClick={() => handleReject(payment._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 shadow-md"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                    {payment.status === 'completed' && (
                      <span className="text-green-600 font-semibold">✓ Approved</span>
                    )}
                    {payment.status === 'rejected' && (
                      <span className="text-red-600 font-semibold">✗ Rejected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {payments.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💳</div>
            <p className="text-gray-500 text-xl">No payments yet</p>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all">
          <div className="text-4xl mb-2">⏳</div>
          <div className="text-3xl font-bold">{payments.filter(p => p.status === 'pending').length}</div>
          <div className="text-lg opacity-90">Pending</div>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-teal-500 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-3xl font-bold">{payments.filter(p => p.status === 'completed').length}</div>
          <div className="text-lg opacity-90">Approved</div>
        </div>
        <div className="bg-gradient-to-br from-red-400 to-pink-500 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all">
          <div className="text-4xl mb-2">❌</div>
          <div className="text-3xl font-bold">{payments.filter(p => p.status === 'rejected').length}</div>
          <div className="text-lg opacity-90">Rejected</div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
