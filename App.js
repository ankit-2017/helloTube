import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import SocialLogin from './src/components/socialLogin';
import SplashScreen from 'react-native-splash-screen'

export default class App extends Component {
  componentDidMount(){
    SplashScreen.hide();
  }
  render() {
    return (
      <View style={styles.container}>
        <SocialLogin />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  }
});
