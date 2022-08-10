import { Button, useWalletModal, ButtonProps } from '@pancakeswap/uikit';
// import useAuth from 'hooks/useAuth';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery, useWeb3Transfer } from 'react-moralis';
import React, { useContext } from 'react';
import { AppContext } from 'app/provider/appContext';
import { ethers } from 'ethers';
import { useNotificationCustom } from 'app/web3utils/notification';
import { ExternalProvider } from '@ethersproject/providers';

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  //const { t } = useTranslation();
  //const { login, logout } = useAuth();
  const { Moralis, authenticate, isAuthenticated, account } = useMoralis();
  const { setIsAdmin } = useContext(AppContext);
  const { handleNewNotification } = useNotificationCustom();
  const setupNetwork = async (externalProvider?: ExternalProvider) => {
    const provider = externalProvider || window.ethereum;
    const chainId = 97; //parseInt('97', 10) as keyof typeof NETWORK_CONFIG;
    // if (!NETWORK_CONFIG[chainId]) {
    //   console.error('Invalid chain id');
    //   return false;
    // }
    if (provider) {
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        return true;
      } catch (switchError) {
        if ((switchError as any)?.code === 4902) {
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${chainId.toString(16)}`,
                  chainName: 'BNB Smart Chain Testnet',
                  nativeCurrency: {
                    name: 'BNB',
                    symbol: 'bnb',
                    decimals: 18,
                  },
                  rpcUrls: ['https://data-seed-prebsc-2-s2.binance.org:8545'],
                  blockExplorerUrls: 'https://testnet.bscscan.com',
                },
              ],
            });
            return true;
          } catch (error) {
            console.error('Failed to setup the network in Metamask:', error);
            return false;
          }
        }
        return false;
      }
    } else {
      console.error("Can't setup the BSC network on metamask because window.ethereum is undefined");
      return false;
    }
  };
  async function logIn() {
    if (window?.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      const { chainId } = await provider.getNetwork();
      if (chainId !== 97) {
        const hasSetup = await setupNetwork();
        if (hasSetup) logIn();
      } else {
        let user = Moralis.User.current();
        if (!user) {
          user = await authenticate({
            onSuccess: data => {
              console.log(data);
              window.localStorage.setItem('provider', 'metamask');
            },
            onError: error => {
              console.log(error);
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
    } else {
      handleNewNotification('error', 'Please Intall Metamask to Connect');
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
        {children || 'Kết nối ví'}
      </Button>
    </div>
  );
};

export default ConnectWalletButton;
