import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert } from 'react-native';
import { Input } from 'react-native-elements';

export default class InputModal extends Component {
  constructor(props) {
    super(props);
    this.state = { src: '', dst: '' };
  }

  render() {
    return (
      <View style={{ marginTop: 22 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.visible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <View style={{ marginTop: 22 }}>
            <View>
              <Input placeholder="From" onChangeText={text => this.setState({ src: text })} />
              <Input placeholder="To" onChangeText={text => this.setState({ dst: text })} />

              <TouchableHighlight onPress={() => this.props.onClose(this.state)}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
