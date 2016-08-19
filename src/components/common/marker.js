import React, { Component } from 'react';
import MapView from 'react-native-maps';

export default class Marker extends Component {
  render() {
    return (
      <MapView.Marker
        coordinate={{latitude: this.props.latitude,longitude: this.props.longitude}}
        title={this.props.title}
        description={"Duration: " + this.props.duration + " seconds"}
        onCalloutPress={this.props.onPress}
        key={this.props.id}
      />
    );
  }
}
