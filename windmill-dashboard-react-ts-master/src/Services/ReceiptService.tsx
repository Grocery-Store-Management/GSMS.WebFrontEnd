import axios from "axios"
import { IReceipt } from "../models/Receipt";
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";
export const getReceiptList = async () => {
    const { data } = await axios.get(baseApiUrl + "Receipt", {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}

export const getReceiptDetailList = async () => {
    const { data } = await axios.get(baseApiUrl + "ReceiptDetail", {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}


export const createNewReceipt = async (receipt : IReceipt) => {
    const { data } = await axios.post(baseApiUrl + "Receipt", receipt, {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}