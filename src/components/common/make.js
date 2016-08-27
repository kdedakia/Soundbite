import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import RNFS from 'react-native-fs';
import Record from 'react-native-record-sound';
import Sound from 'react-native-sound';
import Dimensions from 'Dimensions';
import MapView from 'react-native-maps';
import OverlayStyles from '../../styles/overlay';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'react-native-fetch-blob'
import { initializeApp } from 'firebase';
import config from '../../../config';


/* RNFS */
const pathPrefix = RNFS.DocumentDirectoryPath;
const TEMPAUDIOFILE = 'test.mp4'
window.RNFS = RNFS


/* FETCH BLOB */
const fs = RNFetchBlob.fs
const Blob = RNFetchBlob.polyfill.Blob
const dirs = RNFetchBlob.fs.dirs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob
window.fs = fs
RNFetchBlob.config({ fileCache : true, appendExt : 'mp4' })


/* FIREBASE */
firebase.initializeApp({
  apiKey: config.API_KEY,
  authDomain: config.AUTH_DOMAIN,
  databaseURL: config.DATABASE_URL,
  storageBucket: config.STORAGE_BUCKET,
});
var db = firebase.database();
const rootRef = db.ref();
const markersRef = rootRef.child('markers');
var storageRef = firebase.storage().ref();
var soundFile = storageRef.child('bites/FILENAME.mp4');
let FBFlag = true;


