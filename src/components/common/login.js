import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';
import Auth0Lock from 'react-native-lock';

var lock = new Auth0Lock({clientId: 'sOp1QvEWdBH9wI2X7SZr1EANlG8fY3es', domain: 'dedakia.auth0.com'});

export default class Login extends React.Component {
  _onLogin() {
    lock.show({
      closable: true,
    }, (err, profile, token) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Logged In");
    });
  }

  render() {
    return (
      <TouchableHighlight
          style={styles.signInButton}
          underlayColor='#949494'
          onPress={this._onLogin} >
          <Text>Log In</Text>
      </TouchableHighlight>
    );
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
