import { useState, useEffect } from "react";

export default function Notification({ message, type = "info", onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg text-white ${bgColor} shadow-lg z-50 animate-slide-up`}>
      {message}
      <button onClick={() => setVisible(false)} className="ml-4">✕</button>
    </div>
  );
}