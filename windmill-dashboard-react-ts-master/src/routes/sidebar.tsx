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
    path: '/app/receipt',
    icon: 'TablesIcon',
    name: 'Xuất hóa đơn',
  },
  {
    path: '/app/reports',
    icon: 'ChartsIcon',
    name: 'Báo cáo',
  },
  {
    path: '/app/product',
    icon: 'FormsIcon',
    name: 'Hàng Hóa', 
  },
  {
    path: '/app/category',
    icon: 'ModalsIcon',
    name: 'Danh mục', 
  },
  {
    path: '/app/importOrder',
    icon: 'CardsIcon',
    name: 'Đơn nhập hàng', 
  },
  {
    path: '/app/brand',
    icon: 'PagesIcon',
    name: 'Chuỗi cửa hàng', 
  },
];

export type { IRoute };
export default routes;
