import { useState, useEffect } from 'react';
import axios from 'axios';

const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 1 day in milliseconds

function useBibleVersions() {
  const [versions, setVersions] = useState({ en: [], ko: [] });
  const awsGatewayURL = import.meta.env.VITE_AWS_GATEWAY_URL;

  useEffect(() => {
    const fetchVersions = async () => {
      const cached = localStorage.getItem('bibleVersions');
      const cachedTime = localStorage.getItem('bibleVersionsCachedTime');

      if (cached && cachedTime && Date.now() - Number(cachedTime) < EXPIRATION_TIME) {
        setVersions(JSON.parse(cached));
        return;
      }

      try {
        const res = await axios.get(`${awsGatewayURL}/api/fetch-versions`);
        const organized = res.data.reduce((acc, v) => {
          const lang = v.language.toLowerCase();
          if (!acc[lang]) acc[lang] = [];
          acc[lang].push(v.version);
          return acc;
        }, {});

        setVersions(organized);
        localStorage.setItem('bibleVersions', JSON.stringify(organized));
        localStorage.setItem('bibleVersionsCachedTime', Date.now().toString());
      } catch (error) {
        console.error('Error fetching Bible versions:', error);
      }
    };

    fetchVersions();
  }, [awsGatewayURL]);

  return versions;
}

export default useBibleVersions;