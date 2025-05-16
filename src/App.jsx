import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRegClone } from 'react-icons/fa';

function App() {
  const [flashcards, setFlashcards] = useState(() => {
    const saved = localStorage.getItem('flashcards');
    return saved ? JSON.parse(saved) : [];
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">📖 Bible Flashcards</h1>
      <Link
        to="/create"
        className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        ➕ Create New Flashcard
      </Link>

      <div className="w-full max-w-2xl space-y-4">
        {flashcards.length === 0 ? (
          <p>No flashcards yet.</p>
        ) : (
          flashcards.map((fc, idx) => (
            <Link
              to={`/view/${idx}`}
              key={idx}
              className="flex items-center bg-white rounded shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-4">
                <FaRegClone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-md font-semibold text-gray-900">{fc.title}</h2>
                <p className="text-sm text-gray-600">Flashcard set ・ {Array.isArray(fc.terms) ? fc.terms.length : 0}  terms</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default App;