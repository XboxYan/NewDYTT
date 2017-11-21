import { Navigation } from 'react-native-navigation';

import { registerScreens } from './src';
registerScreens();

Navigation.startSingleScreenApp({
  screen: {
      screen: 'app.Movie',
      navigatorStyle: {
        screenBackgroundColor: '#f7f7f7',
        statusBarTextColorScheme:'light',
        navBarHidden:true,
      },
  },
  animationType:'slide-down'
})