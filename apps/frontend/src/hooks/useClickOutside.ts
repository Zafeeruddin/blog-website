import { useEffect } from 'react';

function useClickOutside(ref:any, callback:any) {
  useEffect(() => {
    console.log("clicked out")
    function handleClickOutside(event:any) {
      if (ref.current && !ref.current.contains(event.target) ) {
        console.log("inside")
        callback();
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, callback]);
}

export default useClickOutside;
