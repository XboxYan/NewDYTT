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
    TouchableOpacity,
    Animated,
    InteractionManager,
    Image,
    StatusBar,
    Picker,
    LayoutAnimation,
    Text,
    View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import AppTop from '../../components/AppTop';
import Touchable from '../../components/Touchable';
import Star from '../../components/Star';
import axios from '../../util/axios';

//头部
const MovieTop = ({scrollTop,goBack,name}) => (
    <View style={styles.appbar}>
        <Touchable
            style={styles.btn}
            onPress={goBack}
        >
            <Icon name='keyboard-arrow-left' size={30} color='#fff' />
        </Touchable>
        <View style={styles.apptitle}>
            <Animated.Text style={[styles.apptitletext, {
                opacity: scrollTop.interpolate({
                    inputRange: [$.STATUS_HEIGHT + 40, $.STATUS_HEIGHT + 41],
                    outputRange: [1, 0]
                })
            }]} numberOfLines={1}>影视详情</Animated.Text>
            <Animated.Text style={[styles.apptitletext, {
                opacity: scrollTop.interpolate({
                    inputRange: [$.STATUS_HEIGHT + 40, $.STATUS_HEIGHT + 41],
                    outputRange: [0, 1]
                })
            }]} numberOfLines={1}>{name}</Animated.Text>
        </View>
        <Touchable
            style={styles.btn}
        >
            <Icon name='favorite-border' size={20} color='#fff' />
        </Touchable>
        <Animated.View style={[styles.fullcon, { backgroundColor: $.Color }, {
            opacity: scrollTop.interpolate({
                inputRange: [$.STATUS_HEIGHT, $.STATUS_HEIGHT + 50],
                outputRange: [0, 1]
            })
        }]} />
    </View>
)

//视频
const MovieInfo = ({
        moviedata:{img,status,score,name,area,release,updateDate,sourceTypes=[{}]},
        sourceTypeIndex,
        getSource
    }) => (
    <Animated.View style={[styles.videobox]}>
        <View style={styles.videostart}>
            <View style={styles.poster}>
                <Image source={{ uri: img }} style={[styles.fullcon, styles.borR]} />
                <TouchableOpacity onPress={this.play} activeOpacity={.8} style={[styles.playbtn, { backgroundColor: $.Color }]}>
                    <Icon name='play-arrow' size={24} color='#fff' />
                </TouchableOpacity>
            </View>
            <View style={[styles.postertext,false&&{height:($.WIDTH-40)*9/16}]}>
                <Text style={[styles.title, { color: $.Color }]}>{name}</Text>
                <Star style={styles.score} score={score} />
                {
                    status && <Text style={styles.status}>{status}</Text>
                }
                <Text style={styles.subtitle}>{area} / {release}</Text>
                <Text style={styles.subtitle}>{updateDate} 更新</Text>
                <View style={styles.sourceType}>
                    <Text style={styles.pickertitle}>来源 / </Text>
                    <Text style={[styles.pickertitle, { color: $.Color }]}>{sourceTypes[sourceTypeIndex].desc}</Text>
                    <Icon name='expand-more' size={20} color={$.Color} />
                    <Picker
                        style={styles.picker}
                        selectedValue={'pos' + sourceTypeIndex}
                        onValueChange={getSource}
                        mode='dropdown'>
                        {
                            sourceTypes.map((el, i) => <Picker.Item color={'#666'} key={i} label={el.desc + el.type || ''} value={'pos' + i} />)
                        }
                    </Picker>
                </View>
            </View>
        </View>
    </Animated.View>
)

export default class extends PureComponent {

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    
    movieId = '';

    state = {
        moviedata : {},
        sourceTypeIndex : 0,
        sources : {}
    }

    scrollTop = new Animated.Value(0);

    getData = async (id) => {
        
        const data = await axios.get('/video',{
            params:{
                videoId:id,
            }
        })

        LayoutAnimation.spring();

        this.setState({
            moviedata:data.data.body,
            sources:data.data.body.sources
        })

        //console.warn(data.data.body)

    }

