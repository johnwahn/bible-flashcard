import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce';
import BibleVersionDropdown from './BibleVersionDropdown';

function CreateFlashcard() {
  const navigate = useNavigate();
  const [terms, setTerms] = useState([{ term: '', definition: '', version: 'ESV' }]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const awsGatewayURL = import.meta.env.VITE_AWS_GATEWAY_URL;
  const gateWayKey = import.meta.env.VITE_AWS_GATEWAY_KEY;
  const localHost = "http://127.0.0.1:5000"
  

  const handleTermChange = (index, field, value) => {
    const updated = [...terms];
    updated[index][field] = value;
    setTerms(updated);
  };

  const addTerm = () => {
    setTerms([...terms, { term: '', definition: '', version: 'ESV' }]);
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

  const debouncedFetchVerse = useRef(
    debounce(async (verse, index, version) => {
      if (!verse.trim()) return;
      try {
        const res = await axios.get(`${localHost}/api/fetch-verse`, {
          params: { search: verse, version },
        });

        const passageHtml = res.data.map(v => v.text).join('<br/>');

        setTerms(prevTerms => {
          const updated = [...prevTerms];
          if (updated[index]) {
            updated[index].definition = passageHtml;
          }
          return updated;
        });
      } catch (err) {
        console.error(`Error fetching ${verse} (${version})`, err);
      }
    }, 1000)
  ).current;

  useEffect(() => {
    terms.forEach((t, i) => {
      debouncedFetchVerse(t.term, i, t.version);
    });
  }, [terms.map(t => `${t.term}-${t.version}`).join('|'), terms.length]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white p-6 rounded shadow w-full max-w-6xl flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center w-full">📝 Create a New Flashcard Set</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Enter a title"
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
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-start gap-4 w-full"
          >
            {/* 1. Verse input */}
            <input
              className="flex-[2] border p-2 rounded"
              placeholder="e.g. John 3:16"
              value={item.term}
              onChange={(e) => handleTermChange(index, 'term', e.target.value)}
            />

            {/* 2. Bible passage */}
            <div
              className="flex-[3] border p-2 rounded bg-gray-50 max-h-48 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: item.definition }}
            />

            {/* 3. Version dropdown */}
            <div className="flex-[1]">
              <BibleVersionDropdown
                selectedVersion={item.version}
                setSelectedVersion={(val) => handleTermChange(index, 'version', val)}
              />
            </div>

            {/* Remove button */}
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
