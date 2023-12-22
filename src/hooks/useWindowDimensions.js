import { useEffect, useState } from "react";

function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({ width: "", height: "" });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    glWidth: dimensions.width,
    glHeight: dimensions.height,
  };
}

export { useWindowDimensions };
