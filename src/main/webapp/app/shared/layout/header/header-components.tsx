import React from 'react';
import { Translate } from 'react-jhipster';

import { NavItem, NavLink, NavbarBrand } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import appConfig from 'app/config/constants';
import MenuItem from '../menus/menu-item';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="content/images/logo-jhipster.png" alt="Logo" />
  </div>
);

export const Brand = props => (
  <NavbarBrand tag={Link} to="/" className="brand-logo">
    {/* <BrandIcon /> */}
    <span className="brand-title">
      <Translate contentKey="global.title">Dapp</Translate>
    </span>
    <span className="navbar-version">{appConfig.VERSION}</span>
  </NavbarBrand>
);

export const Home = props => (
  <NavItem>
    <NavLink tag={Link} to="/" className="d-flex align-items-center">
      {/* <FontAwesomeIcon icon="home" /> */}
      <span className="font-weight-bold h5">
        <Translate contentKey="global.menu.home"></Translate>
      </span>
    </NavLink>
  </NavItem>
);

export const Email = props => (
  <NavItem>
    <NavLink tag={Link} to="/email/new-camp" className="d-flex align-items-center">
      {/* <FontAwesomeIcon icon="home" /> */}
      <span className="font-weight-bold h5">Email</span>
    </NavLink>
  </NavItem>
);

export const DashBoard = props => (
  <NavItem>
    <NavLink tag={Link} to="/dashboard" className="d-flex align-items-center">
      <span className="font-weight-bold h5">
        {' '}
        <Translate contentKey="global.menu.dashboard"></Translate>
      </span>
    </NavLink>
  </NavItem>
);
