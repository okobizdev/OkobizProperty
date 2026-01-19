import axiosClient from "../configs/axios.config";

const AmenitiesConfigApi = {

    addAminitiesConfigApi: (payload) => {
        return axiosClient.post("/amenities-config", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },


    getAminitiesConfigApi: () => {
        return axiosClient.get("/amenities-config");
    },


    getAminitiesConfigByIdApi: (id) => {
        return axiosClient.get(`/amenities-config/${id}`);
    },


    getAminitiesConfigBySubcategoryApi: (subcategoryId) => {
        return axiosClient.get(`/amenities-config/subcategory/${subcategoryId}`);
    },


    updateAminitiesConfigApi: (id, payload) => {
        return axiosClient.put(`/amenities-config/${id}`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },


    deleteAminitiesConfigApi: (id) => {
        return axiosClient.delete(`/amenities-config/${id}`);
    },
};

export default AmenitiesConfigApi;
