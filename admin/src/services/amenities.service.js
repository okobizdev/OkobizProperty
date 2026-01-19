import AminitiesApi from "../apis/aminities.apis";

const {
    getAminityApi, addAminityApi,
    updateAminityApi, deleteAminityApi } = AminitiesApi;

const AmenityServies = {
    processGetAminity: async () => {
        try {
            const response = await getAminityApi();
            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processGetCategory");
            }
        }
    },

    processAddAminity: async (payload) => {
        try {
            const response = await addAminityApi(payload);
            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processAddBanner");
            }
        }
    },
    processUpdateAminity: async (id, payload) => {
        try {
            const response = await updateAminityApi(id, payload);
            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processUpdateCategory");
            }
        }
    },

    processDeleteAminity: async (id) => {
        try {
            const response = await deleteAminityApi(id);

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

export default AmenityServies;
