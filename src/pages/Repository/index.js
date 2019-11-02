import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('star').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {};

  render() {
    console.tron.log(this.props);
    const { navigation } = this.props;
    const { html_url } = navigation.getParam('star');
    return (
      // <WebView source={{ uri: repository.html_url }} style={{ flex: 1 }} />
      <WebView source={{ uri: html_url }} style={{ flex: 1 }} />
    );
  }
}

export default Repository;
