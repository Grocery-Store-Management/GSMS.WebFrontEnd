import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/Typography/SectionTitle';
import { getProductDetaiList } from "../Services/ProductService";
import { getImportOrderDetailList, getImportOrderList, removeImportOrder, createImportOrder } from "../Services/ImportOrderService";
import Modal from "../pages/Modals";
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
} from '@windmill/react-ui';
import { TrashIcon } from '../icons';
import { showToastError, showToastSuccess } from "../utils/ToasterUtility/ToasterUtility";
import { MODAL_TYPES } from '../Shared/Model';
import { pageLoader } from '../utils/PageLoadingUtility/PageLoader';
import { type } from '../utils/demo/tableData';
const STORE_ID = "36396edc-1534-407f-94e3-8e5d5ddab6af" //TRAN PHONG STORE HA NOI
function ImportOrder(props: any) {

    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [shownOrder, setShownOrder] = useState<any>();
    const [showOrderDetail, setShowOrderDetail] = useState<boolean>(false);
    const [pageTableImportOrders, setPageTableImportOrders] = useState(1)
    const [importOrders, setImportOrder] = useState<any[]>([])
    const [importOrdersDetails, setImportOrderDetails] = useState<any[]>([])
    const [productDetails, setProductsDetails] = useState<any[]>([])
    const [dataTableImportOrders, setDataTableImportOrders] = useState<any[]>([])
    const [showCreateOrder, setShowCreateOrder] = useState<boolean>(false);
    const resultsPerPage = 5;

    function onPageChangeTableImportOrders(p: number) {
        setPageTableImportOrders(p)
    }

    async function refreshImportOrderList() {
        setPageLoading(true)
        try {
            let importOrderList = await getImportOrderList();
            let importOrderDetailsList = await getImportOrderDetailList();
            let productDetailList = await getProductDetaiList();
            setProductsDetails(productDetailList)
            setImportOrder(importOrderList);
            setImportOrderDetails(importOrderDetailsList)
            setDataTableImportOrders(importOrderList);
        } catch (ex) {
            showToastError("Có lỗi xảy ra! Xin vui lòng thử lại")
        }
        finally {
            setPageLoading(false)
        }
    }

    async function deleteImportOrder(order: any) {
        try {
            setPageLoading(true)
            await removeImportOrder(order.id);
            await refreshImportOrderList();
            setPageLoading(false)
            showToastSuccess("Đơn đã bị hủy");

        } catch (ex: any) {
            showToastError("Có lỗi xảy ra! Xin vui lòng thử lại")
        } finally {
            setPageLoading(false)
        }
    }
    function openCreateNewImportOrder() {
        setShowCreateOrder(true)
    }
    function closeCreateNewImportOrder() {
        setShowCreateOrder(false)
    }
    async function sendImportOrder() {
        closeCreateNewImportOrder();

        let newImportOrder = {
            name: `Đơn hàng số ${importOrders.length + 1}`,
            importOrderDetails: importOrdersDetails,
            storeId: STORE_ID
        }
        try {
            setPageLoading(true)
            await createImportOrder(newImportOrder)
            await refreshImportOrderList()
            showToastSuccess("Đơn tạo thành công!")
        } catch (ex: any) {
            showToastError("Có lỗi xảy ra! Xin vui lòng thử lại")
        } finally {
            setPageLoading(false)
        }
    }
    useEffect(() => {
        refreshImportOrderList();
    }, [])

    useEffect(() => {
        setDataTableImportOrders(importOrders.slice((pageTableImportOrders - 1) * resultsPerPage, pageTableImportOrders * resultsPerPage))
    }, [pageTableImportOrders, importOrders])


    function showOrderDetails(order: any) {
        if (order.id === shownOrder?.id) {
            setShowOrderDetail(!showOrderDetail)
        } else {
            setShowOrderDetail(true)
            setShownOrder(order)
        }
    }

    return (
        <div className="container mt-3">
            {pageLoading && pageLoader()}
            {<Modal modalType={MODAL_TYPES.IMPORT_ORDER} cancel="Hủy" accept="Gửi đơn" header="Tạo đơn" callback={(value: any) => setImportOrderDetails(value)} acceptModal={sendImportOrder} closeModal={closeCreateNewImportOrder} showModal={showCreateOrder} />}
            <div className="row">
                <div className="col col-md-12">
                    <div className='row'>
                        <SectionTitle className="col col-md-9">Hàng nhập/xuất kho</SectionTitle>
                        <Button className='col col-md-2 mb-3' layout='primary' onClick={openCreateNewImportOrder}>
                            Tạo đơn mới
                        </Button>
                    </div>
                    <TableContainer className="mb-8">
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableCell>Tình trạng đơn hàng</TableCell>
                                    <TableCell>Tên đơn hàng</TableCell>
                                    <TableCell>Thành tiền</TableCell>
                                    <TableCell>Ngày tạo đơn</TableCell>
                                    <TableCell>Tương tác</TableCell>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {dataTableImportOrders.map((order, i) => {
                                    let totalPrice = 0;
                                    order?.importOrderDetails.forEach((importOrderDet: any) => {
                                        totalPrice += importOrderDet.price * importOrderDet.quantity;
                                    })
                                    return <React.Fragment key={i}>
                                        <TableRow >
                                            <TableCell>
                                                <Badge type={order.type ? order.type : type.PRIMARY}>
                                                    {order.status ? order.status : "Đang giao"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm"> {order.name} </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm"> {totalPrice} </span>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(order.createdDate).toISOString().slice(0, 10)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-4">
                                                    <Button layout="primary" size="small" aria-label="Edit" onClick={() => showOrderDetails(order)}>
                                                        Xem chi tiết
                                                    </Button>
                                                    <Button layout="link" size="small" aria-label="Delete" onClick={() => deleteImportOrder(order)}>
                                                        <TrashIcon className="w-5 h-5" aria-hidden="true" /> Hủy đơn
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {showOrderDetail && shownOrder.id === order.id &&
                                            <TableRow>
                                                <TableCell>
                                                    <Table>
                                                        <TableHeader>
                                                            <tr>
                                                                <TableCell>Tên sản phẩm</TableCell>
                                                                <TableCell>Giá bán</TableCell>
                                                                <TableCell>Số lượng</TableCell>
                                                            </tr>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {importOrdersDetails.filter((ordDet: any) => ordDet.importOrderId === order.id).map((det: any, i2: any) => {
                                                                return <TableRow key={i2}>
                                                                    <TableCell>
                                                                        <div className="flex items-center text-sm">
                                                                            <div>
                                                                                <p className="font-semibold">{det.name ? det.name : "Không rõ"}</p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell><TableCell>
                                                                        <div className="flex items-center text-sm">
                                                                            <div>
                                                                                <p className="font-semibold">{det.price ? det.price : "Không rõ"}</p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell><TableCell>
                                                                        <div className="flex items-center text-sm">
                                                                            <div>
                                                                                <p className="font-semibold">{det.quantity ? det.quantity : "Không rõ"}</p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </React.Fragment>
                                })}
                            </TableBody>
                        </Table>

                        <TableFooter>
                            <Pagination
                                totalResults={importOrders.length}
                                resultsPerPage={resultsPerPage}
                                onChange={onPageChangeTableImportOrders}
                                label="Table navigation"
                            />
                        </TableFooter>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}

export default ImportOrder
