import LocationApis from "../apis/location.apis";

const { addLocationApi, deleteLocationApi, editLocationApi, getLocationApi } = LocationApis;

const LocationServices = {
processGetLocation: async ({ page = 1, limit = 10 } = {}) => {
  const response = await getLocationApi({ page, limit });
  return response?.data;
},
  processAddLocation: async (payload) => {
    const response = await addLocationApi(payload);
    return response?.data;
  },
  processEditLocation: async (payload, id) => {
    const response = await editLocationApi(payload, id);
    return response?.data;
  },
  processDeleteLocation: async (id) => {
    const response = await deleteLocationApi(id);
    return response?.data;
  },
};

export default LocationServices;
