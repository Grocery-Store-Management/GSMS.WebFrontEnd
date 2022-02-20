import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/Typography/SectionTitle';
import { addCategory, deleteCategory, getCategoryList, updateCategory } from "../Services/CategoryService";
import { getProductList, getProductDetaiList, updateProductDetail, updateProduct, deleteProduct } from "../Services/ProductService";
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
} from '@windmill/react-ui';
import { FireIcon, HeartIcon, TrashIcon } from '../icons';
import { showToastError, showToastSuccess } from "../utils/ToasterUtility/ToasterUtility";
import { MODAL_TYPES } from '../Shared/Model';
import { TYPE } from 'react-toastify/dist/utils';
// make a copy of the data, for the second table
const STORE_ID = "36396edc-1534-407f-94e3-8e5d5ddab6af" //TRAN PHONG STORE HA NOI
function Category() {
    /**
     * DISCLAIMER: This code could be badly improved, but for the sake of the example
     * and readability, all the logic for both table are here.
     * You would be better served by dividing each table in its own
     * component, like Table(?) and TableWithActions(?) hiding the
     * presentation details away from the page view.
     */

    // setup pages control for every table
    const [pageTableCategory, setPageTableCategory] = useState(1)
    // setup data for every table
    const [Category, setCategory] = useState<any[]>([])
    const [dataTableCategory, setDataTableCategory] = useState<any[]>([])
    const [productDetails, setProductsDetails] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    // pagination setup
    const resultsPerPage = 5;

    // pagination change control
    function onPageChangeTableCategory(p: number) {
        setPageTableCategory(p)
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

    async function refreshCategoryList() {
        let catList = await getCategoryList();
        setCategory(catList)
        return catList;
    }

    function changeCategoryName(cat: any, name: string) {
        let cats = _.cloneDeep(Category)
        let catIndex = cats.findIndex((catDet: any) => catDet.CategoryId === cat.id);
        if (catIndex !== -1) {
            cats[catIndex].name = name;
            setCategory(cats)
        }
    }

    async function editCategory(cat: any) {
        let cats = _.cloneDeep(Category)
        let catIndex = cats.findIndex((catDet: any) => catDet.CategoryId === cat.id);
        if (catIndex !== -1) {
            await updateCategory(cat);
        } else {
            await addCategory(cat);
        }
        refreshCategoryList();
    }

    async function removeCategory(cat: any) {
        await deleteCategory(cat)
        refreshCategoryList();
    }

    async function addDefaultCategory() {
        let defaultCategory = {
            id: "",
            name: "Loại hàng mặc định",
        }
        Category.push(defaultCategory);
    }

    useEffect(() => {
        refreshProductList();
        refreshProductDetails();
        refreshCategoryList();
    }, [])

    useEffect(() => {
        setDataTableCategory(dataTableCategory.slice((pageTableCategory - 1) * resultsPerPage, pageTableCategory * resultsPerPage))
    }, [pageTableCategory])

    return (
        <div className="col col-md-12">
            <div>
                <SectionTitle className='col col-md-3'>Danh sách loại hàng</SectionTitle>
                <Button className='col col-md-2 mb-3' layout='primary' onClick={addDefaultCategory}>Thêm loại hàng +</Button>
            </div>
            <TableContainer className="mb-8">
                <Table>
                    <TableHeader>
                        <tr>
                            <TableCell>Tên</TableCell>
                            <TableCell>Số lượng hàng hiện có</TableCell>
                            <TableCell>Tương tác</TableCell>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {Category.map((cat, i) => {
                            let totalProductInCategory = 0;
                            products.forEach((prod: any) => {
                                if (prod.CategoryId === cat.id) {
                                    let prodInCat = productDetails.find((det: any) => prod.productId === det.id);
                                    if (prodInCat) totalProductInCategory += prodInCat.quantity
                                }
                            })

                            return <TableRow key={i}>
                                <TableCell>
                                    <div className="flex items-center text-sm">
                                        {/* <Avatar className="hidden mr-3 md:block" src={Category.avatar} alt="Category avatar" /> */}
                                        <div>
                                            <Input className="text-sm" type='text' value={cat.name} css={""}
                                                onChange={(e: any) => {
                                                    e.persist();
                                                    changeCategoryName(cat, e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {totalProductInCategory}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-4">
                                        <Button layout="primary" size="small" aria-label="Edit" onClick={() => editCategory(cat)}>
                                            Lưu
                                        </Button>
                                        <Button style={{ color: 'red' }} layout="link" size="small" aria-label="Delete" onClick={() => removeCategory(cat)}>
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
                        totalResults={Category.length}
                        resultsPerPage={resultsPerPage}
                        onChange={onPageChangeTableCategory}
                        label="Table navigation"
                    />
                </TableFooter>
            </TableContainer>
        </div>
    );
}

export default Category
