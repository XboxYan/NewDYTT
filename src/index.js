import { Navigation } from 'react-native-navigation';
import './util/global';
import Movie from './pages/Movie';
import MovieDetail from './pages/Movie/MovieDetail';
import Home from './Home';

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('app.Home', () => Home);
  Navigation.registerComponent('app.Movie', () => Movie);
  Navigation.registerComponent('app.MovieDetail', () => MovieDetail);
}