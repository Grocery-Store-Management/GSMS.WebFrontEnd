import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Input, Select } from '@windmill/react-ui'
import { getProductDetaiList, getProductList } from "../Services/ProductService";
import _ from 'lodash';
function ImportOrderForm(props: any) {
    const [productDetails, setProductDetails] = useState<any>([]);
    const [ImportOrderDetails, setImportOrderDetails] = useState<any>([]);
    const [products, setProducts] = useState<any>([]);

    async function refreshProductList() {
        let prodDetList = await getProductDetaiList();
        let prodList = await getProductList();
        setProducts(prodList)
        setProductDetails(prodDetList)
    }

    function addProductToImportOrder() {
        let importOrderDetails = _.cloneDeep(ImportOrderDetails);
        let initImportOrderDetails: any = [{
            id: "",
            productId: products[0]?.id ? products[0]?.id : "",
            name: products[0]?.name,
            price: productDetails?.find((prodDet: any) => prodDet.productId === products[0].id)?.price,
            quantity: 1
        }];
        importOrderDetails.push(initImportOrderDetails[0]);
        setImportOrderDetails(importOrderDetails);
    }


    function changeOrderQuantity(importOrderDetail: any, quantity: number) {
        let importOrderDetails = _.cloneDeep(ImportOrderDetails);
        let ordDetIndex = importOrderDetails.findIndex((det: any) => det.id === importOrderDetail.id);
        if (ordDetIndex !== -1) {
            importOrderDetails[ordDetIndex].quantity = quantity;
            setImportOrderDetails(importOrderDetails)
        }
    }
    function onProductNameChange(newProductId: any, importOrderDetail: any) {
        let importOrderDetails = _.cloneDeep(ImportOrderDetails);
        let prodDets = _.cloneDeep(productDetails);
        let ordDetIndex = importOrderDetails.findIndex((detail: any) => detail.id === importOrderDetail.id);
        let prodDet = prodDets.find((prodDet: any) => prodDet.productId === newProductId);
        if (ordDetIndex !== -1) {
            if (prodDet) {
                importOrderDetails[ordDetIndex].productId = newProductId;
                importOrderDetails[ordDetIndex].name = prodDet.name;
                importOrderDetails[ordDetIndex].price = prodDet.price;
                setImportOrderDetails(importOrderDetails)
            }
        }
    }
    useEffect(() => {
        refreshProductList();
    }, [])

    useEffect(() => {
        let importOrderDetails = _.cloneDeep(ImportOrderDetails)
        props.callback(importOrderDetails)
    }, [ImportOrderDetails])

    return (
        <div>
            <div style={{ overflowY: "scroll", maxHeight: "40vh" }}>
                {ImportOrderDetails.map((importOrderDetail: any, key: any) => {
                    let prod = products.find((product: any) => product.id === importOrderDetail.productId)
                    return <div key={key}>
                        <Card className="mb-8 shadow-md">
                            <CardBody>
                                <div className='row mt-3'>
                                    <p className="col col-md-7 text-sm text-gray-600 dark:text-gray-400">
                                        Tên mặt hàng:
                                        <ProductNameCustomSelect onProductNameChange={(e: any) => { e.persist(); onProductNameChange(e.target.value, importOrderDetail) }} products={products} curProduct={prod} />
                                    </p>
                                    <p className="col col-md-3 text-sm text-gray-600 dark:text-gray-400">
                                        Số lượng:
                                        <Input className="text-sm" type='number' min={0} value={importOrderDetail.quantity} css={""}
                                            onChange={(e: any) => {
                                                e.persist();
                                                changeOrderQuantity(importOrderDetail, e.target.value);
                                            }}
                                        />

                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                })}
            </div>
            <div className='mt-3' style={{ textAlign: "center" }}>
                <Button size='small' disabled={ImportOrderDetails.find((importOrderDet: any) => importOrderDet.productId === "") !== undefined} onClick={addProductToImportOrder}>Thêm hàng +</Button>
            </div>
        </div>
    )
}

const ProductNameCustomSelect = (props: any) => {
    return <Select style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} css="" className="mt-1" defaultValue={props.curProduct} onChange={props.onProductNameChange}>
        {props.products.map((prod: any, key: any) => {
            return <option key={key} value={prod.id}>{prod.name}</option>
        })}
    </Select>
}

export default ImportOrderForm
