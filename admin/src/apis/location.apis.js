import axiosClient from "../configs/axios.config";

const LocationApis = {
getLocationApi: ({ page = 1, limit = 10 } = {}) => {
  return axiosClient.get(`/location?page=${page}&limit=${limit}`);
},
  addLocationApi: (payload) => {
    return axiosClient.post("/location", payload);
  },
  editLocationApi: (payload, id) => {
    return axiosClient.patch(`/location/${id}`, payload);
  },
  deleteLocationApi: (id) => {
    return axiosClient.delete(`/location/${id}`);
  },
};

export default LocationApis;
