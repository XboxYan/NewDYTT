import React, { PureComponent } from 'react';
import { StackNavigator } from "react-navigation";
import { Platform } from 'react-native';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'
import Home from './src';

//TabNavigatorConfig
const TabNavigatorConfig = {
    //tabBarComponent:TabBarBottom,
    tabBarPosition:'bottom',
    animationEnabled:false,
    lazy:true,
    //backBehavior:'none',
    swipeEnabled:false,
    tabBarOptions:{
        showLabel:false,
        style:{
            height:48,
            backgroundColor: '#fff',
            borderTopWidth:0,
        }
    }
}

//StackNavigatorConfig
const StackNavigatorConfig = {
    headerMode:'none',
    cardStyle:{
        backgroundColor:'#f1f1f1',
    },
    navigationOptions:{
        gesturesEnabled:true
    },
    transitionConfig: () => ({
        screenInterpolator: CardStackStyleInterpolator.forHorizontal
    })
}
//StackNavigator
const App = StackNavigator({
    Home: { screen: Home },
},StackNavigatorConfig);

export default App;