import React from 'react';
import Loadable from 'react-loadable';
import { Switch } from 'react-router-dom';

import { AUTHORITIES } from 'app/config/constants';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import Register from 'app/modules/account/register/register';
import Campaign from 'app/modules/campaign/campaign';
import Home from 'app/modules/home/home';
// import Login from 'app/modules/login/login';
// import Logout from 'app/modules/login/logout';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import { Profile } from './modules/account/profile';
import UserManage from './modules/administration/user-management/user-manage';
import Campaigns from './modules/campaign/campaigns';
import CreateCampaign from './modules/campaign/create-campaign';
import CreateNftCampaign from './modules/campaign/create-nft-campaign';
import MyNftAuction from './modules/campaign/my-nft-auction';
import NftCampaign from './modules/campaign/nft-campaign';
import NftCampaigns from './modules/campaign/nft-campaigns';
import Selection from './modules/campaign/selection';
import StartNftCampaigns from './modules/campaign/start-nft-campaigns';
import DashBoard from './modules/dashboard/dashboard';
import SendNewCamp from './modules/email/sendNewCamp';
import MintNft from './modules/nft/mint-nft';
import NftDetail from './modules/nft/nft-details';
import Nfts from './modules/nft/nfts';
import ProfileSetting from './modules/profile/profile';
import PrivateRouteCustom from './shared/auth/private-route-custom';
import MyCampaign from './modules/campaign/my-campaign';
import Organizations from './modules/organization/organizations';
import RegisterOrg from './modules/organization/register-org';
import YourOrg from './modules/organization/your-org';
import Organization from './modules/organization/org';
import Proposal from './modules/organization/proposal';

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => <div>loading ...</div>,
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
  loading: () => <div>loading ...</div>,
});

const Routes = () => {
  return (
    <Switch>
      <ErrorBoundaryRoute path="/account/register" component={Register} />
      <ErrorBoundaryRoute path="/account/activate/:key?" component={Activate} />
      <ErrorBoundaryRoute path="/account/reset/request" component={PasswordResetInit} />
      <ErrorBoundaryRoute path="/account/reset/finish/:key?" component={PasswordResetFinish} />
      <ErrorBoundaryRoute path="/campaigns" component={Campaigns} />
      <ErrorBoundaryRoute path="/organizations" component={Organizations} />
      <ErrorBoundaryRoute path="/start-nft-campaigns" component={StartNftCampaigns} />
      <ErrorBoundaryRoute path="/nft-campaigns" component={NftCampaigns} />
      <ErrorBoundaryRoute path="/campaign/create/traditional" component={CreateCampaign} />
      <ErrorBoundaryRoute path="/campaign/create/nft" component={CreateNftCampaign} />
      <ErrorBoundaryRoute path="/campaign/create" component={Selection} />
      <ErrorBoundaryRoute path="/campaign/:id" component={Campaign} />
      <ErrorBoundaryRoute path="/auction/:id" component={NftCampaign} />
      <ErrorBoundaryRoute path="/organization/:id/proposal/:pid" component={Proposal} />
      <ErrorBoundaryRoute path="/organization/:id" component={Organization} />
      <PrivateRouteCustom path="/register-org" component={RegisterOrg} />
      <PrivateRouteCustom path="/your-organization/:id" component={YourOrg} />
      <PrivateRouteCustom path="/nft/mint" component={MintNft} />
      <PrivateRouteCustom path="/my-nft/:id" component={Nfts} />
      <PrivateRouteCustom path="/your-nft-auction/:id" component={MyNftAuction} />
      <PrivateRouteCustom path="/your-campaign/:id" component={MyCampaign} />
      <PrivateRouteCustom path="/nft/:id" component={NftDetail} />
      <PrivateRouteCustom path="/account/profile" component={ProfileSetting} />
      <PrivateRouteCustom path="/account/:id" component={Profile} />
      <PrivateRouteCustom path="/email/new-camp" component={SendNewCamp} />
      <PrivateRouteCustom path="/admin/user-manage" component={UserManage} hasAnyAuthorities={[AUTHORITIES.ADMIN]} />
      <PrivateRouteCustom path="/dashboard" component={DashBoard} />
      {/* <PrivateRoute path="/admin" component={Admin} hasAnyAuthorities={[AUTHORITIES.ADMIN]} /> */}
      {/* <PrivateRoute path="/account" component={Account} hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]} /> */}
      <ErrorBoundaryRoute path="/" exact component={Home} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  );
};

export default Routes;
