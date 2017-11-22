import { Navigation } from 'react-native-navigation';

import { registerScreens } from './src';
registerScreens();

Navigation.startSingleScreenApp({
  screen: {
      screen: 'app.Movie',
      navigatorStyle: {
        //screenBackgroundColor: 'orangered',
        statusBarTextColorScheme:'light',
        statusBarColor: $.Color,
        navBarHidden:true,
      },
  },
  animationType:'slide-down'
})