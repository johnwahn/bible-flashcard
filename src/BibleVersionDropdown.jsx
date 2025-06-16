import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import useClickOutside from './customHooks/useClickOutside';

function BibleVersionDropdown({ selectedVersion, setSelectedVersion, versions }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // 👈 Add ref to detect outside clicks

  // 👇 Add outside click listener
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleSelect = (version) => {
    setSelectedVersion(version);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full text-left p-2 border rounded bg-white"
      >
        {selectedVersion} ▾
      </button>

      {isOpen && ( 
        <div className="absolute z-10 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-y-auto">
          {Object.entries(versions).map(([lang, list]) => (
            <div key={lang}>
              <div className="p-2 font-bold text-gray-700">
                {lang === 'en' ? 'English' : '한글'}
              </div>
              {list.map((ver) => (
                <div
                  key={ver}
                  onClick={() => handleSelect(ver)}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  {ver}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BibleVersionDropdown;
