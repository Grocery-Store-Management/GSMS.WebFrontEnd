import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/Typography/SectionTitle';
import { addProduct, getProductList, getProductDetaiList, updateProductDetail, updateProduct, deleteProduct, addProductDetail } from "../Services/ProductService";
import { getImportOrderDetailList, getImportOrderList } from "../Services/ImportOrderService";
import { getCategoryList } from "../Services/CategoryService";
import _ from "lodash"
import { storage } from "../utils/firebase/firebase";
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
import { FireIcon, MenuIcon } from '../icons';
import { showToastError, showToastSuccess } from "../utils/ToasterUtility/ToasterUtility";
import { status_mapping, type, type_mapping } from '../utils/demo/tableData';
import { pageLoader } from '../utils/PageLoadingUtility/PageLoader';
import '../styles/General.css';
import ConfirmModal from './ConfirmModal';

const STORE_ID = "36396edc-1534-407f-94e3-8e5d5ddab6af" //TRAN PHONG STORE HA NOI
function Product(props: any) {
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deletedItem, setDeletedItem] = useState<any>(null);
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [pageTableProducts, setPageTableProducts] = useState(1)
    const [originalProducts, setOriginalProducts] = useState<any[]>([])
    const [originalProductDetails, setOriginalProductDetails] = useState<any[]>([])
    const [productDetails, setProductsDetails] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [importOrders, setImportOrders] = useState<any[]>([])
    const [importOrdersDetails, setImportOrdersDetails] = useState<any[]>([])
    const [dataTableProducts, setDataTableProducts] = useState<any[]>([])
    const [category, setCategories] = useState<any>([])
    const [sorted, setSorted] = useState<boolean>(false);
    const resultsPerPage = 5;

    function onPageChangeTableProducts(p: number) {
        setPageTableProducts(p)
    }
    function changeProductQuantity(product: any, quantity: any) {
        let prodDets = _.cloneDeep(productDetails)
        let prodDetIndex = prodDets.findIndex((prodDet: any) => prodDet.productId === product.id);
        if (prodDetIndex !== -1) {
            if (quantity === "0") {
                prodDets[prodDetIndex].status = 2
            } else {
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

    async function editAll() {
        setPageLoading(true);
        let prods = _.cloneDeep(products);
        let prodDets = _.cloneDeep(productDetails);
        try {
            setPageLoading(true)
            for (var i = 0; i < prods.length; i++) {
                let curProdDet = prodDets.find((prodDet: any) => prodDet.productId === prods[i].id);
                if (curProdDet) {
                    await editProduct(prods[i], curProdDet, false)
                }
            }
            prods.forEach(async (prod: any) => {

            })
            showToastSuccess("Cập nhật tất cả thành công!");
        }
        catch (ex) {
            showToastError("Có lỗi xảy ra! Xin vui lòng thử lại")
        } finally {
            refreshData();
        }
    }

    async function editProduct(product: any, productDetail: any = null, singleUpdate: boolean = true) {
        if (productDetail || product.productDetails !== []) {
            try {
                let prods = _.cloneDeep(originalProducts)
                let prodIndex = prods.findIndex((prod: any) => prod.id === product.id);
                let prodDets = _.cloneDeep(originalProductDetails)
                let prodDetIndex = prodDets.findIndex((prodDet: any) => prodDet.productId === product.id);
                if (prodIndex !== -1) {
                    if (JSON.stringify(prods[prodIndex]) !== JSON.stringify(product) || JSON.stringify(prodDets[prodDetIndex]) !== JSON.stringify(productDetail)) {
                        if (singleUpdate) setPageLoading(true)
                        await updateProduct(product);
                        if (productDetail) {
                            if (productDetail.product === null) productDetail.product = ""
                            await updateProductDetail(productDetail);
                        }
                        if (singleUpdate) showToastSuccess("Cập nhật thành công!")
                    } else {
                        return
                    }
                } else {
                    await addProduct(product);
                }
                await refreshData()
            } catch (ex) {
                console.log(ex)
                showToastError("Có lỗi xảy ra! Xin vui lòng thử lại")
            } finally {
                if (singleUpdate) setPageLoading(false)
            }
        } else {
            return
        }

    }

    function handleRemoveProduct(product: any) {
        setShowDeleteModal(true);
        setDeletedItem(product);
    }

    async function removeProduct(product: any) {
        try {
            setPageLoading(true)
            await deleteProduct(product);
            showToastSuccess("Xóa thành công!")
        } catch (ex) {
            showToastError("Có lỗi xảy ra! Xin vui lòng thử lại")
        }
        refreshData();
    }

    async function addDefaultProduct() {
        let defaultProduct = {
            id: "",
            atomicPrice: 0,
            name: "Sản phẩm mặc định",
            categoryId: category[0].id ? category[0].id : "",
        }
        setPageLoading(true)
        let addedProduct = await addProduct(defaultProduct)
        await addProductDetail({
            productId: addedProduct.id,
            id: "",
            price: 1000,
            status: 1,
            storedQuantity: 100
        })
        showToastSuccess("Sản phẩm mặc định tạo thành công!")
        refreshData();
    }
    async function refreshData() {
        let prodList = await getProductList();
        let prodDetList = await getProductDetaiList();
        let importOrders = await getImportOrderList();
        let importOrdersDetails = await getImportOrderDetailList();
        let categoryList = await getCategoryList();

        let prods = [
            ...prodList.filter((p: any) => p.name.includes("Sản phẩm mặc định")),
            ...prodList.filter((p: any) => !p.name.includes("Sản phẩm mặc định"))
        ]

        setProducts(prods);
        setProductsDetails(prodDetList)
        setOriginalProducts(prodList);
        setOriginalProductDetails(prodDetList);
        setCategories(categoryList);
        setImportOrders(importOrders);
        setImportOrdersDetails(importOrdersDetails);
        setPageLoading(false);

        searchProduct("", prods);
    }

    useEffect(() => {
        setPageLoading(true)
        refreshData();
    }, [])

    useEffect(() => {
        setDataTableProducts(products.slice((pageTableProducts - 1) * resultsPerPage, pageTableProducts * resultsPerPage))
    }, [pageTableProducts, products])


    const handleFireBaseUpload = (e: any, product: any) => {
        const imageAsFile = e.target.files[0]
        e.preventDefault();
        console.log('start of upload')
        if (imageAsFile === '') {
            console.error(`not an image, the image file is a ${typeof (imageAsFile)}`)
        }
        const uploadTask = storage.ref(`/images/products/${imageAsFile.name}`).put(imageAsFile)
        uploadTask.on('state_changed',
            (snapShot) => {
                setPageLoading(true)
            }, (err) => {
                console.log(err)
            }, () => {
                storage.ref('images/products').child(imageAsFile.name).getDownloadURL()
                    .then(fireBaseUrl => {
                        product.imageUrl = fireBaseUrl;
                        editProduct(product);
                    })
            })
    }

    function searchProduct(searchPrompt: String, originalProducts: any) {
        let productList = _.cloneDeep(originalProducts);
        if (productList.length > 0) {
            if (searchPrompt.length === 0) {
                setProducts(productList);
            } else {
                productList = productList.filter((prod: any) =>
                    prod.name
                        .trim()
                        .toLowerCase()
                        .includes(searchPrompt.trim().toLowerCase())
                );
                setProducts(productList);
            }
        }
    }

    return (
        <div className="col col-md-12">
            {pageLoading && pageLoader()}
            <ConfirmModal modalOpen={showDeleteModal}
                callback={() => {
                    removeProduct(deletedItem)
                    setShowDeleteModal(false)
                }}
                onClose={() => setShowDeleteModal(false)}
                header={`Xóa sản phẩm`}
                body={`Bạn có chắc là muốn xóa sản phẩm này?`}
                accept={`Có`}
                cancel={`Không`}
            />
            <div className=''>
                <SectionTitle className='col col-md-3 mt-3'>Danh sách hàng trong kho</SectionTitle>
                <div className="row">
                    <Input
                        css={undefined}
                        className="col col-md-6 mb-2 ml-3"
                        placeholder="Tìm kiếm sản phẩm"
                        onChange={(e: any) => {
                            e.persist();
                            searchProduct(e.target.value, originalProducts);
                        }}
                    />
                    <div className="col col-md-3 mb-2">
                        <Button style={{ backgroundColor: "#73C4FF" }} size="regular">
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
                <Button className='col col-md-2 mb-3 theme-bg' onClick={addDefaultProduct}>Thêm sản phẩm +</Button>
                <Button className='col col-md-2 mb-3 float-right theme-bg'
                    disabled={JSON.stringify(products) === JSON.stringify(originalProducts) && JSON.stringify(productDetails) === JSON.stringify(originalProductDetails)}
                    onClick={editAll}>Lưu tất cả</Button>
            </div>
            <TableContainer className="mb-8">
                <Table>
                    <TableHeader>
                        <tr>
                            <TableCell>Hình ảnh</TableCell>
                            <TableCell>Tên hàng
                            </TableCell>
                            <TableCell>Giá mua</TableCell>
                            <TableCell>Giá bán
                                <button>
                                    <MenuIcon className='pt-2 w-5 h-5' aria-hidden="true" onClick={() => {
                                        var sortedProds: any[] = [];
                                        if (sorted === false) {
                                            setSorted(true);
                                            var sortedProdDets = productDetails.sort((d1: any, d2: any) => d1.price - d2.price);
                                            sortedProdDets.forEach((det: any) => {
                                                products.forEach((p: any) => {
                                                    if (p.id === det.productId) {
                                                        sortedProds.push(p);
                                                    }
                                                })
                                            })
                                        } else {
                                            setSorted(false);
                                            sortedProds = originalProducts;
                                        }
                                        setProducts(sortedProds)
                                    }} />
                                </button>


                            </TableCell>
                            <TableCell>Số lượng
                                <button>
                                    <MenuIcon className='pt-2 w-5 h-5' aria-hidden="true" onClick={() => {
                                        var sortedProds: any[] = [];
                                        if (sorted === false) {
                                            setSorted(true);
                                            var sortedProdDets = productDetails.sort((d1: any, d2: any) => d1.storedQuantity - d2.storedQuantity);
                                            sortedProdDets.forEach((det: any) => {
                                                products.forEach((p: any) => {
                                                    if (p.id === det.productId) {
                                                        sortedProds.push(p);
                                                    }
                                                })
                                            })
                                        } else {
                                            setSorted(false);
                                            sortedProds = originalProducts;
                                        }
                                        setProducts(sortedProds)
                                    }} />
                                </button>
                            </TableCell>
                            <TableCell>
                                Tình trạng
                            </TableCell>
                            <TableCell>Danh mục</TableCell>
                            <TableCell>Tương tác</TableCell>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {dataTableProducts.map((product, i) => {
                            let curProdDetail = productDetails.find((prodDet: any) => prodDet?.productId === product.id);
                            let prodStatus = status_mapping[curProdDetail?.status];
                            let prodType = type_mapping[curProdDetail?.status];
                            let prodCat = category.find((cat: any) => cat.id === product?.categoryId);
                            return <TableRow key={i}
                            >
                                <TableCell


                                >
                                    <div className="App"
                                    >
                                        <label onMouseEnter={(e: any) => e.target.style.cursor = "pointer"}
                                        >
                                            <input
                                                hidden
                                                id="file-upload"
                                                type="file"
                                                onChange={(e: any) => handleFireBaseUpload(e, product)}
                                            />
                                            <img alt="imageProduct" width={100} height={100} src={`${product.imageUrl ? product.imageUrl : "/placeholder.jpg"}`} />
                                        </label>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex mt-4 items-center text-sm">
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
                                    <div>
                                        {importOrdersDetails.find((importOrderDet: any) => importOrderDet.productId === product.id)?.price ? importOrdersDetails.find((importOrderDet: any) => importOrderDet.productId === product.id)?.price : "Không có dữ liệu"}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Input className="text-sm" type='number' min={0} value={curProdDetail?.price ? curProdDetail?.price : 0} css={""}
                                        onChange={(e: any) => {
                                            e.persist();
                                            changeProductPrice(product, parseFloat(e.target.value));
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input className="text-sm" type='number' min={0} value={curProdDetail?.storedQuantity ? curProdDetail?.storedQuantity : 0} css={""}
                                        onChange={(e: any) => {
                                            e.persist();
                                            changeProductQuantity(product, parseInt(e.target.value));
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Badge type={prodType}> {prodType === type.SUCCESS &&
                                        <FireIcon className="w-5 h-5" aria-hidden="true" />
                                    }{prodStatus}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Select style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} css="" className="mt-1" value={prodCat?.id} onChange={(e: any) => { e.persist(); changeProductCategory(product, e.target.value) }}>
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
                                        <Button style={{ color: 'red' }} layout="link" size="small" aria-label="Delete" onClick={() => handleRemoveProduct(product)}>
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
