/**
 * AppTop
 */
import React, { PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Touchable from './Touchable';
//import Shadow from './Shadow';

export default class AppTop extends PureComponent {

	componentDidMount(){
		setTimeout(()=>{
			//_.SetTheme('#6b52ae')
		},2000)
	}

	goSearch = () => {
		//this.props.navigation.navigate('Search');
	}

	render() {
		const { title } = this.props;
		return (
			<View style={[styles.apptop,{backgroundColor:$.Color}]}>
				<Text style={styles.title}>{title}</Text>
				<Touchable style={styles.ico}>
					<Icon name='clock' size={18} color='#fff' />
				</Touchable>
				<Touchable onPress={this.goSearch} style={styles.ico}>
					<Icon name='search' size={20} color='#fff' />
				</Touchable>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	apptop: {
		paddingTop: $.STATUS_HEIGHT,
		alignItems: 'center',
		flexDirection: 'row',
	},
	title: {
		flex: 1,
		fontSize:16,
		color:'#fff',
		marginLeft:20
	},
	ico: {
		width: 48,
		height: 48,
		backgroundColor:'rgba(0,0,0,0)',
		justifyContent: 'center',
		alignItems: 'center',
	},

});
