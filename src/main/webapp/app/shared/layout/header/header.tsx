import './header.scss';

import React, { useState } from 'react';
import { Translate, Storage } from 'react-jhipster';
import { Navbar, Nav, NavbarToggler, Collapse } from 'reactstrap';

import LoadingBar from 'react-redux-loading-bar';

import { Home, Brand, Campagins } from './header-components';
import { AdminMenu, AccountMenu, LocaleMenu, Campaign } from '../menus';
import { Input, Button, ConnectButton } from 'web3uikit';
import { useMoralis, useMoralisWeb3Api, useMoralisFile } from 'react-moralis';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
  currentLocale: string;
  onLocaleChange: (langKey: string) => void;
}

const Header = (props: IHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useMoralis();
  const handleLocaleChange = event => {
    const langKey = event.target.value;
    Storage.session.set('locale', langKey);
    props.onLocaleChange(langKey);
  };

  const renderDevRibbon = () =>
    props.isInProduction === false ? (
      <div className="ribbon dev">
        <a href="">
          <Translate contentKey={`global.ribbon.${props.ribbonEnv}`} />
        </a>
      </div>
    ) : null;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */

  return (
    <div id="app-header">
      {/* {renderDevRibbon()} */}
      <LoadingBar className="loading-bar" />
      <Navbar data-cy="navbar" expand="sm" fixed="top" className="jh-navbar" color="light">
        <NavbarToggler aria-label="Menu" onClick={toggleMenu} />
        <Brand />
        <Collapse isOpen={menuOpen} navbar>
          <Nav id="header-tabs" className="ml-auto" navbar>
            <Home />
            {isAuthenticated && <Campaign />}
            {isAuthenticated && props.isAdmin && <AdminMenu showOpenAPI="true" />}
            <LocaleMenu currentLocale={props.currentLocale} onClick={handleLocaleChange} />
            <AccountMenu isAuthenticated={isAuthenticated} />
            <ConnectButton />
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
