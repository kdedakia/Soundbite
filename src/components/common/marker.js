import React, { Component } from 'react';
import MapView from 'react-native-maps';
import * as DB from '../../utils/database';

export default class Marker extends Component {
  markerClick(id) {
    this.props.fetchBite(this.props.file);
    this.props.setMarker(id);
  }

  render() {
    return (
      <MapView.Marker
        coordinate={{latitude: this.props.latitude,longitude: this.props.longitude}}
        title={this.props.title + " | " + this.props.user}
        image={this.props.user == this.props.currUser ? require('../../../map-pin.png') : null}
        description={"Duration: " + this.props.duration + " seconds"}
        onCalloutPress={this.markerClick.bind(this,this.props.id)}
        key={this.props.id}
      />
    );
  }
}
