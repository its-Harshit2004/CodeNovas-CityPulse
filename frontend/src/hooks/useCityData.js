import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import dayjs from 'dayjs';
import { getSignalDef } from '../config/signalRegistry';

export const useCityData = () => {
  const [payload, setPayload] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [nextCheckIn, setNextCheckIn] = useState(15);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      await api.advanceDemo();
      const data = await api.getFullState();
      
      setPayload(data);
      setLastChecked(dayjs().format('HH:mm:ss'));
      setError(false);
      setLoading(false);
      setNextCheckIn(15);
    } catch (err) {
      console.error("Poll failed", err);
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const handleVisibilityChange = () => setIsPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setNextCheckIn(prev => {
        if (prev <= 1) {
          fetchAll();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchAll, isPaused]);

  const manualRefresh = () => {
    setNextCheckIn(15);
    fetchAll();
  };

  const resetDemo = async () => {
    await api.resetDemo();
    manualRefresh();
  };

  // Derive dynamic structures
  const activeSignals = useMemo(() => {
    if (!payload || !payload.zones) return [];
    const sigIds = new Set();
    payload.zones.forEach(z => Object.keys(z.signals || {}).forEach(k => sigIds.add(k)));
    
    // Merge with payload.signalTypes and local registry
    return Array.from(sigIds).map(id => {
      const payloadDef = (payload.signalTypes || []).find(s => s.id === id);
      const localDef = getSignalDef(id);
      return { ...localDef, ...payloadDef, id };
    });
  }, [payload]);

  return { 
    payload, 
    activeSignals, 
    lastChecked, 
    nextCheckIn, 
    error, 
    loading, 
    manualRefresh, 
    resetDemo 
  };
};
