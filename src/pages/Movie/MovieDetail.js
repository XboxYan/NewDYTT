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
    ImageBackground,
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
        paddingHorizontal:($.WIDTH-200)*.5
    },
    style: {
        backgroundColor: '#f7f7f7',
    },
    scrollEnabled: true,
    tabStyle: {
        width:100,
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
const MovieTop = ({ goBack,scrollTop, name }) => (
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
        <Animated.View style={[styles.fullcon, { backgroundColor: $.Color }, {
            opacity: scrollTop.interpolate({
                inputRange: [$.WIDTH * 9 / 16 - $.STATUS_HEIGHT - 48.1 , $.WIDTH * 9 / 16 - $.STATUS_HEIGHT - 48],
                outputRange: [0, 1]
            })
        }]} />
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
        const { moviedata: { desc, type, img, status, score, name, area, release, updateDate,actors }, isRender, scrollInnerEnd,onContentSizeChange } = this.props;
        const { isMore } = this.state;
        const types = type && type.split(' ').filter((el) => !!el);
        return (
            <ScrollView onContentSizeChange={onContentSizeChange} onScrollEndDrag={scrollInnerEnd} style={{ flex:1 }}>  
                <View style={[styles.viewcon,styles.movieinfo]}>
                    <View style={styles.poster}>
                        <Image source={{ uri: img }} style={[styles.fullcon, styles.borR]} />
                    </View>
                    <View style={styles.postertext}>
                        <Text style={styles.subtitle}>{release} - {area}</Text>
                        <Star score={score} />
                        {
                            status&&<Text style={styles.subtitle}>状态 / {status}</Text>
                        }
                        <Text style={styles.subtitle}>更新 / {updateDate}</Text>
                        <Text style={styles.subtitle} numberOfLines={2}>人物 / {actors}</Text>
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
                            <Text numberOfLines={isMore ? 0 : 5} style={styles.text}>{desc+desc+desc}</Text>
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
    state = {
        isRender:false
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            setTimeout(()=>{
                this.setState({isRender:true})
            },300)
            
        })
    }
    render() {
        const {isRender} = this.state;
        if(!isRender){
            return <View style={{height:$.HEIGHT-$.WIDTH * 9 / 16-40}}><Loading size={'small'} text='' /></View>
        }
        const { moviedata:{sources=[]},scrollInnerEnd,onContentSizeChange } = this.props;
        return (
            <ScrollView onContentSizeChange={onContentSizeChange} onScrollEndDrag={scrollInnerEnd} style={{ flex: 1 }}>
                <View style={styles.sourcelist}>
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
        alwaysEnabled: [true,true],
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

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const { params: { movieId } } = this.props.navigation.state;
            this.movieId = movieId;
            this.getData(movieId);
        })
    }

    onContentSizeChange = (contentWidth, contentHeight) => {
        //console.warn(contentHeight)
        if(contentHeight<($.HEIGHT - $.STATUS_HEIGHT - 48 - 40)){
            //this.setAlwaysEnabled(true,this.tabIndex);
            //this.setScrollEnabled(true);
        }else{
            //this.setAlwaysEnabled(false,this.tabIndex);
        }
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    scrollEnd = (e) => {
        if(e.nativeEvent.contentOffset.y >=($.WIDTH * 9 / 16 - $.STATUS_HEIGHT - 48)*.5){
            //this.scrollview.getNode().scrollToEnd();
            if(!this.state.alwaysEnabled[this.tabIndex]){
                //this.setScrollEnabled(false);
            }
        }else{
            //this.scrollview.getNode().scrollTo({y:0});
        }
    }

    setScrollEnabled = (scrollEnabled) => {
        this.setState({ scrollEnabled });
    }

    setAlwaysEnabled = (bool,i) => {
        let {alwaysEnabled} = this.state;
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
        if(!bool){
            this.scrollview.getNode().scrollToEnd();
        }
        this.setAlwaysEnabled(bool);
        this.setScrollEnabled(bool);
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
                ref={(ref)=>this.scrollview=ref}
                scrollEventThrottle={1}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: this.scrollTop } } }],
                    { useNativeDriver: true } // <-- 加上这一行
                )}
            >
                <MovieTop scrollTop={this.scrollTop} name={moviedata.name} />
                <ImageBackground
                    resizeMode='cover'
                    blurRadius={3.5}
                    source={{ uri: moviedata.img || 'http' }}
                    style={[styles.bg_place,{backgroundColor: $.Color}]}>
                    <Animated.View pointerEvents="none" style={[styles.bg_place_img, { backgroundColor: $.Color,
                        opacity: this.scrollTop.interpolate({
                            inputRange: [0,$.STATUS_HEIGHT, $.WIDTH * 9 / 16 - $.STATUS_HEIGHT - 48],
                            outputRange: [.1,.1, 1]
                        }) 
                    }]}/>
                </ImageBackground>
                <Animated.View style={{ minHeight:$.HEIGHT - $.STATUS_HEIGHT - 48,transform:[{
                    translateY:this.scrollTop.interpolate({
                        inputRange: [0,$.WIDTH * 9 / 16 - $.STATUS_HEIGHT - 48,$.WIDTH * 9 / 16 - $.STATUS_HEIGHT - 47],
                        outputRange: [-50,0,0]
                    })
                }]}}>
                    <MovieSummary tablabel='剧情介绍' scrollInnerEnd={this.scrollInnerEnd} onContentSizeChange={this.onContentSizeChange} moviedata={moviedata} isRender={isRender} />
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
    },
    toptitle: {
        position:'absolute',
        right:0,
        left:0,
        fontSize:30,
        color:'#fff',
        bottom:10,
        paddingLeft:20,
        justifyContent:'center'
    },
    video_place: {
        height: $.WIDTH * 9 / 16,
        backgroundColor: '#000',
    },
    bg_place_img: {
        position:'absolute',
        left:0,
        top:0,
        right:0,
        bottom:0,
        opacity:.1,
    },
    viewcon: {
        margin: 10,
        marginTop:0,
        backgroundColor: '#fff',
        paddingVertical:10,
        borderRadius: 3,
        //elevation:3
    },
    movieinfo:{
        marginTop:10,
        padding:10,
        flexDirection: 'row'
    },
    con: {
        paddingHorizontal:10,
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    text: {
        fontSize: 14,
        color: '#666',
        marginTop:5,
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
        marginHorizontal:10
    },
    subtitle: {
        fontSize: 13,
        color: '#888',
        paddingVertical:2
    },
    sptext: {
        fontStyle: 'italic',
        color: '#777'
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
        paddingHorizontal: 5,
        marginVertical: 5,
        paddingVertical: 1,
        borderRadius: 1,
        alignSelf: 'flex-start',
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,.4)'
    },
    sourcelist: {
        paddingLeft: 10,
        paddingVertical:5,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    sourceitem: {
        backgroundColor: '#f1f1f1',
        minWidth:($.WIDTH-60)/5,
        maxWidth: ($.WIDTH-40)/3,
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
})