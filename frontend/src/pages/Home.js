import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Home = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePayment = (projectId) => {
    if (!user) {
      alert('Please login first to purchase');
      navigate('/login');
    } else {
      navigate(`/payment/${projectId}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        alert('Error deleting project');
      }
    }
  };

  const gradients = [
    'from-purple-500 to-pink-500',
    'from-pink-500 to-red-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-yellow-500 to-orange-500',
    'from-indigo-500 to-purple-700',
    'from-teal-400 to-blue-500',
    'from-pink-400 to-purple-500'
  ];

  return (
    <div className="flex-1">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-8 text-center rounded-xl mx-4 my-8 shadow-2xl animate-fadeInDown">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">🎯 Welcome to Project Store</h1>
        <p className="text-xl md:text-2xl opacity-90 animate-fadeInUp">Download Premium Quality Projects at Affordable Prices</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: '🚀', count: `${projects.length}+`, label: 'Projects Available' },
            { icon: '⚡', count: '100%', label: 'Secure Payment' },
            { icon: '💯', count: '24/7', label: 'Support Available' },
            { icon: '📦', count: 'Instant', label: 'Download Access' }
          ].map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${gradients[idx]} p-8 rounded-xl text-center shadow-lg transform hover:scale-110 transition-all duration-300 animate-pulse`}>
              <h3 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">{stat.icon} {stat.count}</h3>
              <p className="text-white font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">🔥 Featured Projects</h2>
        
        {projects.length === 0 ? (
          <div className="bg-white p-16 rounded-xl shadow-lg text-center">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-gray-600 text-xl mb-4">No projects available yet.</p>
            {user?.role === 'admin' && (
              <button onClick={() => navigate('/admin/add-project')} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                ➕ Add Your First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div key={project._id} className={`bg-gradient-to-br ${gradients[idx % gradients.length]} rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-3 hover:scale-105 transition-all duration-300 animate-fadeIn animate-float`}>
                <img src={`${process.env.REACT_APP_API_URL.replace('/api', '')}/uploads/${project.image}`} alt={project.title} className="w-full h-48 object-cover" />
                <div className="bg-white p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  <div className="text-3xl font-bold text-green-600 mb-4">₹{project.price}</div>
                  <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium hover:underline block mb-3">
                    <strong>🔗 View Live Demo →</strong>
                  </a>
                  {user?.role !== 'admin' && (
                    <button onClick={() => handlePayment(project._id)} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                      🛒 Purchase & Download
                    </button>
                  )}
                  {user?.role === 'admin' && (
                    <button onClick={() => handleDelete(project._id)} className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                      🗑️ Delete Project
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-12 rounded-xl mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">💡 Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '✅', title: 'Quality Code', desc: 'Clean & documented' },
              { icon: '🔒', title: 'Secure Payment', desc: 'UPI & QR supported' },
              { icon: '⚡', title: 'Instant Access', desc: 'Download immediately' },
              { icon: '💬', title: '24/7 Support', desc: 'Always here to help' }
            ].map((item, idx) => (
              <div key={idx} className="transform hover:scale-110 transition-transform">
                <div className="text-5xl mb-3">{item.icon}</div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
