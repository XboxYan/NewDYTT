/*
*
Content
*
*/

import React, { PureComponent } from 'react';
import {
    Text,
    StyleSheet,
    ScrollView,
    SectionList,
    UIManager,
    LayoutAnimation,
    InteractionManager,
    Image,
    TouchableOpacity,
    View,
} from 'react-native';

import Loading from '../../components/Loading';
import Swiper from '../../components/Swiper';
import axios from '../../util/axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MovieTitle = (props) => (
    <View style={styles.view_hd}>
        <View style={[styles.line, { backgroundColor: $.Color }]} />
        <Text style={styles.view_title}>{props.title}</Text>
        <TouchableOpacity
            disabled={!!!props.title}
            activeOpacity={.8}
            onPress={() => props.navigation.navigate('MovieMore', { id: props.id, title: props.title })}
            style={styles.view_more}
        >
            <Icon name='navigate-next' size={20} color={$.Color} />
        </TouchableOpacity>
    </View>
)

const MovieItem = ({navigation,item}) => {
    go = () => {
        navigation.navigate('Movie',{movieId:item.movieId});
    }
    return (
        <TouchableOpacity
            activeOpacity={.8}
            onPress={this.go}
            style={styles.movieitem}>
            <Image
                style={styles.movieimg}
                source={{ uri: item.img || 'http' }}
            />
            <View style={styles.movietext}>
                <Text numberOfLines={1} style={styles.moviename}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    )
}

const MovieList = (props) => (
    <View style={styles.movielist}>
        {
            props.data.map((item, i) => <MovieItem key={item.movieId} item={item} navigation={props.navigation} />)
        }
    </View>
)

const BannerItem = ({data,navigation}) => {
    go = () => {
        navigation.navigate('Movie',{movieId:data.vid})
    }
    return (
        <TouchableOpacity
            activeOpacity={.9}
            onPress={this.go}
            style={styles.banner}>
            <Image style={styles.bannerimg} source={{ uri: data.img }} />
            <Text style={styles.bannertext}>{data.desc || ' '}</Text>
        </TouchableOpacity>
    )
}

export default class extends PureComponent {

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    state = {
        data:{},
        isRender:false,
    }

    sections = (viewItemModels) => (
        viewItemModels.map((el, i) => ({
            data: [el.videos],
            title: el.title,
            key: "section" + i
        }))
    )

    getHot = async () => {
        const data = await axios.get('/hotPlay',{
            params:{
                type:this.props.id
            }
        })

        LayoutAnimation.spring();

        this.setState({
            data:data.data.body,
            isRender:true,
        })

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.getHot();
        })
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    renderHeader = () => {
        const { data:{bannerDatas} } = this.state;
        if(bannerDatas.length===0){
            return null
        }
        return (
            <Swiper dotColor={$.Color} style={styles.bannerWrap}>
                {
                    bannerDatas.map((el, i) => <BannerItem navigation={this.props.navigation} data={el} key={i + el.id} />)
                }
            </Swiper>
        )
    }

    render() {
        const { navigation } = this.props;
        const { isRender,data:{viewItemModels} } = this.state;
        return (
            <View style={styles.content}>
                {
                    isRender ?
                    <SectionList
                        ListHeaderComponent={this.renderHeader}
                        initialNumToRender={1}
                        renderItem={({ item }) => <MovieList data={item} navigation={navigation} />}
                        stickySectionHeadersEnabled={true}
                        renderSectionHeader={({ section }) => section.data[0].length>0?<MovieTitle title={section.title} navigation={navigation} />:null}
                        keyExtractor={(item, index) => "item" + index}
                        //enableVirtualization={true}
                        //removeClippedSubviews={false}
                        sections={this.sections(viewItemModels)}
                    />
                    :
                    <Loading/>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    view_hd: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#fff'
    },
    line: {
        height: 16,
        width: 3,
        borderRadius:2,
        marginRight: 10,
    },
    view_title: {
        fontSize: 16,
        color: '#333',
        flex: 1
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
    bannerWrap: {
        backgroundColor: '#fff',
        height: $.WIDTH / 2,
    },
    banner: {
        margin:10,
        flex: 1,
        borderRadius: 3,
        backgroundColor: '#f1f1f1',
        overflow: 'hidden',
        //elevation :5
    },
    bannerimg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 3
    },
    bannertext: {
        fontSize: 14,
        color: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 7,
        position: 'absolute',
        //backgroundColor:'rgba(0,0,0,.3)',
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 20,
        left: 0,
        right: 0,
        bottom: 0,
        //borderBottomLeftRadius: 3,
        //borderBottomRightRadius: 3,
    },
    movielist: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 5,
        paddingTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        //marginBottom: 10,
    },
    movieitem: {
        width: ($.WIDTH - 40) / 3,
        marginHorizontal: 5,
    },
    movieimg: {
        width: '100%',
        height: ($.WIDTH - 40) / 2,
        flex: 1,
        borderRadius: 3,
        backgroundColor:'#f1f1f1',
        resizeMode: 'cover'
    },
    movietext: {
        alignItems: 'center',
        height: 40,
        flexDirection: 'row'
    },
    moviename: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        flex: 1
    },
})