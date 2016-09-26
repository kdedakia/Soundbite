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
    backgroundColor: '#77C9FA',
    borderRadius: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    alignSelf: 'center',
    marginBottom: 20,
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
    fontSize: 40,
    width: 40,
    height: 40,
    color: 'steelblue',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    borderRadius: 10,
    height: Dimensions.get('window').height-100,
    backgroundColor: '#fff',
  },
  innerHeader: {
    marginBottom: 20,
  },
});

export default styles;
