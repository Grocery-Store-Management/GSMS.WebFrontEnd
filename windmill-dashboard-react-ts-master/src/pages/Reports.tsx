import React, { useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import { Chart } from "react-google-charts";
import { getCategoryList } from '../Services/CategoryService';
import { getProductList, getProductDetaiList } from "../Services/ProductService";
import { getReceiptList, getReceiptDetailList } from "../Services/ReceiptService";
import { getImportOrderList, getImportOrderDetailList } from "../Services/ImportOrderService";
import _ from 'lodash';
import SectionTitle from '../components/Typography/SectionTitle';
import { pageLoader } from '../utils/PageLoadingUtility/PageLoader';
import { Button, Pagination, Table, TableBody, TableCell, TableContainer, TableFooter, TableHeader, TableRow } from '@windmill/react-ui';

function Reports() {
    const [shownReceipt, setShownReciept] = useState<any>();
    const [showReceiptDetail, setShowReceiptDetail] = useState<boolean>(false);
    const [dataTableReceipts, setDataTableReceipts] = useState<any>([])
    const [pageTableReceipts, setPageTableReceipts] = useState(1)
    const [receipts, setReceipts] = useState<any>([]);
    const [receiptDetails, setReceiptDetails] = useState<any>([]);
    const [salesReportList, setSalesReport] = useState<any>([["Ngày", "Bán ra", "Mua vào"], ['1', 0, 0]])
    const [categoryReportList, setCategoryReport] = useState<any>([["Loại hàng", "Tỉ trọng trong kho"], ["", 0]])
    const [bestSellerReportList, setBestSellerReportReport] = useState<any>([["Sản phẩm", "Số lượng bán ra"], ["", 0]])
    const [totalSales, setTotalSale] = useState<number>(0);
    const [totalImports, setTotalImport] = useState<number>(0);
    const [profit, setProfit] = useState<number>(0);
    const [reportMonth, setReportMonth] = useState<number>(0);
    const [reportYear, setReportYear] = useState<number>(0);
    const [pageLoading, setPageLoading] = useState<boolean>(true);

    function onPageChangeTableReceipt(p: number) {
        setPageTableReceipts(p)
    }
    function getDatesInMonth(month: number, year: number) {
        var date = new Date(year, month, 1);
        var days: number[] = [];
        while (date.getMonth() === month) {
            days.push(new Date(date).getDate());
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    function getQuantityReport(categoryList: any, productList: any, receipts: any, importOrders: any, receiptDetails: any, productDetails: any, importOrdersDetails: any) {
        let quantityReport: any = [];
        categoryList.forEach((cat: any) => {
            let totalProduct = 0;
            productList.forEach((prod: any) => {
                if (prod.categoryId === cat.id) {
                    productDetails.forEach((prodDet: any) => {
                        if (prod.id === prodDet.productId) {
                            totalProduct += prodDet.storedQuantity;
                        }
                    })
                }
            })
            quantityReport.push([cat.name, totalProduct])
        })
        return quantityReport
    }

    function getBestSellerReportOfDay(day: any, receipts: any, receiptDetails: any) {
        let quantityReportOfDay: any = [];

        let receiptsOfDay: any = receipts.filter((rec: any) => new Date(rec.createdDate).getDate() === day);

        if (receiptsOfDay.length > 0) {
            receiptsOfDay.forEach((rec: any) => {
                let receiptDetailsOfDay = receiptDetails.filter((recDet: any) => recDet.receiptId === rec.id);
                if (receiptDetails) {
                    receiptDetailsOfDay.forEach((recDet: any) => {
                        quantityReportOfDay.push([recDet.name, recDet.quantity])
                    })
                }
            })
        }
        return quantityReportOfDay;
    }

    function getSalesReportOfDay(day: number, receipts: any, importOrders: any, receiptDetails: any, importOrdersDetails: any) {
        let salesReportOfDay: any = [];
        receipts.forEach((rec: any) => {
            let receiptCreatedDay = new Date(rec.createdDate).getDate()
            if (receiptCreatedDay === day) {
                let sale = 0;
                let curRecDetail = receiptDetails.find((recDet: any) => recDet.receiptId === rec.id);
                if (curRecDetail) {
                    sale += curRecDetail.price * curRecDetail.quantity
                    salesReportOfDay.push([day, sale])
                }
            }
        })
        let expensesReportOfDay: any = []
        importOrders.forEach((importOrder: any) => {
            let importOrderCreatedDay = new Date(importOrder.createdDate).getDate()
            if (importOrderCreatedDay === day) {
                let expense = 0;
                let curImportOrderDetail = importOrdersDetails.find((importDet: any) => importDet.orderId === importOrder.id);
                if (curImportOrderDetail) {
                    expense += curImportOrderDetail.price * curImportOrderDetail.quantity
                    expensesReportOfDay.push([day, expense])
                }
            }
        })
        if (salesReportOfDay.length === 0) {
            salesReportOfDay.push([day, 0])
        }
        if (expensesReportOfDay.length === 0) {
            expensesReportOfDay.push([day, 0])
        }
        let revenueReportOfDay: any = [];
        salesReportOfDay.forEach((sale: any) => {
            expensesReportOfDay.forEach((expense: any) => {
                if (sale[0] === expense[0]) {
                    revenueReportOfDay.push([day.toString(), sale[1], expense[1]])
                }
            })
        })
        return revenueReportOfDay;
    }

    async function generateData(month: number, year: number) {
        let importOrderList = await getImportOrderList();
        let importOrderDetailsList = await getImportOrderDetailList();
        let productList = await getProductList();
        let productDetailList = await getProductDetaiList();
        let receiptList = await getReceiptList();
        let receiptDetailList = await getReceiptDetailList();
        let categoryList = await getCategoryList();
        let salesReport: any = _.cloneDeep(salesReportList);
        let bestSellerReport: any = _.cloneDeep(bestSellerReportList);
        let categoryReport: any = _.cloneDeep(categoryReportList)
        setReceipts(receiptList)
        setReceiptDetails(receiptDetailList)
        //Line chart
        getDatesInMonth(month, year).forEach((day: number) => {
            let quantityReport: any = getSalesReportOfDay(day, receiptList, importOrderList, receiptDetailList, importOrderDetailsList)
            quantityReport.forEach((entry: any) => {
                let entIndex: number = salesReport.findIndex((ent: any) => entry[0] === ent[0])
                if (entIndex !== -1) {
                    salesReport[entIndex][0] = entry[0];
                    salesReport[entIndex][1] = salesReport[entIndex][1] + entry[1];
                    salesReport[entIndex][2] = salesReport[entIndex][2] + entry[2];
                } else {
                    salesReport.push(entry);
                }
            })
        })
        let totalSale = _.cloneDeep(totalSales);
        let totalImport = _.cloneDeep(totalImports);
        let totalProfit = _.cloneDeep(profit);
        salesReport.forEach((entry: any) => {
            if (typeof (entry[1]) === "number" && typeof (entry[2]) === "number") {
                totalSale += entry[1] as number;
                totalImport += entry[2] as number;
            }
        })
        totalProfit = totalSale - totalImport;
        setSalesReport(salesReport)
        setTotalSale(totalSale)
        setTotalImport(totalImport)
        setProfit(totalProfit)

        //Pie chart
        let quantityReport: any = getQuantityReport(categoryList, productList, receiptList, importOrderList, receiptDetailList, productDetailList, importOrderDetailsList)
        categoryReport.push(...quantityReport)
        setCategoryReport(categoryReport.filter((cat: any) => cat.name !== ""))

        //Bar chart
        getDatesInMonth(month, year).forEach((day: number) => {
            let bestSellerReportOfDay: any = getBestSellerReportOfDay(day, receiptList, receiptDetailList)
            bestSellerReportOfDay.forEach((entry: any) => {
                let entIndex: number = bestSellerReport.findIndex((ent: any) => entry[0] === ent[0])
                if (entIndex !== -1) {
                    bestSellerReport[entIndex][1] = bestSellerReport[entIndex][1] + entry[1];
                } else {
                    bestSellerReport.push(entry);
                }
            })
        })
        bestSellerReport = bestSellerReport.filter((entry: any) => entry[0] !== "")
        setBestSellerReportReport(bestSellerReport)
        setPageLoading(false)
    }

    useEffect(() => {
        let curDate = (new Date()).getMonth();
        let curYear = (new Date()).getFullYear()
        setReportMonth(curDate);
        setReportYear(curYear);
        generateData(curDate, curYear);
    }, [])

    useEffect(() => {
        setDataTableReceipts(receipts.slice((pageTableReceipts - 1) * 5, pageTableReceipts * 5))
    }, [pageTableReceipts, receipts])

    function showReceiptDetails(receipt: any) {
        if (receipt.id === shownReceipt?.id) {
            setShowReceiptDetail(!showReceiptDetail)
        } else {
            setShowReceiptDetail(true)
            setShownReciept(receipt)
        }
    }

    return (
        <>
            {pageLoading && pageLoader()}
            {!pageLoading && <>
                <PageTitle>Báo cáo trạng thái tháng {reportMonth} năm {reportYear}</PageTitle>
                <div className='row'>
                    <div className="col col-md-6 border-end">
                        <SectionTitle> Top hàng hóa bán chạy của tháng</SectionTitle>
                        <Chart
                            chartType="ColumnChart"
                            data={
                                bestSellerReportList
                            }
                            width="100%"
                            height="400px"
                            legendToggle
                        />
                    </div>
                    <div className="col col-md-6">
                        <SectionTitle> Các loại hàng đang có</SectionTitle>
                        <Chart
                            chartType="PieChart"
                            data={
                                categoryReportList
                            }
                            width="100%"
                            height="400px"
                            legendToggle
                        />
                    </div>
                </div>
                <div className="row">
                    <div className='col col-md-12 border-top'>
                        <SectionTitle> Đơn bán ra/nhập hàng theo ngày trong tháng</SectionTitle>
                        <SectionTitle> Tháng này đã bán được: {totalSales} VND </SectionTitle>
                        <SectionTitle> Thàng này đã nhập:{totalImports} VND</SectionTitle>
                        <SectionTitle> Tổng lợi nhuận tháng: {profit} VND</SectionTitle>

                        <Chart
                            chartType="LineChart"
                            data={
                                salesReportList
                            }
                            width="100%"
                            height="400px"
                            legendToggle
                        />
                    </div>
                </div>
                <SectionTitle>Lịch sử giao dịch</SectionTitle>
                <TableContainer className="mb-8 mt-0">
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableCell>Ngày xuất đơn</TableCell>
                                <TableCell>Tổng tiền</TableCell>
                                <TableCell>Tương tác</TableCell>
                            </tr>
                        </TableHeader>
                        <TableBody>
                            {dataTableReceipts.map((receipt: any, i: any) => {
                                let totalPrice = 0;
                                receiptDetails.forEach((recDet: any) => {
                                    if (recDet.receiptId === receipt.id) totalPrice += recDet.price * recDet.quantity
                                })
                                return (
                                    <React.Fragment key={i}>
                                        <TableRow >
                                            <TableCell>
                                                <div className="flex items-center text-sm">
                                                    <div>
                                                        <p className="font-semibold">{(new Date(receipt.createdDate)).toString()}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div><p className="font-semibold">{totalPrice}</p></div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-4">
                                                    <Button layout="primary" size="small" aria-label="Edit" onClick={() => showReceiptDetails(receipt)}>
                                                        Xem chi tiết
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {showReceiptDetail && shownReceipt.id === receipt.id &&
                                            <Table >
                                                <TableHeader>
                                                    <tr>
                                                        <TableCell>Tên sản phẩm</TableCell>
                                                        <TableCell>Giá bán</TableCell>
                                                        <TableCell>Số lượng</TableCell>
                                                    </tr>
                                                </TableHeader>
                                                <TableBody>
                                                    {receiptDetails.filter((recDet: any) => recDet.receiptId === receipt.id).map((det: any, i2: any) => {
                                                        return <> <TableRow key={i2}>
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
                                                        </>
                                                    })}
                                                </TableBody>
                                            </Table>
                                        }
                                    </React.Fragment>
                                )
                            })}
                        </TableBody>
                    </Table>
                    <TableFooter>
                        <Pagination
                            totalResults={receipts.length}
                            resultsPerPage={5}
                            onChange={onPageChangeTableReceipt}
                            label="Table navigation"
                        />
                    </TableFooter>
                </TableContainer>

            </>}
        </>
    )
}

export default Reports
