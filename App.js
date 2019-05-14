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
  Image,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import { Button, Card, Icon, ListItem, Header, ThemeProvider, Avatar } from 'react-native-elements';

import TimeTable from './TimeTable';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
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
          src: 1012,
          dst: 1008,
        },
        {
          src: 1008,
          dst: 1012,
        },
      ],
    };
  }

  _renderItem({ item, index }) {
    return (
      <View style={styles.slide}>
        <TimeTable src={item.src} dst={item.dst} />
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

const theme = {
  Button: {
    raised: true,
  },
};

const users = [
  {
    name: 'brynn',
    subtitle: 'someone who is capable of ...',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
  },
  {
    name: 'brynn',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
  },
];

export default class TimeTableApp extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        {/*
        <Card containerStyle={{ padding: 0 }}>
          {users.map((u, i) => {
            return (
              <ListItem
                key={i}
                leftAvatar={{ source: { uri: u.avatar } }}
                title={u.name}
                subtitle={u.subtitle}
              />
            );
          })}
        </Card>
        */}

        <View style={{ flex: 1 }}>
          <Header centerComponent={{ text: 'TTT', style: { color: '#fff' } }} />
          <MyCarousel />
        </View>
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    backgroundColor: '#EEE',
  },
  image: {
    width: 50,
    height: 50,
  },
});
