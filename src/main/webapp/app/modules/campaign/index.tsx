import React from 'react';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import CreateProject from './campaigns';
import ProjectManagement from './campaign';
import Campaigns from './campaigns';
import Campaign from './campaign';

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute path={`${match.url}/campaigns`} component={Campaigns} />
    <ErrorBoundaryRoute path={`${match.url}/campaign/:id`} component={Campaign} />
  </div>
);

export default Routes;
