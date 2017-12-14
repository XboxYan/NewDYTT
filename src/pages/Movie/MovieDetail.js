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
    ToastAndroid,
    InteractionManager,
    Image,
    ImageBackground,
    FlatList,
    Picker,
    LayoutAnimation,
    Text,
    View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import ScrollViewPager from 'react-native-scrollviewpager';
import Video from 'react-native-video';
import AppTop from '../../components/AppTop';
import Touchable from '../../components/Touchable';
import Star from '../../components/Star';
import Loading from '../../components/Loading';
import axios from '../../util/axios';

const tabBarOptions = {
    wrapstyle: {
        height: $.HEIGHT - $.STATUS_HEIGHT - 48
    },
    tabconStyle: {
        justifyContent: 'center',
        paddingHorizontal: ($.WIDTH - 200) * .5
    },
    style: {
        backgroundColor: '#f7f7f7',
    },
    scrollEnabled: true,
    tabStyle: {
        width: 100,
        height: 40,
        paddingHorizontal: 15,
        //width:100
    },
    labelStyle: {
        fontSize: 14,
        color: '#666',
    },
    activelabelStyle: {
        transform: [{ scale: 1.05 }],
        color: $.Color
    },
    indicatorStyle: {
        backgroundColor: $.Color,
        height: 3,
        marginBottom: 3,
        borderRadius: 2,
        width: 20
    }
}

const SortTitle = (props) => (
    <View style={[styles.view_hd, { borderColor: $.Color }]}>
        <Text style={styles.view_title}>{props.title}</Text>
        {
            props.children || null
        }
    </View>
)

const TypeItem = (props) => (
    <TouchableOpacity activeOpacity={.7} style={styles.typeitem}>
        <Text style={styles.typename}>{props.item}</Text>
    </TouchableOpacity>
)

//头部
const MovieTop = ({ goBack, scrollTop, name }) => (
    <View style={styles.appbar}>
        <Touchable
            style={styles.btn}
            onPress={goBack}
        >
            <Icon name='chevron-left' size={24} color='#fff' />
        </Touchable>
        <View style={styles.apptitle}>
            <Text style={styles.apptitletext} numberOfLines={1}>{name}</Text>
        </View>
        <Touchable
            style={styles.btn}
        >
            <Icon name='heart' size={18} color='#fff' />
        </Touchable>
        <Animated.View style={[styles.fullcon, { backgroundColor: $.Color }, {
            opacity: scrollTop.interpolate({
                inputRange: [$.WIDTH * 9 / 16 - $.STATUS_HEIGHT - 48.1, $.WIDTH * 9 / 16 - $.STATUS_HEIGHT - 48],
                outputRange: [0, 1]
            })
        }]} />
    </View>
)

//影片信息
const MovieInfo = ({moviedata: { img, status, score, name=null, area,type,actors, release, updateDate, sourceTypes = [{}] },sourceTypeIndex,getSource}) => {
    const sourceType = name?(sourceTypes[sourceTypeIndex]?sourceTypes[sourceTypeIndex].desc:null):'加载中';
    return (
        <View style={[styles.viewcon, styles.movieinfo]}>
            <View style={styles.poster}>
                <Image source={{ uri: img }} style={[styles.fullcon, styles.borR]} />
            </View>
            <View style={styles.postertext}>
                <Text style={[styles.title,{color:$.Color }]}>{name?`${name} ( ${release}-${area} )`:''}</Text>
                <Star score={score} />
                {
                    status && <Text style={[styles.status,{backgroundColor:$.Color}]}>{status}</Text>
                }
                <Text style={styles.subtitle} numberOfLines={2} >人物 / {actors}</Text>
                <View style={styles.sourceType}>
                    <Text style={styles.subtitle}>来源 / </Text>
                    <Text style={[styles.subtitle, { color: $.Color }]}>{sourceType||'暂无资源'}</Text>
                    <Icon name='chevron-down' size={18} color={!!sourceType?$.Color:'transparent'} />
                    <Picker
                        style={styles.picker}
                        enabled={!!sourceType}
                        selectedValue={'pos' + sourceTypeIndex}
                        onValueChange={getSource}
                        mode='dropdown'>
                        {
                            sourceTypes.map((el, i) => <Picker.Item color={sourceTypeIndex === i ? $.Color : '#666'} key={i} label={el.desc + el.type || ''} value={'pos' + i} />)
                        }
                    </Picker>
                </View>
            </View>
        </View>
    )
}

