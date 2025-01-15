

import { useEffect, useState } from 'react';

const ThemeChecker = ({ toggleTheme }) => {
  
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-color-scheme');
    toggleTheme(currentTheme);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-color-scheme') {
          const newTheme = mutation.target.getAttribute('data-color-scheme');
          toggleTheme(newTheme);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-color-scheme'],
    });

    return () => {
      observer.disconnect();
    };
  }, [toggleTheme]);

  return null;
};

export default ThemeChecker;