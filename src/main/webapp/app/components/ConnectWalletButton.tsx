import { Button, useWalletModal, ButtonProps } from '@pancakeswap/uikit';
// import useAuth from 'hooks/useAuth';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery, useWeb3Transfer } from 'react-moralis';
import React, { useContext } from 'react';
import { AppContext } from 'app/provider/appContext';

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  //const { t } = useTranslation();
  //const { login, logout } = useAuth();
  const { Moralis, authenticate, isAuthenticated, account } = useMoralis();
  const { setIsAdmin } = useContext(AppContext);
  async function logIn() {
    let user = Moralis.User.current();
    if (!user) {
      user = await authenticate({
        onSuccess: () => {
          window.localStorage.setItem('provider', 'metamask');
        },
      });
      console.log(user);
      const isAdmin = user.attributes?.isAdmin ? user.attributes?.isAdmin : false;
      setIsAdmin(isAdmin);
      if (isAdmin) {
        window.localStorage.setItem('isAdmin', isAdmin);
      }
    }
  }

  async function logOut() {
    await Moralis.User.logOut();
    console.log('logged out');
    window.localStorage.removeItem('provider');
  }

  const { onPresentConnectModal } = useWalletModal(logIn, logOut, (key: string) => key);

  return (
    <div className="mt-1">
      <Button onClick={onPresentConnectModal} {...props}>
        {children || 'Connect Wallet'}
      </Button>
    </div>
  );
};

export default ConnectWalletButton;
