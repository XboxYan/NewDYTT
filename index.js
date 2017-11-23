//非开发环境去掉log
if (!__DEV__) {
    global.console = {
        info: () => { },
        log: () => { },
        warn: () => { },
        error: () => { },
    };
}
import './src/util/global';
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('NewDYTT', () => App);
