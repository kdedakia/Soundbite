import Auth0Lock from 'react-native-lock'
import Auth0 from 'react-native-auth0';
import {
  AsyncStorage,
} from 'react-native';
// import { isTokenExpired } from './jwthelper'


export default class AuthService {
  constructor(clientId, domain) {
    this.lock = new Auth0Lock({clientId: clientId, domain: domain})
    this.auth = new Auth0('dedakia.auth0.com');
  }
}
