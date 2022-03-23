import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Input, Select } from '@windmill/react-ui'
import { getProductDetaiList, getProductList } from "../Services/ProductService";
import _ from 'lodash';
import { MODAL_TYPES } from '../Shared/Model';
import '../styles/General.css';

function ImportOrderForm(props: any) {
    const [productDetails, setProductDetails] = useState<any>(props.productDetails);
    const [ImportOrderDetails, setImportOrderDetails] = useState<any>([]);
    const [products, setProducts] = useState<any>(props.products);

    async function refreshProductList() {
        setProducts(props.products)
        setProductDetails(props.productDetails)
    }

    useEffect(() => {
        refreshProductList();
    }, [])

    function addProductToImportOrder() {
        let importOrderDetails = _.cloneDeep(ImportOrderDetails);
        let initImportOrderDetails: any = [{
            id: "",
            productId: products[0]?.id ? products[0]?.id : "",
            name: products[0]?.name,
            price: productDetails?.find((prodDet: any) => prodDet.productId === products[0].id)?.price,
            quantity: props.modalType === MODAL_TYPES.IMPORT_ORDER ? 1 : -1
        }];
        importOrderDetails.push(initImportOrderDetails[0]);
        setImportOrderDetails(importOrderDetails);
    }


    function changeOrderQuantity(importOrderDetailIndex: any, quantity: number) {
        let importOrderDetails = _.cloneDeep(ImportOrderDetails);
        let ordDetIndex = importOrderDetailIndex;
        if (ordDetIndex !== -1) {
            if (props.modalType === MODAL_TYPES.IMPORT_ORDER) importOrderDetails[ordDetIndex].quantity = quantity;
            else importOrderDetails[ordDetIndex].quantity = -quantity;
            setImportOrderDetails(importOrderDetails)
        }
    }
    function onProductNameChange(newProductId: any, importOrderDetailIndex: any) {
        let importOrderDetails = _.cloneDeep(ImportOrderDetails);
        let prodDets = _.cloneDeep(productDetails);
        let prods = _.cloneDeep(products);
        let ordDetIndex = importOrderDetailIndex;
        let prodDet = prodDets.find((prodDet: any) => prodDet.productId === newProductId);
        let prod = prods.find((prod: any) => prod.id === newProductId);
        if (prodDet) {
            importOrderDetails[ordDetIndex].productId = newProductId;
            importOrderDetails[ordDetIndex].name = prod.name;
            importOrderDetails[ordDetIndex].price = prodDet.price;
            setImportOrderDetails(importOrderDetails)
        }
    }

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
                                        <ProductNameCustomSelect onProductNameChange={(e: any) => { e.persist(); onProductNameChange(e.target.value, key) }} products={products} curProduct={prod} />
                                    </p>
                                    <p className="col col-md-3 text-sm text-gray-600 dark:text-gray-400">
                                        Số lượng:
                                        <Input className="text-sm" type='number' min={0} value={importOrderDetail.quantity > 0 ? importOrderDetail.quantity : -importOrderDetail.quantity} css={""}
                                            onChange={(e: any) => {
                                                e.persist();
                                                changeOrderQuantity(key, e.target.value);
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
                <Button  size='small' disabled={ImportOrderDetails.find((importOrderDet: any) => importOrderDet.productId === "") !== undefined} onClick={addProductToImportOrder}>Thêm hàng +</Button>
            </div>
        </div>
    )
}

const ProductNameCustomSelect = (props: any) => {
    return <Select style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} css="" className="mt-1" defaultValue={props.curProduct} onChange={props.onProductNameChange}>
        {props.products.filter((prod: any) => !prod.name.includes("Sản phẩm mặc định")).map((prod: any, key: any) => {
            return <option key={key} value={prod.id}>{prod.name}</option>
        })}
    </Select>
}

export default ImportOrderForm
