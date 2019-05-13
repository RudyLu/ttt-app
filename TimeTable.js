import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';

import fetchData from './data';

export default class TimeTable extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    return fetchData(this.props.src, this.props.dst)
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

        if (responseJson.length != 0) {
          var title = `${responseJson[0].OriginStopTime.StationName.Zh_tw} - ${
            responseJson[0].DestinationStopTime.StationName.Zh_tw
          }`;
        }

        var date = new Date();
        var dateString = `${date.getHours()}:${(date.getMinutes() + '').padStart(2, '0')}`;
        console.log(dateString);

        // find the closest
        var currentIndex = 0;
        for (var i = 0; i < responseJson.length; i++) {
          if (responseJson[i].OriginStopTime.DepartureTime > dateString) {
            currentIndex = i;
            console.log(responseJson[i].OriginStopTime.DepartureTime);
            break;
          }
        }

        this.setState(
          {
            isLoading: false,
            dataSource: responseJson,
            title,
          },
          () => {
            setTimeout(() => {
              console.log(currentIndex);
              this.scrollToIndex(currentIndex);
            }, 100);
          },
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  getItemLayout = (data, index) => ({ length: 100, offset: 100 * index, index });

  scrollToIndex = index => {
    this.flatListRef.scrollToIndex({ animated: true, index: index });
  };

  onPress = () => {
    this.scrollToIndex();
  };

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
        <Text style={styles.time}>{this.state.title}</Text>
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.train}>{item.DailyTrainInfo.TrainNo} 車次</Text>
              <Text style={styles.time}>
                {item.OriginStopTime.DepartureTime} - {item.DestinationStopTime.ArrivalTime}
              </Text>
            </View>
          )}
          keyExtractor={({ id }, index) => index + ''}
          ref={ref => {
            this.flatListRef = ref;
          }}
          getItemLayout={this.getItemLayout}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 100,
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
