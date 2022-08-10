import {
  Box,
  Flex,
  LogoutIcon,
  useModal,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
  UserMenuVariant,
} from '@pancakeswap/uikit';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { default as MoralisType } from 'moralis/types';
import { useContext, useEffect, useState } from 'react';

// import Trans from 'components/Trans'
// import useAuth from 'hooks/useAuth';
// import { useRouter } from 'next/router';
// import { useProfile } from 'state/profile/hooks';
// import { usePendingTransactions } from 'state/transactions/hooks';
import ConnectWalletButton from 'app/components/ConnectWalletButton';
// import { useTranslation } from 'contexts/Localization';
// import { nftsBaseUrl } from 'views/Nft/market/constants';
import { AppContext } from 'app/provider/appContext';
import React from 'react';
import { useMoralis } from 'react-moralis';
import { useHistory } from 'react-router-dom';
import ProfileUserMenuItem from './ProfileUserMenuItem';
import WalletModal, { WalletView } from './WalletModal';
import WalletUserMenuItem from './WalletUserMenuItem';
import { ethers } from 'ethers';
type web3StatusType = 'disconnected' | 'pending' | 'only_web3';
const UserMenu = () => {
  //   const router = useRouter();
  //   const { t } = useTranslation();
  const moralisAuth = true;
  const signingMessage = 'Moralis Authentication';
  const history = useHistory();
  const {
    account,
    isAuthenticated,
    logout,
    deactivateWeb3,
    enableWeb3,
    isWeb3Enabled,
    isInitialized,
    isWeb3EnableLoading,
    isAuthenticating,
    authenticate,
    Moralis,
    user,
  } = useMoralis();
  const isLoading = false,
    profile = null;
  const { error } = useWeb3React();

  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />);
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />);
  const [onPresentWrongNetworkModal] = useModal(<WalletModal initialView={WalletView.WRONG_NETWORK} />);
  const hasProfile = false;
  const avatarSrc = profile?.nft?.image?.thumbnail;
  const [userMenuText, setUserMenuText] = useState<string>('');
  const [userMenuVariable, setUserMenuVariable] = useState<UserMenuVariant>('default');
  const isWrongNetwork: boolean = error && error instanceof UnsupportedChainIdError;
  const [web3Status, setWeb3Status] = useState<web3StatusType>('disconnected');
  const { setUser, setIsAdmin } = useContext(AppContext);

  if (error) {
    console.log(error);
  }
  useEffect(() => {
    if (typeof window == 'undefined') return;

    const provider = window.localStorage.getItem('provider') as MoralisType.Web3ProviderType;
    if (!isWeb3Enabled && !isWeb3EnableLoading && provider && web3Status === 'disconnected') {
      // @ts-ignore
      setWeb3Status('pending');
      enableWeb3({
        provider,
        onSuccess: () => setWeb3Status('only_web3'),
      });
    }
  }, [isWeb3Enabled, isWeb3EnableLoading, web3Status]);

  useEffect(() => {
    // to avoid problems in Next.JS apps because of window object
    if (typeof window == 'undefined') return;

    const provider = window.localStorage.getItem('provider') as MoralisType.Web3ProviderType;
    if (isInitialized && !isAuthenticated && !isAuthenticating && isWeb3Enabled && moralisAuth && web3Status === 'only_web3') {
      console.log('TEST');
      authenticate({
        provider,
        //chainId,
        signingMessage,
      });
    }
  }, [isAuthenticated, isInitialized, isWeb3Enabled, isAuthenticating]);
  useEffect(() => {
    Moralis.onAccountChanged(address => {
      console.log('TEST');
      if (!address) disconnectWallet();
    });
  }, []);

  async function disconnectWallet() {
    // to avoid problems in Next.JS apps because of localStorage
    if (typeof window == 'undefined') return;

    window.localStorage.removeItem('provider');

    deactivateWeb3();
    if (isInitialized) {
      console.log('Log out');
      logout();
    }
  }
  //   useEffect(() => {
  //     if (hasPendingTransactions) {
  //       //setUserMenuText(t('%num% Pending', { num: pendingNumber }));
  //       setUserMenuVariable('pending');
  //     } else {
  //       setUserMenuText('');
  //       setUserMenuVariable('default');
  //     }
  //   }, [hasPendingTransactions, pendingNumber]);

  const onClickWalletMenu = (): void => {
    if (isWrongNetwork) {
      onPresentWrongNetworkModal();
    } else {
      onPresentWalletModal();
    }
  };
  const UserMenuItems = () => {
    return (
      <>
        <WalletUserMenuItem isWrongNetwork={isWrongNetwork} onPresentWalletModal={onClickWalletMenu} />
        <UserMenuItem as="button" disabled={isWrongNetwork} onClick={onPresentTransactionModal}>
          {'Recent Transactions'}
          {/* {hasPendingTransactions && <RefreshIcon spin />} */}
        </UserMenuItem>
        <UserMenuDivider />
        <UserMenuItem
          as="button"
          disabled={isWrongNetwork}
          onClick={
            () => history.push(`/my-nft/${account}`)
            //router.push(`${nftsBaseUrl}/profile/${account.toLowerCase()}`)
          }
        >
          {'Your NFTs'}
        </UserMenuItem>
        <ProfileUserMenuItem
          isLoading={isLoading}
          hasProfile={user && user.attributes?.isUpdateProfile}
          disabled={isWrongNetwork}
          address={account}
        />
        <UserMenuDivider />
        <UserMenuItem
          as="button"
          onClick={() => {
            setUser(null);
            setIsAdmin(false);
            //logout();
            disconnectWallet();
            window.localStorage.clear();
          }}
        >
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            {'Disconnect'}
            <LogoutIcon />
          </Flex>
        </UserMenuItem>
      </>
    );
  };

  if (!account || (isInitialized && !isAuthenticated)) {
    return (
      <ConnectWalletButton scale="sm">
        <Box display={['none', , , 'block']}>Connect Wallet</Box>
        <Box display={['block', , , 'none']}>Connect</Box>
      </ConnectWalletButton>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className="">
        <UIKitUserMenu text={'Network'} variant="danger">
          {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
        </UIKitUserMenu>
      </div>
    );
  }

  return (
    <div className="">
      <UIKitUserMenu account={account} avatarSrc={avatarSrc} text={userMenuText} variant={userMenuVariable}>
        {/* {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)} */}
        <UserMenuItems />
      </UIKitUserMenu>
    </div>
  );
};

export default UserMenu;
