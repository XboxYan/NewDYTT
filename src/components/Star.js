import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    Animated,
    Image,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class StarCurrent extends PureComponent {
    width = new Animated.Value(0);
    componentWillUpdate(nextProps, nextState) {
        if (this.props.score != nextProps.score) {
            Animated.timing(
                this.width,
                {
                    toValue: nextProps.score * 7,
                    //duration: 500,
                    //useNativeDriver: true
                }
            ).start();
        }

    }
    componentDidMount() {
        if (this.props.score) {
            Animated.timing(
                this.width,
                {
                    toValue: this.props.score * 7,
                    //duration: 500,
                    //useNativeDriver: true
                }
            ).start();
        }
    }

    render() {
        return (
            <Animated.View style={[styles.star, { width: this.width }]}>
                <Image source={require('../img/star.png')} tintColor={$.Color} style={styles.star} />
            </Animated.View>
        )
    }
}

export default class Star extends PureComponent {
    render() {
        const { score, style, isShowNum = true } = this.props;
        if(!parseInt(score)){
            return null
        }
        return (
            <View style={[styles.starcon, style]}>
                <Image source={require('../img/star.png')} tintColor={'#f1f1f1'} style={styles.star} />
                <StarCurrent score={score} />
                {
                    isShowNum&&<Text style={[styles.score, { color: $.Color }]}>{score}</Text>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    starcon: {
        flexDirection: 'row',
        height: 20,
        alignItems: 'center'
    },
    star: {
        flexDirection: 'row',
        position: 'absolute',
        width:70,
        height:14,
        zIndex: 10,
        overflow: 'hidden'
    },
    score: {
        marginLeft: 75,
        fontSize: 13,
        paddingRight: 10
    }
});