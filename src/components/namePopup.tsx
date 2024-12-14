"use client";

import { useEffect, useState } from "react";

export default function NamePopup({ userName }: { userName: string | null }) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!userName) {
      setShowPopup(true);
    }
  }, [userName]);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-white">Welcome!</h2>
        <p className="text-white mt-2">Your name is not set. Please update your profile.</p>
        <button
          onClick={() => setShowPopup(false)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}
