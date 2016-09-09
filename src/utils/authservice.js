import Auth0Lock from 'react-native-lock'
import { isTokenExpired } from './jwthelper'
import {
  AsyncStorage,
} from 'react-native';

export default class AuthService {
  constructor(clientId, domain) {
    this.lock = new Auth0Lock({clientId: clientId, domain: domain})

    // binds login functions to keep this context
    this.login = this.login.bind(this)
  }

  getFBToken(idToken) {
    this.lock.authenticationAPI().delegation({
      clientId: 'sOp1QvEWdBH9wI2X7SZr1EANlG8fY3es',
      idToken: idToken,
      target: 'sOp1QvEWdBH9wI2X7SZr1EANlG8fY3es',
      scope: 'openid',
      api_type: 'firebase',
    })
  }

  login(cb) {
    // Call the show method to display the widget.
    var self = this;
    this.lock.show({closable: true}, (err,profile,token) => this.handleLogin(err,profile,token,cb))
  }

  handleLogin(err,profile,token,cb) {
    if (err) {
      console.log(err);
      return;
    }
    else {
      cb(profile,token.idToken,token.refreshToken);
      AsyncStorage.multiSet([['idToken',token.idToken],['refreshToken',token.refreshToken],['user',JSON.stringify(profile)]])
    }
  }

  loggedIn(){
    const token = this.getToken()
    // Checks if there is a saved token and it's still valid
    return !!token && !isTokenExpired(token)
  }

  getToken(){
    return AsyncStorage.getItem('idToken')
  }

  logout(){
    // Clear user token and profile data from localStorage
    AsyncStorage.multiRemove(['idToken','refreshToken','user'], (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  getUser() {

  }
}
