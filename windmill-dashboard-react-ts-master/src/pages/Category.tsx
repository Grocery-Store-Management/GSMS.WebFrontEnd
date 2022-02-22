import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/Typography/SectionTitle';
import { addCategory, deleteCategory, getCategoryList, updateCategory } from "../Services/CategoryService";
import { getProductList, getProductDetaiList } from "../Services/ProductService";

import _ from "lodash"
import {
    Table,
    TableHeader,
    TableCell,
    TableBody,
    TableRow,
    TableFooter,
    TableContainer,
    Button,
    Pagination,
    Input,
} from '@windmill/react-ui';
import { showToastError, showToastSuccess } from '../utils/ToasterUtility/ToasterUtility';
const STORE_ID = "36396edc-1534-407f-94e3-8e5d5ddab6af" //TRAN PHONG STORE HA NOI
function Category(props: any) {


    const [pageTableCategory, setPageTableCategory] = useState(1)
    const [Category, setCategory] = useState<any[]>([])
    const [originalCategory, setOriginalCategory] = useState<any[]>([])
    const [dataTableCategory, setDataTableCategory] = useState<any[]>([])
    const [productDetails, setProductsDetails] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const resultsPerPage = 5;

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
        setOriginalCategory(catList)
        props?.setPageLoading(false);
        return catList;
    }

    function changeCategoryName(category: any, name: string) {
        let cats = _.cloneDeep(Category)
        let catIndex = cats.findIndex((cat: any) => cat.id === category.id);
        if (catIndex !== -1) {
            cats[catIndex].name = name;
            setCategory(cats)
        }
    }

    async function editCategory(category: any, singleUpdate: boolean = true) {
        let cats = _.cloneDeep(Category)
        let catIndex = cats.findIndex((cat: any) => cat.id === category.id);
        try {
            props?.setPageLoading(true)
            if (catIndex !== -1) {
                await updateCategory(category);
            } else {
                await addCategory(category);
            }
            if (singleUpdate) showToastSuccess("Cập nhật thành công");
        } catch (ex) {
            showToastError("Có lỗi xảy ra! Xin vui lòng thử lại");
        }
        finally {
            props?.setPageLoading(false)
        }
        refreshCategoryList();
    }

    async function removeCategory(cat: any) {
        try {
            props?.pageLoading(true)
            await deleteCategory(cat)
            showToastSuccess("Xóa thành công")
        } catch (ex) {
            showToastError("Có lỗi xảy ra! Xin vui lòng thử lại");
        }
        finally {
            props?.pageLoading(false)

        }
        refreshCategoryList();
    }

    async function addDefaultCategory() {
        let defaultCategory = {
            id: "",
            name: "Loại hàng mặc định",
        }
        Category.push(defaultCategory);
    }

    function editAll() {
        let cats = _.cloneDeep(Category);
        try {
            props?.setPageLoading(true)
            cats.forEach((cat: any) => {
                editCategory(cat, false)
            })
            showToastSuccess("Cập nhật tất cả thành công!");
        }
        catch (ex) {
            showToastError("Có lỗi xảy ra! Xin vui lòng thử lại")
        }
        finally {
            props?.setPageLoading(false)
        }
        refreshCategoryList();
        refreshProductDetails();
        refreshProductList();
    }

    useEffect(() => {
        props?.setPageLoading(true);
        refreshProductList();
        refreshProductDetails();
        refreshCategoryList();
    }, [])

    useEffect(() => {
        setDataTableCategory(Category.slice((pageTableCategory - 1) * resultsPerPage, pageTableCategory * resultsPerPage))
    }, [pageTableCategory, Category])

    return (
        <div className="col col-md-12">
            <div>
                <SectionTitle className='col col-md-3'>Danh sách loại hàng</SectionTitle>
                <Button className='col col-md-2 mb-3' layout='primary' onClick={addDefaultCategory}>Thêm loại hàng +</Button>
                <Button className='col col-md-2 mb-3 float-right' layout='primary' disabled={JSON.stringify(Category) === JSON.stringify(originalCategory)} onClick={editAll}>Lưu tất cả</Button>
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
                        {dataTableCategory.map((cat, i) => {
                            let totalProductInCategory = 0;
                            products.forEach((prod: any) => {
                                if (prod.categoryId === cat.id) {
                                    let prodInCat = productDetails.find((prodDet: any) => prodDet.productId === prod.id);
                                    if (prodInCat) totalProductInCategory += prodInCat.storedQuantity
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
