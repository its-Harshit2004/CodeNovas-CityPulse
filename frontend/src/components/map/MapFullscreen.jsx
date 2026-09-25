import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { createPortal } from 'react-dom';

const MapFullscreen = ({ isFullscreen, setIsFullscreen, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    if (isFullscreen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isFullscreen, setIsFullscreen]);

  const btn = (
    <button 
      onClick={() => setIsFullscreen(!isFullscreen)}
      className="absolute top-4 right-4 z-[1000] glass-panel p-2 rounded hover:bg-[var(--navy-panel-hover)] transition-colors text-text-secondary"
      title={isFullscreen ? "Exit Fullscreen" : "Enlarge Map"}
    >
      {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
    </button>
  );

  if (!isFullscreen) {
    return (
      <div className="relative w-full h-full group">
        {btn}
        {children}
      </div>
    );
  }

  // Render fullscreen portal
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-[var(--navy-bg)]">
      {btn}
      {children}
    </div>,
    document.body
  );
};

export default MapFullscreen;
