import axios from "axios"
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";
export const getProductList = async () => {
    const { data } = await axios.get(baseApiUrl + "products?page=0", {
        ...GetApiConfig(), timeout: 60000
    });
    return data;
}
export const addProduct = async (product: any) => {
    const { data } = await axios.post(baseApiUrl + "products/", product, {
        ...GetApiConfig(), timeout: 60000
    });
    return data;
}
export const addProductDetail = async (productDetail: any) => {
    const { data } = await axios.post(baseApiUrl + "product-details/", productDetail, {
        ...GetApiConfig(), timeout: 60000
    });
    return data;
}
export const updateProduct = async (product: any) => {
    const { data } = await axios.put(baseApiUrl + "products/" + product.id, product, {
        ...GetApiConfig(), timeout: 60000
    });
    return data;
}
export const updateProductDetail = async (productDetail: any) => {
    const { data } = await axios.put(baseApiUrl + "product-details/" + productDetail.id, productDetail, {
        ...GetApiConfig(), timeout: 60000
    });
    return data;
}

export const deleteProduct = async (product: any) => {
    const { data } = await axios.delete(baseApiUrl + "products/" + product.id, {
        ...GetApiConfig(), timeout: 60000
    });
    return data;
}

export const getProductDetaiList = async () => {
    const { data } = await axios.get(baseApiUrl + "product-details?page=0", {
        ...GetApiConfig(), timeout: 60000
    });
    return data;
}