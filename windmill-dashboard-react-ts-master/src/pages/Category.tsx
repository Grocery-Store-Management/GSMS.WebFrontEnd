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
import { pageLoader } from '../utils/PageLoadingUtility/PageLoader';
import '../styles/General.css';
import ConfirmModal from './ConfirmModal';
import { toast } from 'react-toastify';

const STORE_ID = "36396edc-1534-407f-94e3-8e5d5ddab6af" //TRAN PHONG STORE HA NOI
function Category(props: any) {

    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deletedItem, setDeletedItem] = useState<any>(null);
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
        let cats = [
            ...catList.filter((p: any) => p.name.includes("Loại hàng mặc định")),
            ...catList.filter((p: any) => !p.name.includes("Loại hàng mặc định"))
        ]
        setCategory(cats)
        setOriginalCategory(cats)
        setPageLoading(false);
        return cats;
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
            setPageLoading(true)
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
            setPageLoading(false)
        }
        refreshCategoryList();
    }

    async function removeCategory(cat: any) {
        try {
            setPageLoading(true)
            await deleteCategory(cat)
            showToastSuccess("Xóa thành công")
        } catch (ex) {
            showToastError("Có lỗi xảy ra! Xin vui lòng thử lại");
        }
        finally {
            setPageLoading(false)
        }
        refreshCategoryList();
    }

    async function addDefaultCategory() {
        let defaultCategory = {
            id: "",
            name: "Loại hàng mặc định",
        }
        setPageLoading(true);
        await addCategory(defaultCategory);
        showToastSuccess("Loại hàng mặc định tạo thành công!");
        await refreshCategoryList();
    }

    function editAll() {
        let cats = _.cloneDeep(Category);
        try {
            setPageLoading(true)
            cats.forEach((cat: any) => {
                editCategory(cat, false)
            })
            showToastSuccess("Cập nhật tất cả thành công!");
        }
        catch (ex) {
            showToastError("Có lỗi xảy ra! Xin vui lòng thử lại")
        }
        refreshCategoryList();
        refreshProductDetails();
        refreshProductList();
    }

    useEffect(() => {
        setPageLoading(true);
        refreshProductList();
        refreshProductDetails();
        refreshCategoryList();
    }, [])

    useEffect(() => {
        setDataTableCategory(Category.slice((pageTableCategory - 1) * resultsPerPage, pageTableCategory * resultsPerPage))
    }, [pageTableCategory, Category])

    function handleRemoveCategory(cat: any, index?: any) {
        let catList = _.cloneDeep(Category);
        if (cat.id === "") {
            catList.splice(index, 1);
            setCategory(catList)
        } else {
            setShowDeleteModal(true);
            setDeletedItem(cat);
        }
    }

    return (
        <div className="col col-md-12">
            {pageLoading && pageLoader()}
            <ConfirmModal modalOpen={showDeleteModal}
                callback={() => {
                    removeCategory(deletedItem)
                    setShowDeleteModal(false)
                }}
                onClose={() => setShowDeleteModal(false)}
                header={`Xóa hạng mục`}
                body={`Bạn có chắc là xóa hạng mục này?`}
                accept={`Có`}
                cancel={`Không`}
            />

            <div>
                <SectionTitle className='col col-md-3 mt-3'>Danh sách loại hàng</SectionTitle>
                <Button className='col col-md-2 theme-bg' onClick={addDefaultCategory}>Thêm loại hàng +</Button>
                <Button className='col col-md-2 mb-3 float-right theme-bg' disabled={JSON.stringify(Category) === JSON.stringify(originalCategory)} onClick={editAll}>Lưu tất cả</Button>
            </div>
            <TableContainer className="mb-8">
                <Table style={{ backgroundColor: "#fff" }}>
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
                                        <Button style={{ color: 'red' }} layout="link" size="small" aria-label="Delete" onClick={() => handleRemoveCategory(cat, i)}>
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
