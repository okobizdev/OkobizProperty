import propertyApis from "../apis/properties.apis";



const { getAllListedPropertyApi, deletePropertyApi, changePropertyStatusApi, updatePropertyApi } = propertyApis


const PropertyService = {

    ProcessGetListedProperty: async (listingType, page = 1, pageSize = 10, filters = {}) => {
    try {
        const response = await getAllListedPropertyApi(listingType, {
            page,
            limit: pageSize,
            ...filters
        });
        return response?.data;
    } catch (error) {
        console.error("Error fetching properties:", error);
        return null;
    }
},
    ProcessDeleteProperty: async (id) => {
        try {
            const response = await deletePropertyApi(id);
            return response?.data;
        } catch (error) {
            console.error("Error deleting property:", error);
            return null;
        }
    },
    ProcessChangePropertyStatus: async (id, status) => {
        try {
            const response = await changePropertyStatusApi(id, status);
            return response?.data;
        } catch (error) {
            console.error("Error changing property status:", error);
            return null;
        }
    },
    ProcessUpdateProperty: async (id, payload) => {
        try {
            const response = await updatePropertyApi(id, payload);
            return response?.data;
        } catch (error) {
            console.error("Error updating property:", error);
            return null;
        }
    },
    ProcessUpdatePropertyFeaturedStatus: async (id, isFeatured) => {
        try {
            const response = await propertyApis.updatePropertFeaturedStatusApi(id, isFeatured);
            return response?.data;
        } catch (error) {
            if (error?.response?.data) {
                return error.response.data;
            }
            console.error("Error updating property featured status:", error);
            return null;
        }
    },
};

export default PropertyService;
