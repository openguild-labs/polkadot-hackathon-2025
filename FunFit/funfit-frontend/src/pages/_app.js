import Layout from '../components/Layout/layout';
import 'tailwindcss/tailwind.css';
import { config } from '@/config';
import Web3ModalProvider from '@/context';
import Tutorial from "@/components/Tutorial/onboarding";
import { useState, useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Initial check
    const value = localStorage.getItem('isNewUser') || "0";
    setShowTutorial(value === "0");

    // Listen for changes
    const handleStorageChange = (e) => {
      if (e.key === 'isNewUser') {
        setShowTutorial(e.newValue === "0");
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event from Tutorial
    const handleTutorialComplete = () => {
      setShowTutorial(false);
    };
    window.addEventListener('tutorialComplete', handleTutorialComplete);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tutorialComplete', handleTutorialComplete);
    };
  }, []);

  return (
    <Web3ModalProvider>
      <Layout>
        {showTutorial && <Tutorial />}
        <Component {...pageProps} />
      </Layout>
    </Web3ModalProvider>
  );
}