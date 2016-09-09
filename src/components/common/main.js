import React, { Component } from 'react';
import {
  AsyncStorage,
  View,
} from 'react-native';

import Login from './login';
import LoginContainer from '../../containers/loginContainer';
import MapContainer from '../../containers/mapContainer';
import MakeContainer from '../../containers/makeContainer';
import ViewContainer from '../../containers/viewContainer';
import * as DB from '../../utils/database';

export default class Main extends Component {
  componentWillMount() {
    AsyncStorage.multiGet(['user','idToken','refreshToken'])
    .then((results) => {
      var user = JSON.parse(results[0][1])
      var idToken = results[1][1]
      var refreshToken = results[2][1]

      // Todo: Make this better
      if(user != null) {
        this.props.loginSuccess(user,idToken,refreshToken)

        DB.fetchFirebaseToken(idToken)
        .then((fbToken) => {
          DB.getMarkers();
          this.props.fetchMarkers()
        })
        .catch((err) => alert(err))
      }
    })
    .catch((err) => console.error(err));
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
