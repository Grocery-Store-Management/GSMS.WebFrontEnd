import axios from "axios"
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";

export const getStoreList = async () => {
    const { data } = await axios.get(baseApiUrl + "stores", {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}

