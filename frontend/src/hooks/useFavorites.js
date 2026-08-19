import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'automax_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  // Snapshot of state before the last optimistic toggle, used for rollback
  // if the localStorage write fails.
  const rollbackRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      rollbackRef.current = null;
    } catch (e) {
      if (rollbackRef.current) {
        setFavorites(rollbackRef.current);
        rollbackRef.current = null;
      }
    }
  }, [favorites]);

  const isFavorite = useCallback((id) => favorites.some(f => f.id === id), [favorites]);

  // Optimistic toggle: state updates synchronously (instant UI),
  // localStorage persistence happens in the effect above.
  const toggleFavorite = useCallback((item) => {
    setFavorites(prev => {
      rollbackRef.current = prev;
      return prev.some(f => f.id === item.id)
        ? prev.filter(f => f.id !== item.id)
        : [...prev, item];
    });
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites(prev => {
      rollbackRef.current = prev;
      return prev.filter(f => f.id !== id);
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}