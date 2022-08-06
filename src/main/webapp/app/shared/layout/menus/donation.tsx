import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';
import MenuItem from './menu-item';

export const Donation = props => (
  <NavDropdown icon="th-list" name="Donate" id="entity-menu" data-cy="entity" style={{ maxHeight: '80vh', overflow: 'auto' }}>
    <MenuItem icon="user-plus" to="/campaigns" data-cy="create">
      Crypto
    </MenuItem>
    <MenuItem icon="user-plus" to="/nft-campaigns" data-cy="all">
      NFT
    </MenuItem>
    <MenuItem icon="user-plus" to="/organizations" data-cy="all">
      Organization
    </MenuItem>
  </NavDropdown>
);
