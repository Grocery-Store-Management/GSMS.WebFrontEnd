import axios from "axios"
import { GetApiConfig } from "../utils/ApiUtility/ApiConfig";

const baseApiUrl = "https://gsms-api.azurewebsites.net/";
export const getCategoryList = async () => {
    const { data } = await axios.get(baseApiUrl + "api/Category", {
        ...GetApiConfig()
    });
    return data;
}