export default class MakeBite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRecording: false,
      recTime: 0,
      timer: null, //Make better?
      sound: null, //Remove from state?
      animationType: 'fade',
      transparent: true,
    };
  }

  componentWillMount() {
    // markersRef.on('child_added', (snapshot) => {
      // this.props.addMarker(snapshot.val())
    // });
    // this.listDir(pathPrefix);
    // this.listDir(RNFS.PicturesDirectoryPath);
  }

  // componentDidMount() {
  //   this.signIn();
  // }
  //
  // signIn() {
  //   firebase.auth()
  //     .signInWithEmailAndPassword("kdedakia@gmail.com", "esz5qp")
  //     .catch((err) => {
  //       console.log('firebase sigin failed', err)
  //     })
  //
  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (FBFlag) { //Hack to prevent this from being called twice
  //       debugger;
  //       if(user !== null) {;
  //         console.log(user);
  //       }
  //       FBFlag = false;
  //     }
  //   })
  // }

  // Uploads mp4 to firebase storage
  uploadAudio(filename) {
    let rnfbURI = RNFetchBlob.wrap(pathPrefix + "/" + filename) // <255kb
    let self = this;

    // create Blob from file path
    Blob
      .build(rnfbURI, { type : 'audio/mp4;'})
      .then((blob) => {
        // upload image using Firebase SDK
        firebase.storage()
          .ref('rn-firebase-upload')
          .child(filename)
          .put(blob, { contentType : 'audio/mp4' })
          .then((snapshot) => {
            blob.close()
            self.deleteAudio(filename)
          })
          .catch( function(error)  {
            console.error(error)
          })
      })
      .catch( function(error) {
        console.error(error);
      })
  }

  deleteAudio(filename) {
    return RNFS.unlink(pathPrefix + "/" + filename + '.mp4')
      .then(() => {
        console.log("DELETED FILE COPY")
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  incrementRecTime() {
    this.setState({recTime: this.state.recTime+1});
  }

  recordSound(file) {
    var self = this;

    if (this.state.isRecording === false) {
      this.setState({recTime:0});
      this.incrementRecTime();
      this.setState({timer:setInterval(this.incrementRecTime.bind(self) ,1000)});

      Record.startRecord(pathPrefix + '/' + file, (err) => {
        console.log(err)
      });
    }
    else {
      Record.stopRecord();
      clearInterval(this.state.timer);
    }

    this.setState({isRecording: !this.state.isRecording})
  }

  playSound(file) {
    var self = this;
    if (this.state.sound != null) {
      this.setState({sound:null});
      this.state.sound.stop();
      this.state.sound.release();
      return;
    }

    var bite = new Sound(file, pathPrefix, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
      } else { // loaded successfully
        console.log('duration in seconds: ' + bite.getDuration() +
            'number of channels: ' + bite.getNumberOfChannels());

        self.setState({sound:bite});
        bite.play((success) => {
          if (success) {
            console.log('successfully finished playing');
            self.setState({sound:null});
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }
    });
  }

  markerClick(id) {
    this.props.setMarker(id);
  }

  addMarker() {
    var self = this;
    var markerID = self.state.text; //TODO: use good, unique ID's
    var s = new Sound(TEMPAUDIOFILE, pathPrefix, (errror) => {});
    var userEmail = firebase.auth().currentUser.email
    var fileName = userEmail + "-" + markerID + ".mp4"

    RNFS.copyFile(pathPrefix + "/" + TEMPAUDIOFILE,pathPrefix + "/" + fileName)
      .then(() => {
        console.log("CREATED FILE COPY")
        const id = Math.random().toString(36).substring(7);
        const markerRef = markersRef.child(id);

        // TODO: add all fields
        var newMarker = {
          id: markerID,
          f_id: id,
          title: self.state.text,
          duration: s._duration.toPrecision(3),
          // onPress: self.markerClick.bind(self,markerID),
          latitude: self.props.position.coords.latitude,
          longitude: self.props.position.coords.longitude,
          // created: new Date().getTime()
          user: userEmail,
          file: fileName
        };

        markerRef.set(newMarker);

        newMarker.onPress =  self.markerClick.bind(self,markerID); //TODO: better solution
        this.props.addMarker(newMarker);
        self.uploadAudio(fileName);
      });
  }

  // TODO: fix this for dynamic icons
  getButtons() {
    var recText;
    var playText;

    if (this.state.isRecording) {
      recText = "STOP";
    } else {
      recText = "RECORD SOUND";
    }

    if (this.state.sound == null) {
      playText = "PLAY SOUND";
    } else {
      playText = "STOP SOUND";
    }
    // <Text style={OverlayStyles.btnText}>{recText}</Text>
    // <Text style={OverlayStyles.btnText}>{playText}</Text>
    // <Text style={OverlayStyles.btnText}>OK</Text>

    return (
      <View style={OverlayStyles.btnContainer}>
        <TouchableHighlight onPress={this.recordSound.bind(this,TEMPAUDIOFILE)} style={OverlayStyles.okBtn}>
            <Icon name="md-microphone" style={OverlayStyles.actionButtonIcon} />
        </TouchableHighlight>
        <TouchableHighlight onPress={this.playSound.bind(this,TEMPAUDIOFILE)} style={OverlayStyles.okBtn}>
            <Icon name="md-play" style={OverlayStyles.actionButtonIcon} />
        </TouchableHighlight>
        <TouchableHighlight onPress={this.addMarker.bind(this)} style={OverlayStyles.okBtn}>
            <Icon name="md-checkmark" style={OverlayStyles.actionButtonIcon} />
        </TouchableHighlight>
      </View>
    );
  }

  render () {
    var modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
    };
    var innerContainerTransparentStyle = this.state.transparent
      ? {backgroundColor: '#fff'}
      : null;
    var activeButtonStyle = {
      backgroundColor: '#ddd'
    };

    return (
      <Modal
        animationType={this.state.animationType}
        transparent={true}
        visible={this.props.overlay == "MAKE"}
        onRequestClose={() => {this.props.showMake.bind(this,false)}} >

        <View style={[OverlayStyles.container, modalBackgroundStyle]}>
          <View style={[OverlayStyles.innerContainer, innerContainerTransparentStyle]}>
            <View style={OverlayStyles.innerHeader}>
              <TouchableHighlight onPress={this.props.showMake.bind(this,false)}>
                <Icon name="md-close" style={OverlayStyles.closeBtn}/>
              </TouchableHighlight>
            </View>
            <TextInput
              style={styles.inputTitle}
              placeholder="Enter Text"
              onChangeText={(text) => this.setState({text})} />
            {this.getButtons.bind(this)()}
            <View style={{width:300}}>
              <Text style={styles.status}>Duration: {this.state.recTime}</Text>
              <Text style={styles.status}>Recording: {this.state.isRecording.toString()}</Text>
            </View>
          </View>
        </View>

      </Modal>
    );
  }

  /* DEBUGGING FUNCTIONS */
  listDir(path) {
    RNFS.readDir(path)
    .then((result) => {
      console.log('GOT RESULT', result);
      return result;
    })
    .catch(function(error) {
      console.error(error)
    });
  }
}

var styles = StyleSheet.create({
  inputTitle: {
    height: 60,
    color: 'steelblue',
    fontSize: 20,
    width: Dimensions.get('window').width-80,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  status: {
    color: 'green',
    textAlign: 'center',
    fontSize: 14,
  },
});
