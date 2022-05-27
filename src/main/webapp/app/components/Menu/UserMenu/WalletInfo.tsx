import { Box, Button, Flex, InjectedModalProps, LinkExternal, Message, Skeleton, Text } from '@pancakeswap/uikit';
import { useWeb3React } from '@web3-react/core';
// import tokens from 'config/constants/tokens'
// import { FetchStatus } from 'config/constants/types'
// import { useTranslation } from 'contexts/Localization';
// import useAuth from 'hooks/useAuth';
// import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance';

// import { getBscScanLink } from 'utils';
// import { formatBigNumber, getFullDisplayBalance } from 'utils/formatBalance';
import CopyAddress from './CopyAddress';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction, useMoralisQuery, useWeb3Transfer } from 'react-moralis';
import React from 'react';

interface WalletInfoProps {
  hasLowBnbBalance: boolean;
  onDismiss: InjectedModalProps['onDismiss'];
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowBnbBalance, onDismiss }) => {
  // const { t } = useTranslation();
  const { Moralis } = useMoralis();
  const { account } = useWeb3React();
  // const { balance, fetchStatus } = useGetBnbBalance();
  const balance = 99999999999999999;
  // const { balance: cakeBalance, fetchStatus: cakeFetchStatus } = useTokenBalance(tokens.cake.address);
  const cakeBalance = 9999999999999999;
  async function logout() {
    await Moralis.User.logOut();
    console.log('logged out');
  }

  const handleLogout = () => {
    onDismiss?.();
    logout();
  };

  return (
    <>
      <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
        {'Your Address'}
      </Text>
      {/* <CopyAddress account={account} mb="24px" /> */}
      {hasLowBnbBalance && (
        <Message variant="warning" mb="24px">
          <Box>
            <Text fontWeight="bold">{'BNB Balance Low'}</Text>
            <Text as="p">{'You need BNB for transaction fees.'}</Text>
          </Box>
        </Message>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{'BNB Balance'}</Text>
        {/* {fetchStatus !== FetchStatus.Fetched ? <Skeleton height="22px" width="60px" /> : <Text>{formatBigNumber(balance, 6)}</Text>} */}
        {<Text>{balance}</Text>}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text color="textSubtle">{'CAKE Balance'}</Text>
        {/* {cakeFetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{getFullDisplayBalance(cakeBalance, 18, 3)}</Text>
        )} */}
        {<Text>{cakeBalance}</Text>}
      </Flex>
      <Flex alignItems="center" justifyContent="end" mb="24px">
        {/* <LinkExternal href={getBscScanLink(account, 'address')}>{t('View on BscScan')}</LinkExternal> */}
        <LinkExternal href={account}>{'View on BscScan'}</LinkExternal>
      </Flex>
      <Button variant="secondary" width="100%" onClick={handleLogout}>
        {'Disconnect Wallet'}
      </Button>
    </>
  );
};

export default WalletInfo;
