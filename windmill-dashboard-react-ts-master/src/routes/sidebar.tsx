/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */

interface IRoute {
  path?: string
  icon?: string
  name: string
  routes?: IRoute[]
  exact?: boolean
};

const routes: IRoute[] = [
  {
    path: '/app/dashboard', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.js
    name: 'Trang chủ', // name that appear in Sidebar
  },
  {
    path: '/app/tables',
    icon: 'TablesIcon',
    name: 'Xuất hóa đơn',
  },
  {
    path: '/app/charts',
    icon: 'ChartsIcon',
    name: 'Báo cáo',
  },
  {
    path: '/app/employee',
    icon: 'ModalsIcon',
    name: 'Nhân viên',
  },
  {
    path: '/app/stock',
    icon: 'FormsIcon',
    name: 'Kho', 
  },
];

export type { IRoute };
export default routes;
