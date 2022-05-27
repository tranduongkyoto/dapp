import { useEffect, useState } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
  Flex,
  LogoutIcon,
  RefreshIcon,
  useModal,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
  UserMenuVariant,
  Box,
} from '@pancakeswap/uikit';
import { Button, useWalletModal, ButtonProps } from '@pancakeswap/uikit';

// import Trans from 'components/Trans'
// import useAuth from 'hooks/useAuth';
// import { useRouter } from 'next/router';
// import { useProfile } from 'state/profile/hooks';
// import { usePendingTransactions } from 'state/transactions/hooks';
import ConnectWalletButton from 'app/components/ConnectWalletButton';
// import { useTranslation } from 'contexts/Localization';
// import { nftsBaseUrl } from 'views/Nft/market/constants';
import WalletModal, { WalletView } from './WalletModal';
import ProfileUserMenuItem from './ProfileUserMenuItem';
import WalletUserMenuItem from './WalletUserMenuItem';
import { useMoralis } from 'react-moralis';
import React from 'react';
import { useHistory } from 'react-router-dom';

const UserMenu = () => {
  //   const router = useRouter();
  //   const { t } = useTranslation();
  const history = useHistory();
  const {
    account,
    isAuthenticated,
    logout,
    deactivateWeb3,
    enableWeb3,
    isWeb3Enabled,
    //isInitialized,
    isWeb3EnableLoading,
    isAuthenticating,
    authenticate,
    Moralis,
  } = useMoralis();
  // const { account, error } = useWeb3React();
  //   const { hasPendingTransactions, pendingNumber } = usePendingTransactions();
  //  const { isInitialized, isLoading, profile } = useProfile();
  const isInitialized = true,
    isLoading = false,
    profile = null;
  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />);
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />);
  const [onPresentWrongNetworkModal] = useModal(<WalletModal initialView={WalletView.WRONG_NETWORK} />);
  // const hasProfile = isInitialized && !!profile;
  const hasProfile = false;
  const avatarSrc = profile?.nft?.image?.thumbnail;
  const [userMenuText, setUserMenuText] = useState<string>('');
  const [userMenuVariable, setUserMenuVariable] = useState<UserMenuVariant>('default');
  // const isWrongNetwork: boolean = error && error instanceof UnsupportedChainIdError;
  const isWrongNetwork = false;

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
            () => history.push(`/nfts/${account}`)
            //router.push(`${nftsBaseUrl}/profile/${account.toLowerCase()}`)
          }
        >
          {'Your NFTs'}
        </UserMenuItem>
        <ProfileUserMenuItem isLoading={isLoading} hasProfile={hasProfile} disabled={isWrongNetwork} />
        <UserMenuDivider />
        <UserMenuItem as="button" onClick={logout}>
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            {'Disconnect'}
            <LogoutIcon />
          </Flex>
        </UserMenuItem>
      </>
    );
  };

  if (account) {
    return (
      <div className="">
        <UIKitUserMenu account={account} avatarSrc={avatarSrc} text={userMenuText} variant={userMenuVariable}>
          {/* {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)} */}
          <UserMenuItems />
        </UIKitUserMenu>
      </div>
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
    <ConnectWalletButton scale="sm">
      <Box display={['none', , , 'block']}>Connect Wallet</Box>
      <Box display={['block', , , 'none']}>Connect</Box>
    </ConnectWalletButton>
  );
};

export default UserMenu;
