import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';
import { useMoralis } from 'react-moralis';

export const Nft = props => {
  const { account } = useMoralis();

  return (
    <NavDropdown
      icon="th-list"
      //name={translate('global.menu.campaign.main')}
      name={'NFT'}
      id="entity-menu"
      data-cy="entity"
      style={{ maxHeight: '80vh', overflow: 'auto' }}
    >
      <MenuItem icon="user-plus" to="/nft/mint" data-cy="create">
        {/* <Translate contentKey="global.menu.campaign.create">Create Campaign</Translate> */}
        {translate('global.menu.nft.mint')}
      </MenuItem>
      <MenuItem icon="user-plus" to={`/my-nft/${account}`} data-cy="all">
        {/* <Translate contentKey="global.menu.campaign.all">All Campaigns</Translate> */}
        {translate('global.menu.nft.your')}
      </MenuItem>
    </NavDropdown>
  );
};
