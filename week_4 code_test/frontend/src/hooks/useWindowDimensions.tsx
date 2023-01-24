import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

/*
  TODO:
  need to understand and rewritte cleanup, and add debounce

  called by:
  const { height, width } = useWindowDimensions();
*/
export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  console.log("viewPort hook", windowDimensions)

  useEffect(() => {
    console.log("viewPort hook: useeffect")
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
