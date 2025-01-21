import React, {createContext, useContext, useState} from 'react';

// Buat Context
const NavigationContext = createContext();

// Provider
export const NavigationProvider = ({children}) => {
  const [currentScreen, setCurrentScreen] = useState('');

  // Hanya layar yang ingin ditampilkan Tab Navigator
  const screensWithTab = ['Home', 'Presensi', 'User'];

  console.log('Current Screen in Context:', currentScreen);

  // Logika untuk menentukan apakah Tab Navigator ditampilkan
  const shouldShowTabNavigator = screensWithTab.includes(currentScreen);

  return (
    <NavigationContext.Provider
      value={{currentScreen, setCurrentScreen, shouldShowTabNavigator}}>
      {children}
    </NavigationContext.Provider>
  );
};

// Hook untuk menggunakan context
export const useNavigationContext = () => useContext(NavigationContext);
