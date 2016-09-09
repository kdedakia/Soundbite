import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

export default class Login extends React.Component {
  render() {
    if (this.props.user == null) {
      return (
        <TouchableHighlight
            style={styles.signInButton}
            underlayColor='#949494'
            onPress={this.props.login.bind(this)} >
            <Text>Log In</Text>
        </TouchableHighlight>
      );
    } else {
      return (
        <View>
          <Text>LOGGED IN as {JSON.stringify(this.props.user.name)}</Text>
          <Text>ID Token: {this.props.idToken}</Text>
          <Text>Refresh Token: {this.props.refreshToken}</Text>
          <TouchableHighlight
              style={styles.signInButton}
              underlayColor='#949494'
              onPress={this.props.logout.bind(this)} >
              <Text>Log Out</Text>
          </TouchableHighlight>
        </View>
      )
    }
  }
}

var styles = StyleSheet.create({
  signInButton: {
    height: 50,
    alignSelf: 'stretch',
    backgroundColor: '#D9DADF',
    margin: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
