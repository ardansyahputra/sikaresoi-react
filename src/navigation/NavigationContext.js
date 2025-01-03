import React, {createContext, useContext, useState} from 'react';

// Buat Context
const NavigationContext = createContext();

// Provider
export const NavigationProvider = ({children}) => {
  const [currentScreen, setCurrentScreen] = useState('');
  const screensWithoutTab = ['Login', 'PerubahanPresensi']; // Tambahkan layar selain Login

  const shouldShowTabNavigator = !screensWithoutTab.includes(currentScreen);

  return (
    <NavigationContext.Provider
      value={{currentScreen, setCurrentScreen, shouldShowTabNavigator}}>
      {children}
    </NavigationContext.Provider>
  );
};

// Hook untuk menggunakan context
export const useNavigationContext = () => useContext(NavigationContext);
