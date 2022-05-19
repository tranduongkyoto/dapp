import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';

import DevTools from './config/devtools';
import initStore from './config/store';
import { registerLocale } from './config/translation';
import setupAxiosInterceptors from './config/axios-interceptor';
import { clearAuthentication } from './shared/reducers/authentication';
import ErrorBoundary from './shared/error/error-boundary';
import AppComponent from './app';
import { loadIcons } from './config/icon-loader';
import { MoralisProvider } from 'react-moralis';
import { NotificationProvider } from 'web3uikit';

const devTools = process.env.NODE_ENV === 'development' ? <DevTools /> : null;

const store = initStore();
registerLocale(store);

const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() => actions.clearAuthentication('login.error.unauthorized'));

loadIcons();

const rootEl = document.getElementById('root');

const render = Component =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <MoralisProvider appId="bwcCPmbEhZV58isIMJ58KJOyqwDqzHbvorgxmRRj" serverUrl="https://bikkhd1t110y.usemoralis.com:2053/server">
      <NotificationProvider>
        <ErrorBoundary>
          <Provider store={store}>
            <div>
              {/* If this slows down the app in dev disable it and enable when required  */}
              {devTools}
              <Component />
            </div>
          </Provider>
        </ErrorBoundary>
      </NotificationProvider>
    </MoralisProvider>,
    rootEl
  );

render(AppComponent);
