'use client';
import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onDone: () => void;
}

export function Toast({ message, onDone }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300); }, 2400);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 32, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 10}px)`,
      background: 'var(--text)', color: 'var(--bg)',
      fontSize: 9, letterSpacing: 2,
      textTransform: 'uppercase', padding: '9px 20px',
      opacity: visible ? 1 : 0,
      transition: 'all .22s',
      zIndex: 600, pointerEvents: 'none',
      borderRadius: 20,
    }}>
      {message}
    </div>
  );
}
