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

const pathPrefix = RNFS.DocumentDirectoryPath;

export default class MakeBite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRecording: false,
      recTime: 0,
      timer: null,
      sound: null,
      animationType: 'fade',
      transparent: true,
    };
  }

  listDir() {
    RNFS.readDir(pathPrefix)
    .then((result) => {
      console.log('GOT RESULT', result);
      return result;
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

      Record.startRecord(pathPrefix + '/' + file + '.mp4', (err) => {
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

    var bite = new Sound(file + '.mp4', pathPrefix, (error) => {
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
    var s;

    s = new Sound('test' + '.mp4', pathPrefix, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      } else { // loaded successfully
        var markerID = self.state.text; //TODO: use good, unique ID's

        this.props.addMarker(
          {
            id: markerID,
            title: self.state.text,
            duration: s._duration.toPrecision(3),
            onPress: self.markerClick.bind(self,markerID),
            latitude: self.props.position.coords.latitude,
            longitude: self.props.position.coords.longitude
          }
        );

        // TODO: CHANGE THIS
        // Create audio file for marker
        RNFS.copyFile(pathPrefix + '/test.mp4',pathPrefix + "/" + markerID + '.mp4')
          .then(() =>
            console.log("COPIED FILE")
          );

      }
    });
  }

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
        <TouchableHighlight onPress={this.recordSound.bind(this,'test')} style={OverlayStyles.okBtn}>
            <Icon name="md-microphone" style={OverlayStyles.actionButtonIcon} />
        </TouchableHighlight>
        <TouchableHighlight onPress={this.playSound.bind(this,'test')} style={OverlayStyles.okBtn}>
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
