import axios from "axios"
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";
export const getCategoryList = async () => {
    const { data } = await axios.get(baseApiUrl + "categories", {
        ...GetApiConfig(), timeout: 60000
    });
    return data;
}

export const addCategory = async (category: any) => {
    const { data } = await axios.post(baseApiUrl + "categories/" , category, {
        ...GetApiConfig(), timeout: 60000
    });
    return data;
}

export const updateCategory = async (category: any) => {
    const { data } = await axios.put(baseApiUrl + "categories/" + category.id, category, {
        ...GetApiConfig(), timeout: 60000
    });
    return data;
}

export const deleteCategory = async (category: any) => {
    const { data } = await axios.delete(baseApiUrl + "categories/" + category.id, {
        ...GetApiConfig(), timeout: 60000
    });
    return data;
}

