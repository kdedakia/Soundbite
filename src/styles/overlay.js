import {StyleSheet} from 'react-native';
import Dimensions from 'Dimensions';

var styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: 350,
    top: 0,
    left: 0,
    backgroundColor: 'blue',
  },
  btnContainer: {
    flexDirection:'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  okBtn: {
    height: 70,
    width: 70,
    backgroundColor: 'steelblue',
    borderRadius: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonIcon: {
    fontSize: 50,
    height: 50,
    color: 'white',
  },
  btnText: {
    color: 'steelblue',
    textAlign: 'center',
    fontSize: 20,
  },
  closeBtn: {
    fontSize: 30,
    width: 25,
    height: 25,
    color: 'steelblue',
    alignSelf: 'flex-end',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    borderRadius: 10,
    height: Dimensions.get('window').height-100,
  },
  innerHeader: {
    marginBottom: 20,
  },
});

export default styles;
