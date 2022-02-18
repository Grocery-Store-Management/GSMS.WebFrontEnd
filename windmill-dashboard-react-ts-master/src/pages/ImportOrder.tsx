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
    // setup data for every table
    const [dataImportOrder, setDataImportOrder] = useState<any[]>([])
    const [dataTableProducts, setDataTableProducts] = useState<any[]>([])
    // pagination setup
    const resultsPerPage = 5;

    // pagination change control
    function onPageChangeTable1(p: number) {
        setPageTableProducts(p)
    }

    async function refresh() {
        let prodList = await getProductList();
        setDataTableProducts(prodList);
    }

    async function refreshImportOrderList() {

    }
    useEffect(() => {
        refreshImportOrderList();
    }, [])

    useEffect(() => {
        setDataTableProducts(dataTableProducts.slice((pageTableProducts - 1) * resultsPerPage, pageTableProducts * resultsPerPage))
    }, [pageTableProducts])

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col col-md-12">
                    <SectionTitle>Đơn hàng nhập kho</SectionTitle>
                    <TableContainer className="mb-8">
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableCell>Tình trạng đơn hàng</TableCell>
                                    <TableCell>Thành tiền</TableCell>
                                    <TableCell>Ngày tạo đơn</TableCell>
                                    <TableCell>Tương tác</TableCell>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {dataImportOrder.map((order, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Badge type={order.type}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">$ {order.price}</span>
                                        </TableCell>
                                        <TableCell>
                                            {order.date}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-4">
                                                <Button layout="link" size="small" aria-label="Edit">
                                                    <HeartIcon className="w-5 h-5" aria-hidden="true" />
                                                </Button>
                                                <Button layout="link" size="small" aria-label="Delete">
                                                    <TrashIcon className="w-5 h-5" aria-hidden="true" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TableFooter>
                            {/* <Pagination
                    totalResults={totalResults}
                    resultsPerPage={resultsPerPage}
                    onChange={onPageChangeProduct}
                    label="Table navigation"
                  /> */}
                        </TableFooter>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}

export default Receipt
