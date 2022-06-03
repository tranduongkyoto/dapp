import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ModalProvider, light, dark } from '@pancakeswap/uikit';
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
import { ThemeProvider } from 'styled-components';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { AppProvider } from './provider/appProvider';

const devTools = process.env.NODE_ENV === 'development' ? <DevTools /> : null;

const store = initStore();
registerLocale(store);

const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() => actions.clearAuthentication('login.error.unauthorized'));

loadIcons();
const POLLING_INTERVAL = 12000;
const rootEl = document.getElementById('root');
const getLibrary = (provider): Web3Provider => {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};
const render = Component =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <MoralisProvider appId="bwcCPmbEhZV58isIMJ58KJOyqwDqzHbvorgxmRRj" serverUrl="https://bikkhd1t110y.usemoralis.com:2053/server">
      <Web3ReactProvider getLibrary={getLibrary}>
        <NotificationProvider>
          <ThemeProvider theme={light}>
            <ModalProvider>
              <AppProvider>
                <ErrorBoundary>
                  <Provider store={store}>
                    <div>
                      {/* If this slows down the app in dev disable it and enable when required  */}
                      {devTools}
                      <Component />
                    </div>
                  </Provider>
                </ErrorBoundary>
              </AppProvider>
            </ModalProvider>
          </ThemeProvider>
        </NotificationProvider>
      </Web3ReactProvider>
    </MoralisProvider>,
    rootEl
  );

render(AppComponent);
