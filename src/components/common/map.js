import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

import Dimensions from 'Dimensions';
import MapView from 'react-native-maps';
import Marker from './marker'
import Icon from 'react-native-vector-icons/Ionicons';

export default class MapBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      position : {},
      mapRegion: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
    }
  }

  currPos() {
    if (this.state.initialPosition != "unknown") {
      var pos = JSON.parse(this.state.initialPosition);

      return (
        <MapView.Circle
          center={{latitude: pos.coords.latitude,longitude: pos.coords.longitude}}
          title={"Current Pos"}
          radius={15}
        />
      );
    }
  }

  randomVal() {
      var num = Math.random() / 1000;
      num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
      return num;
  }

  spoofPos() {
    if (this.state.initialPosition != "unknown") {
      var pos = JSON.parse(this.state.initialPosition);
      pos.coords.latitude = pos.coords.latitude + this.randomVal();
      pos.coords.longitude = pos.coords.longitude + this.randomVal();
      this.props.setPosition(pos);

      this.setState({initialPosition:JSON.stringify(pos)});
    }
  }

  onRegionChange(region) {
    this.setState({mapRegion: region});
  }

  changeLocation(pos) {
    var region = this.state.mapRegion;
    region.latitude = pos.coords.latitude;
    region.longitude = pos.coords.longitude;
    this.props.setPosition(pos);

    this.setState({mapRegion:region});
  }

  componentDidMount() {
    var self = this;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
        self.changeLocation(position);
      },
      (error) => alert("Location Error: " + error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  toggleMake() {
    if (this.props.overlay == "MAKE") {
      this.props.showMake(false);
    } else {
      this.props.showMake(true);
    }
  }

  render() {
    return(
      <View>
        <View style={styles.mapBox}>
          <MapView
              style={styles.map}
              region={this.state.mapRegion}
              onRegionChange={this.onRegionChange.bind(this)} >
              {this.currPos()}

              {this.props.markers.map (marker =>
                <Marker key={marker.id} {...marker} setMarker={this.props.setMarker} fetchBite={this.props.fetchBite} currUser={this.props.user.email}/>
              )}
          </MapView>
        </View>
        <TouchableHighlight style={[styles.circleBtn,styles.makeBtn]} onPress={this.toggleMake.bind(this)} >
          <Icon name="md-mic" style={styles.icon} />
        </TouchableHighlight>
        <TouchableHighlight style={[styles.circleBtn,styles.logoutBtn]} onPress={this.props.logout.bind(this)} >
          <Icon name="md-log-out" style={styles.icon} />
        </TouchableHighlight>
        <TouchableHighlight style={[styles.circleBtn,styles.refreshBtn]} onPress={this.props.refreshId.bind(this,this.props.refreshToken)} >
          <Icon name="md-refresh" style={styles.icon} />
        </TouchableHighlight>
        <TouchableHighlight style={[styles.circleBtn,styles.spoofBtn]} onPress={this.spoofPos.bind(this)} >
          <Icon name="md-compass" style={styles.icon} />
        </TouchableHighlight>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  mapBox: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    flex: 1,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circleBtn: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: 'steelblue',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 40,
  },
  makeBtn: {
    right: 10,
  },
  refreshBtn: {
    right: 100,
  },
  logoutBtn: {
    left: 100,
  },
  spoofBtn: {
    left: 10,
  },
  icon: {
    color: 'white',
    fontSize: 40,
    height: 40,
  },
});
