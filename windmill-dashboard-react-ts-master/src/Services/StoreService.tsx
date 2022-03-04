import axios from "axios"
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";

export const getStoreList = async () => {
    const { data } = await axios.get(baseApiUrl + "stores", {
        ...GetApiConfig(), timeout: 60000
    });
    return data;
}

