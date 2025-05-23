import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditFlashcard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState([]);
  const [title, setTitle] = useState('');
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('flashcards');
    if (saved) {
      const data = JSON.parse(saved);
      setFlashcards(data);
      const fc = data[parseInt(id)];
      if (fc) {
        setTitle(fc.title);
        setTerms(fc.terms || []);
      }
    }
  }, [id]);

  const handleTermChange = (index, field, value) => {
    const updated = [...terms];
    updated[index][field] = value;
    setTerms(updated);
  };

  const handleAddTerm = () => {
    setTerms([...terms, { term: '', definition: '' }]);
  };

  const handleRemoveTerm = (index) => {
    const updated = [...terms];
    updated.splice(index, 1);
    setTerms(updated);
  };

  const handleSave = () => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[parseInt(id)] = {
      ...updatedFlashcards[parseInt(id)],
      title,
      terms,
    };
    setFlashcards(updatedFlashcards);
    localStorage.setItem('flashcards', JSON.stringify(updatedFlashcards));
    navigate('/');
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

      <div className="w-full max-w-md space-y-4">
        {terms.map((t, idx) => (
          <div key={idx} className="mb-2">
            <input
              type="text"
              value={t.term}
              onChange={(e) => handleTermChange(idx, 'term', e.target.value)}
              placeholder="Verse (e.g., Proverbs 3:24)"
              className="border p-2 rounded w-full mb-1"
            />
            <textarea
              value={t.definition}
              onChange={(e) => handleTermChange(idx, 'definition', e.target.value)}
              placeholder="Definition"
              className="border p-2 rounded w-full mb-1"
            />
            <button
              onClick={() => handleRemoveTerm(idx)}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={handleAddTerm}
          className="mb-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          ➕ Add Term
        </button>
      </div>

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
