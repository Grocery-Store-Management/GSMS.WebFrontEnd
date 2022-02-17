import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/Typography/SectionTitle';
import { getProductList, getProductDetaiList } from "../Services/ProductService";
import { getCategoryList } from "../Services/CategoryService";
import _ from "lodash"
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Button,
  Pagination,
  Input,
} from '@windmill/react-ui';
import { HeartIcon, TrashIcon, FireIcon } from '../icons';
import { type, status_mapping, status, type_mapping } from '../utils/demo/tableData';
// make a copy of the data, for the second table

function Receipt() {
  /**
   * DISCLAIMER: This code could be badly improved, but for the sake of the example
   * and readability, all the logic for both table are here.
   * You would be better served by dividing each table in its own
   * component, like Table(?) and TableWithActions(?) hiding the
   * presentation details away from the page view.
   */

  // setup pages control for every table
  const [pageTableProducts, setPageTableProducts] = useState(1)
  const [pageTablePorductsInCart, setPageTableProductsInCart] = useState(1)
  // setup data for every table
  const [products, setDataTableProducts] = useState<any[]>([])
  const [productDetails, setProductsDetails] = useState<any[]>([])
  const [productsInCart, setDataTableProductsInCart] = useState<any[]>([])
  const [category, setCategegories] = useState<any>([])
  const [total, setTotal] = useState<number>()
  // pagination setup
  const resultsPerPage = 10;

  // pagination change control
  function onPageChangeTable1(p: number) {
    setPageTableProducts(p)
  }

  // pagination change control
  function onPageChangeTable2(p: number) {
    setPageTableProductsInCart(p)
  }

  async function refreshProductList() {
    let prodList = await getProductList();
    setDataTableProducts(prodList);
  }

  async function refreshProductDetails() {
    let prodDetList = await getProductDetaiList();
    setProductsDetails(prodDetList)
  }

  async function refresgCategoryList() {
    let catList = await getCategoryList();
    setCategegories(catList);
  }

  function addToCart(product: any, productDetail: any) {
    let prodsInCart = _.cloneDeep(productsInCart);
    console.log(prodsInCart)
    let prodInCartIndex = prodsInCart.findIndex((prod: any) => prod.Id === product.Id)
    if (prodInCartIndex !== -1) {
      prodsInCart[prodInCartIndex].quantity++;
    } else {
      product = {
        ...product,
        quantity: 1
      }
      prodsInCart.push(product);
    }
    setDataTableProductsInCart(prodsInCart)
  }

  function removeFromCart(product: any) {
    let prodsInCart = _.cloneDeep(productsInCart)
    let rmvProdIndex = prodsInCart.findIndex((prod: any) => prod.id === product.id);
    if (rmvProdIndex !== -1) {
      prodsInCart.splice(rmvProdIndex, 1)
      setDataTableProductsInCart(prodsInCart)
    }
  }

  function changeProductQuantity(product: any, quantity: number) {
    let prodsInCart = _.cloneDeep(productsInCart)
    let prodInCartIndex = prodsInCart.findIndex((prod: any) => prod.id === product.id);
    if (prodInCartIndex !== -1) {
      prodsInCart[prodInCartIndex].quantity = quantity;
      setDataTableProductsInCart(prodsInCart)
    }
  }

  useEffect(() => {
    refreshProductList();
    refreshProductDetails();
    refresgCategoryList();
  }, [])

  useEffect(() => {
    setDataTableProducts(products.slice((pageTableProducts - 1) * resultsPerPage, pageTableProducts * resultsPerPage))
  }, [pageTableProducts])

  useEffect(() => {
    setDataTableProductsInCart(productsInCart.slice((pageTablePorductsInCart - 1) * resultsPerPage, pageTablePorductsInCart * resultsPerPage))
  }, [pageTablePorductsInCart])

  useEffect(() => {
    let total = 0;
    productsInCart.forEach((product: any) => {
      let curProdDetail = productDetails.find((prodDet: any) => prodDet.productId === product.id);
      if (curProdDetail) {
        total += curProdDetail.price * product.quantity
      }
    })
    setTotal(total)
  }, [productsInCart])

  function createReceipt() {

  }
  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col col-md-7">
          <SectionTitle>Products List</SectionTitle>
          <TableContainer className="mb-8 ">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Tên hàng</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Tình trạng</TableCell>
                  <TableCell>Tương tác</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {products.map((product: any, i: any) => {
                  let curProdDetail = productDetails.find((prodDet: any) => prodDet?.productId === product.id);
                  let prodStatus = status_mapping[curProdDetail?.status];
                  let prodType = type_mapping[curProdDetail?.status];
                  let prodCat = category.find((cat: any) => cat.id === product?.categoryId);
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          {/* <Avatar className="hidden mr-3 md:block" src={product.avatar} alt="product avatar" /> */}
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {prodCat?.name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">$ {curProdDetail?.price ? curProdDetail?.price : 0}</span>
                      </TableCell>
                      <TableCell>
                        <Badge type={prodType}> {prodType === type.SUCCESS &&
                          <FireIcon className="w-5 h-5" aria-hidden="true" />
                        }{prodStatus}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <Button disabled={prodStatus === status.OUT_OF_STOCK || prodStatus === undefined} layout="primary" size="small" aria-label="Edit" onClick={() => addToCart(product, curProdDetail)}>
                            Thêm vào giỏ
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={products.length}
                resultsPerPage={resultsPerPage}
                onChange={onPageChangeTable1}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        </div>

        <div className="col col-md-5">
          <div className='row'>
            <SectionTitle className={"col col-5"}>
              <Button style={{ backgroundColor: "green" }} size="regular" aria-label="Remove From Cart" onClick={createReceipt}>
                XUẤT ĐƠN
              </Button>
            </SectionTitle>
            {productsInCart?.length > 0 && <SectionTitle className={"col col-5"}> Tổng tiền: {total} </SectionTitle>}
          </div>
          <TableContainer className="mb-8 mt-0">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Tên hàng</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Tương tác</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {productsInCart.map((product: any, i: any) => {
                  let curProdDetail = productDetails.find((prodDet: any) => prodDet.productId === product.Id);
                  let prodCat = category.find((cat: any) => cat.Id === product.categoryId);
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          {/* <Avatar className="hidden mr-3 md:block" src={product.avatar} alt="product avatar" /> */}
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {prodCat}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input className="text-sm" type='number' value={product.quantity} css={""}
                          onChange={(e: any) => {
                            e.persist();
                            changeProductQuantity(product, e.target.value);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <Button layout="link" size="small" aria-label="Remove From Cart" onClick={() => removeFromCart(product)}>
                            <TrashIcon className="w-5 h-5" aria-hidden="true" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={productsInCart.length}
                resultsPerPage={resultsPerPage}
                onChange={onPageChangeTable2}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default Receipt
