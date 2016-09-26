import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import OverlayStyles from '../../styles/overlay';
import Icon from 'react-native-vector-icons/Ionicons';
import Dimensions from 'Dimensions';

export default class Profile extends Component {
  render() {
    return(
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.props.overlay == "PROFILE"}
        onRequestClose={() => {this.props.showProfile(false)}} >

        <View style={OverlayStyles.container}>
          <View style={OverlayStyles.innerContainer}>
            <View style={OverlayStyles.innerHeader}>
              <TouchableHighlight onPress={this.props.showProfile.bind(this,false)}>
                <Icon name="ios-close-circle-outline" style={OverlayStyles.closeBtn}/>
              </TouchableHighlight>
            </View>
            <TextInput
              style={styles.inputTitle}
              placeholder="Nickname" />
            <TouchableHighlight style={[styles.saveBtn,styles.btn]} >
              <Text style={styles.logoutText}>Save</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.logoutBtn,styles.btn]} onPress={this.props.logout.bind(this)} >
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    )
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
  btn: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignSelf: 'center',
    borderRadius: 15,
    margin: 10,
  },
  saveBtn: {
    backgroundColor: '#77C9FA',
  },
  logoutBtn: {
    backgroundColor: 'red',
    marginTop: 50
  },
  logoutText: {
    color: 'white',
  }
});
