import { lazy } from 'react';

// use lazy for better code splitting, a.k.a. load faster
const Page404 = lazy(() => import('../pages/404'));
const Blank = lazy(() => import('../pages/Blank'));
const Stock = lazy(() => import('../pages/Stock'));
const Employee = lazy(() => import('../pages/Employee'));
const Brand = lazy(() => import('../pages/Brand'));
const Receipt = lazy(() => import('../pages/Receipt'));
const Reports = lazy(() => import('../pages/Reports'));


const routes = [
  {
    path: '/employee', // the url
    component: Employee, // view rendered
  },
  {
    path: '/stock', // the url
    component: Stock, // view rendered
  },
  {
    path: '/receipt',
    component: Receipt,
  },
  {
    path: '/reports',
    component: Reports,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
  {
    path: '/brand',
    component: Brand,
  }
];

export default routes;
