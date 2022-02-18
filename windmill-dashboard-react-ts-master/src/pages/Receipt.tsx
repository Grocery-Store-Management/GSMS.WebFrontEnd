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
import { IReceipt, Receipt as ReceiptModel } from "../models/Receipt";
import { IReceiptDetail, ReceiptDetail } from "../models/ReceiptDetail";
import { createNewReceipt } from '../Services/ReceiptService';
import { showToastError, showToastSuccess } from "../utils/ToasterUtility/ToasterUtility";
// make a copy of the data, for the second table
const STORE_ID = "36396edc-1534-407f-94e3-8e5d5ddab6af" //TRAN PHONG STORE HA NOI
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
  const [products, setProducts] = useState<any[]>([])
  const [productsInCart, setProductsInCart] = useState<any[]>([])
  const [dataTableProducts, setDataTableProducts] = useState<any[]>([])
  const [productDetails, setProductsDetails] = useState<any[]>([])
  const [dataTableProductsInCart, setDataTableProductsInCart] = useState<any[]>([])
  const [category, setCategories] = useState<any>([])
  const [total, setTotal] = useState<number>()
  // pagination setup
  const resultsPerPage = 5;

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
    setProducts(prodList)
  }

  async function refreshProductDetails() {
    let prodDetList = await getProductDetaiList();
    setProductsDetails(prodDetList)
  }

  async function refresgCategoryList() {
    let catList = await getCategoryList();
    setCategories(catList);
  }

  function addToCart(product: any, productDetail: any) {
    let prodsInCart = _.cloneDeep(productsInCart);
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
    setProductsInCart(prodsInCart)
  }

  function removeFromCart(product: any) {
    let prodsInCart = _.cloneDeep(productsInCart)
    let rmvProdIndex = prodsInCart.findIndex((prod: any) => prod.id === product.id);
    if (rmvProdIndex !== -1) {
      prodsInCart.splice(rmvProdIndex, 1)
      setDataTableProductsInCart(prodsInCart)
      setProductsInCart(prodsInCart)
    }
  }

  function changeProductQuantity(product: any, quantity: number) {
    let prodsInCart = _.cloneDeep(productsInCart)
    let prodInCartIndex = prodsInCart.findIndex((prod: any) => prod.id === product.id);
    if (prodInCartIndex !== -1) {
      prodsInCart[prodInCartIndex].quantity = quantity;
      setDataTableProductsInCart(prodsInCart)
      setProductsInCart(prodsInCart)
    }
  }

  useEffect(() => {
    refreshProductList();
    refreshProductDetails();
    refresgCategoryList();
  }, [])

  useEffect(() => {
    setDataTableProducts(dataTableProducts.slice((pageTableProducts - 1) * resultsPerPage, pageTableProducts * resultsPerPage))
  }, [pageTableProducts])

  useEffect(() => {
    setDataTableProductsInCart(dataTableProductsInCart.slice((pageTablePorductsInCart - 1) * resultsPerPage, pageTablePorductsInCart * resultsPerPage))
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
  }, [dataTableProductsInCart])

  async function createReceipt() {
    var newReceipt: IReceipt = new ReceiptModel();
    newReceipt.storeId = STORE_ID;
    productsInCart.forEach((product: any) => {
      var newReceiptDetail: IReceiptDetail = new ReceiptDetail();
      newReceiptDetail.productId = product.id;
      newReceiptDetail.quantity = product.quantity;
      newReceipt.receiptDetails.push(newReceiptDetail);
    })
    try {
      let res = await createNewReceipt(newReceipt);
      setProductsInCart([])
      setDataTableProductsInCart([])
      showToastSuccess("Tạo đơn thành công!")
    } catch (ex: any) {
      showToastError("Có lỗi xảy ra! Xin vui lòng thử lại!")
    };
  }

  function searchProduct(searchPrompt: String) {
    let productList = _.cloneDeep(products);
    if (searchPrompt.length === 0) {
      setDataTableProducts(productList);
    } else {
      productList = productList.filter((prod: any) => prod.name.trim().toLowerCase().includes(searchPrompt.trim().toLowerCase()));
      setDataTableProducts(productList);
    }
  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col col-md-7">
          <div className='row'>
            <SectionTitle className="col col-md-5">Danh sách hàng hóa </SectionTitle>
            <Input css={undefined} className="col col-md-6 ms-5 mb-2 text-gray-700" placeholder='Tìm kiếm' onChange={(e: any) => {
              e.persist();
              searchProduct(e.target.value)
            }}
            />
          </div>
          <TableContainer className="mb-8">
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
                {dataTableProducts.map((product: any, i: any) => {
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
              <Button disabled={dataTableProductsInCart.length === 0} style={{ backgroundColor: "green" }} size="regular" aria-label="Remove From Cart" onClick={createReceipt}>
                XUẤT ĐƠN
              </Button>
            </SectionTitle>
            {dataTableProductsInCart?.length > 0 && <SectionTitle className={"col col-5"}> Tổng tiền: {total} </SectionTitle>}
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
                {dataTableProductsInCart.map((product: any, i: any) => {
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
