import React, { useEffect } from "react";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 2400);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-6 right-6 z-50" role="status" aria-live="polite">
      <div className="rounded-md bg-slate-900 text-white px-4 py-2 shadow-lg">{message}</div>
    </div>
  );
};

export default Toast;
