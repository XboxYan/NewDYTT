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
    Text,
    View,
} from 'react-native';

import AppTop from '../../components/AppTop';




export default class extends PureComponent {
    
    componentDidMount() {
        console.warn('55')
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.content}>
                <Text>55555</Text>
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