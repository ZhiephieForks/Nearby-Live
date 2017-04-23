/**
 * Index - this is where everything
 *  starts - but offloads to app.js
 */
/* global __DEV__ */
import React from 'react';
import { AsyncStorage } from 'react-native'; // we need to import AsyncStorage to use as a storage enging
import { persistStore, autoRehydrate } from 'redux-persist'; // for persist redux
import { applyMiddleware, compose, createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import { Router } from 'react-native-router-flux';


import logger from 'redux-logger'
import thunk from 'redux-thunk';


import ActionSheet from '@expo/react-native-action-sheet';

// Consts and Libs
import { AppStyles } from '@theme/';
import AppRoutes from '@navigation/';
import Analytics from '@lib/analytics';

// All redux reducers (rolled into one mega-reducer)
import rootReducer from '@redux/index';

// Connect RNRF with Redux
const RouterWithRedux = connect()(Router);

// Load middleware
let middleware = [
    Analytics,
    thunk, // Allows action creators to return functions (not just plain objects)
];

if (__DEV__) {
    // Dev-only middleware
    middleware = [
        ...middleware,
        logger(), // Logs state changes to the dev console
    ];
}

// Init redux store (using the given reducer & middleware)
const store = compose(
    applyMiddleware(...middleware),
    autoRehydrate()
)(createStore)(rootReducer);

// begin periodically persisting the store
persistStore(store,{  blacklist:['router', 'stream'] , storage: AsyncStorage })

/* Component ==================================================================== */
// Wrap App in Redux provider (makes Redux available to all sub-components)
export default function AppContainer() {
    return (
          <Provider store={store}>
            <RouterWithRedux scenes={AppRoutes} style={AppStyles.appContainer} />
          </Provider>
    );
}