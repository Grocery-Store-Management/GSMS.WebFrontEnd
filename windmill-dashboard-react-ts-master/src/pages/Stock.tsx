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
import { type } from '../utils/demo/tableData';
import ImportOrder from "../pages/ImportOrder"
import Product from "../pages/Product"
import Category from './Category';
// make a copy of the data, for the second table

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



  // pagination setup
  const resultsPerPage = 10;

  function toggleNavDropdown() {
    setDropdownOpen(!dropDownOpen);
  }

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
            <Product />
          )}
          {currentContent === STOCK_CONTENT.CATEGORY && (
            <>
              <Category />
            </>
          )}
          {currentContent === STOCK_CONTENT.IMPORT_ORDERS && (
            <>
              <ImportOrder />
            </>
          )}
        </div>
      </div></>
  );
}

export default Stock
