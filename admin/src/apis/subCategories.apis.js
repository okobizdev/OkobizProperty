import axiosClient from "../configs/axios.config";

const subCategoriesApi = {
    getSubCategoryApi: () => {
        return axiosClient.get("/subcategories");
    },

    addSubCategoryApi: (payload) => {
        return axiosClient.post("/subcategories", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    updateSubCategoryApi: (id, payload) => {
        return axiosClient.put(`/subcategories/${id}`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    },

    deleteSubCategoryApi: (id) => {
        return axiosClient.delete(`/subcategories/${id}`);
    },
};

export default subCategoriesApi;