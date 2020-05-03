/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import Routes from './src/Routes';
import { SafeAreaView } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import Loader from './src/common/Loader';
import { Provider, connect } from "react-redux";
import SplashScreen from 'react-native-splash-screen';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000)
  }

  render() {
    console.disableYellowBox = true;
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaView style={{ flex: 1 }}>
            <Routes />
            <Loader />
          </SafeAreaView>
        </PersistGate>
      </Provider>
    );
  }
}
