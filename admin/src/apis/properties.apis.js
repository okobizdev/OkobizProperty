import axiosClient from "../configs/axios.config";

const propertyApis = {

    getAllListedPropertyApi: (listingType, additionalParams = {}) => {
        const params = { ...additionalParams };
        if (listingType) params.listingType = listingType;
        return axiosClient.get("/properties", {
            params,
        });
    },
    deletePropertyApi: (id) => axiosClient.delete(`/properties/${id}`),
    changePropertyStatusApi: (id, status) => {
        return axiosClient.patch(`/properties/${id}/publish-status`, { status });
    },
    updatePropertyApi: (id, payload) => {
        return axiosClient.put(`/properties/${id}`, payload);
    },
    updatePropertFeaturedStatusApi: (id, isFeatured) => {
        return axiosClient.patch(`/properties/${id}/featured-status`, { isFeatured });
    }

};

export default propertyApis;

