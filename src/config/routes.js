import Home from '../pages/Home';
import Discover from '../pages/Discover';
import MyTrips from '../pages/MyTrips';
import Saved from '../pages/Saved';
import DestinationDetail from '../pages/DestinationDetail';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home,
    showInNav: false
  },
  discover: {
    id: 'discover',
    label: 'Discover',
    path: '/discover',
    icon: 'Compass',
    component: Discover,
    showInNav: true
  },
  myTrips: {
    id: 'myTrips',
    label: 'My Trips',
    path: '/my-trips',  
    icon: 'MapPin',
    component: MyTrips,
    showInNav: true
  },
  saved: {
    id: 'saved',
    label: 'Saved',
    path: '/saved',
    icon: 'Bookmark',
    component: Saved,
    showInNav: true
  },
  destinationDetail: {
    id: 'destinationDetail',
    label: 'Destination',
    path: '/destination/:id',
    icon: 'Map',
    component: DestinationDetail,
    showInNav: false
  }
};

export const routeArray = Object.values(routes);
export const navRoutes = routeArray.filter(route => route.showInNav);