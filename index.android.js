import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import Main from './src/components/common/main'
import configureStore from './src/store/configureStore'

const store = configureStore()

class RNTest extends Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('RNTest', () => RNTest)
