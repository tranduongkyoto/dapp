import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';
import MenuItem from './menu-item';
export const Donation = props => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.donation.main')}
    id="entity-menu"
    data-cy="entity"
    style={{ maxHeight: '80vh', overflow: 'auto' }}
  >
    <MenuItem icon="user-plus" to="/campaigns" data-cy="create">
      {translate('global.menu.donation.crypto')}
    </MenuItem>
    <MenuItem icon="user-plus" to="/nft-campaigns" data-cy="all">
      {translate('global.menu.donation.nft')}
    </MenuItem>
    <MenuItem icon="user-plus" to="/organizations" data-cy="all">
      {translate('global.menu.donation.org')}
    </MenuItem>
  </NavDropdown>
);
