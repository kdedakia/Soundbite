import {StyleSheet} from 'react-native';
import Dimensions from 'Dimensions';

var styles = StyleSheet.create({
  btnContainer: {
    flexDirection:'row',
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
    marginRight: 20,
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
    color: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    borderRadius: 10,
    minHeight: 400,
    backgroundColor: '#fff',
  },
  innerHeader: {
    backgroundColor: '#77C9FA',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: 'white',
    fontSize: 20,
  }
});

export default styles;
