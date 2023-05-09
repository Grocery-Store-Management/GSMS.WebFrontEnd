export const baseApiUrl = "https://localhost:44387/api/v1.0/";
export const GetApiConfig = () => {
    return {
        headers:{
            "Authorization":"Bearer " + localStorage.getItem("token"),
            "content-type":"application/json;charset=utf-8"
        },
    }
}