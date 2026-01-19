import axiosClient from "../configs/axios.config";

const categoriesApi = {
    getCategoryApi: () => {
        return axiosClient.get("/categories");
    },

    addCategoryApi: (payload) => {
        return axiosClient.post("/categories", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    updateCategoryApi: (id, payload) => {
        return axiosClient.put(`/categories/${id}`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    },

    deleteCategoryApi: (id) => {
        return axiosClient.delete(`/categories/${id}`);
    },
};

export default categoriesApi;