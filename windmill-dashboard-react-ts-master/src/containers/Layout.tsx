import React, { useContext, Suspense, useEffect, lazy } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import routes from '../routes';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Main from './Main';
import ThemedSuspense from '../components/ThemedSuspense';
import { SidebarContext } from '../context/SidebarContext';
import { ROLE } from '../Shared/Model';

const Page404 = lazy(() => import('../pages/404'));

function Layout() {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  let location = useLocation();

  useEffect(() => {
    closeSidebar()
  }, [location]);

  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSidebarOpen && 'overflow-hidden'}`}
    >
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />
        <Main>
          <Suspense fallback={<ThemedSuspense />}>
            {localStorage.getItem("role") && JSON.parse(localStorage.getItem("role") as any)?.role === ROLE.staff &&
              <Switch>
                {routes.filter(r => r.path.includes("receipt")).map((route, i) => {
                  return route.component ? (
                    <Route
                      key={i}
                      exact={true}
                      path={`/app${route.path}`}
                      render={(props) => <route.component />}
                    />
                  ) : null
                })}
                <Route component={Page404} />
              </Switch>
            }
            {localStorage.getItem("role") && JSON.parse(localStorage.getItem("role") as any)?.role === ROLE.admin &&
              <Switch>
                {routes.map((route, i) => {
                  return route.component ? (
                    <Route
                      key={i}
                      exact={true}
                      path={`/app${route.path}`}
                      render={(props) => <route.component />}
                    />
                  ) : null
                })}
                <Route component={Page404} />
              </Switch>
            }

          </Suspense>
        </Main>
      </div>
    </div>
  );
};

export default Layout;
