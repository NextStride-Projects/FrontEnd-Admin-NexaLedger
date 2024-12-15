"use client";

import React, { useEffect, useState } from "react";

export default function Snackbar() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedMessage = localStorage.getItem("snackbarMessage");
    if (storedMessage) {
      setMessage(storedMessage);

      localStorage.removeItem("snackbarMessage");

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-md z-50">
      {message}
    </div>
  );
}
