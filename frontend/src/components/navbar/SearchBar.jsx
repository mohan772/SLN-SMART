import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Mic, MicOff, X, Loader2, TrendingUp, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from local storage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const removeRecentSearch = (term, e) => {
    e.stopPropagation();
    const updated = recentSearches.filter(t => t !== term);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 1) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async (searchTerm) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/products/search?q=${encodeURIComponent(searchTerm)}`);
      setResults(res.data.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (productId) => {
    saveRecentSearch(query);
    navigate(`/product/${productId}`);
    setIsFocused(false);
    setQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setIsFocused(false);
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice search.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      performSearch(transcript);
      setIsFocused(true);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <span key={index} className="bg-gold/30 text-forest font-bold">{part}</span> : part
    );
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto z-50">
      <form onSubmit={handleSubmit} className={`relative flex items-center bg-soft-white border-2 rounded-2xl transition-all duration-300 ${isFocused ? 'border-gold shadow-[0_0_20px_rgba(212,175,55,0.15)] bg-white' : 'border-beige hover:border-gold/50'}`}>
        <div className="pl-4 text-olive">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder='Search for "Fresh Tomatoes"'
          className="w-full py-3 px-3 bg-transparent outline-none text-forest placeholder-olive/60 font-medium"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        
        {query && (
          <button type="button" onClick={() => setQuery('')} className="p-2 text-olive hover:text-rose-500 transition-colors">
            <X size={18} />
          </button>
        )}
        
        <div className="h-6 w-px bg-beige mx-1"></div>

        <button 
          type="button" 
          onClick={handleVoiceSearch}
          className={`p-3 rounded-r-2xl transition-all flex items-center justify-center gap-2 ${isListening ? 'bg-rose-50 text-rose-500' : 'text-emerald-600 hover:bg-emerald-50'}`}
        >
          {isListening ? (
             <motion.div 
               animate={{ scale: [1, 1.2, 1] }} 
               transition={{ repeat: Infinity, duration: 1 }}
             >
               <Mic size={20} />
             </motion.div>
          ) : <Mic size={20} />}
        </button>
      </form>

      <AnimatePresence>
        {isFocused && (query.length > 0 || recentSearches.length > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-beige overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center justify-center p-8 text-olive">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : query.length > 1 ? (
              results.length > 0 ? (
                <div className="py-2 max-h-[60vh] overflow-y-auto">
                  {results.map(product => (
                    <div 
                      key={product._id} 
                      onClick={() => handleSelectProduct(product._id)}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-soft-white cursor-pointer transition-colors group"
                    >
                      <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-beige" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-forest group-hover:text-gold transition-colors truncate">
                          {highlightText(product.name, query)}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-bold mt-1">
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{product.categorySlug}</span>
                          <span className="text-olive">₹{product.price}/{product.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-soft-white rounded-full flex items-center justify-center mx-auto mb-3 text-olive">
                    <Search size={24} />
                  </div>
                  <h4 className="font-bold text-forest mb-1">No products found</h4>
                  <p className="text-sm text-olive">Try searching for something else like "apples" or "milk".</p>
                </div>
              )
            ) : (
              <div className="py-4">
                {recentSearches.length > 0 && (
                  <div className="mb-4 px-4">
                    <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-olive mb-3">
                      <History size={14} /> Recent Searches
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map(term => (
                        <div 
                          key={term}
                          onClick={() => { setQuery(term); performSearch(term); }}
                          className="flex items-center gap-2 bg-soft-white border border-beige px-3 py-1.5 rounded-full text-sm font-medium text-forest hover:border-gold hover:text-gold cursor-pointer transition-all group"
                        >
                          {term}
                          <button onClick={(e) => removeRecentSearch(term, e)} className="text-olive group-hover:text-rose-500">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="px-4">
                  <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-olive mb-3">
                    <TrendingUp size={14} /> Trending Now
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                     {['Fresh Mangoes', 'Organic Spinach', 'Desi Tomatoes', 'Farm Eggs'].map(trend => (
                       <button 
                         key={trend}
                         onClick={() => { setQuery(trend); performSearch(trend); }}
                         className="text-left px-3 py-2 rounded-xl text-sm font-bold text-forest hover:bg-soft-white hover:text-emerald-600 transition-colors"
                       >
                         {trend}
                       </button>
                     ))}
                  </div>
                </div>
              </div>
            )}
            
            {query.length > 1 && results.length > 0 && (
              <div className="p-3 border-t border-beige bg-soft-white">
                <button 
                  onClick={handleSubmit}
                  className="w-full text-center text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-4"
                >
                  See all results for "{query}"
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
