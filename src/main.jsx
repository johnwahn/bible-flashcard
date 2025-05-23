import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import CreateFlashcard from './CreateFlashCard';
import FlashcardViewer from './FlashCardViewer';
import EditFlashcard from './EditFlashcard';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create" element={<CreateFlashcard />} />
        <Route path="/view/:index" element={<FlashcardViewer />} />
        <Route path="/edit/:id" element={<EditFlashcard />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