//影片简介
class MovieSummary extends PureComponent {
    state = {
        isMore: false,
    }

    expand = () => {
        LayoutAnimation.spring();
        this.setState({ isMore: !this.state.isMore })
    }

    render() {
        const { moviedata: { type,desc=null } } = this.props;
        const { isMore } = this.state;
        const isRender = desc!== null;
        const types = type && type.split(' ').filter((el) => !!el);
        return (
            <View style={styles.viewcon}>
                <SortTitle title='剧情介绍'>
                    {
                        isRender &&
                        <TouchableOpacity
                            onPress={this.expand}
                            style={styles.view_more}
                        >
                            <Text style={styles.view_moretext}>{isMore ? '收起' : '展开'}</Text>
                            <Icon name={isMore ? 'chevron-up' : 'chevron-down'} size={18} color={$.Color} />
                        </TouchableOpacity>
                    }
                </SortTitle>
                <View style={styles.con}>
                    {
                        isRender
                            ?
                            <Text numberOfLines={isMore ? 0 : 5} style={styles.text}>{desc + desc}</Text>
                            :
                            <Loading size='small' text='' />
                    }
                </View>
                <View style={styles.con}>
                    {
                        isRender && types.map((el, i) => (
                            <TypeItem key={i} item={el} />
                        ))
                    }
                </View>
            </View>
        )
    }
}

const SourceItem = ({ item }) => {
    getUrl = () => {

    }
    return (
        <TouchableOpacity style={styles.sourceitem} activeOpacity={.7}>
            <Text numberOfLines={2} style={styles.castname}>{item.name || ' '}</Text>
            <View style={[styles.sourcedot, { backgroundColor: $.Color }, false && { opacity: 1 }]} />
        </TouchableOpacity>
    )
}

//影片资源
class MovieSource extends PureComponent {
    renderItem = ({ item, index }) => {
        return <SourceItem item={item} />
    }
    state = {
        isRender: false
    }
    componentDidMount() {
        
    }
    renderFooter = () => (
        <View style={{width:10,height:10}} />
    )
    renderEmpty = () => (
        <SourceItem item={{name:'暂无资源'}} />
    )
    render() {
        const {sources} = this.props;
        return (
            <View style={styles.viewcon}>
                <SortTitle title={`剧集`}/>
                <FlatList
                    ref={(ref) => this.flatlist = ref}
                    style={styles.sourcelist}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    //initialNumToRender={20}
                    //removeClippedSubviews={false}
                    ListEmptyComponent={this.renderEmpty}
                    ListFooterComponent={this.renderFooter}
                    data={sources}
                    keyExtractor={(item, index) => index + item.aid}
                    renderItem={this.renderItem}
                />
            </View>
        )
    }
}

export default class extends PureComponent {

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    movieId = '';

    tabIndex = 0;

    state = {
        moviedata: {},
        sourceTypeIndex: 0,
        isPlay : false,
        sources: [{}],
        playUrl:''
    }

    scrollTop = new Animated.Value(0);

    scrollBot = new Animated.Value(-70);

    getData = async (id) => {

        const data = await axios.get('/video', {
            params: {
                videoId: id,
            }
        })

        LayoutAnimation.spring();

        this.setState({
            moviedata: data.data.body,
            sources: data.data.body.sources
        })

        //this.scrollview.getNode().scrollTo({y:.3});
        //console.warn(data.data.body)

    }

