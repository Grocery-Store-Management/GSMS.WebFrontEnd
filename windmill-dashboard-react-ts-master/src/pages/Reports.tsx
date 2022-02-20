import React, { useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import { Chart } from "react-google-charts";
import { getProductList, getProductDetaiList } from "../Services/ProductService";
import { getReceiptList, getReceiptDetailList } from "../Services/ReceiptService";
import { getImportOrderList, getImportOrderDetailList } from "../Services/ImportOrderService";
import _ from 'lodash';

function Reports() {
    const [salesReportList, setSalesReport] = useState<any>([["Ngày", "Bán ra", "Mua vào"], [1, 0, 0]])
    function getDatesInMonth(month: number, year: number) {
        var date = new Date(year, month, 1);
        var days: number[] = [];
        while (date.getMonth() === month) {
            days.push(new Date(date).getDate());
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    function getSalesReportOfDay(day: number, receipts: any, importOrders: any, receiptDetails: any, productDetails: any, importOrdersDetails: any) {
        let salesReportOfDay: any = [];
        receipts.forEach((rec: any) => {
            let receiptCreatedDay = new Date(rec.createdDate).getDate()
            if (receiptCreatedDay === day) {
                let sale = 0;
                let curRecDetail = receiptDetails.find((recDet: any) => recDet.receiptId === rec.id);
                if (curRecDetail) {
                    let curProdDet = productDetails.find((prodDet: any) => curRecDetail.productId === prodDet.productId);
                    if (curProdDet) {
                        sale += curProdDet.price * curRecDetail.quantity
                        salesReportOfDay.push([day, sale])
                    }
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
                    let curProdDet = productDetails.find((prodDet: any) => curImportOrderDetail.productId === prodDet.productId);
                    if (curProdDet) {
                        expense += curProdDet.price * curImportOrderDetail.quantity
                        expensesReportOfDay.push([day, expense])
                    }
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
    useEffect(() => {
        async function initData() {
            let importOrderList = await getImportOrderList();
            let importOrderDetailsList = await getImportOrderDetailList();
            let productList = await getProductList();
            let productDetailList = await getProductDetaiList();
            let receiptList = await getReceiptList();
            let receiptDetailList = await getReceiptDetailList();
            let salesReport: any = _.cloneDeep(salesReportList);
            getDatesInMonth(new Date().getMonth() - 1, new Date().getFullYear()).forEach((day: number) => {
                let revenueReportOfDay: any = getSalesReportOfDay(day, receiptList, importOrderList, receiptDetailList, productDetailList, importOrderDetailsList)
                revenueReportOfDay.forEach((entry: any) => {
                    let entIndex: number = salesReport.findIndex((ent: any) => entry[0] === ent[0])
                    if (entIndex !== -1) {
                        salesReport[entIndex][1] = salesReport[entIndex][1] + entry[1];
                        salesReport[entIndex][2] = salesReport[entIndex][2] + entry[2];
                    } else {
                        salesReport.push(entry);
                    }
                })
            })
            setSalesReport(salesReport)
        }
        initData();
    }, [])


    return (
        <>
            <PageTitle>Báo cáo hàng tháng</PageTitle>
            <div className='row'>
                <div className="col col-md-6">
                    {/* Top ten */}
                    <Chart
                        chartType="BarChart"
                        data={
                            [['Year', 'Sales', 'Expenses'],
                            ['2004', 1000, 400],
                            ['2005', 1170, 460],
                            ['2006', 660, 1120],
                            ['2007', 1030, 540]]}
                        width="100%"
                        height="400px"
                        legendToggle
                    />
                </div>
                <div className="col col-md-6">
                    {/* Category */}
                    <Chart
                        chartType="PieChart"
                        data={
                            [['Year', 'Sales', 'Expenses'],
                            ['2004', 1000, 400],
                            ['2005', 1170, 460],
                            ['2006', 660, 1120],
                            ['2007', 1030, 540]]}
                        width="100%"
                        height="400px"
                        legendToggle
                    />
                </div>
            </div>
            <div className="row">
                <div className='col col-md-12'>
                    {/* Revenue */}
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
        </>
    )
}

export default Reports
