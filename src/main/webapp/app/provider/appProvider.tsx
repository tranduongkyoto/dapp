import React, { useState } from 'react';
import { AppContext } from './appContext';
import MoralisType from 'moralis';
import { MyNftProps, NFTAutionProps, UserCustom } from './styles';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState<MoralisType.User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(window.localStorage.getItem('isAdmin') ? true : false);
  const [nftAution, setnftAution] = useState<NFTAutionProps>(
    window.localStorage.getItem('nftAution') ? JSON.parse(window.localStorage.getItem('nftAution')) : null
  );
  const [myNft, setMyNft] = useState<MyNftProps[]>(
    window.localStorage.getItem('myNft') ? JSON.parse(window.localStorage.getItem('myNft')) : []
  );
  const [userList, setUserList] = useState<UserCustom[]>(
    window.localStorage.getItem('userList') ? JSON.parse(window.localStorage.getItem('userList')) : []
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
        myNft,
        setMyNft,
        userList,
        setUserList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
