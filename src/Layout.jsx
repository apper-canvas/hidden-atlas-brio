import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { navRoutes } from './config/routes';
import ApperIcon from './components/ApperIcon';

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (isHome) {
    return <Outlet />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 bg-surface border-t border-primary/10 px-4 py-2 z-40">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navRoutes.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-secondary/70 hover:text-primary hover:bg-primary/5'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{route.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;