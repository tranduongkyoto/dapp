import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { useMoralis } from 'react-moralis';
import { IPosition, notifyType } from 'web3uikit/dist/components/Notification/types';
import { TIconType } from 'web3uikit/dist/components/Icon/collection';
interface IOwnProps extends RouteProps {
  hasAnyAuthorities?: string[];
}

export interface IPrivateRouteProps extends IOwnProps, StateProps {}
import { useNotification } from 'web3uikit';

export const PrivateRouteComponent = ({
  component: Component,
  //isAuthenticated,
  sessionHasBeenFetched,
  //isAuthorized,
  hasAnyAuthorities = [],
  ...rest
}: IPrivateRouteProps) => {
  const {
    account,
    isAuthenticated,
    logout,
    deactivateWeb3,
    enableWeb3,
    isWeb3Enabled,
    isInitialized,
    isWeb3EnableLoading,
    isAuthenticating,
    authenticate,
    Moralis,
    user,
  } = useMoralis();
  const [isAuthorized, setisAthorized] = useState(false);
  useEffect(() => {
    if (user !== null && hasAnyAuthorities.length !== 0) {
      setisAthorized(user.attributes?.isAdmin ? user.attributes?.isAdmin : isAuthorized);
    }
    if (hasAnyAuthorities.length == 0) {
      setisAthorized(true);
    }
    return () => {};
  }, [user, isAuthorized]);
  const dispatch = useNotification();
  const handleNewNotification = (type: notifyType, message?: string, icon?: TIconType, position?: IPosition) => {
    dispatch({
      type,
      message,
      title: 'Notification',
      icon,
      position: position || 'bottomL',
    });
  };
  const checkAuthorities = props =>
    isAuthorized ? (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    ) : (
      <div className="insufficient-authority">
        <div className="alert alert-danger">
          <Translate contentKey="error.http.403">You are not authorized to access this page.</Translate>
        </div>
      </div>
    );
  const renderRedirect = props => {
    if (!sessionHasBeenFetched) {
      return <div></div>;
    } else {
      return isAuthenticated ? (
        checkAuthorities(props)
      ) : (
        <>
          {handleNewNotification('error', 'You need Login to access this route.')}
          <Redirect
            to={{
              pathname: '/',
              search: props.location.search,
              state: { from: props.location },
            }}
          />
        </>
      );
    }
  };

  if (!Component) throw new Error(`A component needs to be specified for private route for path ${(rest as any).path}`);

  return <Route {...rest} render={renderRedirect} />;
};

export const hasAnyAuthority = (authorities, hasAnyAuthorities: string[]) => {
  console.log(authorities);
  if (authorities && authorities.length !== 0) {
    if (hasAnyAuthorities.length === 0) {
      return true;
    }
    return hasAnyAuthorities.some(auth => authorities.includes(auth));
  }
  return false;
};

const mapStateToProps = (
  { authentication: { isAuthenticated, account, sessionHasBeenFetched } }: IRootState,
  { hasAnyAuthorities = [] }: IOwnProps
) => ({
  // isAuthenticated,
  // isAuthorized: hasAnyAuthority(Moralis.User.current(), hasAnyAuthorities),
  sessionHasBeenFetched,
});

type StateProps = ReturnType<typeof mapStateToProps>;

/**
 * A route wrapped in an authentication check so that routing happens only when you are authenticated.
 * Accepts same props as React router Route.
 * The route also checks for authorization if hasAnyAuthorities is specified.
 */
export const PrivateRouteCustom = connect(mapStateToProps, null, null, { pure: false })(PrivateRouteComponent);

export default PrivateRouteCustom;
