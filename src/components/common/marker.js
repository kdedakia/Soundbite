import React, { Component } from 'react';
import MapView from 'react-native-maps';
import * as DB from '../../utils/database';

export default class Marker extends Component {
  markerClick(id) {
    this.props.fetchBite(this.props.file);
    this.props.setMarker(id);
  }

  inRange() {
    if (this.getDistance() < 0.3) {
      return true;
    }
    return false;
  }

  getDistance() {
    return this.distance(this.props.latitude,this.props.longitude,this.props.currLat,this.props.currLong)
  }

  distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

  // TODO: get more pin images and set them here
  setPinImage() {
    // if (this.props.user == this.props.currUser) {
      // return require('../../../map-pin.png')
      // return null;
    // }
    if (this.getDistance() < 0.3) {
      return require('../../../map-pin.png')
    }
    return null;
  }

  render() {
    return (
      <MapView.Marker
        coordinate={{latitude: this.props.latitude,longitude: this.props.longitude}}
        title={this.props.title + " | " + this.props.user + " | " + this.getDistance()}
        image={this.setPinImage()}
        description={"Duration: " + this.props.duration + " seconds"}
        onCalloutPress={this.inRange()? this.markerClick.bind(this,this.props.id) : () => alert("The SoundBite is too far!") }
        key={this.props.id}
      />
    );
  }
}
