import { useLocation } from 'react-router-dom';

export default function useCheckActiveNav() {
  const { pathname } = useLocation();

  const checkActiveNav = (nav) => {
    // Ensure nav is a valid string before processing
    if (!nav || typeof nav !== 'string') {
      return false;
    }

    const pathArray = pathname.split('/').filter((item) => item !== '');

    // Check if the nav is root
    if (nav === '/' && pathArray.length < 1) return true;

    // Use replace only if nav is a string
    return pathArray.includes(nav.replace(/^\//, ''));
  };

  return { checkActiveNav };
}
