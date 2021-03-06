import React from 'react';
import {StatusBar} from 'react-native';

export default class extends React.Component {
  static navigatorStyle = {
    //navBarHideOnScroll:true,
    drawUnderTabBar: true,
    //topTabTextColor: '#ffffff',
    //selectedTopTabTextColor: '#ff505c',
    //topTabsHeight: 40,
    //topBarBorderWidth: 5.5,
    // Icons
    //topTabIconColor: '#ffffff',
    //selectedTopTabIconColor: '#ff505c',
    topTabsScrollable: true,
    topBarElevationShadowEnabled: false,
    // Tab indicator
    selectedTopTabIndicatorHeight: 4,
    //selectedTopTabIndicatorColor: '#ff505c',
  };
  render(){
    return (
      <StatusBar
        backgroundColor="blue"
        barStyle="light-content"
      />
    )
  }
}

