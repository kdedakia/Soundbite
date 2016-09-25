import React, { Component } from 'react';
import {
  AsyncStorage,
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

  resetStorage() {
    AsyncStorage.setItem(this.props.user.email,JSON.stringify([]));
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

  lastStoredPos() {
    var self = this;

    AsyncStorage.getItem(this.props.user.email)
    .then((listened) => {
      self.props.getListened(JSON.parse(listened))
    });

    AsyncStorage.getItem('position')
    .then((pos) => {
      if(pos) {
        self.changeLocation(JSON.parse(pos))
        self.setState({initialPosition:pos});
      }
    })
    .catch((err) => {
      console.error("Position Async Error: " + err)
    })
  }

  currentPos() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
        AsyncStorage.setItem('position',initialPosition)
        this.changeLocation(position,true);
      },
      (error) => alert("Location Error: " + error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
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

  changeLocation(pos,resetZoom) {
    var region = this.state.mapRegion;
    if (resetZoom) {
      region.latitudeDelta = 0.015;
      region.longitudeDelta = 0.0121;
    }
    region.latitude = pos.coords.latitude;
    region.longitude = pos.coords.longitude;
    this.props.setPosition(pos);

    this.setState({mapRegion:region});
  }

  componentWillMount() {
    this.lastStoredPos();
    this.currentPos();
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
    let pos, lat, lng;
    if (this.state.initialPosition != "unknown") {
      pos = JSON.parse(this.state.initialPosition);
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    }
    // <TouchableHighlight style={[styles.circleBtn,styles.logoutBtn]} onPress={this.props.logout.bind(this)} >
    //   <Icon name="md-log-out" style={styles.icon} />
    // </TouchableHighlight>
    // <TouchableHighlight style={[styles.circleBtn,styles.refreshBtn]} onPress={this.resetStorage.bind(this)} >
    //   <Icon name="md-refresh" style={styles.icon} />
    // </TouchableHighlight>
    return(
      <View>
        <View style={styles.toolbar}>
          <TouchableHighlight style={styles.profile} onPress={this.props.logout.bind(this)}>
            <Icon name="ios-contact-outline" style={[styles.toolbarIcon]} />
          </TouchableHighlight>
          <Text style={styles.title}>SoundBites</Text>
          <TouchableHighlight style={styles.achievements}>
            <Icon name="ios-trophy-outline" style={[styles.toolbarIcon]} />
          </TouchableHighlight>
        </View>
        <View style={styles.mapBox}>
          <MapView
              style={styles.map}
              region={this.state.mapRegion}
              onRegionChange={this.onRegionChange.bind(this)} >
              {this.currPos()}

              {this.props.markers.map (marker =>
                <Marker key={marker.id} {...marker} listened={this.props.listened} currLat={lat} currLong={lng} setMarker={this.props.setMarker} fetchBite={this.props.fetchBite} currUser={this.props.user.email}/>
              )}
          </MapView>
        </View>
        <View style={styles.notice}>
          <Icon name="ios-alert-outline" style={styles.noticeIcon} />
          <Text style={styles.noticeText}>3 New Bites Nearby</Text>
        </View>
        <TouchableHighlight style={[styles.circleBtn,styles.makeBtn]} onPress={this.toggleMake.bind(this)} >
          <Icon name="ios-add-outline" style={styles.icon} />
        </TouchableHighlight>
        <TouchableHighlight style={[styles.circleBtn,styles.spoofBtn]} onPress={this.currentPos.bind(this)} >
          <Icon name="ios-locate-outline" style={styles.icon} />
        </TouchableHighlight>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  toolbar: {
    height: 50,
    width: Dimensions.get('window').width,
    backgroundColor: '#70B0E2',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
  },
  toolbarIcon: {
    color: 'white',
    fontSize: 40,
    height: 40,
  },
  profile: {
    marginLeft: 10,
  },
  achievements: {
    marginRight: 10,
  },
  notice: {
    position: 'absolute',
    top: 70,
    left: (Dimensions.get('window').width-170)/2,
    width: 170,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#77C9FA',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeIcon: {
    color: 'white',
    fontSize: 20,
    height: 20,
    marginRight: 5,
  },
  noticeText: {
    color: 'white',
  },
  mapBox: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height-50,
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
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#77C9FA',
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
