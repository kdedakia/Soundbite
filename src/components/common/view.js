import React, { Component } from 'react';
import * as Progress from 'react-native-progress';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import Dimensions from 'Dimensions';
import OverlayStyles from '../../styles/overlay';
import Icon from 'react-native-vector-icons/Ionicons';

const pathPrefix = RNFS.DocumentDirectoryPath;

export default class ViewBite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sound: null,
      isPlaying: false,
      animationType: 'fade',
      transparent: true,
      timer: null,
      playTime: 0.0,
    }
  }

  incrementPlayTime() {
    this.setState({playTime: this.state.playTime + 0.1});
    console.log(this.state.playTime);
  }

  playSound(file) {
    var self = this;

    if (this.props.fetchingBite) {
      alert("STILL DOWNLOADING BITE");
      return;
    }

    if (this.state.isPlaying) {
      this.stopSound();
      return;
    }

    var bite = new Sound(file, pathPrefix, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
      } else { // loaded successfully
        console.log('duration in seconds: ' + bite.getDuration() +
            'number of channels: ' + bite.getNumberOfChannels());

        self.setState({sound:bite,isPlaying: true,playTime: 0, timer:setInterval(self.incrementPlayTime.bind(self) ,100)});
        // self.incrementPlayTime();

        bite.play((success) => {
          if (success) {
            console.log('successfully finished playing');
            clearInterval(self.state.timer);
            self.setState({sound:null, isPlaying: false, playTime: 0});
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }
    });
  }

  stopSound() {
    this.setState({sound:null,isPlaying:false});
    this.state.sound.stop();
    this.state.sound.release();
    clearInterval(this.state.timer);
  }

  closeModal() {
    this.state.isPlaying? this.stopSound() : null;
    this.props.showView(false);
  }

  render() {
    var modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
    };
    var innerContainerTransparentStyle = this.state.transparent
      ? {backgroundColor: '#fff'}
      : null;
    var activeButtonStyle = {
      backgroundColor: '#ddd'
    };

    var content;
    if (this.props.currMarker != null) {
      content = (
        <View>
          <Text style={OverlayStyles.btnText}>ID: { this.props.currMarker.id }</Text>
          <Text style={OverlayStyles.btnText}>Title: { this.props.currMarker.title }</Text>
          <Text style={OverlayStyles.btnText}>Duration: { this.props.currMarker.duration }</Text>
          <Text style={OverlayStyles.btnText}>File: { this.props.currMarker.file }</Text>
          <Text style={OverlayStyles.btnText}>User: { this.props.currMarker.user }</Text>
        </View>
      )
    }

    let loading;
    if (this.props.fetchingBite) {
      loading = <Text>Loading Bite...</Text>
    }

    let progressBar;
    if(this.props.currMarker && this.state.isPlaying) {
      progressBar = <Progress.Bar progress={(this.state.playTime/this.props.currMarker.duration)} width={200} style={styles.progressBar} />
    }

    return (
      <Modal
        animationType={this.state.animationType}
        transparent={true}
        visible={this.props.overlay == "VIEW"}
        onRequestClose={() => {this.props.showMake(false)}} >

        <View style={[OverlayStyles.container, modalBackgroundStyle]}>
          <View style={[OverlayStyles.innerContainer, innerContainerTransparentStyle]}>
            <View style={OverlayStyles.innerHeader}>
              <TouchableHighlight onPress={this.closeModal.bind(this)}>
                <Icon name="md-close" style={OverlayStyles.closeBtn}/>
              </TouchableHighlight>
            </View>

            {loading}
            <View style={styles.playContainer}>
              <TouchableHighlight onPress={this.playSound.bind(this,"current.mp4")} style={[OverlayStyles.okBtn,OverlayStyles.playBtn]}>
                { this.state.isPlaying? <Icon name="md-square" style={OverlayStyles.actionButtonIcon} /> : <Icon name="md-play" style={OverlayStyles.actionButtonIcon} /> }
              </TouchableHighlight>
              {progressBar}
            </View>

            { content }

          </View>
        </View>

      </Modal>
    );
  }
}

var styles = StyleSheet.create({
  playContainer: {
    alignSelf: 'center'
  },
  progressBar: {
    marginBottom: 20,
  }
});
