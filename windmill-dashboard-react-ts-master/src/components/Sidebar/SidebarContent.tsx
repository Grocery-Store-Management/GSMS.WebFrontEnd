import React from 'react';
import routes from '../../routes/sidebar';
import { NavLink, Route } from 'react-router-dom';
import * as Icons from '../../icons';
import SidebarSubmenu from './SidebarSubmenu';
import { IIcon } from "../../utils/demo";
import Logo from '../../assets/img/logo.png';
import { ROLE } from '../../Shared/Model';


function Icon({ icon, ...props }: IIcon) {
  // @ts-ignore
  const Icon = Icons[icon];
  return <Icon {...props} />
}

function SidebarContent() {
  return (
    <div className="py-4 text-gray-500 dark:text-gray-400 dark:bg-gray-800 h-full">
      <a className="" href="/app/receipt" >
        <img src={Logo} alt="Logo GS250" width="150vw" style={{ position: "relative", left: "60px" }} />
      </a>
      {localStorage.getItem("role") && JSON.parse(localStorage.getItem("role") as any)?.role === ROLE.admin &&
        <ul className="mt-6">
          {routes.map((route) =>
            route.routes ? (
              <SidebarSubmenu route={route} key={route.name} />
            ) : (
              <li className="relative px-6 py-3" key={route.name}>
                <NavLink
                  exact
                  to={route.path || ""}
                  style={{ textDecoration: "none" }}
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-400"
                  activeClassName="text-gray-800 dark:text-gray-100"
                >
                  <Route path={route.path} exact={route.exact}>
                    <span
                      className="absolute inset-y-0 left-0 w-1 bg-blue-400 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                  </Route>
                  <Icon className="w-5 h-5" aria-hidden="true" icon={route.icon || ""} />
                  <span className="ml-4">{route.name}</span>
                </NavLink>
              </li>
            )
          )}
        </ul>
      }

    </div>
  )
}

export default SidebarContent