import axios from "axios"
import { IReceipt } from "../models/Receipt";
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";
export const getReceiptList = async () => {
    const { data } = await axios.get(baseApiUrl + "api/Receipt", {
        ...GetApiConfig()
    });
    return data;
}

export const getReceiptDetailList = async () => {
    const { data } = await axios.get(baseApiUrl + "api/ReceiptDetail", {
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