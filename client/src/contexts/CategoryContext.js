import React, { createContext, useState, useEffect, useContext } from 'react';
import { categoryService } from '../services/category.service';
import { useAuth } from './AuthContext';

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const { token, adminToken } = useAuth();
  const [userCategories, setUserCategories] = useState([]);
  const [commonCategories, setCommonCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Always load common categories
      const common = await categoryService.getAllCommonCategories();
      setCommonCategories(common);
      
      // Load user categories if logged in
      if (token) {
        const user = await categoryService.getUserCategories();
        setUserCategories(user);
      } else {
        setUserCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, adminToken]);

  // Actions
  const addUserCategory = async (name) => {
    const newCat = await categoryService.addUserCategory({ Category: name });
    setUserCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const deleteUserCategory = async (id) => {
    await categoryService.deleteUserCategory(id);
    setUserCategories(prev => prev.filter(c => c._id !== id));
  };

  const addCommonCategory = async (name) => {
    const newCat = await categoryService.addCommonCategory({ Name: name });
    setCommonCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const deleteCommonCategory = async (id) => {
    await categoryService.deleteCommonCategory(id);
    setCommonCategories(prev => prev.filter(c => c._id !== id));
  };

  return (
    <CategoryContext.Provider value={{
      userCategories,
      commonCategories,
      loading,
      addUserCategory,
      deleteUserCategory,
      addCommonCategory,
      deleteCommonCategory,
      refreshCategories: fetchCategories
    }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoryContext);
}
