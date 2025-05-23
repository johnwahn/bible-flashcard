import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function BibleVersionDropdown({ selectedVersion, setSelectedVersion }) {
  const [isOpen, setIsOpen] = useState(false);
  const [versions, setVersions] = useState({ en: [], ko: [] });

  const dropdownRef = useRef(null); // 👈 Add ref to detect outside clicks

  const awsGatewayURL = import.meta.env.VITE_AWS_GATEWAY_URL;
  const gateWayKey = import.meta.env.VITE_AWS_GATEWAY_KEY;
  const localHost = import.meta.env.VITE_LOCAL_HOST_URL;

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await axios.get(`${localHost}/bible-versions`, {
          headers: { 'x-api-key': gateWayKey },
        });

        const organized = res.data.reduce((acc, v) => {
          const lang = v.language.toLowerCase();
          if (!acc[lang]) acc[lang] = [];
          acc[lang].push(v.version);
          return acc;
        }, {});

        setVersions(organized);
      } catch (error) {
        console.error('Error fetching Bible versions:', error);
      }
    };

    fetchVersions();
  }, []);

  // 👇 Add outside click listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
