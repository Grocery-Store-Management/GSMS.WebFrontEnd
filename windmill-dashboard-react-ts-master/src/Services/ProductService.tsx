import axios from "axios"
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";
export const getProductList = async () => {
    const { data } = await axios.get(baseApiUrl + "api/Product", {
        ...GetApiConfig()
    });
    return data;
}
export const addProduct = async (product: any) => {
    const { data } = await axios.post(baseApiUrl + "api/Product/", product, {
        ...GetApiConfig()
    });
    return data;
}
export const addProductDetail = async (productDetail: any) => {
    const { data } = await axios.post(baseApiUrl + "api/ProductDetail/", productDetail, {
        ...GetApiConfig()
    });
    return data;
}
export const updateProduct = async (product: any) => {
    const { data } = await axios.put(baseApiUrl + "api/Product/" + product.id, product, {
        ...GetApiConfig()
    });
    return data;
}
export const updateProductDetail = async (productDetail: any) => {
    const { data } = await axios.put(baseApiUrl + "api/ProductDetail/" + productDetail.id, productDetail, {
        ...GetApiConfig()
    });
    return data;
}

export const deleteProduct = async (product: any) => {
    const { data } = await axios.delete(baseApiUrl + "api/Product/" + product.id, {
        ...GetApiConfig()
    });
    return data;
}

export const getProductDetaiList = async () => {
    const { data } = await axios.get(baseApiUrl + "api/ProductDetail", {
        ...GetApiConfig()
    });
    return data;
}