    getSource = async (value, position) => {
        const { moviedata: { sourceTypes } } = this.state;
        const data = await axios.get('/videosource', {
            params: {
                movieId: this.movieId,
                type: sourceTypes[position].type,
                name: sourceTypes[position].name
            }
        })
        this.setState({
            sources: data.data.body,
            sourceTypeIndex: position
        });
        //console.warn(data.data.body)
    }


    onPlay = () => {
        const {sources} = this.state;
        ToastAndroid.show(sources[0].playUrl, ToastAndroid.SHORT);
        this.setState({
            isPlay:true,
            playUrl:sources[0].playUrl
        });
        this.scrollview.getNode().scrollTo({y:0});
        Animated.spring(
            this.scrollBot,
            {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }                              
        ).start();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const { params: { movieId } } = this.props.navigation.state;
            this.movieId = movieId;
            this.getData(movieId);
        })
    }

    onContentSizeChange = (contentWidth, contentHeight) => {
        //console.warn(contentHeight)
        if (contentHeight < ($.HEIGHT - $.STATUS_HEIGHT - 48 - 40)) {
            //this.setAlwaysEnabled(true,this.tabIndex);
            //this.setScrollEnabled(true);
        } else {
            //this.setAlwaysEnabled(false,this.tabIndex);
        }
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    scrollEnd = (e) => {
        const y = ($.WIDTH * 9 / 16) * .5
        if (e.nativeEvent.contentOffset.y >= y*.5 && e.nativeEvent.contentOffset.y< y*2-$.STATUS_HEIGHT - 48) {
            this.scrollview.getNode().scrollTo({y:y*2-$.STATUS_HEIGHT - 48});
        } else if(e.nativeEvent.contentOffset.y < y*.5) {
            this.scrollview.getNode().scrollTo({y:0});
        }
    }



    setScrollEnabled = (scrollEnabled) => {
        this.setState({ scrollEnabled });
    }

    setAlwaysEnabled = (bool, i) => {
        let { alwaysEnabled } = this.state;
        //alwaysEnabled[i]=bool;
        //this.setState({ alwaysEnabled });
    }

    scrollInnerEnd = (e) => {
        if (e.nativeEvent.contentOffset.y <= 1) {
            //this.setScrollEnabled(true);
        }
    }

    onPageSelected = (i) => {
        const bool = this.state.alwaysEnabled[i];
        if (!bool) {
            this.scrollview.getNode().scrollToEnd();
        }
        this.setAlwaysEnabled(bool);
        this.setScrollEnabled(bool);
        this.tabIndex = i;
    }

    render() {
        const { navigation } = this.props;
        const { moviedata, sources, sourceTypeIndex, isPlay, playUrl } = this.state;
        return (
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[0]}
                scrollEnabled={!isPlay}
                onScrollEndDrag={this.scrollEnd}
                ref={(ref) => this.scrollview = ref}
                scrollEventThrottle={1}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: this.scrollTop } } }],
                    //{ useNativeDriver: true } // <-- 加上这一行
                )}
            >
                <MovieTop scrollTop={this.scrollTop} name={moviedata.name} />
                <ImageBackground
                    resizeMode='cover'
                    blurRadius={5}
                    source={{ uri: moviedata.img || 'http' }}
                    style={[styles.bg_place, { backgroundColor: $.Color }]}>
                    <Animated.View pointerEvents="none" style={[styles.bg_place_img, {
                        backgroundColor: $.Color,
                        opacity: this.scrollTop.interpolate({
                            inputRange: [0, 100, $.WIDTH * 9 / 16 - $.STATUS_HEIGHT - 48],
                            outputRange: [.1, .1, 1]
                        })
                    }]} />
                    {
                        isPlay&&
                        <View style={styles.videoCon}>
                            <Video
                                ref={(ref) => this.video = ref}
                                source={{ uri: playUrl }}
                                style={styles.fullcon}
                                resizeMode="contain"
                                controls={true}
                                repeat={true}
                            />
                        </View>
                    }
                    
                    <Animated.View style={[styles.playbtn,{
                        opacity:this.scrollTop.interpolate({
                            inputRange: [0, 100],
                            outputRange: [1, 0]
                        })
                    }]}>
                        <TouchableOpacity onPress={this.onPlay}><Icon name='play' size={30} color='#fff' /></TouchableOpacity>
                    </Animated.View>
                </ImageBackground>
                <Animated.View style={[isPlay?{height:$.HEIGHT-$.WIDTH * 9 / 16}:{minHeight: $.HEIGHT - $.STATUS_HEIGHT - 48},
                    {transform: [{
                        translateY: !isPlay?this.scrollTop.interpolate({
                            inputRange: [0, $.WIDTH * 9 / 16 - $.STATUS_HEIGHT - 48, $.WIDTH * 9 / 16 - $.STATUS_HEIGHT - 47],
                            outputRange: [-70, 0, 0]
                        }):this.scrollBot
                    }]
                }]}>
                    <ScrollView style={{ flex: 1 }}>
                        <MovieInfo moviedata={moviedata} sourceTypeIndex={sourceTypeIndex} getSource={this.getSource}/>
                        <MovieSource sources={sources} />
                        <MovieSummary moviedata={moviedata} />
                    </ScrollView>
                </Animated.View>
            </Animated.ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    bg_place: {
        marginTop: -($.STATUS_HEIGHT + 48),
        height: $.WIDTH * 9 / 16,
        alignItems:'center',
        justifyContent: 'center'
    },
    toptitle: {
        position: 'absolute',
        right: 0,
        left: 0,
        fontSize: 30,
        color: '#fff',
        bottom: 10,
        paddingLeft: 20,
        justifyContent: 'center'
    },
    video_place: {
        height: $.WIDTH * 9 / 16,
        backgroundColor: '#000',
    },
    bg_place_img: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        opacity: .1,
    },
    viewcon: {
        margin: 10,
        marginTop: 0,
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 3,
        //elevation:3
    },
    movieinfo: {
        marginTop: 10,
        padding: 10,
        flexDirection: 'row'
    },
    con: {
        paddingHorizontal: 10,
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    text: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
        lineHeight: 20
    },
    appbar: {
        paddingTop: $.STATUS_HEIGHT,
        flexDirection: 'row',
        alignItems: 'flex-start',
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
        height: 48,
        zIndex: 1
    },
    apptitletext: {
        position: 'absolute',
        fontSize: 16,
        color: '#fff',
    },
    poster: {
        borderRadius: 3,
        backgroundColor: '#f1f1f1',
        width: 100,
        height: 150,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    postertext: {
        flex: 1,
        marginHorizontal: 10
    },
    title:{
        fontSize: 16,
        paddingBottom:5
    },
    subtitle: {
        fontSize: 13,
        color: '#888',
        paddingVertical: 4
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
        fontSize: 13,
        minWidth: 20,
        color: '#777'
    },
    star: {
        marginVertical: 5
    },
    status: {
        fontSize: 10,
        height:14,
        paddingHorizontal: 5,
        marginVertical: 5,
        paddingVertical: 1,
        borderRadius: 2,
        alignSelf: 'flex-start',
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,.4)'
    },
    sourcelist: {
        paddingLeft: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    sourceitem: {
        backgroundColor: '#f1f1f1',
        minWidth: ($.WIDTH - 60) / 5,
        maxWidth: ($.WIDTH - 40) / 3,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        justifyContent: 'center',
        marginTop: 5,
        marginRight: 10,
        padding: 10,
        overflow: 'hidden',
        alignItems: 'center',
    },
    sourceType: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center'
    },
    picker: {
        width: 120,
        height: 30,
        left: 30,
        padding: 0,
        backgroundColor: '#fff',
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
    closebtn: {
        position: 'absolute',
        right: 0,
        top: 0,
        padding: 10
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
    view_hd: {
        height: 15,
        borderLeftWidth: 3,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    view_title: {
        fontSize: 15,
        color: '#333',
        flex: 1
    },
    playbtn:{
        position:'absolute',
        width:50,
        height:50,
        justifyContent:'center',
        alignItems: 'center',
    },
    videoCon: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
    },
})