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
    FlatList,
    Picker,
    LayoutAnimation,
    Text,
    View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ScrollViewPager from 'react-native-scrollviewpager';

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
        //paddingHorizontal:15
    },
    style: {
        backgroundColor: '#fff',
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

//头部
const MovieTop = ({ goBack, name }) => (
    <View style={styles.appbar}>
        <Touchable
            style={styles.btn}
            onPress={goBack}
        >
            <Icon name='keyboard-arrow-left' size={30} color='#fff' />
        </Touchable>
        <View style={styles.apptitle}>
            <Text style={styles.apptitletext} numberOfLines={1}>{name}</Text>
        </View>
        <Touchable
            style={styles.btn}
        >
            <Icon name='favorite-border' size={20} color='#fff' />
        </Touchable>
    </View>
)



//视频
const MovieInfo = ({
        moviedata: { img, status, score, name, area, release, updateDate, sourceTypes = [{}] },
    sourceTypeIndex,
    getSource
    }) => (
        <View style={styles.viewcon}>
            <View style={styles.movieinfo} >
                <View style={styles.poster}>
                    <Image source={{ uri: img }} style={[styles.fullcon, styles.borR]} />
                </View>
                <View style={[styles.postertext, false && { height: ($.WIDTH - 40) * 9 / 16 }]}>
                    <Text style={[styles.title, { color: $.Color }]}>{name}</Text>
                    <Star style={styles.score} score={score} />
                    {
                        status && <Text style={styles.status}>{status}</Text>
                    }
                    <Text style={styles.subtitle}>{area} / {release}</Text>
                    <Text style={styles.subtitle}>{updateDate} 更新</Text>
                </View>
            </View>
        </View>
    )

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

//影片简介
class MovieSummary extends PureComponent {
    state = {
        isMore: false
    }

    expand = () => {
        LayoutAnimation.spring();
        this.setState({ isMore: !this.state.isMore })
    }

    render() {
        const { moviedata: { desc, type, img, status, score, name, area, release, updateDate }, isRender, scrollInnerEnd,onContentSizeChange } = this.props;
        const { isMore } = this.state;
        const types = type && type.split(' ').filter((el) => !!el);
        return (
            <ScrollView onContentSizeChange={onContentSizeChange} onScrollEndDrag={scrollInnerEnd} style={{ flex: 1 }}>
                <View style={[styles.viewcon,styles.movieinfo]}>
                    <View style={styles.poster}>
                        <Image source={{ uri: img }} style={[styles.fullcon, styles.borR]} />
                    </View>
                    <View style={styles.postertext}>
                        <Text style={[styles.title, { color: $.Color }]}>{name}</Text>
                        <Star style={styles.score} score={score} />
                        {
                            status && <Text style={styles.status}>{status}</Text>
                        }
                        <Text style={styles.subtitle}>{area} / {release}</Text>
                        <Text style={styles.subtitle}>{updateDate} 更新</Text>
                    </View>
                </View>
                <View style={styles.viewcon}>
                    <SortTitle title='剧情介绍'>
                        {
                            isRender &&
                            <TouchableOpacity
                                onPress={this.expand}
                                style={styles.view_more}
                            >
                                <Text style={styles.view_moretext}>{isMore ? '收起' : '展开'}</Text>
                                <Icon name={isMore ? 'expand-less' : 'expand-more'} size={20} color={$.Color} />
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
            </ScrollView>
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
    render() {
        const { moviedata:{sources},scrollInnerEnd,onContentSizeChange } = this.props;
        if (sources.length === 0) {
            return <Text style={[styles.sourceitem, { width: 50, marginLeft: 15 }]}>{' '}</Text>
        }
        return (
            <ScrollView onContentSizeChange={onContentSizeChange} onScrollEndDrag={scrollInnerEnd} style={{ flex: 1 }}>
                <View style={styles.viewcon}>
                    {
                        sources.map((el)=><SourceItem key={el.aid} item={el} />)
                    }
                </View>
            </ScrollView>
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
        isRender: false,
        sourceTypeIndex: 0,
        scrollEnabled: true,
        alwaysEnabled: [false,false],
        sources: {}
    }

    scrollTop = new Animated.Value(0);

    getData = async (id) => {

        const data = await axios.get('/video', {
            params: {
                videoId: id,
            }
        })

        LayoutAnimation.spring();

        this.setState({
            moviedata: data.data.body,
            isRender: true,
            sources: data.data.body.sources
        })

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

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const { params: { movieId } } = this.props.navigation.state;
            this.movieId = movieId;
            this.getData(movieId);
        })
    }

    onContentSizeChange = (contentWidth, contentHeight) => {
        console.warn(contentHeight)
        if(contentHeight<($.HEIGHT - $.STATUS_HEIGHT - 48 - 40)){
            this.setAlwaysEnabled(true,this.tabIndex);
        }else{
            this.setAlwaysEnabled(false,this.tabIndex);
        }
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    scrollEnd = (e) => {
        if (e.nativeEvent.contentOffset.y >= ($.WIDTH * 9 / 16 - $.STATUS_HEIGHT - 48)&&!this.state.alwaysEnabled[this.tabIndex]) {
            this.setScrollEnabled(false);
        }
    }

    setScrollEnabled = (scrollEnabled) => {
        this.setState({ scrollEnabled });
    }

    setAlwaysEnabled = (bool,i) => {
        let {alwaysEnabled} = this.state;
        alwaysEnabled[i]=bool;
        this.setState({ alwaysEnabled });
    }

    scrollInnerEnd = (e) => {
        if (e.nativeEvent.contentOffset.y <= 1) {
            this.setScrollEnabled(true);
        }
    }

    onPageSelected = (i) => {
        console.warn(this.state.alwaysEnabled[i])
        this.setAlwaysEnabled(this.state.alwaysEnabled[i]);
        this.tabIndex = i;
    }

    render() {
        const { navigation } = this.props;
        const { moviedata, sourceTypeIndex, isRender, scrollEnabled } = this.state;
        return (
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[0]}
                scrollEnabled={scrollEnabled}
                onScrollEndDrag={this.scrollEnd}
                scrollEventThrottle={1}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: this.scrollTop } } }],
                    { useNativeDriver: true } // <-- 加上这一行
                )}
            >
                <MovieTop scrollTop={this.scrollTop} name={moviedata.name} />
                <View style={[styles.bg_place, { backgroundColor: $.Color }]}>
                    <Animated.Image
                        resizeMode='cover'
                        blurRadius={3.5}
                        source={{ uri: moviedata.img || 'http' }}
                        style={[styles.bg_place_img, {
                            opacity: this.scrollTop.interpolate({
                                inputRange: [$.STATUS_HEIGHT, $.WIDTH * 9 / 16 - $.STATUS_HEIGHT - 48],
                                outputRange: [0.9, 0]
                            })
                        }]} />
                </View>
                <ScrollViewPager onPageSelected={this.onPageSelected} tabBarOptions={tabBarOptions} >
                    <MovieSummary tablabel='剧情介绍' scrollInnerEnd={this.scrollInnerEnd} onContentSizeChange={this.onContentSizeChange} moviedata={moviedata} isRender={isRender} />
                    <MovieSource tablabel='选集' scrollInnerEnd={this.scrollInnerEnd} onContentSizeChange={this.onContentSizeChange} moviedata={moviedata} />
                </ScrollViewPager>

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
        height: $.WIDTH * 9 / 16
    },
    video_place: {
        height: $.WIDTH * 9 / 16,
        backgroundColor: '#000',
    },
    bg_place_img: {
        width: '100%',
        height: '100%',
        opacity: .9
    },
    movieTitle: {
        fontSize: 16,
        color: '#333',
        padding: 15,
        backgroundColor: '#fff'
    },
    viewcon: {
        margin: 10,
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 3,
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
        padding: 10,
        borderRadius: 3,
        backgroundColor: '#f1f1f1',
        width: 80,
        height: 120,
        marginHorizontal: 10,
        justifyContent: 'center',
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
        position: 'absolute',
        zIndex: 10,
        height: 34,
        width: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: .9
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
    videobox: {
        margin: 10,
    },
    movieinfo: {
        flexDirection: 'row',
        marginBottom:0
    }
})