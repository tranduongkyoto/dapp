import React, { useState } from 'react';
import { AppContext } from './appContext';
import MoralisType from 'moralis';
import { NFTAutionProps } from './styles';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState<MoralisType.User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(window.localStorage.getItem('isAdmin') ? true : false);
  const [nftAution, setnftAution] = useState<NFTAutionProps[]>(
    window.localStorage.getItem('nftAution') ? JSON.parse(window.localStorage.getItem('nftAution')) : []
  );
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAdmin,
        setIsAdmin,
        nftAution,
        setnftAution,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
