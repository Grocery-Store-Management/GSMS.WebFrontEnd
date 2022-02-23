import axios from "axios"
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";
export const getImportOrderList = async () => {
    const { data } = await axios.get(baseApiUrl + "import-orders", {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}

export const getImportOrderDetailList = async () => {
    const { data } = await axios.get(baseApiUrl + "import-order-details", {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}

export const createImportOrder = async (importOrder : any) => {
    const { data } = await axios.post(baseApiUrl + "import-orders", importOrder, {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}

export const removeImportOrder = async (orderId : any) => {
    const { data } = await axios.delete(baseApiUrl + "import-orders/" + orderId, {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}

