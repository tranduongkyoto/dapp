import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';

export const Campaign = props => (
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
      <Translate contentKey="global.menu.campaign.startnft">Create Campaign</Translate>
    </MenuItem>
    <MenuItem icon="user-plus" to="/nft-campaigns" data-cy="all">
      <Translate contentKey="global.menu.campaign.nft">Create Campaign</Translate>
    </MenuItem>
    <MenuItem icon="user-plus" to="/campaigns" data-cy="all">
      <Translate contentKey="global.menu.campaign.all">All Campaigns</Translate>
    </MenuItem>
  </NavDropdown>
);
