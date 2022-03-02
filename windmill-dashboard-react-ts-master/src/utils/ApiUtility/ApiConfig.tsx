export const baseApiUrl = "https://gsms-api.azurewebsites.net/api/v1.0/";
export const GetApiConfig = () => {
    return {
        headers:{
            "Authorization":"Bearer " + localStorage.getItem("token"),
            "content-type":"application/json;charset=utf-8"
        },
    }
}