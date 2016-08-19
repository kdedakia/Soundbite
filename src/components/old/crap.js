import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };
  }

  componentDidMount() {
    this.setState({dataSource: this.state.dataSource.cloneWithRows(sampleData)});
  }

  _renderRow(d,sectionID,rowID,highlightRow) {


    return (
        <View style={styles.row}>
            <Text style={styles.text}>{d.name}</Text>
            <Text style={styles.text}>{d.position}</Text>
            <Text style={styles.text}>{d.hours}</Text>
        </View>
    );
  }

  render() {
    return (
      <ListView dataSource={this.state.dataSource} renderRow={this._renderRow} />
    );
  }
}


<ActionButton buttonColor="rgba(231,76,60,1)">
  <ActionButton.Item buttonColor='#3498db' title="Spoof" onPress={this.spoofPos.bind(this)}>
    <Icon name="md-locate" style={styles.actionButtonIcon} />
  </ActionButton.Item>
  <ActionButton.Item buttonColor='#9b59b6' title="New Bite" onPress={this.toggleOverlay.bind(this)}>
    <Icon name="md-add-circle" style={styles.actionButtonIcon} />
  </ActionButton.Item>

</ActionButton>

<ActionButton.Item buttonColor='#3498db' title="Record" onPress={this.recordSound.bind(this,'test')}>
  <Icon name="md-microphone" style={styles.actionButtonIcon} />
</ActionButton.Item>
<ActionButton.Item buttonColor='#1abc9c' title="Play" onPress={this.playSound.bind(this,'test')}>
  <Icon name="md-play" style={styles.actionButtonIcon} />
</ActionButton.Item>

var styles = Stylesheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
