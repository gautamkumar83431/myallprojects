import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Payment = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  const PAYMENT_DETAILS = {
    upiId: '9123202975@axl',  
    phoneNumber: '9123202975',  
    qrCodeImage: '/payment_qr.jpg'  
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get('/projects');
        const proj = data.find(p => p._id === projectId);
        setProject(proj);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId) {
      alert('Please enter transaction ID');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('projectId', projectId);
      formData.append('transactionId', transactionId);
      formData.append('paymentMethod', paymentMethod);
      if (screenshot) {
        formData.append('screenshot', screenshot);
      }

      await api.post('/payments/manual-confirm', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Payment submitted! Admin will verify and approve.');
      navigate('/my-purchases');
    } catch (error) {
      alert('Payment submission failed');
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-2xl max-w-2xl w-full transform hover:scale-105 transition-all duration-300 animate-slideUp">
        <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">💳 Complete Payment</h2>
        
        {project && (
          <div className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-xl mb-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
            <p className="text-4xl font-bold text-yellow-300">₹{project.price}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-white font-semibold mb-3">Select Payment Method</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all outline-none font-medium"
          >
            <option value="upi">UPI (PhonePe/GPay/Paytm)</option>
            <option value="qr">QR Code Scanner</option>
          </select>
        </div>

        {paymentMethod === 'upi' && (
          <div className="space-y-4 mb-6 animate-fadeIn">
            <div className="bg-green-100 p-6 rounded-xl">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Pay to this UPI ID:</h4>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  value={PAYMENT_DETAILS.upiId} 
                  readOnly 
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-green-500 font-bold text-lg"
                />
                <button 
                  type="button"
                  onClick={() => copyToClipboard(PAYMENT_DETAILS.upiId)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-gray-600">Or Phone: {PAYMENT_DETAILS.phoneNumber}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-xl">
              <p className="text-sm text-gray-800">
                <strong>📱 Steps:</strong><br/>
                1. Open PhonePe/GPay/Paytm<br/>
                2. Send ₹{project?.price} to above UPI ID<br/>
                3. Copy Transaction ID and paste below<br/>
                4. Upload payment screenshot
              </p>
            </div>
          </div>
        )}

        {paymentMethod === 'qr' && (
          <div className="space-y-4 mb-6 animate-fadeIn">
            <div className="bg-blue-100 p-6 rounded-xl text-center">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Scan QR Code to Pay</h4>
              <div className="w-64 h-64 mx-auto bg-white border-4 border-blue-500 rounded-xl overflow-hidden mb-4">
                <img 
                  src={PAYMENT_DETAILS.qrCodeImage} 
                  alt="Payment QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-2xl font-bold text-green-600">Amount: ₹{project?.price}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-xl">
              <p className="text-sm text-gray-800">
                <strong>📱 Steps:</strong><br/>
                1. Open any UPI app (PhonePe/GPay/Paytm)<br/>
                2. Scan above QR code<br/>
                3. Pay ₹{project?.price}<br/>
                4. Enter Transaction ID below
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">Transaction ID / UTR Number *</label>
            <input
              type="text"
              placeholder="Enter transaction ID from payment app"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Upload Payment Screenshot (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files[0])}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white transition-all outline-none"
            />
            <p className="text-sm text-white text-opacity-80 mt-2">
              Upload screenshot for faster verification
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-indigo-600 py-4 rounded-lg font-bold text-lg hover:scale-105 hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Submitting...' : '🚀 Submit Payment'}
          </button>
        </form>

        <div className="mt-6 bg-white bg-opacity-20 backdrop-blur-lg p-4 rounded-xl text-center text-white text-sm">
          🔒 Your payment will be verified by admin within 24 hours
        </div>
      </div>
    </div>
  );
};

export default Payment;
