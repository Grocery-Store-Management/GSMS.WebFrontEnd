import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import SectionTitle from '../components/Typography/SectionTitle';
import CTA from '../components/CTA';
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
  Dropdown,
  DropdownItem,
} from '@windmill/react-ui';
import { STOCK_CONTENT } from '../Shared/Model';
import { HeartIcon, TrashIcon, FireIcon, DropdownIcon } from '../icons';
import response, { type, categories } from '../utils/demo/tableData';
// make a copy of the data, for the second table
const response2 = categories;

function Stock() {
  /**
   * DISCLAIMER: This code could be badly improved, but for the sake of the example
   * and readability, all the logic for both table are here.
   * You would be better served by dividing each table in its own
   * component, like Table(?) and TableWithActions(?) hiding the
   * presentation details away from the page view.
   */

  // setup pages control for every table
  const [dropDownOpen, setDropdownOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState<string>(STOCK_CONTENT.PRODUCTS);


  const [pageTableProduct, setPageTableProduct] = useState(1)
  const [pageTableCategory, setPageTableCategory] = useState(1)
  const [pageTableImportOrder, setPageTableImportOrder] = useState(1)
  // setup data for every table
  const [dataProduct, setDataProduct] = useState<any[]>([])
  const [dataCategory, setDataCategory] = useState<any[]>([])
  const [dataImportOrder, setDataImportOrder] = useState<any[]>([])


  // pagination setup
  const resultsPerPage = 10;
  const totalResults = response.length;
  const totalResults2 = response2.length;

  // pagination change control
  function onPageChangeProduct(p: number) {
    setPageTableProduct(p)
  }

  // pagination change control
  function onPageChangeCategory(p: number) {
    setPageTableCategory(p)
  }

  // pagination change control
  function onPageChangeImportOrder(p: number) {
    setPageTableImportOrder(p)
  }

  function toggleNavDropdown() {
    setDropdownOpen(!dropDownOpen);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setDataProduct(response.slice((pageTableProduct - 1) * resultsPerPage, pageTableProduct * resultsPerPage))
  }, [pageTableProduct])

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setDataCategory(response2.slice((pageTableCategory - 1) * resultsPerPage, pageTableCategory * resultsPerPage))
  }, [pageTableCategory])

  return (
    <>
      <div className="container mt-3">
        <div className='relative mb-3'>
          <Button onClick={toggleNavDropdown} aria-label="Notifications" aria-haspopup="true">
            {currentContent}<DropdownIcon className="w-5 h-5" />
          </Button>
          <Dropdown isOpen={dropDownOpen} onClose={() => { }}>
            <DropdownItem onClick={() => { setCurrentContent(STOCK_CONTENT.PRODUCTS); toggleNavDropdown() }}>
              <span>Hàng hóa</span>
            </DropdownItem>
            <DropdownItem onClick={() => { setCurrentContent(STOCK_CONTENT.CATEGORY); toggleNavDropdown() }}>
              <span>Danh mục hàng hóa</span>
            </DropdownItem>
            <DropdownItem onClick={() => { setCurrentContent(STOCK_CONTENT.IMPORT_ORDERS); toggleNavDropdown() }}>
              <span>Đơn nhập hàng</span>
            </DropdownItem>
          </Dropdown>
        </div>
        <div className="row">
          {currentContent === STOCK_CONTENT.PRODUCTS && (
            <div className="col col-md-12">
              <SectionTitle>Danh sách hàng trong kho</SectionTitle>
              <TableContainer className="mb-8">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>Tên hàng</TableCell>
                      <TableCell>Giá</TableCell>
                      <TableCell>Số lượng</TableCell>
                      <TableCell>Tình trạng</TableCell>
                      <TableCell>Tương tác</TableCell>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {dataProduct.map((product, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            {/* <Avatar className="hidden mr-3 md:block" src={product.avatar} alt="product avatar" /> */}
                            <div>
                              <p className="font-semibold">{product.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {product.category}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="text-sm">$ {product.price}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{product.quantity}</span>
                        </TableCell>
                        <TableCell>
                          <Badge type={product.type}> {product.type === type.SUCCESS &&
                            <FireIcon className="w-5 h-5" aria-hidden="true" />
                          }{product.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-4">
                            <Button layout="primary" size="small" aria-label="Edit">
                              Cập nhật
                            </Button>
                            <Button style={{ color: 'red' }} layout="link" size="small" aria-label="Delete">
                              Xóa
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TableFooter>
                  <Pagination
                    totalResults={totalResults}
                    resultsPerPage={resultsPerPage}
                    onChange={onPageChangeProduct}
                    label="Table navigation"
                  />
                </TableFooter>
              </TableContainer>
            </div>
          )}
          {currentContent === STOCK_CONTENT.CATEGORY && (
            <div className="col col-md-12">
              <SectionTitle>Danh mục hàng trong kho</SectionTitle>
              <TableContainer className="mb-8">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>Tên danh mục</TableCell>
                      <TableCell>Tương tác</TableCell>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {dataCategory.map((category, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            {/* <Avatar className="hidden mr-3 md:block" src={product.avatar} alt="product avatar" /> */}
                            <div>
                              <p className="font-semibold">{category.name}</p>

                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-4">
                            <Button layout="primary" size="small" aria-label="Edit">
                              Cập nhật
                            </Button>
                            <Button style={{ color: 'red' }} layout="link" size="small" aria-label="Delete">
                              Xóa
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TableFooter>
                  <Pagination
                    totalResults={totalResults}
                    resultsPerPage={resultsPerPage}
                    onChange={onPageChangeProduct}
                    label="Table navigation"
                  />
                </TableFooter>
              </TableContainer>
            </div>
          )}
          {currentContent === STOCK_CONTENT.IMPORT_ORDERS && (
            <></>
          )}
        </div>
      </div></>
  );
}

export default Stock
