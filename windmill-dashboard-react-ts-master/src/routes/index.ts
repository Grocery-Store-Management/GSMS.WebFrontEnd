import { lazy } from 'react';

// use lazy for better code splitting, a.k.a. load faster
const Page404 = lazy(() => import('../pages/404'));
const Blank = lazy(() => import('../pages/Blank'));
const Employee = lazy(() => import('../pages/Employee'));
const Brand = lazy(() => import('../pages/Brand'));
const Receipt = lazy(() => import('../pages/Receipt'));
const Reports = lazy(() => import('../pages/Reports'));
const Product = lazy(() => import('../pages/Product'));
const Category = lazy(() => import('../pages/Category'));
const ImportOrder = lazy(() => import('../pages/ImportOrder'));

const routes = [
  {
    path: '/employee', // the url
    component: Employee, // view rendered
  },
  {
    path: '/product', // the url
    component: Product, // view rendered
  },
  {
    path: '/category', // the url
    component: Category, // view rendered
  },
  {
    path: '/importOrder', // the url
    component: ImportOrder, // view rendered
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
