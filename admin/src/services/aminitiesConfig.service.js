import AmenitiesConfigApi from "../apis/aminitiesConfig.apis";

const {
    addAminitiesConfigApi,
    getAminitiesConfigApi,
    getAminitiesConfigByIdApi,
    getAminitiesConfigBySubcategoryApi,
    updateAminitiesConfigApi,
    deleteAminitiesConfigApi
} = AmenitiesConfigApi;

const AminitiesConfigServices = {
    processAddConfiguration: async (payload) => {
        try {
            const response = await addAminitiesConfigApi(payload);
            return response?.data;
        } catch (error) {
            throw error instanceof Error ? error : new Error("Unknown error occurred in processAddConfiguration");
        }
    },

    processGetConfiguration: async () => {
        try {
            const response = await getAminitiesConfigApi();
            return response?.data;
        } catch (error) {
            throw error instanceof Error ? error : new Error("Unknown error occurred in processGetConfiguration");
        }
    },

    processGetConfigurationById: async (id) => {
        try {
            const response = await getAminitiesConfigByIdApi(id);
            return response?.data;
        } catch (error) {
            throw error instanceof Error ? error : new Error("Unknown error occurred in processGetConfigurationById");
        }
    },

    processGetConfigurationBySubcategory: async (subcategoryId) => {
        try {
            const response = await getAminitiesConfigBySubcategoryApi(subcategoryId);
            return response?.data;
        } catch (error) {
            throw error instanceof Error ? error : new Error("Unknown error occurred in processGetConfigurationBySubcategory");
        }
    },

    processUpdateConfiguration: async (id, payload) => {
        try {
            const response = await updateAminitiesConfigApi(id, payload);
            return response?.data;
        } catch (error) {
            throw error instanceof Error ? error : new Error("Unknown error occurred in processUpdateConfiguration");
        }
    },

    processDeleteConfiguration: async (id) => {
        try {
            const response = await deleteAminitiesConfigApi(id);
            return response?.data;
        } catch (error) {
            throw error instanceof Error ? error : new Error("Unknown error occurred in processDeleteConfiguration");
        }
    },
};

export default AminitiesConfigServices;
