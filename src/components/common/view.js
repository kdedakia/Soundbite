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
      playedSound: false,
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

            self.props.setListened(self.props.currMarker.f_id,self.props.user.email)
            clearInterval(self.state.timer);
            self.setState({sound:null, isPlaying: false, playTime: 0,playedSound: true});
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

  upvote() {
    if(this.checkVote() == "DOWNVOTE") {
      this.cancelDownvote();
    }
    this.props.upvote(this.props.currMarker.firebaseId,this.props.user.email)
  }

  cancelUpvote() {
    this.props.cancelUpvote(this.props.currMarker.firebaseId,this.props.user.email)
  }

  downvote() {
    if(this.checkVote() == "UPVOTE") {
      this.cancelUpvote();
    }
    this.props.downvote(this.props.currMarker.firebaseId,this.props.user.email)
  }

  cancelDownvote() {
    this.props.cancelDownvote(this.props.currMarker.firebaseId,this.props.user.email)
  }

  // Options: UPVOTE, DOWNVOTE, NOVOTE
  checkVote() {
    let upvotes = Object.keys(this.props.currMarker.upvotes).map((v) => {return this.props.currMarker.upvotes[v].user})
    let downvotes = Object.keys(this.props.currMarker.downvotes).map((v) => {return this.props.currMarker.downvotes[v].user})

    if (upvotes.indexOf(this.props.user.email) != -1) {
      return "UPVOTE";
    }
    if (downvotes.indexOf(this.props.user.email) != -1) {
      return "DOWNVOTE";
    }
    return "NOVOTE";
  }

  voteCount() {
    if (this.props.currMarker == null) {
      return;
    }

    let upvotes = Object.keys(this.props.currMarker.upvotes).map((v) => {return this.props.currMarker.upvotes[v].user})
    let downvotes = Object.keys(this.props.currMarker.downvotes).map((v) => {return this.props.currMarker.downvotes[v].user})

    return (
      <View>
        <Text>Upvotes: {upvotes.length}</Text>
        <Text>Downvotes: {downvotes.length}</Text>
      </View>
    )
  }

  voteBtns() {
    // Can only vote after finished listening
    if (this.props.currMarker == null || !this.state.playedSound) {
      return;
    }

    // User's can't vote on their own bites
    if (this.props.currMarker.user == this.props.user.email) {
      return;
    }

    let buttons = [];
    let currVote = this.checkVote();

    if (currVote == "UPVOTE") {
      buttons.push(
        <TouchableHighlight key="up" onPress={this.cancelUpvote.bind(this)} style={[OverlayStyles.okBtn,styles.voteBtn]}>
          <Icon name="md-thumbs-up" style={[OverlayStyles.actionButtonIcon,styles.voteIcon, styles.active]} />
        </TouchableHighlight>
      )
    } else {
      buttons.push(
        <TouchableHighlight key="up" onPress={this.upvote.bind(this)} style={[OverlayStyles.okBtn,styles.voteBtn]}>
          <Icon name="md-thumbs-up" style={[OverlayStyles.actionButtonIcon,styles.voteIcon]} />
        </TouchableHighlight>
      )
    }

    let upvotes = Object.keys(this.props.currMarker.upvotes).map((v) => {return this.props.currMarker.upvotes[v].user})
    let downvotes = Object.keys(this.props.currMarker.downvotes).map((v) => {return this.props.currMarker.downvotes[v].user})
    let score = upvotes.length - downvotes.length;
    buttons.push(
      <Text key="count" style={styles.voteCount}>{score}</Text>
    )

    if (currVote == "DOWNVOTE") {
      buttons.push(
        <TouchableHighlight key="down" onPress={this.cancelDownvote.bind(this)} style={[OverlayStyles.okBtn,styles.voteBtn]}>
          <Icon name="md-thumbs-down" style={[OverlayStyles.actionButtonIcon,styles.voteIcon, styles.active]} />
        </TouchableHighlight>
      )
    } else {
      buttons.push(
        <TouchableHighlight key="down" onPress={this.downvote.bind(this)} style={[OverlayStyles.okBtn,styles.voteBtn]}>
          <Icon name="md-thumbs-down" style={[OverlayStyles.actionButtonIcon,styles.voteIcon]} />
        </TouchableHighlight>
      )
    }

    return (
      <View style={styles.playContainer}>
        {buttons}
      </View>
    );
  }

  render() {
    var activeButtonStyle = {
      backgroundColor: '#ddd'
    };

    var content;
    if (this.props.currMarker != null) {
      content = (
        <View>
          <Text style={[OverlayStyles.btnText,styles.title]}>{ this.props.currMarker.title }</Text>
          <Text style={[OverlayStyles.btnText,styles.user]}>{ this.props.currMarker.user }</Text>
          <Text style={[OverlayStyles.btnText,styles.duration]}>{ this.props.currMarker.duration }s</Text>
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

        <View style={OverlayStyles.container}>
          <View style={OverlayStyles.innerContainer}>
            <View style={OverlayStyles.innerHeader}>
              <Text style={OverlayStyles.title}>SoundBite</Text>
              <TouchableHighlight onPress={this.closeModal.bind(this)}>
                <Icon name="ios-close-circle-outline" style={OverlayStyles.closeBtn}/>
              </TouchableHighlight>
            </View>

            {loading}
            {content}

            <View style={styles.playContainer}>
              <TouchableHighlight onPress={this.playSound.bind(this,"current.mp4")} style={[OverlayStyles.okBtn,OverlayStyles.playBtn]}>
                { this.state.isPlaying? <Icon name="md-square" style={OverlayStyles.actionButtonIcon} /> : <Icon name="md-play" style={OverlayStyles.actionButtonIcon} /> }
              </TouchableHighlight>
              {progressBar}
            </View>
            <View style={styles.voteContainer}>
              { this.voteBtns() }
            </View>
          </View>
        </View>

      </Modal>
    );
  }
}

var styles = StyleSheet.create({
  title: {
    fontSize: 50,
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  user: {
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  duration: {
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  playContainer: {
    alignSelf: 'center',
    marginTop: 20,
  },
  progressBar: {
    marginBottom: 20,
  },
  active: {
    color: 'red',
  },
  voteContainer: {
    marginVertical: 20,
  },
  voteBtn: {
    height: 40,
    width: 40,
  },
  voteCount: {
    fontSize: 30,
    color: '#77C9FA',
    width: 40,
    alignSelf: 'center',
  },
  voteIcon: {
    fontSize: 30,
    height: 30,
  }
});
