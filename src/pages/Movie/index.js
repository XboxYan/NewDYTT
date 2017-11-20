import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';

export default class HomeScreen extends Component {
    render(){
        return (
            <View style={styles.container}>
            <ScrollView style={styles.container}>
            {[...new Array(40)].map((a, index) => (
                <Text key={`row_${index}`} >Row {index}</Text>
              ))}
          </ScrollView>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'orangered',
    },
  });