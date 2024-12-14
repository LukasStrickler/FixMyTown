"use client";

import { useEffect, useState } from "react";
import { AuthProvider } from "@/components/provider/authProvider";

export default function NamePopup() {
  const [showPopup, setShowPopup] = useState(false);
//   const { session } = useAuth();

//   useEffect(() => {
//     if (!session?.user?.name) {
//       setShowPopup(true);
//     }
//   }, [session]);

  useEffect(() => {
    if (true) {
      setShowPopup(true);
    }
  }, []);


  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2>Welcome!</h2>
        <p>Your name is not set yet.</p>
        <button
          onClick={() => setShowPopup(false)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
