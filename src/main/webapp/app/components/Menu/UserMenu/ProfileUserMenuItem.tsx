import styled from 'styled-components';
import { Flex, Skeleton, UserMenuItem } from '@pancakeswap/uikit';
import { useWeb3React } from '@web3-react/core';
// import { useTranslation } from 'contexts/Localization'
// import { nftsBaseUrl } from 'views/Nft/market/constants';
// import { useRouter } from 'next/router';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { translate } from 'react-jhipster';

interface ProfileUserMenuItemProps {
  isLoading: boolean;
  hasProfile: boolean;
  disabled: boolean;
  address: string;
}

const Dot = styled.div`
  background-color: ${({ theme }) => theme.colors.failure};
  border-radius: 50%;
  height: 8px;
  width: 8px;
`;

const ProfileUserMenuItem: React.FC<ProfileUserMenuItemProps> = ({ isLoading, hasProfile, disabled, address }) => {
  const { account } = useWeb3React();
  const history = useHistory();
  // const router = useRouter();
  // const { t } = useTranslation();

  const handleClick = () => {
    history.push(`/account/${address}`);
  };

  const handleNoProfileClick = () => {
    //router.push('/create-profile');
    history.push('/account/profile');
  };

  if (isLoading) {
    return (
      <UserMenuItem>
        <Skeleton height="24px" width="35%" />
      </UserMenuItem>
    );
  }

  if (!hasProfile) {
    return (
      <UserMenuItem as="button" disabled={disabled} onClick={handleNoProfileClick}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          {translate('user-menu.update')}
          <Dot />
        </Flex>
      </UserMenuItem>
    );
  }

  return (
    <>
      <UserMenuItem as="button" disabled={disabled} onClick={handleNoProfileClick}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          {translate('user-menu.update')}
        </Flex>
      </UserMenuItem>
      <UserMenuItem as="button" disabled={disabled} onClick={handleClick}>
        {translate('user-menu.profile')}
      </UserMenuItem>
    </>
  );
};

export default ProfileUserMenuItem;
