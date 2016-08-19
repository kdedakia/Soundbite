import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import Login from './login';
import MapContainer from '../../containers/mapContainer';
import MakeContainer from '../../containers/makeContainer';
import ViewContainer from '../../containers/viewContainer';

export default class Main extends Component {
  render() {
    return (
      <View>
          <MapContainer />
          <MakeContainer />
          <ViewContainer />
      </View>
    )
  }
}
