import { createContext } from 'react';
import MoralisType from 'moralis';
export interface AppContextValue {
  user: MoralisType.User | null;
  isAdmin: boolean;
  setUser: (user: MoralisType.User) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}
export const AppContext = createContext<null | AppContextValue>(null);
