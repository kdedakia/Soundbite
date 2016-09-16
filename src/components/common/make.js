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
import * as DB from '../../utils/database';

/* RNFS */
const pathPrefix = RNFS.DocumentDirectoryPath;
const TEMPAUDIOFILE = 'test.mp4'

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
    // this.listDir(pathPrefix);
    // this.listDir(RNFS.PicturesDirectoryPath);
  }

  incrementRecTime(start) {
    if (start) {
      this.setState({recTime: 0.1});
    } else {
      this.setState({recTime: this.state.recTime+0.1});
    }
  }

  recordSound(file) {
    if (this.state.isRecording === false) {
      this.incrementRecTime(true);
      this.setState({timer:setInterval(this.incrementRecTime.bind(this),100)});

      Record.startRecord(pathPrefix + '/' + file, (err) => {
        console.log("Start Recording Error: " + err)
      });
    }
    else {
      this.stopRecording();
    }

    this.setState({isRecording: !this.state.isRecording})
  }

  stopRecording() {
    return new Promise((resolve,reject) => {
      Record.stopRecord();
      clearInterval(this.state.timer);
      resolve();
    })
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

  addMarker() {
    if (this.state.isRecording) {
      this.stopRecording().then(() => this.uploadMarker());
    } else {
      this.uploadMarker();
    }
  }

  uploadMarker() {
    var self = this;
    var markerID = self.state.text; //TODO: use good, unique ID's
    var s = new Sound(TEMPAUDIOFILE, pathPrefix, (error) => {
      if (error) {
        console.error(error)
      } else {
        var userEmail = this.props.user.name;
        var fileName = userEmail + "-" + markerID + ".mp4";
        const id = Math.random().toString(36).substring(7);

        // TODO: add all fields
        var newMarker = {
          id: markerID,
          f_id: id,
          title: self.state.text,
          duration: s.getDuration().toPrecision(3),
          latitude: self.props.position.coords.latitude,
          longitude: self.props.position.coords.longitude,
          created: new Date().getTime(),
          user: userEmail,
          file: fileName,
          upvotes: [],
          downvotes: [],
        };

        DB.pushMarker(newMarker);
        // fileName = newRef.key + '.mp4';

        RNFS.copyFile(pathPrefix + "/" + TEMPAUDIOFILE,pathPrefix + "/" + fileName)
          .then(() => {
            console.log("CREATED FILE COPY");
            DB.uploadAudio(fileName);
          });
      }
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
        onRequestClose={() => {this.props.showMake(false)}} >

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
              <Text style={styles.status}>Duration: {this.state.recTime.toPrecision(3)}</Text>
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
