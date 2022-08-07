import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { useMoralis } from 'react-moralis';
import { NavDropdown } from './menu-components';
import MenuItem from './menu-item';

export const Organization = props => {
  const { Moralis, account, isInitialized } = useMoralis();
  return (
    <NavDropdown icon="th-list" name="Organization" id="entity-menu" data-cy="entity" style={{ maxHeight: '80vh', overflow: 'auto' }}>
      <MenuItem icon="user-plus" to="/register-org" data-cy="create">
        Register Organization
      </MenuItem>
      <MenuItem icon="user-plus" to={`/your-organization/${account}`} data-cy="all">
        Your Organization
      </MenuItem>
    </NavDropdown>
  );
};
