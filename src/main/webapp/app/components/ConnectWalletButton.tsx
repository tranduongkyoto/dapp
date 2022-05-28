import { Button, useWalletModal, ButtonProps } from '@pancakeswap/uikit';
// import useAuth from 'hooks/useAuth';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery, useWeb3Transfer } from 'react-moralis';
import React from 'react';

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  //const { t } = useTranslation();
  //const { login, logout } = useAuth();
  const { Moralis, authenticate, isAuthenticated } = useMoralis();
  async function logIn() {
    console.log('LogIn');
    let user = Moralis.User.current();
    if (!user) {
      user = await authenticate({
        onSuccess: () => {
          window.localStorage.setItem('provider', 'metamask');
        },
      });
    }
    console.log('logged in user:', user);
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
