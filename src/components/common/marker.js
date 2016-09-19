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

  setPinImage() {
    if (this.props.user == this.props.currUser) {
      return require('../../../own.png')
    }

    if(this.props.listened.indexOf(this.props.f_id) == -1) {
      if (this.getDistance() < 0.3) {
        return require('../../../in-new.png')
      } else {
        return require('../../../out-new.png')
      }
    }
    else {
      if (this.getDistance() < 0.3) {
        return require('../../../in-old.png')
      } else {
        return require('../../../out-old.png')
      }
    }

    return null;
  }

  voteCount() {
    if(typeof this.props.upvotes != "undefined" && typeof this.props.downvotes != "undefined") {
      return this.props.upvotes.length - this.props.downvotes.length;
    }
    return 0;
  }

  render() {
    return (
      <MapView.Marker
        coordinate={{latitude: this.props.latitude,longitude: this.props.longitude}}
        title={this.voteCount() + " | " + this.props.title + " | " + this.props.user + " | " + this.getDistance()}
        image={this.setPinImage()}
        description={"Duration: " + this.props.duration + " seconds"}
        onCalloutPress={this.inRange()? this.markerClick.bind(this,this.props.id) : () => alert("The SoundBite is too far!") }
        key={this.props.id}
      />
    );
  }
}
