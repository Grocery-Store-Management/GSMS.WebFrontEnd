export const status = {
  AVAILABLE: "Còn hàng",
  OUT_OF_STOCK: "Hết hàng",
  ALMOST_OUT_OF_STOCK: "Sắp hết hàng",
  BEST_SELLER: "Bán chạy",
  WORKING: "Đang làm việc",
  PTO: "Nghỉ phép",
  DECOMMISSIONED: "Đã nghỉ việc"
}
export const type = {
  SUCCESS: "success",
  PRIMARY: "primary",
  NEUTRAL:"neutral",
  DANGER: "danger",
  WARNING: "warning"
}

export const emp = [
  {
    name: 'Nguyễn Văn A',
    password: 'Bơ sữa',
    status: status.WORKING,
    type: type.SUCCESS,
    date: 'Mon Feb 03 2020 04:13:15 GMT-0300 (Brasilia Standard Time)',
  },
  {
    name: 'Nguyễn Văn B',
    password: 'Bơ sữa',
    status: status.WORKING,
    type: type.SUCCESS,
    date: 'Mon Feb 03 2020 04:13:15 GMT-0300 (Brasilia Standard Time)',
  },
  {
    name: 'Nguyễn Văn C',
    password: 'Bơ sữa',
    status: status.DECOMMISSIONED,
    type: type.NEUTRAL,
    date: 'Mon Feb 03 2020 04:13:15 GMT-0300 (Brasilia Standard Time)',
  },
  {
    name: 'Nguyễn Văn D',
    password: 'Bơ sữa',
    type: type.WARNING,
    status: status.PTO,
    date: 'Mon Feb 03 2020 04:13:15 GMT-0300 (Brasilia Standard Time)',
  }
]


export default [
  {
    name: 'Sữa Vinamilk',
    category: 'Bơ sữa',
    amount: 100, price: 989.4,
    status: status.AVAILABLE, type: type.PRIMARY,
    date: 'Mon Feb 03 2020 04:13:15 GMT-0300 (Brasilia Standard Time)',
  },
  {
    name: 'Thùng Sữa Vinamilk',
    category: 'Bơ sữa',
    amount: 100, price: 471.44,
    status: status.BEST_SELLER, type: type.SUCCESS,
    date: 'Fri Nov 29 2019 10:43:17 GMT-0300 (Brasilia Standard Time)',
  },
  {
    name: 'Bánh mì cô gái Hà Lan',
    category: 'Thực phẩm không thiết yếu',
    amount: 100, price: 934.24,
    status: status.OUT_OF_STOCK, type: type.DANGER,
    date: 'Fri Apr 03 2020 03:07:53 GMT-0300 (Brasilia Standard Time)',
  },
  {
    name: 'Keo dán sắt ông Thọ',
    category: 'Gia dụng',
    amount: 100, price: 351.28,
    status: status.ALMOST_OUT_OF_STOCK, type: type.WARNING,
    date: 'Fri Jun 21 2019 20:21:55 GMT-0300 (Brasilia Standard Time)',
  },
  {
    name: 'Thịt bò đồng bằng sông Cửu Long',
    category: 'Thực phẩm tươi sống',
    amount: 100, price: 355.3,
    status: status.OUT_OF_STOCK, type: type.DANGER,
    date: 'Wed Aug 28 2019 15:31:43 GMT-0300 (Brasilia Standard Time)',
  },
  {
    name: 'Tương ớt Walls (vị dâu)',
    category: 'Thực phẩm',
    amount: 100, price: 525.42,
    status: status.OUT_OF_STOCK, type: type.DANGER,
    date: 'Thu Jan 16 2020 09:53:33 GMT-0300 (Brasilia Standard Time)',
  },
  {
    name: 'Đậu Hà Lan Campuchia',
    category: 'Thực phẩm đông lạnh',
    amount: 100, price: 414.99,
    status: status.OUT_OF_STOCK, type: type.DANGER,
    date: 'Mon Oct 28 2019 14:44:31 GMT-0300 (Brasilia Standard Time)',
  },
  {
    name: 'Mì gói Hảo Hảo',
    category: 'Thực phẩm',
    amount: 100, price: 488.0,
    status: status.AVAILABLE, type: type.PRIMARY,
    date: 'Tue Jul 23 2019 00:24:44 GMT-0300 (Brasilia Standard Time)',
  },
  {
    name: 'Muối mì gói Hảo Hảo',
    category: 'Thực phẩm',
    amount: 100, price: 502.69,
    status: status.BEST_SELLER, type: type.SUCCESS,
    date: 'Sat Feb 01 2020 12:57:03 GMT-0300 (Brasilia Standard Time)',
  },
  {
    name: 'Nước tăng lực Dr Thanh',
    category: 'Đồ uống',
    amount: 100, price: 911.09,
    status: status.BEST_SELLER, type: type.SUCCESS,
    date: 'Mon Sep 09 2019 12:03:25 GMT-0300 (Brasilia Standard Time)',
  },
  {
    name: 'Tạp hóa Phúc Thịnh',
    category: 'Bất động sản',
    amount: 100, price: 656.94,
    status: status.BEST_SELLER, type: type.SUCCESS,
    date: 'Fri May 22 2020 17:46:12 GMT-0300 (Brasilia Standard Time)',
  },
  {
    name: 'Đất Thủ Thiêm',
    category: 'Bất động sản',
    amount: 100, price: 10000000000000000000,
    status: status.BEST_SELLER, type: type.SUCCESS,
    date: 'Fri May 22 2020 17:46:12 GMT-0300 (Brasilia Standard Time)',
  }
]
