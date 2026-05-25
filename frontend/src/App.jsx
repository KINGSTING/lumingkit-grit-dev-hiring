import React, { useState, useEffect } from 'react';

// Handle switching between local testing and the Docker Compose service name
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('publications');
  const [publications, setPublications] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all database relations on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [pubRes, authRes, editRes] = await Promise.all([
        fetch(`${API_BASE_URL}/publications/`),
        fetch(`${API_BASE_URL}/authors/`),
        fetch(`${API_BASE_URL}/publishers/`)
      ]);
      
      setPublications(await pubRes.json());
      setAuthors(await authRes.json());
      setPublishers(await editRes.json());
    } catch (err) {
      console.error("Error connecting to Django REST API channel:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (endpoint, id) => {
    if (!window.confirm("Are you sure you want to delete this data node?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${endpoint}/${id}/`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error("Delete operation failure execution:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        
        {/* Banner */}
        <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold tracking-tight">GRIT Hub Archive</h1>
            <p class="text-sm text-slate-400 mt-1">Decoupled React + Django REST Framework Architecture</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 bg-slate-100 flex gap-2 p-2">
          {['publications', 'authors', 'publishers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition ${
                activeTab === tab 
                  ? 'bg-white shadow text-slate-900' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Work Area */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-indigo-600 mb-2"></div>
              <p className="text-sm text-slate-500">Querying active Django models...</p>
            </div>
          ) : (
            <div>
              {/* Publications Data Window */}
              {activeTab === 'publications' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-sm font-semibold uppercase bg-slate-50">
                        <th className="p-3">Title</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Author</th>
                        <th className="p-3">Publisher</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Price</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100">
                      {publications.map((pub) => (
                        <tr key={pub.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-medium text-slate-900">{pub.title}</td>
                          <td className="p-3 text-slate-500">{pub.publication_type}</td>
                          <td className="p-3">
                            {pub.author_details ? `${pub.author_details.first_name} ${pub.author_details.last_name}` : 'Unknown'}
                          </td>
                          <td className="p-3 text-slate-600">
                            {pub.publisher_details ? pub.publisher_details.name : 'Unknown'}
                          </td>
                          <td className="p-3 text-slate-500">{pub.publication_date}</td>
                          <td className="p-3 font-mono text-emerald-700">₱{parseFloat(pub.price).toFixed(2)}</td>
                          <td className="p-3 text-right space-x-2">
                            <button onClick={() => handleDelete('publications', pub.id)} className="text-rose-600 hover:text-rose-900 font-medium">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Authors Data Window */}
              {activeTab === 'authors' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-sm font-semibold uppercase bg-slate-50">
                        <th className="p-3">ID</th>
                        <th className="p-3">First Name</th>
                        <th className="p-3">Last Name</th>
                        <th className="p-3">Short Bionote</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100">
                      {authors.map((auth) => (
                        <tr key={auth.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 text-slate-400 font-mono">{auth.id}</td>
                          <td className="p-3 font-medium">{auth.first_name}</td>
                          <td className="p-3 font-medium">{auth.last_name}</td>
                          <td className="p-3 text-slate-500 max-w-xs truncate">{auth.short_bionote || 'N/A'}</td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleDelete('authors', auth.id)} className="text-rose-600 hover:text-rose-900 font-medium">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Publishers Data Window */}
              {activeTab === 'publishers' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-sm font-semibold uppercase bg-slate-50">
                        <th className="p-3">ID</th>
                        <th className="p-3">Publisher Name</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100">
                      {publishers.map((pub) => (
                        <tr key={pub.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 text-slate-400 font-mono">{pub.id}</td>
                          <td className="p-3 font-medium">{pub.name}</td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleDelete('publishers', pub.id)} className="text-rose-600 hover:text-rose-900 font-medium">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}