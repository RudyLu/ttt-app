import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { Card, Icon, ListItem } from 'react-native-elements';

import fetchData from './data';
import InputModal from './InputModal';

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
    // XXX: fine tune the list item auto scroll later.
    return;
    this.flatListRef.scrollToIndex({ animated: true, index: index });
  };

  onPress = () => {
    this.scrollToIndex();
  };

  render() {
    if (this.state.isLoading) {
      return (
        <Card title={this.state.title}>
          <ActivityIndicator />
        </Card>
      );
    }

    return (
      <Card
        title={this.state.title}
        containerStyle={{ flex: 1, borderWidth: 4, marginBottom: 20 }}
        wrapperStyle={{ flex: 1 }}
      >
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item, i }) => (
            <ListItem
              key={i}
              leftAvatar={{ title: item.DailyTrainInfo.TrainTypeName.Zh_tw }}
              title={`${item.OriginStopTime.DepartureTime} - ${
                item.DestinationStopTime.ArrivalTime
              }`}
              subtitle={item.DailyTrainInfo.TrainNo + '車次'}
              bottomDivider
            />
          )}
          keyExtractor={({ id }, index) => index + ''}
          ref={ref => {
            this.flatListRef = ref;
          }}
          getItemLayout={this.getItemLayout}
        />
        <InputModal />
      </Card>
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
