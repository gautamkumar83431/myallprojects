import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 px-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">Project Store</h3>
          <p className="text-gray-400 leading-relaxed">
            Premium quality projects at affordable prices. Download and customize for your needs.
          </p>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
            <li><a href="/login" className="text-gray-400 hover:text-white transition-colors">Login</a></li>
            <li><a href="/register" className="text-gray-400 hover:text-white transition-colors">Register</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
          <p className="text-gray-400 mb-2">📧 support@projectstore.com</p>
          <p className="text-gray-400 mb-2">📱 +91 9876543210</p>
          <p className="text-gray-400">📍 India</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Payment Methods</h4>
          <div className="flex flex-wrap gap-2">
            {['UPI', 'PhonePe', 'GPay', 'Paytm'].map(method => (
              <span key={method} className="bg-gray-700 px-4 py-2 rounded-lg text-sm">{method}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
        <p>© 2024 Project Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
