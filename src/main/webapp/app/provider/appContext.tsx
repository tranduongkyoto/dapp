import { createContext } from 'react';
import MoralisType from 'moralis';
import { MyNftProps, NFTAutionProps, UserCustom } from './styles';
export interface AppContextValue {
  user: MoralisType.User | null;
  isAdmin: boolean;
  setUser: (user: MoralisType.User) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  nftAution: NFTAutionProps;
  setnftAution: (nftAution: NFTAutionProps) => void;
  myNft: MyNftProps[];
  setMyNft: (myNft: MyNftProps[]) => void;
  userList: UserCustom[] | null;
  setUserList: (list: UserCustom[]) => void;
}
export const AppContext = createContext<null | AppContextValue>(null);
