import { useEffect } from 'react';

/**
 * Attaches an outside click listener to a ref and calls a handler when a click outside occurs.
 * @param {Object} ref - React ref to the DOM node you want to monitor.
 * @param {Function} handler - Function to call when an outside click is detected.
 */
function useClickOutside(ref, handler) {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, handler]);
}

export default useClickOutside;