    getSource = async (value, position) => {
        const {moviedata:{sourceTypes}} = this.state;
        const data = await axios.get('/videosource',{
            params:{
                movieId:this.movieId,
                type: sourceTypes[position].type,
                name: sourceTypes[position].name
            }
        })
        this.setState({
            sources:data.data.body,
            sourceTypeIndex:position
        });
        console.warn(data.data.body)
    }
    
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const { params: { movieId } } = this.props.navigation.state;
            this.movieId = movieId;
            this.getData(movieId);
        })
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    render() {
        const { navigation } = this.props;
        const { moviedata,sourceTypeIndex } = this.state;
        return (
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[0]}
                //scrollEventThrottle={1}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: this.scrollTop } } }],
                    //{ useNativeDriver: true } // <-- 加上这一行
                )}
            >
                <MovieTop scrollTop={this.scrollTop} name={moviedata.name} />
                <Animated.Image
                    resizeMode='cover'
                    blurRadius={3.5}
                    source={{ uri: moviedata.img }}
                    style={[styles.bg_place, {backgroundColor: $.Color,
                        transform: [{
                            scale: this.scrollTop.interpolate({
                                inputRange: [0, $.STATUS_HEIGHT + 50],
                                outputRange: [1, 1.3]
                            })
                        }]
                }]} />
                <MovieInfo moviedata={moviedata} sourceTypeIndex={sourceTypeIndex} getSource={this.getSource} />
                <View style={{height:2000}}></View>
            </Animated.ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    bg_place: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        resizeMode: 'cover',
        height: $.WIDTH * 9 / 16
    },
    video_place: {
        height: $.WIDTH * 9 / 16,
        backgroundColor: '#000',
    },
    movieTitle: {
        fontSize: 16,
        color: '#333',
        padding: 15,
        backgroundColor: '#fff'
    },
    viewcon: {
        marginBottom: 10,
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 3,
        marginHorizontal: 10,
    },
    row: {
        flexDirection: 'row'
    },
    view_hd: {
        height: 15,
        borderLeftWidth: 3,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    view_title: {
        fontSize: 15,
        color: '#333',
        flex: 1
    },
    con: {
        paddingHorizontal: 15,
        paddingBottom: 5,
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    text: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20
    },
    fullScreen: {
        position: 'absolute',
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,
        height: $.WIDTH * 9 / 16
    },
    appbar: {
        paddingTop: $.STATUS_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10
    },
    fullcon: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
    },
    borR: {
        borderRadius: 3,
    },
    btn: {
        width: 48,
        height: 48,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    apptitle: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'stretch',
        zIndex: 1
    },
    apptitletext: {
        position: 'absolute',
        fontSize: 16,
        color: '#fff',
    },
    poster: {
        padding: 10,
        borderRadius: 3,
        backgroundColor: '#f1f1f1',
        width: 110,
        height: 160,
        marginHorizontal: 10,
        justifyContent:'center',
        alignItems: 'center'
    },
    postertext: {
        flex: 1,
        marginRight: 10,
        marginLeft: 5,
    },
    title: {
        fontSize: 18,
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        paddingTop: 3
    },
    sptext: {
        fontStyle: 'italic',
        color: '#666'
    },
    playbtn: {
        position:'absolute',
        zIndex:10,
        height: 34,
        width:34,
        borderRadius: 17,
        justifyContent:'center',
        alignItems: 'center',
        opacity:.9
    },
    playtext: {
        fontSize: 14,
        color: '#fff'
    },
    castitem: {
        alignItems: 'center',
        marginRight: 10,
        width: 60,

    },
    castimgwrap: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        overflow: 'hidden'
    },
    castimg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        position: 'absolute'
    },
    casttitle: {
        position: 'absolute',
        fontSize: 30,
        color: '#999'
    },
    castname: {
        fontSize: 14,
        color: '#666',
    },
    typeitem: {
        backgroundColor: '#f1f1f1',
        height: 30,
        paddingHorizontal: 15,
        borderRadius: 15,
        justifyContent: 'center',
        marginTop: 10,
        marginRight: 10
    },
    typename: {
        fontSize: 14,
        minWidth: 20,
        color: '#666'
    },
    star: {
        marginVertical: 5
    },
    status: {
        fontSize: 10,
        paddingHorizontal: 5,
        marginVertical: 5,
        paddingVertical: 1,
        borderRadius: 1,
        alignSelf: 'flex-start',
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,.4)'
    },
    director: {
        position: 'absolute',
        right: 0,
        top: 0,
        fontSize: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
        fontWeight: 'bold',
        borderRadius: 8,
        color: '#fff'
    },
    commentbtn: {
        marginHorizontal: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_more: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    view_moretext: {
        fontSize: 13,
        color: '#999'
    },
    sourcelist: {
        paddingHorizontal: 15
    },
    sourceitem: {
        backgroundColor: '#f1f1f1',
        minWidth: 50,
        maxWidth: 150,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        justifyContent: 'center',
        marginVertical: 5,
        marginRight: 10,
        padding: 10,
        overflow: 'hidden',
        alignItems: 'center',
    },
    sourceType: {
        paddingTop: 3,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center'
    },
    pickertitle: {
        fontSize: 14,
        color: '#666',
    },
    picker: {
        width: 120,
        height: 30,
        left: 30,
        padding: 0,
        opacity: 0,
        position: 'absolute'
    },
    backgroundVideo: {
        flex: 1,
        backgroundColor: '#000',
    },
    sourcedot: {
        position: 'absolute',
        right: 4,
        top: 4,
        width: 5,
        height: 5,
        borderRadius: 5,
        opacity: 0
    },
    videoCon: {
        position: 'absolute',
        left: 10,
        top: 10,
        right: 10,
        bottom: 10,
        backgroundColor: '#000',
        transform: [{ rotateX: '180deg' }]
    },
    closebtn:{
        position: 'absolute',
        right: 0,
        top: 0,
        padding:10
    },
    videobox: {
        marginBottom: 10,
        marginHorizontal: 10,
        zIndex:2
    },
    videostart:{
        paddingVertical: 10,
        backgroundColor:'#fff',
        borderRadius:3,
        flexDirection:'row'
    }
})