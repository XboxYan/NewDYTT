import { Navigation } from 'react-native-navigation';

import { registerScreens } from './src';
registerScreens();

Navigation.startSingleScreenApp({
  screen: {
      screen: 'app.Movie', // unique ID registered with Navigation.registerScreen
      title: 'Welcome', // title of the screen as appears in the nav bar (optional)
      navigatorStyle: {
          //statusBarHidden:true,
          statusBarColor:'red',
          statusBarTextColorScheme: 'light',
          topTabsHeight:30,
          navBarHeight: 30,
          navBarNoBorder: true,    
          //navBarBlur: true,
          //tabBarHidden:true,
          //topBarBorderWidth:0,
          //navBarHideOnScroll: true,
          //navBarTranslucent: true,
          navBarHidden:true,
          drawUnderTabBar: true
      }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
      navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
      // topTabs: [
      //   {
      //     screenId: 'app.Movie',
      //     title: '豆瓣榜单',
      //   },
      //   {
      //     screenId: 'app.Movie',
      //     title: '推荐',
      //   },
      //   {
      //     screenId: 'app.Movie',
      //     title: '电影',
      //   },
      //   {
      //     screenId: 'app.Movie',
      //     title: '电视',
      //   },
      //   {
      //     screenId: 'app.Movie',
      //     title: '动漫',
      //   },
      //   {
      //     screenId: 'app.Movie',
      //     title: '综艺',
      //   },
      //   {
      //     screenId: 'app.Movie',
      //     title: '微电影',
      //   },
      //   {
      //     screenId: 'app.Movie',
      //     title: '少儿',
      //   },
      // ]
  },
  animationType:'slide-down'
})