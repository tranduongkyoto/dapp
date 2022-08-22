import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { useMoralis } from 'react-moralis';
import { NavDropdown } from './menu-components';
import MenuItem from './menu-item';

export const Organization = props => {
  const { Moralis, account, isInitialized } = useMoralis();
  return (
    <NavDropdown
      icon="th-list"
      name={translate('global.menu.org.main')}
      id="entity-menu"
      data-cy="entity"
      style={{ maxHeight: '80vh', overflow: 'auto' }}
    >
      <MenuItem icon="user-plus" to="/register-org" data-cy="create">
        {translate('global.menu.org.register')}
      </MenuItem>
      <MenuItem icon="user-plus" to={`/your-organization/${account}`} data-cy="all">
        {translate('global.menu.org.your')}
      </MenuItem>
    </NavDropdown>
  );
};
