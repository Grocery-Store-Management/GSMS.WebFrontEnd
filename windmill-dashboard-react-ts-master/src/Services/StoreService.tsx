import axios from "axios"
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";

export const getStoreList = async () => {
    const { data } = await axios.get(baseApiUrl + "api/Store", {
        ...GetApiConfig()
    });
    return data;
}

