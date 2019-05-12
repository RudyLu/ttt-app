/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  Button,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import fetchData from './data';
import { blue } from 'ansi-colors';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});

class Greeting extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    return fetchData()
      .then(response => {
        return response.json();
      })
      .then(responseJson => {

        responseJson.sort((a, b) => {
          var res =  a.OriginStopTime.DepartureTime < b.OriginStopTime.DepartureTime;
          console.log(a.OriginStopTime.DepartureTime, b.OriginStopTime.DepartureTime, res);

          if (a.OriginStopTime.DepartureTime < b.OriginStopTime.DepartureTime) {
            return -1;
          }

          if (a.OriginStopTime.DepartureTime > b.OriginStopTime.DepartureTime) {
            return 1;
          }

          return 0;
        });


        this.setState(
          {
            isLoading: false,
            dataSource: responseJson,
          },
          function() {},
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, paddingTop: 40 }}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.time}>
                {item.OriginStopTime.StationName.Zh_tw} -{' '}
                {item.DestinationStopTime.StationName.Zh_tw}
              </Text>
              <Text style={styles.train}>{item.DailyTrainInfo.TrainNo} 車次</Text>
              <Text style={styles.time}>
                {item.OriginStopTime.DepartureTime} - {item.DestinationStopTime.ArrivalTime}
              </Text>
            </View>
          )}
          keyExtractor={({ id }, index) => id}
        />
      </View>
    );
  }
}

export default class HelloWorldApp extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {
    return (
      <View style={styles.container}>
        <Greeting />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    fontSize: 18,
  },

  time: {
    padding: 10,
    fontSize: 18,
  },

  train: {
    padding: 10,
    fontSize: 18,
    color: 'blue',
  },
});
