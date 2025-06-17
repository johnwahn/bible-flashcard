import { useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

export default function useDebouncedFetchVerse(apiURL, setTerms) {
  const debouncedFetch = useRef(
    debounce(async (verse, index, version) => {
      if (!verse.trim()) return;

      try {
        const res = await axios.get(`${apiURL}/api/fetch-verse`, {
          params: { search: verse, version },
        });

        const passageHtml = res.data.map(v => v.text).join('<br/>');

        setTerms(prev => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index].definition = passageHtml;
          }
          return updated;
        });
      } catch (err) {
        console.error(`Error fetching ${verse} (${version})`, err);
      }
    }, 1500)
  );

  return debouncedFetch.current;
}