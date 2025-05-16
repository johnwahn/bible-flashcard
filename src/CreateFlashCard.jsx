import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce';

function CreateFlashcard() {
  const navigate = useNavigate();
  const [terms, setTerms] = useState([{ term: '', definition: '' }]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const termRefs = useRef([]);

  const handleTermChange = (index, field, value) => {
    const updated = [...terms];
    updated[index][field] = value;
    setTerms(updated);
  };

  const addTerm = () => {
    setTerms([...terms, { term: '', definition: '' }]);
  };

  const removeTerm = (index) => {
    const updated = terms.filter((_, i) => i !== index);
    setTerms(updated);
  };

  const saveFlashcard = () => {
    const newCard = { title, description, terms };
    const saved = localStorage.getItem('flashcards');
    const flashcards = saved ? JSON.parse(saved) : [];
    localStorage.setItem('flashcards', JSON.stringify([...flashcards, newCard]));
    navigate('/');
  };

  // Debounced API call logic
  const debouncedFetchVerse = useRef(
    debounce(async (verse, index) => {
      if (!verse.trim()) return;
      try {
        console.log("verse is ", verse);
        const res = await axios.get(`https://api.scripture.api.bible/v1/bibles/65eec8e0b60e656b-01/passages?reference=${encodeURIComponent(verse)}`,
            {
                headers: {
                    'api-key': '5d7829b791f4fbae09dd829fddb25d8a', 
                }
            }
        );

        // Access the passage content
        const passageHtml = res.data.data[0].content;
        // Use functional setState to update from latest state
        setTerms(prevTerms => {
        const updated = [...prevTerms];
        if (updated[index]) {
          updated[index] = {
            ...updated[index],
            definition: passageHtml,
          };
        }
        return updated;
      });
      } catch (err) {
        console.error('Error fetching verse:', verse);
      }
    }, 1000)
  ).current;

  // Watch for changes to `terms.term`
  useEffect(() => {
    terms.forEach((t, i) => {
      debouncedFetchVerse(t.term, i);
    });
  }, [terms.map(t => t.term).join('|'), terms.length]); // triggers effect only when length of `terms` change

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white p-6 rounded shadow w-full max-w-3xl flex flex-col space-y-4">
        <h1 className="text-xl font-bold text-center w-full">📝 Create a New Flashcard Set</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Enter a title, like 'Book of John - Chapter 3'"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Add a description..."
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        {terms.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <input
              className="flex-1 border p-2 rounded"
              placeholder="e.g. John 3:16"
              value={item.term ?? ''}
              onChange={(e) => handleTermChange(index, 'term', e.target.value)}
            />
            <div
                className="flex-1 border p-2 rounded bg-gray-50 overflow-auto"
                dangerouslySetInnerHTML={{ __html: item.definition }}
            />
            <button
              onClick={() => removeTerm(index)}
              className="text-red-500 hover:text-red-700"
            >
              ❌
            </button>
          </div>
        ))}

        <button
          onClick={addTerm}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ➕ Add Term
        </button>

        <button
          onClick={saveFlashcard}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          ✅ Save Flashcard
        </button>
      </div>
    </div>
  );
}

export default CreateFlashcard;
