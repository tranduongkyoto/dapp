import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';
import { useMoralis } from 'react-moralis';

export const Campaign = props => {
  const { Moralis, account, isInitialized } = useMoralis();
  return (
    <NavDropdown
      icon="th-list"
      name={translate('global.menu.campaign.main')}
      id="entity-menu"
      data-cy="entity"
      style={{ maxHeight: '80vh', overflow: 'auto' }}
    >
      <MenuItem icon="user-plus" to="/campaign/create" data-cy="create">
        <Translate contentKey="global.menu.campaign.create">Create Campaign</Translate>
      </MenuItem>
      <MenuItem icon="user-plus" to="/start-nft-campaigns" data-cy="create">
        <Translate contentKey="global.menu.campaign.startnft"></Translate>
      </MenuItem>
      <MenuItem icon="user-plus" to={`/your-nft-auction/${account}`} data-cy="all">
        {translate('global.menu.campaign.auction')}
      </MenuItem>
      <MenuItem icon="user-plus" to={`/your-campaign/${account}`} data-cy="all">
        {translate('global.menu.campaign.campaign')}
      </MenuItem>
    </NavDropdown>
  );
};
