import HostGuideApi from "../apis/hostguide.apis";

const { getHostGuideApi, addHostGuideApi, editHostGuideApi, deleteHostGuideApi } = HostGuideApi

const HostingGuideServices = {
    processGetHostingGuide: async () => {
        try {
            const response = await getHostGuideApi();
            // If API wraps the payload under response.data.data, return that; otherwise return response.data
            return response?.data?.data ?? response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processGetHostingGuide");
            }
        }
    },



    processAddHostingGuide: async (payload) => {
        try {
            const response = await addHostGuideApi(payload);
            return response?.data?.data ?? response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processAddHostingGuide");
            }
        }
    },

    processEditHostingGuide: async (id, payload) => {
        try {
            const response = await editHostGuideApi(id, payload);
            return response?.data?.data ?? response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processEditHostingGuide");
            }
        }
    },

    processDeleteHostingGuide: async (id) => {
        try {
            const response = await deleteHostGuideApi(id);
            return response?.data?.data ?? response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processDeleteHostingGuide");
            }
        }
    },
};

export default HostingGuideServices;
