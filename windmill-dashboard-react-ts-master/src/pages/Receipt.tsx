import React, { useState, useEffect } from "react";
import SectionTitle from "../components/Typography/SectionTitle";
import {
  getProductList,
  getProductDetaiList,
} from "../Services/ProductService";
import { getCategoryList } from "../Services/CategoryService";
import _, { findIndex } from "lodash";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Pagination,
  Input,
  Button,
} from "@windmill/react-ui";
import { TrashIcon, FireIcon } from "../icons";
import {
  type,
  status_mapping,
  status,
  type_mapping,
} from "../utils/demo/tableData";
import { IReceipt, Receipt as ReceiptModel } from "../models/Receipt";
import { IReceiptDetail, ReceiptDetail } from "../models/ReceiptDetail";
import { createNewReceipt } from "../Services/ReceiptService";
import {
  showToastError,
  showToastSuccess,
} from "../utils/ToasterUtility/ToasterUtility";
import { pageLoader } from "../utils/PageLoadingUtility/PageLoader";
import "../styles/General.css";
import "../styles/Receipt.css";

const STORE_ID = "36396edc-1534-407f-94e3-8e5d5ddab6af"; //TRAN PHONG STORE HA NOI
function Receipt() {
  const [pageTableProducts, setPageTableProducts] = useState(1);
  const [pageTablePorductsInCart, setPageTableProductsInCart] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [productsInCart, setProductsInCart] = useState<any[]>([]);
  const [dataTableProducts, setDataTableProducts] = useState<any[]>([]);
  const [productDetails, setProductsDetails] = useState<any[]>([]);
  const [dataTableProductsInCart, setDataTableProductsInCart] = useState<any[]>(
    []
  );
  const [category, setCategories] = useState<any>([]);
  const [total, setTotal] = useState<number>();
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const resultsPerPage = 5;

  // pagination change control
  function onPageChangeTable1(p: number) {
    setPageTableProducts(p);
  }

  // pagination change control
  function onPageChangeTable2(p: number) {
    setPageTableProductsInCart(p);
  }

  async function refreshData() {
    try {
      setPageLoading(true);
      let prodList = await getProductList();
      setDataTableProducts(prodList);
      setProducts(prodList);
      let prodDetList = await getProductDetaiList();
      setProductsDetails(prodDetList);
      let catList = await getCategoryList();
      setCategories(catList);
    } finally {
      setPageLoading(false);
    }
  }

  function addToCart(product: any, productDetail: any) {
    let prodsInCart = _.cloneDeep(productsInCart);
    let prodInCartIndex = prodsInCart.findIndex(
      (prod: any) => prod.id === product.id
    );
    if (prodInCartIndex !== -1) {
      prodsInCart[prodInCartIndex].quantity++;
    } else {
      product = {
        ...product,
        quantity: 1,
      };
      prodsInCart.push(product);
    }
    setDataTableProductsInCart(prodsInCart);
    setProductsInCart(prodsInCart);
  }

  function removeFromCart(product: any) {
    let prodsInCart = _.cloneDeep(productsInCart);
    let rmvProdIndex = prodsInCart.findIndex(
      (prod: any) => prod.id === product.id
    );
    if (rmvProdIndex !== -1) {
      prodsInCart.splice(rmvProdIndex, 1);
      setDataTableProductsInCart(prodsInCart);
      setProductsInCart(prodsInCart);
    }
  }

  function changeProductQuantity(product: any, quantity: number) {
    let prodsInCart = _.cloneDeep(productsInCart);
    let prodInCartIndex = prodsInCart.findIndex(
      (prod: any) => prod.id === product.id
    );
    if (prodInCartIndex !== -1) {
      prodsInCart[prodInCartIndex].quantity = quantity;
      setDataTableProductsInCart(prodsInCart);
      setProductsInCart(prodsInCart);
    }
  }

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    setDataTableProducts(
      products.slice(
        (pageTableProducts - 1) * resultsPerPage,
        pageTableProducts * resultsPerPage
      )
    );
  }, [pageTableProducts, products]);

  useEffect(() => {
    setDataTableProductsInCart(
      productsInCart.slice(
        (pageTablePorductsInCart - 1) * resultsPerPage,
        pageTablePorductsInCart * resultsPerPage
      )
    );
  }, [pageTablePorductsInCart]);

  useEffect(() => {
    let total = 0;
    productsInCart.forEach((product: any) => {
      let curProdDetail = productDetails.find(
        (prodDet: any) => prodDet.productId === product.id
      );
      if (curProdDetail) {
        total += curProdDetail.price * product.quantity;
      }
    });
    setTotal(total);
  }, [dataTableProductsInCart]);

  async function createReceipt() {
    var newReceipt: IReceipt = new ReceiptModel();
    newReceipt.storeId = STORE_ID;
    productsInCart.forEach((product: any) => {
      var newReceiptDetail: IReceiptDetail = new ReceiptDetail();
      newReceiptDetail.productId = product.id;
      newReceiptDetail.quantity = product.quantity;
      newReceipt.receiptDetails.push(newReceiptDetail);
    });
    setPageLoading(true);
    try {
      await createNewReceipt(newReceipt);
      setProductsInCart([]);
      setDataTableProductsInCart([]);
      showToastSuccess("Tạo đơn thành công!");
    } catch (ex: any) {
      showToastError("Có lỗi xảy ra! Xin vui lòng thử lại!");
    } finally {
      setPageLoading(false);
    }
  }

  function searchProduct(searchPrompt: String) {
    let productList = _.cloneDeep(products);
    if (searchPrompt.length === 0) {
      setDataTableProducts(productList);
    } else {
      productList = productList.filter((prod: any) =>
        prod.name
          .trim()
          .toLowerCase()
          .includes(searchPrompt.trim().toLowerCase())
      );
      setDataTableProducts(productList);
    }
  }

  return (
    <div className="container mt-3">
      {pageLoading && pageLoader()}
      <div className="row">
        <div className="col col-md-7">
          <SectionTitle className="col col-md-6">
            Danh sách hàng hóa{" "}
          </SectionTitle>
          <div className="row">
            <Input
              css={undefined}
              className="col col-md-6 mb-2 ml-3"
              placeholder="Tìm kiếm sản phẩm"
              onChange={(e: any) => {
                e.persist();
                searchProduct(e.target.value);
              }}
            />
            <div className="col col-md-3 mb-2">
              <Button style={{ backgroundColor: "#73C4FF" }} size="regular">
                Tìm kiếm
              </Button>
            </div>
          </div>

          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Tên hàng</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Tình trạng</TableCell>
                  <TableCell>Tương tác</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataTableProducts.map((product: any, i: any) => {
                  let curProdDetail = productDetails.find(
                    (prodDet: any) => prodDet?.productId === product.id
                  );
                  let prodStatus = status_mapping[curProdDetail?.status];
                  let prodType = type_mapping[curProdDetail?.status];
                  let prodCat = category.find(
                    (cat: any) => cat.id === product?.categoryId
                  );
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
                        <span className="text-sm">
                          $ {curProdDetail?.price ? curProdDetail?.price : 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge type={prodType}>
                          {" "}
                          {prodType === type.SUCCESS && (
                            <FireIcon className="w-5 h-5" aria-hidden="true" />
                          )}
                          {prodStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <Button
                            style={{ backgroundColor: "#73C4FF" }}
                            disabled={
                              prodStatus === status.OUT_OF_STOCK ||
                              prodStatus === undefined
                            }
                            layout="primary"
                            size="small"
                            aria-label="Edit"
                            onClick={() => addToCart(product, curProdDetail)}
                          >
                            Thêm vào giỏ
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
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
          <div className="row">
            <SectionTitle className="col col-md-7">Chi tiết đơn </SectionTitle>
          </div>
          <div className="col col-md-5 mb-2">
            <Button
              disabled={dataTableProductsInCart.length === 0}
              style={{ backgroundColor: "#73C4FF" }}
              size="regular"
              aria-label="Remove From Cart"
              onClick={createReceipt}
            >
              XUẤT ĐƠN
            </Button>
          </div>

          {dataTableProductsInCart?.length > 0 && (
            <SectionTitle className={"col col-5 mb-2"}>
              {" "}
              Tổng tiền: {total}{" "}
            </SectionTitle>
          )}
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Tên hàng</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Tương tác</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataTableProductsInCart.map((product: any, i: any) => {
                  let prodCat = category.find(
                    (cat: any) => cat.Id === product.categoryId
                  );
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
                        <Input
                          className="text-sm"
                          type="number"
                          min={0}
                          value={product.quantity}
                          css={""}
                          onChange={(e: any) => {
                            e.persist();
                            changeProductQuantity(product, e.target.value);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <Button
                            layout="link"
                            size="small"
                            aria-label="Remove From Cart"
                            onClick={() => removeFromCart(product)}
                          >
                            <TrashIcon className="w-5 h-5" aria-hidden="true" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
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

export default Receipt;
