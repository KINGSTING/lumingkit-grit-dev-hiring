import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function App() {
  // ==============================================================
  // AUTHENTICATION STATE
  // ==============================================================
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access') || null);
  const [userRole, setUserRole] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // ==============================================================
  // DATA STATE
  // ==============================================================
  const [activeTab, setActiveTab] = useState('publications');
  const [publications, setPublications] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editDoi, setEditDoi] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedViewPub, setSelectedViewPub] = useState(null);
  const [selectedViewAuth, setSelectedViewAuth] = useState(null);
  const [selectedViewPubl, setSelectedViewPubl] = useState(null);
  const [authorInputValues, setAuthorInputValues] = useState(['']);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [pubForm, setPubForm] = useState({
    doi: '', title: '', publication_type: 'Journal Article', publication_date: '',
    price: '0.00', description: '', abstract: '', authors: [], publisher: '', pdf_url: ''
  });
  const [authForm, setAuthForm] = useState({ first_name: '', last_name: '', short_bionote: '', image_url: '' });
  const [publForm, setPublForm] = useState({ name: '', image_url: '' });
  const [pubErrors, setPubErrors] = useState({ title: '' });
  const [authErrors, setAuthErrors] = useState({ first_name: '', last_name: '' });
  const [publErrors, setPublErrors] = useState({ name: '' });

  // ==============================================================
  // HELPER: GET HEADERS WITH TOKEN
  // ==============================================================
  const getHeaders = (hasJson = true) => {
    const headers = {};
    if (hasJson) headers['Content-Type'] = 'application/json';
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    return headers;
  };

  // ==============================================================
  // DATA FETCHING (with token override for login)
  // ==============================================================
  const fetchAllData = async (page = currentPage, size = pageSize, tokenOverride = null) => {
    setLoading(true);
    try {
      let url = '';
      if (activeTab === 'publications') {
        url = `${API_BASE_URL}/publications/?page=${page}&page_size=${size}`;
      } else if (activeTab === 'authors') {
        url = `${API_BASE_URL}/authors/?page=${page}&page_size=${size}`;
      } else {
        url = `${API_BASE_URL}/publishers/?page=${page}&page_size=${size}`;
      }
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const headers = { 'Content-Type': 'application/json' };
      const effectiveToken = tokenOverride !== null ? tokenOverride : accessToken;
      if (effectiveToken) {
        headers['Authorization'] = `Bearer ${effectiveToken}`;
      }

      const res = await fetch(url, { headers });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('access');
          setAccessToken(null);
          setShowLoginModal(true);
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.detail || 'Fetch failed');
      }

      if (activeTab === 'publications') {
        setPublications(data.results);
        setTotalCount(data.count);
        setNextPage(data.next);
        setPreviousPage(data.previous);
      } else if (activeTab === 'authors') {
        setAuthors(data.results);
        setTotalCount(data.count);
        setNextPage(data.next);
        setPreviousPage(data.previous);
      } else {
        setPublishers(data.results);
        setTotalCount(data.count);
        setNextPage(data.next);
        setPreviousPage(data.previous);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData(currentPage, pageSize);
  }, [activeTab, currentPage, pageSize, searchQuery]);

  // ==============================================================
  // LOGIN / LOGOUT
  // ==============================================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('access', data.access);
        setAccessToken(data.access);
        try {
          const payload = JSON.parse(atob(data.access.split('.')[1]));
          setUserRole(payload.role || 'public');
        } catch (e) { console.warn(e); }
        setShowLoginModal(false);
        setLoginUsername('');
        setLoginPassword('');
        fetchAllData(currentPage, pageSize, data.access);
      } else {
        setLoginError(data.detail || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Network error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    setAccessToken(null);
    setUserRole(null);
    fetchAllData(currentPage, pageSize);
  };

  // ==============================================================
  // CLOUDINARY UPLOADS
  // ==============================================================
  const handleImageUpload = async (e, targetType) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target', targetType);
    try {
      const headers = accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
      const res = await fetch(`${API_BASE_URL}/upload/`, { method: 'POST', body: formData, headers });
      if (res.ok) {
        const data = await res.json();
        if (targetType === 'author') setAuthForm(prev => ({ ...prev, image_url: data.secure_url }));
        else if (targetType === 'publisher') setPublForm(prev => ({ ...prev, image_url: data.secure_url }));
      }
    } catch (err) { console.error('Upload failed:', err); }
    finally { setUploadingImage(false); }
  };

  const handlePublicationFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { alert('Only PDF files are allowed.'); return; }
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target', 'publication');
    try {
      const headers = accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
      const res = await fetch(`${API_BASE_URL}/upload/`, { method: 'POST', body: formData, headers });
      if (res.ok) {
        const data = await res.json();
        setPubForm(prev => ({ ...prev, pdf_url: data.secure_url }));
      }
    } catch (err) { console.error('Upload error:', err); }
    finally { setUploadingImage(false); }
  };

  // ==============================================================
  // DUPLICATE VALIDATION
  // ==============================================================
  const isAuthorDuplicate = (firstName, lastName, excludeId = null) =>
    authors.some(a => a.first_name.toLowerCase() === firstName.toLowerCase() && a.last_name.toLowerCase() === lastName.toLowerCase() && a.id !== excludeId);
  const isPublisherDuplicate = (name, excludeId = null) =>
    publishers.some(p => p.name.toLowerCase() === name.toLowerCase() && p.id !== excludeId);
  const isPublicationTitleDuplicate = (title, excludeId = null) =>
    publications.some(pub => pub.title.toLowerCase() === title.toLowerCase() && pub.id !== excludeId);
  const validateAuthorForm = (firstName, lastName) => {
    const errors = { first_name: '', last_name: '' };
    if (firstName && lastName && isAuthorDuplicate(firstName, lastName, editId)) errors.last_name = 'This author (first + last name) already exists.';
    setAuthErrors(errors);
    return !errors.first_name && !errors.last_name;
  };
  const validatePublisherForm = (name) => {
    const errors = { name: '' };
    if (name && isPublisherDuplicate(name, editId)) errors.name = 'A publisher with this name already exists.';
    setPublErrors(errors);
    return !errors.name;
  };
  const validatePublicationForm = (title) => {
    const errors = { title: '' };
    if (title && isPublicationTitleDuplicate(title, editId)) errors.title = 'A publication with this title already exists.';
    setPubErrors(errors);
    return !errors.title;
  };

  // ==============================================================
  // MODAL CONTROLS
  // ==============================================================
  const openModal = (type, existingRecord = null) => {
    if (!accessToken) { setShowLoginModal(true); return; }
    setModalType(type);
    setActiveDropdownIndex(null);
    setPubErrors({ title: '' });
    setAuthErrors({ first_name: '', last_name: '' });
    setPublErrors({ name: '' });
    if (existingRecord) {
      setEditId(existingRecord.id);
      setEditDoi(existingRecord.doi);
      if (type === 'publication') {
        const authorIds = existingRecord.author_details?.map(a => a.id) || [];
        const textValues = existingRecord.author_details?.map(a => `${a.first_name || ''} ${a.last_name || ''}`) || [];
        setPubForm({ ...existingRecord, authors: authorIds, publisher: existingRecord.publisher_details?.id || existingRecord.publisher, pdf_url: existingRecord.pdf_url || '', doi: existingRecord.doi || '' });
        setAuthorInputValues(textValues.length ? textValues : ['']);
      }
      if (type === 'author') setAuthForm({ ...existingRecord, image_url: existingRecord.image_url || '' });
      if (type === 'publisher') setPublForm({ ...existingRecord, image_url: existingRecord.image_url || '' });
    } else {
      setEditId(null);
      setEditDoi(null);
      setPubForm({ doi: '', title: '', publication_type: 'Journal Article', publication_date: '', price: '0.00', description: '', abstract: '', authors: [], publisher: publishers[0]?.id || '', pdf_url: '' });
      setAuthorInputValues(['']);
      setAuthForm({ first_name: '', last_name: '', short_bionote: '', image_url: '' });
      setPublForm({ name: '', image_url: '' });
    }
  };

  const handleFormSubmit = async (e, endpoint, payload) => {
    e.preventDefault();
    if (!accessToken) { setShowLoginModal(true); return; }
    if (endpoint === 'authors' && !validateAuthorForm(payload.first_name, payload.last_name)) return;
    if (endpoint === 'publishers' && !validatePublisherForm(payload.name)) return;
    if (endpoint === 'publications' && !validatePublicationForm(payload.title)) return;
    let cleanedPayload = { ...payload };
    if (endpoint === 'publications' && cleanedPayload.authors) {
      cleanedPayload.authors = cleanedPayload.authors.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    }
    const method = editId ? 'PUT' : 'POST';
    let url;
    if (endpoint === 'publications') {
      url = editId ? `${API_BASE_URL}/${endpoint}/${editDoi}/` : `${API_BASE_URL}/${endpoint}/`;
    } else {
      url = editId ? `${API_BASE_URL}/${endpoint}/${editId}/` : `${API_BASE_URL}/${endpoint}/`;
    }
    try {
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(cleanedPayload) });
      if (res.ok) {
        setModalType(null);
        setCurrentPage(1);
        fetchAllData(1, pageSize);
      } else {
        const errorData = await res.json();
        console.error('Backend error:', errorData);
      }
    } catch (err) { console.error('Submission failed:', err); }
  };

  const handleDelete = async (endpoint, id, doi = null) => {
    if (!accessToken) { setShowLoginModal(true); return; }
    if (!window.confirm('Delete this record permanently?')) return;
    try {
      let url;
      if (endpoint === 'publications' && doi) url = `${API_BASE_URL}/${endpoint}/${doi}/`;
      else url = `${API_BASE_URL}/${endpoint}/${id}/`;
      const res = await fetch(url, { method: 'DELETE', headers: getHeaders() });
      if (res.ok) fetchAllData(currentPage, pageSize);
    } catch (err) { console.error('Delete failed:', err); }
  };

  const handleTriggerRegistration = (typedText) => {
    const names = typedText.trim().split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';
    setModalType('author');
    setEditId(null);
    setAuthForm({ first_name: firstName, last_name: lastName, short_bionote: 'Please register author.', image_url: '' });
  };

  // ==============================================================
  // RENDER
  // ==============================================================
  const currentItems = activeTab === 'publications' ? publications : activeTab === 'authors' ? authors : publishers;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* ----- HEADER ----- */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-40 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="src/assets/grit-logo.png" alt="GRIT Logo" className="h-12 w-12 object-contain rounded-2xl shadow-lg border border-slate-700" onError={(e) => e.target.style.display = 'none'} />
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">GRIT Hub Archive</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Show creation buttons only for admin users */}
            {userRole === 'admin' && (
              <div className={`flex gap-2 transition-all duration-300 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`}>
                <button onClick={() => openModal('publication')} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-semibold">+ Publication</button>
                <button onClick={() => openModal('author')} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-semibold">+ Author</button>
                <button onClick={() => openModal('publisher')} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-semibold">+ Publisher</button>
              </div>
            )}
            <div className="relative flex items-center gap-3">
              {/* Hint text – only visible when menu is closed */}
              {!menuOpen && (
                <span className="hidden md:inline-flex items-center text-[11px] font-bold tracking-wide text-indigo-400 animate-pulse bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-2.5 py-1">
                  {accessToken && userRole === 'admin' 
                    ? 'Click menu to reveal utilities' 
                    : 'Login to Access Utilities'}
                  <span className="ml-1.5">🚀</span>
                </span>
              )}
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border text-slate-400 hover:text-white transition-all duration-200 focus:outline-none relative group ${
                  menuOpen ? 'border-indigo-500 text-white shadow-lg shadow-indigo-500/10' : 'border-slate-800 hover:border-slate-700'
                }`}
                aria-label="Toggle Actions Menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between transition-transform duration-300 ease-in-out">
                  <span className={`w-5 h-0.5 bg-current rounded transition-all duration-300 origin-left ${menuOpen ? 'rotate-45 translate-x-[3px] -translate-y-[1px]' : ''}`} />
                  <span className={`w-5 h-0.5 bg-current rounded transition-all duration-300 ${menuOpen ? 'opacity-0 scale-0' : 'opacity-100'}`} />
                  <span className={`w-5 h-0.5 bg-current rounded transition-all duration-300 origin-left ${menuOpen ? '-rotate-45 translate-x-[3px] translate-y-[1px]' : ''}`} />
                </div>
              </button>
            </div>
            {/* Login/Logout area */}
            {accessToken ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{userRole ? `Role: ${userRole}` : 'Authenticated'}</span>
                <button onClick={handleLogout} className="bg-rose-800 hover:bg-rose-700 px-3 py-1 rounded-lg text-xs font-semibold">Logout</button>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-xs font-semibold">Login</button>
            )}
          </div>
        </div>
      </header>

      {/* ----- MAIN CONTENT (unchanged) ----- */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10 space-y-8">
        {/* Stats cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between">
            <div><p className="text-xs uppercase text-slate-500">Total Publications</p><h3 className="text-3xl font-bold">{totalCount}</h3></div>
            <div className="text-indigo-400 text-2xl">📚</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between">
            <div><p className="text-xs uppercase text-slate-500">Registered Authors</p><h3 className="text-3xl font-bold">{authors.length}</h3></div>
            <div className="text-emerald-400 text-2xl">✍️</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between">
            <div><p className="text-xs uppercase text-slate-500">Publishing Entities</p><h3 className="text-3xl font-bold">{publishers.length}</h3></div>
            <div className="text-amber-400 text-2xl">🏢</div>
          </div>
        </section>

        {/* Search & tab bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="flex border border-slate-800 p-1 bg-slate-900 rounded-xl">
            {['publications', 'authors', 'publishers'].map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setSearchQuery(''); setCurrentPage(1); }} className={`px-5 py-2 text-xs font-semibold capitalize rounded-lg ${activeTab === tab ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>{tab}</button>
            ))}
          </div>
          <div className="relative flex-1 sm:max-w-md">
            <span className="absolute left-3 top-2 text-slate-500">🔍</span>
            <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder={`Search ${activeTab}...`} className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-10 py-2 text-sm" />
            {searchQuery && <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }} className="absolute right-3 top-2 text-slate-400">&times;</button>}
          </div>
        </div>

        {/* Data tables (unchanged) */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          {loading ? <div className="py-20 text-center">Loading...</div> : (
            <div className="p-2 overflow-x-auto">
              {activeTab === 'publications' && (
                <table className="w-full text-left">
                  <thead className="text-xs text-slate-400 border-b border-slate-800">
                    <tr><th className="p-4">Title</th><th>Type</th><th>Author(s)</th><th>Publisher</th><th>Price</th><th className="text-right">Actions</th></tr>
                  </thead>
                  <tbody>
                    {currentItems.map(pub => (
                      <tr key={pub.id} onClick={() => setSelectedViewPub(pub)} className="hover:bg-slate-900/60 cursor-pointer">
                        <td className="p-4 font-semibold">{pub.title}</td>
                        <td className="p-4"><span className="px-2 py-0.5 rounded-md text-xs bg-slate-800">{pub.publication_type}</span></td>
                        <td className="p-4">{pub.author_details?.[0]?.first_name} {pub.author_details?.[0]?.last_name}{pub.author_details?.length > 1 && <span className="text-xs ml-1">et al.</span>}</td>
                        <td className="p-4">{pub.publisher_details?.name || 'N/A'}</td>
                        <td className="p-4">{pub.price == 0 ? 'Free' : `₱${parseFloat(pub.price).toFixed(2)}`}</td>
                        <td className="p-4 text-right space-x-2" onClick={e => e.stopPropagation()}>
                          {accessToken && <button onClick={() => openModal('publication', pub)} className="text-indigo-400">Edit</button>}
                          {accessToken && <button onClick={() => handleDelete('publications', pub.id, pub.doi)} className="text-rose-400">Delete</button>}
                        </td>
                      </tr>
                    ))}
                    {currentItems.length === 0 && <tr><td colSpan="6" className="text-center py-12 text-xs text-slate-500">No publications found.er</td></tr>}
                  </tbody>
                </table>
              )}
              {activeTab === 'authors' && (
                <table className="w-full text-left">
                  <thead className="text-xs text-slate-400 border-b border-slate-800"><tr><th className="p-4">ID</th><th>Name</th><th>Bio</th><th className="text-right">Actions</th></tr></thead>
                  <tbody>
                    {currentItems.map(auth => (
                      <tr key={auth.id} onClick={() => setSelectedViewAuth(auth)} className="hover:bg-slate-900/60 cursor-pointer">
                        <td className="p-4 font-mono text-xs">#{auth.id}</td>
                        <td className="font-semibold">{auth.last_name}, {auth.first_name}</td>
                        <td className="max-w-sm truncate">{auth.short_bionote || '—'}</td>
                        <td className="p-4 text-right space-x-2" onClick={e => e.stopPropagation()}>
                          {accessToken && <button onClick={() => openModal('author', auth)} className="text-indigo-400">Edit</button>}
                          {accessToken && <button onClick={() => handleDelete('authors', auth.id)} className="text-rose-400">Delete</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'publishers' && (
                <table className="w-full text-left">
                  <thead className="text-xs text-slate-400 border-b border-slate-800"><tr><th className="p-4">ID</th><th>Name</th><th className="text-right">Actions</th></tr></thead>
                  <tbody>
                    {currentItems.map(publ => (
                      <tr key={publ.id} onClick={() => setSelectedViewPubl(publ)} className="hover:bg-slate-900/60 cursor-pointer">
                        <td className="p-4 font-mono text-xs">#{publ.id}</td>
                        <td className="font-semibold">{publ.name}</td>
                        <td className="p-4 text-right space-x-2" onClick={e => e.stopPropagation()}>
                          {accessToken && <button onClick={() => openModal('publisher', publ)} className="text-indigo-400">Edit</button>}
                          {accessToken && <button onClick={() => handleDelete('publishers', publ.id)} className="text-rose-400">Delete</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {!loading && totalCount > 0 && (
            <div className="flex justify-between items-center p-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Items per page:</span>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs">
                  <option value={5}>5</option><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
                </select>
                <span className="text-xs text-slate-400 ml-4">Showing {(currentPage-1)*pageSize+1} – {Math.min(currentPage*pageSize, totalCount)} of {totalCount}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={!previousPage} className="px-3 py-1 bg-slate-800 rounded-lg text-xs disabled:opacity-40">Previous</button>
                <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={!nextPage} className="px-3 py-1 bg-slate-800 rounded-lg text-xs disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ==============================================================
          DETAILED VIEW MODALS (unchanged)
         ============================================================== */}
      {/* Publication Detail Modal */}
      {selectedViewPub && (() => {
        const corporateInitials = (selectedViewPub.publisher_details?.name || 'P')
          .split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
        return (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl">
              <div className="px-6 py-5 border-b border-slate-800 flex justify-between">
                <div className="flex gap-4">
                  {selectedViewPub.publisher_details?.image_url ? (
                    <img src={selectedViewPub.publisher_details.image_url} className="h-16 w-24 rounded-xl object-cover" />
                  ) : (
                    <div className="h-16 w-24 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-black">{corporateInitials}</div>
                  )}
                  <div><span className="text-xs font-mono bg-indigo-500/10 px-2 py-0.5 rounded">{selectedViewPub.publication_type}</span><h3 className="text-xl font-bold mt-1">{selectedViewPub.title}</h3></div>
                </div>
                <button onClick={() => setSelectedViewPub(null)} className="text-slate-400 hover:text-white text-2xl">&times;</button>
              </div>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-auto">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/60">
                    <div className="text-xs font-bold text-slate-500">Authors ({selectedViewPub.author_details?.length || 0})</div>
                    {selectedViewPub.author_details?.map(a => <div key={a.id} className="mt-2 text-sm">✍️ {a.first_name} {a.last_name}</div>)}
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60">
                    <div className="text-xs font-bold text-slate-500">Publisher</div>
                    <div className="mt-2 text-sm">🏢 {selectedViewPub.publisher_details?.name}</div>
                    {selectedViewPub.pdf_url && (
                      <div className="mt-3 pt-2 border-t border-slate-700/50">
                        <a href={selectedViewPub.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">📄 Download PDF</a>
                      </div>
                    )}
                    <div className="mt-3 pt-2 border-t border-slate-700/50">
                      <div className="text-xs font-bold text-slate-500">DOI</div>
                      {selectedViewPub.doi ? (
                        <a href={`https://doi.org/${selectedViewPub.doi}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 underline break-all">{selectedViewPub.doi}</a>
                      ) : (
                        <span className="text-xs text-slate-500">Not assigned</span>
                      )}
                    </div>
                    <div className="mt-4 text-xs">📅 {selectedViewPub.publication_date} &nbsp;|&nbsp; 🆔 #{selectedViewPub.id}</div>
                  </div>
                </div>
                <div><div className="text-xs font-bold text-slate-500">Abstract</div><div className="mt-2 text-sm text-slate-300">{selectedViewPub.abstract || selectedViewPub.description || 'No description.'}</div></div>
              </div>
              <div className="px-6 py-4 border-t border-slate-800 flex justify-between">
                <div>Price: {selectedViewPub.price == 0 ? <span className="text-emerald-400">Free</span> : <span className="text-emerald-400">₱{parseFloat(selectedViewPub.price).toFixed(2)}</span>}</div>
                <button onClick={() => setSelectedViewPub(null)} className="px-5 py-2 bg-slate-800 rounded-xl text-xs">Close</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Author Detail Modal */}
      {selectedViewAuth && (() => {
        const authorPubs = publications.filter(p => p.author_details?.some(a => a.id === selectedViewAuth.id));
        return (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col">
              <div className="px-6 py-5 border-b border-slate-800 flex justify-between">
                <div className="flex gap-4">
                  {selectedViewAuth.image_url ? (
                    <img src={selectedViewAuth.image_url} className="h-16 w-16 rounded-2xl object-cover" />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                      {`${selectedViewAuth.first_name?.[0] || ''}${selectedViewAuth.last_name?.[0] || ''}`.toUpperCase()}
                    </div>
                  )}
                  <div><span className="text-xs bg-emerald-500/10 px-2 py-0.5 rounded">Scholar Profile</span><h3 className="text-xl font-bold">{selectedViewAuth.first_name} {selectedViewAuth.last_name}</h3></div>
                </div>
                <button onClick={() => setSelectedViewAuth(null)} className="text-slate-400 hover:text-white text-2xl">&times;</button>
              </div>
              <div className="p-6 space-y-6 overflow-auto flex-1">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 p-4 rounded-xl bg-slate-950/40"><div className="text-xs font-bold">Bio</div><p className="mt-1 italic">{selectedViewAuth.short_bionote || 'No bio provided.'}</p></div>
                  <div className="p-4 rounded-xl bg-slate-950/60 text-center"><div className="text-xs font-bold">Publications</div><div className="text-3xl font-extrabold text-indigo-400">{authorPubs.length}</div></div>
                </div>
                <div><div className="text-xs font-bold mb-2">List of Publications</div><div className="rounded-xl border border-slate-800 divide-y divide-slate-800">
                  {authorPubs.length ? authorPubs.map(p => (
                    <div key={p.id} onClick={() => { setSelectedViewPub(p); setSelectedViewAuth(null); }} className="p-3 hover:bg-slate-900/60 cursor-pointer">
                      <div className="font-semibold">📚 {p.title}</div>
                      <div className="text-xs text-slate-400">{p.publisher_details?.name} • {p.publication_date}</div>
                    </div>
                  )) : <div className="p-4 text-center text-slate-500">No publications.</div>}
                </div></div>
              </div>
              <div className="px-6 py-4 border-t border-slate-800 flex justify-between">
                <span className="text-xs text-slate-500">ID #{selectedViewAuth.id}</span>
                <button onClick={() => setSelectedViewAuth(null)} className="px-5 py-2 bg-slate-800 rounded-xl text-xs">Close</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Publisher Detail Modal */}
      {selectedViewPubl && (() => {
        const publisherPubs = publications.filter(p => p.publisher_details?.id === selectedViewPubl.id || p.publisher === selectedViewPubl.id);
        const initials = selectedViewPubl.name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
        return (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col">
              <div className="px-6 py-5 border-b border-slate-800 flex justify-between">
                <div className="flex gap-4">
                  {selectedViewPubl.image_url ? (
                    <img src={selectedViewPubl.image_url} className="h-16 w-24 rounded-xl object-cover" />
                  ) : (
                    <div className="h-16 w-24 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex flex-col items-center justify-center text-white font-black"><span className="text-[10px]">COVER</span>{initials}</div>
                  )}
                  <div><span className="text-xs bg-amber-500/10 px-2 py-0.5 rounded">Publishing House</span><h3 className="text-xl font-bold">{selectedViewPubl.name}</h3></div>
                </div>
                <button onClick={() => setSelectedViewPubl(null)} className="text-slate-400 hover:text-white text-2xl">&times;</button>
              </div>
              <div className="p-6 space-y-6 overflow-auto flex-1">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 p-4 rounded-xl bg-slate-950/40 space-y-3">
                    <p className="text-sm">Official registry for <span className="text-amber-400 font-semibold">{selectedViewPubl.name}</span> publications.</p>
                    <a href="#" className="text-xs text-indigo-400 underline">View institutional profile</a>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 text-center"><div className="text-xs font-bold">Tracked Releases</div><div className="text-3xl font-extrabold text-amber-400">{publisherPubs.length}</div></div>
                </div>
                <div><div className="text-xs font-bold mb-2">Published Titles</div><div className="rounded-xl border border-slate-800 divide-y divide-slate-800">
                  {publisherPubs.length ? publisherPubs.map(p => (
                    <div key={p.id} onClick={() => { setSelectedViewPub(p); setSelectedViewPubl(null); }} className="p-3 hover:bg-slate-900/60 cursor-pointer">
                      <div className="font-semibold">📄 {p.title}</div>
                      <div className="text-xs text-slate-400">{p.publication_date} • ₱{parseFloat(p.price).toFixed(2)}</div>
                    </div>
                  )) : <div className="p-4 text-center text-slate-500">No publications.</div>}
                </div></div>
              </div>
              <div className="px-6 py-4 border-t border-slate-800 flex justify-between">
                <span className="text-xs text-slate-500">ID #{selectedViewPubl.id}</span>
                <button onClick={() => setSelectedViewPubl(null)} className="px-5 py-2 bg-slate-800 rounded-xl text-xs">Close</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ==============================================================
          FORM MODALS (unchanged)
         ============================================================== */}
      {/* Publication Form Modal */}
      {modalType === 'publication' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between">
              <h3 className="font-bold">{editId ? 'Edit Publication' : 'New Publication'}</h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={(e) => handleFormSubmit(e, 'publications', pubForm)} className="flex-1 overflow-auto">
              <div className="p-6 space-y-4">
                <div><label className="block text-xs font-bold uppercase text-slate-400">DOI</label><input type="text" value={pubForm.doi || ''} onChange={(e) => setPubForm({...pubForm, doi: e.target.value})} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2" placeholder="10.1234/grit.2025.001" /></div>
                <div><label className="block text-xs font-bold uppercase text-slate-400">Title</label><input type="text" value={pubForm.title} onChange={(e) => { setPubForm({...pubForm, title: e.target.value}); validatePublicationForm(e.target.value); }} required className={`w-full bg-slate-950 border rounded-xl px-4 py-2 ${pubErrors.title ? 'border-red-500' : 'border-slate-800'}`} />
                {pubErrors.title && <p className="text-red-400 text-xs mt-1">{pubErrors.title}</p>}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold uppercase text-slate-400">Type</label><select value={pubForm.publication_type} onChange={e => setPubForm({...pubForm, publication_type: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2"><option>Book</option><option>Journal Article</option><option>Research Paper</option><option>Report</option></select></div>
                  <div><label className="block text-xs font-bold uppercase text-slate-400">Date</label><input type="date" value={pubForm.publication_date} onChange={e => setPubForm({...pubForm, publication_date: e.target.value})} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2" /></div>
                </div>
                <div><label className="block text-xs font-bold uppercase text-slate-400">PDF Document</label><div className="relative h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center px-3"><input type="file" accept="application/pdf" onChange={handlePublicationFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" /><span className="text-sm text-slate-300">{pubForm.pdf_url ? '✓ PDF Attached' : '📁 Upload PDF'}</span>{uploadingImage && <span className="ml-2 text-indigo-400 text-xs">Syncing...</span>}</div>{pubForm.pdf_url && <p className="text-[10px] text-emerald-400 mt-1 break-all">Linked: {pubForm.pdf_url.substring(0, 60)}...</p>}</div>
                <div className="space-y-4 bg-slate-950/30 p-4 rounded-xl border border-slate-800/60">
                  <label className="block text-xs font-bold uppercase text-slate-400">Author(s)</label>
                  {authorInputValues.map((val, idx) => {
                    const matches = authors.filter(a => `${a.first_name} ${a.last_name}`.toLowerCase().includes(val.toLowerCase()));
                    const missing = val.trim() && !authors.some(a => `${a.first_name} ${a.last_name}`.toLowerCase() === val.toLowerCase().trim());
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <input type="text" value={val} required={idx===0} onFocus={() => setActiveDropdownIndex(idx)} onChange={(e) => { const newVals = [...authorInputValues]; newVals[idx] = e.target.value; setAuthorInputValues(newVals); const newIds = [...pubForm.authors]; newIds[idx] = ''; setPubForm({...pubForm, authors: newIds}); }} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2" />
                            {activeDropdownIndex === idx && (
                              <div className="absolute top-full left-0 w-full bg-slate-950 border border-slate-800 mt-1 rounded-xl z-50 max-h-40 overflow-auto">
                                {matches.map(a => (
                                  <div key={a.id} onMouseDown={() => { const newVals = [...authorInputValues]; newVals[idx] = `${a.first_name} ${a.last_name}`; setAuthorInputValues(newVals); const newIds = [...pubForm.authors]; newIds[idx] = a.id; setPubForm({...pubForm, authors: newIds}); setActiveDropdownIndex(null); }} className="px-4 py-2 hover:bg-indigo-600 cursor-pointer">✨ {a.last_name}, {a.first_name}</div>
                                ))}
                                {missing && <div onMouseDown={() => handleTriggerRegistration(val)} className="px-4 py-2 bg-indigo-950/40 text-indigo-400 cursor-pointer">⚠️ "{val}" not registered → Register</div>}
                              </div>
                            )}
                          </div>
                          {idx > 0 && <button type="button" onClick={() => { setAuthorInputValues(authorInputValues.filter((_,i)=>i!==idx)); setPubForm({...pubForm, authors: pubForm.authors.filter((_,i)=>i!==idx)}); }} className="w-10 h-10 rounded-xl border border-slate-800 hover:border-rose-500">&times;</button>}
                        </div>
                      </div>
                    );
                  })}
                  <button type="button" onClick={() => { setAuthorInputValues([...authorInputValues, '']); setPubForm({...pubForm, authors: [...pubForm.authors, '']}); setActiveDropdownIndex(authorInputValues.length); }} className="text-xs border border-dashed border-slate-700 px-3 py-1 rounded-lg">+ Add Co‑Author</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold uppercase text-slate-400">Publisher</label><select value={pubForm.publisher} onChange={e => setPubForm({...pubForm, publisher: e.target.value})} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2"><option disabled>-- Select --</option>{publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                  <div><label className="block text-xs font-bold uppercase text-slate-400">Price (PHP)</label><input type="number" step="0.01" value={pubForm.price} onChange={e => setPubForm({...pubForm, price: e.target.value})} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2" /></div>
                </div>
                <div><label className="block text-xs font-bold uppercase text-slate-400">Abstract / Description</label><textarea rows="3" value={pubForm.abstract || pubForm.description || ''} onChange={e => setPubForm({...pubForm, abstract: e.target.value, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2"></textarea></div>
              </div>
              <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setModalType(null)} className="px-5 py-2 bg-slate-800 rounded-xl">Cancel</button>
                <button type="submit" disabled={!!pubErrors.title} className="px-5 py-2 bg-indigo-600 rounded-xl disabled:opacity-40">Confirm</button>
              </div>
            </form>
            {activeDropdownIndex !== null && <div className="fixed inset-0 z-10" onClick={() => setActiveDropdownIndex(null)} />}
          </div>
        </div>
      )}

      {/* Author Form Modal */}
      {modalType === 'author' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between">
              <h3 className="font-bold">{editId ? 'Edit Author' : 'New Author'}</h3><button onClick={() => setModalType(null)}>&times;</button>
            </div>
            <form onSubmit={(e) => handleFormSubmit(e, 'authors', authForm)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold uppercase text-slate-400">First Name</label><input type="text" value={authForm.first_name} onChange={e => { setAuthForm({...authForm, first_name: e.target.value}); validateAuthorForm(e.target.value, authForm.last_name); }} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2" /></div>
                <div><label className="block text-xs font-bold uppercase text-slate-400">Last Name</label><input type="text" value={authForm.last_name} onChange={e => { setAuthForm({...authForm, last_name: e.target.value}); validateAuthorForm(authForm.first_name, e.target.value); }} required className={`w-full bg-slate-950 border rounded-xl px-4 py-2 ${authErrors.last_name ? 'border-red-500' : 'border-slate-800'}`} />
                {authErrors.last_name && <p className="text-red-400 text-xs mt-1">{authErrors.last_name}</p>}</div>
              </div>
              <div><label className="block text-xs font-bold uppercase text-slate-400">Profile Picture</label><div className="relative h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center px-3"><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'author')} className="absolute inset-0 opacity-0 cursor-pointer" /><span>{authForm.image_url ? '✓ Photo Linked' : '📁 Upload'}</span>{uploadingImage && <span className="ml-2 text-indigo-400 text-xs">Syncing...</span>}</div></div>
              <div><label className="block text-xs font-bold uppercase text-slate-400">Short Bio</label><textarea rows="3" value={authForm.short_bionote} onChange={e => setAuthForm({...authForm, short_bionote: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2"></textarea></div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 bg-slate-800 rounded-xl">Cancel</button>
                <button type="submit" disabled={uploadingImage || !!authErrors.last_name} className="px-4 py-2 bg-indigo-600 rounded-xl disabled:opacity-40">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publisher Form Modal */}
      {modalType === 'publisher' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between">
              <h3 className="font-bold">{editId ? 'Edit Publisher' : 'New Publisher'}</h3><button onClick={() => setModalType(null)}>&times;</button>
            </div>
            <form onSubmit={(e) => handleFormSubmit(e, 'publishers', publForm)} className="p-6 space-y-4">
              <div><label className="block text-xs font-bold uppercase text-slate-400">Publisher Name</label><input type="text" value={publForm.name} onChange={e => { setPublForm({...publForm, name: e.target.value}); validatePublisherForm(e.target.value); }} required className={`w-full bg-slate-950 border rounded-xl px-4 py-2 ${publErrors.name ? 'border-red-500' : 'border-slate-800'}`} />
              {publErrors.name && <p className="text-red-400 text-xs mt-1">{publErrors.name}</p>}</div>
              <div><label className="block text-xs font-bold uppercase text-slate-400">Cover Image</label><div className="relative h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center px-3"><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'publisher')} className="absolute inset-0 opacity-0 cursor-pointer" /><span>{publForm.image_url ? '✓ Cover Attached' : '📁 Upload'}</span>{uploadingImage && <span className="ml-2 text-amber-400 text-xs">Syncing...</span>}</div></div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 bg-slate-800 rounded-xl">Cancel</button>
                <button type="submit" disabled={uploadingImage || !!publErrors.name} className="px-4 py-2 bg-indigo-600 rounded-xl disabled:opacity-40">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----- FOOTER (always visible) ----- */}
      <footer className="border-t border-slate-800 bg-slate-950/30 mt-12 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div className="text-center sm:text-left">&copy; {new Date().getFullYear()} GRIT Hub Archive. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="https://ncpag.upd.edu.ph" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">NCPAG</a>
            <a href="https://grit-labs.github.io" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">GRIT Labs</a>
            <a href="https://up.edu.ph" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">University of the Philippines</a>
          </div>
        </div>
      </footer>

      {/* ----- LOGIN MODAL ----- */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div><label className="block text-xs font-bold uppercase text-slate-400">Username</label><input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2" /></div>
              <div><label className="block text-xs font-bold uppercase text-slate-400">Password</label><input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2" /></div>
              {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowLoginModal(false)} className="px-4 py-2 bg-slate-800 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 rounded-xl text-xs">Login</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}