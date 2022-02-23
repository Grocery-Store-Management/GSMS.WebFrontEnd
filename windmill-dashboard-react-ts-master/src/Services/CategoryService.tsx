import axios from "axios"
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";
export const getCategoryList = async () => {
    const { data } = await axios.get(baseApiUrl + "api/Category", {
        ...GetApiConfig()
    });
    return data;
}

export const addCategory = async (category: any) => {
    const { data } = await axios.post(baseApiUrl + "api/Category/" , category, {
        ...GetApiConfig()
    });
    return data;
}

export const updateCategory = async (category: any) => {
    const { data } = await axios.put(baseApiUrl + "api/Category/" + category.id, category, {
        ...GetApiConfig()
    });
    return data;
}

export const deleteCategory = async (category: any) => {
    const { data } = await axios.delete(baseApiUrl + "api/Category/" + category.id, {
        ...GetApiConfig()
    });
    return data;
}

