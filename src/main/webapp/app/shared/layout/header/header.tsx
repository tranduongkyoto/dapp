import UserMenu from 'app/components/Menu/UserMenu';
import { AppContext } from 'app/provider/appContext';
import React, { useContext, useEffect, useState } from 'react';
import { Storage, Translate } from 'react-jhipster';
import { useMoralis } from 'react-moralis';
import LoadingBar from 'react-redux-loading-bar';
import { Collapse, Nav, Navbar, NavbarToggler } from 'reactstrap';
import { AdminMenu, Campaign, LocaleMenu } from '../menus';
import { Donation } from '../menus/donation';
import { Nft } from '../menus/nft';
import { Organization } from '../menus/organization';
import { Brand, DashBoard, Email, Home } from './header-components';
import './header.scss';

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
  const { isAdmin } = useContext(AppContext);
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
  useEffect(() => {
    console.log(isAdmin);
    return () => {};
  }, [isAdmin]);
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
            {isAuthenticated && <Donation />}
            {isAuthenticated && <Organization />}
            {isAuthenticated && <Campaign />}
            {isAuthenticated && <Nft />}
            {isAuthenticated && <Email />}
            {isAuthenticated && isAdmin && <AdminMenu showOpenAPI="true" />}
            {isAuthenticated && isAdmin && <DashBoard />}
            <LocaleMenu currentLocale={props.currentLocale} onClick={handleLocaleChange} />
            {/* <AccountMenu isAuthenticated={isAuthenticated} /> */}
            <UserMenu />
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
