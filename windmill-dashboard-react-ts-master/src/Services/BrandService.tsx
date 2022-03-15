import axios from "axios"
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";
export const getBrandList = async () => {
    const { data } = await axios.get(baseApiUrl + "brands?page=0", {
        ...GetApiConfig(), timeout: 60000
    });
    return data;
}