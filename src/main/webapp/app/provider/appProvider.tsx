import React, { useState } from 'react';
import { AppContext } from './appContext';
import MoralisType from 'moralis';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState<MoralisType.User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(window.localStorage.getItem('isAdmin') ? true : false);
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
