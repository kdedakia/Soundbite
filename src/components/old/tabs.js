import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';

class Tabs extends Component {
  render() {
    return (
      <ScrollableTabView
        style={{marginTop: 20, flex: 1}}
        renderTabBar={() => <DefaultTabBar />}
        initialPage={1}
      >

        <ScrollView tabLabel='ADD'  style={styles.tabView}>

        </ScrollView>

        <ScrollView tabLabel='MAP' style={styles.tabView}>
          <MapBox />
        </ScrollView>

        <ScrollView tabLabel='Login' style={styles.tabView}>
          <Welcome />
        </ScrollView>

      </ScrollableTabView>
    );
  }
}

var styles = Stylesheet.create({
  tabView: {
    flex: 1,
    backgroundColor: "red",
  },
});
