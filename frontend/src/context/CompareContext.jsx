import React, { createContext, useState, useContext } from 'react';
import { useToast } from './ToastContext';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const { showToast } = useToast();

  const toggleCompare = (product) => {
    const exists = compareList.some(p => p._id === product._id);
    
    if (exists) {
      setCompareList(prev => prev.filter(p => p._id !== product._id));
      showToast('Removed from comparison', 'info');
    } else {
      if (compareList.length >= 4) {
        showToast('You can compare up to 4 products at a time', 'error');
        return;
      }
      // Check if it's the same category (optional but good for comparison)
      if (compareList.length > 0 && compareList[0].categorySlug !== product.categorySlug) {
         showToast('Please select products from the same category to compare', 'error');
         return;
      }
      setCompareList(prev => [...prev, product]);
      showToast('Added to comparison', 'success');
    }
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId) => {
    return compareList.some(p => p._id === productId);
  };

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
