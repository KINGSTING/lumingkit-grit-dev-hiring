import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('publications');
  const [publications, setPublications] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Omni-Search Query State Context
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State Controllers
  const [modalType, setModalType] = useState(null); 
  const [editId, setEditId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detailed Row-Click Modal View State Managers
  const [selectedViewPub, setSelectedViewPub] = useState(null);
  
  // Custom Searchable Entry Array Trackers
  const [authorInputValues, setAuthorInputValues] = useState(['']);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);

  // Form Binding States - SGLG digital standardization parameters normalized
  const [pubForm, setPubForm] = useState({ title: '', publication_type: 'Journal Article', publication_date: '', price: '0.00', description: '', abstract: '', authors: [], publisher: '' });
  const [authForm, setAuthForm] = useState({ first_name: '', last_name: '', short_bionote: '' });
  const [publForm, setPublForm] = useState({ name: '' });

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
      console.error("Error connecting to database engines:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  // SEARCH FILTER ALGORITHMS LAYER
  // ==============================================================
  const getFilteredData = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      if (activeTab === 'publications') return publications;
      if (activeTab === 'authors') return authors;
      if (activeTab === 'publishers') return publishers;
    }

    if (activeTab === 'publications') {
      return publications.filter((pub) => {
        const titleMatch = pub.title?.toLowerCase().includes(query);
        const typeMatch = pub.publication_type?.toLowerCase().includes(query);
        const priceMatch = parseFloat(pub.price).toFixed(2).includes(query);
        
        const authorMatch = pub.author_details?.some(auth => 
          `${auth.first_name} ${auth.last_name}`.toLowerCase().includes(query)
        );
        const publisherMatch = pub.publisher_details?.name?.toLowerCase().includes(query);

        return titleMatch || typeMatch || priceMatch || authorMatch || publisherMatch;
      });
    }

    if (activeTab === 'authors') {
      return authors.filter((auth) => {
        const nameMatch = `${auth.first_name} ${auth.last_name}`.toLowerCase().includes(query);
        const idMatch = `#${auth.id}`.includes(query) || auth.id.toString() === query;
        const bioMatch = auth.short_bionote?.toLowerCase().includes(query);
        return nameMatch || idMatch || bioMatch;
      });
    }

    if (activeTab === 'publishers') {
      return publishers.filter((publ) => {
        const nameMatch = publ.name?.toLowerCase().includes(query);
        const idMatch = `#${publ.id}`.includes(query) || publ.id.toString() === query;
        return nameMatch || idMatch;
      });
    }

    return [];
  };

  const filteredItems = getFilteredData();

  const openModal = (type, existingRecord = null) => {
    setModalType(type);
    setActiveDropdownIndex(null);
    if (existingRecord) {
      setEditId(existingRecord.id);
      if (type === 'publication') {
        const authorIds = existingRecord.author_details?.map(a => a.id) || [];
        const textValues = existingRecord.author_details?.map(a => `${a.first_name} ${a.last_name}`) || [];
        setPubForm({ 
          ...existingRecord, 
          authors: authorIds,
          publisher: existingRecord.publisher_details?.id || existingRecord.publisher 
        });
        setAuthorInputValues(textValues.length > 0 ? textValues : ['']);
      }
      if (type === 'author') setAuthForm({ ...existingRecord });
      if (type === 'publisher') setPublForm({ ...existingRecord });
    } else {
      setEditId(null);
      setPubForm({ 
        title: '', publication_type: 'Journal Article', publication_date: '', price: '0.00', description: '', abstract: '', 
        authors: [], publisher: publishers[0]?.id || '' 
      });
      setAuthorInputValues(['']);
      setAuthForm({ first_name: '', last_name: '', short_bionote: '' });
      setPublForm({ name: '' });
    }
  };

  const handleFormSubmit = async (e, endpoint, payload) => {
    e.preventDefault();
    
    let cleanedPayload = { ...payload };
    if (endpoint === 'publications' && cleanedPayload.authors) {
      cleanedPayload.authors = cleanedPayload.authors
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));
    }

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_BASE_URL}/${endpoint}/${editId}/` : `${API_BASE_URL}/${endpoint}/`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedPayload)
      });
      if (res.ok) {
        setModalType(null);
        fetchAllData();
      }
    } catch (err) {
      console.error("Payload transmission failure:", err);
    }
  };

  const handleDelete = async (endpoint, id) => {
    if (!window.confirm("Are you sure you want to remove this registry element permanently?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${endpoint}/${id}/`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error("Error clearing targeted database row:", err);
    }
  };

  const handleTriggerRegistration = (typedText) => {
    const names = typedText.trim().split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';
    
    setModalType('author');
    setEditId(null);
    setAuthForm({ first_name: firstName, last_name: lastName, short_bionote: 'Please register author.' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Dynamic Header Core */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4 min-w-0">
            <img 
              src="src/assets/grit-logo.png" 
              alt="GRIT Logo" 
              className="h-12 w-12 object-contain select-none block rounded-2xl shadow-lg border border-slate-700"
              onError={(e) => {
                e.target.style.display = 'none';
                document.getElementById('brand-icon-fallback')?.classList.remove('hidden');
              }}
            />
            <div className="flex flex-col truncate">
              <h1 className="!text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent margin-0">
                GRIT Hub Archive
              </h1>
            </div>
          </div>

          {/* Right Block: Actions Menu with Hint Indicator Matrix */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 transition-all duration-300 ease-out transform ${
              menuOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-12 opacity-0 pointer-events-none'
            }`}>
              <button onClick={() => openModal('publication')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95 border border-slate-700/50 whitespace-nowrap">+ Publication</button>
              <button onClick={() => openModal('author')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95 border border-slate-700/50 whitespace-nowrap">+ Author</button>
              <button onClick={() => openModal('publisher')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95 border border-slate-700/50 whitespace-nowrap">+ Publisher</button>
            </div>

            <div className="relative flex items-center gap-3">
              {!menuOpen && (
                <span className="hidden md:inline-flex items-center text-[11px] font-bold tracking-wide text-indigo-400 animate-pulse bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-2.5 py-1">
                  Click menu to reveal utilities <span className="ml-1.5">🚀</span>
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
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* System Metrics Analytics Card Blocks */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Total Publications</p>
              <h3 className="text-3xl font-bold mt-1 text-white">{publications.length}</h3>
            </div>
            <div className="text-indigo-400 font-mono text-2xl">📚</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Registered Authors</p>
              <h3 className="text-3xl font-bold mt-1 text-white">{authors.length}</h3>
            </div>
            <div className="text-emerald-400 font-mono text-2xl">✍️</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Publishing Entities</p>
              <h3 className="text-3xl font-bold mt-1 text-white">{publishers.length}</h3>
            </div>
            <div className="text-amber-400 font-mono text-2xl">🏢</div>
          </div>
        </section>

        {/* CONTROLS BAR */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="flex border border-slate-800 p-1 bg-slate-900 rounded-xl w-full sm:w-auto max-w-sm">
            {['publications', 'authors', 'publishers'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
                className={`flex-1 sm:flex-none px-5 py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                  activeTab === tab ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 pointer-events-none text-sm">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab} by keyword, type, title, or metrics...`}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-300 transition text-sm">&times;</button>
            )}
          </div>
        </div>

        {/* Data Tables */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-indigo-500"></div>
              <p className="text-xs font-medium text-slate-400">Syncing with relational infrastructure...</p>
            </div>
          ) : (
            <div className="p-2">
              {activeTab === 'publications' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                        <th className="p-4 font-semibold">Publication Title</th>
                        <th className="p-4 font-semibold">Type</th>
                        <th className="p-4 font-semibold">Author</th>
                        <th className="p-4 font-semibold">Publisher</th>
                        <th className="p-4 font-semibold">Price</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-900/50">
                      {filteredItems.map((pub) => (
                        <tr 
                          key={pub.id} 
                          onClick={() => setSelectedViewPub(pub)}
                          className="hover:bg-slate-900/60 transition cursor-pointer group"
                        >
                          <td className="p-4 font-semibold text-slate-200 max-w-sm whitespace-normal break-words leading-relaxed group-hover:text-indigo-400 transition-colors">
                            {pub.title}
                          </td>
                          <td className="p-4 text-slate-400">
                            <span className="px-2 py-0.5 rounded-md text-xs bg-slate-800 border border-slate-700/60 font-medium">{pub.publication_type}</span>
                          </td>
                          
                          <td className="p-4 text-slate-300 font-medium">
                            {pub.author_details && pub.author_details.length > 0 ? (
                              <span>
                                {pub.author_details[0].first_name} {pub.author_details[0].last_name}
                                {pub.author_details.length > 1 && (
                                  <span className="text-slate-500 italic text-xs ml-1 bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-800">
                                    et al.
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-slate-500 italic text-xs">No Authors Annotated</span>
                            )}
                          </td>

                          <td className="p-4 text-slate-400">{pub.publisher_details?.name || 'N/A'}</td>
                          <td className="p-4 font-mono font-semibold">
                            {parseFloat(pub.price) === 0 ? (
                              <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">Free</span>
                            ) : (
                              <span className="text-emerald-400">₱{parseFloat(pub.price).toFixed(2)}</span>
                            )}
                          </td>
                          
                          <td className="p-4 text-right space-x-3 text-xs" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => openModal('publication', pub)} className="text-indigo-400 hover:text-indigo-300 font-semibold transition">Edit</button>
                            <button onClick={() => handleDelete('publications', pub.id)} className="text-rose-400 hover:text-rose-300 font-semibold transition">Delete</button>
                          </td>
                        </tr>
                      ))}
                      {filteredItems.length === 0 && <tr><td colSpan="6" className="text-center py-12 text-xs text-slate-500 font-medium">No publications found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'authors' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                        <th className="p-4 font-semibold">System ID</th>
                        <th className="p-4 font-semibold">Author Legal Name</th>
                        <th className="p-4 font-semibold">Biographical Context</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-900/50">
                      {filteredItems.map((auth) => (
                        <tr key={auth.id} className="hover:bg-slate-900/40 transition">
                          <td className="p-4 text-slate-500 font-mono text-xs">#{auth.id}</td>
                          <td className="p-4 font-semibold text-slate-200">{auth.last_name}, {auth.first_name}</td>
                          <td className="p-4 text-slate-400 max-w-sm truncate" title={auth.short_bionote}>{auth.short_bionote || 'None annotated.'}</td>
                          <td className="p-4 text-right space-x-3 text-xs">
                            <button onClick={() => openModal('author', auth)} className="text-indigo-400 hover:text-indigo-300 font-semibold transition">Edit</button>
                            <button onClick={() => handleDelete('authors', auth.id)} className="text-rose-400 hover:text-rose-300 font-semibold transition">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'publishers' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                        <th className="p-4 font-semibold">System ID</th>
                        <th className="p-4 font-semibold">Publisher Corporate Name</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-900/50">
                      {filteredItems.map((publ) => (
                        <tr key={publ.id} className="hover:bg-slate-900/40 transition">
                          <td className="p-4 text-slate-500 font-mono text-xs">#{publ.id}</td>
                          <td className="p-4 font-semibold text-slate-200">{publ.name}</td>
                          <td className="p-4 text-right space-x-3 text-xs">
                            <button onClick={() => openModal('publisher', publ)} className="text-indigo-400 hover:text-indigo-300 font-semibold transition">Edit</button>
                            <button onClick={() => handleDelete('publishers', publ.id)} className="text-rose-400 hover:text-rose-300 font-semibold transition">Delete</button>
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
      </main>

      {/* Deep Dive Summary Modal Overlay */}
      {selectedViewPub && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border-t border-slate-700/30 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-start bg-slate-950/40 gap-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest font-mono">
                  {selectedViewPub.publication_type}
                </span>
                <h3 className="font-bold text-white text-lg tracking-tight leading-snug mt-1">
                  {selectedViewPub.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedViewPub(null)} 
                className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 h-8 w-8 rounded-full flex items-center justify-center transition"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Authors ({selectedViewPub.author_details?.length || 0})
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {selectedViewPub.author_details && selectedViewPub.author_details.length > 0 ? (
                      selectedViewPub.author_details.map(auth => (
                        <div key={auth.id} className="text-sm font-semibold text-slate-200">
                          ✍️ {auth.first_name} {auth.last_name}
                          {auth.short_bionote && (
                            <span className="block text-xs font-normal text-slate-400 pl-5 mt-0.5 italic">
                              {auth.short_bionote}
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No profiles bound.</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Publisher
                    </span>
                    <span className="text-sm font-semibold text-slate-200 block mt-1">
                      🏢 {selectedViewPub.publisher_details?.name || 'Unassigned Node'}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-slate-800/60 mt-4 grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Publication Date</span>
                      <span className="text-xs font-mono text-slate-300 block mt-0.5">{selectedViewPub.publication_date || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Index ID</span>
                      <span className="text-xs font-mono text-slate-400 block mt-0.5"># {selectedViewPub.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Abstract / Description</span>
                  <div className="p-4 rounded-xl bg-slate-950/30 border border-slate-800/60 text-sm text-slate-300 leading-relaxed max-w-none">
                    {selectedViewPub.abstract || selectedViewPub.description || (
                      <span className="text-slate-500 italic text-xs">No description mapped.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Price:</span>
                <span className="font-mono text-base font-bold">
                  {parseFloat(selectedViewPub.price) === 0 ? (
                    <span className="text-emerald-400 uppercase text-sm tracking-wider">Free</span>
                  ) : (
                    <span className="text-emerald-400">₱{parseFloat(selectedViewPub.price).toFixed(2)}</span>
                  )}
                </span>
              </div>
              <button onClick={() => setSelectedViewPub(null)} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition shadow-md">Close Viewport</button>
            </div>

          </div>
        </div>
      )}

      {/* Publication Form Overlay */}
      {modalType === 'publication' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          {/* FIX 1: Max width scaled up to max-w-3xl for optimal grid presentation spacing */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 relative z-50 flex flex-col my-auto">
            
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40 shrink-0">
              <h3 className="font-bold text-white text-base">{editId ? 'Modify Archival Node' : 'Register New Publication'}</h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white text-lg transition">&times;</button>
            </div>
            
            {/* FIX 2: Added structural max height bounding logic with internal scrolling configuration to fit 100% display screens safely */}
            <form onSubmit={(e) => handleFormSubmit(e, 'publications', pubForm)} className="flex-1 flex flex-col min-h-0">
              <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-14rem)] custom-scrollbar">
                <div>
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Publication Title</label>
                  <input type="text" value={pubForm.title} onChange={e => setPubForm({...pubForm, title: e.target.value})} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition" placeholder="e.g. Seal of Good Local Governance Metrics Development" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Type</label>
                    <select value={pubForm.publication_type} onChange={e => setPubForm({...pubForm, publication_type: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition">
                      <option value="Book">Book</option>
                      <option value="Journal Article">Journal Article</option>
                      <option value="Research Paper">Research Paper</option>
                      <option value="Report">Report</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Publication Date</label>
                    <input type="date" value={pubForm.publication_date} onChange={e => setPubForm({...pubForm, publication_date: e.target.value})} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition" />
                  </div>
                </div>

                {/* SEARCH DROPDOWN ENTRY ROWS MODULE */}
                <div className="space-y-4 bg-slate-950/30 p-4 rounded-xl border border-slate-800/60 relative">
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    Author/s
                  </label>
                  
                  {authorInputValues.map((textValue, rowIndex) => {
                    const matchingSuggestions = authors.filter(a => 
                      `${a.first_name} ${a.last_name}`.toLowerCase().includes(textValue.toLowerCase())
                    );
                    const isDbMatchMissing = textValue.trim().length > 0 && !authors.some(a => 
                      `${a.first_name} ${a.last_name}`.toLowerCase() === textValue.toLowerCase().trim()
                    );

                    return (
                      <div key={rowIndex} className="space-y-1 relative">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                          {rowIndex === 0 ? "First Author / Lead Principal" : `Co-Author Row #${rowIndex}`}
                        </span>
                        
                        <div className="flex items-center gap-2 relative">
                          <div className="flex-1 relative">
                            <input 
                              type="text"
                              value={textValue}
                              required={rowIndex === 0}
                              onFocus={() => setActiveDropdownIndex(rowIndex)}
                              onChange={(e) => {
                                const updatedTextValues = [...authorInputValues];
                                updatedTextValues[rowIndex] = e.target.value;
                                setAuthorInputValues(updatedTextValues);

                                const updatedIds = [...(pubForm.authors || [])];
                                updatedIds[rowIndex] = "";
                                setPubForm({ ...pubForm, authors: updatedIds });
                              }}
                              placeholder="Click or type to search registered authors..."
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                            />

                            {/* Floating Suggestion Overlays */}
                            {activeDropdownIndex === rowIndex && (
                              <div className="absolute top-full left-0 w-full bg-slate-950 border border-slate-800 mt-1 rounded-xl shadow-2xl overflow-hidden z-50 max-h-40 overflow-y-auto divide-y divide-slate-900/60">
                                {matchingSuggestions.map(authorObj => (
                                  <div
                                    key={authorObj.id}
                                    onMouseDown={() => {
                                      const updatedTextValues = [...authorInputValues];
                                      updatedTextValues[rowIndex] = `${authorObj.first_name} ${authorObj.last_name}`;
                                      setAuthorInputValues(updatedTextValues);

                                      const updatedIds = [...(pubForm.authors || [])];
                                      updatedIds[rowIndex] = authorObj.id;
                                      setPubForm({ ...pubForm, authors: updatedIds });
                                      
                                      setActiveDropdownIndex(null); 
                                    }}
                                    className="px-4 py-2 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white cursor-pointer font-medium transition text-left"
                                  >
                                    ✨ {authorObj.last_name}, {authorObj.first_name}
                                  </div>
                                ))}

                                {isDbMatchMissing && (
                                  <div 
                                    onMouseDown={() => handleTriggerRegistration(textValue)}
                                    className="px-4 py-2.5 bg-indigo-950/40 text-indigo-400 hover:bg-indigo-600 hover:text-white cursor-pointer text-xs font-bold transition flex items-center justify-between gap-2"
                                  >
                                    <span>⚠️ "{textValue}" is not registered.</span>
                                    <span className="underline">Register &rarr;</span>
                                  </div>
                                )}
                                
                                {matchingSuggestions.length === 0 && !isDbMatchMissing && (
                                  <div className="px-4 py-2 text-xs text-slate-500 italic text-left">No matching authors found.</div>
                                )}
                              </div>
                            )}
                          </div>

                          {rowIndex > 0 && (
                            <button 
                              type="button"
                              onClick={() => {
                                const updatedTextValues = authorInputValues.filter((_, i) => i !== rowIndex);
                                setAuthorInputValues(updatedTextValues);

                                const updatedIds = (pubForm.authors || []).filter((_, i) => i !== rowIndex);
                                setPubForm({ ...pubForm, authors: updatedIds });
                                
                                if (activeDropdownIndex === rowIndex) setActiveDropdownIndex(null);
                              }}
                              className="bg-slate-950 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 h-10 w-10 rounded-xl flex items-center justify-center transition"
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex justify-start pt-1">
                    <button 
                      type="button"
                      onClick={() => {
                        setAuthorInputValues([...authorInputValues, '']);
                        setPubForm({ ...pubForm, authors: [...(pubForm.authors || []), ''] });
                        setActiveDropdownIndex(authorInputValues.length);
                      }}
                      className="py-1.5 px-3 rounded-lg border border-dashed border-slate-700 hover:border-indigo-500/50 bg-slate-900/30 hover:bg-indigo-950/20 text-slate-400 hover:text-indigo-400 text-[11px] font-semibold transition flex items-center gap-1 active:scale-95"
                    >
                      <span className="text-xs font-bold">+</span> Add Co-Author Row
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Publisher</label>
                    <select value={pubForm.publisher} onChange={e => setPubForm({...pubForm, publisher: e.target.value})} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition">
                      <option value="">-- Choose Relational Node --</option>
                      {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Price Target (PHP)</label>
                    <input type="number" step="0.01" value={pubForm.price} onChange={e => setPubForm({...pubForm, price: e.target.value})} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono transition" />
                  </div>
                </div>

                {/* CLEAN UNIFIED ABSTRACT / DESCRIPTION METADATA ROW */}
                <div>
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Abstract / Description</label>
                  <textarea 
                    value={pubForm.abstract || pubForm.description || ''} 
                    onChange={e => {
                      const val = e.target.value;
                      setPubForm({ ...pubForm, abstract: val, description: val });
                    }} 
                    rows="4" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none" 
                    placeholder="Enter abstract summary text or supplementary context description..."
                  ></textarea>
                </div>
              </div>

              {/* Shutter overlay to dismiss dropdown upon clicking away */}
              {activeDropdownIndex !== null && (
                <div className="fixed inset-0 z-10 bg-transparent" onClick={() => setActiveDropdownIndex(null)} />
              )}

              <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex justify-end gap-2 shrink-0 relative z-20">
                <button type="button" onClick={() => setModalType(null)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 transition">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Author Form Overlay */}
      {modalType === 'author' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h3 className="font-bold text-white text-base">{editId ? 'Modify Scholar Attributes' : 'Register New Scholar Profile'}</h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white text-lg transition">&times;</button>
            </div>
            <form onSubmit={(e) => handleFormSubmit(e, 'authors', authForm)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Given First Name</label>
                  <input type="text" value={authForm.first_name} onChange={e => setAuthForm({...authForm, first_name: e.target.value})} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition" />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Family Last Name</label>
                  <input type="text" value={authForm.last_name} onChange={e => setAuthForm({...authForm, last_name: e.target.value})} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Short Bio Annotation</label>
                <textarea value={authForm.short_bionote || ''} onChange={e => setAuthForm({...authForm, short_bionote: e.target.value})} rows="3" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition" placeholder="Primary research fields, institutional affiliations, etc..."></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 transition">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publisher Form Overlay */}
      {modalType === 'publisher' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h3 className="font-bold text-white text-base">{editId ? 'Modify Publishing Entity' : 'Register New Publishing Corporate'}</h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white text-lg transition">&times;</button>
            </div>
            <form onSubmit={(e) => handleFormSubmit(e, 'publishers', publForm)} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Corporate / Agency Legal Name</label>
                <input type="text" value={publForm.name} onChange={e => setPublForm({...publForm, name: e.target.value})} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition" placeholder="e.g. National College of Public Administration and Governance" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 transition">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}