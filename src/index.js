/*
*
Home
*
*/

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    UIManager,
    ScrollView,
    StatusBar,
    LayoutAnimation,
    View,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';

import AppTop from './components/AppTop';
import MovieContent from './pages/Movie/MovieContent';
import ScrollViewPager from 'react-native-scrollviewpager';


const tabBarOptions = {
    tabconStyle: {
        justifyContent: 'center',
        //paddingHorizontal:15
    },
    style: {
        backgroundColor: '#f7f7f7',
    },
    scrollEnabled: true,
    tabStyle: {
        height: 40,
        paddingHorizontal: 15,
        //width:100
    },
    labelStyle: {
        fontSize: 14,
        color: '#666',
    },
    activelabelStyle:{
      transform:[{scale:1.05}],
      color:$.Color
    },
    indicatorStyle: {
        backgroundColor: $.Color,
        height: 3,
        marginBottom:3,
        borderRadius:2,
        width: 20
    }
}

const tabs = [
    // {
    //     name: '热播',
    //     id: 0
    // },
    {
        name: '电影',
        id: 1
    },
    {
        name: '电视',
        id: 2
    },
    {
        name: '动漫',
        id: 3
    },
    {
        name: '综艺',
        id: 4
    },
    {
        name: '微电影',
        id: 5
    },
    {
        name: '少儿',
        id: 6
    },
]

export default class extends PureComponent {
    
    componentDidMount() {
        SplashScreen.hide();
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.content}>
                <AppTop title='推荐' navigation={navigation} />
                <StatusBar
                  translucent={true}
                  barStyle="light-content"
                  backgroundColor={"rgba(0,0,0,0)"}
                />
                <ScrollViewPager tabBarOptions={tabBarOptions} >
                    {
                        tabs.map((el,i)=>(
                            <MovieContent tablabel={el.name} key={i} id={el.id} navigation={navigation} />
                        ))
                    }
                </ScrollViewPager>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor:'#fff'
    },
})