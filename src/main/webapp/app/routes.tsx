import React from 'react';
import { Switch } from 'react-router-dom';
import Loadable from 'react-loadable';

import Login from 'app/modules/login/login';
import Register from 'app/modules/account/register/register';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import Logout from 'app/modules/login/logout';
import Home from 'app/modules/home/home';
import Entities from 'app/entities';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import { AUTHORITIES } from 'app/config/constants';
import Campaigns from './modules/campaign/campaigns';
import Campaign from 'app/modules/campaign/campaign';
import CreateCampaign from './modules/campaign/create-campaign';
import CreateNftCampaign from './modules/campaign/create-nft-campaign';
import Nfts from './modules/nft/nfts';
import PrivateRouteCustom from './shared/auth/private-route-custom';
import Video from './modules/video/video';
import Selection from './modules/campaign/selection';
import ProfileSetting from './modules/profile/profile';
import { Profile } from './modules/account/profile';
import MintNft from './modules/nft/mint-nft';
import MyCampaign from './modules/campaign/my-campaign';
import NftDetail from './modules/nft/nft-details';
import NftCampaign from './modules/campaign/nft-campaign';
import NftCampaigns from './modules/campaign/nft-campaigns';
import UserManage from './modules/administration/user-management/user-manage';
import SendNewCamp from './modules/email/sendNewCamp';
import DashBoard from './modules/dashboard/dashboard';

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
      <ErrorBoundaryRoute path="/login" component={Login} />
      <ErrorBoundaryRoute path="/logout" component={Logout} />
      <ErrorBoundaryRoute path="/account/register" component={Register} />
      <ErrorBoundaryRoute path="/account/activate/:key?" component={Activate} />
      <ErrorBoundaryRoute path="/account/reset/request" component={PasswordResetInit} />
      <ErrorBoundaryRoute path="/account/reset/finish/:key?" component={PasswordResetFinish} />
      <ErrorBoundaryRoute path="/my-campaign" component={MyCampaign} />
      <ErrorBoundaryRoute path="/campaigns" component={Campaigns} />
      <ErrorBoundaryRoute path="/nft-campaigns" component={NftCampaigns} />
      <ErrorBoundaryRoute path="/campaign/create/traditional" component={CreateCampaign} />
      <ErrorBoundaryRoute path="/campaign/create/nft" component={CreateNftCampaign} />
      <ErrorBoundaryRoute path="/campaign/create" component={Selection} />
      <ErrorBoundaryRoute path="/campaign/:id" component={Campaign} />
      <ErrorBoundaryRoute path="/auction/:id" component={NftCampaign} />
      <ErrorBoundaryRoute path="/video" component={Video} />
      <PrivateRouteCustom path="/nft/mint" component={MintNft} />
      <PrivateRouteCustom path="/my-nft/:id" component={Nfts} />
      <PrivateRouteCustom path="/nft/:id" component={NftDetail} />
      <PrivateRouteCustom path="/account/profile" component={ProfileSetting} />
      <PrivateRouteCustom path="/account/:id" component={Profile} />
      <PrivateRouteCustom path="/email/new-camp" component={SendNewCamp} />
      <PrivateRouteCustom path="/admin/user-manage" component={UserManage} />
      <PrivateRouteCustom path="/dashboard" component={DashBoard} />
      <PrivateRoute path="/admin" component={Admin} hasAnyAuthorities={[AUTHORITIES.ADMIN]} />
      <PrivateRoute path="/account" component={Account} hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]} />
      <ErrorBoundaryRoute path="/" exact component={Home} />
      <PrivateRoute path="/" component={Entities} hasAnyAuthorities={[AUTHORITIES.USER]} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  );
};

export default Routes;
