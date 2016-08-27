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
    }
  }

  playSound(file) {
    var self = this;

    if (this.props.fetchingBite) {
      alert("STILL DOWNLOADING BITE");
      return;
    }

    if (this.state.isPlaying) {
      this.setState({sound:null,isPlaying:false});
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

        self.setState({sound:bite,isPlaying: true});
        bite.play((success) => {
          if (success) {
            console.log('successfully finished playing');
            self.setState({sound:null, isPlaying: false});
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }
    });
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
        </View>
      )
    }

    let loading;
    if (this.props.fetchingBite) {
      loading = <Text>Loading Bite...</Text>
    }

    return (
      <Modal
        animationType={this.state.animationType}
        transparent={true}
        visible={this.props.overlay == "VIEW"}
        onRequestClose={() => {this.props.showMake.bind(this,false)}} >

        <View style={[OverlayStyles.container, modalBackgroundStyle]}>
          <View style={[OverlayStyles.innerContainer, innerContainerTransparentStyle]}>
            <View style={OverlayStyles.innerHeader}>
              <TouchableHighlight onPress={this.props.showView.bind(this,false)}>
                <Icon name="md-close" style={OverlayStyles.closeBtn}/>
              </TouchableHighlight>
            </View>

            {loading}

            <TouchableHighlight onPress={this.playSound.bind(this,"current.mp4")} style={OverlayStyles.okBtn}>
                <Icon name="md-play" style={OverlayStyles.actionButtonIcon} />
            </TouchableHighlight>

            { content }

          </View>
        </View>

      </Modal>
    );
  }
}
