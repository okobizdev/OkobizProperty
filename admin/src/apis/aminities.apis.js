import axiosClient from "../configs/axios.config";

const AminitiesApi = {
    getAminityApi: () => {
        return axiosClient.get("/amenities");
    },

    addAminityApi: (payload) => {
        return axiosClient.post("/amenities", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    updateAminityApi: (id, payload) => {
        return axiosClient.put(`/amenities/${id}`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    },

    deleteAminityApi: (id) => {
        return axiosClient.delete(`/amenities/${id}`);
    },
};

export default AminitiesApi;