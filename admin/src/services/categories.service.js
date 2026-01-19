import categoriesApi from "../apis/categories.apis";

const { getCategoryApi, addCategoryApi, deleteCategoryApi, updateCategoryApi } = categoriesApi;

const CategoryService = {
    processGetCategory: async () => {
        try {
            const response = await getCategoryApi();
            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processGetCategory");
            }
        }
    },

    processAddCategory: async (payload) => {
        try {
            const response = await addCategoryApi(payload);
            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processAddBanner");
            }
        }
    },
    processUpdateCategory: async (id, payload) => {
        try {
            const response = await updateCategoryApi(id, payload);
            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processUpdateCategory");
            }
        }
    },

    processDeleteCategory: async (id) => {
        try {
            const response = await deleteCategoryApi(id);

            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processDeleteBanner");
            }
        }
    },
};

export default CategoryService;
