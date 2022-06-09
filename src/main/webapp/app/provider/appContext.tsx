import { createContext } from 'react';
import MoralisType from 'moralis';
import { NFTAutionProps } from './styles';
export interface AppContextValue {
  user: MoralisType.User | null;
  isAdmin: boolean;
  setUser: (user: MoralisType.User) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  nftAution: NFTAutionProps[];
  setnftAution: (nftAution: NFTAutionProps[]) => void;
}
export const AppContext = createContext<null | AppContextValue>(null);
