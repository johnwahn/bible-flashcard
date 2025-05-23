import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditFlashcard() {
  const { id } = useParams(); // id is the index of the flashcard
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState([]);
  const [title, setTitle] = useState('');
  const [terms, setTerms] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('flashcards');
    if (saved) {
      const data = JSON.parse(saved);
      setFlashcards(data);
      const fc = data[parseInt(id)];
      if (fc) {
        setTitle(fc.title);
        setTerms(fc.terms.join('\n'));
      }
    }
  }, [id]);

  const handleSave = () => {
    const updated = [...flashcards];
    updated[parseInt(id)] = {
      title,
      terms: terms.split('\n').filter((line) => line.trim() !== ''),
    };
    setFlashcards(updated);
    localStorage.setItem('flashcards', JSON.stringify(updated));
    navigate('/'); // go back to main page
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h2 className="text-xl font-bold mb-4">✏️ Edit Flashcard</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full max-w-md mb-4 px-4 py-2 border rounded"
      />

      <textarea
        value={terms}
        onChange={(e) => setTerms(e.target.value)}
        placeholder="Enter terms (one per line)"
        rows={10}
        className="w-full max-w-md mb-4 px-4 py-2 border rounded"
      />

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        💾 Save Changes
      </button>
    </div>
  );
}

export default EditFlashcard;
