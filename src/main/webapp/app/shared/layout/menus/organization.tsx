import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';
import MenuItem from './menu-item';

export const Organization = props => (
  <NavDropdown icon="th-list" name="Organization" id="entity-menu" data-cy="entity" style={{ maxHeight: '80vh', overflow: 'auto' }}>
    <MenuItem icon="user-plus" to="/register-org" data-cy="create">
      Register Organization
    </MenuItem>
    <MenuItem icon="user-plus" to="/your-org" data-cy="all">
      Your Organization
    </MenuItem>
  </NavDropdown>
);
