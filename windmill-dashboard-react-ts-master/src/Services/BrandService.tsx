import axios from "axios"
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";
export const getBrandList = async () => {
    const { data } = await axios.get(baseApiUrl + "Brand", {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}