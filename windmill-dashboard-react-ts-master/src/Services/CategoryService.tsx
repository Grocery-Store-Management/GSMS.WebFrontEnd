import axios from "axios"
import { GetApiConfig, baseApiUrl } from "../utils/ApiUtility/ApiConfig";
export const getCategoryList = async () => {
    const { data } = await axios.get(baseApiUrl + "Category", {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}

export const addCategory = async (category: any) => {
    const { data } = await axios.post(baseApiUrl + "Category/" , category, {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}

export const updateCategory = async (category: any) => {
    const { data } = await axios.put(baseApiUrl + "Category/" + category.id, category, {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}

export const deleteCategory = async (category: any) => {
    const { data } = await axios.delete(baseApiUrl + "Category/" + category.id, {
        ...GetApiConfig(), timeout: 10000
    });
    return data;
}

