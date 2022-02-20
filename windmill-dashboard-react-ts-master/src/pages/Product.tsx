import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/Typography/SectionTitle';
import { addProduct, getProductList, getProductDetaiList, updateProductDetail, updateProduct, deleteProduct } from "../Services/ProductService";
import { getCategoryList } from "../Services/CategoryService";
import Modal from "../pages/Modals";

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
    Select,
} from '@windmill/react-ui';
import { FireIcon, HeartIcon, TrashIcon } from '../icons';
import { showToastError, showToastSuccess } from "../utils/ToasterUtility/ToasterUtility";
import { MODAL_TYPES } from '../Shared/Model';
import { TYPE } from 'react-toastify/dist/utils';
import { status_mapping, type, type_mapping } from '../utils/demo/tableData';
// make a copy of the data, for the second table
const STORE_ID = "36396edc-1534-407f-94e3-8e5d5ddab6af" //TRAN PHONG STORE HA NOI
function Product() {
    /**
     * DISCLAIMER: This code could be badly improved, but for the sake of the example
     * and readability, all the logic for both table are here.
     * You would be better served by dividing each table in its own
     * component, like Table(?) and TableWithActions(?) hiding the
     * presentation details away from the page view.
     */



    // setup pages control for every table
    const [pageTableProducts, setPageTableProducts] = useState(1)
    // setup data for every table
    const [originalProducts, setOriginalProducts] = useState<any[]>([])
    const [originalProductDetails, setOriginalProductDetails] = useState<any[]>([])
    const [productDetails, setProductsDetails] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [dataTableProducts, setDataTableProducts] = useState<any[]>([])
    const [category, setCategories] = useState<any>([])

    // pagination setup
    const resultsPerPage = 5;

    // pagination change control
    function onPageChangeTableProducts(p: number) {
        setPageTableProducts(p)
    }

    async function refreshProductList() {
        let prodList = await getProductList();
        setProducts(prodList)
        return prodList;
    }

    async function refreshProductDetails() {
        let prodDetList = await getProductDetaiList();
        setProductsDetails(prodDetList)
        return prodDetList
    }

    async function refresgCategoryList() {
        let catList = await getCategoryList();
        setCategories(catList);
    }

    function changeProductQuantity(product: any, quantity: any) {
        let prodDets = _.cloneDeep(productDetails)
        let prodDetIndex = prodDets.findIndex((prodDet: any) => prodDet.productId === product.id);
        if (prodDetIndex !== -1) {
            if (quantity === "0") {
                prodDets[prodDetIndex].status = 2
            }else{
                prodDets[prodDetIndex].status = 1
            }
            prodDets[prodDetIndex].storedQuantity = quantity;
            setProductsDetails(prodDets)
        }
    }
    function changeProductPrice(product: any, price: number) {
        let prodDets = _.cloneDeep(productDetails)
        let prodDetIndex = prodDets.findIndex((prodDet: any) => prodDet.productId === product.id);
        if (prodDetIndex !== -1) {
            prodDets[prodDetIndex].price = price;
            setProductsDetails(prodDets)
        }
    }
    function changeProductName(product: any, name: string) {
        let prods = _.cloneDeep(products)
        let prodIndex = prods.findIndex((prod: any) => prod.id === product.id);
        if (prodIndex !== -1) {
            prods[prodIndex].name = name;
            setProducts(prods)
        }
    }

    function changeProductCategory(product: any, catId: string) {
        let prods = _.cloneDeep(products)
        let prodIndex = prods.findIndex((prod: any) => prod.id === product.id);
        if (prodIndex !== -1) {
            prods[prodIndex].categoryId = catId;
            setProducts(prods)
        }
    }

    async function editProduct(product: any, productDetail: any) {
        if (productDetail || product.productDetails !== []) {
            try {
                let prods = _.cloneDeep(originalProducts)
                let prodIndex = prods.findIndex((prod: any) => prod.id === product.id);
                let prodDets = _.cloneDeep(originalProductDetails)
                let prodDetIndex = prodDets.findIndex((prodDet: any) => prodDet.productId === product.id);
                if (prodIndex !== -1) {
                    if (JSON.stringify(prods[prodIndex]) !== JSON.stringify(product) || JSON.stringify(prodDets[prodDetIndex]) !== JSON.stringify(productDetail)) {
                        await updateProduct(product);
                        await updateProductDetail(productDetail);
                        showToastSuccess("Cập nhật thành công!")
                    } else {
                        return
                    }
                } else {
                    await addProduct(product);
                }
                refreshProductList();
                refreshProductDetails();
            } catch (ex) {
                showToastError("Có lỗi xảy ra! Xin vui lòng thử lại")
            }
        } else {
            return
        }

    }

    async function removeProduct(product: any) {
        try {
            await deleteProduct(product);
            showToastSuccess("Xóa thành công!")
        } catch (ex) {
            showToastError("Có lỗi xảy ra! Xin vui lòng thử lại")
        }
        refreshProductList();
        refreshProductDetails();
    }

    async function addDefaultProduct() {
        let prods = _.cloneDeep(products)
        let defaultProduct = {
            id: "",
            atomicPrice: 0,
            name: "Sản phẩm mặc định",
            categoryId: category[0].id ? category[0].id : "",
            productDetails: [{
                id: "",
                price: 0,
                status: 1,
                storedQuantity: 100
            }]
        }
        prods.push(defaultProduct);
        setProducts(prods)
    }

    useEffect(() => {
        async function initData() {
            let prodList = await refreshProductList();
            let prodDetList = await refreshProductDetails();
            refresgCategoryList();
            setOriginalProducts(prodList);
            setOriginalProductDetails(prodDetList);
        }
        initData();
    }, [])

    useEffect(() => {
        setDataTableProducts(dataTableProducts.slice((pageTableProducts - 1) * resultsPerPage, pageTableProducts * resultsPerPage))
    }, [pageTableProducts])

    return (
        <div className="col col-md-12">
            <div>
                <SectionTitle className='col col-md-3'>Danh sách hàng trong kho</SectionTitle>
                <Button className='col col-md-2 mb-3' layout='primary' disabled={products === originalProducts && productDetails === originalProductDetails}>Lưu tất cả</Button>
                <Button className='col col-md-2 mb-3' layout='primary' onClick={addDefaultProduct}>Thêm sản phẩm +</Button>
            </div>
            <TableContainer className="mb-8">
                <Table>
                    <TableHeader>
                        <tr>
                            <TableCell>Tên hàng</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Số lượng</TableCell>
                            <TableCell>Tình trạng</TableCell>
                            <TableCell>Danh mục</TableCell>
                            <TableCell>Tương tác</TableCell>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {products.map((product, i) => {
                            let curProdDetail = productDetails.find((prodDet: any) => prodDet?.productId === product.id);
                            let prodStatus = status_mapping[curProdDetail?.status];
                            let prodType = type_mapping[curProdDetail?.status];
                            let prodCat = category.find((cat: any) => cat.id === product?.categoryId);
                            return <TableRow key={i}>
                                <TableCell>
                                    <div className="flex mt-4 items-center text-sm">
                                        {/* <Avatar className="hidden mr-3 md:block" src={product.avatar} alt="product avatar" /> */}
                                        <div>
                                            <Input className="text-sm" type='text' value={product?.name} css={""}
                                                onChange={(e: any) => {
                                                    e.persist();
                                                    changeProductName(product, e.target.value);
                                                }}
                                            />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {prodCat?.name}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Input className="text-sm" type='number' value={curProdDetail?.price ? curProdDetail?.price : 0} css={""}
                                        onChange={(e: any) => {
                                            e.persist();
                                            changeProductPrice(product, e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input className="text-sm" type='number' value={curProdDetail?.storedQuantity ? curProdDetail?.storedQuantity : 0} css={""}
                                        onChange={(e: any) => {
                                            e.persist();
                                            changeProductQuantity(product, e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Badge type={prodType}> {prodType === type.SUCCESS &&
                                        <FireIcon className="w-5 h-5" aria-hidden="true" />
                                    }{prodStatus}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Select css="" className="mt-1" defaultValue={prodCat} onChange={(e: any) => { e.persist(); changeProductCategory(product, e.target.value) }}>
                                        {category.map((cat: any, key: any) => {
                                            return <option key={key} value={cat.id}>{cat.name}</option>
                                        })}
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-4">
                                        <Button disabled={product.categoryId === ""} layout="primary" size="small" aria-label="Edit" onClick={() => editProduct(product, curProdDetail)}>
                                            Lưu
                                        </Button>
                                        <Button style={{ color: 'red' }} layout="link" size="small" aria-label="Delete" onClick={() => removeProduct(product)}>
                                            Xóa
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
                <TableFooter>
                    <Pagination
                        totalResults={products.length}
                        resultsPerPage={resultsPerPage}
                        onChange={onPageChangeTableProducts}
                        label="Table navigation"
                    />
                </TableFooter>
            </TableContainer>
        </div>
    );
}

export default Product
