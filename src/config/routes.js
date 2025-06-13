import HomePage from '@/components/pages/HomePage';
import DiscoverPage from '@/components/pages/DiscoverPage';
import MyTripsPage from '@/components/pages/MyTripsPage';
import SavedPage from '@/components/pages/SavedPage';
import DestinationDetailPage from '@/components/pages/DestinationDetailPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
component: HomePage,
    showInNav: false
  },
  discover: {
    id: 'discover',
    label: 'Discover',
    path: '/discover',
    icon: 'Compass',
component: DiscoverPage,
    showInNav: true
  },
  myTrips: {
    id: 'myTrips',
    label: 'My Trips',
    path: '/my-trips',  
    icon: 'MapPin',
component: MyTripsPage,
    showInNav: true
  },
  saved: {
    id: 'saved',
    label: 'Saved',
    path: '/saved',
    icon: 'Bookmark',
component: SavedPage,
    showInNav: true
  },
  destinationDetail: {
    id: 'destinationDetail',
    label: 'Destination',
    path: '/destination/:id',
    icon: 'Map',
component: DestinationDetailPage,
    showInNav: false
  }
};

export const routeArray = Object.values(routes);
export const navRoutes = routeArray.filter(route => route.showInNav);