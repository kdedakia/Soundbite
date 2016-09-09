import Auth0Lock from 'react-native-lock'
// import { isTokenExpired } from './jwthelper'
import {
  AsyncStorage,
} from 'react-native';

export default class AuthService {
  constructor(clientId, domain) {
    this.lock = new Auth0Lock({clientId: clientId, domain: domain})
  }
}
