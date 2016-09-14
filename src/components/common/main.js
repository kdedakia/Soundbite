import React, { Component } from 'react';
import {
  AsyncStorage,
  BackAndroid,
  View,
} from 'react-native';

import Login from './login';
import LoginContainer from '../../containers/loginContainer';
import MapContainer from '../../containers/mapContainer';
import MakeContainer from '../../containers/makeContainer';
import ViewContainer from '../../containers/viewContainer';

export default class Main extends Component {
  componentWillMount() {
    this.props.getUser();
    BackAndroid.addEventListener('hardwareBackPress',this.backBtn.bind(this))
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.backBtn);
  }

  backBtn() {
    return true;
  }

  render() {
    if (this.props.user == null) {
      return (
        <LoginContainer />
      )
    } else {
      return (
        <View>
          <MapContainer />
          <MakeContainer />
          <ViewContainer />
        </View>
      )
    }

  }
}
