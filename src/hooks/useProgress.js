import { useState, useEffect } from 'react';

export function useProgress(namespace) {
  const key = `placement_os_${namespace}`;
  
  const getStored = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem(key) || "[]"));
    } catch (e) {
      return new Set();
    }
  };

  const [done, setDone] = useState(getStored);

  useEffect(() => {
    const handleStorageChange = () => {
      setDone(getStored());
    };
    window.addEventListener(`storage_${key}`, handleStorageChange);
    return () => window.removeEventListener(`storage_${key}`, handleStorageChange);
  }, [key]);

  const toggle = (id) => {
    const next = new Set(done);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    localStorage.setItem(key, JSON.stringify([...next]));
    setDone(next);
    window.dispatchEvent(new Event(`storage_${key}`));
    window.dispatchEvent(new Event('progress_change_event'));
  };

  return { done, toggle, count: done.size };
}
