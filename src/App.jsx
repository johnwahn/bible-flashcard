import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegClone, FaEdit, FaTrash } from 'react-icons/fa';

function App() {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState(() => {
    const saved = localStorage.getItem('flashcards');
    return saved ? JSON.parse(saved) : [];
  });

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this flashcard set?")) {
      const updated = [...flashcards];
      updated.splice(index, 1);
      setFlashcards(updated);
      localStorage.setItem('flashcards', JSON.stringify(updated));
    }
  };

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
            <div
              key={idx}
              className="flex justify-between items-center bg-white rounded shadow p-4 hover:shadow-md transition-shadow"
            >
              <Link to={`/view/${idx}`} className="flex items-center flex-1 mr-4">
                <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-4">
                  <FaRegClone className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-md font-semibold text-gray-900">{fc.title}</h2>
                  <p className="text-sm text-gray-600">
                    Flashcard set ・ {Array.isArray(fc.terms) ? fc.terms.length : 0} terms
                  </p>
                </div>
              </Link>

              {/* Icon Buttons */}
              <div className="flex items-center space-x-3">
                <Link to={`/edit/${idx}`} className="text-blue-500 hover:text-blue-700">
                  <FaEdit className="w-5 h-5" title="Edit" />
                </Link>
                <button
                  onClick={() => handleDelete(idx)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
