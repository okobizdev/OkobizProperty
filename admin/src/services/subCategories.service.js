import subCategoriesApi from "../apis/subCategories.apis";


const { getSubCategoryApi, addSubCategoryApi, updateSubCategoryApi, deleteSubCategoryApi } = subCategoriesApi

const subCategoryService = {
    processGetSubCategory: async () => {
        try {
            const response = await getSubCategoryApi();
            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processGetCategory");
            }
        }
    },

    processAddSubCategory: async (payload) => {
        try {
            const response = await addSubCategoryApi(payload);
            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processAddBanner");
            }
        }
    },
    processUpdateSubCategory: async (id, payload) => {
        try {
            const response = await updateSubCategoryApi(id, payload);
            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processUpdateCategory");
            }
        }
    },

    processDeleteSubCategory: async (id) => {
        try {
            const response = await deleteSubCategoryApi(id);

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

export default subCategoryService;
