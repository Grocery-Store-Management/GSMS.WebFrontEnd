import axios from "axios"
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";
export const getProductList = async () => {
    const { data } = await axios.get(baseApiUrl + "Product", {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}
export const addProduct = async (product: any) => {
    const { data } = await axios.post(baseApiUrl + "Product/", product, {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}
export const addProductDetail = async (productDetail: any) => {
    const { data } = await axios.post(baseApiUrl + "ProductDetail/", productDetail, {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}
export const updateProduct = async (product: any) => {
    const { data } = await axios.put(baseApiUrl + "Product/" + product.id, product, {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}
export const updateProductDetail = async (productDetail: any) => {
    const { data } = await axios.put(baseApiUrl + "ProductDetail/" + productDetail.id, productDetail, {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}

export const deleteProduct = async (product: any) => {
    const { data } = await axios.delete(baseApiUrl + "Product/" + product.id, {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}

export const getProductDetaiList = async () => {
    const { data } = await axios.get(baseApiUrl + "ProductDetail", {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}