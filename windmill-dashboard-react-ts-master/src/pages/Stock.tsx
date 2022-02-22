import React, { useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
} from '@windmill/react-ui';
import { STOCK_CONTENT } from '../Shared/Model';
import { DropdownIcon } from '../icons';
import ImportOrder from "../pages/ImportOrder"
import Product from "../pages/Product"
import Category from './Category';
import { pageLoader } from '../utils/PageLoadingUtility/PageLoader';
// make a copy of the data, for the second table

function Stock() {


  const [dropDownOpen, setDropdownOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState<string>(STOCK_CONTENT.PRODUCTS);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  function toggleNavDropdown() {
    setDropdownOpen(!dropDownOpen);
  }

  return (
    <>
      {pageLoading && pageLoader()}
      <div className="container mt-3">
        <div className='relative mb-3'>
          <Button onClick={toggleNavDropdown} aria-label="Notifications" aria-haspopup="true">
            {currentContent}<DropdownIcon className="w-5 h-5" />
          </Button>
          <Dropdown style={{ position: "absolute" }} isOpen={dropDownOpen} onClose={() => { }}>
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
            <Product setPageLoading={setPageLoading} />
          )}
          {currentContent === STOCK_CONTENT.CATEGORY && (
            <>
              <Category setPageLoading={setPageLoading} />
            </>
          )}
          {currentContent === STOCK_CONTENT.IMPORT_ORDERS && (
            <>
              <ImportOrder setPageLoading={setPageLoading} />
            </>
          )}
        </div>
      </div></>
  );
}

export default Stock
