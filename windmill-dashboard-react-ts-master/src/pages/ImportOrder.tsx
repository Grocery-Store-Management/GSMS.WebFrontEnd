import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/Typography/SectionTitle';
import { getProductDetaiList } from "../Services/ProductService";
import { getImportOrderDetailList, getImportOrderList, removeImportOrder, createImportOrder } from "../Services/ImportOrderService";
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
} from '@windmill/react-ui';
import { TrashIcon } from '../icons';
import { showToastError, showToastSuccess } from "../utils/ToasterUtility/ToasterUtility";
import { MODAL_TYPES } from '../Shared/Model';
const STORE_ID = "36396edc-1534-407f-94e3-8e5d5ddab6af" //TRAN PHONG STORE HA NOI
function ImportOrder() {


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
        let importOrderList = await getImportOrderList();
        let importOrderDetailsList = await getImportOrderDetailList();
        let productDetailList = await getProductDetaiList();
        setProductsDetails(productDetailList)
        setImportOrder(importOrderList);
        setImportOrderDetails(importOrderDetailsList)
        setDataTableImportOrders(importOrderList);
    }

    async function deleteImportOrder(order: any) {
        try {
            await removeImportOrder(order.id);
            showToastSuccess("Đơn đã bị hủy");
            await refreshImportOrderList();
        } catch (ex: any) {
            showToastError(ex)
        }
    }
    function openCreateNewImportOrder() {
        setShowCreateOrder(true)
    }
    function closeCreateNewImportOrder() {
        setShowCreateOrder(false)
    }
    async function sendImportOrder() {
        let newImportOrder = {
            name: `Đơn hàng số ${importOrders.length + 1}`,
            importOrderDetails: importOrdersDetails,
            storeId: STORE_ID
        }
        await createImportOrder(newImportOrder)
        await refreshImportOrderList()
        closeCreateNewImportOrder();
    }
    useEffect(() => {
        refreshImportOrderList();
    }, [])

    useEffect(() => {
        setDataTableImportOrders(dataTableImportOrders.slice((pageTableImportOrders - 1) * resultsPerPage, pageTableImportOrders * resultsPerPage))
    }, [pageTableImportOrders])

    return (
        <div className="container mt-3">
            {<Modal modalType={MODAL_TYPES.IMPORT_ORDER} cancel="Hủy" accept="Gửi đơn" header="Tạo đơn" callback={(value: any) => setImportOrderDetails(value)} acceptModal={sendImportOrder} closeModal={closeCreateNewImportOrder} showModal={showCreateOrder} />}
            <div className="row">
                <div className="col col-md-12">
                    <div className='row'>
                        <SectionTitle className="col col-md-9">Đơn hàng nhập kho</SectionTitle>
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
                                {importOrders.map((order, i) => {
                                    let totalPrice = 0;
                                    let importOrderDetailOfCurrentOrder = importOrdersDetails.filter((det: any) => det.orderId === order.id);
                                    importOrderDetailOfCurrentOrder.forEach((importOrderDetail: any) => {
                                        let prodInList = productDetails.find((productDetail: any) =>
                                            productDetail.productId === importOrderDetail.productId
                                        )
                                        totalPrice += prodInList?.price * importOrderDetail.quantity
                                    })
                                    return <TableRow key={i}>
                                        <TableCell>
                                            <Badge type={order.type}>
                                                {order.status}
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
                                                <Button layout="link" size="small" aria-label="Delete" onClick={() => deleteImportOrder(order)}>
                                                    <TrashIcon className="w-5 h-5" aria-hidden="true" /> Hủy đơn
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
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
