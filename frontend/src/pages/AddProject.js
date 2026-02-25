import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AddProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    liveLink: '',
    price: ''
  });
  const [image, setImage] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('liveLink', formData.liveLink);
    data.append('price', formData.price);
    data.append('image', image);
    data.append('zipFile', zipFile);

    try {
      await api.post('/projects', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Project added successfully');
      navigate('/');
    } catch (error) {
      alert('Error adding project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 rounded-2xl shadow-2xl max-w-3xl w-full transform hover:scale-105 transition-all duration-300 animate-slideUp">
        <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">➕ Add New Project</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2">Project Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Enter project title"
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all outline-none"
              />
            </div>
            
            <div>
              <label className="block text-white font-semibold mb-2">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="Enter price"
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="4"
              placeholder="Enter project description"
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Live Demo Link</label>
            <input
              type="url"
              value={formData.liveLink}
              onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
              required
              placeholder="https://example.com"
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2">Project Image 📷</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImage(e.target.files[0])} 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:font-semibold hover:file:bg-indigo-700 file:cursor-pointer"
                />
              </div>
              <p className="text-white text-opacity-80 text-sm mt-2">Upload project screenshot</p>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Project ZIP File 📦</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".zip" 
                  onChange={(e) => setZipFile(e.target.files[0])} 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 border-2 border-white border-opacity-30 focus:border-white transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:font-semibold hover:file:bg-indigo-700 file:cursor-pointer"
                />
              </div>
              <p className="text-white text-opacity-80 text-sm mt-2">Upload source code ZIP</p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-indigo-600 py-4 rounded-lg font-bold text-lg hover:scale-105 hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Adding Project...' : '🚀 Add Project'}
          </button>
        </form>

        <div className="mt-6 bg-white bg-opacity-20 backdrop-blur-lg p-4 rounded-xl text-center text-white text-sm">
          💡 Make sure all files are properly formatted before uploading
        </div>
      </div>
    </div>
  );
};

export default AddProject;
