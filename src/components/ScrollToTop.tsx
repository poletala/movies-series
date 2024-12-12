import { useEffect, useState } from "react";

export const ScrollToTop = () => {

  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    };
  }, []);

  return (
    <div>
      {isVisible && (
        <button className="arrow-up"
          onClick={scrollToTop}>
            &#9650;
        </button>
      )}
    </div>
  )
}
