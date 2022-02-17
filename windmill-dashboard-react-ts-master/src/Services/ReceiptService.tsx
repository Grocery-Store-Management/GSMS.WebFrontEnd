import axios from "axios"
import { IReceipt } from "../models/Receipt";
import { GetApiConfig } from "../utils/ApiUtility/ApiConfig";

const baseApiUrl = "https://gsms-api.azurewebsites.net/";
export const getProductList = async () => {
    const { data } = await axios.get(baseApiUrl + "api/Product", {
        ...GetApiConfig()
    });
    return data;
}

export const createNewReceipt = async (receipt : IReceipt) => {
    const { data } = await axios.post(baseApiUrl + "api/Receipt", receipt, {
        ...GetApiConfig()
    });
    return data;
}