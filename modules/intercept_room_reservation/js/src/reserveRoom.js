import React from 'react';
import { configureUrlQuery } from 'react-url-query';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import interceptClient from 'interceptClient';
import ReserveRoomApp from './components/ReserveRoomApp';
import interceptTheme from 'interceptTheme';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

const theme = createMuiTheme(interceptTheme);

// link the history used in our app to url-query so it can update the URL with it.
configureUrlQuery({ history: interceptClient.history });

const store = interceptClient.store;
render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <ReserveRoomApp />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('reserveRoomRoot'),
);
