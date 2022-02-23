import axios from "axios"
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";
export const getImportOrderList = async () => {
    const { data } = await axios.get(baseApiUrl + "api/ImportOrder", {
        ...GetApiConfig()
    });
    return data;
}

export const getImportOrderDetailList = async () => {
    const { data } = await axios.get(baseApiUrl + "api/ImportOrderDetail", {
        ...GetApiConfig()
    });
    return data;
}

export const createImportOrder = async (importOrder : any) => {
    const { data } = await axios.post(baseApiUrl + "api/ImportOrder", importOrder, {
        ...GetApiConfig()
    });
    return data;
}

export const removeImportOrder = async (orderId : any) => {
    const { data } = await axios.delete(baseApiUrl + "api/ImportOrder/" + orderId, {
        ...GetApiConfig()
    });
    return data;
}

