/* Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import Carousel from 'react-native-snap-carousel';
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
  Dimensions
} from 'react-native';

import fetchData from './data';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

class MyCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [
        {
          title: 'Beautiful and dramatic Antelope Canyon',
          subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
          illustration: 'https://i.imgur.com/UYiroysl.jpg',
        },
        {
          title: 'Earlier this morning, NYC',
          subtitle: 'Lorem ipsum dolor sit amet',
          illustration: 'https://i.imgur.com/UPrs1EWl.jpg',
        },
        {
          title: 'White Pocket Sunset',
          subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
          illustration: 'https://i.imgur.com/MABUbpDl.jpg',
        },
        {
          title: 'Acrocorinth, Greece',
          subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
          illustration: 'https://i.imgur.com/KZsmUi2l.jpg',
        },
        {
          title: 'The lone tree, majestic landscape of New Zealand',
          subtitle: 'Lorem ipsum dolor sit amet',
          illustration: 'https://i.imgur.com/2nCt3Sbl.jpg',
        },
        {
          title: 'Middle Earth, Germany',
          subtitle: 'Lorem ipsum dolor sit amet',
          illustration: 'https://i.imgur.com/lceHsT6l.jpg',
        },
      ],
    };
  }

  _renderItem({ item, index }) {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Greeting />
      </View>
    );
  }

  render() {
    return (
      <Carousel
        ref={c => {
          this._carousel = c;
        }}
        data={this.state.entries}
        renderItem={this._renderItem}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth}
        slideStyle={{ width: viewportWidth }}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
      />
    );
  }
}

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
          var res = a.OriginStopTime.DepartureTime < b.OriginStopTime.DepartureTime;
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
      <View style={{ flex: 1 }}>
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
        <MyCarousel />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
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
  slide: {
    flex: 1,
    backgroundColor: 'silver'
  }
});
