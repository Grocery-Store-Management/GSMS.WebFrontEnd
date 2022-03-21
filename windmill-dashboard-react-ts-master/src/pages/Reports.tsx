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
import { Button, Input, Pagination, Table, TableBody, TableCell, TableContainer, TableFooter, TableHeader, TableRow } from '@windmill/react-ui';
import '../styles/General.css';

function Reports() {
    const [shownReceipt, setShownReciept] = useState<any>();
    const [showReceiptDetail, setShowReceiptDetail] = useState<boolean>(false);
    const [dataTableReceipts, setDataTableReceipts] = useState<any>([])
    const [showEx, setShowEx] = useState<any>();
    const [showExDetails, setShowExDetails] = useState<boolean>(false);
    const [dataTableExport, setDataTableExports] = useState<any>([])
    const [pageTableReceipts, setPageTableReceipts] = useState(1)
    const [pageTableEx, setPageTableEx] = useState(1)
    const [receipts, setReceipts] = useState<any>([]);
    const [receiptDetails, setReceiptDetails] = useState<any>([]);
    const [salesReportList, setSalesReport] = useState<any>([["Ngày", "Bán ra", "Mua vào"], ['1', 0, 0]])
    const [categoryReportList, setCategoryReport] = useState<any>([["Loại hàng", "Tỉ trọng trong kho"], ["", 0]])
    const [bestSellerReportList, setBestSellerReportReport] = useState<any>([["Sản phẩm", "Số lượng bán ra"], [null, 0]])
    const [totalSales, setTotalSale] = useState<number>(0);
    const [totalImports, setTotalImport] = useState<number>(0);
    const [profit, setProfit] = useState<number>(0);
    const [reportMonth, setReportMonth] = useState<number>(0);
    const [reportYear, setReportYear] = useState<number>(0);
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [importOrder, setImportOrders] = useState<any>([]);
    const [exportOrder, setExportOrders] = useState<any>([]);
    const [importOrderDetails, setImportOrderDetails] = useState<any>([]);
    function onPageChangeTableEx(p: number) {
        setPageTableEx(p)
    }
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

    function getBestSellerReportOfDay(day: number, month: number, year: number, receipts: any, receiptDetails: any) {
        let quantityReportOfDay: any = [];

        let receiptsOfDay: any = receipts.filter((rec: any) => new Date(rec.createdDate).getDate() === day && new Date(rec.createdDate).getMonth() + 1 === month && new Date(rec.createdDate).getFullYear() === year);

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

    function getSalesReportOfDay(day: number, month: number, year: number, receipts: any, importOrders: any, receiptDetails: any, importOrdersDetails: any) {
        let salesReportOfDay: any = [];

        receipts.forEach((rec: any) => {
            let receiptCreatedDay = new Date(rec.createdDate)
            if (receiptCreatedDay.getDate() === day && (receiptCreatedDay.getMonth() + 1) === month && receiptCreatedDay.getFullYear() === year) {
                let sale = 0;
                if (rec.receiptDetails.length > 0) {
                    rec.receiptDetails.forEach((curRecDetail: any) => {
                        sale += curRecDetail.price * curRecDetail.quantity
                        salesReportOfDay.push([day, sale])
                    })
                }
            }
        })
        let expensesReportOfDay: any = []
        importOrders.forEach((importOrder: any) => {
            let importOrderCreatedDay = new Date(importOrder.createdDate)
            if (importOrderCreatedDay.getDate() === day && importOrderCreatedDay.getMonth() + 1 === month && importOrderCreatedDay.getFullYear() === year) {
                let expense = 0;
                importOrder.importOrderDetails.forEach((curImportOrderDetail: any) => {
                    if (curImportOrderDetail && curImportOrderDetail.quantity > 0) {
                        expense += curImportOrderDetail.price * curImportOrderDetail.quantity
                        expensesReportOfDay.push([day, expense])
                    }
                })
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
            revenueReportOfDay.push([day.toString(), sale[1], 0])
        })
        expensesReportOfDay.forEach((expense: any) => {
            revenueReportOfDay.push([day.toString(), 0, expense[1]])
        })

        return revenueReportOfDay;
    }

    async function generateData(month: number, year: number) {
        setPageLoading(true)

        let importOrderList = await getImportOrderList();
        let importOrderDetailsList = await getImportOrderDetailList();
        let productList = await getProductList();
        let productDetailList = await getProductDetaiList();
        let receiptList = await getReceiptList();
        let receiptDetailList = await getReceiptDetailList();
        let categoryList = await getCategoryList();
        let salesReport: any = [["Ngày", "Bán ra", "Mua vào"], ['1', 0, 0]];
        let bestSellerReport: any = [["Sản phẩm", "Số lượng bán ra"], [null, 0]];
        let categoryReport: any = [["Loại hàng", "Tỉ trọng trong kho"], ["", 0]];
        setReceipts(receiptList)
        setReceiptDetails(receiptDetailList)
        setImportOrders(importOrderList)
        setImportOrderDetails(importOrderDetailsList)
        //Line chart
        if (typeof (month) !== "number") month = Number.parseInt(month);
        if (typeof (year) !== "number") month = Number.parseInt(year);

        getDatesInMonth(month, year).forEach((day: number) => {

            if (month > 0 && year > 0) {
                let quantityReport: any = getSalesReportOfDay(day, month, year, receiptList, importOrderList, receiptDetailList, importOrderDetailsList)
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
            }
        })
        let totalSale = 0;
        let totalImport = 0;
        let totalProfit = 0;
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
            let bestSellerReportOfDay: any = getBestSellerReportOfDay(day, month, year, receiptList, receiptDetailList)
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
        let curMonth: number = (new Date()).getMonth();
        let curYear: number = (new Date()).getFullYear()
        setReportMonth(curMonth + 1);
        setReportYear(curYear);
    }, [])

    useEffect(() => {
        setTotalImport(0);
        setTotalSale(0);
        setProfit(0);
        setSalesReport([["Ngày", "Bán ra", "Mua vào"], ['1', 0, 0]])
        setBestSellerReportReport([["Sản phẩm", "Số lượng bán ra"], [null, 0]])
        setCategoryReport([["Loại hàng", "Tỉ trọng trong kho"], ["", 0]])
        generateData(reportMonth, reportYear);
    }, [reportMonth, reportYear])

    useEffect(() => {
        setDataTableReceipts(receipts.slice((pageTableReceipts - 1) * 5, pageTableReceipts * 5))
    }, [pageTableReceipts, receipts])

    useEffect(() => {
        let exportOders: any[] = [];

        importOrder.forEach((ord: any) => {
            let od = importOrderDetails.find((d: any) => d.importOrderId === ord.id);
            if (od && od.quantity < 0) {
                exportOders.push(ord);
            }
        });
        setExportOrders(exportOders);
        setDataTableExports(exportOders.slice((pageTableEx - 1) * 5, pageTableEx * 5))
    }, [pageTableEx, importOrder])

    function showReceiptDetails(receipt: any) {
        if (receipt.id === shownReceipt?.id) {
            setShowReceiptDetail(!showReceiptDetail)
        } else {
            setShowReceiptDetail(true)
            setShownReciept(receipt)
        }
    }

    function showExDetail(ex: any) {
        if (ex.id === showEx?.id) {
            setShowExDetails(!showExDetails)
        } else {
            setShowExDetails(true)
            setShowEx(ex)
        }
    }

    return (
        <>
            {pageLoading && pageLoader()}
            {<>
                <SectionTitle
                    className='row text-blue-400 mt-4 ml-4'>
                    Báo cáo trạng thái tháng
                    <Input
                        className='mr-2 ml-2 col col-sm-1'
                        css={""}
                        style={{ width: "8.3333%" }}
                        type='number'
                        max={12}
                        min={1}
                        value={reportMonth}
                        onChange={(e: any) => {
                            e.persist()
                            setReportMonth(e.target.value);
                        }}
                    />
                    năm
                    <Input
                        className='mr-2 ml-2 col col-sm-1'
                        css={""}
                        type='number'
                        value={reportYear}
                        style={{ width: "8.3333%" }}
                        onChange={(e: any) => {
                            e.persist()
                            setReportYear(e.target.value);
                        }}
                    />
                </SectionTitle>
                <div className='row'>
                    <div className="col col-md-6 border-end">
                        <SectionTitle className='ml-2'> Top hàng hóa bán chạy của tháng</SectionTitle>
                        <Chart
                            chartType="ColumnChart"
                            data={
                                bestSellerReportList ? bestSellerReportList : []
                            }
                            width="100%"
                            height="400px"
                            legendToggle
                        />
                    </div>
                    <div className="col col-md-6">
                        <SectionTitle className='ml-2'> Các loại hàng đang có</SectionTitle>
                        <Chart
                            chartType="PieChart"
                            data={
                                categoryReportList ? categoryReportList : []
                            }
                            width="100%"
                            height="400px"
                            legendToggle
                        />
                    </div>
                </div>
                <div className="row">
                    <div className='col col-md-12 border-top mt-4'>
                        {/* <SectionTitle> Đơn bán ra/nhập hàng theo ngày trong tháng</SectionTitle> */}
                        <div className='row'>
                            <div className='panel panel-md bg-default ml-4'>
                                <SectionTitle className='mt-4'> Tháng này đã bán</SectionTitle>
                                <SectionTitle>{totalSales.toLocaleString()} VND</SectionTitle>
                            </div>
                            <div className='panel panel-md bg-default ml-4'>
                                <SectionTitle className='mt-4'>Tháng này đã nhập</SectionTitle>
                                <SectionTitle>{totalImports.toLocaleString()} VND</SectionTitle>
                            </div>
                            <div className='panel panel-md bg-default ml-4'>
                                <SectionTitle className='mt-4'>Tổng lợi nhuận tháng</SectionTitle>
                                <SectionTitle>{profit > 0 ? profit.toLocaleString() : 0} VND</SectionTitle>
                            </div>
                        </div>
                        <Chart
                            className='mt-4'
                            chartType="LineChart"
                            data={
                                salesReportList ? salesReportList : []
                            }
                            width="100%"
                            height="400px"
                            legendToggle
                        />
                    </div>
                </div>
                <div className='mt-4'>
                    <SectionTitle className='ml-2'>Lịch sử giao dịch</SectionTitle>
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
                                                            <p className="font-semibold">{(new Date(receipt.createdDate)).toLocaleString("vi-VN")}</p>
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
                                                                {receiptDetails.filter((recDet: any) => recDet.receiptId === receipt.id).map((det: any, i2: any) => {
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
                                    )
                                })}
                            </TableBody>
                        </Table>
                        <TableFooter>
                            <Pagination
                                totalResults={receipts.length}
                                resultsPerPage={5}
                                onChange={onPageChangeTableReceipt}
                                label="Số trang"
                            />
                        </TableFooter>
                    </TableContainer>
                </div>
                <div className='mt-4'>
                    <SectionTitle className='ml-2'>Lịch sử xuất hàng</SectionTitle>
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
                                {dataTableExport.map((ex: any, i: any) => {
                                    if (ex.importOrderDetails[0].quantity < 0) {
                                        return (
                                            <React.Fragment key={i}>
                                                <TableRow >
                                                    <TableCell>
                                                        <div className="flex items-center text-sm">
                                                            <div>
                                                                <p className="font-semibold">{(new Date(ex.createdDate)).toLocaleString("vi-VN")}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-4">
                                                            <Button layout="primary" size="small" aria-label="Edit" onClick={() => showExDetail(ex)}>
                                                                Xem chi tiết
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                {showExDetails && showEx?.id === ex.id &&
                                                    <TableRow>
                                                        <TableCell>
                                                            <Table>
                                                                <TableHeader>
                                                                    <tr>
                                                                        <TableCell>Tên sản phẩm</TableCell>
                                                                        <TableCell>Số lượng xuất hàng</TableCell>
                                                                    </tr>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {importOrderDetails.filter((impDet: any) => impDet.importOrderId === ex.id).map((det: any, i2: any) => {
                                                                        return <TableRow key={i2}>
                                                                            <TableCell>
                                                                                <div className="flex items-center text-sm">
                                                                                    <div>
                                                                                        <p className="font-semibold">{det.name ? det.name : "Không rõ"}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div className="flex items-center text-sm">
                                                                                    <div>
                                                                                        <p className="font-semibold">{det.quantity ? det.quantity * -1 : "Không rõ"}</p>
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
                                        )
                                    } else {
                                        return (
                                            <React.Fragment key={i}>
                                                <TableRow>
                                                    <TableCell>
                                                        <div className="flex items-center text-sm">
                                                            <div>
                                                                <p className="font-semibold">
                                                                    Không có dữ liệu
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        )
                                    }
                                })}
                            </TableBody>
                        </Table>
                        <TableFooter>
                            <Pagination
                                totalResults={exportOrder.length}
                                resultsPerPage={5}
                                onChange={onPageChangeTableEx}
                                label="Số trang"
                            />
                        </TableFooter>
                    </TableContainer>
                </div>
            </>}
        </>
    )
}

export default Reports
