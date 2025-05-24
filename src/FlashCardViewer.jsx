import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function FlashcardViewer() {
  const { index } = useParams();
  const [flashcard, setFlashcard] = useState(null);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('flashcards');
    if (saved) {
      const data = JSON.parse(saved);
      setFlashcard(data[index]);
    }
  }, [index]);

  if (!flashcard) return <p>Loading...</p>;

  const next = () => {
    setCurrent((prev) => (prev + 1) % flashcard.terms.length);
    setFlipped(false);
  };

  const prev = () => {
    setCurrent((prev) =>
      (prev - 1 + flashcard.terms.length) % flashcard.terms.length
    );
    setFlipped(false);
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <Link to="/" className="mb-4 text-blue-600 hover:underline">← Back</Link>
      <h1 className="text-xl font-bold mb-2">{flashcard.title}</h1>
      <p className="mb-4 text-gray-600">{flashcard.description}</p>

      <div className="w-full max-w-md card-container mb-4">
        <div
          className={`bg-white rounded shadow text-center cursor-pointer card-flip ${flipped ? 'card-flip-inner' : ''}`}
          onClick={() => setFlipped(!flipped)}
        >
          <div className="card-front">
            <p className="text-lg break-words">{flashcard.terms[current].term}</p>
          </div>
          <div className="card-back">
            <p
              className="text-lg break-words"
              dangerouslySetInnerHTML={{ __html: flashcard.terms[current].definition }}
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Click to {flipped ? 'see reference' : 'see passage'}
        </p>
      </div>


        <div className="flex space-x-4 mt-4">
            <button
                onClick={prev}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
                Previous
            </button>

            <button
                onClick={next}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Next
            </button>
        </div>
    </div>
  );
}

export default FlashcardViewer;